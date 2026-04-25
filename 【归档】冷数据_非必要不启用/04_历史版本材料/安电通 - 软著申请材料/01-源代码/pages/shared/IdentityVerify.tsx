
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, ShieldCheck, Camera, CheckCircle2, 
    Loader2, Info, UserCheck, Smartphone, ShieldAlert,
    ScanFace, FileText, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpecialIdentity } from '../../types';

export const IdentityVerify = () => {
    const navigate = useNavigate();
    const { currentUser, submitVerification } = useApp();
    const [step, setStep] = useState<'intro' | 'realname' | 'upload' | 'verifying'>('intro');
    const [loading, setLoading] = useState(false);
    const [idType, setIdType] = useState('ID_CARD');

    const handleStartRealName = () => setStep('realname');

    const handleUpload = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            submitVerification({});
            setStep('verifying');
        }, 1500);
    };

    return (
        <div className="h-full bg-[#F8FAFC] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-100">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 active:scale-95 transition-transform">
                        <ArrowLeft size={24} className="text-slate-800" />
                    </button>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight">实名认证</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                {step === 'intro' && (
                    <div className="p-5 space-y-6 animate-fade-in">
                        <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black mb-2">安全第一 · 实名守护</h2>
                                <p className="text-slate-400 text-xs font-bold leading-relaxed">完成实名认证，保障账户资产安全，解锁高阶服务权益与提现功能。</p>
                            </div>
                            <ShieldCheck size={100} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                        </div>

                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-5">
                            <h3 className="font-black text-slate-800 text-sm">认证后您将获得</h3>
                            <div className="space-y-4">
                                {[
                                    { t: '官方信誉标识', d: '提升服务信任度', icon: UserCheck, c: 'text-blue-500 bg-blue-50' },
                                    { t: '资金提现权限', d: '余额随时安全提现', icon: ShieldCheck, c: 'text-emerald-500 bg-emerald-50' },
                                    { t: '全额保险保障', d: '服务全程受保', icon: ShieldAlert, c: 'text-orange-500 bg-orange-50' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.c}`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{item.t}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 p-5 rounded-[1.5rem] border border-blue-100 flex items-start space-x-3">
                            <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                            <div className="text-[10px] text-blue-800 leading-relaxed font-bold">
                                认证说明：平台采用公安联网核验技术，您的隐私信息将受到金融级加密保护。
                            </div>
                        </div>

                        <button 
                            onClick={handleStartRealName}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform"
                        >
                            开始标准实名认证
                        </button>
                    </div>
                )}

                {step === 'realname' && (
                    <div className="p-6 space-y-6 animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-slate-800">填写个人信息</h2>
                            <p className="text-xs text-slate-400 font-bold mt-2">请确保与证件信息保持一致</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">真实姓名</label>
                                <input className="w-full bg-transparent outline-none text-base font-black text-slate-800 h-10 px-1" placeholder="输入证件上的姓名" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">证件号码</label>
                                <input className="w-full bg-transparent outline-none text-base font-black text-slate-800 h-10 px-1" placeholder="输入18位身份证号" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                             <div className="aspect-[1.5/1] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-slate-400 group active:bg-slate-100 transition-all">
                                <Camera size={32} className="mb-2" />
                                <span className="text-[10px] font-black">拍摄身份证正面</span>
                             </div>
                             <div className="aspect-[1.5/1] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-slate-400 group active:bg-slate-100 transition-all">
                                <Camera size={32} className="mb-2" />
                                <span className="text-[10px] font-black">拍摄身份证反面</span>
                             </div>
                        </div>

                        <button 
                            onClick={handleUpload}
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center mt-10"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2"/> : '提交审核'}
                        </button>
                    </div>
                )}

                {step === 'verifying' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-scale-in pt-32">
                        <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner animate-pulse">
                            <ShieldCheck size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">身份审核中</h2>
                        <p className="text-sm text-slate-400 font-bold leading-relaxed px-6">
                            预计在 1-2 个工作日内完成审核。<br/>审核通过后我们将通过短信和系统通知您。
                        </p>
                        <button 
                            onClick={() => navigate(-1)}
                            className="mt-12 px-12 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm active:scale-95 transition-transform"
                        >
                            返回
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
