/**
 * @file src/app/session/page.tsx
 * Active exercise session page with real-time stats
 */
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, ArrowLeft, Pause, Timer } from 'lucide-react'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { useExerciseData } from '@/hooks/use-exercise-data'
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
} from 'recharts'

/**
 * Stats card for displaying individual metrics
 */
function StatCard({
	title,
	value,
	unit,
	change,
	color = 'blue',
}: {
	title: string
	value: string | number
	unit?: string
	change?: { value: number; label: string }
	color?: string
}) {
	return (
		<Card>
			<CardContent className="p-6">
				<div className="space-y-2">
					<p className="text-sm font-medium text-muted-foreground">{title}</p>
					<div className="flex items-baseline space-x-2">
						<p className="text-2xl font-bold">{value}</p>
						{unit && (
							<span className="text-sm text-muted-foreground">{unit}</span>
						)}
					</div>
					{change && (
						<div className="flex items-center space-x-1">
							<span
								className={`text-sm ${
									change.value >= 0 ? 'text-emerald-500' : 'text-rose-500'
								}`}
							>
								{change.value >= 0 ? '+' : ''}
								{change.value}%
							</span>
							<span className="text-sm text-muted-foreground">
								{change.label}
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

/**
 * Speed graph showing the last few minutes
 */
function SpeedGraph({
	data,
}: {
	data: Array<{ time: string; speed: number }>
}) {
	return (
		<div className="h-48">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={data}>
					<XAxis
						dataKey="time"
						stroke="#888888"
						fontSize={12}
						tickLine={false}
					/>
					<YAxis
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						domain={[0, 'auto']}
					/>
					<Tooltip
						content={({ active, payload }) => {
							if (!active || !payload?.length) return null
							return (
								<div className="rounded-lg border bg-background p-2 shadow-sm">
									<div className="grid grid-cols-2 gap-2">
										<span className="font-medium">Time:</span>
										<span>{payload[0].payload.time}</span>
										<span className="font-medium">Speed:</span>
										<span>{payload[0].value} km/h</span>
									</div>
								</div>
							)
						}}
					/>
					<Line
						type="monotone"
						dataKey="speed"
						stroke="#2563eb"
						strokeWidth={2}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

/**
 * Session target display
 */
function TargetProgress({
	type,
	current,
	target,
	unit,
}: {
	type: string
	current: number
	target: number
	unit: string
}) {
	const progress = Math.min((current / target) * 100, 100)

	return (
		<div className="space-y-2">
			<div className="flex justify-between text-sm">
				<span className="text-muted-foreground">{type}</span>
				<span>
					{current} / {target} {unit}
				</span>
			</div>
			<Progress value={progress} className="h-2" />
		</div>
	)
}

/**
 * Timer display component
 */
function SessionTimer({ duration }: { duration: string }) {
	return (
		<div className="flex items-center justify-center space-x-2 rounded-lg border bg-card p-4 text-4xl font-bold">
			<Timer className="h-6 w-6 text-muted-foreground" />
			<span>{duration}</span>
		</div>
	)
}

/**
 * Main exercise session page
 */
export default function ExerciseSessionPage() {
	const router = useRouter()
	const { stats, currentTarget, isRunning, error } = useWalkingPadStore()

	const { endExercise, isLoading, isReconnecting } = useExerciseData()

	// Redirect if not running
	useEffect(() => {
		if (!isRunning && !isLoading) {
			router.push('/')
		}
	}, [isRunning, isLoading, router])

	// Example speed data - replace with actual data from your API
	const speedData = [
		{ time: '0:00', speed: 0 },
		{ time: '1:00', speed: 2.5 },
		{ time: '2:00', speed: 3.0 },
		{ time: '3:00', speed: 3.5 },
		{ time: '4:00', speed: stats.currentSpeed },
	]

	if (error) {
		return (
			<Alert variant="destructive" className="m-4">
				<AlertCircle className="h-4 w-4" />
				{/*<AlertDescription>{error.message}</AlertDescription>*/}
			</Alert>
		)
	}

	return (
		<div className="min-h-screen space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => endExercise()}
						className="rounded-full"
					>
						<ArrowLeft className="h-6 w-6" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold">Exercise Session</h1>
						{isReconnecting && (
							<p className="text-sm text-muted-foreground">
								Reconnecting to device...
							</p>
						)}
					</div>
				</div>
				<Button
					variant="destructive"
					onClick={() => endExercise()}
					disabled={isLoading}
				>
					<Pause className="mr-2 h-4 w-4" />
					End Session
				</Button>
			</div>

			{/* Timer */}
			<SessionTimer duration={stats.duration} />

			{/* Current Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<StatCard
					title="Speed"
					value={stats.currentSpeed.toFixed(1)}
					unit="km/h"
				/>
				<StatCard
					title="Distance"
					value={stats.distance.toFixed(2)}
					unit="km"
					change={{
						value: 12.5,
						label: 'vs. last session',
					}}
				/>
				<StatCard
					title="Steps"
					value={stats.steps.toLocaleString()}
					change={{
						value: 8.3,
						label: 'vs. average',
					}}
				/>
				<StatCard title="Calories" value={stats.calories} unit="kcal" />
			</div>

			{/* Target Progress */}
			{currentTarget && (
				<Card>
					<CardContent className="p-6">
						<TargetProgress
							type={currentTarget.type}
							current={
								stats[currentTarget.type as keyof typeof stats] as number
							}
							target={currentTarget.value}
							unit={currentTarget.unit}
						/>
					</CardContent>
				</Card>
			)}

			{/* Speed Graph */}
			<Card>
				<CardContent className="p-6">
					<div className="space-y-4">
						<h3 className="font-semibold">Speed Over Time</h3>
						<SpeedGraph data={speedData} />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
