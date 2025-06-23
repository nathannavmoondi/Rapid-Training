export const getYoutubeResources = async (skillDescription: string): Promise<string> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('API key not found in environment variables!');
    }

    const prompt = `For this topic "${skillDescription}" give me the top 5 tutorial/overview courses. Give me youtube embed html. Underneath it give me a nice quick title and summary of youtube. Format it nicely.

Format the response in clean HTML with the following structure:
<div class="youtube-resources">
  <div class="resource-item">
    <div class="video-embed">
      [YouTube embed iframe HTML]
    </div>
    <div class="video-info">
      <h3>[Video Title]</h3>
      <p>[Brief summary of what the video covers]</p>
    </div>
  </div>
  [Repeat for each of the 5 videos]
</div>

Make sure to use real YouTube video IDs for ${skillDescription} tutorials and provide accurate descriptions.`;

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


