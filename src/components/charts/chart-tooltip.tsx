/**
 * @file src/components/charts/chart-tooltip.tsx
 * Custom tooltip component for activity charts
 */

import { Card } from '@/components/ui/card'

/**
 * Chart value formatter types
 */
type FormatterFunction = (value: number) => string

/**
 * Tooltip content configuration
 */
interface TooltipConfig {
	label: string
	formatter: FormatterFunction
}

/**
 * Props for ChartTooltip component
 */
interface ChartTooltipProps {
	active?: boolean
	payload?: Array<{
		value: number
		payload: {
			time: string
			[key: string]: any
		}
	}>
	dataKey: string
	config: TooltipConfig
}

/**
 * Default formatters for different metrics
 */
export const TOOLTIP_FORMATTERS = {
	steps: (value: number) => `${value.toLocaleString()} steps`,
	calories: (value: number) => `${value.toLocaleString()} kcal`,
	activity: (value: number) => `${value} minutes`,
	distance: (value: number) => `${value.toFixed(2)} km`,
	speed: (value: number) => `${value.toFixed(1)} km/h`,
} as const

/**
 * ChartTooltip Component
 * Displays detailed information when hovering over chart data points
 */
export function ChartTooltip({
	active,
	payload,
	dataKey,
	config,
}: ChartTooltipProps) {
	if (!active || !payload?.length) {
		return null
	}

	const data = payload[0]

	return (
		<Card className="border bg-background/95 p-3 shadow-md backdrop-blur-sm">
			<div className="grid grid-cols-2 gap-x-4 gap-y-2">
				<span className="text-sm text-muted-foreground">Time</span>
				<span className="text-sm font-medium">{data.payload.time}</span>

				<span className="text-sm text-muted-foreground">{config.label}</span>
				<span className="text-sm font-medium">
					{config.formatter(data.value)}
				</span>
			</div>
		</Card>
	)
}
