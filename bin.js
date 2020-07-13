#!/usr/bin/env node

'use strict';

process.title = 'swiftlint';

if (process.platform !== 'darwin') {
  console.log('!!! WARN: Not running SwiftLint for non-macOS platform: ' + process.platform + '\n');
  process.exit();
}

const { Subprocess } = require('@ionic/utils-subprocess');
const { writeJson } = require('@ionic/utils-fs');
const { cosmiconfig } = require('cosmiconfig');
const os = require('os');
const path = require('path');

const getConfigPath = async () => {
  try {
    const explorer = cosmiconfig('swiftlint');
    const result = await explorer.search();
    const tmppath = path.resolve(os.tmpdir(), 'swiftlint-config');
    await writeJson(tmppath, result.config, { spaces: 2 });
    console.log('swiftlint: using config from', result.filepath);

    return tmppath;
  } catch (e) {
    // ignore
  }
};

const run = async () => {
  const p = await getConfigPath();

  const proc = new Subprocess(
    path.resolve(__dirname, 'build/SwiftLint/.build/release/swiftlint'),
    [...process.argv.slice(2), ...p ? ['--config', p] : []],
    { stdio: 'inherit' },
  );

  await proc.run();
};

run().catch(() => { process.exit(1); });
