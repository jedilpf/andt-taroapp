
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, ChevronRight, CheckCircle, Bell, Settings } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const ElecSettings = () => {
    const navigate = useNavigate();
    const { logout } = useApp();

    return (
        <div className="min-h-full bg-gray-50 pb-10">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center space-x-3">
                <button onClick={() => navigate(-1)}><ArrowLeft size={24}/></button>
                <h1 className="text-lg font-bold">设置</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Account Security */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center space-x-2">
                         <Shield size={18} className="text-blue-600"/>
                         <span className="font-bold text-sm text-gray-800">账号安全</span>
                    </div>
                    <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">修改登录密码</span>
                        <ChevronRight size={16} className="text-gray-300"/>
                    </button>
                    <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">更换绑定手机</span>
                        <span className="text-xs text-gray-400 flex items-center">139****9000 <ChevronRight size={14}/></span>
                    </button>
                    <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">实名认证</span>
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded flex items-center">已认证 <CheckCircle size={10} className="ml-1"/></span>
                    </button>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center space-x-2">
                         <Bell size={18} className="text-orange-500"/>
                         <span className="font-bold text-sm text-gray-800">消息通知</span>
                    </div>
                     <div className="p-4 flex justify-between items-center">
                        <span className="text-sm text-gray-700">新订单推送</span>
                        <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                    <div className="p-4 flex justify-between items-center border-t border-gray-50">
                        <span className="text-sm text-gray-700">系统公告</span>
                        <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* General */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center space-x-2">
                         <Settings size={18} className="text-gray-500"/>
                         <span className="font-bold text-sm text-gray-800">通用</span>
                    </div>
                    <button onClick={() => alert("缓存已清除")} className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">清除缓存</span>
                        <span className="text-xs text-gray-400">24.5MB</span>
                    </button>
                    <button className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left">
                        <span className="text-sm text-gray-700">关于安电通</span>
                        <span className="text-xs text-gray-400">v1.0.0</span>
                    </button>
                </div>

                <button 
                    onClick={() => {logout(); navigate('/');}}
                    className="w-full py-3.5 bg-white text-red-500 text-sm font-bold rounded-xl border border-gray-200 shadow-sm active:bg-gray-50"
                >
                    退出登录
                </button>
            </div>
        </div>
    );
};
