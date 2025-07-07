import dotenv from "dotenv";
import { ollama } from "ollama-ai-provider";

// Load environment variables once at the beginning
dotenv.config();

// Primary endpoint: Local Ollama
const primaryApiUrl = "http://127.0.0.1:11434/api";
// Fallback endpoint: Nosana
const fallbackApiUrl = "https://4qvrhtl5tvy69ca2veau9dxhpt43lbpofdjbu6r21wvv.node.k8s.prd.nos.ci/api";

export const modelName = process.env.MODEL_NAME_AT_ENDPOINT ?? "qwen2.5:1.5b";

// Function to check if Ollama is running locally, with up to 60 seconds wait
async function checkOllamaConnection(timeoutMs = 60000): Promise<boolean> {
  const start = Date.now();
  const check = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000); // 2s per try
      const response = await fetch(`${primaryApiUrl.replace('/api', '')}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeout);
      return response.ok;
    } catch (error) {
      return false;
    }
  };
  while (Date.now() - start < timeoutMs) {
    const ok = await check();
    if (ok) return true;
    await new Promise(res => setTimeout(res, 2000)); // wait 2s before retry
  }
  console.log("Local Ollama not available after waiting, will use fallback endpoint");
  return false;
}

// Determine which API URL to use
let apiBaseUrl: string;
try {
  const isOllamaAvailable = await checkOllamaConnection(60000); // wait up to 60s
  apiBaseUrl = isOllamaAvailable ? primaryApiUrl : fallbackApiUrl;
} catch (error) {
  console.log("Connection check failed, using fallback endpoint");
  apiBaseUrl = fallbackApiUrl;
}

// Override with environment variable if provided
if (process.env.API_BASE_URL) {
  apiBaseUrl = process.env.API_BASE_URL;
}

console.log(`Using Model: ${modelName}`);
console.log(`API Base URL: ${apiBaseUrl}`);



// Create and export the model instance using Ollama provider
// Try common endpoint keys: 'endpoint', 'url', or fallback to just apiBaseUrl
export const model = ollama(modelName, {
  endpoint: apiBaseUrl,
});

export { apiBaseUrl };