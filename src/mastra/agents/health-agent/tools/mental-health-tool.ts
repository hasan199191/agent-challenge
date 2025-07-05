import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface MoodEntry {
	date: string;
	mood: number; // 1-10 scale
	emotions: string[];
	stressLevel: number; // 1-10 scale
	notes: string;
	triggers: string[];
}

interface MentalHealthActivity {
	name: string;
	type: 'breathing' | 'meditation' | 'mindfulness' | 'journaling' | 'relaxation';
	duration: string;
	difficulty: 'easy' | 'medium' | 'advanced';
	instructions: string[];
	benefits: string[];
}

export const mentalHealthTool = createTool({
	id: "mental-health-support",
	description: "Provide mental health support, mood tracking, and wellness activities",
	inputSchema: z.object({
		action: z.enum(['track mood', 'get activity', 'analyze mood', 'crisis support', 'stress management']).describe("Action to perform"),
		mood: z.number().min(1).max(10).optional().describe("Current mood on scale 1-10"),
		emotions: z.array(z.enum(['happy', 'sad', 'angry', 'anxious', 'stressed', 'excited', 'calm', 'frustrated', 'overwhelmed', 'content', 'lonely', 'energetic', 'tired', 'hopeful', 'worried'])).optional().describe("Current emotions you're feeling"),
		stressLevel: z.number().min(1).max(10).optional().describe("Current stress level 1-10"),
		notes: z.string().optional().describe("Additional notes about mental state"),
		triggers: z.array(z.enum(['work pressure', 'relationship issues', 'financial stress', 'health concerns', 'family problems', 'social situations', 'lack of sleep', 'poor diet', 'lack of exercise', 'technology overuse'])).optional().describe("What triggered your current state?"),
		activityType: z.enum(['breathing', 'meditation', 'mindfulness', 'journaling', 'relaxation']).optional().describe("Type of mental health activity requested"),
		availableTime: z.number().optional().describe("Available time for activity in minutes"),
		experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe("Experience with mental health practices"),
	}),
	outputSchema: z.object({
		result: z.object({
			action: z.string(),
			moodEntry: z.object({
				date: z.string(),
				mood: z.number(),
				emotions: z.array(z.string()),
				stressLevel: z.number(),
				notes: z.string(),
				triggers: z.array(z.string()),
			}).optional(),
			activity: z.object({
				name: z.string(),
				type: z.enum(['breathing', 'meditation', 'mindfulness', 'journaling', 'relaxation']),
				duration: z.string(),
				difficulty: z.enum(['easy', 'medium', 'advanced']),
				instructions: z.array(z.string()),
				benefits: z.array(z.string()),
			}).optional(),
			analysis: z.string().optional(),
			recommendations: z.array(z.string()),
			resources: z.array(z.string()).optional(),
		}),
	}),
	execute: async ({ context }) => {
		return await provideMentalHealthSupport(context);
	},
});

const provideMentalHealthSupport = async (input: {
	action: 'track mood' | 'get activity' | 'analyze mood' | 'crisis support' | 'stress management';
	mood?: number;
	emotions?: string[];
	stressLevel?: number;
	notes?: string;
	triggers?: string[];
	activityType?: 'breathing' | 'meditation' | 'mindfulness' | 'journaling' | 'relaxation';
	availableTime?: number;
	experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}): Promise<{ result: any }> => {
	const { action, mood, emotions, stressLevel, notes, triggers, activityType, availableTime, experienceLevel } = input;

	// Mental health activities database
	const activitiesDB: Record<string, MentalHealthActivity> = {
		'box_breathing': {
			name: 'Box Breathing',
			type: 'breathing',
			duration: '5-10 minutes',
			difficulty: 'easy',
			instructions: [
				'Sit comfortably with your back straight',
				'Inhale slowly through your nose for 4 counts',
				'Hold your breath for 4 counts',
				'Exhale slowly through your mouth for 4 counts',
				'Hold empty for 4 counts',
				'Repeat this cycle 10-15 times'
			],
			benefits: ['reduces anxiety', 'improves focus', 'calms nervous system']
		},
		'body_scan': {
			name: 'Progressive Body Scan',
			type: 'meditation',
			duration: '10-20 minutes',
			difficulty: 'medium',
			instructions: [
				'Lie down comfortably and close your eyes',
				'Start by focusing on your toes, notice any sensations',
				'Slowly move your attention up through each part of your body',
				'Spend 30 seconds on each body part',
				'Notice tension and consciously relax each area',
				'End by taking three deep breaths'
			],
			benefits: ['reduces physical tension', 'improves body awareness', 'promotes relaxation']
		},
		'mindful_walking': {
			name: 'Mindful Walking',
			type: 'mindfulness',
			duration: '10-30 minutes',
			difficulty: 'easy',
			instructions: [
				'Choose a quiet path or space to walk',
				'Walk slower than your normal pace',
				'Focus on the sensation of your feet touching the ground',
				'Notice your surroundings without judgment',
				'When your mind wanders, gently return focus to walking',
				'End by standing still for a moment and taking deep breaths'
			],
			benefits: ['grounds you in the present', 'combines exercise with mindfulness', 'reduces rumination']
		},
		'gratitude_journaling': {
			name: 'Gratitude Journaling',
			type: 'journaling',
			duration: '5-15 minutes',
			difficulty: 'easy',
			instructions: [
				'Find a quiet space with pen and paper or device',
				'Write down 3-5 things you are grateful for today',
				'Be specific about why you are grateful for each item',
				'Include both big and small things',
				'Reflect on how these things made you feel',
				'End by reading through your list once more'
			],
			benefits: ['improves mood', 'shifts focus to positive aspects', 'builds resilience']
		},
		'progressive_relaxation': {
			name: 'Progressive Muscle Relaxation',
			type: 'relaxation',
			duration: '15-25 minutes',
			difficulty: 'medium',
			instructions: [
				'Lie down in a comfortable position',
				'Start with your toes - tense them for 5 seconds, then relax',
				'Move up to your calves, thighs, abdomen, etc.',
				'Tense each muscle group for 5 seconds, then relax for 10 seconds',
				'Notice the contrast between tension and relaxation',
				'End by lying still and enjoying the relaxed state'
			],
			benefits: ['reduces physical tension', 'improves sleep quality', 'teaches relaxation skills']
		},
		'loving_kindness': {
			name: 'Loving-Kindness Meditation',
			type: 'meditation',
			duration: '10-20 minutes',
			difficulty: 'medium',
			instructions: [
				'Sit comfortably and close your eyes',
				'Start by sending loving thoughts to yourself: "May I be happy, may I be healthy"',
				'Extend these wishes to a loved one',
				'Then to a neutral person (acquaintance)',
				'Then to someone you have difficulty with',
				'Finally, extend to all beings everywhere'
			],
			benefits: ['increases compassion', 'reduces negative emotions', 'improves relationships']
		},
		'quick_breathing': {
			name: '4-7-8 Breathing',
			type: 'breathing',
			duration: '3-5 minutes',
			difficulty: 'easy',
			instructions: [
				'Sit with your back straight',
				'Exhale completely through your mouth',
				'Inhale through your nose for 4 counts',
				'Hold your breath for 7 counts',
				'Exhale through your mouth for 8 counts',
				'Repeat 3-4 cycles'
			],
			benefits: ['quick stress relief', 'improves sleep', 'calms anxiety']
		}
	};

	const recommendations: string[] = [];
	const resources: string[] = [];

	switch (action) {
		case 'track mood':
		case 'track_mood': // Backward compatibility
			if (mood === undefined) {
				return {
					result: {
						action: 'error',
						recommendations: ['Mood rating (1-10) is required for mood tracking.']
					}
				};
			}

			const moodEntry: MoodEntry = {
				date: new Date().toISOString().split('T')[0],
				mood,
				emotions: emotions || [],
				stressLevel: stressLevel || 5,
				notes: notes || '',
				triggers: triggers || []
			};

			// Provide mood-based recommendations
			if (mood <= 3) {
				recommendations.push('Your mood seems quite low. Consider reaching out to a mental health professional.');
				recommendations.push('Try some gentle breathing exercises or mindfulness activities.');
				recommendations.push('Remember that difficult feelings are temporary.');
				resources.push('National Suicide Prevention Lifeline: 988');
				resources.push('Crisis Text Line: Text HOME to 741741');
			} else if (mood <= 5) {
				recommendations.push('It sounds like you\'re having a challenging day.');
				recommendations.push('Consider doing a mood-boosting activity like gratitude journaling.');
				recommendations.push('Physical activity or connecting with a friend might help.');
			} else if (mood <= 7) {
				recommendations.push('Your mood is in a neutral range.');
				recommendations.push('This might be a good time for some mindfulness practice.');
				recommendations.push('Consider what small things might lift your spirits.');
			} else {
				recommendations.push('Great to hear you\'re feeling good!');
				recommendations.push('This is a perfect time to practice gratitude.');
				recommendations.push('Consider what\'s contributing to your positive mood.');
			}

			if (stressLevel && stressLevel >= 7) {
				recommendations.push('Your stress level seems high. Try some stress-reduction techniques.');
				recommendations.push('Consider what might be causing this stress and if anything can be addressed.');
			}

			return {
				result: {
					action: 'mood_tracked',
					moodEntry,
					recommendations,
					resources: resources.length > 0 ? resources : undefined
				}
			};

		case 'get_activity':
		case 'get activity':
		case 'get_activity': // Backward compatibility
			const time = availableTime || 10;
			const experience = experienceLevel || 'beginner';
			const preferredType = activityType;

			// Filter activities based on criteria
			let suitableActivities = Object.values(activitiesDB);

			if (preferredType) {
				suitableActivities = suitableActivities.filter(activity => activity.type === preferredType);
			}

			// Filter by experience level
			if (experience === 'beginner') {
				suitableActivities = suitableActivities.filter(activity => activity.difficulty === 'easy');
			} else if (experience === 'intermediate') {
				suitableActivities = suitableActivities.filter(activity => activity.difficulty !== 'advanced');
			}

			// Filter by time (rough estimate)
			if (time < 10) {
				suitableActivities = suitableActivities.filter(activity => 
					activity.duration.includes('3-') || activity.duration.includes('5-')
				);
			}

			// Select a random suitable activity
			const selectedActivity = suitableActivities[Math.floor(Math.random() * suitableActivities.length)] || 
				activitiesDB['box_breathing']; // Fallback

			recommendations.push('Take your time with this activity and don\'t worry about doing it perfectly.');
			recommendations.push('If your mind wanders, that\'s normal - gently bring your attention back.');
			recommendations.push('Regular practice will make these techniques more effective over time.');

			return {
				result: {
					action: 'activity_provided',
					activity: selectedActivity,
					recommendations
				}
			};

		case 'stress_management':
		case 'stress management':
		case 'stress_management': // Backward compatibility
			const stressRecommendations = [
				'Identify your stress triggers and develop coping strategies for each',
				'Practice deep breathing exercises when you feel stress building',
				'Break large tasks into smaller, manageable steps',
				'Set realistic expectations for yourself',
				'Make time for activities you enjoy',
				'Ensure you\'re getting adequate sleep (7-9 hours)',
				'Consider talking to someone you trust about your stress',
				'Regular exercise can significantly reduce stress levels'
			];

			const stressActivities = Object.values(activitiesDB).filter(activity => 
				activity.type === 'breathing' || activity.type === 'relaxation'
			);

			const quickStressActivity = stressActivities.find(activity => 
				activity.duration.includes('3-') || activity.duration.includes('5-')
			) || activitiesDB['quick_breathing'];

			return {
				result: {
					action: 'stress_management_provided',
					activity: quickStressActivity,
					recommendations: stressRecommendations.slice(0, 5),
					analysis: 'Stress is a normal part of life, but chronic stress can impact your physical and mental health. The key is developing healthy coping strategies and knowing when to seek additional support.'
				}
			};

		case 'crisis_support':
		case 'crisis support':
		case 'crisis_support': // Backward compatibility
			const crisisResources = [
				'National Suicide Prevention Lifeline: 988 (24/7)',
				'Crisis Text Line: Text HOME to 741741',
				'National Alliance on Mental Illness (NAMI): 1-800-950-NAMI',
				'SAMHSA National Helpline: 1-800-662-4357',
				'Emergency Services: 911'
			];

			const crisisRecommendations = [
				'If you are in immediate danger, please call 911 or go to your nearest emergency room.',
				'You are not alone - there are people who want to help.',
				'Crisis feelings are temporary, even when they feel overwhelming.',
				'Reach out to a trusted friend, family member, or mental health professional.',
				'Remove any means of self-harm from your immediate environment.',
				'Stay with someone or in a public place if possible.'
			];

			return {
				result: {
					action: 'crisis_support_provided',
					recommendations: crisisRecommendations,
					resources: crisisResources,
					analysis: 'If you are experiencing thoughts of self-harm or suicide, please reach out for immediate help. These feelings can be overwhelming, but support is available 24/7.'
				}
			};

		case 'analyze_mood':
		case 'analyze mood':
		case 'analyze_mood': // Backward compatibility
			// This would typically analyze historical mood data
			// For now, provide general mood analysis guidance
			const analysisText = `
Mood tracking is a valuable tool for understanding your mental health patterns. Here are some insights:

- Look for patterns in your mood related to sleep, exercise, social interactions, or work stress
- Notice if certain days of the week or times of day affect your mood
- Pay attention to the relationship between your mood and physical symptoms
- Consider external factors like weather, news consumption, or social media use
- Track what activities or practices help improve your mood

Regular mood tracking can help you and healthcare providers identify triggers and effective coping strategies.
			`.trim();

			return {
				result: {
					action: 'mood_analysis_provided',
					analysis: analysisText,
					recommendations: [
						'Track your mood daily for at least 2 weeks to identify patterns',
						'Note what you were doing before mood changes occurred',
						'Share your mood tracking data with a mental health professional',
						'Use mood data to make informed decisions about self-care'
					]
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