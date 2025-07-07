import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { healthAgent } from "./agents/health-agent/health-agent"; // Our main Health & Wellness Agent
import { healthWorkflow } from "./agents/health-agent/health-workflow"; // Health & Wellness Workflow

export const mastra = new Mastra({
	workflows: { healthWorkflow },
	agents: { healthAgent },
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	server: {
		port: 8080,
		timeout: 10000,
	},
});