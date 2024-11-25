/**
 * @file src/components/controls/speed-control.tsx
 * Control component for starting sessions
 */
'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Play } from 'lucide-react'

const API_BASE = 'http://localhost:5678/api'

export function SpeedControl() {
	const router = useRouter()
	const { toast } = useToast()

	const handleStartSession = async () => {
		try {
			// Start the device
			const response = await fetch(`${API_BASE}/device/start`, {
				method: 'POST',
			})

			if (!response.ok) {
				throw new Error('Failed to start device')
			}

			// Redirect to session page
			router.push('/session')
		} catch (error) {
			toast({
				title: 'Start Failed',
				description:
					error instanceof Error ? error.message : 'Could not start session',
				variant: 'destructive',
			})
		}
	}

	return (
		<Card className="w-full p-6">
			<Button size="lg" className="w-full" onClick={handleStartSession}>
				<Play className="mr-2 h-5 w-5" />
				Start New Session
			</Button>
		</Card>
	)
}
