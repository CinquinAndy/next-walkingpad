/**
 * @file src/app/page.tsx
 * Simplified main exercise page
 */
'use client'

import { StatsDisplay } from '@/components/stats/stats-display'
import { SpeedControl } from '@/components/controls/speed-control'
import { ActivityChart } from '@/components/charts/activity-chart'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { Alert, AlertDescription } from '@/components/ui/alert'

/**
 * Main exercise page component
 * Shows basic controls and historical stats
 */
export default function ExercisePage() {
	const { error } = useWalkingPadStore()

	// Show error state if any
	if (error) {
		return (
			<Alert variant="destructive" className="mx-auto mt-8 max-w-lg">
				<AlertDescription>
					{error.message || 'An error occurred'}
				</AlertDescription>
			</Alert>
		)
	}

	return (
		<main className="mx-auto max-w-4xl space-y-6 p-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">Exercise Dashboard</h1>
				<p className="text-sm text-muted-foreground">
					Start a new session or view your activity history
				</p>
			</div>

			{/* Historical Stats Overview */}
			<StatsDisplay />

			{/* Start Session Control */}
			<div className="flex w-full gap-4">
				<SpeedControl />
			</div>

			{/* Activity History */}
			<ActivityChart />
		</main>
	)
}
