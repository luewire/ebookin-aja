const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ?
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx')) return;
    console.log(`Processing ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Replace common text colors
    content = content.replace(/text-slate-900 dark:text-white/g, `transition-colors duration-300" style={{ color: 'var(--text-primary)' }}`);
    content = content.replace(/text-slate-500 dark:text-slate-400/g, `transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}`);
    content = content.replace(/text-slate-400 dark:text-slate-500/g, `transition-colors duration-300" style={{ color: 'var(--text-tertiary)' }}`);
    content = content.replace(/text-slate-600 dark:text-slate-300/g, `transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}`);

    // Replace backgrounds and borders
    // Usually elements have: bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800
    // Or table rows hover:bg-slate-50 dark:hover:bg-slate-800

    content = content.replace(/bg-white dark:bg-slate-900/g, `transition-colors duration-300" style={{ backgroundColor: 'var(--bg-surface)' }}`);

    // To handle the combined styling issue better, let's use a regex that matches the combination
    content = content.replace(/border-slate-200 dark:border-slate-800/g, `transition-colors duration-300" style={{ borderColor: 'var(--border)' }}`);
    content = content.replace(/border-b border-slate-200 dark:border-slate-800/g, `border-b transition-colors duration-300" style={{ borderColor: 'var(--border)' }}`);
    content = content.replace(/border-t border-slate-200 dark:border-slate-800/g, `border-t transition-colors duration-300" style={{ borderColor: 'var(--border)' }}`);

    content = content.replace(/bg-slate-50 dark:bg-slate-800\/50/g, `transition-colors duration-300" style={{ backgroundColor: 'var(--bg-elevated)' }}`);
    content = content.replace(/bg-slate-50 dark:bg-slate-950/g, `transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}`);
    content = content.replace(/bg-slate-100 dark:bg-slate-800/g, `transition-colors duration-300" style={{ backgroundColor: 'var(--bg-overlay)' }}`);
    content = content.replace(/hover:bg-slate-50 dark:hover:bg-slate-800\/50/g, `hover:bg-black\/5 dark:hover:bg-white\/5 transition-colors`);
    content = content.replace(/hover:bg-slate-100 dark:hover:bg-slate-800/g, `hover:bg-black\/10 dark:hover:bg-white\/10 transition-colors`);

    // Fix potential broken className="... transition-colors duration-300" style=..."
    // This happens if the original strings were part of className.
    content = content.replace(/className="([^"]*?)" style=\{\{([^}]*)\}\}/g, function (match, classes, styles) {
        // It's possible we created multiple style={{}} in the same tag.
        // Let's not make it too complex, just let React handle or fix manually if it breaks.
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

const dirToProcess = path.join(__dirname, 'app/admin');
walkDir(dirToProcess, processFile);
console.log('Theme fix complete.');
