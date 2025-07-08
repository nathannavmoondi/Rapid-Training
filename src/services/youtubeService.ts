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