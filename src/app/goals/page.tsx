/**
 * @file src/app/goals/page.tsx
 * Goals and achievements tracking page
 */
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard, StatsCardGrid } from '@/components/stats/stats-card'
import { Progress } from '@/components/ui/progress'
import { Flame, Footprints, Target, Timer, Trophy } from 'lucide-react'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { cn } from '@/lib/utils'

/**
 * Weekly goal type definition
 */
interface WeeklyGoal {
	id: string
	title: string
	current: number
	target: number
	unit: string
	icon: typeof Target
	progress: number
	daysLeft: number
}

/**
 * Achievement type definition
 */
interface Achievement {
	id: string
	title: string
	description: string
	date: string
	icon: typeof Trophy
	type: 'bronze' | 'silver' | 'gold'
}

/**
 * Goals Page Component
 */
export default function GoalsPage() {
	const stats = useWalkingPadStore(state => state.stats)

	// Example weekly goals data
	const weeklyGoals: WeeklyGoal[] = [
		{
			id: '1',
			title: 'Weekly Steps',
			current: 45250,
			target: 70000,
			unit: 'steps',
			icon: Footprints,
			progress: 64.6,
			daysLeft: 3,
		},
		{
			id: '2',
			title: 'Active Time',
			current: 180,
			target: 300,
			unit: 'minutes',
			icon: Timer,
			progress: 60,
			daysLeft: 3,
		},
		{
			id: '3',
			title: 'Calories Burned',
			current: 1500,
			target: 2500,
			unit: 'kcal',
			icon: Flame,
			progress: 60,
			daysLeft: 3,
		},
	]

	// Example achievements data
	const achievements: Achievement[] = [
		{
			id: '1',
			title: 'Marathon Walker',
			description: 'Completed 42.2km in a week',
			date: '2024-03-20',
			icon: Trophy,
			type: 'gold',
		},
		{
			id: '2',
			title: 'Consistent Stepper',
			description: '10,000 steps daily for 7 days',
			date: '2024-03-15',
			icon: Trophy,
			type: 'silver',
		},
		{
			id: '3',
			title: 'Early Bird',
			description: '5 morning walks completed',
			date: '2024-03-10',
			icon: Trophy,
			type: 'bronze',
		},
	]

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">Goals & Achievements</h1>
				<p className="mt-2 text-muted-foreground">
					Track your progress and celebrate milestones
				</p>
			</div>

			{/* Today's Progress */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Today&apos;s Progress</h2>
				<StatsCardGrid>
					<StatsCard
						title="Steps"
						value={stats.steps}
						unit="steps"
						icon={Footprints}
						change={{
							type: 'increase',
							value: 15.5,
							label: 'vs. yesterday',
						}}
					/>
					<StatsCard
						title="Distance"
						value={stats.distance}
						unit="km"
						icon={Target}
						change={{
							type: 'increase',
							value: 22.3,
							label: 'vs. yesterday',
						}}
					/>
					<StatsCard title="Active Time" value={stats.duration} icon={Timer} />
					<StatsCard
						title="Calories"
						value={stats.calories}
						unit="kcal"
						icon={Flame}
						change={{
							type: 'decrease',
							value: -5.2,
							label: 'vs. yesterday',
						}}
					/>
				</StatsCardGrid>
			</section>

			{/* Weekly Goals */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Weekly Goals</h2>
				<div className="grid gap-4 md:grid-cols-3">
					{weeklyGoals.map(goal => (
						<Card key={goal.id}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{goal.title}
								</CardTitle>
								<goal.icon className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="flex items-end justify-between">
										<span className="text-2xl font-bold">
											{goal.current.toLocaleString()}
										</span>
										<span className="text-muted-foreground">
											/{goal.target.toLocaleString()} {goal.unit}
										</span>
									</div>
									<Progress value={goal.progress} className="h-2" />
									<p className="text-xs text-muted-foreground">
										{goal.daysLeft} days left to achieve this goal
									</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Recent Achievements */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">Recent Achievements</h2>
				<div className="grid gap-4 md:grid-cols-3">
					{achievements.map(achievement => (
						<Card key={achievement.id}>
							<CardContent className="pt-6">
								<div className="flex items-center gap-4">
									<div
										className={cn('rounded-full p-2', {
											'bg-yellow-500/10 text-yellow-500':
												achievement.type === 'gold',
											'bg-gray-300/10 text-gray-300':
												achievement.type === 'silver',
											'bg-amber-600/10 text-amber-600':
												achievement.type === 'bronze',
										})}
									>
										<achievement.icon className="h-6 w-6" />
									</div>
									<div className="space-y-1">
										<h3 className="font-medium leading-none">
											{achievement.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{achievement.description}
										</p>
										<p className="text-xs text-muted-foreground">
											Achieved on{' '}
											{new Date(achievement.date).toLocaleDateString()}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	)
}
