import { useState, useEffect, useRef } from 'react';
import { saveChatMessage, getCurrentChatHistory, createNewConversation,  loadConversation } from '../services/chatService';
import { useAuth } from '../context/AuthContext';

export default function ChatWindow() {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (currentUser) {
            const unsubscribe = getCurrentChatHistory((chatMessages) => {
                setMessages(chatMessages);
            });
            return () => unsubscribe();
        }
    }, [currentUser]);

    useEffect(() => {
        const handleNewChat = () => {
            setMessages([]);
            createNewConversation();
        };

        const handleConversationSelect = (event) => {
            const { conversationId } = event.detail;
            
            loadConversation(conversationId, (conversationMessages) => {
                setMessages(conversationMessages);
            });
          };

        window.addEventListener('newChatCreated', handleNewChat);
        window.addEventListener('conversationSelected', handleConversationSelect);
        return () => {
          window.removeEventListener('newChatCreated', handleNewChat);
        window.removeEventListener('conversationSelected', handleConversationSelect);
        };
    }, []);

    // This is demo response when we connect backend, delete this part
    const generateAIResponse = async (userMessage) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `NICxTENSOR!!`;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setIsLoading(true);

        try {
            // Demo responce, delete this also
            const aiResponse = await generateAIResponse(userMessage);
            
            await saveChatMessage(userMessage, aiResponse);
        } catch (error) {
            console.error('Error sending message:', error);
            setInputMessage(userMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#0f0f0f]">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-xl font-semibold text-white">Research Assistant</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                        <p>Start a new conversation!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className="space-y-2">
                                <div className="flex justify-end">
                                    <div className="bg-[#4C82FB] text-white p-3 rounded-lg max-w-[70%]">
                                        <p className="text-sm">{msg.message}</p>
                                    </div>
                                </div>
                                
                                {/* Demo responce, replace it */}
                                <div className="flex justify-start">
                                    <div className="bg-[#1c1c1c] text-white p-3 rounded-lg max-w-[70%]">
                                        <p className="text-sm">{msg.response}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="flex-1 p-3 rounded-md bg-[#1c1c1c] border border-gray-600 text-white
                                 focus:border-[#4C82FB] focus:outline-none disabled:opacity-50"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className="px-6 py-2 bg-[#4C82FB] text-white rounded-md 
                                 hover:bg-blue-600 transition disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}