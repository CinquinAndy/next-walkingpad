/**
 * @file src/components/MainTab/MainTab.tsx
 */
'use client'

import { useState } from 'react'
import {
	LineChart,
	Line,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Target, Play, Pause } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { TargetModal } from '@/components/target-modal'

interface ExerciseTarget {
	type: 'distance' | 'steps' | 'calories'
	value: number
	unit: string
}

interface ExerciseStats {
	distance: number
	calories: number
	duration: string
	currentSpeed: number
}

const activityData = [
	{ time: '6AM', steps: 1000, calories: 100, activity: 20 },
	{ time: '9AM', steps: 3000, calories: 250, activity: 45 },
	{ time: '12PM', steps: 5000, calories: 400, activity: 60 },
	{ time: '3PM', steps: 7000, calories: 550, activity: 80 },
	{ time: '6PM', steps: 8745, calories: 700, activity: 90 },
]

export default function MainTab() {
	const router = useRouter()
	const [targetModalOpen, setTargetModalOpen] = useState(false)
	const [isRunning, setIsRunning] = useState(false)
	const [mode, setMode] = useState<'manual' | 'automatic'>('manual')
	const [currentTarget, setCurrentTarget] = useState<ExerciseTarget | null>(
		null
	)
	const [stats, setStats] = useState<ExerciseStats>({
		distance: 0,
		calories: 0,
		duration: '0:00',
		currentSpeed: 0,
	})

	const handleTargetSet = (type: string, value: string) => {
		const numValue = parseFloat(value)
		if (!isNaN(numValue)) {
			setCurrentTarget({
				type: type as 'distance' | 'steps' | 'calories',
				value: numValue,
				unit:
					type === 'distance' ? 'km' : type === 'calories' ? 'kcal' : 'steps',
			})
			console.info(`Target set: ${value} ${type}`)
		}
	}

	const handleStartStop = () => {
		setIsRunning(!isRunning)
		// TODO: Implement actual start/stop logic
		console.info(`${isRunning ? 'Stopping' : 'Starting'} exercise...`)
	}

	const handleModeChange = (newMode: 'manual' | 'automatic') => {
		if (mode !== newMode) {
			setMode(newMode)
			// TODO: Implement actual mode change logic
			console.info(`Changing to ${newMode} mode`)
		}
	}

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">{"Today's Exercise"}</h1>
				<p className="text-muted-foreground">
					{currentTarget
						? `Target: ${currentTarget.value} ${currentTarget.unit}`
						: 'No target set'}
				</p>
			</div>

			{/* Current Stats */}
			<div className="grid grid-cols-3 gap-6">
				<div>
					<h2 className="text-lg font-medium">Distance</h2>
					<div className="flex items-baseline gap-1">
						<span className="text-4xl font-bold">
							{stats.distance.toFixed(2)}
						</span>
						<span className="text-muted-foreground">/km</span>
					</div>
				</div>
				<div>
					<h2 className="text-lg font-medium">Calories</h2>
					<div className="flex items-baseline gap-1">
						<span className="text-4xl font-bold">{stats.calories}</span>
						<span className="text-muted-foreground">/Kcal</span>
					</div>
				</div>
				<div>
					<h2 className="text-lg font-medium">Duration</h2>
					<div className="flex items-baseline gap-1">
						<span className="text-4xl font-bold">{stats.duration}</span>
					</div>
				</div>
			</div>

			{/* Activity Charts */}
			<Card>
				<CardHeader>
					<CardTitle>Activity Tracking</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="steps" className="space-y-4">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="steps">Steps</TabsTrigger>
							<TabsTrigger value="calories">Calories</TabsTrigger>
							<TabsTrigger value="activity">Activity Time</TabsTrigger>
						</TabsList>
						{['steps', 'calories', 'activity'].map(type => (
							<TabsContent key={type} value={type}>
								<div className="h-[200px]">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={activityData}>
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
												axisLine={false}
											/>
											<Tooltip
												content={({ active, payload }) => {
													if (active && payload && payload.length) {
														return (
															<div className="rounded-lg border bg-background p-2 shadow-md">
																<div className="grid grid-cols-2 gap-2">
																	<span className="font-medium">Time:</span>
																	<span>{payload[0].payload.time}</span>
																	<span className="font-medium">{type}:</span>
																	<span>{payload[0].value}</span>
																</div>
															</div>
														)
													}
													return null
												}}
											/>
											<Line
												type="monotone"
												dataKey={type}
												stroke={
													type === 'steps'
														? '#7c3aed'
														: type === 'calories'
															? '#10b981'
															: '#6366f1'
												}
												strokeWidth={2}
												dot={false}
												activeDot={{ r: 4 }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</CardContent>
			</Card>

			{/* Treadmill Control */}
			<Card className="p-6">
				<div className="space-y-6">
					{/* Mode Toggle */}
					<div className="flex justify-center gap-8">
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

					{/* Current Speed Display */}
					<div className="relative">
						<div className="flex justify-center py-8">
							<div className="flex h-24 w-72 items-center justify-center rounded-lg bg-muted">
								<div className="text-center">
									<div className="text-3xl font-bold">
										{stats.currentSpeed.toFixed(1)}
										<span className="ml-1 text-xl text-muted-foreground">
											km/h
										</span>
									</div>
									<div className="text-sm text-muted-foreground">
										Current Speed
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Control Buttons */}
					<div className="flex items-center justify-between px-12">
						<button
							onClick={() => setTargetModalOpen(true)}
							className="flex flex-col items-center gap-2"
						>
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80">
								<Target className="h-8 w-8 text-muted-foreground" />
							</div>
							<span className="text-sm text-muted-foreground">
								Choose target
							</span>
						</button>

						<button
							onClick={handleStartStop}
							className="flex flex-col items-center gap-2"
						>
							<div
								className={cn(
									'flex h-24 w-24 items-center justify-center rounded-full transition-colors',
									'text-primary-foreground',
									isRunning ? 'bg-destructive' : 'bg-primary'
								)}
							>
								{isRunning ? (
									<Pause className="h-12 w-12" />
								) : (
									<Play className="ml-2 h-12 w-12" />
								)}
							</div>
							<span className="text-sm text-muted-foreground">
								{isRunning ? 'Stop' : 'Start'}
							</span>
						</button>

						<button
							onClick={() => router.push('/settings')}
							className="flex flex-col items-center gap-2"
						>
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80">
								<Settings className="h-8 w-8 text-muted-foreground" />
							</div>
							<span className="text-sm text-muted-foreground">Settings</span>
						</button>
					</div>
				</div>
			</Card>

			{/* Target Modal */}
			<TargetModal
				open={targetModalOpen}
				onOpenChange={setTargetModalOpen}
				onSetTarget={handleTargetSet}
			/>
		</div>
	)
}
