/**
 * @file src/app/page.tsx
 * Updated main exercise page with API integration
 */
'use client'

import { useEffect } from 'react'
import { StatsDisplay } from '@/components/stats/stats-display'
import { SpeedControl } from '@/components/controls/speed-control'
import { ActivityChart } from '@/components/charts/activity-chart'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { useExerciseData } from '@/hooks/use-exercise-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

/**
 * Main exercise page component
 */
export default function ExercisePage() {
	const {
		currentTarget,
		isLoading: storeLoading,
		error: storeError,
		resetState,
	} = useWalkingPadStore()
	const { isLoading: dataLoading, error: dataError } = useExerciseData()

	// Reset state when component unmounts
	useEffect(() => {
		return () => {
			resetState()
		}
	}, [resetState])

	// Show loading state
	if (storeLoading || dataLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<div className="text-center">
					<div className="text-lg font-medium">Loading...</div>
					<p className="text-sm text-muted-foreground">
						Connecting to WalkingPad...
					</p>
				</div>
			</div>
		)
	}

	// Show error state
	if (storeError || dataError) {
		return (
			<Alert variant="destructive" className="mx-auto mt-8 max-w-lg">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					{dataError?.message || 'Failed to connect to WalkingPad'}
				</AlertDescription>
			</Alert>
		)
	}

	return (
		<main className="mx-auto max-w-4xl space-y-6 p-6">
			{/* Header with Target Info */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-bold">{"Today's Exercise"}</h1>
					{currentTarget && (
						<p className="text-sm text-muted-foreground">
							Target: {currentTarget.value} {currentTarget.unit}{' '}
							{currentTarget.type}
						</p>
					)}
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
