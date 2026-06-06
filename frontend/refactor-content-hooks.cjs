const fs = require('fs');
const path = require('path');

const componentsToFix = [
  'src/modules/content/components/Hero.tsx',
  'src/modules/content/components/Testimonials.tsx',
  'src/modules/menu/components/PopularDeals.tsx',
  'src/modules/menu/components/PremiumHorizontalMenu.tsx',
];

componentsToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace import
  content = content.replace(
    /import \{ fetchLandingContent \} from '.*?client';/,
    "import { useLandingContent } from '../../content/hooks/useContentQueries';"
  );
  content = content.replace(
    /import \{ fetchLandingContent \} from '.*?api';/,
    "import { useLandingContent } from '../../content/hooks/useContentQueries';"
  );

  // Replace state
  const stateRegex = /const \[slides, setSlides\] = useState.*?\[\]\);\n\s*const \[loading, setLoading\] = useState\(true\);\n\n\s*useEffect\(\(\) => \{\n\s*fetchLandingContent\(\)\.then\(\(res\) => \{\n\s*setSlides\(.*?\);\n\s*\}\)\.catch\(\(\) => \{\n\s*\}\)\.finally\(\(\) => \{\n\s*setLoading\(false\);\n\s*\}\);\n\s*\}, \[\]\);/ms;

  const newState = `const { data: landingContent, isLoading: loading } = useLandingContent();
  const slides = landingContent?.heroSlides || [];`;
  
  // For deals:
  const dealsRegex = /const \[deals, setDeals\] = useState.*?\[\]\);\n\s*const \[loading, setLoading\] = useState\(true\);\n\n\s*useEffect\(\(\) => \{\n\s*fetchLandingContent\(\)\.then\(\(res\) => \{\n\s*setDeals\(res\.data\.deals \|\| \[\]\);\n\s*\}\)\.catch\(\(\) => \{\}\)\.finally\(\(\) => setLoading\(false\)\);\n\s*\}, \[\]\);/ms;
  const newDealsState = `const { data: landingContent, isLoading: loading } = useLandingContent();
  const deals = landingContent?.deals || [];`;

  // For testimonials:
  const reviewsRegex = /const \[reviews, setReviews\] = useState.*?\[\]\);\n\s*const \[loading, setLoading\] = useState\(true\);\n\n\s*useEffect\(\(\) => \{\n\s*fetchLandingContent\(\)\.then\(\(res\) => \{\n\s*setReviews\(res\.data\.testimonials \|\| \[\]\);\n\s*\}\)\.catch\(\(\) => \{\}\)\.finally\(\(\) => setLoading\(false\)\);\n\s*\}, \[\]\);/ms;
  const newReviewsState = `const { data: landingContent, isLoading: loading } = useLandingContent();
  const reviews = landingContent?.testimonials || [];`;

  content = content.replace(stateRegex, newState);
  content = content.replace(dealsRegex, newDealsState);
  content = content.replace(reviewsRegex, newReviewsState);

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Refactored content components.');
