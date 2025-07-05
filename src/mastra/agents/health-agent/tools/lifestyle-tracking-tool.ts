import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface LifestyleEntry {
	date: string;
	waterIntake: number; // in liters
	sleepHours: number;
	sleepQuality: number; // 1-10 scale
	steps: number;
	screenTime: number; // in hours
	smokingStatus: 'none' | 'reduced' | 'normal' | 'increased';
	alcoholUnits: number;
	caffeineIntake: number; // in mg
	notes: string;
}

interface LifestyleGoal {
	type: 'water' | 'sleep' | 'steps' | 'screen_time' | 'smoking' | 'alcohol';
	target: number;
	current: number;
	unit: string;
	progress: number; // percentage
}

export const lifestyleTrackingTool = createTool({
	id: "lifestyle-tracking",
	description: "Track daily lifestyle habits and provide personalized recommendations for improvement",
	inputSchema: z.object({
		action: z.enum(['log daily', 'set goals', 'get recommendations', 'analyze trends', 'habit coaching']).describe("Action to perform"),
		waterIntake: z.number().optional().describe("Water intake in liters"),
		sleepHours: z.number().optional().describe("Hours of sleep"),
		sleepQuality: z.number().min(1).max(10).optional().describe("Sleep quality rating 1-10"),
		steps: z.number().optional().describe("Number of steps taken"),
		screenTime: z.number().optional().describe("Screen time in hours"),
		smokingStatus: z.enum(['none', 'reduced', 'normal', 'increased']).optional().describe("Smoking status for the day"),
		alcoholUnits: z.number().optional().describe("Alcohol units consumed"),
		caffeineIntake: z.number().optional().describe("Caffeine intake in mg"),
		notes: z.string().optional().describe("Additional notes about the day"),
		goalType: z.enum(['water', 'sleep', 'steps', 'screen_time', 'smoking', 'alcohol']).optional().describe("Type of goal to set"),
		goalTarget: z.number().optional().describe("Target value for the goal"),
		habitToImprove: z.enum(['water intake', 'sleep quality', 'exercise', 'screen time', 'smoking', 'alcohol consumption', 'stress management', 'nutrition']).optional().describe("Which habit would you like to improve?")
	}),
	outputSchema: z.object({
		result: z.object({
			action: z.string(),
			lifestyleEntry: z.object({
				date: z.string(),
				waterIntake: z.number(),
				sleepHours: z.number(),
				sleepQuality: z.number(),
				steps: z.number(),
				screenTime: z.number(),
				smokingStatus: z.enum(['none', 'reduced', 'normal', 'increased']),
				alcoholUnits: z.number(),
				caffeineIntake: z.number(),
				notes: z.string(),
			}).optional(),
			goals: z.array(z.object({
				type: z.enum(['water', 'sleep', 'steps', 'screen_time', 'smoking', 'alcohol']),
				target: z.number(),
				current: z.number(),
				unit: z.string(),
				progress: z.number(),
			})).optional(),
			recommendations: z.array(z.string()),
			analysis: z.string().optional(),
			tips: z.array(z.string()).optional(),
		}),
	}),
	execute: async ({ context }) => {
		return await manageLifestyle(context);
	},
});

const manageLifestyle = async (input: {
	action: 'log daily' | 'set goals' | 'get recommendations' | 'analyze trends' | 'habit coaching';
	waterIntake?: number;
	sleepHours?: number;
	sleepQuality?: number;
	steps?: number;
	screenTime?: number;
	smokingStatus?: 'none' | 'reduced' | 'normal' | 'increased';
	alcoholUnits?: number;
	caffeineIntake?: number;
	notes?: string;
	goalType?: 'water' | 'sleep' | 'steps' | 'screen_time' | 'smoking' | 'alcohol';
	goalTarget?: number;
	habitToImprove?: string;
}): Promise<{ result: any }> => {
	const { 
		action, waterIntake, sleepHours, sleepQuality, steps, screenTime, 
		smokingStatus, alcoholUnits, caffeineIntake, notes, goalType, goalTarget, habitToImprove 
	} = input;

	const recommendations: string[] = [];
	const tips: string[] = [];

	// Recommended daily values
	const recommendedValues = {
		water: 2.5, // liters
		sleep: 8, // hours
		steps: 10000,
		screenTime: 2, // hours (recreational)
		alcohol: 1, // units per day (moderate)
		caffeine: 400 // mg per day (safe limit)
	};

	switch (action) {
		case 'log daily':
		case 'log_daily': // Backward compatibility
			const lifestyleEntry: LifestyleEntry = {
				date: new Date().toISOString().split('T')[0],
				waterIntake: waterIntake || 0,
				sleepHours: sleepHours || 0,
				sleepQuality: sleepQuality || 5,
				steps: steps || 0,
				screenTime: screenTime || 0,
				smokingStatus: smokingStatus || 'none',
				alcoholUnits: alcoholUnits || 0,
				caffeineIntake: caffeineIntake || 0,
				notes: notes || ''
			};

			// Analyze each metric and provide feedback
			if (lifestyleEntry.waterIntake < recommendedValues.water) {
				const deficit = recommendedValues.water - lifestyleEntry.waterIntake;
				recommendations.push(`You're ${deficit.toFixed(1)}L below the recommended daily water intake. Try to drink more water throughout the day.`);
				tips.push('Keep a water bottle nearby and set hourly reminders to drink water');
			} else if (lifestyleEntry.waterIntake >= recommendedValues.water) {
				recommendations.push('Great job staying hydrated! Your water intake looks good.');
			}

			if (lifestyleEntry.sleepHours < 7) {
				recommendations.push('You\'re getting less than the recommended 7-9 hours of sleep. Consider improving your sleep schedule.');
				tips.push('Try to go to bed 30 minutes earlier tonight');
				tips.push('Avoid screens 1 hour before bedtime');
			} else if (lifestyleEntry.sleepHours > 9) {
				recommendations.push('You\'re sleeping more than 9 hours. While rest is important, excessive sleep might indicate other health issues.');
			} else {
				recommendations.push('Your sleep duration looks good!');
			}

			if (lifestyleEntry.sleepQuality <= 5) {
				recommendations.push('Your sleep quality could be improved. Consider factors like room temperature, noise, and stress levels.');
				tips.push('Keep your bedroom cool (60-67°F) and dark');
				tips.push('Try relaxation techniques before bed');
			}

			if (lifestyleEntry.steps < 8000) {
				const stepsNeeded = recommendedValues.steps - lifestyleEntry.steps;
				recommendations.push(`You're ${stepsNeeded} steps below the daily goal. Try to incorporate more walking into your day.`);
				tips.push('Take the stairs instead of elevators');
				tips.push('Park farther away or get off public transport one stop early');
			} else if (lifestyleEntry.steps >= recommendedValues.steps) {
				recommendations.push('Excellent! You\'ve reached your daily step goal.');
			}

			if (lifestyleEntry.screenTime > 4) {
				recommendations.push('Your screen time is quite high. Consider taking regular breaks and limiting recreational screen use.');
				tips.push('Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds');
				tips.push('Set specific times for checking social media and emails');
			}

			if (lifestyleEntry.smokingStatus !== 'none') {
				recommendations.push('Consider reducing or quitting smoking for better health outcomes.');
				tips.push('Speak with a healthcare provider about smoking cessation programs');
				tips.push('Try nicotine replacement therapy or other cessation aids');
			}

			if (lifestyleEntry.alcoholUnits > 2) {
				recommendations.push('Your alcohol intake is above moderate levels. Consider reducing consumption.');
				tips.push('Try alcohol-free days during the week');
				tips.push('Replace alcoholic drinks with sparkling water or herbal tea');
			}

			if (lifestyleEntry.caffeineIntake > recommendedValues.caffeine) {
				recommendations.push('Your caffeine intake is above the recommended daily limit. Consider reducing consumption.');
				tips.push('Switch to decaf coffee or herbal tea in the afternoon');
				tips.push('Gradually reduce caffeine to avoid withdrawal symptoms');
			}

			return {
				result: {
					action: 'daily_logged',
					lifestyleEntry,
					recommendations,
					tips
				}
			};

		case 'set_goals':
		case 'set goals':
		case 'set_goals': // Backward compatibility
			if (!goalType || goalTarget === undefined) {
				return {
					result: {
						action: 'error',
						recommendations: ['Goal type and target value are required to set goals.']
					}
				};
			}

			const goalUnits = {
				water: 'liters',
				sleep: 'hours',
				steps: 'steps',
				screen_time: 'hours', // Backward compatibility
				smoking: 'cigarettes',
				alcohol: 'units'
			};

			const newGoal: LifestyleGoal = {
				type: goalType,
				target: goalTarget,
				current: 0, // Would be updated based on actual tracking
				unit: goalUnits[goalType],
				progress: 0
			};

			// Provide goal-specific advice
			switch (goalType) {
				case 'water':
					recommendations.push('Start by drinking a glass of water when you wake up');
					recommendations.push('Set reminders throughout the day to drink water');
					break;
				case 'sleep':
					recommendations.push('Establish a consistent bedtime routine');
					recommendations.push('Create a sleep-friendly environment (cool, dark, quiet)');
					break;
				case 'steps':
					recommendations.push('Start with small increases (500-1000 steps per week)');
					recommendations.push('Find activities you enjoy like dancing, hiking, or playing sports');
					break;
				case 'screen_time':
					recommendations.push('Use app timers to limit recreational screen use');
					recommendations.push('Create phone-free zones in your home');
					break;
				case 'smoking':
					recommendations.push('Set a quit date and tell friends and family for support');
					recommendations.push('Identify your smoking triggers and plan alternatives');
					break;
				case 'alcohol':
					recommendations.push('Track your drinks and set specific limits');
					recommendations.push('Plan alcohol-free activities and social events');
					break;
			}

			return {
				result: {
					action: 'goal_set',
					goals: [newGoal],
					recommendations
				}
			};

		case 'get_recommendations':
		case 'get recommendations':
		case 'get_recommendations': // Backward compatibility
			const generalRecommendations = [
				'Stay hydrated by drinking water regularly throughout the day',
				'Aim for 7-9 hours of quality sleep each night',
				'Incorporate at least 30 minutes of physical activity daily',
				'Limit recreational screen time, especially before bedtime',
				'Practice stress management techniques like deep breathing or meditation',
				'Eat a balanced diet rich in fruits, vegetables, and whole grains',
				'Maintain social connections and engage in meaningful activities',
				'Take regular breaks from work and practice mindfulness'
			];

			const healthyHabits = [
				'Start your day with a glass of water and some sunlight exposure',
				'Take short walks during work breaks',
				'Practice gratitude by writing down 3 things you\'re thankful for',
				'Prepare healthy snacks in advance to avoid processed foods',
				'Set a consistent sleep schedule, even on weekends',
				'Limit caffeine intake after 2 PM for better sleep',
				'Practice the 20-20-20 rule for eye health during screen use',
				'End your day with a relaxing activity like reading or gentle stretching'
			];

			return {
				result: {
					action: 'recommendations_provided',
					recommendations: generalRecommendations.slice(0, 5),
					tips: healthyHabits.slice(0, 5)
				}
			};

		case 'analyze_trends':
		case 'analyze trends':
		case 'analyze_trends': // Backward compatibility
			// This would typically analyze historical data
			const analysisText = `
Lifestyle Trend Analysis:

Regular tracking of your daily habits provides valuable insights into your health patterns. Here's what to look for:

SLEEP PATTERNS:
- Consistency in bedtime and wake time
- Correlation between sleep quality and daily activities
- Impact of screen time and caffeine on sleep

HYDRATION TRENDS:
- Daily water intake consistency
- Relationship between hydration and energy levels
- Seasonal variations in water consumption

ACTIVITY LEVELS:
- Weekly step count patterns
- Correlation between activity and mood/sleep
- Impact of weather and schedule on movement

SCREEN TIME HABITS:
- Daily and weekly screen time patterns
- Relationship between screen time and sleep quality
- Productivity correlation with screen time limits

Key insights emerge after 2-4 weeks of consistent tracking. Use this data to make informed adjustments to your lifestyle.
			`.trim();

			return {
				result: {
					action: 'trends_analyzed',
					analysis: analysisText,
					recommendations: [
						'Track consistently for at least 2 weeks to identify meaningful patterns',
						'Look for correlations between different lifestyle factors',
						'Use trend data to set realistic and achievable goals',
						'Share your tracking data with healthcare providers for personalized advice'
					]
				}
			};

		case 'habit_coaching':
		case 'habit coaching':
		case 'habit_coaching': // Backward compatibility
			const habit = habitToImprove?.toLowerCase() || 'general wellness';
			
			const habitStrategies: Record<string, string[]> = {
				'water': [
					'Start with one extra glass per day and gradually increase',
					'Use a marked water bottle to track intake visually',
					'Set phone reminders every 2 hours to drink water',
					'Drink a glass of water before each meal'
				],
				'sleep': [
					'Go to bed 15 minutes earlier each week until you reach your goal',
					'Create a wind-down routine starting 1 hour before bed',
					'Keep your bedroom cool (60-67°F) and use blackout curtains',
					'Avoid caffeine after 2 PM and large meals before bedtime'
				],
				'exercise': [
					'Start with 10-minute walks and gradually increase duration',
					'Schedule workouts like important appointments',
					'Find an activity you enjoy - it shouldn\'t feel like punishment',
					'Track your progress and celebrate small wins'
				],
				'screen time': [
					'Use app timers to set daily limits on recreational apps',
					'Create phone-free zones (bedroom, dining table)',
					'Replace one hour of screen time with a physical activity',
					'Use the "Do Not Disturb" feature during focused work or family time'
				],
				'smoking': [
					'Set a quit date and remove all smoking materials from your environment',
					'Identify your triggers and plan alternative responses',
					'Consider nicotine replacement therapy or prescription medications',
					'Join a support group or use a quit-smoking app for accountability'
				]
			};

			const strategies = habitStrategies[habit] || [
				'Start small - make tiny changes that are easy to maintain',
				'Be consistent - do the new habit at the same time each day',
				'Track your progress - use a habit tracker or journal',
				'Be patient with yourself - habits take 21-66 days to form',
				'Focus on one habit at a time for better success rates'
			];

			return {
				result: {
					action: 'habit_coaching_provided',
					recommendations: strategies,
					tips: [
						'Use the "2-minute rule" - make the habit so easy it takes less than 2 minutes',
						'Stack new habits onto existing ones (habit stacking)',
						'Prepare your environment to make good habits easier',
						'Find an accountability partner or join a community with similar goals'
					],
					analysis: `Habit change is a gradual process that requires patience and consistency. Focus on progress, not perfection, and remember that small, sustainable changes lead to lasting results.`
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