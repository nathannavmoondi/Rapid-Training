// import { getSkillTopics } from './skillsService';
import { getYoutubeSummaryAndTranscript, getYoutubeQuiz } from './youtubeService';
import { ChatMessage } from './chatService';
import { getQuestionFormatPrompt, removeStandaloneCodeTags } from './promptService';

export const requestRefresher = async (
  level: string,
  skillDescription: string,
  skillCategory: string,
  language: string,
  startCourse?: number,
  previousQuizzes?: string[],
  isQuestionQuizFormat?: boolean
): Promise<string> => {

  console.log('isquestionquiz', isQuestionQuizFormat);
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
      var prompt = '';
      
      // Use question format prompt if isQuestionQuizFormat is true
      if (isQuestionQuizFormat) {
        prompt = languageprompt +getQuestionFormatPrompt(language, skillDescription, level, previousQuizzes);
      } else {
        prompt = languageprompt;
        
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
12. Start off content with the question, don't return a summary of what you will do or a list of instructions. Just return the question and options, then the answer and explanation.;     
13. Do not put any part of the answer outside the answer-box div.
14. Try not to have lines longer than 80 characters for better readability.`

prompt += `  Also!, quiz can't be similar to these previous ${previousQuizzes?.length} quizzes: ${previousQuizzes ? previousQuizzes.join(', Next Quiz:  ') : 'none'}.`;
      }
      
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
        
        IMPORTANT: For any code examples, you MUST use one of these EXACT language classes in the <code> tag:
        - language-javascript (for JavaScript)
        - language-typescript (for TypeScript)  
        - language-python (for Python)
        - language-java (for Java)
        - language-csharp (for C#)
        - language-cpp (for C++)
        - language-css (for CSS)
        - language-markup (for HTML/XML)
        - language-sql (for SQL)
        - language-json (for JSON)
        NEVER use "language-" without a proper language identifier!
        
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
                <pre><code class="language-javascript">
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
      
      // Apply the function to remove standalone <code> tags
      //TODO: to remove annouying <code>word</code> tags that ai refuses to get rid of.
      //test it out and see if it's better removed or kept in.
      //content = removeStandaloneCodeTags(content);
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
      });      
      const data = await response.json();      
      let content = data.choices?.[0]?.message?.content;

      if (content) {
        content = content.replace(/^```html\s*/i, '');
        content = content.replace('```', '');
        content = content.trim();
      }

      return content || 'No marketing plan generated. Please try again.';
    };
  
    return await callOpenRouter();
  
  } catch (error) {
    console.error('Error generating marketing plan:', error);
    return 'There was an error processing your request. Please try again later.';
  }
};


// Moved getYoutubeSummaryAndTranscript and getYoutubeQuiz to youtubeService.ts

export const GetIWantToLearn = async (topic: string): Promise<void> => {
  // Placeholder for future AI logic
  return;
};

export const getRefresherSyntax = async (skill: string, skillLevel: string, userAnswer?: string, conversationHistory?: ChatMessage[]): Promise<ChatMessage> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not found in environment variables!');
    }

    // Base formatting instructions used in both initial and continuation prompts
    const formattingInstructions = `FORMATTING INSTRUCTIONS:
1. Begin with ${userAnswer ? "feedback on my answer - tell me if I was correct or what I should have typed" : '"Here\'s your code snippet:"'}
2. ${userAnswer ? "Then write" : "Put"} "Here's your ${userAnswer ? "next " : ""}code snippet:"
3. Put the language name (e.g., "javascript") before the code
4. Present a simple 1-3 line code snippet related to ${skill} and use icons/emojis if needed
5. Ask the user to type it out in the chat and explain this is an interactive exercise
6. Include an "Explanation:" section that clearly explains what the code does
7. Do not include the accent character in the response.
8. The whole response should be structured ${userAnswer ? "like" : "similar to"} this:

${userAnswer ? "[Feedback on my answer]" : ""}

Here's your ${userAnswer ? "next " : ""}code snippet:
<pre><code class="language-typescript">
[code snippet]
</code></pre>

Type out the above line of code. After you type it, I'll give you feedback and another refresher question. This is an interactive typing exercise, so don't be afraid to make mistakes!

<strong>Explanation:</strong> This is where you should provide a clear explanation of what the code does, without making this explanatory text bold.

IMPORTANT: Keep code snippets simple (1-3 lines) and appropriate for ${skillLevel} level. Examples include array creation, function declarations, event handlers, etc. Focus on fundamental syntax that's useful to practice typing.`;

    // Create the appropriate prompt based on whether this is an initial or continuation request
    let prompt;
    if (userAnswer && conversationHistory) {
      // Continuation prompt including the user's answer and prior conversation
      prompt = `I'm practicing ${skill} at ${skillLevel} level. 
Here's my answer: ${userAnswer}

${conversationHistory.length > 0 ? `The conversation so far:
${conversationHistory.map(msg => msg.isUser ? `User: ${msg.text}` : `AI: ${msg.text}`).join('\n\n')}` : ''}

Please provide feedback on my answer, and then give me another ${skill} syntax refresher question.

${formattingInstructions}`;
    } else {
      // Initial prompt
      prompt = `I want to refresh my knowledge of ${skill}. 
    
Create an interactive code snippet exercise for ${skill} at ${skillLevel} level.

${formattingInstructions}`;
    }

    // Include language class information in the prompt
    prompt += `

IMPORTANT STYLING NOTE: Make ONLY the "Explanation:" label bold, not the entire explanation text that follows it.

All code snippets MUST be wrapped in <pre><code class="language-xxx">...your code here...</code></pre> tags. This structure is MANDATORY.
    The \`language-xxx\` part of the class on the <code> tag is ESSENTIAL for syntax highlighting. You MUST use ONLY ONE of the following specific and supported language classes:
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
    
The example structure for a code snippet within the question text is: \`<pre><code class="language-javascript">const snippet = "example";</code></pre>\`.`;

    // The API call remains the same for both initial and continuation prompts
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Algo Demo - Refresher'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001:floor',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || 'Failed to generate refresher content.';
    
    // Remove all backtick (`) characters from the content
    content = content.replace(/`/g, '');
    
    // Return a properly formatted ChatMessage object
    return {
      id: Date.now().toString(), // Generate a unique ID based on timestamp
      text: content,
      isUser: false,
      timestamp: new Date(),
      isFromLearnDialog: true,
      originalTopic: `${skill} Refresher (${skillLevel})`
    };
  } catch (error) {
    console.error('Error generating refresher syntax:', error);
    
    // Return a properly formatted ChatMessage object for the error
    return {
      id: Date.now().toString(),
      text: 'There was an error loading the refresher content. Please try again later.',
      isUser: false,
      timestamp: new Date(),
      isFromLearnDialog: true,
      originalTopic: `${skill} Refresher (${skillLevel})`
    };
  }
};

export const getSubTopics = async (skillTitle: string): Promise<string[]> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not found in environment variables!');
    }

    const prompt = `Give me up to 20  important subtopics of ${skillTitle}. Just the list nothing more. Return each subtopic on a new line without numbering or bullet points.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://rapidskilltrain.com',
        'X-Title': 'RapidSkillTrain'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Split by lines and filter out empty lines
    const topics = content
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .slice(0, 20); // Ensure max 10 topics

    return topics;
  } catch (error) {
    console.error('Error fetching sub topics:', error);
    return [
      'Basic Concepts',
      'Advanced Techniques',
      'Real-world Applications',
      'Common Patterns',
      'Best Practices',
      'Performance Optimization',
      'Debugging Tips',
      'Related Technologies'
    ]; // Fallback topics
  }
};

export interface FaqItem {
  question: string;
  answer: string;
}

export const getFaqQuestions = async (skillTopic: string, numberOfQuestions: number): Promise<FaqItem[]> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const numberQuestions = numberOfQuestions;
    
    if (!apiKey) {
      throw new Error('API key not found in environment variables!');
    }

    const prompt = `Generate the top ${numberQuestions} frequently asked questions about "${skillTopic}" with detailed answers.

IMPORTANT: Your ENTIRE response must be a valid JSON array with no additional text or explanations outside the JSON.
The response must be valid JSON that can be directly parsed with JSON.parse().

Format the response as a JSON array with objects that have "question" and "answer" keys. 
Each answer should be detailed, visually attractive, and formatted with HTML paragraphs, lists, and code examples where appropriate.

Style the content with these requirements:
1. Add an appropriate emoji at the beginning of each question (🤔, 💡, ⚡, 📊, etc.)
2. Format the text with proper HTML styling - all text should be white or light colors for dark background
3. Use <span style="color: #4dabf7;"> for highlighting important concepts (bright blue)
4. Use icons like ✅, ⚠️, 📌, 🔥, 💻, etc. to emphasize key points
5. Make code examples visually distinct and properly formatted
6. All text must be light-colored (white, light blue, etc.) to display well on dark backgrounds
7. Use <strong> tags with bright colors for emphasis
8. Ensure all code blocks are properly formatted with correct syntax highlighting

For code examples in answers, use <pre><code class="language-xxx"> tags with the appropriate language class 
from this list: language-typescript, language-javascript, language-jsx, language-tsx, language-markup, 
language-css, language-graphql, language-cpp, language-python, language-rust, language-go, language-ruby, 
language-sql, language-java, language-csharp.

Code examples must be properly indented and formatted. Each code example must start on a new line after the opening <pre><code> tag and 
include the proper closing </code></pre> tags on their own lines. Do not include extra spaces or characters outside the code itself.

The response format must be exactly like this example but with complete FAQ items:
[
  {
    "question": "🤔 What is ${skillTopic}?",
    "answer": "<p style='color: white;'>Detailed answer with <span style='color: #4dabf7;'>important concepts</span> highlighted...</p><p style='color: white;'>More explanation...</p>"
  },
  {
    "question": "💡 How do I get started with ${skillTopic}?",
    "answer": "<p style='color: white;'>✅ First, you need to...</p><ol style='color: white;'><li>Step one</li><li>Step two with <span style='color: #4dabf7;'>key concept</span></li></ol>"
  }
]

AGAIN: Return ONLY the JSON array with ${numberQuestions} maximum questions and answers. No other text, explanations, or formatting.
Make sure the answers are comprehensive, educational, visually attractive, and properly formatted with HTML tags for clarity and readability.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://rapidskilltrain.com',
        'X-Title': 'RapidSkillTrain'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001:floor',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that generates visually attractive, well-styled FAQ content in valid JSON format. Your entire response must be a valid JSON array that can be parsed directly with JSON.parse(). Do not include any text outside of the JSON array. Do not format your response as a code block with ``` markers. Just return the raw JSON array. Ensure all text has appropriate styling for dark backgrounds (light colors like white or light blue). Add relevant emojis to questions. Use bright blue (#4dabf7) for highlighting important concepts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response structure:', data);
      throw new Error('Invalid API response structure');
    }
    
    const content = data.choices[0].message.content || '';    
   
    try {
      // First, simply remove the markdown code block formatting if present
      let cleanedJson = content
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/i, '');
      
      // Try direct parse first (sometimes the response is already valid JSON)
      try {
        const parsedJson = JSON.parse(cleanedJson);
        if (Array.isArray(parsedJson) && parsedJson.length > 0) {          
          return parsedJson.slice(0, numberQuestions);
        }
      } catch (directError) {
        console.log("Direct JSON parsing failed, trying more approaches");
      }
      
      // If direct parsing failed, we'll use a completely different approach
      // that doesn't rely on parsing the entire JSON at once      
      
      // This approach skips JSON parsing entirely and just processes the response as text
      try {
        // First, let's find all the individual questions and answers in the raw text
        const faqItems = [];
        let rawText = cleanedJson;
        
        // Find question/answer pairs by looking for the question pattern
        const questionRegex = /"question":\s*"(🤔|💡|⚡|📊|🌐|🔄|📞|⏳|📦|🧰|🚦|♻️|🛡️|🌍|🔥|🎨|⚙️|📚|🧪|[^"]+)"/g;
        let questionMatch;
        let startIndex = 0;
        
        while ((questionMatch = questionRegex.exec(rawText)) !== null) {
          const questionStart = questionMatch.index;
          const questionContent = questionMatch[1];
          
          // Find the start of the answer field that follows this question
          const answerStart = rawText.indexOf('"answer":', questionStart);
          if (answerStart !== -1) {
            const answerValueStart = rawText.indexOf('"', answerStart + 9) + 1;
            if (answerValueStart !== 0) {
              // Find the end of this answer by looking for the next item or the end of the array
              // This is complex because the answer can contain escaped quotes
              let answerEnd = answerValueStart;
              let quoteFound = false;
              let escapeMode = false;
              
              while (!quoteFound && answerEnd < rawText.length) {
                const char = rawText[answerEnd];
                
                if (char === '\\' && !escapeMode) {
                  escapeMode = true;
                } else if (char === '"' && !escapeMode) {
                  quoteFound = true;
                } else {
                  escapeMode = false;
                }
                
                answerEnd++;
              }
              
              if (quoteFound) {
                // Extract the answer content and unescape it
                let answerContent = rawText.substring(answerValueStart, answerEnd - 1);
                
                // Clean up common escaping issues in the answer
                answerContent = answerContent
                  .replace(/\\"/g, '"')  // Replace escaped quotes
                  .replace(/\\n/g, '\n') // Replace escaped newlines
                  .replace(/\\t/g, '\t') // Replace escaped tabs
                  .replace(/\\{2,}/g, '\\'); // Replace multiple backslashes
                
                // Add the question and answer pair to our results
                faqItems.push({
                  question: questionContent,
                  answer: answerContent
                });
                
                // Continue from after this answer
                startIndex = answerEnd;
              }
            }
          }
        }
        
        if (faqItems.length > 0) {          
          return faqItems.slice(0, numberQuestions);
        }
      } catch (textProcessingError) {
        console.log("Text processing approach failed", textProcessingError);
      }
      
      // Try a more targeted approach for problematic JSON - focus on one item at a time
      try {
        
        // Find the array section
        const startBracket = cleanedJson.indexOf('[');
        const endBracket = cleanedJson.lastIndexOf(']');
        
        if (startBracket !== -1 && endBracket !== -1 && startBracket < endBracket) {
          const arrayContent = cleanedJson.substring(startBracket + 1, endBracket);
          
          // Split into individual objects - find each complete {...} object
          const items = [];
          let depth = 0;
          let startPos = 0;
          let inString = false;
          let escapeNext = false;
          
          for (let i = 0; i < arrayContent.length; i++) {
            const char = arrayContent[i];
            
            // Handle string mode and escaping
            if (char === '"' && !escapeNext) {
              inString = !inString;
            } else if (char === '\\' && inString) {
              escapeNext = true;
              continue;
            }
            
            // Only count braces when not inside a string
            if (!inString) {
              if (char === '{') {
                if (depth === 0) {
                  startPos = i;
                }
                depth++;
              } else if (char === '}') {
                depth--;
                // When we find a complete object, try to parse it
                if (depth === 0) {
                  try {
                    const objStr = arrayContent.substring(startPos, i + 1);
                    const cleanedStr = objStr
                      .replace(/\\"/g, '"')
                      .replace(/\\n/g, '\\n')
                      .replace(/\\t/g, '\\t');
                    
                    const item = JSON.parse(cleanedStr);
                    if (item.question && item.answer) {
                      items.push(item);
                    }
                  } catch (err) {
                    // Silently continue if this object can't be parsed
                  }
                }
              }
            }
            
            escapeNext = false;
          }
          
          if (items.length > 0) {            
            return items.slice(0, numberQuestions);
          }
        }
      } catch (itemParseError) {
        console.log("Individual object parsing failed", itemParseError);
      }
      
      // Ultimate fallback - manually extract question and answer content using regex pattern matching
      try {
        const extractedItems = [];
        const pattern = /"question"\s*:\s*"([^"]+)"[^}]*"answer"\s*:\s*"([^"]*)"/g;
        let match;
        
        // This regex approach might catch partial items, but it's better than nothing
        while ((match = pattern.exec(cleanedJson)) !== null) {
          if (match[1] && match[2]) {
            extractedItems.push({
              question: match[1].replace(/\\"/g, '"'),
              answer: match[2].replace(/\\"/g, '"')
            });
          }
        }
        
        if (extractedItems.length > 0) {          
          return extractedItems.slice(0, numberQuestions);
        }
      } catch (regexError) {
        console.log("Regex fallback failed", regexError);
      }
      
      // If all parsing attempts fail, provide a fallback response
      console.log("All JSON parsing attempts failed. Using fallback response.");
      return [
        { 
          question: `🤔 What is ${skillTopic}?`, 
          answer: "<p style='color: white;'>Sorry, we couldn't parse the detailed information for this topic. Please try again later.</p>"
        }
      ];
    } catch (error) {
      console.error('Error in JSON parsing attempts:', error);
      return [
        { 
          question: `🤔 What is ${skillTopic}?`, 
          answer: "<p style='color: white;'>Sorry, we couldn't parse the detailed information for this topic. Please try again later.</p>"
        }
      ];
    }
  } catch (error) {
    console.error('Error fetching FAQ questions:', error);
    return [
      { 
        question: `🤔 What is ${skillTopic}?`, 
        answer: "<p style='color: white;'>Sorry, we couldn't load the detailed information for this topic. Please try again later.</p>"
      }
    ]; // Fallback FAQs
  }
};

// Coder Test AI call
export const getCoderTestQuestion = async (language: string, level: string, previousQuestions: string[] = []): Promise<string> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) throw new Error('API key not found in environment variables!');

    // Map special language cases to syntax highlighting languages
    const getSyntaxLanguage = (lang: string): string => {
      switch (lang.toLowerCase()) {
        case 'react': return 'javascript'; // React uses JSX/JavaScript syntax
        case '.net': return 'csharp'; // .NET typically uses C# syntax
        case 'csharp': return 'csharp';
        case 'javascript': return 'javascript';
        case 'typescript': return 'typescript';
        case 'python': return 'python';
        case 'java': return 'java';
        case 'cpp': return 'cpp';
        case 'go': return 'go';
        case 'ruby': return 'ruby';
        default: return lang.toLowerCase();
      }
    };

    const syntaxLanguage = getSyntaxLanguage(language);

    // Build the base prompt
    let prompt = `Give me a random LeetCode style coding question for programming language ${language} at ${level} skill level.

Create an appropriate title for this coding test problem.  A coding test that you would
give to an interview candidate.  Example: fizz buzz, binary graph, fibonacci, anagrams,  palindrome,
chunks, permutation, trees, currency. The usual.

Then underneath provide a detailed answer with code blocks. Code must have comments.`;

    // Add previous questions avoidance logic if there are previous questions
    if (previousQuestions.length > 0) {
      prompt = `Do not use any of the questions that have already been asked. ${prompt}

Previous questions: ${previousQuestions.join('\n\n---\n\n')}`;
    }

    prompt += `

Format the response in this exact HTML structure:

<div class="coding-question-container">
    <div class="title-section">
        <h2>Title - [Your creative and descriptive title for this coding problem]</h2>
    </div>
    <div class="question-section">
        <h3>Coding Challenge</h3>
        <div class="problem-statement">
            [Problem description here - make it clear and detailed]
        </div>
        <div class="requirements">
            <h4>Requirements:</h4>
            <ul>
                <li>[Requirement 1]</li>
                <li>[Requirement 2]</li>
                <li>[Requirement 3]</li>
            </ul>
        </div>
        <div class="function-signature">
            <h4>Function Signature:</h4>
            <pre><code class="language-${syntaxLanguage}">
[Sample function declaration with parameters - e.g., /**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

var twoSum = function(nums, target) { }; ]
            </code></pre>
        </div>
        <div class="examples">
            <h4>Example:</h4>
            <pre><code class="language-${syntaxLanguage}">
Input: [example input]
Output: [example output]
Explanation: [brief explanation - keep under 80 characters per line]
            </code></pre>
        </div>
    </div>
    
    <div class="tips-section" style="display: none;">
        <h3>Tips & Hints</h3>
        <div class="hints">
            <h4>Approach Hints:</h4>
            <ul>
                <li>[Hint 1 - guide thinking without giving away solution]</li>
                <li>[Hint 2 - suggest data structure or pattern to consider]</li>
                <li>[Hint 3 - edge case to think about]</li>
            </ul>
        </div>
        <div class="strategy">
            <h4>Problem-Solving Strategy:</h4>
            <p>[General strategy guidance - help think through the problem step by step]</p>
        </div>
        <div class="common-pitfalls">
            <h4>Common Pitfalls:</h4>
            <ul>
                <li>[Pitfall 1 - common mistake to avoid]</li>
                <li>[Pitfall 2 - edge case consideration]</li>
            </ul>
        </div>
    </div>
    
    <div class="answer-section" style="display: none;">
        <h3>Solution</h3>
        <div class="approach">
            <h4>Approach:</h4>
            <p>[Concise explanation of the approach - 2-3 short sentences max]</p>
        </div>
        <div class="solution-code">
            <h4>Implementation:</h4>
            <pre><code class="language-${syntaxLanguage}">
[Complete solution code with detailed comments]
            </code></pre>
        </div>
        <div class="complexity">
            <h4>Complexity Analysis:</h4>
            <p><strong>Time Complexity:</strong> [time complexity]</p>
            <p><strong>Space Complexity:</strong> [space complexity]</p>
        </div>
        <div class="explanation">
            <h4>Step-by-step Explanation:</h4>
            <ul>
                <li>[Step 1 - keep concise, under 80 chars]</li>
                <li>[Step 2 - keep concise, under 80 chars]</li>
                <li>[Step 3 - keep concise, under 80 chars]</li>
            </ul>
        </div>
    </div>
</div>

Important guidelines:
1. Create a clear, descriptive title that reflects the problem's core concept
2. Title should be in format: "Title - [Problem Name]" (e.g., "Title - Two Sum Problem")
3. Make the problem appropriate for ${level} level (${level === 'basic' ? 'focus on fundamental concepts like arrays, strings, basic loops' : 
  level === 'intermediate' ? 'include moderate complexity with common data structures and algorithms' :
  level === 'average' ? 'use standard algorithmic patterns with moderate complexity' :
  level === 'tough' ? 'include challenging problems requiring advanced problem-solving skills' :
  level === 'advanced' ? 'create complex problems with advanced algorithms, data structures, and optimization techniques' :
  'include more complex algorithms, data structures, optimization'})
2. Use proper ${language} syntax in code examples
3. All code must be wrapped in <pre><code class="language-${syntaxLanguage}"> tags
4. Include detailed comments in the solution code
5. Make the problem realistic and practical
6. Content will be displayed on a dark background, use light colors for text
7. Keep explanations clear and educational
8. Do not use backticks or markdown formatting
9. Use only the supported language classes: language-javascript, language-typescript, language-python, language-java, language-csharp, language-cpp, language-go, language-ruby
10. IMPORTANT: Keep all text lines under 80 characters to prevent horizontal scrolling
11. Break long sentences into shorter ones for better readability
12. Use concise explanations - prioritize clarity over lengthy descriptions
13. Make explanation section easy to follow but also very indepth and detailed
14. Tips section should provide helpful hints without revealing the solution
15. Focus tips on problem-solving approach and common considerations
16. IMPORTANT: Include a sample function declaration with parameters in the Function Signature section (e.g., "var twoSum = function(nums, target) { };" for JavaScript, "def two_sum(nums, target):" for Python, etc.)`;

const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/russelltchang/autodidactic',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001:floor',
        temperature: 0.8,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;
    
    if (content) {
      content = content.replace(/^```html\s*/i, '');
      content = content.replace(/```\s*$/, '');
      content = content.replace(/`/g, '');
      content = content.trim();
    }
    
    return content;
  } catch (error) {
    console.error('Error getting coder test question:', error);
    throw error;
  }
};


