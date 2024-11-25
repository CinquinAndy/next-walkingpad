/**
 * @file src/hooks/use-session-polling.ts
 * Custom hook for managing session polling
 */
import { useState, useEffect, useCallback } from 'react'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { useToast } from '@/hooks/use-toast'
import { WalkingPadMode } from '@/lib/types'

const API_BASE = 'http://localhost:5678/api'
const POLLING_INTERVAL = 1000 // 1 second

interface UseSessionPollingProps {
	enabled?: boolean
}

export function useSessionPolling({
	enabled = false,
}: UseSessionPollingProps = {}) {
	const { toast } = useToast()
	const { setStats, setMode, setError } = useWalkingPadStore()
	const [isPolling, setIsPolling] = useState(false)
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

	/**
	 * Fetch current status
	 */
	const fetchStatus = useCallback(async () => {
		try {
			const response = await fetch(`${API_BASE}/device/status`)
			if (!response.ok) throw new Error('Failed to fetch status')

			const data = await response.json()

			setStats({
				distance: data.distance || 0,
				steps: data.steps || 0,
				calories: data.calories || 0,
				duration: data.time ? formatDuration(data.time) : '00:00',
				currentSpeed: data.speed || 0,
			})

			setMode(data.mode as WalkingPadMode)
			setLastUpdate(new Date())
			setError(null)
		} catch (error) {
			console.error('Status fetch error:', error)
			// Optionally show toast for persistent errors
			if (!lastUpdate || Date.now() - lastUpdate.getTime() > 10000) {
				toast({
					title: 'Connection Issue',
					description: 'Having trouble reaching the device',
					variant: 'destructive',
				})
			}
		}
	}, [setStats, setMode, setError, toast, lastUpdate])

	/**
	 * Start/Stop polling
	 */
	const togglePolling = useCallback(
		(state: boolean) => {
			setIsPolling(state)
			if (state) {
				fetchStatus() // Immediate first fetch
			}
		},
		[fetchStatus]
	)

	/**
	 * Handle polling lifecycle
	 */
	useEffect(() => {
		if (!enabled || !isPolling) return

		const interval = setInterval(fetchStatus, POLLING_INTERVAL)
		return () => clearInterval(interval)
	}, [enabled, isPolling, fetchStatus])

	// Stop polling on unmount
	useEffect(() => {
		return () => setIsPolling(false)
	}, [])

	return {
		isPolling,
		lastUpdate,
		togglePolling,
		fetchStatus,
	}
}

/**
 * Format duration in seconds to MM:SS
 */
function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
