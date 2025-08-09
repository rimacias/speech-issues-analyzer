"use client";

import { useAuth } from '@/lib/auth-context';
import { gameQuestions } from './data/questions';
import { GameSessionService } from './services/gameSessionService';
import type { Patient } from '@/types/patient';

// Components
import { PatientSelection } from './components/PatientSelection';
import { useRouter } from 'next/navigation';

export default function Game() {
    const { user } = useAuth();
    const router = useRouter();

    const handlePatientSelected = async (patient: Patient) => {
        if (!user?.uid) return;
        
        try {
            // Create game session
            const session = await GameSessionService.createGameSession({
                patientId: patient.id,
                userId: user.uid,
                patient: {
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    dateOfBirth: patient.dateOfBirth
                },
                totalQuestions: gameQuestions.length,
                maxScore: gameQuestions.reduce((sum, q) => sum + q.points, 0)
            });

            if(session){
                localStorage.setItem('gameSessionId', session.id);
                localStorage.setItem('patientId', patient.id);
                router.push(`/game/${session.id}`);
            }

        } catch (error) {
            console.error('Error creating game session:', error);
            // Handle error - maybe show a toast or alert
        }
    };
    return (
        <PatientSelection onPatientSelected={handlePatientSelected} />
    );
}
