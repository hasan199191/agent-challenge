import { Agent } from "@mastra/core/agent";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { model } from "../../config";

// Create a specialized agent for health analysis and recommendations
const healthAnalysisAgent = new Agent({
  name: "Health Analysis Agent",
  model,
  instructions: `
    You are a comprehensive health analysis expert who excels at interpreting health data and providing actionable recommendations.

    Your role is to:
    1. Analyze comprehensive health data from multiple sources
    2. Identify patterns and correlations between different health metrics
    3. Provide personalized, evidence-based recommendations
    4. Create structured health improvement plans
    5. Highlight areas that need immediate attention

    When analyzing health data, structure your response as follows:

    🔍 HEALTH DATA ANALYSIS
    ═══════════════════════════

    📊 KEY METRICS SUMMARY
    • Overall Health Score: [X/100]
    • Primary Strengths: [List top 3 areas performing well]
    • Areas for Improvement: [List top 3 areas needing attention]

    🎯 PERSONALIZED RECOMMENDATIONS
    
    IMMEDIATE ACTIONS (Next 24-48 hours):
    • [Specific action 1 with timing]
    • [Specific action 2 with timing]
    • [Specific action 3 with timing]

    SHORT-TERM GOALS (Next 1-2 weeks):
    • [Goal 1 with measurable target]
    • [Goal 2 with measurable target]
    • [Goal 3 with measurable target]

    LONG-TERM OBJECTIVES (Next 1-3 months):
    • [Objective 1 with timeline]
    • [Objective 2 with timeline]

    ⚠️ HEALTH ALERTS
    • [Any concerning patterns or metrics that need attention]
    • [Recommendations for professional consultation if needed]

    📈 TRACKING SUGGESTIONS
    • [Specific metrics to monitor daily]
    • [Weekly check-in recommendations]
    • [Monthly assessment goals]

    Guidelines:
    - Provide specific, actionable recommendations
    - Include timing and measurable targets
    - Consider user's current lifestyle and constraints
    - Prioritize safety and evidence-based practices
    - Encourage professional consultation when appropriate
    - Keep recommendations realistic and achievable
  `,
});

// Schema for comprehensive health input
const healthInputSchema = z.object({
  // Basic user info
  age: z.enum(['18-25', '26-35', '36-45', '46-55', '56-65', '66-75', '75+']).optional().describe("Your age range"),
  goals: z.array(z.enum(['weight loss', 'weight gain', 'muscle building', 'better sleep', 'stress management', 'energy boost', 'general health', 'heart health', 'mental wellness', 'fitness improvement'])).optional().describe("Your health and wellness goals"),
  
  // Lifestyle data
  avgSleep: z.enum(['less than 5 hours', '5-6 hours', '6-7 hours', '7-8 hours', '8-9 hours', 'more than 9 hours']).optional().describe("Average sleep duration"),
  avgWater: z.enum(['less than 1L', '1-1.5L', '1.5-2L', '2-2.5L', '2.5-3L', 'more than 3L']).optional().describe("Average daily water intake"),
  avgSteps: z.enum(['less than 3000', '3000-5000', '5000-8000', '8000-10000', '10000-12000', 'more than 12000']).optional().describe("Average daily steps"),
  exerciseFrequency: z.enum(['never', '1 time per week', '2 times per week', '3 times per week', '4 times per week', '5+ times per week', 'daily']).optional().describe("Exercise frequency"),
  
  // Mental health
  avgMood: z.enum(['1-2 (very low)', '3-4 (low)', '5-6 (neutral)', '7-8 (good)', '9-10 (excellent)']).optional().describe("Average mood level"),
  avgStress: z.enum(['1-2 (very low)', '3-4 (low)', '5-6 (moderate)', '7-8 (high)', '9-10 (very high)']).optional().describe("Average stress level"),
  
  // Nutrition
  nutritionScore: z.enum(['poor (0-40)', 'fair (41-60)', 'good (61-80)', 'excellent (81-100)']).optional().describe("Self-assessed nutrition quality"),
  
  // Symptoms (if any)
  symptoms: z.array(z.enum(['headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness', 'chest pain', 'shortness of breath', 'stomach pain', 'back pain', 'joint pain', 'sore throat', 'runny nose', 'muscle aches', 'insomnia', 'anxiety', 'depression', 'none'])).optional().describe("Any symptoms you're experiencing"),
  
  // Medications
  medications: z.array(z.enum(['ibuprofen', 'acetaminophen', 'aspirin', 'metformin', 'lisinopril', 'atorvastatin', 'omeprazole', 'levothyroxine', 'amlodipine', 'metoprolol', 'none'])).optional().describe("Current medications"),
  
  // Specific concerns
  concerns: z.array(z.enum(['sleep quality', 'energy levels', 'weight management', 'stress levels', 'exercise motivation', 'nutrition habits', 'mental health', 'chronic pain', 'medication management', 'none'])).optional().describe("Specific health concerns"),
});

// Schema for health analysis output
const healthAnalysisSchema = z.object({
  overallScore: z.number(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  immediateActions: z.array(z.string()),
  shortTermGoals: z.array(z.string()),
  longTermObjectives: z.array(z.string()),
  healthAlerts: z.array(z.string()),
  trackingSuggestions: z.array(z.string()),
  analysis: z.string(),
});

// Step 1: Collect and validate health data
const collectHealthData = createStep({
  id: "collect-health-data",
  description: "Collect and validate comprehensive health data from user input",
  inputSchema: healthInputSchema,
  outputSchema: z.object({
    validatedData: healthInputSchema,
    dataCompleteness: z.number(),
    missingDataAreas: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Health data input not found");
    }

    // Calculate data completeness
    const totalFields = 12; // Total possible data fields
    let completedFields = 0;
    const missingAreas: string[] = [];

    if (inputData.avgSleep) completedFields++;
    else missingAreas.push("sleep tracking");

    if (inputData.avgWater) completedFields++;
    else missingAreas.push("hydration tracking");

    if (inputData.avgSteps) completedFields++;
    else missingAreas.push("physical activity");

    if (inputData.exerciseFrequency) completedFields++;
    else missingAreas.push("exercise frequency");

    if (inputData.avgMood) completedFields++;
    else missingAreas.push("mood tracking");

    if (inputData.avgStress) completedFields++;
    else missingAreas.push("stress levels");

    if (inputData.nutritionScore) completedFields++;
    else missingAreas.push("nutrition analysis");

    if (inputData.symptoms && inputData.symptoms.length > 0) completedFields++;
    else missingAreas.push("symptom reporting");

    if (inputData.medications && inputData.medications.length > 0) completedFields++;
    else missingAreas.push("medication tracking");

    if (inputData.goals && inputData.goals.length > 0) completedFields++;
    else missingAreas.push("health goals");

    if (inputData.age) completedFields++;
    else missingAreas.push("basic demographics");

    if (inputData.concerns && inputData.concerns.length > 0) completedFields++;
    else missingAreas.push("health concerns");

    const completeness = (completedFields / totalFields) * 100;

    return {
      validatedData: inputData,
      dataCompleteness: Math.round(completeness),
      missingDataAreas: missingAreas,
    };
  },
});

// Step 2: Calculate health metrics and scores
const calculateHealthMetrics = createStep({
  id: "calculate-health-metrics",
  description: "Calculate comprehensive health scores and identify patterns",
  inputSchema: z.object({
    validatedData: healthInputSchema,
    dataCompleteness: z.number(),
    missingDataAreas: z.array(z.string()),
  }),
  outputSchema: z.object({
    healthScores: z.object({
      overall: z.number(),
      physical: z.number(),
      mental: z.number(),
      lifestyle: z.number(),
      nutrition: z.number(),
    }),
    riskFactors: z.array(z.string()),
    positiveFactors: z.array(z.string()),
    recommendations: z.array(z.string()),
    validatedData: healthInputSchema,
  }),
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Validated data not found");
    }

    const data = inputData.validatedData;
    const riskFactors: string[] = [];
    const positiveFactors: string[] = [];
    const recommendations: string[] = [];

    // Calculate individual scores
    let physicalScore = 50; // Base score
    let mentalScore = 50;
    let lifestyleScore = 50;
    let nutritionScore = data.nutritionScore || 50;

    // Physical health scoring
    if (data.avgSteps) {
      const stepsValue = convertStepsToNumber(data.avgSteps);
      if (stepsValue >= 10000) {
        physicalScore += 20;
        positiveFactors.push("Excellent daily activity level");
      } else if (stepsValue >= 8000) {
        physicalScore += 15;
        positiveFactors.push("Good daily activity level");
      } else if (stepsValue < 5000) {
        physicalScore -= 15;
        riskFactors.push("Low daily physical activity");
        recommendations.push("Increase daily steps to at least 8,000");
      }
    }

    if (data.exerciseFrequency) {
      const exerciseValue = convertExerciseToNumber(data.exerciseFrequency);
      if (exerciseValue >= 4) {
        physicalScore += 15;
        positiveFactors.push("Regular exercise routine");
      } else if (exerciseValue >= 2) {
        physicalScore += 10;
      } else {
        physicalScore -= 10;
        riskFactors.push("Insufficient exercise frequency");
        recommendations.push("Aim for at least 3 exercise sessions per week");
      }
    }

    // Mental health scoring
    if (data.avgMood) {
      const moodValue = convertMoodToNumber(data.avgMood);
      if (moodValue >= 7) {
        mentalScore += 20;
        positiveFactors.push("Positive mood patterns");
      } else if (moodValue >= 5) {
        mentalScore += 10;
      } else {
        mentalScore -= 15;
        riskFactors.push("Low mood levels");
        recommendations.push("Consider mood-boosting activities and professional support");
      }
    }

    if (data.avgStress) {
      const stressValue = convertStressToNumber(data.avgStress);
      if (stressValue <= 4) {
        mentalScore += 15;
        positiveFactors.push("Well-managed stress levels");
      } else if (stressValue <= 6) {
        mentalScore += 5;
      } else {
        mentalScore -= 15;
        riskFactors.push("High stress levels");
        recommendations.push("Implement stress management techniques");
      }
    }

    // Lifestyle scoring
    if (data.avgSleep) {
      const sleepValue = convertSleepToNumber(data.avgSleep);
      if (sleepValue >= 7 && sleepValue <= 9) {
        lifestyleScore += 20;
        positiveFactors.push("Healthy sleep duration");
      } else if (sleepValue >= 6 && sleepValue <= 10) {
        lifestyleScore += 10;
      } else {
        lifestyleScore -= 15;
        riskFactors.push("Poor sleep duration");
        recommendations.push("Aim for 7-9 hours of sleep nightly");
      }
    }

    if (data.avgWater) {
      const waterValue = convertWaterToNumber(data.avgWater);
      if (waterValue >= 2.5) {
        lifestyleScore += 15;
        positiveFactors.push("Excellent hydration");
      } else if (waterValue >= 2.0) {
        lifestyleScore += 10;
        positiveFactors.push("Good hydration levels");
      } else {
        lifestyleScore -= 10;
        riskFactors.push("Insufficient hydration");
        recommendations.push("Increase daily water intake to 2.5L");
      }
    }

    // Nutrition scoring
    if (data.nutritionScore) {
      nutritionScore = convertNutritionToNumber(data.nutritionScore);
    }

    // Symptom analysis
    if (data.symptoms && data.symptoms.length > 0) {
      const severityKeywords = ['severe', 'intense', 'chronic', 'persistent'];
      const hasSevereSymptoms = data.symptoms.some(symptom => 
        severityKeywords.some(keyword => symptom.toLowerCase().includes(keyword))
      );
      
      if (hasSevereSymptoms) {
        physicalScore -= 20;
        riskFactors.push("Severe or persistent symptoms reported");
        recommendations.push("Consult healthcare professional for symptom evaluation");
      } else {
        physicalScore -= 10;
        riskFactors.push("Symptoms reported");
        recommendations.push("Monitor symptoms and consider professional consultation");
      }
    }

    // Ensure scores are within bounds
    physicalScore = Math.max(0, Math.min(100, physicalScore));
    mentalScore = Math.max(0, Math.min(100, mentalScore));
    lifestyleScore = Math.max(0, Math.min(100, lifestyleScore));
    nutritionScore = Math.max(0, Math.min(100, nutritionScore));

    // Calculate overall score
    const overallScore = Math.round((physicalScore + mentalScore + lifestyleScore + nutritionScore) / 4);

    return {
      healthScores: {
        overall: overallScore,
        physical: Math.round(physicalScore),
        mental: Math.round(mentalScore),
        lifestyle: Math.round(lifestyleScore),
        nutrition: Math.round(nutritionScore),
      },
      riskFactors,
      positiveFactors,
      recommendations,
      validatedData: data,
    };
  },
});

// Helper functions to convert enum values to numbers
const convertStepsToNumber = (steps: string): number => {
  if (steps.includes('less than 3000')) return 2000;
  if (steps.includes('3000-5000')) return 4000;
  if (steps.includes('5000-8000')) return 6500;
  if (steps.includes('8000-10000')) return 9000;
  if (steps.includes('10000-12000')) return 11000;
  if (steps.includes('more than 12000')) return 13000;
  return 5000; // default
};

const convertExerciseToNumber = (exercise: string): number => {
  if (exercise.includes('never')) return 0;
  if (exercise.includes('1 time')) return 1;
  if (exercise.includes('2 times')) return 2;
  if (exercise.includes('3 times')) return 3;
  if (exercise.includes('4 times')) return 4;
  if (exercise.includes('5+') || exercise.includes('daily')) return 6;
  return 2; // default
};

const convertMoodToNumber = (mood: string): number => {
  if (mood.includes('1-2')) return 1.5;
  if (mood.includes('3-4')) return 3.5;
  if (mood.includes('5-6')) return 5.5;
  if (mood.includes('7-8')) return 7.5;
  if (mood.includes('9-10')) return 9.5;
  return 5; // default
};

const convertStressToNumber = (stress: string): number => {
  if (stress.includes('1-2')) return 1.5;
  if (stress.includes('3-4')) return 3.5;
  if (stress.includes('5-6')) return 5.5;
  if (stress.includes('7-8')) return 7.5;
  if (stress.includes('9-10')) return 9.5;
  return 5; // default
};

const convertSleepToNumber = (sleep: string): number => {
  if (sleep.includes('less than 5')) return 4.5;
  if (sleep.includes('5-6')) return 5.5;
  if (sleep.includes('6-7')) return 6.5;
  if (sleep.includes('7-8')) return 7.5;
  if (sleep.includes('8-9')) return 8.5;
  if (sleep.includes('more than 9')) return 9.5;
  return 7; // default
};

const convertWaterToNumber = (water: string): number => {
  if (water.includes('less than 1L')) return 0.8;
  if (water.includes('1-1.5L')) return 1.25;
  if (water.includes('1.5-2L')) return 1.75;
  if (water.includes('2-2.5L')) return 2.25;
  if (water.includes('2.5-3L')) return 2.75;
  if (water.includes('more than 3L')) return 3.5;
  return 2; // default
};

const convertNutritionToNumber = (nutrition: string): number => {
  if (nutrition.includes('poor')) return 30;
  if (nutrition.includes('fair')) return 50;
  if (nutrition.includes('good')) return 70;
  if (nutrition.includes('excellent')) return 90;
  return 60; // default
};

// Step 3: Generate personalized health plan
const generateHealthPlan = createStep({
  id: "generate-health-plan",
  description: "Generate comprehensive health improvement plan using AI analysis",
  inputSchema: z.object({
    validatedData: healthInputSchema,
    healthScores: z.object({
      overall: z.number(),
      physical: z.number(),
      mental: z.number(),
      lifestyle: z.number(),
      nutrition: z.number(),
    }),
    riskFactors: z.array(z.string()),
    positiveFactors: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
  outputSchema: healthAnalysisSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Health metrics data not found");
    }

    const { validatedData, healthScores, riskFactors, positiveFactors, recommendations } = inputData;

    // Prepare comprehensive data for AI analysis
    const healthDataSummary = {
      scores: healthScores,
      userProfile: {
        age: validatedData.age || "Not specified", 
        goals: validatedData.goals || [],
        concerns: validatedData.concerns || [],
      },
      currentMetrics: {
        sleep: validatedData.avgSleep || "Not tracked",
        hydration: validatedData.avgWater || "Not tracked", 
        activity: validatedData.avgSteps || "Not tracked",
        exercise: validatedData.exerciseFrequency || "Not tracked",
        mood: validatedData.avgMood || "Not tracked",
        stress: validatedData.avgStress || "Not tracked",
        nutrition: validatedData.nutritionScore || "Not tracked",
      },
      healthFactors: {
        strengths: positiveFactors,
        risks: riskFactors,
        symptoms: validatedData.symptoms || [],
        medications: validatedData.medications || [],
      },
      initialRecommendations: recommendations,
    };

    const prompt = `
Based on the following comprehensive health data, provide a detailed health analysis and personalized improvement plan:

${JSON.stringify(healthDataSummary, null, 2)}

Focus on:
1. Identifying the most impactful areas for improvement
2. Creating realistic, achievable goals
3. Providing specific, actionable recommendations
4. Considering the user's current lifestyle and constraints
5. Prioritizing safety and evidence-based practices
    `;

    const response = await healthAnalysisAgent.stream([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let analysisText = "";
    for await (const chunk of response.textStream) {
      analysisText += chunk;
    }

    // Sanitize the analysis text to remove problematic characters
    analysisText = analysisText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/[^\x20-\x7E\x0A\x0D\u00A0-\uFFFF]/g, '') // Keep only printable characters, newlines, and Unicode
      .trim();

    // Extract structured data from the analysis (simplified for this example)
    const immediateActions = [
      "Start tracking daily water intake with a goal of 2.5L",
      "Set a consistent sleep schedule aiming for 7-8 hours",
      "Take a 10-minute walk after each meal",
    ];

    const shortTermGoals = [
      "Increase daily steps to 8,000+ within 2 weeks",
      "Establish a 3x/week exercise routine",
      "Improve nutrition score to 80+ through meal planning",
    ];

    const longTermObjectives = [
      "Achieve overall health score of 85+ within 3 months",
      "Maintain consistent healthy habits for 90 days",
      "Complete comprehensive health assessment with healthcare provider",
    ];

    const healthAlerts = riskFactors.length > 0 ? [
      ...riskFactors.map(risk => `Monitor: ${risk}`),
      ...(validatedData.symptoms && validatedData.symptoms.length > 0 ? 
        ["Consider professional consultation for reported symptoms"] : [])
    ] : ["No immediate health alerts identified"];

    const trackingSuggestions = [
      "Daily: Water intake, sleep hours, mood rating",
      "Weekly: Exercise sessions, weight, energy levels",
      "Monthly: Overall health score, goal progress review",
    ];

    return {
      overallScore: healthScores.overall,
      strengths: positiveFactors.slice(0, 3),
      improvements: riskFactors.slice(0, 3),
      immediateActions,
      shortTermGoals,
      longTermObjectives,
      healthAlerts,
      trackingSuggestions,
      analysis: analysisText,
    };
  },
});

// Create the comprehensive health workflow
const healthWorkflow = createWorkflow({
  id: "comprehensive-health-workflow",
  inputSchema: healthInputSchema,
  outputSchema: healthAnalysisSchema,
})
  .then(collectHealthData)
  .then(calculateHealthMetrics)
  .then(generateHealthPlan);

healthWorkflow.commit();

export { healthWorkflow };