/**
 * 安电通上门电工服务系统
 * Copyright © 2026 米枫网络科技. All rights reserved.
 * 
 * 本软件为原创开发，受中华人民共和国著作权法保护。
 * 
 * 文件名：AIChatOverlay.tsx
 * 功能描述：AI聊天悬浮组件，提供智能客服和人工客服功能
 * 创建日期：2026-02-28
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Zap, ChevronDown, Bot, Sparkles, Eye, Headphones, User, Minus, Paperclip, Mic, Minimize2, History, Smile, Image, Camera, Brain, ScanEye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { chatWithBot } from '../services/geminiService';

type ChatMode = 'AI' | 'HUMAN';
type AIModel = 'qwen' | 'deepseek' | 'doubao';

interface Message {
    id: string;
    role: 'user' | 'model' | 'agent' | 'system';
    text: string;
    timestamp: number;
    modelIcon?: React.ReactNode; // To show which model replied
}

export const AIChatOverlay = () => {
    const { role } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ChatMode>('AI');
    const [activeModel, setActiveModel] = useState<AIModel>('gemini');
    
    // Separate histories for AI and Human
    const [aiMessages, setAiMessages] = useState<Message[]>([]);
    const [humanMessages, setHumanMessages] = useState<Message[]>([]);
    
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false); // AI thinking
    const [agentTyping, setAgentTyping] = useState(false); // Human typing
    
    // Human Chat State
    const [humanConnected, setHumanConnected] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Draggable State
    const [position, setPosition] = useState({ x: 20, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [isDocked, setIsDocked] = useState(false); // New state for "shrunk" mode
    const dragStartPos = useRef({ x: 0, y: 0 });
    const buttonStartPos = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- Helper Functions ---
    const getGreeting = (model: AIModel, userRole: string) => {
        if (model === 'deepseek') {
            return "你好！我是 DeepSeek-V3 满血版。不仅懂电路维修，还能回答生活百科、逻辑推理等各种问题。请问有什么可以帮您？";
        } else if (model === 'doubao') {
            return "嗨！我是豆包 Vision。拍张照片给我，我能帮你识别电器型号、提供装修灵感哦！✨";
        } else {
             return userRole === 'ELECTRICIAN' 
                ? '师傅您好！我是技术顾问小安。遇到施工难题或需要查阅国标规范，请随时问我。'
                : '你好！我是智能管家小安。家里电路有问题？拍照或描述给我，我帮您诊断！';
        }
    };

    const getModelIcon = (model: AIModel) => {
        if (model === 'deepseek') return <Brain size={16} />;
        if (model === 'doubao') return <ScanEye size={16} />;
        return <Bot size={16} />;
    };

    // --- Initialization ---
    useEffect(() => {
        // Initial AI Greeting
        if (aiMessages.length === 0) {
            setAiMessages([{ 
                id: 'init-ai', 
                role: 'model', 
                text: getGreeting('qwen', role), 
                timestamp: Date.now(),
                modelIcon: getModelIcon('qwen')
            }]);
        }
        // Start idle timer
        resetIdleTimer();
        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [role]);

    // Listen for external open requests (e.g. from Banners)
    useEffect(() => {
        const handleOpenEvent = (e: CustomEvent) => {
            setIsOpen(true);
            setActiveTab('AI');
            if (e.detail?.model) {
                const targetModel = e.detail.model as AIModel;
                setActiveModel(targetModel);
                // Refresh chat with specific model greeting
                setAiMessages([{ 
                    id: Date.now().toString(), 
                    role: 'model', 
                    text: getGreeting(targetModel, role), 
                    timestamp: Date.now(),
                    modelIcon: getModelIcon(targetModel)
                }]);
            }
        };

        window.addEventListener('open-ai-chat' as any, handleOpenEvent);
        return () => window.removeEventListener('open-ai-chat' as any, handleOpenEvent);
    }, [role]); // Added role dependency to ensure correct greeting

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [aiMessages, humanMessages, activeTab, loading, agentTyping, isOpen]);

    const resetIdleTimer = () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        setIsDocked(false);
        idleTimerRef.current = setTimeout(() => {
            if (!isOpen) setIsDocked(true);
        }, 3000); // 3 seconds idle to shrink
    };

    // --- Logic ---

    const handleSend = async () => {
        if(!input.trim()) return;
        const userText = input;
        const newMsg: Message = { id: Date.now().toString(), role: 'user', text: userText, timestamp: Date.now() };
        
        setInput('');

        if (activeTab === 'AI') {
            setAiMessages(prev => [...prev, newMsg]);
            setLoading(true);
            
            // Format for new AI Service (DeepSeek/Qwen)
            const history = aiMessages.filter(m => m.role !== 'system').map(m => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            try {
                const responseText = await chatWithBot(history, userText, role, activeModel);
                
                // Determine icon based on model
                const icon = getModelIcon(activeModel);

                setAiMessages(prev => [...prev, { 
                    id: Date.now().toString(), 
                    role: 'model', 
                    text: responseText, 
                    timestamp: Date.now(),
                    modelIcon: icon 
                }]);
            } catch (e) {
                setAiMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "网络开小差了，请稍后再试。", timestamp: Date.now() }]);
            } finally {
                setLoading(false);
            }
        } else {
            // Human Logic
            setHumanMessages(prev => [...prev, newMsg]);
            
            if (!humanConnected) {
                // Simulate system response if not connected
                setTimeout(() => {
                    setHumanMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: "正在为您分配客服，请稍候...", timestamp: Date.now() }]);
                    connectHumanAgent();
                }, 500);
            } else {
                // Simulate Agent Reply
                setAgentTyping(true);
                setTimeout(() => {
                    setAgentTyping(false);
                    const replies = [
                        "收到，正在为您查询。",
                        "请问您方便提供一下订单号吗？",
                        "这个问题您可以尝试重启设备解决。",
                        "好的，我已经为您记录反馈。"
                    ];
                    const randomReply = replies[Math.floor(Math.random() * replies.length)];
                    setHumanMessages(prev => [...prev, { id: Date.now().toString(), role: 'agent', text: randomReply, timestamp: Date.now() }]);
                }, 1500);
            }
        }
    };

    const connectHumanAgent = () => {
        setAgentTyping(true);
        setTimeout(() => {
            setHumanConnected(true);
            setAgentTyping(false);
            setHumanMessages(prev => [...prev, { id: Date.now().toString(), role: 'agent', text: "您好，工号 9527 为您服务。请问有什么可以帮您？", timestamp: Date.now() }]);
        }, 2500);
    };

    const switchTab = (tab: ChatMode) => {
        setActiveTab(tab);
        if (tab === 'HUMAN' && humanMessages.length === 0) {
            setHumanMessages([{ id: 'init-human', role: 'system', text: "安电通官方客服在线时间：09:00 - 22:00", timestamp: Date.now() }]);
        }
    };

    const switchModel = (model: AIModel) => {
        setActiveModel(model);
        // Reset chat with specific model greeting
        setAiMessages([{ 
            id: Date.now().toString(), 
            role: 'model', 
            text: getGreeting(model, role), 
            timestamp: Date.now(),
            modelIcon: getModelIcon(model)
        }]);
    };

    // --- Drag Logic ---
    const handleDragStart = (clientX: number, clientY: number) => {
        setIsDragging(true);
        setIsDocked(false);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        hasMoved.current = false;
        dragStartPos.current = { x: clientX, y: clientY };
        buttonStartPos.current = { ...position };
    };

    const handleDragMove = (clientX: number, clientY: number) => {
        if (!isDragging) return;
        const dx = dragStartPos.current.x - clientX;
        const dy = dragStartPos.current.y - clientY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved.current = true;
        setPosition({ x: buttonStartPos.current.x + dx, y: buttonStartPos.current.y + dy });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        
        // Auto Snap to Edge logic
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const btnSize = 64; // w-16
        
        // Calculate X Snap (Left or Right)
        let newX = position.x;
        const centerX = screenW / 2;
        
        // position.x is 'right' offset. Distance from right edge.
        if (position.x < centerX) {
            // Closer to Right Edge
            newX = 0; // Flush with right
        } else {
            // Closer to Left Edge
            newX = screenW - btnSize; // Flush with left
        }

        // Calculate Y Constraint (Keep within vertical bounds)
        let newY = Math.max(20, Math.min(position.y, screenH - btnSize - 80)); // 80px buffer from bottom

        setPosition({ x: newX, y: newY });
        buttonStartPos.current = { x: newX, y: newY };
        
        // Restart docking timer
        resetIdleTimer();
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
        const onUp = () => handleDragEnd();
        const onTouchMove = (e: TouchEvent) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        if (isDragging) {
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onUp);
        };
    }, [isDragging]);

    const handleOpen = () => {
        if (!hasMoved.current) {
            setIsOpen(true);
            setIsDocked(false);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        }
    };

    // Determine dock side for animation direction
    // If x < window.innerWidth / 2, it's on the right side.
    const isRightSide = position.x < (window.innerWidth / 2);

    // --- Render ---

    if (!isOpen) {
        return (
            <button 
                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                onClick={handleOpen}
                className={`absolute z-[1000] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing group transition-all duration-500 ease-out
                    ${isDragging ? 'scale-110 shadow-xl' : ''}
                    ${isDocked && !isDragging ? (isRightSide ? 'translate-x-[40%] opacity-60 grayscale-[0.5] hover:translate-x-0 hover:opacity-100 hover:grayscale-0' : '-translate-x-[40%] opacity-60 grayscale-[0.5] hover:translate-x-0 hover:opacity-100 hover:grayscale-0') : ''}
                `}
                style={{ 
                    bottom: `${position.y}px`, 
                    right: `${position.x}px`, 
                    touchAction: 'none',
                    transitionProperty: isDragging ? 'none' : 'all' // Disable transition during drag
                }} 
            >
                {/* Main Bubble */}
                <div className="relative w-full h-full">
                    {/* Pulse Effect - Only when active or not docked */}
                    {!isDocked && (
                        <>
                            <span className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 animate-ping"></span>
                            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg border-2 border-white/20"></span>
                        </>
                    )}
                    
                    {/* Docked State Visual (Simpler) */}
                    {isDocked && (
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg border-2 border-white"></span>
                    )}
                    
                    <div className="relative z-10 text-white flex flex-col items-center justify-center h-full">
                        <Bot size={28} className="drop-shadow-md" />
                        {!isDocked && <span className="text-[8px] font-bold uppercase tracking-wider opacity-90 mt-0.5">AI 助手</span>}
                    </div>

                    {/* Notification Badge */}
                    {!isDocked && (
                        <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </div>
                    )}
                </div>
            </button>
        );
    }

    const currentMessages = activeTab === 'AI' ? aiMessages : humanMessages;
    const isAI = activeTab === 'AI';

    return (
        <div className="absolute inset-0 z-[1001] flex justify-center items-end sm:items-center pointer-events-none">
            <div className="w-full h-[92%] sm:h-[650px] sm:w-[400px] sm:mr-4 sm:mb-4 flex flex-col pointer-events-auto relative animate-slide-up bg-transparent">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/20 -z-10 sm:rounded-3xl backdrop-blur-[2px]" onClick={() => {setIsOpen(false); resetIdleTimer();}}></div>
                
                <div className="flex-1 flex flex-col bg-gray-50 w-full h-full sm:rounded-3xl overflow-hidden shadow-2xl rounded-t-3xl border border-white/20 relative">
                    
                    {/* Header */}
                    <div className="bg-white p-4 pb-2 shrink-0 z-20 shadow-sm relative">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAI ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                                    {isAI ? <Bot size={18} /> : <Headphones size={18} />}
                                </div>
                                <span className="font-bold text-lg text-gray-800">
                                    {isAI ? '安电通智能助手' : '人工在线客服'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button onClick={() => {setIsOpen(false); resetIdleTimer();}} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                    <Minimize2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-gray-100 rounded-xl relative mb-2">
                            {/* Slider Animation */}
                            <div 
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${isAI ? 'left-1' : 'left-[calc(50%+2px)]'}`}
                            ></div>
                            
                            <button 
                                onClick={() => switchTab('AI')} 
                                className={`flex-1 flex items-center justify-center py-2 text-sm font-bold relative z-10 transition-colors ${isAI ? 'text-indigo-600' : 'text-gray-500'}`}
                            >
                                <Sparkles size={14} className="mr-1.5" /> AI 智联
                            </button>
                            <button 
                                onClick={() => switchTab('HUMAN')} 
                                className={`flex-1 flex items-center justify-center py-2 text-sm font-bold relative z-10 transition-colors ${!isAI ? 'text-green-600' : 'text-gray-500'}`}
                            >
                                <Headphones size={14} className="mr-1.5" /> 人工客服
                            </button>
                        </div>

                        {/* AI Model Selector (Only Visible in AI Tab) */}
                        {isAI && (
                            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                                <button 
                                    onClick={() => switchModel('qwen')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center border transition-all whitespace-nowrap ${activeModel === 'qwen' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}
                                >
                                    <Bot size={12} className="mr-1.5"/> 通义千问
                                </button>
                                <button 
                                    onClick={() => switchModel('deepseek')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center border transition-all whitespace-nowrap ${activeModel === 'deepseek' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-500 border-gray-200'}`}
                                >
                                    <Brain size={12} className="mr-1.5"/> DeepSeek 满血
                                </button>
                                <button 
                                    onClick={() => switchModel('doubao')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center border transition-all whitespace-nowrap ${activeModel === 'doubao' ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-500 border-gray-200'}`}
                                >
                                    <ScanEye size={12} className="mr-1.5"/> 豆包 Vision
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Chat Body */}
                    <div 
                        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth relative" 
                        ref={scrollRef}
                        style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px'}}
                    >
                        {currentMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                {/* Avatar for Bot/Agent */}
                                {msg.role !== 'user' && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 shadow-sm border border-white ${
                                        msg.role === 'model' ? 'bg-indigo-600 text-white' : (msg.role === 'system' ? 'bg-gray-200 text-gray-500' : 'bg-green-500 text-white')
                                    }`}>
                                        {msg.role === 'model' ? (msg.modelIcon || <Bot size={16} />) : (msg.role === 'system' ? <Zap size={14} /> : <User size={16} />)}
                                    </div>
                                )}

                                {/* Bubble */}
                                <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                                    msg.role === 'user' 
                                    ? 'bg-gray-900 text-white rounded-tr-none'
                                    : (msg.role === 'system' 
                                        ? 'bg-gray-200/80 text-gray-500 text-xs text-center w-full shadow-none bg-transparent py-2'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100')
                                }`}>
                                    <div style={{whiteSpace: 'pre-wrap'}}>{msg.text}</div>
                                    {/* Time */}
                                    {msg.role !== 'system' && (
                                        <p className={`text-[9px] mt-1 text-right opacity-50 ${msg.role === 'user' ? 'text-gray-300' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicators */}
                        {(loading && isAI) && (
                            <div className="flex justify-start items-center">
                                 <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mr-2">
                                    {getModelIcon(activeModel)}
                                </div>
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                </div>
                            </div>
                        )}
                        {(agentTyping && !isAI) && (
                            <div className="flex justify-start items-center">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 mr-2">
                                    <User size={16} className="text-white" />
                                </div>
                                <div className="text-xs text-gray-400 ml-1">对方正在输入...</div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="bg-white p-3 pb-safe border-t border-gray-100 z-20">
                        {/* Toolbar */}
                        <div className="flex items-center space-x-4 px-1 mb-2">
                            <button className="text-gray-400 hover:text-gray-600 transition-colors"><Image size={20} /></button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors"><Camera size={20} /></button>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors"><Mic size={20} /></button>
                            <div className="flex-1"></div>
                            {isAI && <button onClick={() => setAiMessages([])} className="text-xs text-gray-400 hover:text-red-500 flex items-center"><History size={12} className="mr-1"/> 清空记录</button>}
                        </div>

                        <div className="flex items-end space-x-2 bg-gray-100 p-1.5 rounded-[24px]">
                            <textarea 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                className="flex-1 bg-transparent border-none outline-none px-4 py-2.5 text-sm max-h-24 resize-none text-gray-800 placeholder:text-gray-400"
                                placeholder={isAI ? (activeModel === 'deepseek' ? "问我任何问题 (生活/逻辑)..." : (activeModel === 'doubao' ? "描述画面或创意..." : "描述电力故障...")) : "请简述您的问题..."}
                                rows={1}
                            />
                            <button 
                                 onClick={handleSend}
                                 disabled={(!input.trim()) || (isAI && loading)}
                                 className={`p-2.5 rounded-full shadow-sm transition-all shrink-0 ${
                                     input.trim() 
                                     ? (isAI ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-green-600 text-white hover:bg-green-700')
                                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                 }`}
                            >
                                <Send size={18} className={input.trim() ? "ml-0.5" : ""} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
