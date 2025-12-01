import React, { useState, useRef, useEffect } from 'react';

// Import your data files
import {
  departments,
  emaDepartments,
  polDepartments,
  services,
  emaServices,
  polServices
} from '../data/data';

import {
  processSteps,
  programDescriptions,
  programDurations,
  programSubjects,
  fyfSubjects,
  administratorInfo,
  hodInfo,
  getCodeDescription,
  getProgramDuration,
  getProgramSubjects,
  getProcessSteps,
  supportedModules,
  eucContact,
  hodDepartment,
  administrationInfo,
  ictData
} from '../data/processData';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'Hello! I am the TUT ICT Faculty assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const apiKey = import.meta.env.VITE_APP_DEEPSEEK_API_KEY || '';
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Improved system prompt with better formatting instructions
  const systemPrompt = `You are a helpful assistant for Tshwane University of Technology (TUT) ICT Faculty. Your role is to provide accurate, clear, and well-structured information to students and staff.

IMPORTANT FORMATTING RULES:
- Use clear, natural language without any markdown formatting
- Do NOT use asterisks (*), bullet points, or any other symbols for lists
- Structure information using clear line breaks and natural numbering
- Use descriptive headings and proper paragraph breaks
- Make information easy to read and scan

AVAILABLE INFORMATION:

DEPARTMENTS:
Main Campus: ${departments.map(dept => `${dept.name} (${dept.codes.join(', ')}) - ${dept.buildingNumber}`).join('; ')}
Emalahleni Campus: ${emaDepartments.map(dept => `${dept.name} (${dept.codes.join(', ')}) - ${dept.buildingNumber}`).join('; ')}
Polokwane Campus: ${polDepartments.map(dept => `${dept.name} (${dept.codes.join(', ')}) - ${dept.buildingNumber}`).join('; ')}

SERVICES:
Available services include: ${[...services, ...polServices, ...emaServices].map(s => s.title).filter((v, i, a) => a.indexOf(v) === i).join(', ')}

PROGRAMS:
Program codes and descriptions are available for all ICT qualifications.

PROCESSES:
Step-by-step guidance for various academic processes and services.

CONTACT INFORMATION:
Department contacts, administration details, and support services.

RESPONSE GUIDELINES:

1. Be clear and concise
2. Structure information logically
3. Use natural numbering for steps (1, 2, 3...)
4. Separate different sections with line breaks
5. Provide complete contact details when relevant
6. Specify which campus information applies to
7. If a process has multiple steps, present them in order
8. Include relevant links when available
9. Be professional but approachable
10. If you don't have information, direct them to the appropriate contact

Example of good formatting:

For academic exclusions:

Academic Exclusion Process:

1. Check your ITS notification for exclusion details
2. Submit an appeal through EC (Electronic Campus)
3. Wait for the outcome via SASO
4. Sign the outcome letter online
5. If approved, register with your Academic Department
6. If not approved, you are excluded for one year

Contact your Academic Department for specific guidance.

Remember to always use this clean, professional formatting without any symbols.`;

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'TUT ICT ChatBot'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: 'user',
              content: inputMessage
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: assistantMessage,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I am the TUT ICT Faculty assistant. How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div>
                <h3 className="font-semibold text-sm">TUT ICT Assistant</h3>
                <p className="text-xs opacity-90">How can I help you?</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={clearChat}
                className="text-white hover:text-gray-200 transition-colors p-1"
                title="Clear chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 max-w-[85%] border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                disabled={isLoading}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center min-w-[40px]"
                title="Send message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Ask about programs, services, or processes
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;