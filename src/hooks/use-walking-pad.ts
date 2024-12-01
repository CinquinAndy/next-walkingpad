/**
 * @file src/hooks/use-walking-pad.ts
 * Simplified hook for WalkingPad management
 */

import { useEffect, useState } from 'react'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { useToast } from '@/hooks/use-toast'

const API_BASE = 'http://localhost:5678/api'
const POLL_INTERVAL = 1000 // 1 second

export function useWalkingPad() {
	const { toast } = useToast()
	const {
		isActive,
		isPolling,
		setActive,
		setPolling,
		setStats,
		setError,
		resetSession,
	} = useWalkingPadStore()

	const [isLoading, setIsLoading] = useState(false)

	/**
	 * Start a new exercise session
	 */
	const startSession = async () => {
		try {
			setIsLoading(true)

			// Start the walking pad
			const response = await fetch(`${API_BASE}/device/start`, {
				method: 'POST',
			})

			if (!response.ok) throw new Error('Failed to start session')

			setActive(true)

			toast({
				title: 'Session Started',
				description: 'Exercise session has begun',
			})
		} catch (error) {
			setError(error as Error)
			toast({
				title: 'Failed to Start',
				description: error instanceof Error ? error.message : 'Unknown error',
				variant: 'destructive',
			})
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * End current exercise session
	 */
	const endSession = async () => {
		try {
			setIsLoading(true)
			setPolling(false)

			// Stop the walking pad
			await fetch(`${API_BASE}/device/stop`, {
				method: 'POST',
			})

			// Save session data
			await fetch(`${API_BASE}/exercise/save`, {
				method: 'POST',
			})

			resetSession()

			toast({
				title: 'Session Ended',
				description: 'Exercise data has been saved',
			})
		} catch (error) {
			setError(error as Error)
			toast({
				title: 'Error',
				description: 'Failed to end session properly',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Poll for device status updates
	 */
	useEffect(() => {
		if (!isActive || !isPolling) return

		const pollStatus = async () => {
			try {
				const response = await fetch(`${API_BASE}/device/status`)
				if (!response.ok) throw new Error('Failed to fetch status')

				const data = await response.json()
				setStats({
					distance: data.distance || 0,
					steps: data.steps || 0,
					calories: data.calories || 0,
					duration: data.duration || '00:00',
					currentSpeed: data.speed || 0,
				})
			} catch (error) {
				console.error('Status fetch error:', error)
				// Don't set error state here to avoid UI disruption
			}
		}

		pollStatus() // Initial poll
		const interval = setInterval(pollStatus, POLL_INTERVAL)

		return () => {
			clearInterval(interval)
		}
	}, [isActive, isPolling, setStats])

	return {
		isLoading,
		startSession,
		endSession,
		setPolling,
	}
}
