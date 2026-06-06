const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Map of file names to their new absolute-ish paths (relative to src)
const componentMap = {
  'Navbar': 'shared/components/layout/Navbar',
  'Footer': 'shared/components/layout/Footer',
  'FloatingMenu': 'shared/components/layout/FloatingMenu',
  'Preloader': 'shared/components/ui/Preloader',
  'Logo': 'shared/components/ui/Logo',
  'WaveDivider': 'shared/components/ui/WaveDivider',
  'ArrowButton': 'shared/components/ui/ArrowButton',
  'CartSidebar': 'modules/cart/components/CartSidebar',
  'OrderTracker': 'modules/orders/components/OrderTracker',
  'FeaturedPizzas': 'modules/menu/components/FeaturedPizzas',
  'Categories': 'modules/menu/components/Categories',
  'PopularDeals': 'modules/menu/components/PopularDeals',
  'PremiumHorizontalMenu': 'modules/menu/components/PremiumHorizontalMenu',
  'Hero': 'modules/content/components/Hero',
  'Marquee': 'modules/content/components/Marquee',
  'AppPromo': 'modules/content/components/AppPromo',
  'CTABanner': 'modules/content/components/CTABanner',
  'Testimonials': 'modules/content/components/Testimonials',
  'WhyChooseUs': 'modules/content/components/WhyChooseUs',
  'DeliveryProcess': 'modules/content/components/DeliveryProcess',
  'AdminLogin': 'modules/auth/components/AdminLogin',
  'AdminPanel': 'app/routes/admin/AdminPanel',
  'useDebounce': 'shared/hooks/useDebounce',
  'useImagePreloader': 'shared/hooks/useImagePreloader',
  'api': 'infrastructure/http/client', // old api.ts is somewhat mapped, we'll see
};

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

  // Fix deep relative paths: if a file moved deeper, we need more '../'
  // Let's compute relative path from current file to 'src'
  const relativeToSrc = path.relative(path.dirname(file), srcDir);
  const upPrefix = relativeToSrc === '' ? './' : relativeToSrc.replace(/\\/g, '/') + '/';

  // Fix generic imports
  // e.g. import Hero from "../components/Hero" -> import Hero from "../../../modules/content/components/Hero"
  // Actually, standard regex for imports:
  content = content.replace(/from\s+['"](.*?)['"]/g, (match, p1) => {
    // If it's a relative import
    if (p1.startsWith('.')) {
      const absoluteP1 = path.resolve(path.dirname(file), p1);
      
      // Fix assets
      if (p1.includes('assets/')) {
         const newPath = path.relative(path.dirname(file), path.join(srcDir, 'assets', p1.split('assets/')[1]));
         return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
      }
      
      // Fix types
      if (p1.endsWith('types') || absoluteP1 === path.join(srcDir, 'types')) {
         const newPath = path.relative(path.dirname(file), path.join(srcDir, 'types'));
         return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
      }

      // Check component map
      for (const [key, newLoc] of Object.entries(componentMap)) {
        if (p1.endsWith(`/${key}`) || p1 === `./${key}` || p1 === `../${key}`) {
          const newPath = path.relative(path.dirname(file), path.join(srcDir, newLoc));
          return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
        }
      }

      // Fix relative paths for files that were moved together
      // For example ui/ArrowButton -> shared/components/ui/ArrowButton
      if (p1.includes('ui/')) {
         const newPath = path.relative(path.dirname(file), path.join(srcDir, 'shared/components/ui', p1.split('ui/')[1]));
         return `from '${newPath.replace(/\\/g, '/').replace(/^([^\.])/, './$1')}'`;
      }
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Imports fixed.');
