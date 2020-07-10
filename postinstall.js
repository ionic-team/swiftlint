if (process.platform !== 'darwin') {
  console.log('!!! WARN: Not installing SwiftLint for non-macOS platform: ' + process.platform + '\n');
  process.exit();
}

const { Subprocess } = require('@ionic/utils-subprocess');
const path = require('path');
const fs = require('fs');
const util = require('util');

const exists = async p => util.promisify(fs.access)(p).then(() => true).catch(() => false);
const mkdir = async p => util.promisify(fs.mkdir)(p).catch(e => {
  if (e.code !== 'EEXIST') {
    throw e;
  }
});

const version = '0.39.2';
const builddir = path.resolve(__dirname, 'build');
const swiftlintdir = path.resolve(builddir, 'SwiftLint');

const run = async () => {
  await mkdir(builddir);
  await clone();
  await build();
};

const clone = async () => {
  let procs = [];

  if (await exists(swiftlintdir)) {
    procs.push(new Subprocess('git', ['fetch', 'origin'], { cwd: swiftlintdir }));
  } else {
    procs.push(new Subprocess('git', [
      'clone',
      '--recurse-submodules',
      'https://github.com/realm/SwiftLint.git',
      swiftlintdir,
    ], {
      stdio: 'inherit',
    }));
  }

  procs.push(new Subprocess('git', ['checkout', version], { cwd: swiftlintdir }));

  for (const proc of procs) {
    await proc.run();
  }
};

const build = async () => {
  const proc = new Subprocess('make', [], {
    cwd: swiftlintdir,
    stdio: 'inherit',
  });

  await proc.run();
};

run().catch(err => { console.error(err); process.exit(1); });
