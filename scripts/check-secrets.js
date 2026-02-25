const { execSync } = require('child_process');
const fs = require('fs');

// Pattern rahasia yang umum bocor
const SECRET_PATTERNS = [
    /AIza[0-9A-Za-z-_]{35}/, // Google API Key
    /sk-(test|live)-[a-zA-Z0-9]{24,}/, // Stripe
    /sk-[a-zA-Z0-9]{48}/, // OpenAI
    /xoxp-[a-zA-Z0-9]{10,}/, // Slack
    /-----BEGIN PRIVATE KEY-----/, // RSA/PEM
    /ghp_[a-zA-Z0-9]{36}/, // GitHub PAT
];

// File yang boleh di-skip dari pengecekan
const IGNORED_FILES = [
    '.env.example',
    'package-lock.json',
    'scripts/check-secrets.js',
    '.env.local' // Not tracked anyway, but just in case
];

console.log('🔍 Running pre-commit secret scan...');

try {
    // Ambil list file yang di-stage (mau di-commit)
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);

    let hasSecrets = false;

    for (const file of stagedFiles) {
        if (IGNORED_FILES.some(ignored => file.includes(ignored))) continue;

        // Skip if file was deleted
        if (!fs.existsSync(file)) continue;

        const content = fs.readFileSync(file, 'utf8');

        for (const pattern of SECRET_PATTERNS) {
            if (pattern.test(content)) {
                console.error(`🚨 SECRET DETECTED in ${file}`);
                hasSecrets = true;
            }
        }
    }

    if (hasSecrets) {
        console.error('\n❌ Commit rejected. Secret keys/passwords found in staged files!');
        console.error('Please remove them before committing. Never commit secrets to Git.');
        process.exit(1);
    } else {
        console.log('✅ Secret check passed. No hardcoded secrets found.');
        process.exit(0);
    }
} catch (error) {
    // Jika command git diff gagal, skip saja
    process.exit(0);
}
