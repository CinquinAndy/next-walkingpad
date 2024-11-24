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
 * Mode display configuration type
 */
export interface ModeConfig {
	icon: React.ReactNode
	label: string
	description: string
}

/**
 * Exercise session data structure
 */
export interface ExerciseSession {
	id: string
	date: Date
	duration: number // in seconds
	distance: number // in kilometers
	steps: number
	calories: number
	avgSpeed: number // in km/h
}

/**
 * User profile data structure
 */
export interface UserProfile {
	firstName: string
	lastName: string
	age: number
	height: number // in cm
	weight: number // in kg
	profilePicture?: string
}

/**
 * Daily goals configuration
 */
export interface DailyGoals {
	steps: number
	distance: number // in kilometers
	duration: number // in minutes
	calories: number
}

/**
 * WalkingPad device status
 */
export interface PadStatus {
	isConnected: boolean
	mode: WalkingPadMode
	currentSpeed: number
	currentSession?: {
		startTime: Date
		duration: number
		distance: number
		steps: number
		calories: number
	}
}

/**
 * Activity level for calendar visualization
 */
export enum ActivityLevel {
	NONE = 0,
	LOW = 1,
	MEDIUM = 2,
	HIGH = 3,
	VERY_HIGH = 4,
}

/**
 * Calculates BMI based on height and weight
 * @param height Height in centimeters
 * @param weight Weight in kilograms
 * @returns BMI value
 */
export const calculateBMI = (height: number, weight: number): number => {
	const heightInMeters = height / 100
	return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

/**
 * Estimates calories burned based on weight, duration, and speed
 * @param weight Weight in kilograms
 * @param durationMinutes Duration in minutes
 * @param speedKmH Speed in kilometers per hour
 * @returns Estimated calories burned
 */
export const estimateCaloriesBurned = (
	weight: number,
	durationMinutes: number,
	speedKmH: number
): number => {
	// MET values based on walking speed
	const getMET = (speed: number): number => {
		if (speed < 3.2) return 2.0
		if (speed < 4.0) return 2.5
		if (speed < 4.8) return 3.0
		if (speed < 5.6) return 3.5
		return 4.0
	}

	const met = getMET(speedKmH)
	const caloriesPerMinute = (met * 3.5 * weight) / 200
	return Math.round(caloriesPerMinute * durationMinutes)
}
