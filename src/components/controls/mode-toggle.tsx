/**
 * @file src/components/controls/mode-toggle.tsx
 * Toggle component for switching between manual and automatic modes
 */

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WalkingPadMode } from '@/lib/types'
import { useWalkingPadStore } from '@/store/walking-pad.store'

/**
 * Mode configuration type
 */
interface ModeConfig {
	icon: React.ReactNode
	label: string
	description: string
}

/**
 * Available modes configuration
 */
const MODES: Record<WalkingPadMode, ModeConfig> = {
	manual: {
		icon: <Sun className="h-4 w-4" />,
		label: 'Manual',
		description: 'Control speed manually',
	},
	automatic: {
		icon: <Moon className="h-4 w-4" />,
		label: 'Automatic',
		description: 'Speed adjusts automatically',
	},
}

/**
 * ModeToggle Component
 * Provides a dropdown menu for switching between manual and automatic modes
 */
export function ModeToggle() {
	const { mode, setMode } = useWalkingPadStore()
	const { theme } = useTheme()

	const handleModeChange = (newMode: WalkingPadMode) => {
		setMode(newMode)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="h-9 w-9">
					{MODES[mode].icon}
					<span className="sr-only">Toggle mode</span>
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
