/**
 * 安电通上门电工服务系统
 * Copyright © 2026 米枫网络科技. All rights reserved.
 * 
 * 本软件为原创开发，受中华人民共和国著作权法保护。
 * 
 * 文件名：App.tsx
 * 功能描述：应用根组件，负责路由配置和全局布局
 * 创建日期：2026-02-28
 */

import React, { Suspense, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Splash, RoleSelect, Login } from './pages/Auth';
import { UserRoutes } from './pages/UserApp';
import { ElectricianRoutes } from './pages/ElectricianApp';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load MapPage
const MapPage = React.lazy(() => import('./pages/MapPage'));
import { AIChatOverlay } from './components/AIChatOverlay';
import { MapLoading } from './components/Shared';

const AppContent = () => {
    const location = useLocation();
    const { role, currentUser } = useApp();
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    const isMapPage = location.pathname.includes('/user/map');
    const isCarePage = location.pathname.includes('/user/care');
    const isAuthPage = ['/', '/role', '/login'].includes(location.pathname);
    const isCommunityPage = location.pathname.includes('/user/community');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLayoutReady(true);
        }, 300);
        return () => clearTimeout(timer);
    }, [role]);

    const shouldRenderPersistentMap = role === 'USER' && isLayoutReady;

    return (
        <div className="w-full h-full bg-[#f8fafc] relative flex flex-col overflow-hidden max-w-md mx-auto shadow-2xl border-x border-slate-200">
            {/* 核心内容层：在非地图页时提高 Z-Index 且允许点击 */}
            <div className={`flex-1 h-full overflow-hidden relative ${isCommunityPage ? 'z-[200]' : 'z-[100]'} ${isMapPage ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                <ErrorBoundary fallback={<div className="p-10 text-center bg-white h-full flex flex-col items-center justify-center">应用运行异常，请重启</div>}>
                    <Routes>
                        <Route path="/" element={<Splash />} />
                        <Route path="/role" element={<RoleSelect />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/user/*" element={<UserRoutes />} />
                        <Route path="/electrician/*" element={<ElectricianRoutes />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ErrorBoundary>
            </div>

            {/* 地图底层 */}
            {shouldRenderPersistentMap && (
                <div className={`absolute inset-0 z-0 bg-white transition-opacity duration-500 ${isMapPage ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'}`}>
                    <Suspense fallback={<MapLoading />}>
                        <MapPage isActive={isMapPage} />
                    </Suspense>
                </div>
            )}

            {currentUser && !isCarePage && !isAuthPage && !isCommunityPage && <AIChatOverlay />}
        </div>
    );
};

const App = () => {
    return (
        <AppProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </AppProvider>
    );
};

export default App;
