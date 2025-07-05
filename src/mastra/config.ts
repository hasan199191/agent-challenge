import dotenv from "dotenv";
import { ollama } from "ollama-ai-provider";
import axios from "axios";

// Load environment variables
dotenv.config();

export const modelName = process.env.MODEL_NAME_AT_ENDPOINT ?? "qwen2.5:1.5b";
const localBaseUrl = "http://0.0.0.0:11434/api";
const remoteBaseUrl = "https://4qvrhtl5tvy69ca2veau9dxhpt43lbpofdjbu6r21wvv.node.k8s.prd.nos.ci/";

async function getAvailableBaseUrl() {
  // Try local Ollama endpoint first
  try {
    await axios.get(localBaseUrl + "/tags", { timeout: 2000 });
    console.log("Using local Ollama endpoint.");
    return localBaseUrl;
  } catch (e) {
    // If local fails, try remote Nosana endpoint
    try {
      await axios.get(remoteBaseUrl + "/tags", { timeout: 2000 });
      console.log("Using remote Nosana endpoint.");
      return remoteBaseUrl;
    } catch (e2) {
      throw new Error("No LLM endpoint available!");
    }
  }
}

export const modelPromise = getAvailableBaseUrl().then(baseURL => {
  console.log(`Using Model: ${modelName}`);
  console.log(`API Base URL: ${baseURL}`);
  return ollama(modelName, { baseURL } as any);
});
