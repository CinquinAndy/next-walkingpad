/**
 * @file src/components/MainTab/MainTab.tsx
 * Main exercise tracking and treadmill control component
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
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Target, Play, Pause } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

/**
 * Activity data type definition
 */
interface ActivityDataPoint {
	time: string
	steps: number
	calories: number
	activity: number
}

/**
 * Current stats display component
 */
interface StatDisplayProps {
	label: string
	value: string | number
	unit?: string
}

const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, unit }) => (
	<div>
		<h2 className="text-lg font-medium">{label}</h2>
		<div className="flex items-baseline gap-1">
			<span className="text-4xl font-bold">{value}</span>
			{unit && <span className="text-muted-foreground">/{unit}</span>}
		</div>
	</div>
)

/**
 * Chart component for activity visualization
 */
interface ActivityChartProps {
	data: ActivityDataPoint[]
	dataKey: keyof ActivityDataPoint
	color?: string
}

const ActivityChart: React.FC<ActivityChartProps> = ({
	data,
	dataKey,
	color = '#7c3aed',
}) => (
	<div className="h-[200px]">
		<ResponsiveContainer width="100%" height="100%">
			<LineChart data={data}>
				<XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} />
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={value => `${value}`}
				/>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							return (
								<div className="rounded-lg border bg-background p-2 shadow-md">
									<div className="grid grid-cols-2 gap-2">
										<span className="font-medium">Time:</span>
										<span>{payload[0].payload.time}</span>
										<span className="font-medium">{dataKey}:</span>
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
					dataKey={dataKey}
					stroke={color}
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4, strokeWidth: 2 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	</div>
)

/**
 * Mock activity data
 */
const activityData: ActivityDataPoint[] = [
	{ time: '6AM', steps: 1000, calories: 100, activity: 20 },
	{ time: '9AM', steps: 3000, calories: 250, activity: 45 },
	{ time: '12PM', steps: 5000, calories: 400, activity: 60 },
	{ time: '3PM', steps: 7000, calories: 550, activity: 80 },
	{ time: '6PM', steps: 8745, calories: 700, activity: 90 },
]

/**
 * Control button component
 */
interface ControlButtonProps {
	icon: React.ReactNode
	label: string
	onClick: () => void
	size?: 'default' | 'large'
	variant?: 'default' | 'primary'
}

const ControlButton: React.FC<ControlButtonProps> = ({
	icon,
	label,
	onClick,
	size = 'default',
	variant = 'default',
}) => (
	<button onClick={onClick} className="flex flex-col items-center gap-2">
		<div
			className={cn(
				'flex items-center justify-center rounded-full transition-colors',
				size === 'large' ? 'h-24 w-24' : 'h-16 w-16',
				variant === 'primary'
					? 'bg-primary text-primary-foreground hover:bg-primary/90'
					: 'bg-muted hover:bg-muted/80'
			)}
		>
			{icon}
		</div>
		<span className="text-sm text-muted-foreground">{label}</span>
	</button>
)

/**
 * Main tab component
 */
export default function MainTab() {
	const [isRunning, setIsRunning] = useState(false)
	const [mode, setMode] = useState<'manual' | 'automatic'>('manual')

	const handleStartStop = () => {
		setIsRunning(!isRunning)
		// TODO: Implement actual start/stop logic
		console.info(`${isRunning ? 'Stopping' : 'Starting'} exercise...`)
	}

	const handleModeChange = (newMode: 'manual' | 'automatic') => {
		setMode(newMode)
		// TODO: Implement mode change logic
		console.info(`Changing mode to ${newMode}`)
	}

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold">Today's Exercise</h1>
				<p className="text-muted-foreground">Regular Exercise #8</p>
			</div>

			{/* Current Stats */}
			<div className="grid grid-cols-3 gap-6">
				<StatDisplay label="Distance" value="0" unit="km" />
				<StatDisplay label="Calories" value="0.0" unit="Kcal" />
				<StatDisplay label="Duration" value="0:00" />
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
						<TabsContent value="steps">
							<ActivityChart data={activityData} dataKey="steps" />
						</TabsContent>
						<TabsContent value="calories">
							<ActivityChart
								data={activityData}
								dataKey="calories"
								color="#10b981"
							/>
						</TabsContent>
						<TabsContent value="activity">
							<ActivityChart
								data={activityData}
								dataKey="activity"
								color="#6366f1"
							/>
						</TabsContent>
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
							className="text-base"
						>
							Manual
						</Toggle>
						<Toggle
							pressed={mode === 'automatic'}
							onPressedChange={() => handleModeChange('automatic')}
							className="text-base"
						>
							Automatic
						</Toggle>
					</div>

					{/* Treadmill Visualization */}
					<div className="relative mx-auto h-48">
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="flex h-24 w-72 items-center justify-center rounded-lg bg-muted">
								<span className="text-2xl font-bold text-muted-foreground">
									0.0 km/h
								</span>
							</div>
						</div>
					</div>

					{/* Control Buttons */}
					<div className="flex items-center justify-between px-12">
						<ControlButton
							icon={<Target className="h-8 w-8 text-muted-foreground" />}
							label="Choose target"
							onClick={() => console.info('Opening target selector...')}
						/>

						<ControlButton
							icon={
								isRunning ? (
									<Pause className="h-8 w-8" />
								) : (
									<Play className="h-8 w-8" />
								)
							}
							label={isRunning ? 'Stop' : 'Start'}
							onClick={handleStartStop}
							size="large"
							variant="primary"
						/>

						<ControlButton
							icon={<Settings className="h-8 w-8 text-muted-foreground" />}
							label="Settings"
							onClick={() => console.info('Opening settings...')}
						/>
					</div>
				</div>
			</Card>
		</div>
	)
}
