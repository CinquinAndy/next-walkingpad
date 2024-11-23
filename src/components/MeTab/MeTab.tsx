/**
 * @file src/components/MeTab/MeTab.tsx
 * Profile and statistics tab component
 */

import { useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserProfile, ExerciseSession, calculateBMI } from '@/lib/types'

/**
 * Props for the exercise summary card component
 */
interface SummaryCardProps {
	title: string
	value: string | number
	unit?: string
	bgColor: string
}

/**
 * Exercise summary card component
 */
const SummaryCard: React.FC<SummaryCardProps> = ({
	title,
	value,
	unit,
	bgColor,
}) => (
	<Card className={`${bgColor} transition-all hover:scale-[1.02]`}>
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
 * Exercise history item component
 */
const ExerciseHistoryItem: React.FC<{ session: ExerciseSession }> = ({
	session,
}) => {
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(session.date)

	return (
		<Card className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
			<CardContent className="p-4">
				<p className="font-semibold">
					{formattedDate} - {session.distance.toFixed(1)} km, {session.calories}{' '}
					kcal, {session.steps.toLocaleString()} steps
				</p>
				<p className="text-muted-foreground">
					Duration: {Math.floor(session.duration / 60)} minutes
				</p>
			</CardContent>
		</Card>
	)
}

/**
 * Mock data - Replace with actual API calls
 */
const mockProfile: UserProfile = {
	firstName: 'John',
	lastName: 'Doe',
	age: 30,
	height: 180,
	weight: 75,
	profilePicture: '/placeholder-avatar.png',
}

const mockSessions: ExerciseSession[] = [
	{
		id: '1',
		date: new Date(),
		duration: 2700, // 45 minutes
		distance: 5.2,
		steps: 7500,
		calories: 320,
		avgSpeed: 4.2,
	},
	{
		id: '2',
		date: new Date(Date.now() - 86400000), // Yesterday
		duration: 2400, // 40 minutes
		distance: 4.8,
		steps: 6800,
		calories: 290,
		avgSpeed: 4.0,
	},
]

/**
 * MeTab component displaying user profile and exercise history
 */
export default function MeTab() {
	const [profile] = useState<UserProfile>(mockProfile)
	const [sessions] = useState<ExerciseSession[]>(mockSessions)

	// Calculate total statistics
	const totalStats = sessions.reduce(
		(acc, session) => ({
			distance: acc.distance + session.distance,
			steps: acc.steps + session.steps,
			calories: acc.calories + session.calories,
			duration: acc.duration + session.duration,
		}),
		{ distance: 0, steps: 0, calories: 0, duration: 0 }
	)

	return (
		<div className="space-y-6 p-6">
			{/* Profile Header */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center space-x-6">
						<div className="relative">
							<Image
								src={profile.profilePicture || '/placeholder-avatar.png'}
								alt="Profile"
								width={80}
								height={80}
								className="rounded-full"
							/>
							<Button
								size="icon"
								variant="secondary"
								className="absolute -bottom-2 -right-2 rounded-full"
								onClick={() => console.info('TODO: Implement photo upload')}
							>
								<Camera className="h-4 w-4" />
							</Button>
						</div>
						<div>
							<h2 className="text-2xl font-semibold">
								{profile.firstName} {profile.lastName}
							</h2>
							<p className="text-muted-foreground">
								{profile.age} years, {profile.height} cm, {profile.weight} kg
							</p>
							<p className="text-sm text-muted-foreground">
								BMI: {calculateBMI(profile.height, profile.weight)}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Exercise Summary */}
			<section className="space-y-4">
				<h3 className="text-xl font-semibold">Exercise Summary</h3>
				<div className="grid grid-cols-2 gap-4">
					<SummaryCard
						title="Total Distance"
						value={totalStats.distance.toFixed(1)}
						unit="km"
						bgColor="bg-blue-100 dark:bg-blue-900"
					/>
					<SummaryCard
						title="Total Calories"
						value={totalStats.calories.toLocaleString()}
						unit="kcal"
						bgColor="bg-green-100 dark:bg-green-900"
					/>
					<SummaryCard
						title="Total Steps"
						value={totalStats.steps.toLocaleString()}
						bgColor="bg-yellow-100 dark:bg-yellow-900"
					/>
					<SummaryCard
						title="Total Time"
						value={`${Math.floor(totalStats.duration / 3600)}h ${Math.floor(
							(totalStats.duration % 3600) / 60
						)}m`}
						bgColor="bg-purple-100 dark:bg-purple-900"
					/>
				</div>
			</section>

			{/* Recent Exercises */}
			<section className="space-y-4">
				<h3 className="text-xl font-semibold">Recent Exercises</h3>
				<div className="space-y-2">
					{sessions.map(session => (
						<ExerciseHistoryItem key={session.id} session={session} />
					))}
				</div>
			</section>
		</div>
	)
}
