/**
 * @file src/hooks/use-walking-pad.ts
 * Custom hook for managing WalkingPad state and operations
 */

import { useState, useCallback, useEffect } from 'react'
import { BeltState, PadStatus, WalkingPadMode } from '@/lib/types'
import { walkingPadService } from '@/services/walking-pad.service'

interface UseWalkingPadReturn {
	// Status
	status: PadStatus | null
	isLoading: boolean
	error: Error | null

	// Control methods
	startWalk: () => Promise<void>
	stopWalk: () => Promise<void>
	setSpeed: (speed: number) => Promise<void>
	setMode: (mode: WalkingPadMode) => Promise<void>
	emergencyStop: () => Promise<void>
	calibrate: () => Promise<void>

	// Settings methods
	setPreferences: (preferences: {
		maxSpeed?: number
		startSpeed?: number
		sensitivity?: 1 | 2 | 3
		childLock?: boolean
		unitsMiles?: boolean
	}) => Promise<void>

	// Target methods
	setTarget: (target: { type: 0 | 1 | 2 | 3; value: number }) => Promise<void>
}

/**
 * Custom hook for managing WalkingPad operations
 * Provides status monitoring and control methods
 */
export function useWalkingPad(): UseWalkingPadReturn {
	const [status, setStatus] = useState<PadStatus | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	/**
	 * Fetch pad status
	 */
	const fetchStatus = useCallback(async () => {
		try {
			setIsLoading(true)
			const newStatus = await walkingPadService.getStatus()
			setStatus(newStatus)
			setError(null)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to fetch status'))
		} finally {
			setIsLoading(false)
		}
	}, [])

	/**
	 * Poll status periodically when active
	 */
	useEffect(() => {
		if (status?.beltState === BeltState.RUNNING) {
			const interval = setInterval(fetchStatus, 1000)
			return () => clearInterval(interval)
		}
	}, [status?.beltState, fetchStatus])

	/**
	 * Initial status fetch
	 */
	useEffect(() => {
		fetchStatus()
	}, [fetchStatus])

	/**
	 * Start walking session
	 */
	const startWalk = async () => {
		try {
			setIsLoading(true)
			await walkingPadService.startWalk()
			await fetchStatus()
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to start walk'))
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Stop walking session
	 */
	const stopWalk = async () => {
		try {
			setIsLoading(true)
			await walkingPadService.finishWalk()
			await fetchStatus()
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to stop walk'))
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Set walking speed
	 */
	const setSpeed = async (speed: number) => {
		try {
			setIsLoading(true)
			await walkingPadService.setSpeed(speed)
			await fetchStatus()
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to set speed'))
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Set pad mode
	 */
	const setMode = async (mode: WalkingPadMode) => {
		try {
			setIsLoading(true)
			await walkingPadService.setMode(mode)
			await fetchStatus()
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to set mode'))
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Emergency stop
	 */
	const emergencyStop = async () => {
		try {
			setIsLoading(true)
			await walkingPadService.stop()
			await fetchStatus()
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Emergency stop failed'))
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Set preferences
	 */
	const setPreferences = async (
		preferences: Parameters<UseWalkingPadReturn['setPreferences']>[0]
	) => {
		try {
			setIsLoading(true)
			await walkingPadService.setPreferences(preferences)
			await fetchStatus()
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error('Failed to set preferences')
			)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Set target
	 */
	const setTarget = async (
		target: Parameters<UseWalkingPadReturn['setTarget']>[0]
	) => {
		try {
			setIsLoading(true)
			await walkingPadService.setTarget(target)
			await fetchStatus()
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to set target'))
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	/**
	 * Calibrate pad
	 */
	const calibrate = async () => {
		try {
			setIsLoading(true)
			await walkingPadService.calibrate()
			await fetchStatus()
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Calibration failed'))
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return {
		status,
		isLoading,
		error,
		startWalk,
		stopWalk,
		setSpeed,
		setMode,
		emergencyStop,
		setPreferences,
		setTarget,
		calibrate,
	}
}
