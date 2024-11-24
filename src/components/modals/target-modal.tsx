/**
 * @file src/components/modals/target-modal.tsx
 * Modal component for setting exercise targets
 */
'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Clock, Ruler, Flame, Footprints } from 'lucide-react'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { useToast } from '@/hooks/use-toast'
import type { TargetType } from '@/store/walking-pad.store'

interface TargetModalProps {
	children: React.ReactNode // Trigger element
}

/**
 * Target type configuration
 */
interface TargetConfig {
	icon: React.ReactNode
	label: string
	unit: string
	presets: Array<{
		value: string
		label: string
		description: string
	}>
}

/**
 * Target configurations by type
 */
const TARGET_CONFIGS: Record<TargetType, TargetConfig> = {
	distance: {
		icon: <Ruler className="h-4 w-4" />,
		label: 'Distance',
		unit: 'km',
		presets: [
			{ value: '1.0', label: 'Quick Walk', description: 'Easy 1 km walk' },
			{
				value: '2.5',
				label: 'Regular Walk',
				description: '2.5 km moderate walk',
			},
			{
				value: '5.0',
				label: 'Long Walk',
				description: '5 km challenging walk',
			},
			{
				value: '10.0',
				label: 'Endurance',
				description: '10 km endurance training',
			},
		],
	},
	steps: {
		icon: <Footprints className="h-4 w-4" />,
		label: 'Steps',
		unit: 'steps',
		presets: [
			{
				value: '5000',
				label: 'Basic Goal',
				description: '5,000 steps daily target',
			},
			{
				value: '8000',
				label: 'Active Goal',
				description: '8,000 steps for active lifestyle',
			},
			{
				value: '10000',
				label: 'Fitness Goal',
				description: '10,000 steps fitness target',
			},
			{
				value: '15000',
				label: 'Advanced',
				description: '15,000 steps advanced target',
			},
		],
	},
	calories: {
		icon: <Flame className="h-4 w-4" />,
		label: 'Calories',
		unit: 'kcal',
		presets: [
			{
				value: '100',
				label: 'Light Burn',
				description: '100 kcal light workout',
			},
			{
				value: '200',
				label: 'Moderate',
				description: '200 kcal moderate burn',
			},
			{
				value: '300',
				label: 'High Burn',
				description: '300 kcal intensive workout',
			},
			{ value: '500', label: 'Max Burn', description: '500 kcal maximum burn' },
		],
	},
	duration: {
		icon: <Clock className="h-4 w-4" />,
		label: 'Duration',
		unit: 'min',
		presets: [
			{
				value: '15',
				label: 'Quick Session',
				description: '15 minutes quick workout',
			},
			{
				value: '30',
				label: 'Regular Session',
				description: '30 minutes standard workout',
			},
			{
				value: '45',
				label: 'Extended Session',
				description: '45 minutes extended workout',
			},
			{
				value: '60',
				label: 'Long Session',
				description: '60 minutes full workout',
			},
		],
	},
}

/**
 * Preset option component
 */
function PresetOption({
	value,
	label,
	description,
	selected,
	onClick,
}: {
	value: string
	label: string
	description: string
	selected: boolean
	onClick: () => void
}) {
	return (
		<button
			onClick={onClick}
			className={`w-full rounded-lg p-4 text-left transition-colors ${
				selected
					? 'bg-primary text-primary-foreground'
					: 'bg-muted hover:bg-muted/80'
			}`}
		>
			<div className="font-medium">{label}</div>
			<div className="mt-1 text-sm opacity-90">{description}</div>
		</button>
	)
}

/**
 * TargetModal Component
 */
export function TargetModal({ children }: TargetModalProps) {
	const [open, setOpen] = useState(false)
	const [activeTab, setActiveTab] = useState<TargetType>('distance')
	const [selectedValue, setSelectedValue] = useState<string>('')
	const [customValue, setCustomValue] = useState<string>('')

	const { setTarget, currentTarget } = useWalkingPadStore()
	const { toast } = useToast()

	/**
	 * Handles target confirmation
	 */
	const handleConfirm = () => {
		const value = parseFloat(customValue || selectedValue)
		if (!isNaN(value)) {
			setTarget({
				type: activeTab,
				value,
				unit: TARGET_CONFIGS[activeTab].unit,
			})
			toast({
				title: 'Target Set',
				description: `New target: ${value} ${TARGET_CONFIGS[activeTab].unit} ${activeTab}`,
			})
			setOpen(false)
			resetForm()
		}
	}

	/**
	 * Resets form state
	 */
	const resetForm = () => {
		setSelectedValue('')
		setCustomValue('')
		setActiveTab('distance')
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-2xl">Set Exercise Target</DialogTitle>
				</DialogHeader>

				<Tabs
					defaultValue="distance"
					className="w-full"
					value={activeTab}
					onValueChange={value => setActiveTab(value as TargetType)}
				>
					{/* Tab List */}
					<TabsList className="grid w-full grid-cols-4">
						{(Object.keys(TARGET_CONFIGS) as TargetType[]).map(type => (
							<TabsTrigger
								key={type}
								value={type}
								className="flex items-center gap-2"
							>
								{TARGET_CONFIGS[type].icon}
								{TARGET_CONFIGS[type].label}
							</TabsTrigger>
						))}
					</TabsList>

					{/* Tab Contents */}
					{(Object.keys(TARGET_CONFIGS) as TargetType[]).map(type => (
						<TabsContent key={type} value={type} className="space-y-6">
							{/* Current Target Display */}
							<div className="flex flex-col items-center gap-2 border-b py-4">
								<div className="text-4xl font-bold">
									{customValue || selectedValue || '0'}
									<span className="ml-2 text-2xl text-muted-foreground">
										{TARGET_CONFIGS[type].unit}
									</span>
								</div>
								<div className="text-sm text-muted-foreground">
									Set your target {TARGET_CONFIGS[type].label.toLowerCase()}
								</div>
							</div>

							{/* Preset Options */}
							<div className="grid grid-cols-2 gap-3">
								{TARGET_CONFIGS[type].presets.map(preset => (
									<PresetOption
										key={preset.value}
										{...preset}
										selected={selectedValue === preset.value}
										onClick={() => {
											setSelectedValue(preset.value)
											setCustomValue('')
										}}
									/>
								))}
							</div>

							{/* Custom Input */}
							<div className="space-y-3">
								<label className="text-sm font-medium">Custom Target</label>
								<Input
									type="number"
									min="0"
									step={type === 'distance' ? '0.1' : '1'}
									placeholder={`Enter ${type} target...`}
									value={customValue}
									onChange={e => {
										setCustomValue(e.target.value)
										setSelectedValue('')
									}}
									className="text-lg"
								/>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end gap-3">
								<Button
									variant="outline"
									onClick={() => {
										setOpen(false)
										resetForm()
									}}
								>
									Cancel
								</Button>
								<Button
									onClick={handleConfirm}
									disabled={!selectedValue && !customValue}
								>
									Set Target
								</Button>
							</div>
						</TabsContent>
					))}
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
