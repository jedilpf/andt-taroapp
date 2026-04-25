
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Share2, Check, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { createPortal } from 'react-dom';

// --- 自定义品牌图标 ---
const WeChatIcon = () => (
    <div className="w-9 h-9 bg-[#07C160] rounded-xl flex items-center justify-center text-white shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 13.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm7 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm.707-10.457c-4.832 0-8.75 3.518-8.75 7.857 0 2.348 1.152 4.453 2.969 5.86l-.766 2.296 2.664-1.332c.609.18 1.258.281 1.883.281 4.832 0 8.75-3.518 8.75-7.857 0-4.339-3.918-7.857-8.75-7.857zm-11.233 4.286c-4.142 0-7.5 3.015-7.5 6.735 0 2.012.986 3.816 2.544 5.023l-.656 1.968 2.284-1.142c.523.155 1.078.241 1.614.241 4.142 0 7.5-3.015 7.5-6.735 0-3.72-3.358-6.735-7.5-6.735z"/></svg>
    </div>
);

const AlipayIcon = () => (
    <div className="w-9 h-9 bg-[#1677FF] rounded-xl flex items-center justify-center text-white shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.184 14.394l-.744-.744c-.11-.11-.274-.11-.384 0l-1.344 1.344c-.784.784-1.84 1.216-2.944 1.216s-2.16-.432-2.944-1.216c-1.632-1.632-1.632-4.272 0-5.904.11-.11.11-.274 0-.384l-.688-.688c-.11-.11-.274-.11-.384 0-2 2-2 5.264 0 7.264 1.056 1.056 2.48 1.648 4.016 1.648s2.96-.592 4.016-1.648l1.344-1.344c.11-.11.11-.274 0-.384l-.328-.328c-.06-.06-.134-.12-.214-.146-.384-.11-.784-.192-1.2-.24-.06-.01-.12-.02-.18-.02h-3.12v-1.84h4.16c.26 0 .48-.22.48-.48s-.22-.48-.48-.48h-4.16v-1.84h3.968c.06 0 .12-.02.16-.06l5.056-5.056c.11-.11.11-.274 0-.384l-.768-.768c-.11-.11-.274-.11-.384 0l-5.056 5.056c-.04.04-.06.1-.06.16v1.84h-3.328v-1.84h3.968c.26 0 .48-.22.48-.48s-.22-.48-.48-.48H8.08c-.26 0-.48.22-.48.48s.22.48.48.48h2.88v1.84h-3.328c-.26 0-.48.22-.48.48s.22.48.48.48h3.328v1.84h-1.6c-.464 0-.896.112-1.28.32-.224.128-.304.416-.176.64.128.224.416.304.64.176.24-.128.512-.192.816-.192h1.6v.16c0 1.28.496 2.48 1.408 3.392.11.11.11.274 0 .384l-.688.688c-.11.11-.274.11-.384 0-1.632-1.632-1.632-4.272 0-5.904z"/></svg>
    </div>
);

const AppleIcon = () => (
    <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.073 21.321c-.712.424-1.464.912-2.28 1.344-.72.384-1.504.64-2.312.64-.8 0-1.512-.232-2.144-.56-.632-.328-1.192-.72-1.68-.72s-1.048.392-1.68.72c-.632.328-1.344.56-2.144.56-.808 0-1.592-.256-2.312-.64-.816-.432-1.568-.92-2.28-1.344-3.416-2.032-5.416-6.104-5.416-10.152 0-3.352 1.456-5.832 3.424-7.296 1.32-.984 2.872-1.504 4.52-1.504 1.112 0 2.128.336 3.032.72.68.288 1.288.632 1.816.632.528 0 1.136-.344 1.816-.632.904-.384 1.92-.72 3.032-.72 1.648 0 3.2.52 4.52 1.504 1.968 1.464 3.424 3.944 3.424 7.296 0 4.048-2 8.12-5.416 10.152zm-5.073-14.88c-.016-1.168.432-2.296 1.24-3.136.808-.84 1.936-1.376 3.104-1.376.016 1.168-.432 2.296-1.24 3.136-.808.84-1.936 1.376-3.104 1.376z"/></svg>
    </div>
);

const PageHeader = ({ title, rightAction }: { title: string, rightAction?: React.ReactNode }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-gray-50">
            <div className="flex items-center space-x-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-all"><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-black text-gray-800">{title}</h1>
            </div>
            {rightAction}
        </div>
    );
};

export const UserSettings = () => {
    const navigate = useNavigate();
    const { logout } = useApp();
    const [notify, setNotify] = useState(true);
    
    // 第三方绑定状态管理
    const [bindings, setBindings] = useState({
        wechat: true,
        alipay: false,
        apple: false
    });

    const [unbindingKey, setUnbindingKey] = useState<keyof typeof bindings | null>(null);

    const handleBind = (key: keyof typeof bindings) => {
        if (bindings[key]) {
            setUnbindingKey(key);
        } else {
            // 模拟绑定流程
            alert(`正在唤起 ${key === 'wechat' ? '微信' : key === 'alipay' ? '支付宝' : 'Apple'} 授权...`);
            setTimeout(() => {
                setBindings(prev => ({ ...prev, [key]: true }));
            }, 1000);
        }
    };

    const confirmUnbind = () => {
        if (unbindingKey) {
            setBindings(prev => ({ ...prev, [unbindingKey]: false }));
            setUnbindingKey(null);
        }
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-[#F8FAFC] pb-safe flex flex-col">
            <PageHeader title="设置" />
            
            <div className="p-4 space-y-5 flex-1">
                {/* 1. 账户核心管理 */}
                <div>
                    <h3 className="px-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">账户管理</h3>
                    <div className="bg-white rounded-[1.8rem] shadow-sm border border-slate-100 overflow-hidden">
                        <button onClick={() => navigate('/user/security')} className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors border-b border-slate-50">
                            <span className="text-sm font-bold text-slate-700">账户与安全</span>
                            <ChevronRight size={16} className="text-slate-300"/>
                        </button>
                        <button onClick={() => navigate('/user/addresses')} className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <span className="text-sm font-bold text-slate-700">地址管理</span>
                            <ChevronRight size={16} className="text-slate-300"/>
                        </button>
                    </div>
                </div>

                {/* 2. 第三方账号绑定 (新增板块) */}
                <div>
                    <h3 className="px-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">第三方账号绑定</h3>
                    <div className="bg-white rounded-[1.8rem] shadow-sm border border-slate-100 overflow-hidden">
                        {/* 微信 */}
                        <div onClick={() => handleBind('wechat')} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer group">
                            <div className="flex items-center space-x-3">
                                <WeChatIcon />
                                <span className="text-sm font-bold text-slate-700">微信账号</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${bindings.wechat ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {bindings.wechat ? '已绑定' : '未绑定'}
                                </span>
                                <ChevronRight size={14} className="text-slate-200 group-active:translate-x-0.5 transition-transform" />
                            </div>
                        </div>

                        {/* 支付宝 */}
                        <div onClick={() => handleBind('alipay')} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer group">
                            <div className="flex items-center space-x-3">
                                <AlipayIcon />
                                <span className="text-sm font-bold text-slate-700">支付宝账号</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${bindings.alipay ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {bindings.alipay ? '已绑定' : '未绑定'}
                                </span>
                                <ChevronRight size={14} className="text-slate-200" />
                            </div>
                        </div>

                        {/* Apple ID */}
                        <div onClick={() => handleBind('apple')} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center space-x-3">
                                <AppleIcon />
                                <span className="text-sm font-bold text-slate-700">Apple ID</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${bindings.apple ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {bindings.apple ? '已绑定' : '未绑定'}
                                </span>
                                <ChevronRight size={14} className="text-slate-200" />
                            </div>
                        </div>
                    </div>
                    <p className="px-4 mt-2 text-[10px] text-slate-400 font-medium leading-relaxed">绑定第三方账号后，您可以使用对应平台的快速登录功能，并同步相关的支付权益。</p>
                </div>

                {/* 3. 通用偏好 */}
                <div>
                    <h3 className="px-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">通用设置</h3>
                    <div className="bg-white rounded-[1.8rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-700">消息通知</span>
                            <div 
                                onClick={() => setNotify(!notify)}
                                className={`w-10 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${notify ? 'bg-emerald-500 shadow-inner' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${notify ? 'left-5' : 'left-1'}`}></div>
                            </div>
                        </div>
                        <button onClick={() => alert("缓存已清除")} className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors border-b border-slate-50">
                            <span className="text-sm font-bold text-slate-700">清除缓存</span>
                            <span className="text-xs text-slate-400 font-black">32.6MB</span>
                        </button>
                        <button className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <span className="text-sm font-bold text-slate-700">关于安电通</span>
                            <span className="text-xs text-slate-400 font-black tracking-widest">V1.0.0</span>
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={() => {logout(); navigate('/');}}
                        className="w-full py-4 bg-white text-rose-500 text-sm font-black rounded-2xl border border-rose-100 shadow-sm active:bg-rose-50 active:scale-[0.98] transition-all"
                    >
                        退出当前登录
                    </button>
                </div>
            </div>

            {/* 解绑确认弹窗 */}
            {unbindingKey && createPortal(
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setUnbindingKey(null)}></div>
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs relative z-10 animate-scale-in text-center shadow-2xl">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">确认解绑？</h3>
                        <p className="text-slate-400 text-sm font-bold mb-8 leading-relaxed">解绑后将无法通过该平台一键登录，且相关联合权益可能会失效。</p>
                        <div className="flex gap-3">
                            <button onClick={() => setUnbindingKey(null)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-black active:scale-95 transition-transform">取消</button>
                            <button onClick={confirmUnbind} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black shadow-lg active:scale-95 transition-transform">确认解绑</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
