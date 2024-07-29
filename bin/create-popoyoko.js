#!/usr/bin/env node

const readline = require('readline');
const path = require('path');
const fs = require('fs');
const copyTemplate = require('../lib/copy-template');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please specify the project directory:', (projectName) => {
    if (!projectName) {
        projectName = 'create-popoyoko';

    }

    const projectPath = path.resolve(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
        console.error(`Directory ${projectName} already exists.`);
        rl.close();
        process.exit(1);
    }

    const templatePath = path.join(__dirname, '../Popoyoko-UI-Boilerplate');
    if (!fs.existsSync(templatePath)) {
        console.error('Le directory du template n\'existe pas :', templatePath);
        rl.close();
        process.exit(1);
    }

    fs.mkdirSync(projectPath);
    copyTemplate(path.join(__dirname, '../Popoyoko-UI-Boilerplate'), projectPath);

    console.log(`Project ${projectName} created successfully!`);
    console.log(`To get started:`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm install`);
    console.log(`  npm run dev`);

    rl.close();
});
