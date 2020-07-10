#!/usr/bin/env node

'use strict';

process.title = 'swiftlint';

if (process.platform !== 'darwin') {
  console.log('!!! WARN: Not running SwiftLint for non-macOS platform: ' + process.platform + '\n');
  process.exit();
}

const { Subprocess } = require('@ionic/utils-subprocess');
const path = require('path');

const proc = new Subprocess(
  path.resolve(__dirname, 'build/SwiftLint/.build/release/swiftlint'),
  process.argv.slice(2),
  { stdio: 'inherit' },
);

proc.run().catch(() => { process.exit(1); });
