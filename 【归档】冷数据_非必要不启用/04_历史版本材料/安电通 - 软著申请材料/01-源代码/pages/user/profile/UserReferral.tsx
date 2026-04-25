
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Copy, Share2 } from 'lucide-react';

export const UserReferral = () => {
    const navigate = useNavigate();
    const [copied, setCopied] = React.useState(false);
    const code = "AN8888";

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-red-500 pb-safe">
             {/* Header Transparent */}
            <div className="p-4 sticky top-0 z-20">
                <div className="flex items-center space-x-3 text-white">
                    <button onClick={() => navigate(-1)} className="bg-black/20 p-2 rounded-full backdrop-blur-md active:bg-black/30"><ArrowLeft size={24}/></button>
                    <h1 className="text-lg font-bold drop-shadow-md">推荐有奖</h1>
                </div>
            </div>
            
            <div className="px-4 pb-10 relative z-10">
                <div className="text-center text-white mb-8 mt-2">
                    <div className="inline-block bg-red-700/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-red-100 mb-2 border border-red-400/30">邀请好友得现金</div>
                    <h2 className="text-4xl font-black mb-2 text-yellow-300 drop-shadow-[0_2px_0_rgba(185,28,28,1)] leading-tight">
                        好友首单立减<br/><span className="text-6xl">20</span>元
                    </h2>
                    <p className="text-white/90 font-medium mt-2">您可获得30元现金奖励，多邀多得</p>
                </div>

                <div className="bg-white rounded-3xl p-1 shadow-2xl mx-2 mb-8">
                    <div className="bg-gradient-to-b from-white to-orange-50 rounded-[1.3rem] p-6 text-center border border-dashed border-orange-200">
                        <p className="text-gray-500 text-sm mb-4 font-bold uppercase tracking-wider">您的专属邀请码</p>
                        <div onClick={handleCopy} className="text-4xl font-black text-gray-800 tracking-widest mb-6 bg-white py-5 rounded-2xl border-2 border-gray-100 shadow-inner cursor-pointer active:scale-95 transition-transform select-all">
                            {code}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={handleCopy}
                                className={`py-3.5 rounded-xl font-bold flex items-center justify-center active:scale-95 transition-all ${copied ? 'bg-green-50 text-green-600' : 'bg-orange-100 text-orange-600'}`}
                            >
                            {copied ? <CheckCircle size={18} className="mr-2"/> : <Copy size={18} className="mr-2"/>} 
                            {copied ? '已复制' : '复制口令'}
                            </button>
                            <button className="py-3.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-red-500/40 active:scale-95 transition-transform hover:brightness-110">
                                <Share2 size={18} className="mr-2"/> 立即分享
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-red-900/20 backdrop-blur-md rounded-2xl p-5 text-white border border-white/10">
                    <h3 className="font-bold mb-4 text-center flex items-center justify-center text-red-100">
                        <span className="w-8 h-px bg-red-300/50 mr-3"></span>
                        我的战绩
                        <span className="w-8 h-px bg-red-300/50 ml-3"></span>
                    </h3>
                    <div className="flex justify-around text-center divide-x divide-red-300/20">
                        <div className="flex-1">
                            <p className="text-3xl font-black text-yellow-300 mb-1">0</p>
                            <p className="text-xs text-red-100 opacity-80">成功邀请(人)</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-3xl font-black text-yellow-300 mb-1">0.00</p>
                            <p className="text-xs text-red-100 opacity-80">累计收益(元)</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-400/40 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
};
