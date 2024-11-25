/**
 * @file src/hooks/use-exercise-data.ts
 * Enhanced exercise data hook with better error handling
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { walkingPadService } from '@/services/walking-pad.service'
import { WalkingPadApiError } from '@/services/walking-pad.service'

const POLLING_INTERVAL = 1000
const RETRY_DELAY = 5000

function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	return hours > 0
		? `${hours}:${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
		: `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
}

export function useExerciseData() {
	const { toast } = useToast()
	const {
		setStats,
		setMode,
		setRunning,
		isRunning,
		setError: setStoreError,
	} = useWalkingPadStore()

	const [isLoading, setIsLoading] = useState(false)
	const [lastSuccessfulFetch, setLastSuccessfulFetch] = useState<Date | null>(
		null
	)
	const [connectionAttempts, setConnectionAttempts] = useState(0)
	const [isReconnecting, setIsReconnecting] = useState(false)

	/**
	 * Handle connection errors
	 */
	const handleConnectionError = useCallback(
		(error: Error) => {
			console.error('Connection error:', error)
			setConnectionAttempts(prev => prev + 1)

			// Show toast only on first error
			if (connectionAttempts === 0) {
				toast({
					title: 'Connection Lost',
					description: 'Attempting to reconnect to WalkingPad...',
					variant: 'destructive',
				})
			}

			// Set reconnecting state
			setIsReconnecting(true)
		},
		[connectionAttempts, toast, setStoreError]
	)

	/**
	 * Fetch current status from device
	 */
	const fetchStatus = useCallback(async () => {
		try {
			const status = await walkingPadService.getStatus()

			if (!status.isConnected) {
				handleConnectionError(new Error('Device disconnected'))
				return
			}

			// Clear error state and update last successful fetch
			setStoreError(null)
			setConnectionAttempts(0)
			setIsReconnecting(false)
			setLastSuccessfulFetch(new Date())

			// Update store with latest stats
			setStats({
				distance: status.distance,
				steps: status.steps,
				calories: Math.round(status.distance * 60), // Simple calorie estimation
				duration: formatDuration(parseInt(status.duration) || 0),
				currentSpeed: status.currentSpeed,
			})

			setMode(status.mode)
			setRunning(status.beltState === 'running')
		} catch (error) {
			handleConnectionError(error as Error)
		}
	}, [setStats, setMode, setRunning, setStoreError, handleConnectionError])

	/**
	 * Start exercise session
	 */
	const startExercise = async () => {
		try {
			setIsLoading(true)
			await walkingPadService.startWalkSession()
			toast({
				title: 'Exercise Started',
				description: 'Your walking session has begun',
			})
		} catch (error) {
			if (error instanceof WalkingPadApiError) {
				toast({
					title: 'Failed to Start',
					description: error.message,
					variant: 'destructive',
				})
			}
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * End exercise session
	 */
	const endExercise = async () => {
		try {
			setIsLoading(true)
			await walkingPadService.finishWalk()
			await walkingPadService.saveSession()
			toast({
				title: 'Exercise Complete',
				description: 'Your session has been saved',
			})
		} catch (error) {
			if (error instanceof WalkingPadApiError) {
				toast({
					title: 'Failed to End',
					description: error.message,
					variant: 'destructive',
				})
			}
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Update speed with debounce
	 */
	const updateSpeed = async (speed: number) => {
		try {
			await walkingPadService.setSpeed(speed)
			await fetchStatus() // Refresh status after speed change
		} catch (error) {
			if (error instanceof WalkingPadApiError) {
				toast({
					title: 'Speed Update Failed',
					description: error.message,
					variant: 'destructive',
				})
			}
		}
	}

	/**
	 * Poll for status updates
	 */
	useEffect(() => {
		fetchStatus() // Initial fetch

		const interval = setInterval(
			() => {
				if (isReconnecting) {
					// Use exponential backoff for reconnection attempts
					const backoffDelay = Math.min(
						RETRY_DELAY * Math.pow(2, connectionAttempts),
						30000
					)
					setTimeout(fetchStatus, backoffDelay)
				} else if (isRunning) {
					fetchStatus()
				}
			},
			isReconnecting ? RETRY_DELAY : POLLING_INTERVAL
		)

		return () => clearInterval(interval)
	}, [isRunning, isReconnecting, connectionAttempts, fetchStatus])

	return {
		isLoading,
		isReconnecting,
		lastSuccessfulFetch,
		startExercise,
		endExercise,
		updateSpeed,
		reconnect: fetchStatus,
	}
}
