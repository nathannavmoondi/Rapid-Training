

export const requestSqlStatement = async (description: string, table: string): Promise<string> => {
  try {    // Try different environment variable formats since Vite and CRA handle them differently
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    // Get topics for the skill
    //const { getSkillTopics } = require('./skillsService');
    //const topics = getSkillTopics(skillDescription);

    const callOpenRouter = async () => {
      if (!apiKey) {
        throw new Error('API key not found in environment variables!');
      }      var prompt = `This is the table structure for customers:
      
    CustomerID: string;        # Unique identifier for each customer
    CompanyName: string;       # Name of the customer's company
    ContactName?: string;      # Full name of the contact person (this contains both first and last names)
    ContactTitle?: string;     # Job title of the contact person
    Address?: string;         # Street address
    City?: string;           # City name
    Region?: string;         # State or region
    PostalCode?: string;     # Postal/ZIP code
    Country?: string;        # Country name
    Phone?: string;          # Phone number
    Fax?: string;           # Fax number

    Example queries and their SQL:
    "show me customers from Germany" -> SELECT * FROM customers WHERE Country = 'Germany'
    "show me customers named Anders" -> SELECT * FROM customers WHERE ContactName LIKE '%Anders%'
    
    Now, give me the SQL statement for this prompt: "${description}"
    
    Requirements:
    1. Do not add backticks in the response
    2. Do not add the word 'sql' in front of the statement
    3. Use the table name "${table}"
    4. If searching for a name, use ContactName with LIKE
    5. Return only the SQL statement with no additional text
    6. For every text field, use case-insensitive search
      
      `;
  
    

  // 1. The response should be pure HTML content, without any \`style\` tags or inline style attributes. All styling will be handled by the existing site's CSS.

 

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
              content: "You are a SQL expert that converts English descriptions into precise SQL queries. For name searches, always use LIKE with wildcards to match partial names. Never return just 'SELECT *' without proper WHERE conditions if the prompt asks for specific data. Always consider case-insensitive searches for text fields." 
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
