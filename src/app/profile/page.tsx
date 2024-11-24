/**
 * @file src/app/profile/page.tsx
 * User profile and statistics page
 */
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ActivityChart } from '@/components/charts/activity-chart'
import { StatsCard, StatsCardGrid } from '@/components/stats/stats-card'
import { Edit2, Heart, Ruler, User, Weight } from 'lucide-react'
import Image from 'next/image'

/**
 * User profile data type
 */
interface UserProfile {
	name: string
	email: string
	age: number
	height: number
	weight: number
	bmi: number
	profileImage?: string
}

/**
 * Profile Page Component
 */
export default function ProfilePage() {
	// Example user data - replace with actual data fetching
	const [profile, setProfile] = useState<UserProfile>({
		name: 'John Doe',
		email: 'john.doe@example.com',
		age: 32,
		height: 175,
		weight: 70,
		bmi: 22.9,
	})

	const [isEditing, setIsEditing] = useState(false)

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">Profile</h1>
				<p className="mt-2 text-muted-foreground">
					Manage your personal information and view your statistics
				</p>
			</div>

			{/* Profile Overview */}
			<section className="grid gap-6 md:grid-cols-2">
				{/* Profile Card */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Personal Information</CardTitle>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsEditing(!isEditing)}
							>
								<Edit2 className="mr-2 h-4 w-4" />
								{isEditing ? 'Save' : 'Edit'}
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Profile Image */}
						<div className="flex justify-center">
							<div className="relative">
								<Image
									src={profile.profileImage || '/api/placeholder/150/150'}
									alt="Profile"
									width={150}
									height={150}
									className="rounded-full"
								/>
								{isEditing && (
									<Button
										variant="secondary"
										size="sm"
										className="absolute bottom-0 right-0"
									>
										Change
									</Button>
								)}
							</div>
						</div>

						<div className="space-y-4">
							{/* Name Input */}
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									value={profile.name}
									disabled={!isEditing}
									onChange={e =>
										setProfile({ ...profile, name: e.target.value })
									}
								/>
							</div>

							{/* Email Input */}
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={profile.email}
									disabled={!isEditing}
									onChange={e =>
										setProfile({ ...profile, email: e.target.value })
									}
								/>
							</div>

							{/* Physical Info */}
							<div className="grid grid-cols-3 gap-4">
								<div className="space-y-2">
									<Label htmlFor="age">Age</Label>
									<Input
										id="age"
										type="number"
										value={profile.age}
										disabled={!isEditing}
										onChange={e =>
											setProfile({
												...profile,
												age: parseInt(e.target.value),
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="height">Height (cm)</Label>
									<Input
										id="height"
										type="number"
										value={profile.height}
										disabled={!isEditing}
										onChange={e =>
											setProfile({
												...profile,
												height: parseInt(e.target.value),
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="weight">Weight (kg)</Label>
									<Input
										id="weight"
										type="number"
										value={profile.weight}
										disabled={!isEditing}
										onChange={e =>
											setProfile({
												...profile,
												weight: parseInt(e.target.value),
											})
										}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Health Metrics */}
				<div className="space-y-6">
					<StatsCardGrid className="grid-cols-2">
						<StatsCard
							title="BMI"
							value={profile.bmi}
							icon={Heart}
							description="Healthy Range"
							variant={
								profile.bmi >= 18.5 && profile.bmi <= 24.9
									? 'increase'
									: 'decrease'
							}
						/>
						<StatsCard
							title="Weight"
							value={profile.weight}
							unit="kg"
							icon={Weight}
							change={{
								type: 'decrease',
								value: -2.5,
								label: 'vs. last month',
							}}
						/>
						<StatsCard
							title="Height"
							value={profile.height}
							unit="cm"
							icon={Ruler}
						/>
						<StatsCard
							title="Age"
							value={profile.age}
							unit="years"
							icon={User}
						/>
					</StatsCardGrid>

					{/* Activity Overview */}
					<Card>
						<CardHeader>
							<CardTitle>Activity Overview</CardTitle>
						</CardHeader>
						<CardContent>
							<ActivityChart />
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	)
}
