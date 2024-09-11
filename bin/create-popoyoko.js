#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'node:path';
import fs from 'node:fs';
import prompts from 'prompts';
import { blue, green, red, reset } from 'kolorist';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2), {
  default: { help: false },
  alias: { h: 'help' }
});

const helpMessage = `
Usage: ${blue('create-popoyoko')} [DIRECTORY]

Options:
  -h, --help       Afficher ce message d'aide
`;


if (argv.help) {
  console.log(helpMessage);
  process.exit(0);
}

async function createProject() {
  const { projectName } = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Please specify the project directory:',
    initial: 'create-popoyoko'
  });

  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`Directory ${projectName} already exists.`);
    process.exit(1);
  }

  console.log(`Creating Vite app...`);
  execSync(`bun create vite ${projectName} --template react-ts`, { stdio: 'inherit' });

  process.chdir(projectPath);

  console.log(`Installing ${blue('popoyoko-ui')}...`);
  execSync('bun i https://github.com/Popoyoko/popoyoko-ui.git#package', { stdio: 'inherit' });

  console.log(`Installing ${blue('create-popoyoko-variables')}...`);
  execSync('bun i create-popoyoko-variables', { stdio: 'inherit' });

  console.log(`Installing ${blue('popoyoko-default-tokens')} from popoyoko-branding...`);
  execSync('git clone --branch popoyoko-default-tokens https://github.com/Popoyoko/popoyoko-branding.git', { stdio: 'inherit' });

  console.log(`Compiling tokens using ${blue('create-popoyoko-tokens')}...`);
  execSync('bun i && create-popoyoko-variables ./popoyoko-branding', { stdio: 'inherit' });

  console.log(`Deleted folder ${blue('popoyoko-branding')}...`);
  fs.rmSync('./popoyoko-branding', { recursive: true, force: true });

  console.log(`Initialization of ${blue('popoyoko')} token...`);

  const { installStorybook } = await prompts({
    type: 'select',
    name: 'installStorybook',
    message: 'Do you want to install Storybook?',
    choices: [
      { title: green('Yes'), value: 'yes' },
      { title: red('No'), value: 'no' }
    ],
    initial: 1 
  });

  if (installStorybook === 'yes') {
    console.log(`Installing Storybook...`);
    execSync('bunxx sb init --skip-install', { stdio: 'inherit' });
    execSync('bun i', { stdio: 'inherit' }); 
    console.log('Storybook installed successfully.');
    console.log('To start Storybook: bunx storybook');
  }

  console.log(`Project ${projectName} created successfully!`);
  console.log(`To get started:`);
  console.log(`  cd ${projectName}`);
  console.log(`  bun install`);
  console.log(`  bun dev`);
}

createProject().catch(error => {
  console.error('Error creating project:', error);
});
