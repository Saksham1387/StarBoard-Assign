import { useState } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
interface ChatBotProps {
  projectId: string;
}

export const ChatBot = ({ projectId }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "How can I help you today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsTyping(true);

    try {
      const response = await fetch('http://15.207.248.99:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'user123',
          project_id: projectId,
          message: userMessage,
        }),
      });

      const data = await response.json();
      
      // Simulate typing delay
      setTimeout(() => {
        setMessages(prev => [...prev, { text: data.answer || 'Sorry, I could not process your request.', isUser: false }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'Sorry, there was an error processing your request.', isUser: false }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl w-[500px] h-[500px] flex flex-col border overflow-hidden">
          {/* Header */}
          <div className="bg-black p-4 flex justify-between items-center text-white ">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Assistant</h3>
                <p className="text-sm text-gray-300">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                  message.isUser 
                    ? 'bg-black text-white ' 
                    : 'bg-white text-black '
                }`}>
                  {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl p-3 shadow-sm border-2 ${
                    message.isUser
                      ? 'bg-black text-white  rounded-br-md'
                      : 'bg-white text-black  rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">
                  <Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>
                  </p>
                  
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-white text-black border-2 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-md p-3 shadow-sm border-2 ">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t-2 ">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border-2  rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-black text-white p-3 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-black"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat toggle button - Fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group border-2 border-black hover:bg-gray-800"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
      </button>
    </div>
  );
};