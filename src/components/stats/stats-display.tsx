/**
 * @file src/components/stats/stats-display.tsx
 * Component for displaying current exercise statistics
 */

import { Card } from '@/components/ui/card'
import { ExerciseStats, useWalkingPadStore } from '@/store/walking-pad.store'
import type { PadStatus, StatConfig } from '@/lib/types'

interface StatCardProps {
	/** Title of the stat */
	title: string
	/** Value to display */
	value: string
	/** Optional unit to display after the value */
	unit?: string
	/** Optional subtitle */
	subtitle?: string
}

/**
 * Individual stat card component
 */
const StatCard = ({ title, value, unit, subtitle }: StatCardProps) => (
	<Card className="p-4">
		<h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
		<div className="mt-2 flex items-baseline">
			<span className="text-3xl font-bold tracking-tight">{value}</span>
			{unit && (
				<span className="ml-1 text-sm text-muted-foreground">{unit}</span>
			)}
		</div>
		{subtitle && (
			<p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
		)}
	</Card>
)

/**
 * Formats duration from seconds to MM:SS format
 */
const formatDuration = (duration: string): string => {
	const [minutes, seconds] = duration.split(':')
	return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

/**
 * Stats configuration for display
 */
const STATS_CONFIG: StatConfig[] = [
	{
		key: 'distance',
		title: 'Distance',
		unit: 'km',
		format: (v: number) => v.toFixed(2),
	},
	{
		key: 'steps',
		title: 'Steps',
		format: (v: number) => v.toLocaleString(),
	},
	{
		key: 'calories',
		title: 'Calories',
		unit: 'kcal',
		format: (v: number) => v.toLocaleString(),
	},
	{
		key: 'duration',
		title: 'Duration',
		format: (v: string) => formatDuration(v as string),
	},
] as const

/**
 * Main stats display component
 * Shows current exercise statistics in a grid layout
 */
export function StatsDisplay() {
	const stats = useWalkingPadStore(state => state.stats)

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
			{STATS_CONFIG.map(({ key, title, unit, format }) => (
				<StatCard
					key={key}
					title={title}
					value={format(stats[key as keyof ExerciseStats] as never)}
					unit={unit}
				/>
			))}
		</div>
	)
}
