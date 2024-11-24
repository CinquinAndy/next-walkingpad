/**
 * @file src/lib/services/walking-pad.service.ts
 * Service for interacting with the WalkingPad API
 */

import { ApiError, PadStatus, WalkingPadMode } from '@/lib/types'

/**
 * API Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5678'

/**
 * Error class for WalkingPad API related errors
 */
export class WalkingPadApiError extends Error {
	constructor(
		message: string,
		public statusCode?: number
	) {
		super(message)
		this.name = 'WalkingPadApiError'
	}
}

/**
 * API Response Types
 */
interface SaveResponse {
	message: string
	data: {
		steps: number
		distance: number
		duration: number
	}
}

interface PreferencesPayload {
	maxSpeed?: number
	startSpeed?: number
	sensitivity?: 1 | 2 | 3
	childLock?: boolean
	unitsMiles?: boolean
}

interface TargetPayload {
	type: 0 | 1 | 2 | 3 // none, distance, calories, time
	value: number
}

/**
 * WalkingPad API Service
 * Provides methods for interacting with the WalkingPad hardware
 */
export class WalkingPadService {
	private static instance: WalkingPadService
	private baseUrl: string

	private constructor() {
		this.baseUrl = API_BASE_URL
	}

	/**
	 * Get singleton instance
	 */
	public static getInstance(): WalkingPadService {
		if (!WalkingPadService.instance) {
			WalkingPadService.instance = new WalkingPadService()
		}
		return WalkingPadService.instance
	}

	/**
	 * Generic request handler with error management
	 */
	private async makeRequest<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options.headers,
				},
			})

			if (!response.ok) {
				const errorData: ApiError = await response.json().catch(() => ({
					message: response.statusText,
				}))

				throw new WalkingPadApiError(
					errorData.message || `Request failed: ${response.statusText}`,
					response.status
				)
			}

			return await response.json()
		} catch (error) {
			if (error instanceof WalkingPadApiError) {
				throw error
			}

			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			throw new WalkingPadApiError(
				`Failed to communicate with WalkingPad API: ${errorMessage}`
			)
		}
	}

	/**
	 * Get current pad status
	 */
	async getStatus(): Promise<PadStatus> {
		return this.makeRequest<PadStatus>('/status')
	}

	/**
	 * Change pad mode (standby/manual/auto)
	 */
	async setMode(mode: WalkingPadMode): Promise<string> {
		return this.makeRequest<string>(`/mode?new_mode=${mode}`, {
			method: 'POST',
		})
	}

	/**
	 * Start a walking session
	 */
	async startWalk(): Promise<SaveResponse> {
		return this.makeRequest<SaveResponse>('/startwalk', {
			method: 'POST',
		})
	}

	/**
	 * End walking session and save data
	 */
	async finishWalk(): Promise<SaveResponse> {
		return this.makeRequest<SaveResponse>('/finishwalk', {
			method: 'POST',
		})
	}

	/**
	 * Change walking speed
	 * @param speed Speed in km/h × 10 (e.g., 30 = 3.0 km/h)
	 */
	async setSpeed(speed: number): Promise<{ speed: number }> {
		if (speed < 0 || speed > 60) {
			throw new WalkingPadApiError('Speed must be between 0 and 60')
		}

		return this.makeRequest<{ speed: number }>(`/speed?speed=${speed}`, {
			method: 'POST',
		})
	}

	/**
	 * Emergency stop
	 */
	async stop(): Promise<{ message: string }> {
		return this.makeRequest<{ message: string }>('/stop', {
			method: 'POST',
		})
	}

	/**
	 * Set pad preferences
	 */
	async setPreferences(
		preferences: PreferencesPayload
	): Promise<Record<string, any>> {
		const params = new URLSearchParams()

		if (preferences.maxSpeed !== undefined) {
			params.append('max_speed', preferences.maxSpeed.toString())
		}
		if (preferences.startSpeed !== undefined) {
			params.append('start_speed', preferences.startSpeed.toString())
		}
		if (preferences.sensitivity !== undefined) {
			params.append('sensitivity', preferences.sensitivity.toString())
		}
		if (preferences.childLock !== undefined) {
			params.append('child_lock', preferences.childLock.toString())
		}
		if (preferences.unitsMiles !== undefined) {
			params.append('units_miles', preferences.unitsMiles.toString())
		}

		return this.makeRequest<Record<string, any>>(`/preferences?${params}`, {
			method: 'POST',
		})
	}

	/**
	 * Set exercise target
	 */
	async setTarget(target: TargetPayload): Promise<TargetPayload> {
		return this.makeRequest<TargetPayload>(
			`/target?type=${target.type}&value=${target.value}`,
			{
				method: 'POST',
			}
		)
	}

	/**
	 * Save current session manually
	 */
	async saveSession(): Promise<SaveResponse> {
		return this.makeRequest<SaveResponse>('/save', {
			method: 'POST',
		})
	}

	/**
	 * Get session history
	 */
	async getHistory(): Promise<SaveResponse> {
		return this.makeRequest<SaveResponse>('/history')
	}

	/**
	 * Initiate pad calibration
	 */
	async calibrate(): Promise<{ message: string }> {
		return this.makeRequest<{ message: string }>('/calibrate', {
			method: 'POST',
		})
	}
}

export const walkingPadService = WalkingPadService.getInstance()
