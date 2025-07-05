import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface MedicationSchedule {
	medicationName: string;
	dosage: string;
	frequency: string;
	times: string[];
	withFood: boolean;
	duration: string;
	sideEffects: string[];
	interactions: string[];
}

export const medicationReminderTool = createTool({
	id: "medication-reminder",
	description: "Manage medication schedules, reminders, and provide medication information",
	inputSchema: z.object({
		action: z.enum(['add', 'list', 'check interactions', 'get info']).describe("Action to perform"),
		medicationName: z.enum(['ibuprofen', 'acetaminophen', 'aspirin', 'metformin', 'lisinopril', 'atorvastatin', 'omeprazole', 'levothyroxine', 'amlodipine', 'metoprolol', 'other']).optional().describe("Name of the medication"),
		dosage: z.enum(['200mg', '400mg', '500mg', '600mg', '800mg', '1000mg', '5mg', '10mg', '20mg', '25mg', '50mg', '100mg', '1 tablet', '2 tablets', 'other']).optional().describe("Dosage amount"),
		frequency: z.enum(['once daily', 'twice daily', 'three times daily', 'four times daily', 'every 4 hours', 'every 6 hours', 'every 8 hours', 'every 12 hours', 'as needed']).optional().describe("How often to take"),
		times: z.array(z.string()).optional().describe("Specific times to take medication"),
		withFood: z.boolean().optional().describe("Whether to take with food"),
		duration: z.enum(['3 days', '5 days', '7 days', '10 days', '2 weeks', '1 month', '3 months', '6 months', 'ongoing', 'as needed']).optional().describe("How long to take the medication"),
		currentMedications: z.array(z.enum(['ibuprofen', 'acetaminophen', 'aspirin', 'metformin', 'lisinopril', 'atorvastatin', 'omeprazole', 'levothyroxine', 'amlodipine', 'metoprolol'])).optional().describe("Current medications for interaction checking"),
	}),
	outputSchema: z.object({
		result: z.object({
			action: z.string(),
			schedule: z.object({
				medicationName: z.string(),
				dosage: z.string(),
				frequency: z.string(),
				times: z.array(z.string()),
				withFood: z.boolean(),
				duration: z.string(),
				sideEffects: z.array(z.string()),
				interactions: z.array(z.string()),
			}).optional(),
			reminders: z.array(z.string()).optional(),
			warnings: z.array(z.string()).optional(),
			information: z.string().optional(),
		}),
	}),
	execute: async ({ context }) => {
		return await manageMedication(context);
	},
});

const manageMedication = async (input: {
	action: 'add' | 'list' | 'check interactions' | 'get info';
	medicationName?: string;
	dosage?: string;
	frequency?: string;
	times?: string[];
	withFood?: boolean;
	duration?: string;
	currentMedications?: string[];
}): Promise<{ result: any }> => {
	const { action, medicationName, dosage, frequency, times, withFood, duration, currentMedications } = input;

	// Simplified medication database
	const medicationDB: Record<string, {
		commonSideEffects: string[];
		seriousSideEffects: string[];
		interactions: string[];
		withFood: boolean;
		commonDosages: string[];
		category: string;
	}> = {
		'ibuprofen': {
			commonSideEffects: ['stomach upset', 'nausea', 'dizziness'],
			seriousSideEffects: ['stomach bleeding', 'kidney problems', 'heart issues'],
			interactions: ['warfarin', 'aspirin', 'blood pressure medications'],
			withFood: true,
			commonDosages: ['200mg', '400mg', '600mg'],
			category: 'NSAID'
		},
		'acetaminophen': {
			commonSideEffects: ['rare at normal doses'],
			seriousSideEffects: ['liver damage with overdose'],
			interactions: ['warfarin', 'alcohol'],
			withFood: false,
			commonDosages: ['325mg', '500mg', '650mg'],
			category: 'Pain reliever'
		},
		'aspirin': {
			commonSideEffects: ['stomach upset', 'heartburn', 'nausea'],
			seriousSideEffects: ['stomach bleeding', 'allergic reactions'],
			interactions: ['warfarin', 'ibuprofen', 'diabetes medications'],
			withFood: true,
			commonDosages: ['81mg', '325mg', '500mg'],
			category: 'NSAID'
		},
		'metformin': {
			commonSideEffects: ['nausea', 'diarrhea', 'stomach upset'],
			seriousSideEffects: ['lactic acidosis', 'vitamin B12 deficiency'],
			interactions: ['alcohol', 'contrast dyes', 'certain antibiotics'],
			withFood: true,
			commonDosages: ['500mg', '850mg', '1000mg'],
			category: 'Diabetes medication'
		},
		'lisinopril': {
			commonSideEffects: ['dry cough', 'dizziness', 'fatigue'],
			seriousSideEffects: ['angioedema', 'kidney problems', 'high potassium'],
			interactions: ['potassium supplements', 'NSAIDs', 'lithium'],
			withFood: false,
			commonDosages: ['5mg', '10mg', '20mg'],
			category: 'ACE inhibitor'
		}
	};

	const warnings: string[] = [];
	const reminders: string[] = [];

	switch (action) {
		case 'add':
			if (!medicationName || !dosage || !frequency) {
				return {
					result: {
						action: 'error',
						warnings: ['Medication name, dosage, and frequency are required to add a medication.']
					}
				};
			}

			const normalizedMedName = medicationName.toLowerCase();
			const medInfo = Object.keys(medicationDB).find(key => 
				normalizedMedName.includes(key) || key.includes(normalizedMedName)
			);

			let sideEffects: string[] = [];
			let interactions: string[] = [];
			let recommendedWithFood = withFood ?? false;

			if (medInfo) {
				const dbInfo = medicationDB[medInfo];
				sideEffects = dbInfo.commonSideEffects;
				interactions = dbInfo.interactions;
				recommendedWithFood = dbInfo.withFood;

				if (withFood !== undefined && withFood !== dbInfo.withFood) {
					if (dbInfo.withFood) {
						warnings.push(`${medicationName} is typically taken with food to reduce stomach upset.`);
					} else {
						warnings.push(`${medicationName} can be taken with or without food.`);
					}
				}
			}

			// Generate reminder times if not provided
			let reminderTimes = times || [];
			if (!times || times.length === 0) {
				if (frequency.includes('once') || frequency.includes('daily')) {
					reminderTimes = ['09:00'];
				} else if (frequency.includes('twice') || frequency.includes('2')) {
					reminderTimes = ['09:00', '21:00'];
				} else if (frequency.includes('three') || frequency.includes('3')) {
					reminderTimes = ['08:00', '14:00', '20:00'];
				} else if (frequency.includes('four') || frequency.includes('4')) {
					reminderTimes = ['08:00', '12:00', '16:00', '20:00'];
				}
			}

			// Generate reminders
			reminderTimes.forEach(time => {
				const foodNote = recommendedWithFood ? ' with food' : '';
				reminders.push(`Take ${dosage} of ${medicationName} at ${time}${foodNote}`);
			});

			const schedule: MedicationSchedule = {
				medicationName,
				dosage,
				frequency,
				times: reminderTimes,
				withFood: recommendedWithFood,
				duration: duration || 'As prescribed',
				sideEffects,
				interactions
			};

			return {
				result: {
					action: 'added',
					schedule,
					reminders,
					warnings
				}
			};

		case 'check_interactions':
		case 'check interactions':
			if (!currentMedications || currentMedications.length === 0) {
				return {
					result: {
						action: 'no_medications',
						information: 'No medications provided for interaction checking.'
					}
				};
			}

			const interactionWarnings: string[] = [];
			const checkedMeds: string[] = [];

			currentMedications.forEach(med => {
				const normalizedMed = med.toLowerCase();
				const foundMed = Object.keys(medicationDB).find(key => 
					normalizedMed.includes(key) || key.includes(normalizedMed)
				);

				if (foundMed) {
					checkedMeds.push(foundMed);
				}
			});

			// Check for interactions between medications
			for (let i = 0; i < checkedMeds.length; i++) {
				for (let j = i + 1; j < checkedMeds.length; j++) {
					const med1 = checkedMeds[i];
					const med2 = checkedMeds[j];
					
					if (medicationDB[med1].interactions.includes(med2) || 
						medicationDB[med2].interactions.includes(med1)) {
						interactionWarnings.push(`Potential interaction between ${med1} and ${med2}. Consult your healthcare provider.`);
					}
				}
			}

			return {
				result: {
					action: 'interactions_checked',
					warnings: interactionWarnings.length > 0 ? interactionWarnings : ['No known interactions found between the provided medications.']
				}
			};

		case 'get_info':
		case 'get info':
			if (!medicationName) {
				return {
					result: {
						action: 'error',
						warnings: ['Medication name is required to get information.']
					}
				};
			}

			const normalizedInfoMed = medicationName.toLowerCase();
			const infoMed = Object.keys(medicationDB).find(key => 
				normalizedInfoMed.includes(key) || key.includes(normalizedInfoMed)
			);

			if (infoMed) {
				const info = medicationDB[infoMed];
				const infoText = `
${medicationName} (${info.category})

Common side effects: ${info.commonSideEffects.join(', ')}
Serious side effects: ${info.seriousSideEffects.join(', ')}
Common dosages: ${info.commonDosages.join(', ')}
Take with food: ${info.withFood ? 'Yes' : 'No'}
Known interactions: ${info.interactions.join(', ')}

Always follow your healthcare provider's instructions and report any unusual symptoms.
				`.trim();

				return {
					result: {
						action: 'info_provided',
						information: infoText
					}
				};
			} else {
				return {
					result: {
						action: 'info_not_found',
						information: `Information for ${medicationName} is not available in our database. Please consult your healthcare provider or pharmacist for detailed information.`
					}
				};
			}

		default:
			return {
				result: {
					action: 'error',
					warnings: ['Invalid action specified.']
				}
			};
	}
};