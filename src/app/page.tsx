/**
 * @file src/app/page.tsx
 * Main exercise tracking and control page
 */
'use client'

import { useEffect } from 'react'
import { StatsDisplay } from '@/components/stats/stats-display'
import { SpeedControl } from '@/components/controls/speed-control'
import { ActivityChart } from '@/components/charts/activity-chart'
import { TargetModal } from '@/components/modals/target-modal'
import { useWalkingPadStore } from '@/store/walking-pad.store'

/**
 * Main exercise page component
 * Displays current exercise stats, controls, and activity tracking
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
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">{"Today's Exercise"}</h1>
			</div>

			{/* Current Stats */}
			<StatsDisplay />

			{/* Controls Section */}
			<div className="flex w-full gap-4">
				<SpeedControl />
			</div>

			{/* Activity Tracking */}
			<ActivityChart />

			{/* Modals */}
			<TargetModal />
		</main>
	)
}
