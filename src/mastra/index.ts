import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
<<<<<<< HEAD
import { weatherAgent } from "./agents/weather-agent/weather-agent"; // This can be deleted later
import { weatherWorkflow } from "./agents/weather-agent/weather-workflow"; // This can be deleted later
import { yourAgent } from "./agents/your-agent/your-agent"; // Build your agent here

export const mastra = new Mastra({
	workflows: { weatherWorkflow }, // can be deleted later
	agents: { weatherAgent, yourAgent },
=======
import { healthAgent } from "./agents/health-agent/health-agent"; // Our main Health & Wellness Agent
import { healthWorkflow } from "./agents/health-agent/health-workflow"; // Health & Wellness Workflow

export const mastra = new Mastra({
	workflows: { healthWorkflow },
	agents: { healthAgent },
>>>>>>> 1edbf2e (Finalize Health & Wellness AI Agent: updated README, configs, and deployment docs)
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	server: {
		port: 8080,
		timeout: 10000,
	},
<<<<<<< HEAD
});
=======
});
>>>>>>> 1edbf2e (Finalize Health & Wellness AI Agent: updated README, configs, and deployment docs)
