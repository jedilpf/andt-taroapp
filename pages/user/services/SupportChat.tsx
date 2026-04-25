
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Plus, Image, Camera, MoreHorizontal } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'agent';
    time: string;
}

export const SupportChatPage = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "您好，安电通客服为您服务。", sender: 'agent', time: '10:00' },
        { id: 2, text: "请问有什么可以帮您？", sender: 'agent', time: '10:00' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        
        const newMsg: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsTyping(true);

        // Mock agent reply
        setTimeout(() => {
            const reply: Message = {
                id: Date.now() + 1,
                text: "收到您的问题，正在为您查询，请稍候...",
                sender: 'agent',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
            setIsTyping(false);
        }, 1500);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 relative overflow-hidden">
            {/* Header with high Z-Index */}
            <div className="bg-green-600 p-4 flex items-center justify-between shadow-sm text-white shrink-0 z-[100] relative">
                <div className="flex items-center space-x-3">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-white/20 active:scale-95 transition-transform"><ArrowLeft size={24}/></button>
                    <div>
                        <h1 className="font-bold text-base">人工客服 007</h1>
                        <div className="flex items-center text-xs opacity-80">
                            <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1 animate-pulse"></span>
                            在线中
                        </div>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/20 rounded-full"><MoreHorizontal size={24}/></button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-0" ref={scrollRef}>
                <div className="text-center text-xs text-gray-400 my-4">今天 10:00</div>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-gray-200 ml-2' : 'bg-green-100 mr-2'}`}>
                                {msg.sender === 'user' ? (
                                    <span className="text-xs font-bold text-gray-600">我</span>
                                ) : (
                                    <span className="text-xs font-bold text-green-600">客服</span>
                                )}
                            </div>
                            {/* Bubble */}
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                                msg.sender === 'user' 
                                ? 'bg-green-500 text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex flex-row items-center">
                             <div className="w-8 h-8 rounded-full bg-green-100 mr-2 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-green-600">客服</span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area - High Z-Index */}
            <div className="bg-white p-3 border-t border-gray-200 pb-safe shrink-0 z-[100] relative">
                <div className="flex items-end space-x-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><Plus size={24}/></button>
                    <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center">
                        <input 
                            type="text" 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="请输入您的问题..."
                            className="w-full bg-transparent outline-none text-sm max-h-24"
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                    </div>
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className={`p-2 rounded-full transition-all ${input.trim() ? 'bg-green-600 text-white shadow-md active:scale-95' : 'bg-gray-200 text-gray-400'}`}
                    >
                        <Send size={20} className={input.trim() ? 'ml-0.5' : ''}/>
                    </button>
                </div>
                {/* Quick Actions (Mock) */}
                <div className="flex space-x-4 mt-3 px-2">
                    <button className="text-gray-500 flex flex-col items-center space-y-1">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                            <Image size={20}/>
                        </div>
                        <span className="text-[10px]">图片</span>
                    </button>
                    <button className="text-gray-500 flex flex-col items-center space-y-1">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                            <Camera size={20}/>
                        </div>
                        <span className="text-[10px]">拍摄</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
