/**
 * @file src/store/walking-pad.store.ts
 * Global state management for WalkingPad using Zustand
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { WalkingPadMode } from '@/lib/types'

/**
 * Types for exercise targets and modes
 */
export type TargetType = 'distance' | 'steps' | 'calories' | 'duration'
export type PadMode = 'manual' | 'automatic'

/**
 * Exercise target configuration
 */
export interface ExerciseTarget {
	type: TargetType
	value: number
	unit: string
}

/**
 * Current exercise statistics
 */
export interface ExerciseStats {
	/** Distance covered in kilometers */
	distance: number
	/** Total steps taken */
	steps: number
	/** Calories burned */
	calories: number
	/** Exercise duration in HH:mm format */
	duration: string
	/** Current speed in km/h */
	currentSpeed: number
	/** Start time of the session */
	startTime?: Date
}

/**
 * Activity data point for charts
 */
export interface ActivityDataPoint {
	time: string
	steps: number
	calories: number
	activity: number
}

/**
 * Walking pad state interface
 */
interface WalkingPadState {
	// Status
	isRunning: boolean
	mode: WalkingPadMode
	stats: ExerciseStats
	currentTarget: ExerciseTarget | null
	activityData: ActivityDataPoint[]
	isLoading: boolean
	error: string | null

	// Actions
	setRunning: (isRunning: boolean) => void
	setMode: (mode: WalkingPadMode) => Promise<void>
	setStats: (stats: Partial<ExerciseStats>) => void
	setTarget: (target: ExerciseTarget | null) => void
	updateActivityData: (data: ActivityDataPoint[]) => void
	setError: (error: string | null) => void
	setLoading: (isLoading: boolean) => void
	resetState: () => void
}

/**
 * Default values
 */
const defaultStats: ExerciseStats = {
	distance: 0,
	steps: 0,
	calories: 0,
	duration: '00:00',
	currentSpeed: 0,
}

const defaultActivityData: ActivityDataPoint[] = [
	{ time: '6AM', steps: 1000, calories: 100, activity: 20 },
	{ time: '9AM', steps: 3000, calories: 250, activity: 45 },
	{ time: '12PM', steps: 5000, calories: 400, activity: 60 },
	{ time: '3PM', steps: 7000, calories: 550, activity: 80 },
	{ time: '6PM', steps: 8745, calories: 700, activity: 90 },
]

/**
 * Create the store with devtools middleware
 */
export const useWalkingPadStore = create<WalkingPadState>()(
	devtools(
		set => ({
			// Initial state
			isRunning: false,
			mode: WalkingPadMode.STANDBY,
			stats: defaultStats,
			currentTarget: null,
			activityData: defaultActivityData,
			isLoading: false,
			error: null,

			// Actions
			setRunning: isRunning => set({ isRunning }),

			// Actions
			setMode: async mode => {
				try {
					// TODO: Add API call here
					set({ mode })
				} catch (error) {
					console.error('Failed to set mode:', error)
					throw error
				}
			},

			setStats: newStats =>
				set(state => ({
					stats: { ...state.stats, ...newStats },
				})),

			setTarget: target => set({ currentTarget: target }),

			updateActivityData: data => set({ activityData: data }),

			setError: error => set({ error }),

			setLoading: isLoading => set({ isLoading }),

			resetState: () =>
				set({
					isRunning: false,
					mode: WalkingPadMode.STANDBY,
					stats: defaultStats,
					currentTarget: null,
					activityData: defaultActivityData,
					error: null,
					isLoading: false,
				}),
		}),
		{
			name: 'walking-pad-store',
		}
	)
)
