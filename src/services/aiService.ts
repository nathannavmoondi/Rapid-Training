import { getSkillTopics } from './skillsService';

export const requestRefresher = async (level: string, skillDescription: string): Promise<string> => {
  try {    // Try different environment variable formats since Vite and CRA handle them differently
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    
    console.log('Level:', level);
    console.log('Skill Description:', skillDescription);
    console.log('API Key exists:', !!apiKey); // Log if API key exists without exposing the key
    
    // Get topics for the skill
    const { getSkillTopics } = require('./skillsService');
    const topics = getSkillTopics(skillDescription);

    const callOpenRouter = async () => {
      if (!apiKey) {
        throw new Error('API key not found in environment variables!');
      }

      var prompt = `Create a completely new ${level} difficulty ${skillDescription} question for timestamp ${new Date().toISOString()}. 

do not include the word html and GRAVE ACCENT in the answer.
Include a practical code example with syntax highlighting in the answer section. 
Format the response in this exact HTML structure:

<div class="question-container">
    <div class="question">
        [Your question here]
    </div>
    <div class="options">
        <div class="option">A) [Option A]</div>
        <div class="option">B) [Option B]</div>
        <div class="option">C) [Option C]</div>
        <div class="option">D) [Option D]</div>
    </div>
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
1. For code examples, use <pre><code class="language-typescript"> tags
2. Indent code properly inside the code block
3. Put each explanation point on a new line using <p> tags
4. If the question contains code, make sure you put it into a code block
5. Make code examples practical and focused`;

      console.log('Prompt:', prompt); // Log the prompt for debugging 

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
