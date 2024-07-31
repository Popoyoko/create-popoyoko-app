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
        execSync(`bun create vite ${projectName}`, { stdio: 'inherit' });

        process.chdir(projectPath);

        const installPopoyokoUI = await askQuestion('Do you want to install popoyoko-ui? (yes/no) ');
        if (installPopoyokoUI.toLowerCase() === 'yes') {
            console.log('Installing popoyoko-ui...');
            execSync('bun i https://github.com/Popoyoko/popoyoko-ui.git#package', { stdio: 'inherit' });
        }

        const installCreatePopoyokoTokens = await askQuestion('Do you want to install create-popoyoko-tokens? (yes/no) ');
        if (installCreatePopoyokoTokens.toLowerCase() === 'yes') {
            console.log('Installing create-popoyoko-tokens...');
            execSync('bun i create-popoyoko-tokens', { stdio: 'inherit' });
        }

        const hasTokenDirectory = await askQuestion('Do you have a token directory? (yes/no) ');
        if (hasTokenDirectory.toLowerCase() === 'no') {
            const createTokenDir = await askQuestion('Do you want to create one together or use default tokens? (together/default) ');
            if (createTokenDir.toLowerCase() === 'together') {
                console.log('Creating token directory together...');
               } else {
                console.log('Using default tokens...');
            }
        } else {
            console.log('Token directory exists.');
        }

        const installStorybook = await askQuestion('Do you want to install Storybook? (yes/no) ');
        if (installStorybook.toLowerCase() === 'yes') {
            console.log('Installing Storybook...');
            execSync('npx storybook init', { stdio: 'inherit' });
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
