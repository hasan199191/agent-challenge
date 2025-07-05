import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface NutritionData {
	food: string;
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
	fiber: number;
	sugar: number;
}

interface NutritionAnalysis {
	totalCalories: number;
	macros: {
		protein: number;
		carbs: number;
		fat: number;
		fiber: number;
		sugar: number;
	};
	analysis: string[];
	recommendations: string[];
	healthScore: number;
}

export const nutritionAnalysisTool = createTool({
	id: "analyze-nutrition",
	description: "Analyze nutritional intake and provide dietary recommendations",
	inputSchema: z.object({
		foods: z.array(z.enum(['chicken breast', 'salmon', 'eggs', 'tofu', 'rice', 'bread', 'pasta', 'oats', 'apple', 'banana', 'orange', 'broccoli', 'spinach', 'carrots', 'milk', 'yogurt', 'cheese', 'almonds', 'walnuts', 'avocado', 'sweet potato', 'quinoa', 'beans', 'lentils', 'turkey', 'beef', 'pork', 'fish', 'shrimp'])).describe("Foods you consumed"),
		portions: z.array(z.enum(['small', 'normal', 'large', 'extra large'])).optional().describe("Portion sizes for each food"),
		mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack', 'daily']).optional().describe("Type of meal being analyzed"),
		userGoals: z.array(z.enum(['weight loss', 'weight gain', 'muscle building', 'general health', 'energy boost', 'better digestion', 'heart health'])).optional().describe("Your health/fitness goals"),
		restrictions: z.array(z.enum(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut allergy', 'shellfish allergy', 'low sodium', 'diabetic', 'none'])).optional().describe("Dietary restrictions or allergies"),
	}),
	outputSchema: z.object({
		nutritionAnalysis: z.object({
			totalCalories: z.number(),
			macros: z.object({
				protein: z.number(),
				carbs: z.number(),
				fat: z.number(),
				fiber: z.number(),
				sugar: z.number(),
			}),
			analysis: z.array(z.string()),
			recommendations: z.array(z.string()),
			healthScore: z.number(),
			mealType: z.string(),
		}),
	}),
	execute: async ({ context }) => {
		return await analyzeNutrition(context);
	},
});

const analyzeNutrition = async (input: {
	foods: string[];
	portions?: string[];
	mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'daily';
	userGoals?: string[];
	restrictions?: string[];
}): Promise<{ nutritionAnalysis: NutritionAnalysis & { mealType: string } }> => {
	const { foods, portions, mealType = 'daily', userGoals, restrictions } = input;

	// Simplified nutrition database
	const nutritionDB: Record<string, NutritionData> = {
		// Proteins
		'chicken breast': { food: 'chicken breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
		'salmon': { food: 'salmon', calories: 208, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0 },
		'eggs': { food: 'eggs', calories: 155, protein: 13, carbs: 1, fat: 11, fiber: 0, sugar: 1 },
		'tofu': { food: 'tofu', calories: 94, protein: 10, carbs: 2, fat: 6, fiber: 2, sugar: 1 },
		
		// Carbohydrates
		'rice': { food: 'rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0 },
		'bread': { food: 'bread', calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5 },
		'pasta': { food: 'pasta', calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.8 },
		'oats': { food: 'oats', calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, sugar: 1 },
		
		// Fruits
		'apple': { food: 'apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10 },
		'banana': { food: 'banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12 },
		'orange': { food: 'orange', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9 },
		
		// Vegetables
		'broccoli': { food: 'broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.5 },
		'spinach': { food: 'spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4 },
		'carrots': { food: 'carrots', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7 },
		
		// Dairy
		'milk': { food: 'milk', calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5 },
		'yogurt': { food: 'yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2 },
		'cheese': { food: 'cheese', calories: 113, protein: 7, carbs: 1, fat: 9, fiber: 0, sugar: 1 },
		
		// Nuts and seeds
		'almonds': { food: 'almonds', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sugar: 4 },
		'walnuts': { food: 'walnuts', calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7, sugar: 3 },
	};

	let totalCalories = 0;
	let totalProtein = 0;
	let totalCarbs = 0;
	let totalFat = 0;
	let totalFiber = 0;
	let totalSugar = 0;

	const analysis: string[] = [];
	const recommendations: string[] = [];

	// Analyze each food item
	foods.forEach((food, index) => {
		const normalizedFood = food.toLowerCase().trim();
		let nutritionData: NutritionData | null = null;

		// Find exact or partial match
		Object.keys(nutritionDB).forEach(key => {
			if (normalizedFood.includes(key) || key.includes(normalizedFood)) {
				nutritionData = nutritionDB[key];
			}
		});

		if (nutritionData) {
			// Apply portion adjustment if provided
			let portionMultiplier = 1;
			if (portions && portions[index]) {
				const portion = portions[index].toLowerCase();
				if (portion.includes('half') || portion.includes('0.5')) {
					portionMultiplier = 0.5;
				} else if (portion.includes('double') || portion.includes('2')) {
					portionMultiplier = 2;
				} else if (portion.includes('small')) {
					portionMultiplier = 0.7;
				} else if (portion.includes('large')) {
					portionMultiplier = 1.5;
				}
			}

			totalCalories += nutritionData.calories * portionMultiplier;
			totalProtein += nutritionData.protein * portionMultiplier;
			totalCarbs += nutritionData.carbs * portionMultiplier;
			totalFat += nutritionData.fat * portionMultiplier;
			totalFiber += nutritionData.fiber * portionMultiplier;
			totalSugar += nutritionData.sugar * portionMultiplier;
		} else {
			analysis.push(`Unable to find detailed nutrition data for "${food}". Consider logging more specific food items.`);
		}
	});

	// Calculate percentages
	const proteinPercentage = totalCalories > 0 ? (totalProtein * 4 / totalCalories) * 100 : 0;
	const carbPercentage = totalCalories > 0 ? (totalCarbs * 4 / totalCalories) * 100 : 0;
	const fatPercentage = totalCalories > 0 ? (totalFat * 9 / totalCalories) * 100 : 0;

	// Analyze macronutrient balance
	if (proteinPercentage < 15) {
		analysis.push("Protein intake appears low. Consider adding more protein sources.");
		recommendations.push("Include lean proteins like chicken, fish, eggs, or legumes");
	} else if (proteinPercentage > 35) {
		analysis.push("Protein intake is quite high. Ensure you're getting enough carbs and healthy fats.");
	} else {
		analysis.push("Protein intake looks good!");
	}

	if (carbPercentage < 30) {
		analysis.push("Carbohydrate intake is low. Consider adding complex carbs for energy.");
		recommendations.push("Include whole grains, fruits, and vegetables for healthy carbs");
	} else if (carbPercentage > 65) {
		analysis.push("Carbohydrate intake is high. Consider balancing with more protein and healthy fats.");
	}

	if (fatPercentage < 20) {
		analysis.push("Fat intake is low. Healthy fats are important for nutrient absorption.");
		recommendations.push("Include healthy fats like avocados, nuts, olive oil, and fatty fish");
	} else if (fatPercentage > 40) {
		analysis.push("Fat intake is quite high. Consider moderating portion sizes of high-fat foods.");
	}

	// Fiber analysis
	if (totalFiber < 10) {
		analysis.push("Fiber intake is low. Increase fruits, vegetables, and whole grains.");
		recommendations.push("Aim for at least 25-35g of fiber daily from whole foods");
	}

	// Sugar analysis
	if (totalSugar > 50) {
		analysis.push("Sugar intake is high. Consider reducing added sugars and processed foods.");
		recommendations.push("Focus on natural sugars from fruits rather than processed foods");
	}

	// Meal-specific recommendations
	if (mealType === 'breakfast') {
		if (proteinPercentage < 20) {
			recommendations.push("Add protein to your breakfast for better satiety and energy");
		}
		if (totalFiber < 5) {
			recommendations.push("Include fiber-rich foods like oats or fruits for sustained energy");
		}
	}

	// Goal-specific recommendations
	if (userGoals?.includes('weight loss')) {
		recommendations.push("Focus on high-protein, high-fiber foods for satiety");
		recommendations.push("Consider portion control and mindful eating");
	}

	if (userGoals?.includes('muscle gain')) {
		recommendations.push("Ensure adequate protein intake (1.6-2.2g per kg body weight)");
		recommendations.push("Include post-workout protein and carbs for recovery");
	}

	// Calculate health score (0-100)
	let healthScore = 50; // Base score

	// Protein score
	if (proteinPercentage >= 15 && proteinPercentage <= 35) healthScore += 15;
	else if (proteinPercentage >= 10 && proteinPercentage <= 40) healthScore += 10;

	// Carb score
	if (carbPercentage >= 30 && carbPercentage <= 65) healthScore += 15;
	else if (carbPercentage >= 25 && carbPercentage <= 70) healthScore += 10;

	// Fat score
	if (fatPercentage >= 20 && fatPercentage <= 35) healthScore += 15;
	else if (fatPercentage >= 15 && fatPercentage <= 40) healthScore += 10;

	// Fiber bonus
	if (totalFiber >= 10) healthScore += 10;
	else if (totalFiber >= 5) healthScore += 5;

	// Sugar penalty
	if (totalSugar > 50) healthScore -= 10;
	else if (totalSugar > 30) healthScore -= 5;

	// Ensure score is within bounds
	healthScore = Math.max(0, Math.min(100, healthScore));

	// Add general recommendations
	if (recommendations.length === 0) {
		recommendations.push("Your nutrition looks balanced! Keep up the good work.");
		recommendations.push("Stay hydrated and consider meal timing for optimal energy");
	}

	return {
		nutritionAnalysis: {
			totalCalories: Math.round(totalCalories),
			macros: {
				protein: Math.round(totalProtein * 10) / 10,
				carbs: Math.round(totalCarbs * 10) / 10,
				fat: Math.round(totalFat * 10) / 10,
				fiber: Math.round(totalFiber * 10) / 10,
				sugar: Math.round(totalSugar * 10) / 10,
			},
			analysis,
			recommendations: recommendations.slice(0, 5), // Limit to top 5
			healthScore,
			mealType,
		}
	};
};