#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get project name from command line args
const projectName = process.argv[2];

if (!projectName) {
  console.error("Please specify a project name:");
  console.error("  npx create-agentkit-app my-musician-agent");
  process.exit(1);
}

// Create project directory
const projectPath = path.join(process.cwd(), projectName);
fs.mkdirSync(projectPath, { recursive: true });

// Copy template files
const templatePath = path.join(__dirname, "..", "template");
copyDir(templatePath, projectPath);

// Initialize git repository
execSync("git init", { cwd: projectPath });

// Install dependencies
console.log("Installing dependencies...");
execSync("npm install", { cwd: projectPath, stdio: "inherit" });

console.log(`
🎵 Success! Created AI Musician Agent at ${projectPath}

Inside that directory, you can run several commands:

  npm start
    Starts the agent in interactive mode

  npm run dev
    Starts the agent with hot reload

  npm run lint
    Checks code style

We suggest that you begin by typing:

  cd ${projectName}
  npm start

Happy music making! 🎼
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
