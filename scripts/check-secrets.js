// Secret Scanner Script
// Checks for hardcoded secrets in codebase
// Run: node scripts/check-secrets.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Scanning for exposed secrets...\n');

let foundSecrets = false;
const results = [];

// Directories to exclude
const excludeDirs = ['.git', 'node_modules', '.next', 'out', 'build', 'coverage', '.husky'];

// File extensions to scan
const scanExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.env'];

// Patterns to detect
const patterns = [
  {
    name: 'JWT Tokens',
    regex: /eyJ[A-Za-z0-9_-]{40,}/g,
    severity: 'HIGH',
    exclude: ['.env.example', 'secret-scanner.yml', 'check-secrets.js']
  },
  {
    name: 'Service Role (hardcoded)',
    regex: /['"]eyJ.*service_role.*['"]/g,
    severity: 'CRITICAL',
    exclude: []
  },
  {
    name: 'NEXT_PUBLIC_ on SERVICE_ROLE',
    regex: /NEXT_PUBLIC_[A-Z_]*SERVICE_ROLE[A-Z_]*\s*=/gi,
    severity: 'CRITICAL',
    exclude: ['check-secrets.js']
  },
  {
    name: 'Database URLs with passwords',
    regex: /postgresql:\/\/[^:]+:[^@]+@/g,
    severity: 'HIGH',
    exclude: ['.env.example']
  }
];

function shouldExclude(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Exclude directories
  for (const dir of excludeDirs) {
    if (relativePath.includes(dir + path.sep) || relativePath.startsWith(dir)) {
      return true;
    }
  }
  
  return false;
}

function scanFile(filePath) {
  if (shouldExclude(filePath)) return;
  
  const ext = path.extname(filePath);
  if (!scanExtensions.includes(ext)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.relative(process.cwd(), filePath);
  
  for (const pattern of patterns) {
    // Skip if file is in exclude list for this pattern
    if (pattern.exclude.some(exc => fileName.includes(exc))) continue;
    
    const matches = content.match(pattern.regex);
    if (matches) {
      // Additional validation: allow process.env for environment variables
      if (pattern.name === 'Service Role (hardcoded)') {
        const lines = content.split('\n');
        let hasRealViolation = false;
        
        lines.forEach((line, idx) => {
          if (pattern.regex.test(line) && !line.includes('process.env')) {
            hasRealViolation = true;
            results.push({
              file: fileName,
              line: idx + 1,
              pattern: pattern.name,
              severity: pattern.severity,
              preview: line.trim().substring(0, 80)
            });
          }
        });
        
        if (hasRealViolation) foundSecrets = true;
      } else {
        foundSecrets = true;
        results.push({
          file: fileName,
          pattern: pattern.name,
          severity: pattern.severity,
          count: matches.length
        });
      }
    }
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!shouldExclude(fullPath)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      scanFile(fullPath);
    }
  }
}

// Run scan
try {
  scanDirectory(process.cwd());
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (foundSecrets) {
    console.log('❌ SECRETS DETECTED!\n');
    
    // Group by severity
    const critical = results.filter(r => r.severity === 'CRITICAL');
    const high = results.filter(r => r.severity === 'HIGH');
    
    if (critical.length > 0) {
      console.log('🚨 CRITICAL Issues:');
      critical.forEach(r => {
        console.log(`   File: ${r.file}`);
        console.log(`   Issue: ${r.pattern}`);
        if (r.line) console.log(`   Line: ${r.line}`);
        if (r.preview) console.log(`   Preview: ${r.preview}`);
        console.log('');
      });
    }
    
    if (high.length > 0) {
      console.log('⚠️  HIGH Issues:');
      high.forEach(r => {
        console.log(`   File: ${r.file}`);
        console.log(`   Issue: ${r.pattern}`);
        if (r.count) console.log(`   Count: ${r.count}`);
        console.log('');
      });
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔧 REMEDIATION:');
    console.log('1. Remove all hardcoded secrets');
    console.log('2. Use process.env.* for environment variables');
    console.log('3. Ensure .env.local is in .gitignore');
    console.log('4. Rotate any exposed credentials\n');
    
    process.exit(1);
  } else {
    console.log('✅ No secrets detected in codebase');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ Error during scan:', error.message);
  process.exit(1);
}
