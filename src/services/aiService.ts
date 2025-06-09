import { getSkillTopics } from './skillsService';

// Food Saver AI call
export const getFoodSaverResults = async (foodItem: string, city: string): Promise<string> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) throw new Error('API key not found in environment variables!');
    const prompt = `For this product: ${foodItem}, find me the stores with the lowest cost right now. Include walmart and costco. 
    Give me the list only. Return at least 5.  Return results price per pound.  Format it nicely. Only include pound if it's applicable food item.
    In round brackets, include the brand title and brand name.
     I'm in ${city}.`;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001:floor",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that returns a pure HTML list of stores and prices. Do not use markdown. Do not include any explanations, just the formatted list."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });
    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;
    if (content) {
      content = content.replace(/^```html\s*/i, '');
      content = content.replace(/```\s*$/, '');
      content = content.trim();
    }
    return content || 'No results found.';
  } catch (error) {
    console.error('Error connecting to AI service (Food Saver):', error);
    return 'There was an error processing your request. Please try again later.';
  }
};


 export const requestRefresher = async (level: string, skillDescription: string, skillCategory: string): Promise<string> => {
  try {    // Try different environment variable formats since Vite and CRA handle them differently
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    // Get topics for the skill
    //const { getSkillTopics } = require('./skillsService');
    //const topics = getSkillTopics(skillDescription);

    const callOpenRouter = async () => {
      if (!apiKey) {
        throw new Error('API key not found in environment variables!');
      }

      var prompt = `I'm creating a ${skillDescription} quiz for a job applicant.  
      Give me a completely new random ${level} difficulty ${skillDescription} question on a random topic.

Do not include the word html and GRAVE ACCENT in the answer.
Include a practical code example with syntax highlighting in the answer section.
Each question should be different topic from previous question.  Ask a random topic each time. 
Format the response in this exact HTML structure:

<div class="question-container">
    <div class="question">
        [Your question text here. If the question includes a code snippet, format it like this: <pre><code class="language-javascript">const snippet = "example";</code></pre> within the question text. Ensure the class attribute is one of the supported languages listed below.]
    </div>
    <div class="options">
        <div class="option">A) [Option A]</div>
        <div class="option">B) [Option B]</div>
        <div class="option">C) [Option C]</div>
        <div class="option">D) [Option D]</div>
    </div>
    <div class="quiz-status"></div>
    <div class="answer-box">
        <div class="correct-answer">
            Correct Answer: [Letter]
        </div>
        <div class="explanation">
            <p>[First line of explanation]</p>
            <pre><code class="language-typescript">
                [Your code example here with proper indentation]
            </code></pre>
            <p>[Rest of the explanation with each point on a new line]</p>
        </div>
    </div>
</div>

Important:
1. For code examples in the answer section, use <pre><code class="language-xxx"> tags. For "language-xxx", use one of the following based on the snippet's language: "language-typescript", "language-javascript", "language-jsx", "language-tsx", "language-markup", "language-css", "language-graphql", "language-cpp", "language-python", "language-rust", "language-go", "language-ruby", "language-sql", "language-java", "language-csharp".
2. Indent code properly inside the code block.
3. Put each explanation point on a new line using <p> tags.
4. If the question itself contains a code snippet (e.g., asking "What does this code do?"), that snippet must also be wrapped in <pre><code class="language-xxx"> tags directly within the <div class="question">. For "language-xxx", use one of the following based on the snippet's language: "language-typescript", "language-javascript", "language-jsx", "language-tsx", "language-markup", "language-css", "language-graphql", "language-cpp", "language-python", "language-rust", "language-go", "language-ruby", "language-sql", "language-java", "language-csharp".
5. Make code examples practical and focused. Ensure all code, whether in question or answer, is correctly embedded within the specified <pre><code> structure with a supported language class.
Supported language classes for <code class="language-xxx"> are: language-typescript, language-javascript, language-jsx, language-tsx, language-markup, language-css, language-graphql, language-cpp, language-python, language-rust, language-go, language-ruby, language-sql, language-java, language-csharp.
6. All code snippets, whether in the main question text (inside <div class="question">) or in the answer/explanation section, MUST be wrapped in <pre><code class="language-xxx">...your code here...</code></pre> tags. This structure is MANDATORY.
7. The \`language-xxx\` part of the class on the <code> tag is ESSENTIAL for syntax highlighting. You MUST use ONLY ONE of the following specific and supported language classes:
    - \`language-markup\` (for HTML, XML, SVG)
    - \`language-css\`
    - \`language-javascript\`
    - \`language-jsx\`
    - \`language-typescript\`
    - \`language-tsx\`
    - \`language-graphql\`
    - \`language-cpp\`
    - \`language-python\`
    - \`language-rust\`
    - \`language-go\`
    - \`language-ruby\`
    - \`language-sql\`
    - \`language-java\`
    - \`language-csharp\`
   Do NOT use any other language classes (e.g., do not use \`language-python\`, \`language-java\`, \`language-text\`, \`language-generic\` etc.). If a code snippet is for a language not in this list, please use \`language-javascript\` if it's a generic script-like snippet or \`language-markup\` if it resembles HTML/XML. Avoid generating code snippets for languages not on this list if possible.
8. The example structure for a code snippet within the question text is: \`<pre><code class="language-javascript">const snippet = "example";</code></pre>\`. Adhere to this, using an appropriate language class from the list in point 7.
9. Indent code properly inside the <code> block.
10. Put each explanation point in the answer section on a new line using <p> tags.
11. Make code examples practical and focused.`;

if (skillCategory === "non-technology"){
  prompt = `Create a completely new ${level} difficulty for the topic of ${skillDescription} question for timestamp ${new Date().toISOString()}.

Do not include the word html and GRAVE ACCENT in the answer.
Format the response in this exact HTML structure:

<div class="question-container">
    <div class="question">
        [Your question text here. ]
    </div>
    <div class="options">
        <div class="option">A) [Option A]</div>
        <div class="option">B) [Option B]</div>
        <div class="option">C) [Option C]</div>
        <div class="option">D) [Option D]</div>
    </div>
    <div class="quiz-status"></div>
    <div class="answer-box">
        <div class="correct-answer">
            Correct Answer: [Letter]
        </div>
        <div class="explanation">
            <p>[First line of explanation]</p>            
            <p>[Rest of the explanation with each point on a new line]</p>
        </div>
    </div>
</div>

Important:
1. Put each explanation point in the answer section on a new line using <p> tags.
2. Do not include any code examples, code snippets, or code-related sections.`;
  }

  // 1. The response should be pure HTML content, without any \`style\` tags or inline style attributes. All styling will be handled by the existing site's CSS.

  if (level === "slidedeck"){
    prompt = `Create a slidedeck introducing basic and intermediate concepts of ${skillDescription} for someone new to the topic. Timestamp: ${new Date().toISOString()}.

The slidedeck's content MUST be structured into logical sections. 
Each major section (e.g., Introduction, Basic Concepts, Intermediate Concepts, External Resources) MUST be wrapped 
in its own separate \`<div class="content-block">\`.
Within each \`<div class="content-block">\`, use appropriate HTML tags:
- Use \`<h2>\` for the main title of that section.
- Use \`<p>\` for all paragraphs of text.
- Use \`<ul>\` or \`<ol>\` for lists, with \`<li>\` for list items.

The slidedeck should be comprehensive and lengthy.
It must NOT include any images.
It must NOT include a \`<head>\` HTML element.
It must NOT include any \`<style>\` tags or inline style attributes. All styling is handled by existing CSS.
${(skillCategory === "non-technology") ? "It must NOT include any code examples, code snippets, or code-related sections" : ""}


Important Content and Formatting Rules:
1.  The entire response MUST be pure HTML.
2.  Structure: Divide the slidedeck into distinct sections (Introduction, concepts, resources). Each of these sections MUST be enclosed in \`<div class="content-block">\`.
3.  Section Titles: Use \`<h2>\` for the title of each section within its \`<div class="content-block">\`.
4.  Text: All explanatory text and content points must be within \`<p>\` tags. Ensure clear separation of paragraphs.
5.  External Resources Section: The final section MUST be dedicated to "External Resources". This section should include:
    a.  Links to relevant external websites or articles for further learning.
    b.  Recommendations for external courses.
    c.  Recommendations for good YouTube course videos, including actual, valid YouTube links.
`
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
           "Authorization": `Bearer ${apiKey}`,  // Replace with your actual API key
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ///works: deepseek/deepseek-prover-v2"
          //:floor optimizes prices
          model: "google/gemini-2.0-flash-001:floor", // Using GPT-3.5-Turbo for faster responses
          //model: 'gpt-3.5-turbo',
          temperature: 0.9, // Increase randomness
          messages: [            { 
              role: "system", 
              content: "You are a helpful assistant that creates programming quiz questions. IMPORTANT: Do not use markdown code blocks. Do not include ```html at the start or ``` at the end of your response. Just return the raw HTML structure as specified in the prompt." 
            },
            { 
              role: "user", 
              content: prompt
            }
          ]
        })
      });      const data = await response.json();
      let content = data.choices?.[0]?.message?.content;
      
      // Clean up any markdown code blocks and format them properly
      if (content) {
        // First clean up the outer wrapper if it exists
        content = content.replace(/^```html\s*/i, '');
        content = content.replace(/```\s*$/, '');
        
        // Convert any markdown code blocks within the content to proper HTML
        content = content.replace(/```typescript\s*\n?([\s\S]*?)\n?```/g, (_: string, code: string): string => {
          return `<pre><code class="language-typescript">${code.trim()}</code></pre>`;
        });
        
        content = content.trim();
      }
      
      return content;
    };
  
    var ret = await callOpenRouter();
    return ret;
  
  } catch (error) {
    console.error('Error connecting to AI service:', error);
    return 'There was an error processing your request. Please try again later.';
  }
};

export const getMarketingPlan = async (url: string): Promise<string> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    
    const callOpenRouter = async () => {
      if (!apiKey) {
        throw new Error('API key not found in environment variables!');
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001:floor",
          temperature: 0.7,
          messages: [            { 
              role: "system", 
              content: "You are a marketing expert with deep knowledge of digital marketing, social media strategies, and traditional marketing channels. Return your response in properly formatted HTML with sections and styled elements."
            },
            { 
              role: "user", 
              content: `Create a comprehensive marketing analysis for ${url}. Format the response compactly using this exact HTML structure:

<div class="marketing-plan"><div class="content-section">
<h3 class="section-title">Overview</h3>
<p>[Brief overview of their marketing strategy - keep it concise]</p>
<div class="detail-item"><strong>Brand Awareness: </strong><span>[Value]</span></div>
<div class="detail-item"><strong>Market Share</strong><span>[Value]</span></div></div>

<div class="content-section">
<h3 class="section-title">Digital Marketing Channels</h3>
<p>[Brief digital strategy overview]</p>
<div class="detail-item"><strong>SEO Ranking: </strong><span>[Value]</span></div>
<div class="detail-item"><strong>Website Traffic: </strong><span>[Value]</span></div></div>

<div class="content-section">
<h3 class="section-title">Social Media Strategy</h3>
<p>[Brief social media overview]</p>
<div class="detail-item"><strong>Platform Mix: </strong><span>[List platforms]</span></div>
<div class="detail-item"><strong>Engagement Rate: </strong><span>[Value]</span></div></div>

<div class="content-section">
<h3 class="section-title">Traditional Marketing</h3>
<p>[Brief traditional marketing overview]</p>
<div class="detail-item"><strong>TV Ad Spend: </strong><span>[Value]</span></div>
<div class="detail-item"><strong>Print Reach: </strong><span>[Value]</span></div></div>

<div class="content-section">
<h3 class="section-title">Budget Allocation</h3>
<p>[Brief budget overview]</p>
<div class="detail-item"><strong>Digital: </strong><span>[Value]</span></div>
<div class="detail-item"><strong>Traditional: </strong><span>[Value]</span></div></div>

<div class="content-section">
<h3 class="section-title">Key Performance Metrics</h3>
<div class="detail-item"><strong>ROI: </strong><span>[Value]</span></div>
<div class="detail-item"><strong>Conversion Rate: </strong><span>[Value]</span></div></div>

<div class="content-section">
<h3 class="section-title">Recommendations</h3>
<p>1. [First recommendation]</p>
<p>2. [Second recommendation]</p>
<p>3. [Third recommendation]</p></div></div>

Important formatting rules:
1. Use <div class="detail-item"> with nested <strong> and <span> for any key-value pairs
2. Use <p> tags for regular text content
3. Each section must be wrapped in <div class="content-section">
4. Use real numbers, percentages, and metrics where possible
5. Return the response as pure HTML without any markdown formatting and no color or style attributes`
            }
          ]
        })
      });      const data = await response.json();      let content = data.choices?.[0]?.message?.content;

      content = content.replace(/^```html\s*/i, '');
      content = content.replace('```', '');

      return content || 'No marketing plan generated. Please try again.';

      if (content) {
        // Clean up any extra whitespace and ensure proper formatting
        content = content.trim();

        // Clean up any markdown code blocks and format them properly
        interface CodeBlock {
          _: string;
          lang: string | undefined;
          code: string;
        }

                content = content
                  .replace(/```(\w+)?\s*\n?([\s\S]*?)\n?```/g, (_?: string, lang?: string, code?: string): string => {
                    const language: string = lang || 'markup';
                    return `<pre><code class="language-${language}">${(code ?? '').trim()}</code></pre>`;
                  })
                  .trim();
      }
      
      return content || 'No marketing plan generated. Please try again.';
    };
  
    return await callOpenRouter();
  
  } catch (error) {
    console.error('Error generating marketing plan:', error);
    return 'There was an error processing your request. Please try again later.';
  }
};
