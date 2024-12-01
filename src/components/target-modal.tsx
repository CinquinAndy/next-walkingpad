/**
 * @file src/components/target-modal.tsx
 */
'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Flame, Footprints, Ruler } from 'lucide-react'

interface TargetModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

interface PresetOption {
	value: string
	label: string
	description: string
}

const presetsByType: Record<string, PresetOption[]> = {
	distance: [
		{ value: '1.0', label: 'Quick Walk', description: 'Easy 1 km walk' },
		{
			value: '2.5',
			label: 'Regular Walk',
			description: '2.5 km moderate walk',
		},
		{ value: '5.0', label: 'Long Walk', description: '5 km challenging walk' },
		{
			value: '10.0',
			label: 'Endurance',
			description: '10 km endurance training',
		},
	],
	steps: [
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
	calories: [
		{
			value: '100',
			label: 'Light Burn',
			description: '100 kcal light workout',
		},
		{ value: '200', label: 'Moderate', description: '200 kcal moderate burn' },
		{
			value: '300',
			label: 'High Burn',
			description: '300 kcal intensive workout',
		},
		{ value: '500', label: 'Max Burn', description: '500 kcal maximum burn' },
	],
}

export function TargetModal({ open, onOpenChange }: TargetModalProps) {
	const [selectedValue, setSelectedValue] = useState<string>('')
	const [customValue, setCustomValue] = useState<string>('')
	const [activeTab, setActiveTab] = useState('distance')

	const handleSelect = (value: string) => {
		setSelectedValue(value)
		setCustomValue('')
	}

	const handleConfirm = () => {
		const value = customValue || selectedValue
		if (value) {
			console.log(`Setting ${activeTab} target to: ${value}`)
			onOpenChange(false)
		}
	}

	const getUnit = (type: string) => {
		switch (type) {
			case 'distance':
				return 'km'
			case 'steps':
				return 'steps'
			case 'calories':
				return 'kcal'
			default:
				return ''
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-2xl">Choose Your Target</DialogTitle>
				</DialogHeader>

				<Tabs
					defaultValue="distance"
					className="w-full"
					onValueChange={setActiveTab}
				>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="distance" className="flex items-center gap-2">
							<Ruler className="h-4 w-4" />
							Distance
						</TabsTrigger>
						<TabsTrigger value="steps" className="flex items-center gap-2">
							<Footprints className="h-4 w-4" />
							Steps
						</TabsTrigger>
						<TabsTrigger value="calories" className="flex items-center gap-2">
							<Flame className="h-4 w-4" />
							Calories
						</TabsTrigger>
					</TabsList>

					{Object.entries(presetsByType).map(([type, presets]) => (
						<TabsContent key={type} value={type} className="space-y-6">
							{/* Current Target Display */}
							<div className="flex flex-col items-center gap-2 border-b py-4">
								<div className="text-4xl font-bold">
									{customValue || selectedValue || presets[0].value}
									<span className="ml-2 text-2xl text-muted-foreground">
										{getUnit(type)}
									</span>
								</div>
								<div className="text-sm text-muted-foreground">
									Set your target {type}
								</div>
							</div>

							{/* Preset Options */}
							<div className="grid grid-cols-2 gap-3">
								{presets.map(preset => (
									<button
										key={preset.value}
										onClick={() => handleSelect(preset.value)}
										className={`rounded-lg p-4 text-left transition-colors ${
											selectedValue === preset.value
												? 'bg-primary text-primary-foreground'
												: 'bg-muted hover:bg-muted/80'
										}`}
									>
										<div className="font-medium">
											{preset.value} {getUnit(type)}
										</div>
										<div className="mt-1 text-sm opacity-90">
											{preset.label}
										</div>
									</button>
								))}
							</div>

							{/* Custom Input */}
							<div className="space-y-3">
								<label className="text-sm font-medium">Custom Target</label>
								<Input
									type="text"
									placeholder={`Enter ${type} target...`}
									value={customValue}
									onChange={e => {
										setCustomValue(e.target.value)
										setSelectedValue('')
									}}
									className="text-lg"
								/>
							</div>

							<Button
								onClick={handleConfirm}
								className="w-full"
								size="lg"
								disabled={!selectedValue && !customValue}
							>
								Set Target
							</Button>
						</TabsContent>
					))}
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
