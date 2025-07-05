import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface Exercise {
	name: string;
	type: 'cardio' | 'strength' | 'flexibility' | 'balance';
	duration: string;
	intensity: 'low' | 'moderate' | 'high';
	equipment: string[];
	instructions: string;
	benefits: string[];
}

interface WorkoutPlan {
	day: string;
	exercises: Exercise[];
	totalDuration: string;
	caloriesBurned: number;
	notes: string[];
}

export const exercisePlanTool = createTool({
	id: "exercise-plan",
	description: "Create personalized exercise plans and track workout progress",
	inputSchema: z.object({
		action: z.enum(['create plan', 'log workout', 'get exercise info', 'modify plan']).describe("Action to perform"),
		fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe("Current fitness level"),
		goals: z.array(z.enum(['weight loss', 'muscle gain', 'endurance', 'general fitness', 'strength', 'flexibility', 'cardiovascular health'])).optional().describe("Fitness goals"),
		availableTime: z.number().optional().describe("Available workout time in minutes"),
		equipment: z.array(z.enum(['none', 'dumbbells', 'resistance bands', 'yoga mat', 'treadmill', 'stationary bike', 'pull-up bar', 'kettlebells', 'barbell'])).optional().describe("Available equipment"),
		preferences: z.array(z.enum(['low impact', 'high intensity', 'outdoor activities', 'home workouts', 'gym workouts', 'group classes', 'solo workouts'])).optional().describe("Exercise preferences"),
		exerciseName: z.string().optional().describe("Specific exercise to get information about"),
		workoutCompleted: z.boolean().optional().describe("Whether the workout was completed"),
		duration: z.number().optional().describe("Actual workout duration in minutes"),
	}),
	outputSchema: z.object({
		result: z.object({
			action: z.string(),
			workoutPlan: z.array(z.object({
				day: z.string(),
				exercises: z.array(z.object({
					name: z.string(),
					type: z.enum(['cardio', 'strength', 'flexibility', 'balance']),
					duration: z.string(),
					intensity: z.enum(['low', 'moderate', 'high']),
					equipment: z.array(z.string()),
					instructions: z.string(),
					benefits: z.array(z.string()),
				})),
				totalDuration: z.string(),
				caloriesBurned: z.number(),
				notes: z.array(z.string()),
			})).optional(),
			exerciseInfo: z.string().optional(),
			progress: z.object({
				workoutsCompleted: z.number(),
				totalMinutes: z.number(),
				caloriesBurned: z.number(),
				streak: z.number(),
			}).optional(),
			recommendations: z.array(z.string()).optional(),
		}),
	}),
	execute: async ({ context }) => {
		return await manageExercise(context);
	},
});

const manageExercise = async (input: {
	action: 'create plan' | 'log workout' | 'get exercise info' | 'modify plan';
	fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
	goals?: string[];
	availableTime?: number;
	equipment?: string[];
	preferences?: string[];
	exerciseName?: string;
	workoutCompleted?: boolean;
	duration?: number;
}): Promise<{ result: any }> => {
	const { action, fitnessLevel, goals, availableTime, equipment, preferences, exerciseName, workoutCompleted, duration } = input;

	// Exercise database
	const exerciseDB: Record<string, Exercise> = {
		'push-ups': {
			name: 'Push-ups',
			type: 'strength',
			duration: '10-15 minutes',
			intensity: 'moderate',
			equipment: [],
			instructions: 'Start in plank position, lower body to ground, push back up. Keep core tight and body straight.',
			benefits: ['chest strength', 'arm strength', 'core stability']
		},
		'squats': {
			name: 'Squats',
			type: 'strength',
			duration: '10-15 minutes',
			intensity: 'moderate',
			equipment: [],
			instructions: 'Stand with feet shoulder-width apart, lower hips back and down, return to standing.',
			benefits: ['leg strength', 'glute strength', 'core stability']
		},
		'jumping jacks': {
			name: 'Jumping Jacks',
			type: 'cardio',
			duration: '5-10 minutes',
			intensity: 'moderate',
			equipment: [],
			instructions: 'Jump feet apart while raising arms overhead, then jump back to starting position.',
			benefits: ['cardiovascular health', 'full body coordination', 'calorie burning']
		},
		'plank': {
			name: 'Plank',
			type: 'strength',
			duration: '5-10 minutes',
			intensity: 'moderate',
			equipment: [],
			instructions: 'Hold body straight in push-up position, supporting weight on forearms and toes.',
			benefits: ['core strength', 'shoulder stability', 'posture improvement']
		},
		'burpees': {
			name: 'Burpees',
			type: 'cardio',
			duration: '10-15 minutes',
			intensity: 'high',
			equipment: [],
			instructions: 'Squat down, jump back to plank, do push-up, jump feet forward, jump up with arms overhead.',
			benefits: ['full body strength', 'cardiovascular fitness', 'calorie burning']
		},
		'lunges': {
			name: 'Lunges',
			type: 'strength',
			duration: '10-15 minutes',
			intensity: 'moderate',
			equipment: [],
			instructions: 'Step forward into lunge position, lower back knee toward ground, return to standing.',
			benefits: ['leg strength', 'balance', 'hip flexibility']
		},
		'mountain climbers': {
			name: 'Mountain Climbers',
			type: 'cardio',
			duration: '5-10 minutes',
			intensity: 'high',
			equipment: [],
			instructions: 'Start in plank position, alternate bringing knees to chest in running motion.',
			benefits: ['cardiovascular fitness', 'core strength', 'agility']
		},
		'yoga flow': {
			name: 'Yoga Flow',
			type: 'flexibility',
			duration: '15-30 minutes',
			intensity: 'low',
			equipment: ['yoga mat'],
			instructions: 'Flow through various yoga poses focusing on breath and flexibility.',
			benefits: ['flexibility', 'stress relief', 'balance']
		},
		'walking': {
			name: 'Brisk Walking',
			type: 'cardio',
			duration: '20-45 minutes',
			intensity: 'low',
			equipment: [],
			instructions: 'Walk at a brisk pace, maintain good posture, swing arms naturally.',
			benefits: ['cardiovascular health', 'low impact', 'mental health']
		},
		'deadlifts': {
			name: 'Deadlifts',
			type: 'strength',
			duration: '15-20 minutes',
			intensity: 'high',
			equipment: ['dumbbells', 'barbell'],
			instructions: 'Lift weight from ground to hip level, keep back straight, engage core.',
			benefits: ['posterior chain strength', 'functional movement', 'posture']
		}
	};

	const recommendations: string[] = [];

	switch (action) {
		case 'create plan':
		case 'create_plan': // Backward compatibility
			const level = fitnessLevel || 'beginner';
			const time = availableTime || 30;
			const userGoals = goals || ['general fitness'];
			const availableEquipment = equipment || [];

			// Filter exercises based on equipment and fitness level
			const suitableExercises = Object.values(exerciseDB).filter(exercise => {
				// Check equipment requirements
				const hasRequiredEquipment = exercise.equipment.length === 0 || 
					exercise.equipment.some(eq => availableEquipment.includes(eq));
				
				// Check intensity based on fitness level
				const intensityMatch = 
					(level === 'beginner' && exercise.intensity !== 'high') ||
					(level === 'intermediate') ||
					(level === 'advanced');

				return hasRequiredEquipment && intensityMatch;
			});

			// Create weekly plan
			const weeklyPlan: WorkoutPlan[] = [];
			const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

			daysOfWeek.forEach((day, index) => {
				let dayExercises: Exercise[] = [];
				let totalDuration = 0;
				let estimatedCalories = 0;
				const dayNotes: string[] = [];

				if (index === 1 || index === 3 || index === 5) { // Tuesday, Thursday, Saturday
					// Strength days
					const strengthExercises = suitableExercises.filter(ex => ex.type === 'strength');
					dayExercises = strengthExercises.slice(0, Math.min(4, Math.floor(time / 10)));
					totalDuration = dayExercises.length * 10;
					estimatedCalories = totalDuration * 6; // Rough estimate
					dayNotes.push('Focus on proper form over speed');
				} else if (index === 0 || index === 2 || index === 4) { // Monday, Wednesday, Friday
					// Cardio days
					const cardioExercises = suitableExercises.filter(ex => ex.type === 'cardio');
					const flexibilityExercises = suitableExercises.filter(ex => ex.type === 'flexibility');
					
					dayExercises = [
						...cardioExercises.slice(0, 2),
						...flexibilityExercises.slice(0, 1)
					];
					totalDuration = Math.min(time, 35);
					estimatedCalories = totalDuration * 8; // Higher calorie burn for cardio
					dayNotes.push('Stay hydrated during cardio exercises');
				} else { // Sunday
					// Rest or light activity day
					const lightExercises = suitableExercises.filter(ex => 
						ex.type === 'flexibility' || ex.intensity === 'low'
					);
					dayExercises = lightExercises.slice(0, 2);
					totalDuration = 20;
					estimatedCalories = totalDuration * 3;
					dayNotes.push('Active recovery day - focus on stretching and light movement');
				}

				weeklyPlan.push({
					day,
					exercises: dayExercises,
					totalDuration: `${totalDuration} minutes`,
					caloriesBurned: estimatedCalories,
					notes: dayNotes
				});
			});

			// Add goal-specific recommendations
			if (userGoals.includes('weight loss')) {
				recommendations.push('Focus on consistency and gradually increase intensity');
				recommendations.push('Combine exercise with a balanced diet for best results');
			}
			if (userGoals.includes('muscle gain')) {
				recommendations.push('Ensure adequate protein intake and rest between strength sessions');
				recommendations.push('Progressive overload - gradually increase difficulty');
			}
			if (userGoals.includes('endurance')) {
				recommendations.push('Gradually increase workout duration and intensity');
				recommendations.push('Include both cardio and strength training');
			}

			recommendations.push('Listen to your body and rest when needed');
			recommendations.push('Stay consistent - aim for at least 3-4 workouts per week');

			return {
				result: {
					action: 'plan_created',
					workoutPlan: weeklyPlan,
					recommendations
				}
			};

		case 'get_exercise_info':
		case 'get exercise info':
		case 'get_exercise_info': // Backward compatibility
			if (!exerciseName) {
				return {
					result: {
						action: 'error',
						exerciseInfo: 'Exercise name is required to get information.'
					}
				};
			}

			const normalizedExerciseName = exerciseName.toLowerCase();
			const foundExercise = Object.keys(exerciseDB).find(key => 
				normalizedExerciseName.includes(key) || key.includes(normalizedExerciseName)
			);

			if (foundExercise) {
				const exercise = exerciseDB[foundExercise];
				const infoText = `
${exercise.name}

Type: ${exercise.type}
Duration: ${exercise.duration}
Intensity: ${exercise.intensity}
Equipment needed: ${exercise.equipment.length > 0 ? exercise.equipment.join(', ') : 'None'}

Instructions: ${exercise.instructions}

Benefits: ${exercise.benefits.join(', ')}
				`.trim();

				return {
					result: {
						action: 'info_provided',
						exerciseInfo: infoText
					}
				};
			} else {
				return {
					result: {
						action: 'info_not_found',
						exerciseInfo: `Information for "${exerciseName}" is not available in our database. Try searching for common exercises like push-ups, squats, or jumping jacks.`
					}
				};
			}

		case 'log_workout':
		case 'log workout':
		case 'log_workout': // Backward compatibility
			const completed = workoutCompleted ?? false;
			const actualDuration = duration || 0;

			// Simulate progress tracking (in a real app, this would be stored)
			const progress = {
				workoutsCompleted: completed ? 1 : 0,
				totalMinutes: actualDuration,
				caloriesBurned: actualDuration * 6, // Rough estimate
				streak: completed ? 1 : 0
			};

			const logRecommendations: string[] = [];
			
			if (completed) {
				logRecommendations.push('Great job completing your workout!');
				logRecommendations.push('Remember to stay hydrated and get adequate rest');
				if (actualDuration < 20) {
					logRecommendations.push('Consider gradually increasing workout duration for better results');
				}
			} else {
				logRecommendations.push('No worries! Every step counts toward your fitness goals');
				logRecommendations.push('Try to identify what prevented you from completing the workout');
				logRecommendations.push('Consider shorter workouts if time is a constraint');
			}

			return {
				result: {
					action: 'workout_logged',
					progress,
					recommendations: logRecommendations
				}
			};

		default:
			return {
				result: {
					action: 'error',
					recommendations: ['Invalid action specified.']
				}
			};
	}
};