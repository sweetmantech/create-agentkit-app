#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get project name from command line args
const projectName = process.argv[2];

if (!projectName) {
  console.error("Please specify a project name:");
  console.error("  npx create-agentkit-app my-agent");
  process.exit(1);
}

// Create project directory
const projectPath = path.join(process.cwd(), projectName);
fs.mkdirSync(projectPath, { recursive: true });

// Copy Eliza starter files
const elizaStarterPath = path.join(__dirname, "..", "eliza-agentkit-starter");
copyDir(elizaStarterPath, projectPath);

// Make scripts executable
const scriptsPath = path.join(projectPath, "scripts");
if (fs.existsSync(scriptsPath)) {
  execSync(`chmod +x ${scriptsPath}/*.sh`, { cwd: projectPath });
}

// Initialize git repository
execSync("git init", { cwd: projectPath });

// Install dependencies
console.log("Installing dependencies...");
execSync("pnpm install", { cwd: projectPath, stdio: "inherit" });

console.log(`
✨ Success! Created AI Agent with Eliza + AgentKit at ${projectPath}

First, set up your environment variables:

  cp .env.example .env
  # Edit .env with your API keys and configuration

Then you can run these commands:

  pnpm start
    Starts the agent in interactive mode

  pnpm run build
    Builds the agent for production

  pnpm run clean
    Cleans the build artifacts

We suggest that you begin by:

  cd ${projectName}
  cp .env.example .env
  # Edit .env with your API keys
  pnpm start

Happy agent building! 🤖
`);

function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
