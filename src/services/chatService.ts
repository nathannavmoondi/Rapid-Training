export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isFromLearnDialog?: boolean;
  originalTopic?: string;
  isViewingQuizContent?: boolean;
  isSavedContent?: boolean;
  savedContentType?: string;
}

class ChatService {

   getFirstPromptInRightLanguage(skill: string, targetLanguage: string): string {
    // Simple mock translation logic (replace with actual API call)
    //in this block if language is english, return "Hi. I'm Mr. Buddy. Do you have any questions about " + (chatboxSkill || 'this topic') + "?"
    //now if spanish return the spanish translation
    if (targetLanguage.toLowerCase() === 'french') {
      return `Bonjour. Je suis Mr. Buddy. Avez-vous des questions sur ${skill}?`;
    }

    if (targetLanguage.toLowerCase() === 'spanish') {
      return `Hola. Soy Mr. Buddy. ¿Tienes alguna pregunta sobre ${skill}?`;
    }
    
    return `Hi. I'm Mr. Buddy. Do you have any questions about ${skill}?`;    
    
  }

  async respondChat(message: string, skill: string, conversationHistory: ChatMessage[] = [], language: string = 'english'): Promise<ChatMessage> {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not found in environment variables!');
      }

      // Convert conversation history to AI format
      const conversationMessages = conversationHistory
        .filter(msg => msg.text !== "Thinking...") // Exclude loading messages
        .map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        }));

      // Add the current message
      conversationMessages.push({
        role: "user",
        content: message
      });

      const restriction = "Only answer questions related to ${skill}. If the question is not related to ${skill}, politely redirect the user to ask about ${skill} instead."

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
            {              role: "system",
              content: `You are a helpful assistant focused on ${skill}. Your name is Mr. Buddy. ${restriction}  Do answer the question if it is regarding the content that was given earlier, like a quesetion on a code, etc.

IMPORTANT: Do NOT start your responses with greetings, introductions, or phrases like "Hello", "Hi", "As Mr. Buddy", etc. Get straight to answering the question directly.

When providing code examples or explanations:
1. All code snippets MUST be wrapped in <pre><code class="language-xxx">...code here...</code></pre> tags.
2. ANY JSX, HTML, or markup code MUST be put inside code blocks using language-markup.
3. For "language-xxx", use ONLY these supported languages:
   - language-typescript
   - language-javascript
   - language-markup (for HTML, JSX, XML)
   - language-css
   - language-graphql
   - language-python
   - language-java
   - language-csharp
4. NEVER show JSX or HTML code outside of code blocks.
5. If you need to reference HTML tags in explanations, use descriptive text instead of showing the actual tags.
6. Indent code properly inside the code block.
7. Make code examples practical, focused, and properly formatted.
8. Never use markdown code blocks, always use the HTML structure above.
9. Choose the most appropriate language class for the code being shown.
10. If ${skill} is not a programming language, do not use CODE ELEMENTS OR BLOCKS AT ALL!!
11. Return response in the language requested.`
            },
            ...conversationMessages // Include conversation history
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || 'No response received';

      // Remove specific greeting lines and introductions
      aiResponse = aiResponse.replace(/Hello!\s*I\s*am\s*Mr\.\s*Buddy\.\s*I'm\s*here\s*to\s*help\s*with\s*your\s*.*?\s*questions\./gi, '');
      aiResponse = aiResponse.replace(/^(Hello!?\s*|Hi!?\s*|Greetings!?\s*)/gim, '');
      aiResponse = aiResponse.replace(/^As\s+Mr\.\s*Buddy,?\s*/gim, '');
      aiResponse = aiResponse.replace(/^I'm\s+here\s+to\s+help.*?[\.\!]\s*/gim, '');
      
      // Remove all backticks
      aiResponse = aiResponse.replace(/`+/g, '');

      return {
        id: Math.random().toString(36).substring(7),
        text: aiResponse.trim(),
        isUser: false,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in chat response:', error);
      return {
        id: Math.random().toString(36).substring(7),
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
    }
  }

   async explainQuizInDepth(skill: string, quizHtml: string, language: string = 'english'): Promise<ChatMessage> {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not found in environment variables!');
      }

      const prompt = `Explain the answer of this quiz in depth. The topic is ${skill}. 
      At end link appropriate learning links about this topic.  The quiz is: ${quizHtml}`;

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
              content: `You are a helpful assistant focused on ${skill}. Provide an in-depth explanation of the quiz answer. Include relevant concepts, background information, and practical applications.

IMPORTANT: Do NOT start your responses with greetings, introductions, or phrases like "Hello", "Hi", "As Mr. Buddy", etc. Get straight to explaining the answer directly.

When providing code examples or explanations:
1. All code snippets MUST be wrapped in <pre><code class="language-xxx">...code here...</code></pre> tags.
2. ANY JSX, HTML, or markup code MUST be put inside code blocks using language-markup.
3. For "language-xxx", use ONLY these supported languages:
   - language-typescript
   - language-javascript
   - language-markup (for HTML, JSX, XML)
   - language-css
   - language-graphql
   - language-python
   - language-java
   - language-csharp
4. NEVER show JSX or HTML code outside of code blocks.
5. If you need to reference HTML tags in explanations, use descriptive text instead of showing the actual tags.
6. Indent code properly inside the code block.
7. Make code examples practical, focused, and properly formatted.
8. Never use markdown code blocks, always use the HTML structure above.
9. Choose the most appropriate language class for the code being shown.
10. If ${skill} is not a programming language, do not use CODE ELEMENTS OR BLOCKS AT ALL!!
11. Do not use backticks.
12. Never start any line, list item, or point with * or - (asterisk or dash). Always use <ul> and <li> HTML tags for lists, or use icons. Strictly avoid * or - at the beginning of any line.
13. When providing further learning resources or links, always use <a href="URL" target="_blank">Link Text</a> HTML tags for each resource, so links open in a new tab.
14. Any headline or section title (such as 'Further learning resources') must be either bolded using <b> tags or wrapped in a <h1> tag.
15. Feel free to use icons or emmojis to enhance the explanation and make it more engaging. Use them sparingly and only where appropriate to clarify concepts or highlight important points.`
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || 'No response received';

      // Remove specific greeting lines and introductions
      aiResponse = aiResponse.replace(/Hello!\s*I\s*am\s*Mr\.\s*Buddy\.\s*I'm\s*here\s*to\s*help\s*with\s*your\s*.*?\s*questions\./gi, '');
      aiResponse = aiResponse.replace(/^(Hello!?\s*|Hi!?\s*|Greetings!?\s*)/gim, '');
      aiResponse = aiResponse.replace(/^As\s+Mr\.\s*Buddy,?\s*/gim, '');
      aiResponse = aiResponse.replace(/^I'm\s+here\s+to\s+help.*?[\.\!]\s*/gim, '');
      
      // Remove all backticks
      aiResponse = aiResponse.replace(/`+/g, '');
      // Remove all '* ' at the start of a line
      aiResponse = aiResponse.replace(/^\*\s+/gm, '');
      // Remove all 'html' (case-insensitive)
      aiResponse = aiResponse.replace(/html/gi, '');

      return {
        id: Math.random().toString(36).substring(7),
        text: aiResponse.trim(),
        isUser: false,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in explain quiz response:', error);
      return {
        id: Math.random().toString(36).substring(7),
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
    }
  }
  
  async explainTopicInDepth(skill: string, topic: string, language: string = 'english', isCoderTest: boolean = false, studyAndLearn: boolean = false): Promise<ChatMessage> {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not found in environment variables!');
      }

      let prompt = `Explain the answer of this quiz in depth. The topic is ${skill}. 
      At end link appropriate learning links about this topic.  The quiz is: ${topic}`;

      if (studyAndLearn) prompt = `You are an interactive tutor. The user wants to learn ${topic}, 
You are a warm, patient tutor guiding the user through a multi-step course on a topic.
The course is divided into lessons. After explaining each lesson, check for understanding and wait for the user to say "continue" or similar to proceed.
If the user requests a specific topic, switch to that lesson.
If the user just says "yes" or "okay," continue to the next lesson in the sequence automatically.
Do not overwhelm the user — keep lessons clear, simple, and concise.
At each step, encourage questions and make the user feel comfortable.You are a warm, patient tutor guiding the user through a multi-step course on a topic.
Your goal is to explain concepts clearly, use simple language, and encourage the learner every step of the way.
Before moving on, you check if they understand by asking gentle, open-ended questions.
If they seem confused, you provide additional explanations or examples.
You never rush or overwhelm.
Make the learner feel comfortable and motivated.
If the user asks for a quiz, provide it kindly and review answers with encouragement.
If the user says they cannot answer, reassure them kindly, provide the answer, then offer to continue or review.
If the user says "yes" after a check-in, expand with the next part of the lesson or ask what they want to learn next.
If the user says yes just assume they said next section and give appropriate content.`;

      var isCoderTestPrompt = isCoderTest ? ". Also feel free to offer alternate solutions to the quiz. ":  "";

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: studyAndLearn ? "openai/gpt-4.1" : "anthropic/claude-3.5-sonnet",
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant focused on ${skill}. Provide an in-depth explanation of this topic. Include relevant concepts, background information, and practical applications.

IMPORTANT: Do NOT start your responses with greetings, introductions, or phrases like "Hello", "Hi", "As Mr. Buddy", etc.
 Get straight to explaining the answer directly.  Display question before answering it.

When providing code examples or explanations:
1. All code snippets MUST be wrapped in <pre><code class="language-xxx">...code here...</code></pre> tags.
2. ANY JSX, HTML, or markup code MUST be put inside code blocks using language-markup.
3. For "language-xxx", use ONLY these supported languages:
   - language-typescript
   - language-javascript
   - language-markup (for HTML, JSX, XML)
   - language-css
   - language-graphql
   - language-python
   - language-java
   - language-csharp
4. NEVER show JSX or HTML code outside of code blocks.
5. If you need to reference HTML tags in explanations, use descriptive text instead of showing the actual tags.
6. Indent code properly inside the code block.
7. Make code examples practical, focused, and properly formatted.
8. Never use markdown code blocks, always use the HTML structure above.
9. Choose the most appropriate language class for the code being shown.
10. If ${skill} is not a programming language, do not use CODE ELEMENTS OR BLOCKS AT ALL!!
11. Do not use backticks.
12. Never start any line, list item, or point with * or - (asterisk or dash). Always use <ul> and <li> HTML tags for lists, or use icons. Strictly avoid * or - at the beginning of any line.
13. When providing further learning resources or links, always use <a href="URL" target="_blank">Link Text</a> HTML tags for each resource, so links open in a new tab.
14. Any headline or section title (such as 'Further learning resources') must be either bolded using <b> tags or wrapped in a <h1> tag.
15. Feel free to use icons or emmojis to enhance the explanation and make it more engaging. Use them sparingly and only where appropriate to clarify concepts or highlight important points.
16. If there is comments in the code, keep the comments. Also don't add too many extra blank lines.
${isCoderTestPrompt}`
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      let aiResponse = data.choices?.[0]?.message?.content || 'No response received';

      // Remove specific greeting lines and introductions
      aiResponse = aiResponse.replace(/Hello!\s*I\s*am\s*Mr\.\s*Buddy\.\s*I'm\s*here\s*to\s*help\s*with\s*your\s*.*?\s*questions\./gi, '');
      aiResponse = aiResponse.replace(/^(Hello!?\s*|Hi!?\s*|Greetings!?\s*)/gim, '');
      aiResponse = aiResponse.replace(/^As\s+Mr\.\s*Buddy,?\s*/gim, '');
      aiResponse = aiResponse.replace(/^I'm\s+here\s+to\s+help.*?[\.\!]\s*/gim, '');
      
      // Remove all backticks
      aiResponse = aiResponse.replace(/`+/g, '');
      // Remove all '* ' at the start of a line
      aiResponse = aiResponse.replace(/^\*\s+/gm, '');
      // Remove all 'html' (case-insensitive)
      aiResponse = aiResponse.replace(/html/gi, '');

      return {
        id: Math.random().toString(36).substring(7),
        text: aiResponse.trim(),
        isUser: false,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in explain quiz response:', error);
      return {
        id: Math.random().toString(36).substring(7),
        text: "I apologize, but I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
    }
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    // This method can be removed or kept as a fallback
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Math.random().toString(36).substring(7),
      text: "Hi. Thank you for the question. I will get back to you on it!",
      isUser: false,
      timestamp: new Date()
    };
  }
}

export const chatService = new ChatService();
