import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-graphql';

// Remove jsx, tsx and other problematic languages for now
// import 'prismjs/components/prism-jsx';
// import 'prismjs/components/prism-tsx';
// import 'prismjs/components/prism-cpp';
// import 'prismjs/components/prism-rust';
// import 'prismjs/components/prism-go';
// import 'prismjs/components/prism-ruby';
// import 'prismjs/components/prism-sql';

// Initialize Prism
if (typeof window !== 'undefined') {
  window.Prism = window.Prism || {};
  Prism.manual = true;
}

export function highlightCode(element: HTMLElement) {
  try {
    const codeBlocks = element.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      if (block instanceof HTMLElement) {
        const lang = Array.from(block.classList)
          .find(className => className.startsWith('language-'));
        
        if (lang) {          // Only highlight if it's a supported language
          const supportedLangs = [
            'javascript', 'typescript',
            'markup', 'css', 'graphql', 'python',
            'java', 'csharp'
          ];
          
          const langName = lang.replace('language-', '');
          if (supportedLangs.includes(langName)) {
            try {
              Prism.highlightElement(block);
            } catch (err) {
              console.warn(`Failed to highlight ${langName} code:`, err);
            }
          }
        }
      }
    });
  } catch (err) {
    console.warn('Code highlighting error:', err);
  }
}

export default Prism;
