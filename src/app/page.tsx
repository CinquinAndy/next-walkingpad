/**
 * @file src/app/page.tsx
 * Main exercise tracking and control page with target functionality
 */
'use client'

import { useEffect } from 'react'
import { StatsDisplay } from '@/components/stats/stats-display'
import { SpeedControl } from '@/components/controls/speed-control'
import { ActivityChart } from '@/components/charts/activity-chart'
import { useWalkingPadStore } from '@/store/walking-pad.store'

/**
 * Main exercise page component
 */
export default function ExercisePage() {
	const { currentTarget, isLoading, error, resetState } = useWalkingPadStore()

	// Reset state when component unmounts
	useEffect(() => {
		return () => {
			resetState()
		}
	}, [resetState])

	// Show loading state
	if (isLoading) {
		return <div>Loading...</div>
	}

	// Show error state if any
	if (error) {
		return <div>Error: {error}</div>
	}

	return (
		<main className="mx-auto max-w-4xl space-y-6 p-6">
			{/* Header with Target Info */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold">{"Today's Exercise"}</h1>
				</div>
			</div>

			{/* Current Stats */}
			<StatsDisplay />

			{/* Controls Section */}
			<div className="flex w-full gap-4">
				<SpeedControl />
			</div>

			{/* Activity Tracking */}
			<ActivityChart />
		</main>
	)
}
