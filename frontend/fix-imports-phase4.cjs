const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        filesList.push(fullPath);
      }
    }
  }
  return filesList;
}

const allFiles = getFiles(srcDir);

allFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Fix form and ui imports in admin panel
  content = content.replace(/from\s+['"](.*?)['"]/g, (match, p1) => {
    if (p1.includes('form/') && !file.includes('shared')) {
        const p1Last = p1.split('form/')[1];
        const newPath = path.relative(path.dirname(file), path.join(srcDir, 'shared/components/form', p1Last));
        return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
    }
    if (p1.includes('utils/validation')) {
        const newPath = path.relative(path.dirname(file), path.join(srcDir, 'shared/utils/validation'));
        return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
    }
    if (p1.includes('utils/cloudinary')) {
        const newPath = path.relative(path.dirname(file), path.join(srcDir, 'shared/utils/cloudinary'));
        return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
    }
    if (p1.includes('hooks/useAdminData')) {
        const newPath = path.relative(path.dirname(file), path.join(srcDir, 'app/routes/admin/hooks/useAdminData'));
        return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
    }
    if (file.includes('App.tsx') && p1.includes('AdminPanel')) {
        return `from './app/routes/admin/AdminPanel'`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Imports fixed phase 4.');
