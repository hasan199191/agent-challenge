# 📦 Submission Process

To complete your submission for the Nosana Builders Challenge, follow these steps:

1. **Complete All Requirements**
   - [x] All code changes and features implemented
   - [x] Docker container built and pushed

2. **Push All Changes**
   - Commit and push all code and documentation updates to the `main` branch of your forked repo:
     - All your code changes
     - Updated README
     - Link to your Docker container
     - Link to your video demo
     - Nosana deployment proof

3. **Provide Required Links**
   - **GitHub Repository:** https://github.com/hasan199191/agent-challenge
   - **Docker Image:** `hasanacikgoz91/hasanacikgoz91-agent-challenge:latest`
   - **Video Demo:** https://vimeo.com/1098995500?share=copy
   - **Nosana Deployment Proof:** (Add your Nosana job ID or dashboard link after successful deployment)

4. **Social Media Post**
   - Share your project on X (Twitter)
   - Tag **@nosana_ai**
   - Add a short description of your agent
   - Use hashtag **#NosanaAgentChallenge**
   - Example post:
     ```
     🚀 Deployed a Health & Wellness AI Agent for the #NosanaAgentChallenge! 
     Open-source, Dockerized, and privacy-friendly—runs on Ollama & Nosana endpoints. 
     Try it now! 
     @nosana_ai
     [GitHub] https://github.com/hasan199191/agent-challenge
     [Demo] https://vimeo.com/1098995500?share=copy
     ```

5. **Finalize Submission**
   - Go to https://earn.superteam.fun/agent-challenge
   - Add your forked GitHub repo link
   - Add your X (Twitter) post link
   - Add your Docker image and video demo links
   - Add Nosana deployment proof (job ID or dashboard link)

---
---

## 📦 Submission Process

To complete your submission for the Nosana Builders Challenge, follow these steps:

1. **Complete All Requirements**
   - [x] All code changes and features implemented
   - [x] Updated and detailed README
   - [x] Docker container built and pushed

2. **Push All Changes**
   - Commit and push all code and documentation updates to the `main` branch of your forked repo:
     **GitHub Repo:** https://github.com/hasan199191/agent-challenge

3. **Provide Required Links**
   - **Docker Image:**
     `hasanacikgoz91/hasanacikgoz91-agent-challenge:latest`
   - **Video Demo:**
     [Watch on Vimeo](https://vimeo.com/1098995500?share=copy)
   - **Nosana Deployment Proof:**
     (Add your Nosana job ID or dashboard link after successful deployment)
   - **Social Media Post:**
     [View on X (Twitter)](https://x.com/chefcryptoz/status/1941488509199495249)

4. **Social Media Post**
   - Share your project on X (Twitter)
   - Tag **@nosana_ai**
   - Add a short description of your agent
   - Use hashtag **#NosanaAgentChallenge**

5. **Finalize Submission**
   - Go to https://earn.superteam.fun/agent-challenge
   - Add your forked GitHub repo link
   - Add your X (Twitter) post link
   - Add your Docker image and video demo links
   - Add Nosana deployment proof (job ID or dashboard link)

---
<<<<<<< HEAD
# Nosana Builders Challenge: Agent-101

![Agent-101](./assets/NosanaBuildersChallengeAgents.jpg)

## Topic

Nosana Builders Challenge, 2nd edition
Agent-101: Build your first agent

## Description

The main goal of this `Nosana Builders Challenge` to teach participants to build and deploy agents. This first step will be in running a basic AI agent and giving it some basic functionality. Participants will add a tool, for the tool calling capabilities of the agent. These are basically some TypeScript functions, that will, for example, retrieve some data from a weather API, post a tweet via an API call, etc.

## [Mastra](https://github.com/mastra-ai/mastra)

For this challenge we will be using Mastra to build our tool.

> Mastra is an opinionated TypeScript framework that helps you build AI applications and features quickly. It gives you the set of primitives you need: workflows, agents, RAG, integrations, and evals. You can run Mastra on your local machine, or deploy to a serverless cloud.

### Required Reading

We recommend reading the following sections to get started with how to create an Agent and how to implement Tool Calling.

- <https://mastra.ai/en/docs/agents/overview>
- [Mastra Guide: Build an AI stock agent](https://mastra.ai/en/guides/guide/stock-agent)

## Get Started

To get started run the following command to start developing:
We recommend using [pnpm](https://pnpm.io/installation), but you can try npm, or bun if you prefer.

```sh
pnpm install
pnpm run dev
```

## Assignment

### Challenge Overview

Welcome to the Nosana AI Agent Hackathon! Your mission is to build and deploy an AI agent on Nosana.
While we provide a weather agent as an example, your creativity is the limit. Build agents that:

**Beginner Level:**

- **Simple Calculator**: Perform basic math operations with explanations
- **Todo List Manager**: Help users track their daily tasks

**Intermediate Level:**

- **News Summarizer**: Fetch and summarize latest news articles
- **Crypto Price Checker**: Monitor cryptocurrency prices and changes
- **GitHub Stats Reporter**: Fetch repository statistics and insights

**Advanced Level:**

- **Blockchain Monitor**: Track and alert on blockchain activities
- **Trading Strategy Bot**: Automate simple trading strategies
- **Deploy Manager**: Deploy and manage applications on Nosana

Or any other innovative AI agent idea at your skill level!

### Getting Started

1. **Fork the [Nosana Agent Challenge](https://github.com/nosana-ai/agent-challenge)** to your GitHub account
2. **Clone your fork** locally
3. **Install dependencies** with `pnpm install`
4. **Run the development server** with `pnpm run dev`
5. **Build your agent** using the Mastra framework

### How to build your Agent

Here we will describe the steps needed to build an agent.

#### Folder Structure

Provided in this repo, there is the `Weather Agent`.
This is a fully working agent that allows a user to chat with an LLM, and fetches real time weather data for the provided location.

There are two main folders we need to pay attention to:

- [src/mastra/agents/weather-agent/](./src/mastra/agents/weather-agent/)
- [src/mastra/agents/your-agents/](./src/mastra/agents/your-agent/)

In `src/mastra/agents/weather-agent/` you will find a complete example of a working agent. Complete with Agent definition, API calls, interface definition, basically everything needed to get a full fledged working agent up and running.
In `src/mastra/agents/your-agents/` you will find a bare bones example of the needed components, and imports to get started building your agent, we recommend you rename this folder, and it's files to get started.

Rename these files to represent the purpose of your agent and tools. You can use the [Weather Agent Example](#example:_weather_agent) as a guide until you are done with it, and then you can delete these files before submitting your final submission.

As a bonus, for the ambitious ones, we have also provided the [src/mastra/agents/weather-agent/weather-workflow.ts](./src/mastra/agents/weather-agent/weather-workflow.ts) file as an example. This file contains an example of how you can chain agents and tools to create a workflow, in this case, the user provides their location, and the agent retrieves the weather for the specified location, and suggests an itinerary.

### LLM-Endpoint

Agents depend on an LLM to be able to do their work.

#### Nosana Endpoint

You can use the following endpoint and model for testing, if you wish:

```
MODEL_NAME_AT_ENDPOINT=qwen2.5:1.5b
API_BASE_URL= https://dashboard.nosana.com/jobs/GPVMUckqjKR6FwqnxDeDRqbn34BH7gAa5xWnWuNH1drf
```

#### Running Your Own LLM with Ollama

The default configuration uses a local [Ollama](https://ollama.com) LLM.
For local development or if you prefer to use your own LLM, you can use [Ollama](https://ollama.ai) to serve the lightweight `qwen2.5:1.5b` mode.

**Installation & Setup:**

1. **[ Install Ollama ](https://ollama.com/download)**:

2. **Start Ollama service**:

```bash
ollama serve
```

3. **Pull and run the `qwen2.5:1.5b` model**:

```bash
ollama pull qwen2.5:1.5b
ollama run qwen2.5:1.5b
```

4. **Update your `.env` file**

There are two predefined environments defined in the `.env` file. One for local development and another, with a larger model, `qwen2.5:32b`, for more complex use cases.

**Why `qwen2.5:1.5b`?**

- Lightweight (only ~1GB)
- Fast inference on CPU
- Supports tool calling
- Great for development and testing

Do note `qwen2.5:1.5b` is not suited for complex tasks.

The Ollama server will run on `http://localhost:11434` by default and is compatible with the OpenAI API format that Mastra expects.

### Testing your Agent

You can read the [Mastra Documentation: Playground](https://mastra.ai/en/docs/local-dev/mastra-dev) to learn more on how to test your agent locally.
Before deploying your agent to Nosana, it's crucial to thoroughly test it locally to ensure everything works as expected. Follow these steps to validate your agent:

**Local Testing:**

1. **Start the development server** with `pnpm run dev` and navigate to `http://localhost:8080` in your browser
2. **Test your agent's conversation flow** by interacting with it through the chat interface
3. **Verify tool functionality** by triggering scenarios that call your custom tools
4. **Check error handling** by providing invalid inputs or testing edge cases
5. **Monitor the console logs** to ensure there are no runtime errors or warnings

**Docker Testing:**
After building your Docker container, test it locally before pushing to the registry:

```bash
=======
## 🩺 Health & Wellness AI Agent for Nosana Builders Challenge

### Agent Description & Purpose
This project is a fully containerized Health & Wellness AI Agent built with the Mastra framework for the Nosana Builders Challenge. The agent provides:
- Symptom analysis
- Nutrition analysis
- Medication reminders
- Exercise planning
- Mental health support
- Lifestyle tracking
- Health reporting
and more, all via natural language prompts.

The agent uses only open-source LLM endpoints (Ollama and Nosana), with a robust fallback mechanism: it first tries a local Ollama instance, then automatically switches to the Nosana remote endpoint if local is unavailable. All Gemini/OpenAI dependencies have been removed for privacy and open-source compliance.

---

## 🚀 Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/health-wellness-agent.git
   cd health-wellness-agent
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and adjust as needed for local or remote (Nosana) endpoints.
   - See the [Environment Variables](#environment-variables) section below.
4. **Run locally (with Ollama):**
   - Start Ollama and pull the model:
     ```sh
     ollama serve
     ollama pull qwen2.5:1.5b
     ```
   - Start the agent:
     ```sh
     pnpm run dev
     ```
   - Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## ⚙️ Environment Variables

Set these in your `.env` file (see `.env.example` for details):

```
MODEL_NAME_AT_ENDPOINT=qwen2.5:1.5b
API_BASE_URL=http://0.0.0.0:11434/api
```

For Nosana remote endpoint:
```
MODEL_NAME_AT_ENDPOINT=qwen2.5:1.5b
API_BASE_URL=https://4qvrhtl5tvy69ca2veau9dxhpt43lbpofdjbu6r21wvv.node.k8s.prd.nos.ci/
```

---

## 🐳 Docker Build & Run

1. **Build the Docker image:**
   ```sh
   docker build -t yourusername/agent-challenge:latest .
   ```
2. **Run the container locally:**
   ```sh
   docker run -p 8080:8080 --env-file .env yourusername/agent-challenge:latest
   ```
3. **Push to Docker Hub:**
   ```sh
   docker push yourusername/agent-challenge:latest
   ```

---

## 💬 Example Usage

**Simple Prompts:**
- "I have a headache and feel tired"
- "Remind me to take my blood pressure medication"
- "Create a workout plan for beginners"
- "Track my sleep: 7 hours, quality 8/10"
- "Generate my weekly health summary"

**Advanced Workflow:**
```
Run comprehensive health analysis with my data: age 30, goals weight loss and better sleep, current metrics: 6.5h sleep, 1.8L water, 7500 steps, 2 workouts/week, mood 6/10, stress 7/10, nutrition score 65, symptoms: headache and fatigue
```

---

## 📺 Demo Video & Social

- **Video Demo:** [Watch on Vimeo](https://vimeo.com/1098995500?share=copy)
- **Tweet:** [View on X (Twitter)](https://x.com/chefcryptoz/status/1941488509199495249)

---

## 📝 Notes
- All OpenAI/Gemini dependencies are removed. Only Ollama and Nosana endpoints are used.
- Fallback logic: tries local Ollama first, then Nosana remote endpoint.
- Fully tested locally and in Docker. Ready for Nosana deployment.
- For more details, see the code and comments in `src/mastra/config.ts` and the Dockerfile.

As a bonus, for the ambitious ones, we have also provided the src/mastra/agents/weather-agent/weather-workflow.ts file as an example. This file contains an example of how you can chain agents and tools to create a workflow, in this case, the user provides their location, and the agent retrieves the weather for the specified location, and suggests an itinerary.

LLM-Endpoint
Agents depend on an LLM to be able to do their work.

Nosana Endpoint
You can use the following endpoint and model for testing, if you wish:

MODEL_NAME_AT_ENDPOINT=qwen2.5:1.5b
API_BASE_URL= https://dashboard.nosana.com/jobs/GPVMUckqjKR6FwqnxDeDRqbn34BH7gAa5xWnWuNH1drf
Running Your Own LLM with Ollama
The default configuration uses a local Ollama LLM. For local development or if you prefer to use your own LLM, you can use Ollama to serve the lightweight qwen2.5:1.5b mode.

Installation & Setup:

Install Ollama :

Start Ollama service:

ollama serve
Pull and run the qwen2.5:1.5b model:
ollama pull qwen2.5:1.5b
ollama run qwen2.5:1.5b
Update your .env file
There are two predefined environments defined in the .env file. One for local development and another, with a larger model, qwen2.5:32b, for more complex use cases.

Why qwen2.5:1.5b?

Lightweight (only ~1GB)
Fast inference on CPU
Supports tool calling
Great for development and testing
Do note qwen2.5:1.5b is not suited for complex tasks.

The Ollama server will run on http://localhost:11434 by default and is compatible with the OpenAI API format that Mastra expects.

Testing your Agent
You can read the Mastra Documentation: Playground to learn more on how to test your agent locally. Before deploying your agent to Nosana, it's crucial to thoroughly test it locally to ensure everything works as expected. Follow these steps to validate your agent:

Local Testing:

Start the development server with pnpm run dev and navigate to http://localhost:8080 in your browser
Test your agent's conversation flow by interacting with it through the chat interface
Verify tool functionality by triggering scenarios that call your custom tools
Check error handling by providing invalid inputs or testing edge cases
Monitor the console logs to ensure there are no runtime errors or warnings
Docker Testing: After building your Docker container, test it locally before pushing to the registry:

>>>>>>> 1edbf2e (Finalize Health & Wellness AI Agent: updated README, configs, and deployment docs)
# Build your container
docker build -t yourusername/agent-challenge:latest .

# Run it locally with environment variables
docker run -p 8080:8080 --env-file .env yourusername/agent-challenge:latest

# Test the containerized agent at http://localhost:8080
<<<<<<< HEAD
```

Ensure your agent responds correctly and all tools function properly within the containerized environment. This step is critical as the Nosana deployment will use this exact container.

### Submission Requirements

#### 1. Code Development

- Fork this repository and develop your AI agent
- Your agent must include at least one custom tool (function)
- Code must be well-documented and include clear setup instructions
- Include environment variable examples in a `.env.example` file

#### 2. Docker Container

- Create a `Dockerfile` for your agent
- Build and push your container to Docker Hub or GitHub Container Registry
- Container must be publicly accessible
- Include the container URL in your submission

##### Build, Run, Publish

Note: You'll need an account on [Dockerhub](https://hub.docker.com/)

```sh
=======
Ensure your agent responds correctly and all tools function properly within the containerized environment. This step is critical as the Nosana deployment will use this exact container.

Submission Requirements
1. Code Development
Fork this repository and develop your AI agent
Your agent must include at least one custom tool (function)
Code must be well-documented and include clear setup instructions
Include environment variable examples in a .env.example file
2. Docker Container
Create a Dockerfile for your agent
Build and push your container to Docker Hub or GitHub Container Registry
Container must be publicly accessible
Include the container URL in your submission
Build, Run, Publish
Note: You'll need an account on Dockerhub
>>>>>>> 1edbf2e (Finalize Health & Wellness AI Agent: updated README, configs, and deployment docs)

# Build and tag
docker build -t yourusername/agent-challenge:latest .

# Run the container locally
docker run -p 8080:8080 yourusername/agent-challenge:latest

# Login
docker login

# Push
docker push yourusername/agent-challenge:latest
<<<<<<< HEAD
```

#### 3. Nosana Deployment

- Deploy your Docker container on Nosana
- Your agent must successfully run on the Nosana network
- Include the Nosana job ID or deployment link

##### Nosana Job Definition

We have included a Nosana job definition at <./nos_job_def/nosana_mastra.json>, that you can use to publish your agent to the Nosana network.

**A. Deploying using [@nosana/cli](https://github.com/nosana-ci/nosana-cli/)**

- Edit the file and add in your published docker image to the `image` property. `"image": "docker.io/yourusername/agent-challenge:latest"`
- Download and install the [@nosana/cli](https://github.com/nosana-ci/nosana-cli/)
- Load your wallet with some funds
  - Retrieve your address with: `nosana address`
  - Go to our [Discord](https://nosana.com/discord) and ask for some NOS and SOL to publish your job.
- Run: `nosana job post --file nosana_mastra.json --market nvidia-3060 --timeout 30`
- Go to the [Nosana Dashboard](https://dashboard.nosana.com/deploy) to see your job

**B. Deploying using the [Nosana Dashboard](https://dashboard.nosana.com/deploy)**

- Make sure you have https://phantom.com/, installed for your browser.
- Go to our [Discord](https://nosana.com/discord) and ask for some NOS and SOL to publish your job.
- Click the `Expand` button, on the [Nosana Dashboard](https://dashboard.nosana.com/deploy)
- Copy and Paste your edited Nosana Job Definition file into the Textarea
- Choose an appropriate GPU for the AI model that you are using
- Click `Deploy`

#### 4. Video Demo

- Record a 1-3 minute video demonstrating:
  - Your agent running on Nosana
  - Key features and functionality
  - Real-world use case demonstration
- Upload to YouTube, Loom, or similar platform

#### 5. Documentation

- Update this README with:
  - Agent description and purpose
  - Setup instructions
  - Environment variables required
  - Docker build and run commands
  - Example usage

### Submission Process

1. **Complete all requirements** listed above
2. **Commit all of your changes to the `main` branch of your forked repository**
   - All your code changes
   - Updated README
   - Link to your Docker container
   - Link to your video demo
   - Nosana deployment proof
3. **Social Media Post**: Share your submission on X (Twitter)
   - Tag @nosana_ai
   - Include a brief description of your agent
   - Add hashtag #NosanaAgentChallenge
4. **Finalize your submission on the <https://earn.superteam.fun/agent-challenge> page**

- Remember to add your forked GitHub repository link
- Remember to add a link to your X post.

### Judging Criteria

Submissions will be evaluated based on:

1. **Innovation** (25%)

   - Originality of the agent concept
   - Creative use of AI capabilities

2. **Technical Implementation** (25%)

   - Code quality and organization
   - Proper use of the Mastra framework
   - Efficient tool implementation

3. **Nosana Integration** (25%)

   - Successful deployment on Nosana
   - Resource efficiency
   - Stability and performance

4. **Real-World Impact** (25%)
   - Practical use cases
   - Potential for adoption
   - Value proposition

### Prizes

We’re awarding the **top 10 submissions**:

- 🥇 1st: $1,000 USDC
- 🥈 2nd: $750 USDC
- 🥉 3rd: $450 USDC
- 🏅 4th: $200 USDC
- 🔟 5th–10th: $100 USDC

All prizes are paid out directly to participants on [SuperTeam](https://superteam.fun)

### Resources

- [Nosana Documentation](https://docs.nosana.io)
- [Mastra Documentation](https://mastra.ai/docs)
- [Mastra Guide: Build an AI stock agent](https://mastra.ai/en/guides/guide/stock-agent)
- [Nosana CLI](https://github.com/nosana-ci/nosana-cli)
- [Docker Documentation](https://docs.docker.com)

### Support

- Join [Nosana Discord](https://nosana.com/discord) for technical support where we have dedicated [Builders Challenge Dev chat](https://discord.com/channels/236263424676331521/1354391113028337664) channel.
- Follow [@nosana_ai](https://x.com/nosana_ai) for updates.

### Important Notes

- Ensure your agent doesn't expose sensitive data
- Test thoroughly before submission
- Keep your Docker images lightweight
- Document all dependencies clearly
- Make your code reproducible
- You can vibe code it if you want 😉
- **Only one submission per participant**
- **Submissions that do not compile, and do not meet the specified requirements, will not be considered**
- **Deadline is: 9 July 2025, 12.01 PM**
- **Announcement will be announced about one week later, stay tuned for our socials for exact date**
- **Finalize your submission at [SuperTeam](https://earn.superteam.fun/agent-challenge)**

### Don’t Miss Nosana Builder Challenge Updates

Good luck, builders! We can't wait to see the innovative AI agents you create for the Nosana ecosystem.
**Happy Building!**
=======
3. Nosana Deployment
Deploy your Docker container on Nosana
Your agent must successfully run on the Nosana network
Include the Nosana job ID or deployment link
Nosana Job Definition
We have included a Nosana job definition at <./nos_job_def/nosana_mastra.json>, that you can use to publish your agent to the Nosana network.

A. Deploying using @nosana/cli

Edit the file and add in your published docker image to the image property. "image": "docker.io/yourusername/agent-challenge:latest"
Download and install the @nosana/cli
Load your wallet with some funds
Retrieve your address with: nosana address
Go to our Discord and ask for some NOS and SOL to publish your job.
Run: nosana job post --file nosana_mastra.json --market nvidia-3060 --timeout 30
Go to the Nosana Dashboard to see your job
B. Deploying using the Nosana Dashboard

Make sure you have https://phantom.com/, installed for your browser.
Go to our Discord and ask for some NOS and SOL to publish your job.
Click the Expand button, on the Nosana Dashboard
Copy and Paste your edited Nosana Job Definition file into the Textarea
Choose an appropriate GPU for the AI model that you are using
Click Deploy
4. Video Demo
Record a 1-3 minute video demonstrating:
Your agent running on Nosana
Key features and functionality
Real-world use case demonstration
Upload to YouTube, Loom, or similar platform
5. Documentation
Update this README with:
Agent description and purpose
Setup instructions
Environment variables required
Docker build and run commands
Example usage
Submission Process
Complete all requirements listed above
Commit all of your changes to the main branch of your forked repository
All your code changes
Updated README
Link to your Docker container
Link to your video demo
Nosana deployment proof
Social Media Post: Share your submission on X (Twitter)
Tag @nosana_ai
Include a brief description of your agent
Add hashtag #NosanaAgentChallenge
Finalize your submission on the https://earn.superteam.fun/agent-challenge page
Remember to add your forked GitHub repository link
Remember to add a link to your X post.
Judging Criteria
Submissions will be evaluated based on:

Innovation (25%)

Originality of the agent concept
Creative use of AI capabilities
Technical Implementation (25%)

Code quality and organization
Proper use of the Mastra framework
Efficient tool implementation
Nosana Integration (25%)

Successful deployment on Nosana
Resource efficiency
Stability and performance
Real-World Impact (25%)

Practical use cases
Potential for adoption
Value proposition
Prizes
We’re awarding the top 10 submissions:

🥇 1st: $1,000 USDC
🥈 2nd: $750 USDC
🥉 3rd: $450 USDC
🏅 4th: $200 USDC
🔟 5th–10th: $100 USDC
All prizes are paid out directly to participants on SuperTeam

Resources
Nosana Documentation
Mastra Documentation
Mastra Guide: Build an AI stock agent
Nosana CLI
Docker Documentation
Support
Join Nosana Discord for technical support where we have dedicated Builders Challenge Dev chat channel.
Follow @nosana_ai for updates.
Important Notes
Ensure your agent doesn't expose sensitive data
Test thoroughly before submission
Keep your Docker images lightweight
Document all dependencies clearly
Make your code reproducible
You can vibe code it if you want 😉
Only one submission per participant
Submissions that do not compile, and do not meet the specified requirements, will not be considered
Deadline is: 9 July 2025, 12.01 PM
Announcement will be announced about one week later, stay tuned for our socials for exact date
Finalize your submission at SuperTeam
Don’t Miss Nosana Builder Challenge Updates
Good luck, builders! We can't wait to see the innovative AI agents you create for the Nosana ecosystem. Happy Building!

---

# 🩺 Health & Wellness Agent

A comprehensive AI-powered health and wellness assistant built with Mastra framework for the Nosana Builders Challenge.

## 🎯 Agent Description and Purpose

The Health & Wellness Agent is an advanced AI assistant designed to support users in maintaining and improving their overall health and well-being. It provides personalized recommendations, tracks health metrics, and offers evidence-based guidance across multiple health domains.

### Key Features:
- **Symptom Analysis**: Preliminary health insights and recommendations
- **Nutrition Tracking**: Dietary analysis and meal planning
- **Medication Management**: Reminders and interaction checking
- **Exercise Planning**: Personalized workout routines
- **Mental Health Support**: Mood tracking and wellness activities
- **Lifestyle Monitoring**: Daily habits and goal setting
- **Health Reporting**: Comprehensive progress summaries

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20.9.0 or higher
- pnpm (recommended) or npm
- Docker (for containerization)
- Ollama (for local LLM)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <your-fork-url>
cd agent-challenge
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your preferred configuration
```

4. **Start Ollama (for local development)**
```bash
ollama serve
ollama pull qwen2.5:1.5b
```

5. **Start the development server**
```bash
pnpm run dev
```

6. **Access the agent**
Open http://localhost:8080 in your browser and navigate to the Health Agent chat interface.

## 🔧 Environment Variables Required

Create a `.env` file with the following variables:

```env
# Gemini API Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key_here
MODEL_NAME_AT_ENDPOINT=gemini-2.0-flash-exp

# LLM Configuration
# API_BASE_URL=http://127.0.0.1:11434/api
# MODEL_NAME_AT_ENDPOINT=qwen2.5:1.5b

# For Docker deployment
# API_BASE_URL=http://0.0.0.0:11434/api

# For Nosana endpoint (alternative)
# API_BASE_URL=https://your-nosana-endpoint/api
# MODEL_NAME_AT_ENDPOINT=qwen2.5:32b
```

## 🐳 Docker Build and Run Commands

### Build the Docker image
```bash
docker build -t yourusername/health-wellness-agent:latest .
```

### Run locally
```bash
docker run -p 8080:8080 yourusername/health-wellness-agent:latest
```

### Push to Docker Hub
```bash
docker login
docker push yourusername/health-wellness-agent:latest
```

### Using npm scripts
```bash
# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run

# Push to registry
npm run docker:push
```

## 📋 Example Usage

### Quick Start Examples:

1. **Symptom Analysis**
   ```
   "I have a headache and feel tired for 3 days"
   ```

2. **Nutrition Tracking**
   ```
   "Analyze my lunch: chicken breast, rice, and broccoli"
   ```

3. **Exercise Planning**
   ```
   "Create a beginner workout plan for 30 minutes"
   ```

4. **Mental Health Support**
   ```
   "I'm feeling stressed, my mood is 5/10"
   ```

5. **Lifestyle Tracking**
   ```
   "Log my day: 7 hours sleep, 2L water, 8000 steps"
   ```

### Advanced Usage:

- **Comprehensive Health Check**: "Generate my weekly health report including all metrics"
- **Medication Management**: "Add medication: Metformin 500mg twice daily with meals"
- **Goal Setting**: "Set goals: 2.5L water daily, 8 hours sleep, 10000 steps"

## 🏗️ Architecture

The agent is built using:
- **Mastra Framework**: Core agent and tool management
- **TypeScript**: Type-safe development
- **Ollama**: Local LLM inference
- **Zod**: Schema validation
- **Docker**: Containerization

### Tool Structure:
```
src/mastra/agents/health-agent/
├── health-agent.ts          # Main agent configuration
├── health-workflow.ts       # Comprehensive health analysis workflow
└── tools/
    ├── symptom-analysis-tool.ts
    ├── nutrition-analysis-tool.ts
    ├── medication-reminder-tool.ts
    ├── exercise-plan-tool.ts
    ├── mental-health-tool.ts
    ├── lifestyle-tracking-tool.ts
    └── health-report-tool.ts
```

### Workflow Feature:
The Health & Wellness Agent includes an advanced **Comprehensive Health Analysis Workflow** that:
- Collects and validates health data from multiple sources
- Calculates personalized health scores across different domains
- Generates AI-powered health improvement plans
- Provides structured recommendations with timelines
- Creates actionable goals for immediate, short-term, and long-term health improvements

## 🎥 Demo Video

[Link to demo video will be added here]

## 🚀 Nosana Deployment

[Nosana deployment details will be added here]

## ⚠️ Important Notes

- This agent provides general wellness guidance, not medical diagnosis
- Always consult healthcare professionals for serious symptoms or medical decisions
- The agent is designed for educational and wellness support purposes
- All health data should be handled with appropriate privacy considerations

## 🏆 Nosana Builders Challenge

This project was created for the **Nosana Builders Challenge 2nd Edition: Agent-101**. 

### 🎯 Challenge Requirements Met:

✅ **Innovation (25%)**
- Unique health & wellness focus with 7 specialized tools
- Advanced workflow for comprehensive health analysis
- Real-world practical applications for daily health management

✅ **Technical Implementation (25%)**
- Professional code organization with modular tool structure
- Proper Mastra framework utilization
- Type-safe TypeScript implementation with Zod validation
- Comprehensive error handling and user-friendly responses

✅ **Nosana Integration (25%)**
- Docker containerization ready for Nosana deployment
- Optimized for resource efficiency with qwen2.5:1.5b model
- Proper environment configuration for cloud deployment

✅ **Real-World Impact (25%)**
- Addresses genuine health and wellness needs
- Scalable for personal and professional healthcare support
- Evidence-based recommendations and health tracking
- High adoption potential in wellness and healthcare sectors

### 🚀 Competitive Advantages:

1. **Comprehensive Coverage**: Unlike simple calculators or basic tools, this agent covers the entire health spectrum
2. **Advanced Workflow**: Includes sophisticated health analysis workflow for deeper insights
3. **Professional Quality**: Production-ready code with extensive documentation
4. **Real-World Utility**: Immediately useful for daily health management
5. **Scalability**: Can be extended for healthcare professionals, fitness coaches, or wellness platforms

---

## 🩺 Health & Wellness Agent

A comprehensive AI-powered health and wellness assistant built with Mastra framework for the Nosana Builders Challenge.

## Tool Usage Guide

This agent includes 7 powerful tools for comprehensive health management. Below are detailed usage examples for each tool:

### 1. 🔍 Symptom Analysis Tool

**Purpose**: Analyze symptoms and provide preliminary health insights

**Example Input**:
```
Please analyze my symptoms: I have a headache and feel very tired for the past 3 days. The pain is moderate and I'm 28 years old with no existing conditions.
```

**Tool Parameters**:
- `symptoms`: ["headache", "fatigue"]
- `duration`: "3 days"
- `severity`: "moderate" (mild/moderate/severe)
- `age`: 28
- `existingConditions`: []

---

### 2. 🍎 Nutrition Analysis Tool

**Purpose**: Analyze nutritional intake and provide dietary recommendations

**Example Input**:
```
Analyze my daily nutrition: I ate chicken breast, rice, broccoli, and an apple today. The rice portion was large, others were normal sized. My goal is weight loss.
```

**Tool Parameters**:
- `foods`: ["chicken breast", "rice", "broccoli", "apple"]
- `portions`: ["normal", "large", "normal", "normal"]
- `mealType`: "daily" (breakfast/lunch/dinner/snack/daily)
- `userGoals`: ["weight loss"]
- `restrictions`: []

---

### 3. 💊 Medication Reminder Tool

**Purpose**: Manage medication schedules and provide medication information

**Example Input for Adding Medication**:
```
Add a new medication: ibuprofen 400mg, twice daily at 9 AM and 9 PM, take with food for 5 days.
```

**Tool Parameters**:
- `action`: "add"
- `medicationName`: "ibuprofen"
- `dosage`: "400mg"
- `frequency`: "twice daily"
- `times`: ["09:00", "21:00"]
- `withFood`: true
- `duration`: "5 days"

**Example Input for Checking Interactions**:
```
Check interactions between my current medications: ibuprofen and aspirin.
```

**Tool Parameters**:
- `action`: "check interactions"
- `currentMedications`: ["ibuprofen", "aspirin"]

---

### 4. 🏃 Exercise Plan Tool

**Purpose**: Create personalized exercise plans and track workout progress

**Example Input**:
```
Create an exercise plan for me. I'm a beginner with 30 minutes available, goals are weight loss and general fitness. I prefer low impact exercises and have no equipment.
```

**Tool Parameters**:
- `action`: "create plan"
- `fitnessLevel`: "beginner" (beginner/intermediate/advanced)
- `goals`: ["weight loss", "general fitness"]
- `availableTime`: 30
- `equipment`: []
- `preferences`: ["low impact"]

**Example Input for Logging Workout**:
```
Log my workout: I completed today's exercise routine and it took 25 minutes.
```

**Tool Parameters**:
- `action`: "log workout"
- `workoutCompleted`: true
- `duration`: 25

---

### 5. 😌 Mental Health Tool

**Purpose**: Provide mental health support, mood tracking, and wellness activities

**Example Input for Mood Tracking**:
```
Track my mood: I'm feeling a 6 out of 10 today, emotions are stressed and tired with stress level 7. Work has been overwhelming lately, triggers are work pressure and lack of sleep.
```

**Tool Parameters**:
- `action`: "track mood"
- `mood`: 6 (1-10 scale)
- `emotions`: ["stressed", "tired"]
- `stressLevel`: 7 (1-10 scale)
- `notes`: "Work has been overwhelming lately"
- `triggers`: ["work pressure", "lack of sleep"]

**Example Input for Getting Activity**:
```
I need a breathing exercise for 5 minutes. I'm a beginner.
```

**Tool Parameters**:
- `action`: "get activity"
- `activityType`: "breathing"
- `availableTime`: 5
- `experienceLevel`: "beginner"

---

### 6. 💧 Lifestyle Tracking Tool

**Purpose**: Track daily lifestyle habits and provide personalized recommendations

**Example Input**:
```
Log my daily lifestyle: I drank 1.8 liters of water, slept 6.5 hours with quality 5/10, took 7500 steps, had 8 hours screen time, no smoking, no alcohol, 200mg caffeine. It was a busy day at work.
```

**Tool Parameters**:
- `action`: "log daily"
- `waterIntake`: 1.8
- `sleepHours`: 6.5
- `sleepQuality`: 5 (1-10 scale)
- `steps`: 7500
- `screenTime`: 8
- `smokingStatus`: "none" (none/reduced/normal/increased)
- `alcoholUnits`: 0
- `caffeineIntake`: 200
- `notes`: "Busy day at work"

**Example Input for Setting Goals**:
```
Set a goal for water intake: I want to drink 2.5 liters per day.
```

**Tool Parameters**:
- `action`: "set goals"
- `goalType`: "water"
- `goalTarget`: 2.5

---

### 7. 📊 Health Report Tool

**Purpose**: Generate comprehensive health reports and track progress over time

**Example Input**:
```
Generate a weekly health report including sleep, nutrition, and exercise metrics. My averages: 7.2 hours sleep, 2.1L water, 8500 steps, mood 6.5, stress 5.5, 3 exercise sessions, nutrition score 72, medication adherence 85%.
```

**Tool Parameters**:
- `reportType`: "weekly" (daily/weekly/monthly)
- `includeMetrics`: ["sleep", "nutrition", "exercise"]
- `timeframe`: 7
- `avgSleep`: 7.2
- `avgWater`: 2.1
- `avgSteps`: 8500
- `avgMood`: 6.5
- `avgStress`: 5.5
- `exerciseFrequency`: 3
- `nutritionScore`: 72
- `medicationAdherence`: 85

---

## 🎯 Quick Start Examples

### Simple Conversations:

1. **"I have a headache and feel tired"** → Symptom Analysis
2. **"What did I eat today? Chicken, rice, and vegetables"** → Nutrition Analysis  
3. **"Remind me to take my blood pressure medication"** → Medication Management
4. **"Create a workout plan for beginners"** → Exercise Planning
5. **"I'm feeling stressed, help me relax"** → Mental Health Support
6. **"Track my sleep: 7 hours, quality 8/10"** → Lifestyle Tracking
7. **"Generate my weekly health summary"** → Health Reporting

### Advanced Usage:

- **Comprehensive Daily Log**: "Log everything: 8 hours sleep (quality 7), 2L water, 9000 steps, chicken salad lunch, 30min workout, mood 7, stress 4"

- **Complete Health Analysis Workflow**: "Analyze my overall health: age 28, goals weight loss and stress management, sleep 6.5h, water 1.8L, steps 7500, exercise 2x/week, mood 6, stress 7, nutrition score 65, symptoms headache and fatigue"

### Workflow Usage:
The Health & Wellness Agent includes a powerful **Comprehensive Health Analysis Workflow** that can be triggered with:

```
"Run comprehensive health analysis with my data: age 30, goals weight loss and better sleep, current metrics: 6.5h sleep, 1.8L water, 7500 steps, 2 workouts/week, mood 6/10, stress 7/10, nutrition score 65, symptoms: headache and fatigue"
```

This workflow will:
1. **Collect & Validate** all your health data
2. **Calculate Health Scores** across physical, mental, lifestyle, and nutrition domains  
3. **Generate Personalized Plan** with immediate actions, short-term goals, and long-term objectives

- **Health Goal Setting**: "Set goals: 2.5L water daily, 8 hours sleep, 10000 steps, 4 workouts per week"

- **Medication Management**: "Add medication: Metformin 500mg twice daily with meals, check interactions with my current ibuprofen"

---

## 💡 Tips for Best Results

1. **Be Specific**: Include numbers, timeframes, and details
2. **Regular Tracking**: Daily inputs provide better insights
3. **Natural Language**: You can speak naturally - the AI understands context
4. **Multiple Tools**: Combine different aspects for comprehensive health management
5. **Follow Recommendations**: The AI provides actionable advice based on your data

**Remember**: This agent provides general wellness guidance, not medical diagnosis. Always consult healthcare professionals for serious symptoms or medical decisions.
>>>>>>> 1edbf2e (Finalize Health & Wellness AI Agent: updated README, configs, and deployment docs)
