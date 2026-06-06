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

  // Fix generic imports
  content = content.replace(/from\s+['"](.*?)['"]/g, (match, p1) => {
    if (p1.startsWith('.')) {
      // If we import data
      if (p1.includes('data/') || p1.endsWith('data')) {
        const p1Last = p1.split('/').pop();
        if (p1Last === 'data' || p1Last === 'adminPanelData') {
          const target = p1Last === 'data' ? 'shared/data/data' : 'shared/data/adminPanelData';
          const newPath = path.relative(path.dirname(file), path.join(srcDir, target));
          return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
        }
      }
      
      // If we import utils
      if (p1.includes('utils/')) {
        const p1Last = p1.split('utils/')[1];
        const newPath = path.relative(path.dirname(file), path.join(srcDir, 'shared/utils', p1Last));
        return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
      }
      
      // Fix infrastructure/http/client imports for the admin panel that used to come from services/api
      if (p1.includes('infrastructure/http/client') && file.includes('app\\routes\\admin')) {
         // The admin views still import createCategory, etc. from client. 
         // We should just point them back to services/api where they originally were!
         const newPath = path.relative(path.dirname(file), path.join(srcDir, 'services/api'));
         return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
      }
      
      // Fix AdminPanel path if in App.tsx
      if (file.endsWith('App.tsx') && p1.includes('AdminPanel')) {
         return `from './app/routes/admin/AdminPanel'`;
      }
    }
    return match;
  });
  
  // Fix Category type missing property errors 
  if (file.includes('Categories.tsx') || file.includes('FeaturedPizzas.tsx')) {
    content = content.replace(/category\.slug/g, "category.name.toLowerCase().replace(/\\s+/g, '-')");
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Imports fixed phase 3.');
