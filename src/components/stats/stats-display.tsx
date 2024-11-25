/**
 * @file src/components/stats/stats-display.tsx
 * Enhanced stats display component with icons and colors
 */

import { Card, CardContent } from '@/components/ui/card'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import type { StatConfig } from '@/lib/types'
import { Flame, Footprints, Navigation2, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
	title: string
	value: string
	unit?: string
	subtitle?: string
	icon: React.ReactNode
	className?: string
	iconClassName?: string
}

/**
 * Individual stat card component with enhanced styling
 */
const StatCard = ({
	title,
	value,
	unit,
	subtitle,
	icon,
	className,
	iconClassName,
}: StatCardProps) => (
	<Card>
		<CardContent
			className={cn(
				'flex items-start gap-4 p-6 transition-all hover:bg-muted/50',
				className
			)}
		>
			<div className={cn('rounded-full p-2 transition-colors', iconClassName)}>
				{icon}
			</div>
			<div className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">{title}</p>
				<div className="flex items-baseline gap-1">
					<span className="text-2xl font-bold tracking-tight">{value}</span>
					{unit && (
						<span className="text-sm text-muted-foreground">{unit}</span>
					)}
				</div>
				{subtitle && (
					<p className="text-xs text-muted-foreground">{subtitle}</p>
				)}
			</div>
		</CardContent>
	</Card>
)

/**
 * Stats configuration with icons and styling
 */
const STATS_CONFIG: (StatConfig & {
	icon: React.ReactNode
	className: string
	iconClassName: string
})[] = [
	{
		key: 'distance',
		title: 'Distance',
		unit: 'km',
		format: (v: number) => v.toFixed(2),
		icon: <Navigation2 className="h-5 w-5" />,
		className: 'hover:shadow-blue-500/20',
		iconClassName: 'bg-blue-500/10 text-blue-500',
	},
	{
		key: 'steps',
		title: 'Steps',
		format: (v: number) => v.toLocaleString(),
		icon: <Footprints className="h-5 w-5" />,
		className: 'hover:shadow-green-500/20',
		iconClassName: 'bg-green-500/10 text-green-500',
	},
	{
		key: 'calories',
		title: 'Calories',
		unit: 'kcal',
		format: (v: number) => v.toLocaleString(),
		icon: <Flame className="h-5 w-5" />,
		className: 'hover:shadow-orange-500/20',
		iconClassName: 'bg-orange-500/10 text-orange-500',
	},
	{
		key: 'duration',
		title: 'Duration',
		format: (v: string) => v,
		icon: <Timer className="h-5 w-5" />,
		className: 'hover:shadow-purple-500/20',
		iconClassName: 'bg-purple-500/10 text-purple-500',
	},
]

/**
 * Main stats display component
 */
export function StatsDisplay() {
	const stats = useWalkingPadStore(state => state.stats)

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
			{STATS_CONFIG.map(
				({ key, title, unit, format, icon, className, iconClassName }) => (
					<StatCard
						key={key}
						title={title}
						value={format(stats[key as keyof ExerciseStats] as never)}
						unit={unit}
						icon={icon}
						className={className}
						iconClassName={iconClassName}
					/>
				)
			)}
		</div>
	)
}
