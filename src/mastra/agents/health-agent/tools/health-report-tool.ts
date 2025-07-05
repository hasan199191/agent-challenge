import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface HealthMetric {
	category: string;
	value: number;
	unit: string;
	status: 'excellent' | 'good' | 'fair' | 'needs_improvement';
	trend: 'improving' | 'stable' | 'declining';
	recommendation: string;
}

interface HealthReport {
	reportDate: string;
	reportType: 'daily' | 'weekly' | 'monthly';
	overallScore: number;
	metrics: HealthMetric[];
	achievements: string[];
	areasForImprovement: string[];
	actionPlan: string[];
	summary: string;
}

export const healthReportTool = createTool({
	id: "health-report",
	description: "Generate comprehensive health reports and track progress over time",
	inputSchema: z.object({
		reportType: z.enum(['daily', 'weekly', 'monthly']).describe("Type of health report to generate"),
		includeMetrics: z.array(z.enum(['sleep', 'nutrition', 'exercise', 'mental health', 'hydration', 'medication', 'symptoms', 'lifestyle'])).optional().describe("Which health metrics to include in the report"),
		timeframe: z.enum(['7', '14', '30', '60', '90']).optional().describe("Number of days to include in the report"),
		// Sample data inputs (in a real app, this would come from stored user data)
		avgSleep: z.number().optional().describe("Average sleep hours"),
		avgWater: z.number().optional().describe("Average water intake in liters"),
		avgSteps: z.number().optional().describe("Average daily steps"),
		avgMood: z.number().optional().describe("Average mood rating (1-10)"),
		avgStress: z.number().optional().describe("Average stress level (1-10)"),
		exerciseFrequency: z.number().optional().describe("Exercise sessions per week"),
		nutritionScore: z.number().optional().describe("Average nutrition score (1-100)"),
		medicationAdherence: z.number().optional().describe("Medication adherence percentage"),
	}),
	outputSchema: z.object({
		healthReport: z.object({
			reportDate: z.string(),
			reportType: z.enum(['daily', 'weekly', 'monthly']),
			overallScore: z.number(),
			metrics: z.array(z.object({
				category: z.string(),
				value: z.number(),
				unit: z.string(),
				status: z.enum(['excellent', 'good', 'fair', 'needs_improvement']),
				trend: z.enum(['improving', 'stable', 'declining']),
				recommendation: z.string(),
			})),
			achievements: z.array(z.string()),
			areasForImprovement: z.array(z.string()),
			actionPlan: z.array(z.string()),
			summary: z.string(),
		}),
	}),
	execute: async ({ context }) => {
		return await generateHealthReport(context);
	},
});

const generateHealthReport = async (input: {
	reportType: 'daily' | 'weekly' | 'monthly';
	includeMetrics?: string[];
	timeframe?: number;
	avgSleep?: number;
	avgWater?: number;
	avgSteps?: number;
	avgMood?: number;
	avgStress?: number;
	exerciseFrequency?: number;
	nutritionScore?: number;
	medicationAdherence?: number;
}): Promise<{ healthReport: HealthReport }> => {
	const { 
		reportType, 
		avgSleep = 7.2, 
		avgWater = 2.1, 
		avgSteps = 8500, 
		avgMood = 6.5, 
		avgStress = 5.5,
		exerciseFrequency = 3,
		nutritionScore = 72,
		medicationAdherence = 85
	} = input;

	const reportDate = new Date().toISOString().split('T')[0];
	const metrics: HealthMetric[] = [];
	const achievements: string[] = [];
	const areasForImprovement: string[] = [];
	const actionPlan: string[] = [];

	// Helper function to determine status based on value and thresholds
	const getStatus = (value: number, excellent: number, good: number, fair: number): 'excellent' | 'good' | 'fair' | 'needs_improvement' => {
		if (value >= excellent) return 'excellent';
		if (value >= good) return 'good';
		if (value >= fair) return 'fair';
		return 'needs_improvement';
	};

	// Helper function to simulate trend (in real app, this would be calculated from historical data)
	const getTrend = (): 'improving' | 'stable' | 'declining' => {
		const trends = ['improving', 'stable', 'declining'] as const;
		return trends[Math.floor(Math.random() * trends.length)];
	};

	// Sleep Analysis
	const sleepStatus = getStatus(avgSleep, 8, 7, 6);
	metrics.push({
		category: 'Sleep',
		value: avgSleep,
		unit: 'hours',
		status: sleepStatus,
		trend: getTrend(),
		recommendation: sleepStatus === 'excellent' ? 'Maintain your excellent sleep schedule!' :
			sleepStatus === 'good' ? 'Try to get closer to 8 hours for optimal recovery.' :
			sleepStatus === 'fair' ? 'Focus on improving sleep hygiene and consistency.' :
			'Prioritize sleep - aim for 7-9 hours nightly with a consistent schedule.'
	});

	if (sleepStatus === 'excellent' || sleepStatus === 'good') {
		achievements.push('Maintaining healthy sleep patterns');
	} else {
		areasForImprovement.push('Sleep duration and quality');
		actionPlan.push('Establish a consistent bedtime routine and sleep schedule');
	}

	// Hydration Analysis
	const waterStatus = getStatus(avgWater, 2.5, 2.0, 1.5);
	metrics.push({
		category: 'Hydration',
		value: avgWater,
		unit: 'liters',
		status: waterStatus,
		trend: getTrend(),
		recommendation: waterStatus === 'excellent' ? 'Great hydration habits!' :
			waterStatus === 'good' ? 'Try to reach 2.5L daily for optimal hydration.' :
			waterStatus === 'fair' ? 'Increase water intake gradually throughout the day.' :
			'Significantly increase water intake - set hourly reminders.'
	});

	if (waterStatus === 'excellent' || waterStatus === 'good') {
		achievements.push('Good hydration levels');
	} else {
		areasForImprovement.push('Daily water intake');
		actionPlan.push('Set water intake reminders and carry a water bottle');
	}

	// Physical Activity Analysis
	const stepsStatus = getStatus(avgSteps, 10000, 8000, 6000);
	metrics.push({
		category: 'Physical Activity',
		value: avgSteps,
		unit: 'steps',
		status: stepsStatus,
		trend: getTrend(),
		recommendation: stepsStatus === 'excellent' ? 'Excellent activity level!' :
			stepsStatus === 'good' ? 'Try to reach 10,000 steps daily.' :
			stepsStatus === 'fair' ? 'Incorporate more walking into your daily routine.' :
			'Increase daily movement - start with short walks and build up.'
	});

	if (stepsStatus === 'excellent' || stepsStatus === 'good') {
		achievements.push('Active lifestyle with good step count');
	} else {
		areasForImprovement.push('Daily physical activity');
		actionPlan.push('Take stairs, park farther away, or schedule walking breaks');
	}

	// Mental Health Analysis
	const moodStatus = getStatus(avgMood, 8, 6.5, 5);
	metrics.push({
		category: 'Mental Wellbeing',
		value: avgMood,
		unit: 'score (1-10)',
		status: moodStatus,
		trend: getTrend(),
		recommendation: moodStatus === 'excellent' ? 'Excellent mental wellbeing!' :
			moodStatus === 'good' ? 'Continue positive mental health practices.' :
			moodStatus === 'fair' ? 'Consider stress management and self-care activities.' :
			'Focus on mental health - consider professional support if needed.'
	});

	// Stress Analysis (lower is better for stress)
	const stressStatus = avgStress <= 3 ? 'excellent' : avgStress <= 5 ? 'good' : avgStress <= 7 ? 'fair' : 'needs_improvement';
	metrics.push({
		category: 'Stress Management',
		value: avgStress,
		unit: 'level (1-10)',
		status: stressStatus,
		trend: getTrend(),
		recommendation: stressStatus === 'excellent' ? 'Great stress management!' :
			stressStatus === 'good' ? 'Continue current stress management practices.' :
			stressStatus === 'fair' ? 'Implement more stress reduction techniques.' :
			'High stress levels - prioritize stress management and relaxation.'
	});

	if (moodStatus === 'excellent' || moodStatus === 'good') {
		achievements.push('Positive mental health indicators');
	} else {
		areasForImprovement.push('Mental wellbeing and stress management');
		actionPlan.push('Practice mindfulness, meditation, or other stress-relief activities');
	}

	// Exercise Frequency Analysis
	const exerciseStatus = getStatus(exerciseFrequency, 5, 3, 2);
	metrics.push({
		category: 'Exercise Frequency',
		value: exerciseFrequency,
		unit: 'sessions/week',
		status: exerciseStatus,
		trend: getTrend(),
		recommendation: exerciseStatus === 'excellent' ? 'Outstanding exercise consistency!' :
			exerciseStatus === 'good' ? 'Good exercise routine - try to add 1-2 more sessions.' :
			exerciseStatus === 'fair' ? 'Increase exercise frequency to 3-4 times per week.' :
			'Start with 2-3 exercise sessions per week and build consistency.'
	});

	if (exerciseStatus === 'excellent' || exerciseStatus === 'good') {
		achievements.push('Regular exercise routine');
	} else {
		areasForImprovement.push('Exercise consistency');
		actionPlan.push('Schedule specific workout times and start with activities you enjoy');
	}

	// Nutrition Analysis
	const nutritionStatus = getStatus(nutritionScore, 85, 70, 60);
	metrics.push({
		category: 'Nutrition',
		value: nutritionScore,
		unit: 'score (1-100)',
		status: nutritionStatus,
		trend: getTrend(),
		recommendation: nutritionStatus === 'excellent' ? 'Excellent nutritional choices!' :
			nutritionStatus === 'good' ? 'Good nutrition - focus on consistency.' :
			nutritionStatus === 'fair' ? 'Improve diet quality with more whole foods.' :
			'Significant nutrition improvements needed - consider consulting a nutritionist.'
	});

	if (nutritionStatus === 'excellent' || nutritionStatus === 'good') {
		achievements.push('Healthy eating patterns');
	} else {
		areasForImprovement.push('Nutritional quality');
		actionPlan.push('Plan meals in advance and include more fruits and vegetables');
	}

	// Medication Adherence Analysis (if applicable)
	if (medicationAdherence > 0) {
		const adherenceStatus = getStatus(medicationAdherence, 95, 85, 75);
		metrics.push({
			category: 'Medication Adherence',
			value: medicationAdherence,
			unit: 'percentage',
			status: adherenceStatus,
			trend: getTrend(),
			recommendation: adherenceStatus === 'excellent' ? 'Excellent medication compliance!' :
				adherenceStatus === 'good' ? 'Good adherence - aim for 95%+ consistency.' :
				adherenceStatus === 'fair' ? 'Improve medication timing with reminders.' :
				'Poor adherence - set up medication reminders and pill organizers.'
		});

		if (adherenceStatus === 'excellent' || adherenceStatus === 'good') {
			achievements.push('Good medication adherence');
		} else {
			areasForImprovement.push('Medication consistency');
			actionPlan.push('Set up medication reminders and use a pill organizer');
		}
	}

	// Calculate overall health score
	const statusScores = { excellent: 100, good: 80, fair: 60, needs_improvement: 40 };
	const totalScore = metrics.reduce((sum, metric) => sum + statusScores[metric.status], 0);
	const overallScore = Math.round(totalScore / metrics.length);

	// Generate summary based on overall score
	let summary = '';
	if (overallScore >= 90) {
		summary = `Outstanding health profile! You're maintaining excellent habits across most areas. Your ${reportType} report shows strong performance in ${achievements.length} key areas. Keep up the fantastic work and continue monitoring your progress.`;
	} else if (overallScore >= 75) {
		summary = `Good overall health status with room for targeted improvements. You're doing well in ${achievements.length} areas, particularly ${achievements[0] || 'several key metrics'}. Focus on the ${areasForImprovement.length} areas identified for improvement to reach optimal health.`;
	} else if (overallScore >= 60) {
		summary = `Fair health status with several opportunities for improvement. While you have some positive habits, focusing on the ${areasForImprovement.length} identified areas could significantly boost your overall wellbeing. Consider implementing the action plan gradually.`;
	} else {
		summary = `Your health metrics indicate significant room for improvement across multiple areas. Don't be discouraged - small, consistent changes can lead to big improvements. Start with 1-2 items from your action plan and build momentum gradually. Consider consulting healthcare professionals for personalized guidance.`;
	}

	// Add general action items if none exist
	if (actionPlan.length === 0) {
		actionPlan.push('Continue maintaining your current healthy habits');
		actionPlan.push('Set new health goals to challenge yourself');
		actionPlan.push('Regular health check-ups with healthcare providers');
	}

	// Add timeframe-specific insights
	if (reportType === 'daily') {
		summary += ' Daily tracking helps identify patterns and maintain accountability.';
	} else if (reportType === 'weekly') {
		summary += ' Weekly reviews allow for meaningful trend analysis and goal adjustments.';
	} else {
		summary += ' Monthly reports provide comprehensive insights into long-term health patterns and progress.';
	}

	const healthReport: HealthReport = {
		reportDate,
		reportType,
		overallScore,
		metrics,
		achievements,
		areasForImprovement,
		actionPlan,
		summary
	};

	return { healthReport };
};