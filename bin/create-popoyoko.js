#!/usr/bin/env node

const readline = require('readline');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
    try {
        const projectName = await askQuestion('Please specify the project directory: ') || 'create-popoyoko';
        const projectPath = path.resolve(process.cwd(), projectName);

        if (fs.existsSync(projectPath)) {
            console.error(`Directory ${projectName} already exists.`);
            process.exit(1);
        }

        console.log('Creating Vite app...');
        execSync(`bun create vite ${projectName} --template react-ts `, { stdio: 'inherit' });

        process.chdir(projectPath);

        console.log('Installing popoyoko-ui...');
        execSync('bun i https://github.com/Popoyoko/popoyoko-ui.git#package', { stdio: 'inherit' });

        console.log('Installing create-popoyoko-tokens...');
        execSync('bun i create-popoyoko-tokens', { stdio: 'inherit' });

        console.log('Initialization of popoyoko token...');


        const installStorybook = await askQuestion('Do you want to install Storybook? (no/yes) ') || 'no';
        if (installStorybook === 'yes' || installStorybook === 'y') {
            console.log('Installing Storybook...');
            execSync('bunx storybook init --skip-install', { stdio: 'inherit' });
        }

        console.log(`Project ${projectName} created successfully!`);
        console.log(`To get started:`);
        console.log(`  cd ${projectName}`);
        console.log(`  bun install`);
        console.log(`  bun dev`);

    } catch (error) {
        console.error('Error creating project:', error);
    } finally {
        rl.close();
    }
})();
