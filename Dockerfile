FROM ollama/ollama:0.7.0

<<<<<<< HEAD
# Qwen2.5:1.5b - Docker
ENV API_BASE_URL=http://127.0.0.1:11434/api
ENV MODEL_NAME_AT_ENDPOINT=qwen2.5:1.5b

# Qwen2.5:32b = Docker
# ENV API_BASE_URL=http://127.0.0.1:11434/api
# ENV MODEL_NAME_AT_ENDPOINT=qwen2.5:32b
=======
# Set Ollama to bind to all interfaces
ENV OLLAMA_HOST=0.0.0.0

# Disable PostHog telemetry to prevent network errors
ENV POSTHOG_DISABLED=true
>>>>>>> 1edbf2e (Finalize Health & Wellness AI Agent: updated README, configs, and deployment docs)

# Install system dependencies and Node.js
RUN apt-get update && apt-get install -y \
  curl \
<<<<<<< HEAD
=======
  lsof \
>>>>>>> 1edbf2e (Finalize Health & Wellness AI Agent: updated README, configs, and deployment docs)
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
<<<<<<< HEAD
COPY .env.docker package.json pnpm-lock.yaml ./
=======
COPY package.json pnpm-lock.yaml ./
>>>>>>> 1edbf2e (Finalize Health & Wellness AI Agent: updated README, configs, and deployment docs)

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

<<<<<<< HEAD
# Build the project
RUN pnpm run build

# Override the default entrypoint
ENTRYPOINT ["/bin/sh", "-c"]

# Start Ollama service and pull the model, then run the app
CMD ["ollama serve & sleep 5 && ollama pull ${MODEL_NAME_AT_ENDPOINT} && node .mastra/output/index.mjs"]
=======
# Copy the startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Override the default entrypoint
ENTRYPOINT ["/start.sh"]
>>>>>>> 1edbf2e (Finalize Health & Wellness AI Agent: updated README, configs, and deployment docs)
