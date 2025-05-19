import { getSkillTopics } from './skillsService';

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
  console.log("Prompt: ", prompt);

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
    
    console.log('api key', apiKey);
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
              content: "You are a marketing expert with deep knowledge of digital marketing, social media strategies, and traditional marketing channels. Format your response in clear sections with headers starting with # and key details using Key: Value format."
            },
            { 
              role: "user", 
              content: `Create a comprehensive marketing analysis for ${url}. Structure your response with the following sections:

# Overview
Provide a brief overview of their marketing strategy

# Digital Marketing Channels
Break down their digital marketing presence and effectiveness

# Social Media Strategy
Detail their social media platforms, posting frequency, and engagement metrics

# Traditional Marketing
Analyze their traditional marketing channels (TV, radio, print, etc.)

# Budget Allocation
Estimate their marketing budget distribution across channels

# Key Performance Metrics
List their main success metrics and benchmarks

# Recommendations
Provide actionable recommendations for similar marketing results

Use specific numbers, percentages, and metrics where possible. Format key statistics and data points as "Key: Value" pairs for better readability.`
            }
          ]
        })
      });      const data = await response.json();
      let content = data.choices?.[0]?.message?.content;
        if (content) {
        // Split content into sections
        const sections = content.split(/(?=# )/);
        
        // Format content into sections with proper HTML structure
        content = `<div class="marketing-plan">
          ${sections.map((section: string) => {
            const lines = section.trim().split('\n');
            if (lines[0].startsWith('# ')) {
              // This is a section with a header
              const header = lines[0].replace('# ', '');
              const body = lines.slice(1).join('\n');
              return `
                <h3 class="section-title">${header}</h3>
                ${body.split('\n').map((line: string) => {
                  if (line.includes(': ')) {
                    const [key, value] = line.split(': ');
                    return `<div class="detail-item">
                      <strong>${key.trim()}</strong>
                      <span>${value.trim()}</span>
                    </div>`;
                  }
                  return line.trim() ? `<p>${line.trim()}</p>` : '';
                }).join('')}
              `;
            }
            return section ? `<p>${section.trim()}</p>` : '';
          }).join('')}
        </div>`;

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
