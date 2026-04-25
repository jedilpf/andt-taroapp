
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, ChevronRight, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

const PageHeader = ({ title, rightAction }: { title: string, rightAction?: React.ReactNode }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-3">
                <button onClick={() => navigate(-1)} className="active:opacity-50"><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            </div>
            {rightAction}
        </div>
    );
};

export const UserSecurity = () => {
    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-gray-50 pb-safe">
            <PageHeader title="账户与安全" />
            <div className="p-4 space-y-4">
                 <div className="flex items-center justify-center py-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                         <Shield size={40} className="text-green-600"/>
                    </div>
                 </div>
                 <p className="text-center text-gray-500 text-sm mb-4">您的账户安全评分：<span className="text-green-600 font-bold">95分</span></p>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <button className="w-full p-4 border-b border-gray-50 flex justify-between items-center active:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-3">
                                <Lock size={18}/>
                            </div>
                            <div className="text-left">
                                <span className="font-bold text-gray-800 text-sm block">登录密码</span>
                                <span className="text-[10px] text-gray-400">建议定期修改密码</span>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded">
                            已设置 <ChevronRight size={14} className="ml-1"/>
                        </div>
                    </button>
                    <button className="w-full p-4 flex justify-between items-center active:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mr-3">
                                <Smartphone size={18}/>
                            </div>
                             <div className="text-left">
                                <span className="font-bold text-gray-800 text-sm block">手机号绑定</span>
                                <span className="text-[10px] text-gray-400">若手机号停用请及时更换</span>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs">
                            138****8000 <ChevronRight size={14} className="ml-1"/>
                        </div>
                    </button>
                </div>

                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <button className="w-full p-4 flex justify-between items-center active:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <div className="w-9 h-9 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mr-3">
                                <CheckCircle size={18}/>
                            </div>
                             <div className="text-left">
                                <span className="font-bold text-gray-800 text-sm block">实名认证</span>
                                <span className="text-[10px] text-gray-400">保障账户归属权</span>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs">
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded mr-1">已认证</span> <ChevronRight size={14}/>
                        </div>
                    </button>
                </div>
                
                <div className="pt-4">
                    <button className="w-full py-4 bg-white text-gray-400 text-xs rounded-xl border border-gray-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                         <AlertCircle size={14}/> 注销账号
                    </button>
                </div>
            </div>
        </div>
    );
};
