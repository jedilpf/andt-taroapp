/**
 * 安电通上门电工服务系统
 * Copyright © 2026 米枫网络科技. All rights reserved.
 * 
 * 本软件为原创开发，受中华人民共和国著作权法保护。
 * 
 * 文件名：ElectricianApp.tsx
 * 功能描述：电工端主应用，包含电工端所有页面路由
 * 创建日期：2026-02-28
 */

import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { BottomNav } from '../components/Shared';

// Import refactored pages
import { TaskHall } from './electrician/hall/TaskHall';
import { TaskDetail } from './electrician/tasks/TaskDetail';
import { MyTasks } from './electrician/tasks/MyTasks';
import { Income } from './electrician/income/Income';
import { ElecProfile } from './electrician/profile/ElecProfile';
import { ElecSkills } from './electrician/profile/ElecSkills';
import { ElecServiceArea } from './electrician/profile/ElecServiceArea';
import { ElecSettings } from './electrician/profile/ElecSettings';
import { IdentityVerify } from './shared/IdentityVerify';
import { MessageCenter } from './shared/MessageCenter';

export const ElectricianLayout: React.FC = () => (
  <>
    <div className="flex-1 h-full overflow-y-auto no-scrollbar">
        <Outlet />
    </div>
    <BottomNav role="ELECTRICIAN" />
  </>
);

export const ElectricianRoutes = () => (
  <Routes>
      {/* Sub Pages without Bottom Nav */}
      <Route path="skills" element={<div className="h-full bg-gray-50 overflow-y-auto no-scrollbar"><ElecSkills /></div>} />
      <Route path="area" element={<div className="h-full bg-gray-50 overflow-y-auto no-scrollbar"><ElecServiceArea /></div>} />
      <Route path="settings" element={<div className="h-full bg-gray-50 overflow-y-auto no-scrollbar"><ElecSettings /></div>} />
      <Route path="identity-verify" element={<IdentityVerify />} />
      <Route path="messages" element={<MessageCenter />} />

      <Route element={<ElectricianLayout />}>
        <Route path="hall" element={<TaskHall />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="task/:id" element={<TaskDetail />} />
        <Route path="income" element={<Income />} />
        <Route path="profile" element={<ElecProfile />} />
      </Route>
  </Routes>
);
