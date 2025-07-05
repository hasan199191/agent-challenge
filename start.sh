#!/bin/sh

# Start Ollama in the background
/usr/bin/ollama serve &

# Wait for Ollama to be ready by checking its API endpoint
echo "Waiting for Ollama to start..."
until curl -s http://0.0.0.0:11434/api/tags > /dev/null; do
  /bin/sleep 1
done
echo "Ollama started."

# Pull the specified model
/usr/bin/ollama pull ${MODEL_NAME_AT_ENDPOINT:-qwen2.5:1.5b}

# Wait for the model to be fully loaded and ready for chat completions
echo "Waiting for model to be ready for chat completions..."
until curl -s -X POST http://0.0.0.0:11434/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"${MODEL_NAME_AT_ENDPOINT:-qwen2.5:1.5b}\",\"messages\":[{\"role\":\"user\",\"content\":\"test\"}],\"stream\":false}" \
  > /dev/null 2>&1; do
  echo "Model not ready yet, waiting..."
  /bin/sleep 2
done
echo "Model is ready for chat completions."

# Set correct environment variables for container runtime
export API_BASE_URL=http://0.0.0.0:11434/api
export MODEL_NAME_AT_ENDPOINT=${MODEL_NAME_AT_ENDPOINT:-qwen2.5:1.5b}
export GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY}

# Kill any existing process on port 8080 and wait a moment
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
sleep 5

# Ollama'yı arka planda başlat
ollama serve &

# Ollama'nın hazır olmasını bekle
until curl -s http://0.0.0.0:11434/api/tags > /dev/null; do
  sleep 1
done

# Modeli çek
ollama pull ${MODEL_NAME_AT_ENDPOINT:-qwen2.5:1.5b}

# Modelin hazır olmasını bekle
until curl -s -X POST http://0.0.0.0:11434/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"${MODEL_NAME_AT_ENDPOINT:-qwen2.5:1.5b}\",\"messages\":[{\"role\":\"user\",\"content\":\"test\"}],\"stream\":false}" \
  > /dev/null 2>&1; do
  sleep 2
done

echo "Ollama ve model hazır."

# Mastra agent'ı dev modda başlat (Playground için)
pnpm dev