
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
// Fix: Added missing ChevronRight to the lucide-react imports
import { X, Headphones, MessageCircle, PhoneCall, ChevronDown, ChevronRight, FileText, ShieldCheck, AlertCircle, HelpCircle, CheckCircle, Send, Plus, Image, Camera, MoreHorizontal, ArrowLeft, Minimize2, Smile, HeartHandshake, Building2, UserCircle2, Landmark, Lightbulb, Droplets, Flame, Siren } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'agent';
    time: string;
}

// --- Chat Popup Modal ---
const SupportChatModal = ({ onClose }: { onClose: () => void }) => {
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

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto transition-opacity" onClick={onClose} />
            <div className="w-full max-w-[480px] bg-[#F5F7FA] rounded-t-[2.5rem] shadow-2xl pointer-events-auto relative animate-slide-up h-[85vh] flex flex-col overflow-hidden">
                <div className="bg-white p-4 flex items-center justify-between shadow-sm shrink-0 z-10 relative border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-600"><ChevronDown size={24}/></button>
                        <div>
                            <h1 className="font-bold text-base text-gray-800">人工客服 007</h1>
                            <div className="flex items-center text-xs text-green-600">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                在线中
                            </div>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><MoreHorizontal size={24}/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-0 bg-gray-50" ref={scrollRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-gray-200 ml-2' : 'bg-green-100 mr-2'}`}>
                                    {msg.sender === 'user' ? <span className="text-xs font-bold text-gray-600">我</span> : <Headphones size={14} className="text-green-600"/>}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative ${msg.sender === 'user' ? 'bg-green-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                             <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-3 border-t border-gray-100 pb-safe shrink-0 z-10 relative">
                    <div className="flex items-end space-x-2">
                        <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center">
                            <input 
                                type="text" 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="输入消息..."
                                className="w-full bg-transparent outline-none text-sm"
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                            />
                        </div>
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`p-2 rounded-full transition-all ${input.trim() ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}
                        >
                            <Send size={20}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Main Online Support Modal ---
export const OnlineSupportModal = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-support', handleOpen);
        return () => window.removeEventListener('open-support', handleOpen);
    }, []);

    const close = () => setIsOpen(false);

    if (!isOpen) return null;

    const hotlineGroups = [
        {
            title: '官方客服',
            icon: Headphones,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            items: [
                { label: '安电通平台热线', phone: '400-888-9527', desc: '订单、收费与投诉咨询', action: 'call' },
                { label: '在线客服', phone: '24小时极速响应', desc: '文字/语音在线沟通', action: 'chat' }
            ]
        },
        {
            title: '社区服务 (徐汇区天钥桥社区)',
            icon: Building2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            items: [
                { label: '社区居委会', phone: '021-64380000', desc: '社区事务与公益政策咨询', action: 'call' },
                { label: '万科物业管理处', phone: '021-64381111', desc: '小区停电、公共区域报修', action: 'call' }
            ]
        },
        {
            title: '网格员专线',
            icon: UserCircle2,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            items: [
                { label: '网格化管理员 - 张师傅', phone: '13812345678', desc: '负责 6号楼-12号楼 区域巡查', action: 'call' }
            ]
        },
        {
            title: '民生公用热线',
            icon: Landmark,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            items: [
                { label: '国家电网客服', phone: '95598', desc: '全市停电公告与电力故障', icon: Lightbulb, color: 'text-amber-500', action: 'call' },
                { label: '自来水报修', phone: '962740', desc: '水管漏水、水压不足', icon: Droplets, color: 'text-blue-500', action: 'call' },
                { label: '燃气报修热线', phone: '962777', desc: '燃气泄漏、故障报修', icon: Flame, color: 'text-red-500', action: 'call' }
            ]
        }
    ];

    const handleAction = (item: any) => {
        if (item.action === 'call') {
            window.location.href = `tel:${item.phone}`;
        } else if (item.action === 'chat') {
            setShowChat(true);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={close} />
            <div className="w-full max-w-[480px] bg-[#F8FAFC] rounded-t-[2.5rem] shadow-2xl pointer-events-auto relative animate-slide-up max-h-[88vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white p-5 flex justify-between items-center shrink-0 z-10 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-6 bg-green-600 rounded-full"></div>
                        <h2 className="text-xl font-black text-gray-800">居民联络热线</h2>
                    </div>
                    <button onClick={close} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                </div>
                
                {/* Scrollable Body */}
                <div className="overflow-y-auto p-5 pb-safe space-y-8 no-scrollbar bg-[#F8FAFC]">
                    
                    {/* Care Mode Tip */}
                    <div onClick={() => { close(); navigate('/user/care'); }} className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-2xl flex items-center justify-between text-white shadow-lg active:scale-[0.98] transition-all cursor-pointer">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                <HeartHandshake size={28} />
                            </div>
                            <div>
                                <p className="font-black text-lg">长辈关怀版</p>
                                <p className="text-xs opacity-80">点击切换大字体模式</p>
                            </div>
                        </div>
                        <ChevronRight size={24} />
                    </div>

                    {/* Hotline Groups */}
                    {hotlineGroups.map((group, gIdx) => (
                        <div key={gIdx}>
                            <h3 className="flex items-center text-xs font-black text-gray-400 mb-3 px-1 uppercase tracking-widest">
                                <group.icon size={14} className={`${group.color} mr-2`} />
                                {group.title}
                            </h3>
                            <div className="space-y-3">
                                {group.items.map((item, iIdx) => (
                                    <div 
                                        key={iIdx}
                                        onClick={() => handleAction(item)}
                                        className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors shadow-sm group cursor-pointer"
                                    >
                                        <div className="flex items-center flex-1 min-w-0">
                                            <div className={`w-10 h-10 rounded-xl ${group.bg} ${group.color} flex items-center justify-center shrink-0 mr-3`}>
                                                {item.icon ? <item.icon size={20} className={item.color}/> : <PhoneCall size={20} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-black text-gray-800 truncate">{item.label}</h4>
                                                <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-3 shrink-0">
                                            <p className={`text-sm font-black ${item.action === 'chat' ? 'text-green-600' : 'text-blue-600'}`}>{item.phone}</p>
                                            <div className="flex items-center justify-end text-[10px] text-gray-300 font-bold mt-0.5">
                                                {item.action === 'chat' ? '立即开启' : '点击拨打'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Emergency Alert Section */}
                    <div className="bg-red-50 p-5 rounded-2xl border-2 border-red-100 space-y-3">
                        <h3 className="text-red-700 font-black flex items-center text-sm">
                            <Siren size={18} className="mr-2 animate-pulse"/> 紧急求助 (全天候)
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { n: '110', l: '报警' },
                                { n: '119', l: '火警' },
                                { n: '120', l: '急救' }
                            ].map(e => (
                                <button key={e.n} onClick={() => window.location.href=`tel:${e.n}`} className="py-2.5 bg-white border border-red-200 rounded-xl text-red-600 font-black flex flex-col items-center active:scale-95 transition-all">
                                    <span className="text-lg">{e.n}</span>
                                    <span className="text-[10px] opacity-70">{e.l}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-center pb-8 opacity-20">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">安电通 · 邻里社区守护者</p>
                    </div>
                </div>
            </div>
            {showChat && <SupportChatModal onClose={() => setShowChat(false)} />}
        </div>,
        document.body
    );
};
