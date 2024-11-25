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
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

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
	const router = useRouter()
	const { toast } = useToast()
	const { mode, stats, isRunning, currentTarget, setMode } =
		useWalkingPadStore()

	const { startExercise, updateSpeed } = useExerciseData()
	const [isAdjusting, setIsAdjusting] = useState(false)

	/**
	 * Handle session start and redirect
	 */
	const handleStartSession = async () => {
		try {
			await startExercise()
			router.push('/session')
		} catch (error) {
			toast({
				title: 'Failed to Start Session',
				description:
					error instanceof Error ? error.message : 'Unknown error occurred',
				variant: 'destructive',
			})
		}
	}

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

	return (
		<Card className="flex w-full items-end justify-between p-6">
			<Button asChild variant="outline" size="lg">
				<Link href="/settings">
					<Settings className="mr-2 h-5 w-5" />
					Settings
				</Link>
			</Button>

			<div className="space-y-8">
				{/* Start Button - Updated to redirect */}
				<Button
					size="lg"
					className="w-full"
					onClick={handleStartSession}
					disabled={isRunning}
				>
					<Play className="mr-2 h-5 w-5" /> Start Session
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
