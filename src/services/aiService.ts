import { getSkillTopics } from './skillsService';

export const requestRefresher = async (
  level: string,
  skillDescription: string,
  skillCategory: string,
  language: string,
  startCourse?: number,
  previousQuizzes?: string[]
): Promise<string> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;            

    const callOpenRouter = async () => {
      if (!apiKey) {
        throw new Error('API key not found in environment variables!');
      }

      //console.log('start course', startCourse);
      // Get previous content to ensure continuity in course mode
      let previousContent = '';
      let currentSection = 1;
      if (level === '') {
        const storedContent = localStorage.getItem('previousContent');
        const storedSection = localStorage.getItem('currentSection');
        if (storedContent) previousContent = storedContent;
        if (storedSection) currentSection = parseInt(storedSection, 10) + 1;
      }           
      // Include a practical code example with syntax highlighting in the answer section.

      var languageprompt = `Return all text in this  language: ${language}.  `;
      var prompt = languageprompt;
        
      prompt += `I'm creating a ${skillDescription} quiz for a job applicant.  
      Give me a completely new random ${level} difficulty ${skillDescription} question on a random topic.

      Make sure to format the question with good spacing and readability:
- Use paragraphs with blank lines between them
- Break down long scenarios into smaller parts
- For bullet points or lists of requirements, use HTML <ul> and <li> tags.
- Keep the main question clear and separate
- Make answer options simple.  Try not to create quizzes with options that include code.
- Each option should not be more than 2 lines.

Do not include the word html and GRAVE ACCENT in the answer.
Each question should be different topic from previous question.  Ask a random topic each time. 
Content will be displayed on a dark background and that it should only use light colors for text.
If option is not a code fragment then remove the <pre><code> tags.
Format the response in this exact HTML structure:

<div class="question-container">
    <div class="question">
        [Your question text here. If the question includes a code snippet, format it like this: <pre><code class="language-javascript">const snippet = "example";</code></pre> within the question text. Ensure the class attribute is one of the supported languages listed below.]
    </div>
    <div class="options"> 
        <div class="option"><span class="option-prefix">A)</span>[Option A]</div>
        <div class="option"><span class="option-prefix">B)</span> [Option B]</div>
        <div class="option"><span class="option-prefix">C)</span> [Option C]</div>
        <div class="option"><span class="option-prefix">D)</span>[Option D]</div>
        
    </div>
    <div class="quiz-status"></div>
    <div class="answer-box">
        <div class="correct-answer">
            Correct Answer: [Letter]
        </div>
        <br/>
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
1. For code examples in the answer or options section, use <pre><code class="language-xxx"> tags. For "language-xxx", use one of the following based on the snippet's language: "language-typescript", "language-javascript", "language-jsx", "language-tsx", "language-markup", "language-css", "language-graphql", "language-cpp", "language-python", "language-rust", "language-go", "language-ruby", "language-sql", "language-java", "language-csharp".
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
11. Make code examples practical and focused.
12. Start off content with the question, don't return a summary of what you will do or a list of instructions. Just return the question and options, then the answer and explanation.`;     


prompt += `  Also!, quiz can't be similar to these previous ${previousQuizzes?.length} quizzes: ${previousQuizzes ? previousQuizzes.join(', Next Quiz:  ') : 'none'}.`;

//todo: just add to prompt to NOT use code elements
if (skillCategory === 'non-technology'){
  prompt = languageprompt + `I'm creating a ${skillDescription} quiz for a job applicant.  
      Give me a completely new random ${level} difficulty ${skillDescription} question on a random topic.
  Content will be displayed on a dark background and that it should only use light colors for text.
Do not include the word html and GRAVE ACCENT in the answer.
Option should not be more than 2 lines.
Each question should be different topic from previous question.  Ask a random topic each time. 
Format the response in this exact HTML structure:

<div class="question-container">
    <div class="question">
        [Your question text here. If the question includes a code snippet, format it like this: <pre><code class="language-javascript">const snippet = "example";</code></pre> within the question text. Ensure the class attribute is one of the supported languages listed below.]
    </div>    
    <div class="options">
        <div class="option"><span class="option-prefix">A)</span> [Option A]</div>
        <div class="option"><span class="option-prefix">B)</span> [Option B]</div>
        <div class="option"><span class="option-prefix">C)</span> [Option C]</div>
        <div class="option"><span class="option-prefix">D)</span> [Option D]</div>
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
3. Put each explanation point on a new line using <p> tags.
10. Put each explanation point in the answer section on a new line using <p> tags.
11. no line break between correct answer and explanation divs`;    

prompt += `  Also, quiz can't be similar to these previous ${previousQuizzes?.length} quizzes: ${previousQuizzes ? previousQuizzes.join(', Next Quiz:  ') : 'none'}.`;

  }

if (startCourse === 1) {
        // Course mode prompt        
        prompt =   languageprompt + `Create nicely formatted section ${currentSection} of a comprehensive tutorial course for ${skillDescription}.
        ${previousContent ? `Previous section covered: [begin section] ${previousContent} [end section]` : 'This is the first section.'}        
        Show one section only. Next section will be given in next prompt.  
        Content will be displayed on a dark background and that it should only use light colors for text.
        text should be white.
        Option should not be more than 2 lines.

          Format section content nicely:
        - Use proper HTML tags for emphasis (<strong> for bold, <em> for italics)
        - DO NOT use asterisks (**) for emphasis or formatting
        - Use line breaks (<br/>) and paragraphs (<p>)
        - Use lists (<ul> and <li>) for bullet points
        - Use appropriate headings (<h3>, <h4>)        
        - Keep text white for readability on dark background
        - Structure content with clear visual hierarchy
        - For h4 color them lightcyan


        Format each content section like:
        <h3 class="section-title">Section Title</h3>        
        [section content]

        Format section content nicely, use line breaks, li's, uls, change colors, nice css, bold, etc. Stylize.`

        if (skillCategory !== 'non-technology'){
        prompt += `Use code sections when needed. All code snippets in section content  MUST be wrapped in <pre><code class="language-xxx">...your code here...</code></pre> tags. This structure is MANDATORY.
    . The \`language-xxx\` part of the class on the <code> tag is ESSENTIAL for syntax highlighting. You MUST use ONLY ONE of the following specific and supported language classes:
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
 The example structure for a code snippet within the question text is: \`<pre><code class="language-javascript">const snippet = "example";</code></pre>\`. Adhere to this, using an appropriate language class from the list in point 7.
 Indent code properly inside the <code> block.
 non code text color shoudl always be white.
        Include a practical code example with syntax highlighting in the answer section.  
       `};

        prompt += `
        Do not include the word html and GRAVE ACCENT in the answer.
        Do not include any language tags like <lang="en"> or <!DOCTYPE> or <html> or <body>.
        Do not wrap content in HTML/HEAD/BODY tags.
        Add plenty of line breaks, do not have runon sentences.
        Never use any h1 or h2 tags.
        Never use fragment tags (<> or </> or <></> or <Fragment> or </Fragment>).
        Never use React or JSX syntax.
  
  style response nicely.
  Content structure rules:
  - Use only h3 with class "section-title" for section headings (no h1 or h2)
  - Keep explanations clear and concise
  - Avoid any inline styles
  - Send only the direct content without any document-level HTML tags or fragments
  - Use only plain HTML without React/JSX components or fragments
  - If course is not a programming language, DO NOT USE CODE EXAMPLE OR BLOCKS AT ALL!!!
  - At end show ONE multiple choice question on this section.
  Format the response in this exact HTML structure:
        
  <div class="question-container">
    <div class="question">
        [Your question text here. If the question includes a code snippet, format it like this: <pre><code class="language-javascript">const snippet = "example";</code></pre> within the question text. Ensure the class attribute is one of the supported languages listed below.]
    </div>
    <div class="options">
        <div class="option"><span class="option-prefix">A)</span> [Option A]</div>
        <div class="option"><span class="option-prefix">B)</span> [Option B]</div>
        <div class="option"><span class="option-prefix">C)</span> [Option C]</div>
        <div class="option"><span class="option-prefix">D)</span> [Option D]</div>
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
</div>`
        
      

        // Store content for next section
        localStorage.setItem('currentSection', currentSection.toString());
        localStorage.setItem('previousContent', `Section ${currentSection}`);
      } else       
      if (level === 'slidedeck') {
        // Slide deck mode prompt
        prompt = languageprompt +  `Create a detailed thorough educational slide deck about ${skillDescription} basics and intermediate.  At the end include a section on steps needed to get proficient in this skill.
        For text that is bold, format them with lightcyan color.  Dont use ** to wrap aroudn important text, instead make it bold with color.
         Format section content nicely:
        - Use proper HTML tags for emphasis (<strong> for bold, <em> for italics)
        - DO NOT use asterisks (**) for emphasis or formatting
        - Use line breaks (<br/>) and paragraphs (<p>)
        - Use lists (<ul> and <li>) for bullet points
        - Use appropriate headings (<h3>, <h4>)
        - Use code sections when needed with proper syntax highlighting
        - Keep text white for readability on dark background
        - Structure content with clear visual hierarchy
        Do not use * as marker.
        If course is not a programming language, DO NOT USE CODE EXAMPLE OR BLOCKS AT ALL!!!
        Format output as:
        <div class="slide-container">
            <div class="slide">
                <h2>Introduction to ${skillDescription}</h2>
                <ul>
                    <li>[Overview point 1]</li>
                    <li>[Overview point 2]</li>
                    <li>[Overview point 3]</li>
                </ul>
            </div>
            <div class="slide">
                <h2>Key Concepts</h2>
                [Main concepts explanation]
            </div>
            <div class="slide">
                <h2>Code Example</h2>
                <pre><code class="language-${skillCategory}">
                [Basic example code]
                </code></pre>
            </div>
            <div class="slide">
                <h2>Best Practices</h2>
                <ul>
                    <li>[Best practice 1]</li>
                    <li>[Best practice 2]</li>
                    <li>[Best practice 3]</li>
                </ul>
            </div>
            <div class="slide">
                <h2>Summary</h2>
                [Key takeaways and next steps]
            </div>
        </div>`;
      }

      const url = 'https://openrouter.ai/api/v1/chat/completions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/russelltchang/autodidactic', 
        },
        body: JSON.stringify({
          'model': 'google/gemini-2.0-flash-001:floor',
            //model: 'gpt-3.5-turbo',
          temperature: 0.9, // Increase randomness
          'messages': [{"role": "user", "content": prompt}]
        })
      });

      
      const data = await response.json();
    let content = data.choices?.[0]?.message?.content;
    if (content) {
      content = content.replace(/^```html\s*/i, '');
      content = content.replace(/```\s*$/, '');
      content = content.replace(/`/g, '');
      content = content.replace(/html/g, '');
      content = content.replace(/xml/g, '');

      content = content.trim();
    }
      return content;
    };

    const result = await callOpenRouter();    
    return result;
  } catch (error) {
    console.error('Error making OpenRouter request:', error);
    throw error;
  }
};


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

export const getFailedQuestionsPrimer = async (skillDescription :string, failedQuestions: string[]): Promise<string> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('API key not found in environment variables!');
    }

    const prompt = `Create me a primer or tutorial that will help a student who failed these quizzes for this topic "${skillDescription}
    Format the response in clean HTML.

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
   Do NOT use any other language classes.  If a code snippet is for a language not in this list, 
   please use \`language-javascript\` if it's a generic script-like snippet or \`language-markup\` 
   if it resembles HTML/XML. Avoid generating code snippets for languages not on this list if possible.


    Failed questions: ${failedQuestions.join(', Next Failed Quizk: ')}.`



    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Algo Demo - YouTube Resources'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (content) {
      // Clean up any markdown code blocks
      content = content.replace(/^```html\s*/i, '');
      content = content.replace('```', '');
      content = content.trim();
    }

    return content || 'No YouTube resources found. Please try again.';

  } catch (error) {
    console.error('Error generating YouTube resources:', error);
    return 'There was an error loading YouTube resources. Please try again later.';
  }
};

export const getMarketingPlan = async (url: string): Promise<string> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    //console.log('api key', apiKey);
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


