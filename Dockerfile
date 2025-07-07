FROM ollama/ollama:0.7.0

# Set Ollama to bind to all interfaces
ENV OLLAMA_HOST=0.0.0.0

# Disable PostHog telemetry to prevent network errors
ENV POSTHOG_DISABLED=true

# Install system dependencies and Node.js
RUN apt-get update && apt-get install -y \
  curl \
  lsof \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the project
RUN pnpm run build

# Copy the startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Override the default entrypoint
ENTRYPOINT ["/bin/sh", "-c"]

# Start Ollama service and pull the model, then run the app
CMD ["/start.sh"]