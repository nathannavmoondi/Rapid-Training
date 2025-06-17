export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

class ChatService {
  async respondChat(message: string, skill: string): Promise<ChatMessage> {
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
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
          messages: [
            {              role: "system",
              content: `You are a helpful assistant focused on ${skill}. Only answer questions related to ${skill}. If the question is not related to ${skill}, politely redirect the user to ask about ${skill} instead.

When providing code examples or explanations:
1. All code snippets MUST be wrapped in <pre><code class="language-xxx">...code here...</code></pre> tags.
2. For "language-xxx", use ONLY these supported languages:
   - language-typescript
   - language-javascript
   - language-markup
   - language-css
   - language-graphql
   - language-python
   - language-java
   - language-csharp
3. Indent code properly inside the code block.
4. Make code examples practical, focused, and properly formatted.
5. Never use markdown code blocks, always use the HTML structure above.
6. Choose the most appropriate language class for the code being shown.`
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'No response received';

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
