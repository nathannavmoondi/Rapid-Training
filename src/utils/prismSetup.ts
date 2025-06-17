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

// Initialize Prism
if (typeof window !== 'undefined') {
  window.Prism = window.Prism || {};
  Prism.manual = true;
}

export function highlightCode(element: HTMLElement) {
  try {
    const codeBlocks = element.querySelectorAll('pre code');
    console.log('Found code blocks to highlight:', codeBlocks.length);
    
    codeBlocks.forEach((block) => {
      if (block instanceof HTMLElement) {
        const lang = Array.from(block.classList)
          .find(className => className.startsWith('language-'));
        
        console.log('Found language class:', lang);
        
        if (lang) {
          // Only highlight if it's a supported language
          const supportedLangs = [
            'javascript', 'typescript',
            'markup', 'css', 'graphql', 'python',
            'java', 'csharp'
          ];
          
          const langName = lang.replace('language-', '');
          console.log('Language name:', langName, 'Supported?', supportedLangs.includes(langName));
          
          if (supportedLangs.includes(langName)) {
            try {
              console.log('Attempting to highlight with Prism...');
              Prism.highlightElement(block);
              console.log('Prism highlighting completed for:', langName);
            } catch (err) {
              console.warn(`Failed to highlight ${langName} code:`, err);
            }
          } else {
            console.warn(`Unsupported language: ${langName}`);
          }
        }
      }
    });
  } catch (err) {
    console.warn('Code highlighting error:', err);
  }
}

export default Prism;
