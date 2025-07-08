import { YoutubeTranscript, TranscriptResponse } from 'youtube-transcript';

export interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

export interface VideoInfo {
  title: string;
  videoId: string;
  transcript: TranscriptItem[];
}

/**
 * Extract video ID from various YouTube URL formats
 */
export const extractVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Get YouTube video transcript using youtube-transcript library
 */
export const getVideoTranscript = async (videoUrl: string): Promise<TranscriptItem[]> => {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    console.log('Fetching transcript for video ID:', videoId);
    
    // Fetch transcript using youtube-transcript library
    const transcriptData: TranscriptResponse[] = await YoutubeTranscript.fetchTranscript(videoId);
    
    return transcriptData.map(item => ({
      text: item.text,
      duration: item.duration,
      offset: item.offset
    }));
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw new Error(`Failed to fetch transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get video title from YouTube Data API (requires API key)
 * Falls back to extracting from video ID if API is not available
 */
export const getVideoTitle = async (videoUrl: string): Promise<string> => {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // For now, we'll use a generic title since we don't have YouTube Data API key set up
    // In a production environment, you would use the YouTube Data API here
    return `YouTube Video (${videoId})`;
  } catch (error) {
    console.error('Error fetching video title:', error);
    return 'YouTube Video';
  }
};

/**
 * Get video information including title and transcript
 */
export const getVideoInfo = async (videoUrl: string): Promise<VideoInfo> => {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    console.log('Fetching video info for:', videoUrl);
    
    // Get transcript and title in parallel
    const [transcript, title] = await Promise.all([
      getVideoTranscript(videoUrl),
      getVideoTitle(videoUrl)
    ]);

    return {
      title,
      videoId,
      transcript
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
};

/**
 * Format transcript into readable text
 */
export const formatTranscript = (transcript: TranscriptItem[]): string => {
  return transcript
    .map(item => item.text.trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Get key points from transcript (first 20 segments for summary)
 */
export const getKeyTranscriptPoints = (transcript: TranscriptItem[]): string => {
  const keyPoints = transcript
    .slice(0, Math.min(20, transcript.length))
    .map(item => item.text.trim())
    .filter(text => text.length > 10) // Filter out very short segments
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  return keyPoints;
};

// --- YouTube AI Summary and Quiz Generation ---
/**
 * Generate a detailed summary and key points for a YouTube video using transcript and AI
 */
export const getYoutubeSummaryAndTranscript = async (youtubeUrl: string): Promise<string> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables!');
    }

    // Get video info (title, transcript)
    const videoInfo = await getVideoInfo(youtubeUrl);
    const fullTranscript = formatTranscript(videoInfo.transcript);
    const keyPoints = getKeyTranscriptPoints(videoInfo.transcript);

    const prompt = `I have the following YouTube video data:

Video Title: ${videoInfo.title}
Video URL: ${youtubeUrl}

Full Transcript:
${fullTranscript}

Key Transcript Points:
${keyPoints}

Based on this real video data, please create a comprehensive summary and organize the key transcript points.

Return the response in this format:
<div class="video-summary">
  <div class="video-title">
    <h3>${videoInfo.title}</h3>
  </div>
  <div class="summary-section">
    <h4>Summary:</h4>
    <p>[Create a detailed summary based on the actual transcript content]</p>
  </div>
  <div class="transcript-section">
    <h4>Key Transcript Points:</h4>
    <p>[Organize the most important educational points from the actual transcript]</p>
  </div>
</div>

Focus on educational content and key learning points that would be useful for creating quiz questions.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'YouTube Summary Generator'
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

    return content || 'No summary and transcript generated. Please try again.';

  } catch (error) {
    console.error('Error generating YouTube summary and transcript:', error);
    // If there's an error with transcript fetching, provide a helpful error message
    if (error instanceof Error && error.message.includes('Failed to fetch transcript')) {
      return `<div class="video-summary">
        <div class="error-message">
          <h4>Error:</h4>
          <p>Unable to fetch transcript for this video. This may be because:</p>
          <ul>
            <li>The video has no captions/subtitles available</li>
            <li>The video is private or restricted</li>
            <li>YouTube has disabled transcript access for this video</li>
          </ul>
          <p>Please try with a different video that has captions available.</p>
        </div>
      </div>`;
    }
    return 'There was an error generating the summary and transcript. Please try again later.';
  }
};

/**
 * Generate quiz questions from a YouTube video summary and transcript using AI
 */
export const getYoutubeQuiz = async (youtubeUrl: string, summaryAndTranscript?: string): Promise<string> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('API key not found in environment variables!');
    }

    let prompt: string;
    if (summaryAndTranscript) {
      prompt = `I have a YouTube video URL: ${youtubeUrl}

The summary and transcript of the video follows:
${summaryAndTranscript}

Based on the actual summary and transcript above (which was extracted from the real video), create 3-5 comprehensive quiz questions that test understanding of the key concepts covered in this video.`;
    } else {
      // Fallback to original behavior if no summary provided
      prompt = `I have a YouTube video URL: ${youtubeUrl}

Please:

1. Extract the video ID from the URL to understand the context
2. Create a summary of that video and transcript.
3. Based on the summary and transcript, create 3-5 quiz questions`;
    }

    prompt += `

- Format the quiz in clean HTML using this structure:

<div class="youtube-quiz">
  <div class="quiz-header">
    <h2>Quiz: YouTube Video Knowledge Test</h2>
    <p>Test your knowledge from this YouTube video</p>
  </div>
  
  <div class="question-item">
    <div class="question">
      <h3>Question 1: [Question text based on video content]</h3>
    </div>
    <div class="options">
      <div class="option">A) [Option A]</div>
      <div class="option">B) [Option B]</div>
      <div class="option">C) [Option C]</div>
      <div class="option">D) [Option D]</div>
    </div>
    <div class="answer-section">
      <div class="correct-answer">
        Correct Answer: [Letter]
      </div>
      <div class="explanation">
        <p>[Detailed explanation referencing specific content from the video]</p>
        <p>[Additional context and learning points]</p>
      </div>
    </div>
  </div>
  
  <div class="question-item">
    <div class="question">
      <h3>Question 2: [Question text based on video content]</h3>
    </div>
    <div class="options">
      <div class="option">A) [Option A]</div>
      <div class="option">B) [Option B]</div>
      <div class="option">C) [Option C]</div>
      <div class="option">D) [Option D]</div>
    </div>
    <div class="answer-section">
      <div class="correct-answer">
        Correct Answer: [Letter]
      </div>
      <div class="explanation">
        <p>[Detailed explanation referencing specific content from the video]</p>
        <p>[Additional context and learning points]</p>
      </div>
    </div>
  </div>

  [Continue with 3-5 total questions]
</div>

Important formatting rules:
1. Use clean HTML structure without markdown
2. Base questions on actual content from the video summary and transcript provided
3. Provide detailed explanations for each answer that reference specific video content
4. Use light colors for text (content will be displayed on dark background)
5. Make questions challenging but fair, testing comprehension of key concepts
6. Ensure questions cover different aspects/topics mentioned in the video
7. Make explanations educational and informative`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'YouTube Quiz Generator'
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
        max_tokens: 3000
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

    return content || 'No quiz generated. Please try again.';

  } catch (error) {
    console.error('Error generating YouTube quiz:', error);
    return 'There was an error generating the quiz. Please try again later.';
  }
};