const fs = require('fs');
const path = require('path');

const src = path.join(process.cwd(), 'app', '(main)', 'u');
const dest = path.join(process.cwd(), 'app', '(main)', 'user');

if (fs.existsSync(src)) {
    if (fs.existsSync(dest)) {
        console.log('Destination already exists, merging...');
        // Simple merge/move logic or just delete src if already copied
    } else {
        fs.renameSync(src, dest);
        console.log('Moved successfully');
    }
} else {
    console.log('Source directory not found');
}
