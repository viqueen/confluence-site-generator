#! /usr/bin/env node

import { Command } from 'commander';
import extractSpace from '../generator/extract-space';
import path from 'path';
import setupOutputDirectories from '../generator/setup-output-directories';

const program = new Command();

program
    .command('extract <spaceKey>')
    .description('extract data from confluence space')
    .action(async (spaceKey) => {
        const distribution = path.resolve(__dirname, '../../dist');
        const outputDirectories = setupOutputDirectories(distribution);
        await extractSpace(spaceKey, outputDirectories);
    });

program.version('1.0.0');
program.parse(process.argv);
