/**
 * @file src/components/stats/stats-card.tsx
 * Reusable card component for displaying statistics
 */

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'

/**
 * Stats card variants configuration
 */
const statsCardVariants = cva(
	'flex flex-col items-stretch rounded-lg transition-all duration-200',
	{
		variants: {
			variant: {
				default: '',
				increase: 'bg-emerald-50 dark:bg-emerald-500/10',
				decrease: 'bg-rose-50 dark:bg-rose-500/10',
			},
			size: {
				default: 'p-4',
				lg: 'p-6',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

/**
 * Change indicator props
 */
interface ChangeIndicator {
	type: 'increase' | 'decrease'
	value: number
	label?: string
}

/**
 * Stats card props interface
 */
interface StatsCardProps extends VariantProps<typeof statsCardVariants> {
	/** Main title/label for the stat */
	title: string
	/** The main value to display */
	value: string | number
	/** Descriptive unit (e.g., km, steps, kcal) */
	unit?: string
	/** Icon to display */
	icon?: LucideIcon
	/** Additional description */
	description?: string
	/** Change indicator showing increase/decrease */
	change?: ChangeIndicator
	/** Additional CSS classes */
	className?: string
}

/**
 * Helper function to format change values
 */
function formatChange(value: number): string {
	const formatted = Math.abs(value).toFixed(1)
	return `${value >= 0 ? '+' : '-'}${formatted}%`
}

/**
 * StatsCard Component
 * Displays a single statistic with optional icon and change indicator
 */
export function StatsCard({
	title,
	value,
	unit,
	icon: Icon,
	description,
	change,
	variant,
	size,
	className,
}: StatsCardProps) {
	return (
		<Card className={cn(statsCardVariants({ variant, size, className }))}>
			<CardContent className="space-y-2 p-6">
				{/* Header with icon and title */}
				<div className="flex items-center gap-2">
					{Icon && (
						<div className="rounded-md bg-primary/10 p-2 text-primary">
							<Icon className="h-5 w-5" />
						</div>
					)}
					<p className="text-sm font-medium text-muted-foreground">{title}</p>
				</div>

				{/* Main value display */}
				<div className="flex items-baseline space-x-2">
					<h2 className="text-3xl font-bold tracking-tight">
						{typeof value === 'number' ? value.toLocaleString() : value}
					</h2>
					{unit && (
						<span className="text-sm text-muted-foreground">{unit}</span>
					)}
				</div>

				{/* Change indicator and description */}
				<div className="space-y-1">
					{change && (
						<p
							className={cn(
								'flex items-center text-sm',
								change.type === 'increase'
									? 'text-emerald-600 dark:text-emerald-400'
									: 'text-rose-600 dark:text-rose-400'
							)}
						>
							<span className="font-medium">{formatChange(change.value)}</span>
							{change.label && (
								<span className="ml-1 text-muted-foreground">
									{change.label}
								</span>
							)}
						</p>
					)}
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

/**
 * Stats grid container component
 */
export function StatsCardGrid({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
			{children}
		</div>
	)
}
