/**
 * @file src/components/charts/activity-chart.tsx
 * Component for displaying activity charts
 */
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { useWalkingPadStore } from '@/store/walking-pad.store'

/**
 * Chart configuration for different metrics
 */
const CHART_CONFIGS = {
	steps: {
		color: '#7c3aed',
		label: 'Steps',
		formatter: (value: number) => `${value.toLocaleString()} steps`,
	},
	calories: {
		color: '#10b981',
		label: 'Calories',
		formatter: (value: number) => `${value.toLocaleString()} kcal`,
	},
	activity: {
		color: '#6366f1',
		label: 'Activity Time',
		formatter: (value: number) => `${value} minutes`,
	},
} as const

type MetricType = keyof typeof CHART_CONFIGS

/**
 * Custom tooltip component for the chart
 */
function ChartTooltip({
	active,
	payload,
	metricType,
}: {
	active?: boolean
	payload?: any[]
	metricType: MetricType
}) {
	if (!active || !payload?.length) return null

	const config = CHART_CONFIGS[metricType]
	const value = payload[0].value

	return (
		<div className="rounded-lg border bg-background p-3 shadow-md">
			<div className="grid grid-cols-2 gap-2">
				<span className="font-medium">Time:</span>
				<span>{payload[0].payload.time}</span>
				<span className="font-medium">{config.label}:</span>
				<span>{config.formatter(value)}</span>
			</div>
		</div>
	)
}

/**
 * ActivityChart Component
 * Displays activity data in various chart formats
 */
export function ActivityChart() {
	const activityData = useWalkingPadStore(state => state.activityData)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Activity Tracking</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="steps" className="space-y-4">
					<TabsList className="grid w-full grid-cols-3">
						{Object.keys(CHART_CONFIGS).map(type => (
							<TabsTrigger key={type} value={type}>
								{CHART_CONFIGS[type as MetricType].label}
							</TabsTrigger>
						))}
					</TabsList>

					{Object.keys(CHART_CONFIGS).map(type => {
						const metricType = type as MetricType
						const config = CHART_CONFIGS[metricType]

						return (
							<TabsContent key={type} value={type}>
								<div className="h-[300px]">
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
												tickFormatter={value => value.toString()}
											/>
											<Tooltip
												content={({ active, payload }) => (
													<ChartTooltip
														active={active}
														payload={payload}
														metricType={metricType}
													/>
												)}
											/>
											<Line
												type="monotone"
												dataKey={type}
												stroke={config.color}
												strokeWidth={2}
												dot={false}
												activeDot={{ r: 4 }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</TabsContent>
						)
					})}
				</Tabs>
			</CardContent>
		</Card>
	)
}
