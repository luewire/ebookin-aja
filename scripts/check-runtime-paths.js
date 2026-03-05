const fs = require('fs');
const path = require('path');

const BASE_DIR = process.env.RUNTIME_BASE_DIR
  ? path.resolve(process.env.RUNTIME_BASE_DIR)
  : process.cwd();

const REQUIRED_DIRS = ['storage', 'logs', 'uploads', 'tmp'];

function ensureDirAndWritable(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true, mode: 0o775 });

  fs.accessSync(dirPath, fs.constants.W_OK);

  const probeFile = path.join(
    dirPath,
    `.write-test-${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`
  );

  fs.writeFileSync(probeFile, 'ok');
  fs.unlinkSync(probeFile);
}

function main() {
  const errors = [];

  for (const relativeDir of REQUIRED_DIRS) {
    const absoluteDir = path.join(BASE_DIR, relativeDir);

    try {
      ensureDirAndWritable(absoluteDir);
      console.log(`[runtime-check] ok: ${absoluteDir}`);
    } catch (error) {
      errors.push({
        dir: absoluteDir,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (errors.length > 0) {
    console.error('[runtime-check] failed: directory permission/path check failed');
    for (const issue of errors) {
      console.error(`- ${issue.dir}: ${issue.message}`);
    }
    console.error('[runtime-check] fix folder ownership/permissions before starting server');
    process.exit(1);
  }

  console.log('[runtime-check] all required directories are writable');
}

main();
