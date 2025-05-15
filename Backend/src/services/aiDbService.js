"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSqlStatement = void 0;
const requestSqlStatement = (description, table) => __awaiter(void 0, void 0, void 0, function* () {
    try { // Try different environment variable formats since Vite and CRA handle them differently
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        // Get topics for the skill
        //const { getSkillTopics } = require('./skillsService');
        //const topics = getSkillTopics(skillDescription);
        const callOpenRouter = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!apiKey) {
                throw new Error('API key not found in environment variables!');
            }
            var prompt = `This is the table structure for customers:
      
    CustomerID: string;
    CompanyName: string;
    ContactName?: string;
    ContactTitle?: string;
    Address?: string;
     City?: string;
    Region?: string;
    PostalCode?: string;
    Country?: string;
    Phone?: string;
    Fax?: string;

      Give me the sql statement for this prompt :  "${description}".  

      1. Do not add backticks in the response.
      2. Do not add the words sql in front of the statement.
      3. Use the table name "${table}" in the sql statement.
      
      `;
            console.log("Prompt: ", prompt);
            // 1. The response should be pure HTML content, without any \`style\` tags or inline style attributes. All styling will be handled by the existing site's CSS.
            const response = yield fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`, // Replace with your actual API key
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ///works: deepseek/deepseek-prover-v2"
                    //:floor optimizes prices
                    model: "google/gemini-2.0-flash-001:floor", // Using GPT-3.5-Turbo for faster responses
                    //model: 'gpt-3.5-turbo',
                    temperature: 0.9, // Increase randomness
                    messages: [{
                            role: "system",
                            content: "I am converting english text to sql statement.."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            });
            const data = yield response.json();
            let content = (_c = (_b = (_a = data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
            // Clean up any markdown code blocks and format them properly
            if (content) {
                // First clean up the outer wrapper if it exists
                content = content.replace(/^```html\s*/i, '');
                content = content.replace(/```\s*$/, '');
                // Convert any markdown code blocks within the content to proper HTML
                content = content.replace(/```typescript\s*\n?([\s\S]*?)\n?```/g, (_, code) => {
                    return `<pre><code class="language-typescript">${code.trim()}</code></pre>`;
                });
                content = content.trim();
            }
            return content;
        });
        var ret = yield callOpenRouter();
        return ret;
    }
    catch (error) {
        console.error('Error connecting to AI service:', error);
        return 'There was an error processing your request. Please try again later.';
    }
});
exports.requestSqlStatement = requestSqlStatement;
