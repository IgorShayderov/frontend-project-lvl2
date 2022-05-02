#!/usr/bin/env node
import { Command } from 'commander';

import { compareFiles } from '../src/main.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.1.0')
  .argument('filepath1')
  .argument('filepath2')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2, options) => {
    console.log(compareFiles(filepath1, filepath2, options));
  });

program.parse();
