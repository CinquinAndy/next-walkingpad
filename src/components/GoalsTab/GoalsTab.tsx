/**
 * @file src/components/GoalsTab/GoalsTab.tsx
 * Goals and activity tracking component with calendar visualization
 */

'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ArrowLeft, Info } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

/**
 * Activity level configuration
 */
type ActivityLevel = 0 | 1 | 2 | 3 | 4

interface GoalProgress {
	name: string
	current: number
	goal: number
	unit: string
}

/**
 * Generates dates for the contribution calendar
 */
function generateYearDates() {
	const dates: Date[] = []
	const today = new Date()
	for (let i = 364; i >= 0; i--) {
		const date = new Date(today)
		date.setDate(date.getDate() - i)
		dates.push(date)
	}
	return dates
}

/**
 * Mocked activity level - Replace with real data
 */
function getActivityLevel(date: Date): ActivityLevel {
	// Simulate activity levels based on date
	const dayOfWeek = date.getDay()
	const weekOfMonth = Math.floor(date.getDate() / 7)
	return ((dayOfWeek + weekOfMonth) % 5) as ActivityLevel
}

/**
 * Activity calendar cell component
 */
const ActivityCell: React.FC<{ date: Date; level: ActivityLevel }> = ({
	date,
	level,
}) => {
	const levelColors = {
		0: 'bg-muted hover:bg-muted/80',
		1: 'bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-900 dark:hover:bg-emerald-800',
		2: 'bg-emerald-300 hover:bg-emerald-400 dark:bg-emerald-800 dark:hover:bg-emerald-700',
		3: 'bg-emerald-400 hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600',
		4: 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500',
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<div
						className={cn(
							'h-3 w-3 rounded-sm transition-colors',
							levelColors[level]
						)}
					/>
				</TooltipTrigger>
				<TooltipContent>
					<div className="text-xs">
						<div>
							{date.toLocaleDateString('en-US', { dateStyle: 'medium' })}
						</div>
						<div>{level} activities</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

/**
 * Progress card component
 */
const GoalProgressCard: React.FC<{ goal: GoalProgress }> = ({ goal }) => {
	const progress = (goal.current / goal.goal) * 100

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="font-medium">{goal.name}</span>
				<span className="text-sm text-muted-foreground">
					{goal.current.toLocaleString()} / {goal.goal.toLocaleString()}{' '}
					{goal.unit}
				</span>
			</div>
			<Progress value={progress} className="h-2" />
			<div className="text-right text-sm text-muted-foreground">
				{Math.round(progress)}% completed
			</div>
		</div>
	)
}

/**
 * Main GoalsTab component
 */
export default function GoalsTab() {
	// Generate calendar data
	const dates = useMemo(() => generateYearDates(), [])
	const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]

	// Mock goals data
	const goalsProgress: GoalProgress[] = [
		{ name: 'Daily Steps', current: 8500, goal: 10000, unit: 'steps' },
		{ name: 'Weekly Distance', current: 25, goal: 30, unit: 'km' },
		{ name: 'Monthly Active Days', current: 20, goal: 25, unit: 'days' },
	]

	return (
		<div className="space-y-6 animate-in fade-in-50">
			{/* Header */}
			<div className="flex items-center gap-4">
				<button
					className="rounded-full p-2 transition-colors hover:bg-muted"
					aria-label="Go back"
				>
					<ArrowLeft className="h-6 w-6" />
				</button>
				<h1 className="text-2xl font-bold">Goals & Progress</h1>
			</div>

			{/* Activity Contributions */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Activity Contributions</CardTitle>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Info className="h-4 w-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Track your daily activity levels throughout the year</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2">
						{/* Calendar Grid */}
						<div className="grid-cols-53 grid gap-1">
							{Array.from({ length: 53 }).map((_, weekIndex) => (
								<div key={weekIndex} className="grid grid-rows-7 gap-1">
									{weekDays.map((_, dayIndex) => {
										const dateIndex = weekIndex * 7 + dayIndex
										if (dateIndex >= dates.length) return null
										const date = dates[dateIndex]
										const level = getActivityLevel(date)
										return (
											<ActivityCell key={dateIndex} date={date} level={level} />
										)
									})}
								</div>
							))}
						</div>

						{/* Months Label */}
						<div className="mt-2 flex justify-between text-xs text-muted-foreground">
							{months.map(month => (
								<span key={month}>{month}</span>
							))}
						</div>

						{/* Legend */}
						<div className="mt-4 flex items-center justify-end gap-2 text-sm text-muted-foreground">
							<span>Less</span>
							{[0, 1, 2, 3, 4].map(level => (
								<div
									key={level}
									className={cn(
										'h-3 w-3 rounded-sm',
										level === 0 && 'bg-muted',
										level === 1 && 'bg-emerald-200 dark:bg-emerald-900',
										level === 2 && 'bg-emerald-300 dark:bg-emerald-800',
										level === 3 && 'bg-emerald-400 dark:bg-emerald-700',
										level === 4 && 'bg-emerald-500 dark:bg-emerald-600'
									)}
								/>
							))}
							<span>More</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Goals Progress */}
			<Card>
				<CardHeader>
					<CardTitle>Goals Progress</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{goalsProgress.map((goal, index) => (
							<GoalProgressCard key={index} goal={goal} />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
