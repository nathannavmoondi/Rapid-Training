export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

class ChatService {
  async sendMessage(message: string): Promise<ChatMessage> {
    // Simulate response delay
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
