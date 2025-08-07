// promptService.ts - Handles generation of prompts for AI service calls

export const getQuestionFormatPrompt = (
  language: string,
  skillDescription: string,
  level: string,
  previousQuizzes?: string[]
): string => {
  var languageprompt = `Return all text in this language: ${language}.  `;
  var prompt = languageprompt;
    
  prompt += `I'm creating a ${skillDescription} question for a job applicant.  
  Give me a completely new random ${level} difficulty ${skillDescription} question on a random topic.

  Make the question an open ended type question the candidate can talk about the solution.
  Example how, why, when, etc. type questions rather than code questions.
  Make sure to format the question with good spacing and readability:
- Use paragraphs with blank lines between them
- Break down long scenarios into smaller parts
- For bullet points or lists of requirements, use HTML <ul> and <li> tags.
- Keep the main question clear and separate

Do not include the word html and GRAVE ACCENT in the answer.
Each question should be different topic from previous question.  Ask a random topic each time. 
Content will be displayed on a dark background and that it should only use light colors for text.
If option is not a code fragment then remove the <pre><code> tags.
Format the response in this exact HTML structure:

<div class="question-container">
    <div class="question">
        [Your question text here. If the question includes a code snippet, format it like this: <pre><code class="language-javascript">const snippet = "example";</code></pre> within the question text. Ensure the class attribute is one of the supported languages listed below.]
    </div>
    <div class="answer-box">
     <div class="quiz-status"/>
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
14. Try not to have lines longer than 80 characters for better readability.`;

  prompt += `  Also!, quiz can't be similar to these previous ${previousQuizzes?.length} quizzes: ${previousQuizzes ? previousQuizzes.join(', Next Quiz:  ') : 'none'}.`;
  
  return prompt;
};
