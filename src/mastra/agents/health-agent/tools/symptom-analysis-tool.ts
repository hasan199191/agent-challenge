import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface SymptomAnalysisResult {
	symptoms: string[];
	severity: 'mild' | 'moderate' | 'severe';
	possibleCauses: string[];
	recommendations: string[];
	urgencyLevel: 'low' | 'medium' | 'high';
	shouldSeeDoctor: boolean;
}

export const symptomAnalysisTool = createTool({
	id: "analyze-symptoms",
	description: "Analyze reported symptoms and provide preliminary health insights and recommendations",
	inputSchema: z.object({
		symptoms: z.array(z.enum(['headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness', 'chest pain', 'shortness of breath', 'stomach pain', 'back pain', 'joint pain', 'sore throat', 'runny nose', 'muscle aches', 'insomnia', 'anxiety', 'depression'])).describe("List of symptoms you're experiencing"),
		duration: z.enum(['less than 1 day', '1-3 days', '4-7 days', '1-2 weeks', '2-4 weeks', 'more than 1 month']).optional().describe("How long have you had these symptoms?"),
		severity: z.enum(['mild', 'moderate', 'severe']).optional().describe("User's assessment of symptom severity"),
		age: z.number().optional().describe("User's age"),
		existingConditions: z.array(z.enum(['diabetes', 'hypertension', 'heart disease', 'asthma', 'allergies', 'arthritis', 'depression', 'anxiety', 'thyroid disorder', 'none'])).optional().describe("Any existing medical conditions"),
	}),
	outputSchema: z.object({
		analysis: z.object({
			symptoms: z.array(z.string()),
			severity: z.enum(['mild', 'moderate', 'severe']),
			possibleCauses: z.array(z.string()),
			recommendations: z.array(z.string()),
			urgencyLevel: z.enum(['low', 'medium', 'high']),
			shouldSeeDoctor: z.boolean(),
			disclaimer: z.string(),
		}),
	}),
	execute: async ({ context }) => {
		return await analyzeSymptoms(context);
	},
});

const analyzeSymptoms = async (input: {
	symptoms: string[];
	duration?: string;
	severity?: 'mild' | 'moderate' | 'severe';
	age?: number;
	existingConditions?: string[];
}): Promise<{ analysis: SymptomAnalysisResult & { disclaimer: string } }> => {
	const { symptoms, duration, severity, age, existingConditions } = input;

	// Symptom analysis logic
	const commonSymptoms = {
		'headache': {
			causes: ['tension', 'dehydration', 'stress', 'eye strain', 'lack of sleep'],
			recommendations: ['rest in dark room', 'stay hydrated', 'apply cold compress', 'manage stress'],
			urgency: 'low'
		},
		'fever': {
			causes: ['viral infection', 'bacterial infection', 'inflammation'],
			recommendations: ['rest', 'stay hydrated', 'monitor temperature', 'take fever reducer if needed'],
			urgency: 'medium'
		},
		'chest pain': {
			causes: ['muscle strain', 'acid reflux', 'anxiety', 'heart condition'],
			recommendations: ['rest', 'avoid strenuous activity', 'seek immediate medical attention if severe'],
			urgency: 'high'
		},
		'cough': {
			causes: ['cold', 'allergies', 'dry air', 'respiratory infection'],
			recommendations: ['stay hydrated', 'use humidifier', 'honey for throat', 'avoid irritants'],
			urgency: 'low'
		},
		'fatigue': {
			causes: ['lack of sleep', 'stress', 'poor nutrition', 'dehydration', 'underlying condition'],
			recommendations: ['improve sleep schedule', 'balanced diet', 'regular exercise', 'stress management'],
			urgency: 'low'
		}
	};

	let possibleCauses: string[] = [];
	let recommendations: string[] = [];
	let urgencyLevel: 'low' | 'medium' | 'high' = 'low';
	let shouldSeeDoctor = false;

	// Analyze each symptom
	symptoms.forEach(symptom => {
		const normalizedSymptom = symptom.toLowerCase();
		
		// Check for exact matches or partial matches
		Object.keys(commonSymptoms).forEach(key => {
			if (normalizedSymptom.includes(key)) {
				const symptomData = commonSymptoms[key as keyof typeof commonSymptoms];
				possibleCauses.push(...symptomData.causes);
				recommendations.push(...symptomData.recommendations);
				
				if (symptomData.urgency === 'high') {
					urgencyLevel = 'high';
					shouldSeeDoctor = true;
				} else if (symptomData.urgency === 'medium' && urgencyLevel !== 'high') {
					urgencyLevel = 'medium';
				}
			}
		});
	});

	// Remove duplicates
	possibleCauses = [...new Set(possibleCauses)];
	recommendations = [...new Set(recommendations)];

	// Adjust urgency based on duration and severity
	if (duration && (duration.includes('week') || duration.includes('month'))) {
		if (urgencyLevel === 'low') urgencyLevel = 'medium';
		shouldSeeDoctor = true;
	}

	if (severity === 'severe') {
		urgencyLevel = 'high';
		shouldSeeDoctor = true;
	}

	// Check for concerning symptom combinations
	const concerningCombinations = [
		['chest pain', 'shortness of breath'],
		['severe headache', 'fever', 'neck stiffness'],
		['abdominal pain', 'vomiting', 'fever']
	];

	concerningCombinations.forEach(combination => {
		const hasAllSymptoms = combination.every(symptom => 
			symptoms.some(userSymptom => userSymptom.toLowerCase().includes(symptom))
		);
		if (hasAllSymptoms) {
			urgencyLevel = 'high';
			shouldSeeDoctor = true;
		}
	});

	// Add general recommendations
	recommendations.push(
		'Monitor symptoms closely',
		'Get adequate rest',
		'Stay well hydrated',
		'Maintain a healthy diet'
	);

	if (shouldSeeDoctor) {
		recommendations.unshift('Consult with a healthcare professional');
	}

	const finalSeverity = severity || (urgencyLevel === 'high' ? 'severe' : urgencyLevel === 'medium' ? 'moderate' : 'mild');

	return {
		analysis: {
			symptoms,
			severity: finalSeverity,
			possibleCauses: possibleCauses.length > 0 ? possibleCauses : ['Various factors could contribute to these symptoms'],
			recommendations: recommendations.slice(0, 6), // Limit to top 6 recommendations
			urgencyLevel,
			shouldSeeDoctor,
			disclaimer: "This analysis is for informational purposes only and does not constitute medical advice. Always consult with qualified healthcare professionals for proper diagnosis and treatment."
		}
	};
};