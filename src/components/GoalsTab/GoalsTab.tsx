/**
 * @file src/components/GoalsTab/GoalsTab.tsx
 * Goals and activity tracking component
 */

import { useState, useEffect } from 'react'
import { Calendar, Target, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DailyGoals, ActivityLevel } from '@/lib/types'

interface ActivityCalendarProps {
	data: ActivityLevel[]
}

/**
 * Activity calendar grid component
 */
const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ data }) => {
	const getActivityColor = (level: ActivityLevel): string => {
		switch (level) {
			case ActivityLevel.NONE:
				return 'bg-gray-100 dark:bg-gray-800'
			case ActivityLevel.LOW:
				return 'bg-green-200 dark:bg-green-900'
			case ActivityLevel.MEDIUM:
				return 'bg-green-300 dark:bg-green-800'
			case ActivityLevel.HIGH:
				return 'bg-green-400 dark:bg-green-700'
			case ActivityLevel.VERY_HIGH:
				return 'bg-green-500 dark:bg-green-600'
		}
	}

	return (
		<div className="grid grid-cols-7 gap-1">
			{data.map((level, index) => (
				<div
					key={index}
					className={`h-6 w-6 rounded-sm transition-colors ${getActivityColor(level)}`}
					title={`Activity Level: ${ActivityLevel[level]}`}
				/>
			))}
		</div>
	)
}

interface GoalInputProps {
	label: string
	value: number
	onChange: (value: number) => void
	unit: string
	min?: number
	max?: number
}

/**
 * Goal input component with label and unit
 */
const GoalInput: React.FC<GoalInputProps> = ({
	label,
	value,
	onChange,
	unit,
	min = 0,
	max,
}) => (
	<div className="space-y-2">
		<label className="text-sm font-medium">{label}</label>
		<div className="flex items-center space-x-2">
			<Input
				type="number"
				value={value}
				onChange={e => onChange(Number(e.target.value))}
				min={min}
				max={max}
				className="w-32"
			/>
			<span className="text-sm text-muted-foreground">{unit}</span>
		</div>
	</div>
)

/**
 * GoalsTab component for managing daily goals and viewing activity history
 */
export default function GoalsTab() {
	// State for daily goals
	const [goals, setGoals] = useState<DailyGoals>({
		steps: 5000,
		distance: 5,
		duration: 30,
		calories: 300,
	})

	// Generate mock calendar data
	const [calendarData, setCalendarData] = useState<ActivityLevel[]>([])

	useEffect(() => {
		// Generate mock activity data for the last 365 days
		const mockData = Array.from({ length: 365 }, () =>
			Math.floor((Math.random() * Object.keys(ActivityLevel).length) / 2)
		)
		setCalendarData(mockData)
	}, [])

	const handleSaveGoals = async () => {
		try {
			// TODO: Implement API call to save goals
			console.info('Saving goals:', goals)
			// Mock success message
			console.info('Goals saved successfully')
		} catch (error) {
			console.error('Error saving goals:', error)
		}
	}

	return (
		<div className="space-y-6 p-6">
			{/* Daily Goals Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Target className="h-5 w-5" />
						<span>Daily Goals</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<GoalInput
						label="Steps Goal"
						value={goals.steps}
						onChange={steps => setGoals(prev => ({ ...prev, steps }))}
						unit="steps"
						min={1000}
					/>
					<GoalInput
						label="Distance Goal"
						value={goals.distance}
						onChange={distance => setGoals(prev => ({ ...prev, distance }))}
						unit="km"
						min={0.5}
					/>
					<GoalInput
						label="Duration Goal"
						value={goals.duration}
						onChange={duration => setGoals(prev => ({ ...prev, duration }))}
						unit="minutes"
						min={5}
					/>
					<GoalInput
						label="Calories Goal"
						value={goals.calories}
						onChange={calories => setGoals(prev => ({ ...prev, calories }))}
						unit="kcal"
						min={100}
					/>
					<Button onClick={handleSaveGoals} className="mt-4 w-full">
						Save Goals
					</Button>
				</CardContent>
			</Card>

			{/* Activity Calendar Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Calendar className="h-5 w-5" />
						<span>Activity Calendar</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ActivityCalendar data={calendarData} />

					{/* Legend */}
					<div className="mt-4 flex items-center space-x-4">
						<span className="text-sm text-muted-foreground">
							Activity Level:
						</span>
						{Object.keys(ActivityLevel)
							.filter(key => !isNaN(Number(key)))
							.map(level => (
								<div key={level} className="flex items-center space-x-1">
									<div
										className={`h-4 w-4 rounded-sm ${
											ActivityLevel[Number(level)] ===
											ActivityLevel.NONE.toString()
												? 'bg-gray-100 dark:bg-gray-800'
												: `bg-green-${(Number(level) + 1) * 100} dark:bg-green-${
														900 - Number(level) * 100
													}`
										}`}
									/>
									<span className="text-xs text-muted-foreground">
										{ActivityLevel[Number(level)].toLowerCase()}
									</span>
								</div>
							))}
					</div>
				</CardContent>
			</Card>

			{/* Streaks and Achievements */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<TrendingUp className="h-5 w-5" />
						<span>Current Streaks</span>
					</CardTitle>
				</CardHeader>

				<CardContent>
					<div className="space-y-2">
						<p className="text-lg font-medium">🔥 5 day streak</p>
						<p className="text-sm text-muted-foreground">
							{"Keep going! You're building a great habit."}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
