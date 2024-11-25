/**
 * @file src/components/controls/speed-control.tsx
 * Updated speed control component with API integration
 */
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { useExerciseData } from '@/hooks/use-exercise-data'
import { cn } from '@/lib/utils'
import { Pause, Play, Settings, Target } from 'lucide-react'
import { useState } from 'react'
import { WalkingPadMode } from '@/lib/types'
import Link from 'next/link'
import { TargetModal } from '@/components/modals/target-modal'

/**
 * Speed presets in km/h
 */
const SPEED_PRESETS = [
	{ value: 2.5, label: 'Slow' },
	{ value: 3.5, label: 'Medium' },
	{ value: 5.0, label: 'Fast' },
]

/**
 * Maximum speed allowed in km/h
 */
const MAX_SPEED = 6.0

/**
 * SpeedControl Component
 * Provides controls for speed adjustment and session management
 */
export function SpeedControl() {
	const { mode, stats, isRunning, currentTarget, setMode } =
		useWalkingPadStore()

	const { startExercise, endExercise, updateSpeed } = useExerciseData()
	const [isAdjusting, setIsAdjusting] = useState(false)

	/**
	 * Handles mode change between manual and automatic
	 */
	const handleModeChange = async (newMode: WalkingPadMode) => {
		try {
			await setMode(newMode)
		} catch (error) {
			console.error('Failed to change mode:', error)
		}
	}

	/**
	 * Handles speed change from slider
	 */
	const handleSpeedChange = (newSpeed: number[]) => {
		setIsAdjusting(true)
		updateSpeed(newSpeed[0])
	}

	/**
	 * Handles speed change completion
	 */
	const handleSpeedChangeComplete = (newSpeed: number[]) => {
		setIsAdjusting(false)
		updateSpeed(newSpeed[0])
	}

	/**
	 * Handles start/stop action
	 */
	const handleStartStop = async () => {
		if (isRunning) {
			await endExercise()
		} else {
			await startExercise()
		}
	}

	return (
		<Card className="flex w-full items-end justify-between p-6">
			<Button asChild variant="outline" size="lg">
				<Link href="/settings">
					<Settings className="mr-2 h-5 w-5" />
					Settings
				</Link>
			</Button>

			<div className="space-y-8">
				{/* Mode Selection */}
				<div className="flex justify-center gap-4">
					<Toggle
						pressed={mode === WalkingPadMode.MANUAL}
						onPressedChange={() => handleModeChange(WalkingPadMode.MANUAL)}
						className={cn(
							'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
							'px-6'
						)}
					>
						Manual
					</Toggle>
					<Toggle
						pressed={mode === WalkingPadMode.AUTO}
						onPressedChange={() => handleModeChange(WalkingPadMode.AUTO)}
						className={cn(
							'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
							'px-6'
						)}
					>
						Automatic
					</Toggle>
				</div>

				{/* Speed and Target Display */}
				<div className="space-y-2 text-center">
					<div className="text-3xl font-bold">
						{stats.currentSpeed.toFixed(1)}
						<span className="ml-1 text-xl text-muted-foreground">km/h</span>
					</div>
					<div className="text-sm text-muted-foreground">
						{isAdjusting ? 'Adjusting Speed...' : 'Current Speed'}
					</div>
					{currentTarget && (
						<div className="text-sm font-medium text-primary">
							Target: {currentTarget.value} {currentTarget.unit}{' '}
							{currentTarget.type}
						</div>
					)}
				</div>

				{/* Speed Control Slider */}
				<div className="space-y-4">
					<Slider
						value={[stats.currentSpeed]}
						min={0}
						max={MAX_SPEED}
						step={0.1}
						onValueChange={value => handleSpeedChange(value)}
						onValueCommit={value => handleSpeedChangeComplete(value)}
						disabled={mode === WalkingPadMode.AUTO || !isRunning}
					/>

					{/* Speed Presets */}
					<div className="flex justify-between gap-2">
						{SPEED_PRESETS.map(preset => (
							<Button
								key={preset.value}
								variant="outline"
								size="sm"
								onClick={() => handleSpeedChangeComplete([preset.value])}
								disabled={mode === WalkingPadMode.AUTO || !isRunning}
								className="flex-1"
							>
								{preset.label} ({preset.value} km/h)
							</Button>
						))}
					</div>
				</div>

				{/* Start/Stop Button */}
				<Button
					size="lg"
					className="w-full"
					onClick={handleStartStop}
					variant={isRunning ? 'destructive' : 'default'}
				>
					{isRunning ? (
						<>
							<Pause className="mr-2 h-5 w-5" /> Stop
						</>
					) : (
						<>
							<Play className="mr-2 h-5 w-5" /> Start
						</>
					)}
				</Button>
			</div>

			<TargetModal>
				<Button
					variant="outline"
					size="lg"
					className={cn(
						'relative',
						currentTarget &&
							'after:absolute after:-right-1 after:-top-1 after:h-2.5 after:w-2.5 after:rounded-full after:bg-primary'
					)}
				>
					<Target className="mr-2 h-5 w-5" />
					{currentTarget ? 'Change Target' : 'Set Target'}
				</Button>
			</TargetModal>
		</Card>
	)
}
