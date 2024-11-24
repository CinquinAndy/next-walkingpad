// /**
//  * @file src/components/MeTab/MeTab.tsx
//  * Profile and exercise history component
//  */
//
// 'use client'
//
// import { useMemo } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Button } from '@/components/ui/button'
// import {
// 	Clock,
// 	Flame,
// 	MapPin,
// 	FootprintsIcon,
// 	ChevronRight,
// 	ArrowLeft,
// } from 'lucide-react'
// import { BarChart, Bar, ResponsiveContainer } from 'recharts'
// import { cn } from '@/lib/utils'
//
// /**
//  * Types for exercise data
//  */
// interface ExerciseActivity {
// 	type: string
// 	distance: string
// 	duration: string
// 	calories: string
// 	time: string
// }
//
// interface ExerciseStats {
// 	icon: React.ReactNode
// 	label: string
// 	value: string
// 	unit: string
// 	color: string
// 	data: Array<{ name: string; value: number }>
// }
//
// interface DailyStat {
// 	icon: React.ReactNode
// 	label: string
// 	value: string
// 	unit: string
// 	color: string
// }
//
// /**
//  * Stats card with chart component
//  */
// const StatsCard: React.FC<ExerciseStats> = ({
// 	icon,
// 	label,
// 	value,
// 	unit,
// 	color,
// 	data,
// }) => (
// 	<div className="flex items-center gap-4">
// 		<div className={color}>{icon}</div>
// 		<div className="flex-1">
// 			<div className="flex items-baseline justify-between">
// 				<div className="text-muted-foreground">{label}</div>
// 				<ChevronRight className="h-5 w-5 text-muted-foreground" />
// 			</div>
// 			<div className="flex items-end gap-2">
// 				<div className="text-2xl font-bold">{value}</div>
// 				<div className="text-sm text-muted-foreground">{unit}</div>
// 			</div>
// 			<div className="mt-2 h-8">
// 				<ResponsiveContainer width="100%" height="100%">
// 					<BarChart data={data}>
// 						<Bar
// 							dataKey="value"
// 							fill="currentColor"
// 							className="fill-primary/20"
// 							radius={[2, 2, 0, 0]}
// 						/>
// 					</BarChart>
// 				</ResponsiveContainer>
// 			</div>
// 		</div>
// 	</div>
// )
//
// /**
//  * Daily stats card component
//  */
// const DailyStatCard: React.FC<DailyStat> = ({
// 	icon,
// 	label,
// 	value,
// 	unit,
// 	color,
// }) => (
// 	<Card>
// 		<CardContent className="pt-6">
// 			<div className="flex flex-col items-center gap-2">
// 				<div className={color}>{icon}</div>
// 				<div className="text-sm text-muted-foreground">
// 					{label}({unit})
// 				</div>
// 				<div className="text-3xl font-bold">{value}</div>
// 			</div>
// 		</CardContent>
// 	</Card>
// )
//
// /**
//  * Activity record component
//  */
// const ActivityRecord: React.FC<ExerciseActivity> = ({
// 	type,
// 	distance,
// 	duration,
// 	calories,
// 	time,
// }) => (
// 	<div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted/70">
// 		<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
// 			<FootprintsIcon className="h-6 w-6 text-primary-foreground" />
// 		</div>
// 		<div className="flex-1">
// 			<div className="flex justify-between">
// 				<div className="font-medium">
// 					{type} {distance}km
// 				</div>
// 				<div className="text-sm text-muted-foreground">{time}</div>
// 			</div>
// 			<div className="text-sm text-muted-foreground">
// 				Duration: {duration}, Calories: {calories}Kcal
// 			</div>
// 		</div>
// 	</div>
// )
//
// /**
//  * Generate mock chart data
//  */
// const generateMockChartData = () =>
// 	Array(7)
// 		.fill(0)
// 		.map((_, i) => ({
// 			name: `Day ${i + 1}`,
// 			value: Math.floor(Math.random() * 100),
// 		}))
//
// /**
//  * Main MeTab component
//  */
// export default function MeTab() {
// 	// Mock data
// 	const recentActivities: ExerciseActivity[] = [
// 		{
// 			type: 'Walking',
// 			distance: '1.95',
// 			duration: '00:46:56',
// 			calories: '137',
// 			time: '20:12',
// 		},
// 		{
// 			type: 'Walking',
// 			distance: '1.72',
// 			duration: '00:41:24',
// 			calories: '120',
// 			time: '19:13',
// 		},
// 		{
// 			type: 'Walking',
// 			distance: '1.34',
// 			duration: '00:32:18',
// 			calories: '94',
// 			time: '18:31',
// 		},
// 	]
//
// 	// Memoized chart data
// 	const chartData = useMemo(() => generateMockChartData(), [])
//
// 	// Exercise stats configuration
// 	const exerciseStats: ExerciseStats[] = [
// 		{
// 			icon: <Clock className="h-5 w-5" />,
// 			label: 'Duration',
// 			value: '2,080',
// 			unit: 'Minutes',
// 			color: 'text-purple-500',
// 			data: chartData,
// 		},
// 		{
// 			icon: <MapPin className="h-5 w-5" />,
// 			label: 'Distance',
// 			value: '81.1',
// 			unit: 'kilometres',
// 			color: 'text-orange-500',
// 			data: chartData,
// 		},
// 		{
// 			icon: <FootprintsIcon className="h-5 w-5" />,
// 			label: 'Steps',
// 			value: '195,520',
// 			unit: 'steps',
// 			color: 'text-blue-500',
// 			data: chartData,
// 		},
// 		{
// 			icon: <Flame className="h-5 w-5" />,
// 			label: 'Calories',
// 			value: '5,701',
// 			unit: 'Kcal',
// 			color: 'text-red-500',
// 			data: chartData,
// 		},
// 	]
//
// 	// Daily stats configuration
// 	const dailyStats: DailyStat[] = [
// 		{
// 			icon: <Clock className="h-8 w-8" />,
// 			label: 'Duration',
// 			value: '0',
// 			unit: 'Min',
// 			color: 'text-purple-500',
// 		},
// 		{
// 			icon: <MapPin className="h-8 w-8" />,
// 			label: 'Distance',
// 			value: '0',
// 			unit: 'km',
// 			color: 'text-orange-500',
// 		},
// 		{
// 			icon: <Flame className="h-8 w-8" />,
// 			label: 'Calories',
// 			value: '0',
// 			unit: 'Kcal',
// 			color: 'text-red-500',
// 		},
// 	]
//
// 	return (
// 		<div className="space-y-6">
// 			{/* Header */}
// 			<div className="flex items-center gap-4">
// 				<Button variant="ghost" size="icon" className="rounded-full">
// 					<ArrowLeft className="h-6 w-6" />
// 				</Button>
// 				<h1 className="text-2xl font-bold">Sports Data Center</h1>
// 			</div>
//
// 			{/* Accumulated Exercise */}
// 			<Card>
// 				<CardHeader>
// 					<div className="flex items-center justify-between">
// 						<CardTitle>Accumulated Exercise</CardTitle>
// 						<Button variant="ghost" size="icon">
// 							<ChevronRight className="h-5 w-5 text-muted-foreground" />
// 						</Button>
// 					</div>
// 				</CardHeader>
// 				<CardContent>
// 					<div className="space-y-8">
// 						<div>
// 							<div className="text-4xl font-bold">2,457</div>
// 							<div className="text-muted-foreground">Minutes</div>
// 						</div>
// 						<div className="grid grid-cols-3 gap-4">
// 							<div>
// 								<div className="text-2xl font-bold">6,581</div>
// 								<div className="text-sm text-muted-foreground">
// 									Calories(Kcal)
// 								</div>
// 							</div>
// 							<div>
// 								<div className="text-2xl font-bold">93.62</div>
// 								<div className="text-sm text-muted-foreground">
// 									Distance(km)
// 								</div>
// 							</div>
// 							<div>
// 								<div className="text-2xl font-bold">226,783</div>
// 								<div className="text-sm text-muted-foreground">Steps</div>
// 							</div>
// 						</div>
// 					</div>
// 				</CardContent>
// 			</Card>
//
// 			{/* Today's Stats */}
// 			<div className="grid grid-cols-3 gap-4">
// 				{dailyStats.map((stat, index) => (
// 					<DailyStatCard key={index} {...stat} />
// 				))}
// 			</div>
//
// 			{/* Movement Records */}
// 			<Card>
// 				<CardHeader>
// 					<div className="flex items-center justify-between">
// 						<CardTitle>Movement Records</CardTitle>
// 						<Button
// 							variant="ghost"
// 							className="text-sm text-muted-foreground hover:text-primary"
// 						>
// 							See more
// 						</Button>
// 					</div>
// 				</CardHeader>
// 				<CardContent>
// 					<ScrollArea className="h-[300px] pr-4">
// 						<div className="space-y-4">
// 							{recentActivities.map((activity, i) => (
// 								<ActivityRecord key={i} {...activity} />
// 							))}
// 						</div>
// 					</ScrollArea>
// 				</CardContent>
// 			</Card>
//
// 			{/* Exercise Data */}
// 			<Card>
// 				<CardHeader>
// 					<CardTitle>Exercise Data</CardTitle>
// 				</CardHeader>
// 				<CardContent className="space-y-6">
// 					{exerciseStats.map((stat, index) => (
// 						<StatsCard key={index} {...stat} />
// 					))}
// 				</CardContent>
// 			</Card>
// 		</div>
// 	)
// }
