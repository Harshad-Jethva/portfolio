import fs from 'fs';

const path = 'd:/profile/package-lock.json';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/HARSHAD-is/g, 'deep-is');
content = content.replace(/fast-HARSHAD-equal/g, 'fast-deep-equal');
fs.writeFileSync(path, content);
console.log('Fixed package-lock.json fully');
