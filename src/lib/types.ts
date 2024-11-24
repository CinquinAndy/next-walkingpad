/**
 * @file src/lib/types.ts
 * Core type definitions for the WalkingPad application
 */

/**
 * WalkingPad operational modes
 */
export enum WalkingPadMode {
	STANDBY = 'standby',
	MANUAL = 'manual',
	AUTO = 'auto',
}

/**
 * Belt operational states
 */
export enum BeltState {
	IDLE = 'idle',
	RUNNING = 'running',
	STANDBY = 'standby',
	STARTING = 'starting',
}

/**
 * Pad status interface
 */
export interface PadStatus {
	isConnected: boolean
	mode: WalkingPadMode
	beltState: BeltState
	currentSpeed: number
	distance: number
	steps: number
	calories: number
	duration: string
	startTime?: Date
}

/**
 * Mode display configuration type
 */
export interface ModeConfig {
	icon: React.ReactNode
	label: string
	description: string
}

/**
 * Stats configuration interface
 */
export interface StatConfig {
	key: keyof Pick<PadStatus, 'distance' | 'steps' | 'calories' | 'duration'>
	title: string
	unit?: string
	format: (value: any) => string
}

/**
 * Error response type
 */
export interface ApiError {
	message: string
	details?: string
}
