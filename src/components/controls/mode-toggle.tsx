/**
 * @file src/components/controls/mode-toggle.tsx
 * Toggle component for switching between manual and automatic modes
 */

import { Moon, Power, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type ModeConfig, WalkingPadMode } from '@/lib/types'
import { useWalkingPadStore } from '@/store/walking-pad.store'

/**
 * Available modes configuration
 */
const MODES: Record<WalkingPadMode, ModeConfig> = {
	[WalkingPadMode.STANDBY]: {
		icon: <Power className="h-4 w-4" />,
		label: 'Standby',
		description: 'Device in standby mode',
	},
	[WalkingPadMode.MANUAL]: {
		icon: <Sun className="h-4 w-4" />,
		label: 'Manual',
		description: 'Control speed manually',
	},
	[WalkingPadMode.AUTO]: {
		icon: <Moon className="h-4 w-4" />,
		label: 'Automatic',
		description: 'Speed adjusts automatically',
	},
}

/**
 * ModeToggle Component
 * Provides a dropdown menu for switching between operational modes
 */
export function ModeToggle() {
	const { mode, setMode } = useWalkingPadStore()

	const handleModeChange = async (newMode: WalkingPadMode) => {
		try {
			await setMode(newMode)
		} catch (error) {
			console.error('Failed to change mode:', error)
			// TODO: Show error toast
		}
	}

	// Current mode configuration
	const currentMode = MODES[mode] || MODES[WalkingPadMode.STANDBY]

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="h-9 w-9"
					title={`Current mode: ${currentMode.label}`}
				>
					{currentMode.icon}
					<span className="sr-only">Change operation mode</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{Object.entries(MODES).map(([modeKey, config]) => (
					<DropdownMenuItem
						key={modeKey}
						onClick={() => handleModeChange(modeKey as WalkingPadMode)}
						className={mode === modeKey ? 'bg-accent' : ''}
					>
						<div className="flex items-center gap-2">
							{config.icon}
							<div>
								<p className="font-medium">{config.label}</p>
								<p className="text-xs text-muted-foreground">
									{config.description}
								</p>
							</div>
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
