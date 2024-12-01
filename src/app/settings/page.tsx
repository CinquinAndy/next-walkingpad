/**
 * @file src/app/settings/page.tsx
 */
'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface DeviceSettings {
	maxSpeed: number
	startSpeed: number
	startupType: 'standing' | 'walking'
	sensitivity: 'low' | 'medium' | 'high'
	childSafety: boolean
}

export default function SettingsPage() {
	const router = useRouter()
	const [isCalibrating, setIsCalibrating] = useState(false)
	const [settings, setSettings] = useState<DeviceSettings>({
		maxSpeed: 6.0,
		startSpeed: 2.0,
		startupType: 'standing',
		sensitivity: 'medium',
		childSafety: false,
	})

	const handleCalibration = () => {
		setIsCalibrating(true)
		// Simulate calibration process
		setTimeout(() => {
			setIsCalibrating(false)
			console.log('Calibration completed')
		}, 3000)
	}

	return (
		<div className="min-h-screen bg-background">
			<header className="flex items-center border-b p-4">
				<button
					onClick={() => router.back()}
					className="rounded-full p-2 hover:bg-muted"
				>
					<ArrowLeft className="h-6 w-6" />
				</button>
				<h1 className="ml-4 text-xl font-semibold">Device Settings</h1>
			</header>

			<div className="container mx-auto max-w-md space-y-8 p-4">
				{/* Device Status */}
				<div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
					<div className="flex items-center gap-4">
						<Image
							src="/placeholder.svg?height=48&width=96"
							alt="WalkingPad"
							width={96}
							height={48}
							className="rounded-md"
						/>
						<div>
							<h3 className="font-medium">WalkingPad P1</h3>
							<p className="text-sm text-destructive">Disconnected</p>
						</div>
					</div>
					<Button variant="secondary">Reconnect</Button>
				</div>

				{/* Speed Settings */}
				<div className="space-y-6">
					{/* Maximum Speed */}
					<div className="space-y-4">
						<Label>Maximum Speed ({settings.maxSpeed.toFixed(1)} km/h)</Label>
						<Slider
							value={[settings.maxSpeed]}
							min={0.5}
							max={6.0}
							step={0.1}
							onValueChange={([value]) =>
								setSettings(prev => ({ ...prev, maxSpeed: value }))
							}
						/>
					</div>

					{/* Starting Speed */}
					<div className="space-y-4">
						<Label>
							Starting Speed ({settings.startSpeed.toFixed(1)} km/h)
						</Label>
						<Slider
							value={[settings.startSpeed]}
							min={0.5}
							max={4.0}
							step={0.1}
							onValueChange={([value]) =>
								setSettings(prev => ({ ...prev, startSpeed: value }))
							}
						/>
					</div>

					{/* Manual Mode Startup */}
					<div className="space-y-2">
						<Label>Manual Mode Startup</Label>
						<Select
							value={settings.startupType}
							onValueChange={(value: 'standing' | 'walking') =>
								setSettings(prev => ({ ...prev, startupType: value }))
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="standing">Standing Start</SelectItem>
								<SelectItem value="walking">Walking Start</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Auto Mode Sensitivity */}
					<div className="space-y-2">
						<Label>Auto Mode Sensitivity</Label>
						<Select
							value={settings.sensitivity}
							onValueChange={(value: 'low' | 'medium' | 'high') =>
								setSettings(prev => ({ ...prev, sensitivity: value }))
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">Low</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="high">High</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Child Safety */}
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<Label>Child Safety Lock</Label>
							<p className="text-sm text-muted-foreground">
								Prevent accidental activation
							</p>
						</div>
						<Switch
							checked={settings.childSafety}
							onCheckedChange={checked =>
								setSettings(prev => ({ ...prev, childSafety: checked }))
							}
						/>
					</div>

					{/* Belt Calibration */}
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="secondary"
								className="w-full"
								disabled={isCalibrating}
							>
								{isCalibrating ? 'Calibrating...' : 'Start Belt Calibration'}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Start Belt Calibration?</AlertDialogTitle>
								<AlertDialogDescription>
									This process will take about 2-3 minutes. Please ensure no one
									is standing on the walking pad during calibration.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleCalibration}>
									Start Calibration
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</div>
	)
}
