/**
 * @file src/store/walking-pad.store.ts
 * Simplified store with clear session management
 */

import { create } from 'zustand'
import { WalkingPadMode } from '@/lib/types'

interface SessionStats {
	distance: number
	steps: number
	calories: number
	duration: string
	currentSpeed: number
}

interface WalkingPadState {
	// Status
	isActive: boolean
	isPolling: boolean
	mode: WalkingPadMode
	stats: SessionStats
	error: Error | null

	// Actions
	setActive: (isActive: boolean) => void
	setPolling: (isPolling: boolean) => void
	setStats: (stats: Partial<SessionStats>) => void
	setMode: (mode: WalkingPadMode) => void
	setError: (error: Error | null) => void
	resetSession: () => void
}

const DEFAULT_STATS: SessionStats = {
	distance: 0,
	steps: 0,
	calories: 0,
	duration: '00:00',
	currentSpeed: 0,
}

export const useWalkingPadStore = create<WalkingPadState>(set => ({
	// Initial state
	isActive: false,
	isPolling: false,
	mode: WalkingPadMode.STANDBY,
	stats: DEFAULT_STATS,
	error: null,

	// Actions
	setActive: isActive => set({ isActive }),
	setPolling: isPolling => set({ isPolling }),
	setStats: stats =>
		set(state => ({
			stats: { ...state.stats, ...stats },
		})),
	setMode: mode => set({ mode }),
	setError: error => set({ error }),
	resetSession: () =>
		set({
			isActive: false,
			isPolling: false,
			mode: WalkingPadMode.STANDBY,
			stats: DEFAULT_STATS,
			error: null,
		}),
}))
