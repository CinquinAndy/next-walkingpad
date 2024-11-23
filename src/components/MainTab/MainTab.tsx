/**
 * @file src/components/MainTab/MainTab.tsx
 * Main tab component for the WalkingPad interface
 */

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Play, Pause, Clock, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PadStatus, WalkingPadMode } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Props for the statistics card component
 */
interface StatsCardProps {
	title: string
	value: string | number
	unit?: string
	bgColor: string
}

/**
 * Statistics card component for displaying workout metrics
 */
const StatsCard: React.FC<StatsCardProps> = ({
	title,
	value,
	unit,
	bgColor,
}) => (
	<Card className={cn('transition-colors', bgColor)}>
		<CardHeader className="pb-2">
			<CardTitle className="text-lg font-semibold">{title}</CardTitle>
		</CardHeader>
		<CardContent>
			<p className="text-2xl font-bold">
				{value}
				{unit && <span className="ml-1 text-lg">{unit}</span>}
			</p>
		</CardContent>
	</Card>
)

/**
 * MainTab component displays current session statistics and pad controls
 */
export default function MainTab() {
	const [padStatus, setPadStatus] = useState<PadStatus>({
		isConnected: false,
		mode: WalkingPadMode.STANDBY,
		currentSpeed: 0,
		currentSession: undefined,
	})

	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		// TODO: Implement WebSocket or polling for real-time pad status updates
		const interval = setInterval(() => {
			// Mock status update - replace with actual API call
			console.debug('Updating pad status...')
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	const handleStartStop = async () => {
		setIsLoading(true)
		try {
			if (padStatus.mode === WalkingPadMode.STANDBY) {
				// TODO: Implement start walking session
				console.info('Starting walking session...')
			} else {
				// TODO: Implement stop walking session
				console.info('Stopping walking session...')
			}
		} catch (error) {
			console.error('Error toggling walking session:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-6 p-6">
			{/* Statistics Grid */}
			<div className="grid grid-cols-2 gap-4">
				<StatsCard
					title="Distance"
					value={padStatus.currentSession?.distance || 0}
					unit="km"
					bgColor="bg-blue-100 dark:bg-blue-900"
				/>
				<StatsCard
					title="Calories"
					value={padStatus.currentSession?.calories || 0}
					unit="kcal"
					bgColor="bg-green-100 dark:bg-green-900"
				/>
				<StatsCard
					title="Steps"
					value={padStatus.currentSession?.steps || 0}
					bgColor="bg-yellow-100 dark:bg-yellow-900"
				/>
				<StatsCard
					title="Duration"
					value={
						padStatus.currentSession?.duration
							? Math.floor(padStatus.currentSession.duration / 60)
							: 0
					}
					unit="min"
					bgColor="bg-purple-100 dark:bg-purple-900"
				/>
			</div>

			{/* Pad Visualization */}
			<Card className="p-6">
				<div className="flex flex-col items-center">
					<div className="relative mb-4 h-[200px] w-[200px]">
						<Image
							src="/images/walkingpad.svg"
							alt="WalkingPad"
							layout="fill"
							objectFit="contain"
							priority
						/>
					</div>

					<Button
						size="lg"
						variant={
							padStatus.mode === WalkingPadMode.STANDBY
								? 'default'
								: 'destructive'
						}
						className="mb-4"
						onClick={handleStartStop}
						disabled={isLoading}
					>
						{isLoading ? (
							'Loading...'
						) : padStatus.mode === WalkingPadMode.STANDBY ? (
							<>
								<Play className="mr-2 h-5 w-5" />
								Start
							</>
						) : (
							<>
								<Pause className="mr-2 h-5 w-5" />
								Stop
							</>
						)}
					</Button>

					<div className="flex space-x-4">
						<Button variant="outline">
							<Clock className="mr-2 h-5 w-5" />
							Set Target
						</Button>
						<Button variant="outline">
							<Settings className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</Card>
		</div>
	)
}
