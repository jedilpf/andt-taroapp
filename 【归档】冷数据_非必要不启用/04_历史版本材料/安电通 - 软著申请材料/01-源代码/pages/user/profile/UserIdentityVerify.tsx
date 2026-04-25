
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, GraduationCap, Stethoscope, Medal, ShieldPlus, 
    ChevronRight, CheckCircle2, Camera, Loader2, Info, HeartHandshake, ShieldCheck,
    ShoppingBag, Sparkles
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { SpecialIdentity } from '../../../types';

export const UserIdentityVerify = () => {
    const navigate = useNavigate();
    const { currentUser, updateSpecialIdentity } = useApp();
    const [selectedRole, setSelectedRole] = useState<SpecialIdentity | null>(null);
    const [step, setStep] = useState<'selection' | 'upload' | 'verifying'>('selection');
    const [loading, setLoading] = useState(false);

    const roles = [
        { 
            id: SpecialIdentity.TEACHER, 
            label: '人民教师', 
            icon: GraduationCap, 
            color: 'text-blue-600 bg-blue-50',
            policy: ['全免上门费', '维修费 8.5 折', '每年一次免费安全诊断']
        },
        { 
            id: SpecialIdentity.DOCTOR, 
            label: '医务人员', 
            icon: Stethoscope, 
            color: 'text-emerald-600 bg-emerald-50',
            policy: ['24h 应急绿色通道', '夜间急修免加急费', '优先派单权']
        },
        { 
            id: SpecialIdentity.VETERAN, 
            label: '退伍军人', 
            icon: Medal, 
            color: 'text-orange-600 bg-orange-50',
            policy: ['材料费补贴 15%', '免除检测费', '专属拥军服务师傅']
        },
        { 
            id: SpecialIdentity.MARTYR_CHILD, 
            label: '烈士子女', 
            icon: ShieldPlus, 
            color: 'text-rose-600 bg-rose-50',
            policy: ['公益报修全免费', '老化线路全额资助焕新', '1对1专属管家']
        }
    ];

    const handleSelect = (id: SpecialIdentity) => {
        setSelectedRole(id);
    };

    const handleUpload = () => {
        setLoading(true);
        setTimeout(() => {
            if (selectedRole) {
                updateSpecialIdentity(selectedRole);
            }
            setLoading(false);
            setStep('verifying');
        }, 1500);
    };

    const selectedRoleData = roles.find(r => r.id === selectedRole);

    return (
        <div className="h-full bg-[#F8FAFC] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b border-slate-100">
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-50 active:scale-95 transition-transform">
                        <ArrowLeft size={24} className="text-slate-800" />
                    </button>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight">公益身份认证</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                {step === 'selection' && (
                    <div className="p-5 space-y-6 animate-fade-in">
                        <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black mb-2">向贡献者致敬</h2>
                                <p className="text-slate-400 text-xs font-bold leading-relaxed">安电通为教师、医生、老兵及烈属提供专项电力服务优待，愿我们的微薄之力，温暖社区的脊梁。</p>
                            </div>
                            <HeartHandshake size={100} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-black text-slate-800 text-sm ml-1">请选择认证身份</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {roles.map(role => (
                                    <button 
                                        key={role.id}
                                        onClick={() => handleSelect(role.id)}
                                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center ${selectedRole === role.id ? 'border-slate-900 bg-white shadow-xl scale-105' : 'border-transparent bg-white shadow-sm hover:border-slate-200'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${role.color}`}>
                                            <role.icon size={32} />
                                        </div>
                                        <span className="text-sm font-black text-slate-800">{role.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedRole && (
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 animate-slide-up">
                                <h3 className="font-black text-slate-800 text-sm mb-4 flex items-center">
                                    <ShieldCheck size={16} className="text-emerald-500 mr-2" />
                                    {selectedRoleData?.label} 优待政策
                                </h3>
                                <div className="space-y-3">
                                    {selectedRoleData?.policy.map((p, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                                <CheckCircle2 size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{p}</span>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setStep('upload')}
                                    className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm active:scale-95 transition-transform"
                                >
                                    开始身份认证
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 'upload' && (
                    <div className="p-6 space-y-8 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-slate-800">上传证明材料</h2>
                            <p className="text-xs text-slate-400 font-bold mt-2">证件信息仅用于身份核验，平台承诺严格保密</p>
                        </div>

                        <div className="aspect-[1.6/1] bg-white rounded-[2rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-6 text-slate-300 hover:border-blue-200 hover:text-blue-400 cursor-pointer transition-all active:bg-slate-50 group">
                            <Camera size={48} className="mb-4 group-hover:scale-110 transition-transform" />
                            <p className="font-black text-sm">拍摄/上传证件正面</p>
                            <p className="text-[10px] font-bold mt-1">({selectedRoleData?.label}证件)</p>
                        </div>

                        <div className="bg-blue-50 p-5 rounded-[1.5rem] border border-blue-100 flex items-start space-x-3">
                            <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-800 leading-relaxed font-bold">
                                审核通过后，您将获得平台终身身份标识。如果您是烈士子女但暂无纸质证明，可联系社区志愿者辅助认证。
                            </div>
                        </div>

                        <button 
                            onClick={handleUpload}
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2"/> : '提交审核'}
                        </button>
                    </div>
                )}

                {step === 'verifying' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-scale-in pt-12">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner animate-bounce">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">认证已生效</h2>
                        <p className="text-sm text-slate-400 font-bold leading-relaxed px-6">
                            恭喜！您已成功认证为<span className="text-emerald-600">{selectedRoleData?.label}</span>。<br/>专属优待价格已自动激活，可前往商城或报修使用。
                        </p>

                        <div className="mt-10 w-full space-y-4">
                            <button 
                                onClick={() => navigate('/user/store/activity/renewal')}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center"
                            >
                                <Sparkles size={20} className="mr-2 text-yellow-400 fill-yellow-400" />
                                前往焕新专区 (7.5折)
                            </button>
                            <button 
                                onClick={() => navigate('/user/home')}
                                className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-sm active:bg-slate-50 transition-transform"
                            >
                                返回主页
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserIdentityVerify;
