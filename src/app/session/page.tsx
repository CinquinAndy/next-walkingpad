/**
 * @file src/app/session/page.tsx
 * Exercise session page with controlled polling
 */
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Pause } from 'lucide-react'
import { useWalkingPadStore } from '@/store/walking-pad.store'
import { useSessionPolling } from '@/hooks/use-session-polling'

const API_BASE = 'http://localhost:5678/api'

/**
 * Statistics card component
 */
function StatCard({ label, value }: { label: string; value: string }) {
	return (
		<Card>
			<CardContent className="p-4">
				<p className="text-sm text-muted-foreground">{label}</p>
				<p className="mt-1 text-2xl font-bold">{value}</p>
			</CardContent>
		</Card>
	)
}

/**
 * Session page component
 */
export default function SessionPage() {
	const router = useRouter()
	const { stats, error } = useWalkingPadStore()
	const { isPolling, togglePolling } = useSessionPolling({ enabled: true })

	// Start polling when component mounts
	useEffect(() => {
		togglePolling(true)
		return () => togglePolling(false)
	}, [togglePolling])

	const handleEndSession = async () => {
		togglePolling(false) // Stop polling first

		try {
			// End the session
			await fetch(`${API_BASE}/device/stop`, { method: 'POST' })

			// Save the session
			await fetch(`${API_BASE}/exercise/save`, { method: 'POST' })

			router.push('/')
		} catch (error) {
			console.error('Failed to end session:', error)
			togglePolling(true) // Resume polling if error
		}
	}

	// Show errors if any
	if (error) {
		return (
			<Alert variant="destructive" className="m-4">
				<AlertDescription>{error.message}</AlertDescription>
			</Alert>
		)
	}

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					size="icon"
					onClick={handleEndSession}
					className="rounded-full"
				>
					<ArrowLeft className="h-6 w-6" />
				</Button>
				<div className="flex items-center gap-2">
					{!isPolling && (
						<Alert variant="destructive" className="py-2">
							<AlertDescription>Connection lost - Retrying...</AlertDescription>
						</Alert>
					)}
					<Button variant="destructive" onClick={handleEndSession}>
						<Pause className="mr-2 h-4 w-4" />
						End Session
					</Button>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<StatCard
					label="Speed"
					value={`${stats.currentSpeed.toFixed(1)} km/h`}
				/>
				<StatCard label="Distance" value={`${stats.distance.toFixed(2)} km`} />
				<StatCard label="Steps" value={stats.steps.toLocaleString()} />
				<StatCard label="Duration" value={stats.duration} />
			</div>

			{/* Calories Card */}
			<Card>
				<CardContent className="p-6">
					<h3 className="mb-2 text-lg font-semibold">Calories Burned</h3>
					<p className="text-3xl font-bold">{stats.calories}</p>
				</CardContent>
			</Card>
		</div>
	)
}
