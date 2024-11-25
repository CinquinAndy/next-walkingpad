/**
 * @file src/services/walking-pad.service.ts
 * Updated service for handling WalkingPad API communication
 */

import { ApiError, WalkingPadMode } from '@/lib/types'

/**
 * API Configuration
 */
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5678/api'

/**
 * Custom error class for API errors
 */
export class WalkingPadApiError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public originalError?: any
	) {
		super(message)
		this.name = 'WalkingPadApiError'
	}
}

/**
 * Enhanced request handling with retry logic
 */
async function makeRequest<T>(
	endpoint: string,
	options: RequestInit = {},
	retries = 3
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint}`
	let lastError: any

	for (let i = 0; i < retries; i++) {
		try {
			const response = await fetch(url, {
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
			lastError = error
			console.warn(`Attempt ${i + 1} failed:`, error)

			if (i < retries - 1) {
				await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
			}
		}
	}

	throw new WalkingPadApiError(
		'Failed to communicate with WalkingPad API after multiple attempts',
		undefined,
		lastError
	)
}

/**
 * WalkingPad API Service
 */
export class WalkingPadService {
	private static instance: WalkingPadService

	private constructor() {}

	public static getInstance(): WalkingPadService {
		if (!WalkingPadService.instance) {
			WalkingPadService.instance = new WalkingPadService()
		}
		return WalkingPadService.instance
	}

	/**
	 * Get current device status
	 */
	async getStatus(): Promise<{
		mode: WalkingPadMode
		duration: string
		beltState: string
		distance: number
		isConnected: boolean
		calories: number
		currentSpeed: number
		steps: number
	}> {
		try {
			const response = await makeRequest<any>('/device/status')
			return {
				isConnected: true,
				mode: response.mode || WalkingPadMode.STANDBY,
				beltState: response.belt_state || 'idle',
				currentSpeed: response.speed || 0,
				distance: response.distance || 0,
				steps: response.steps || 0,
				calories: response.calories || 0,
				duration: response.duration || '00:00',
			}
		} catch (error) {
			console.error('Status fetch error:', error)
			// Return offline status instead of throwing
			return {
				isConnected: false,
				mode: WalkingPadMode.STANDBY,
				beltState: 'idle',
				currentSpeed: 0,
				distance: 0,
				steps: 0,
				calories: 0,
				duration: '00:00',
			}
		}
	}

	/**
	 * Start walking session
	 */
	async startWalk(speed?: number): Promise<void> {
		const endpoint = speed
			? `/device/start?speed=${speed * 10}`
			: '/device/start?speed=25'
		await makeRequest(endpoint, { method: 'POST' })
	}

	/**
	 * End walking session
	 */
	async finishWalk(): Promise<void> {
		await makeRequest('/device/stop', { method: 'POST' })
	}

	/**
	 * Change walking speed
	 * @param speed Speed in km/h × 10 (e.g., 30 = 3.0 km/h)
	 */
	async setSpeed(speed: number): Promise<void> {
		const speedValue = Math.round(speed * 10)
		if (speedValue < 0 || speedValue > 60) {
			throw new WalkingPadApiError('Speed must be between 0 and 6.0 km/h')
		}

		await makeRequest(`/device/speed?speed=${speedValue}`, { method: 'POST' })
	}

	/**
	 * Set device mode
	 */
	async setMode(mode: WalkingPadMode): Promise<void> {
		await makeRequest(`/device/mode?mode=${mode}`, { method: 'POST' })
	}

	/**
	 * Emergency stop
	 */
	async emergencyStop(): Promise<void> {
		await makeRequest('/device/stop', { method: 'POST' })
	}

	/**
	 * Save current session
	 */
	async saveSession(): Promise<void> {
		await makeRequest('/save', { method: 'POST' })
	}
}

export const walkingPadService = WalkingPadService.getInstance()
