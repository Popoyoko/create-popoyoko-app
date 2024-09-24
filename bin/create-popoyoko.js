#!/usr/bin/env node
import { buildTokens } from "build-tokens";
import { execSync } from "child_process";
import path from "node:path";
import fs from "node:fs";
import prompts from "prompts";
import { blue, green, red, reset } from "kolorist";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2), {
	default: { help: false },
	alias: { h: "help" },
});

const helpMessage = `
Usage: ${blue("create-popoyoko")} [DIRECTORY]

Options:
  -h, --help       Afficher ce message d'aide
`;

if (argv.help) {
	console.log(helpMessage);
	process.exit(0);
}

async function createProject() {
	const { projectName } = await prompts({
		type: "text",
		name: "projectName",
		message: "Please specify the project directory:",
		initial: "my-amazing-app",
	});

	const appContent = `
  import { useState } from 'react'
  import './App.css'
  
  import { Button } from 'popoyoko-ui'
  
  function App() {
  
    return (
      <>
        <h1>${projectName}</h1>
        <Button><a href="https://github.com/Popoyoko/popoyoko-ui">Get Started !</a></Button>
      </>
    )
  }
  
  export default App
  `;

	const projectPath = path.resolve(process.cwd(), projectName);

	if (fs.existsSync(projectPath)) {
		console.log(`Directory ${projectName} already exists.`);
		const { deleteOldFolder } = await prompts({
			type: "confirm",
			name: "deleteOldFolder",
			message: "Delete folder ?",
		});

		if (deleteOldFolder) {
			execSync(`rm -rf ${projectName}`, { stdio: "inherit" });
		} else {
			process.exit(1);
		}
	}

	console.log(`Creating Vite app...`);
	execSync(`bun create vite ${projectName} --template react-ts`, {
		stdio: "inherit",
	});

	process.chdir(projectPath);

	console.log(`Installing ${blue("popoyoko-ui")}...`);
	execSync("bun add https://github.com/Popoyoko/popoyoko-ui.git#package", {
		stdio: "inherit",
	});

	console.log(`Installing ${blue("build-token")}...`);
	execSync("bun add git@github.com:Popoyoko/build-tokens.git", {
		stdio: "inherit",
	});

	console.log(`Installing ${blue("default-tokens")} from popoyoko-branding...`);
	execSync(
		"git clone https://github.com/Popoyoko/popoyoko-branding.git && mv popoyoko-branding branding",
		{ stdio: "inherit" },
	);

	console.log(`Compiling tokens using ${blue("create-popoyoko-tokens")}...`);
	buildTokens("branding/tokens");

	console.log(`Compiling tokens using ${blue("create-popoyoko-tokens")}...`);
	const appTsxPath = path.join(projectPath, "src", "App.tsx");

	fs.writeFileSync(appTsxPath, appContent);

	console.log(`Migrating from eslint & Prettier to Biome...`);
	execSync("bunx biome migrate eslint --write", { stdio: "inherit" });

	console.log(`Extend the Popoyoko's configuration...`);
	execSync(
		"bun add --dev --exact @biomejs/biome && bun add git@github.com:Popoyoko/config-biome.git",
		{ stdio: "inherit" },
	);

	const { installStorybook } = await prompts({
		type: "select",
		name: "installStorybook",
		message: "Do you want to install Storybook?",
		choices: [
			{ title: green("Yes"), value: "yes" },
			{ title: red("No"), value: "no" },
		],
		initial: 1,
	});

	if (installStorybook === "yes") {
		console.log(`Installing Storybook...`);
		execSync("bunx sb init --skip-install", { stdio: "inherit" });
		console.log("Storybook installed successfully.");
		console.log("To start Storybook: bunx storybook");
	}

	console.log(`Project ${projectName} created successfully!`);
	console.log(`To get started:`);
	console.log(`cd ${projectName}`);
	console.log(`bun run dev`);
}

createProject().catch((error) => {
	console.error("Error creating project, removing the project folder:", error);
	execSync(`rm -rf ${projectName}`, { stdio: "inherit" });
});
