/**
 * @file src/components/controls/speed-control.tsx
 * Component for controlling the walking pad speed and mode
 */
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { cn } from '@/lib/utils'
import { Pause, Play } from 'lucide-react'
import { useState } from 'react'

/**
 * Speed presets in km/h
 */
const SPEED_PRESETS = [
	{ value: 2.0, label: 'Slow' },
	{ value: 3.5, label: 'Medium' },
	{ value: 5.0, label: 'Fast' },
]

/**
 * Maximum speed allowed in km/h
 */
const MAX_SPEED = 6.0

/**
 * SpeedControl Component
 * Provides controls for speed adjustment and mode selection
 */
export function SpeedControl() {
	const { mode, stats, isRunning, setMode, setRunning, setStats } =
		useWalkingPadStore()
	const [isAdjusting, setIsAdjusting] = useState(false)

	/**
	 * Handles mode change between manual and automatic
	 */
	const handleModeChange = (newMode: 'manual' | 'automatic') => {
		if (mode !== newMode) {
			setMode(newMode)
			// TODO: Implement API call
			console.info(`Mode changed to ${newMode}`)
		}
	}

	/**
	 * Handles speed change from slider
	 */
	const handleSpeedChange = (newSpeed: number[]) => {
		setIsAdjusting(true)
		setStats({ currentSpeed: newSpeed[0] })
	}

	/**
	 * Handles speed change completion
	 */
	const handleSpeedChangeComplete = (newSpeed: number[]) => {
		setIsAdjusting(false)
		// TODO: Implement API call
		console.info(`Speed set to ${newSpeed[0]} km/h`)
	}

	/**
	 * Handles start/stop action
	 */
	const handleStartStop = async () => {
		setRunning(!isRunning)
		// TODO: Implement API call
		console.info(`${isRunning ? 'Stopping' : 'Starting'} exercise...`)
	}

	return (
		<Card className="p-6">
			<div className="space-y-8">
				{/* Mode Selection */}
				<div className="flex justify-center gap-4">
					<Toggle
						pressed={mode === 'manual'}
						onPressedChange={() => handleModeChange('manual')}
						className={cn(
							'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
							'px-6'
						)}
					>
						Manual
					</Toggle>
					<Toggle
						pressed={mode === 'automatic'}
						onPressedChange={() => handleModeChange('automatic')}
						className={cn(
							'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
							'px-6'
						)}
					>
						Automatic
					</Toggle>
				</div>

				{/* Speed Display */}
				<div className="text-center">
					<div className="text-3xl font-bold">
						{stats.currentSpeed.toFixed(1)}
						<span className="ml-1 text-xl text-muted-foreground">km/h</span>
					</div>
					<div className="mt-1 text-sm text-muted-foreground">
						{isAdjusting ? 'Adjusting Speed...' : 'Current Speed'}
					</div>
				</div>

				{/* Speed Control Slider */}
				<div className="space-y-4">
					<Slider
						value={[stats.currentSpeed]}
						min={0}
						max={MAX_SPEED}
						step={0.1}
						onValueChange={handleSpeedChange}
						onValueCommit={handleSpeedChangeComplete}
						disabled={mode === 'automatic' || !isRunning}
					/>

					{/* Speed Presets */}
					<div className="flex justify-between gap-2">
						{SPEED_PRESETS.map(preset => (
							<Button
								key={preset.value}
								variant="outline"
								size="sm"
								onClick={() => handleSpeedChangeComplete([preset.value])}
								disabled={mode === 'automatic' || !isRunning}
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
		</Card>
	)
}
