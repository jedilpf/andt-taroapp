
import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from '../components/Shared';
import Home from './user/UserHome';
import SafetyPage from './user/UserSafety';
import { UserStore } from './user/UserStore';
import { PointsMall } from './user/PointsMall';

import { Orders } from './user/orders/Orders';
import { OrderDetail } from './user/orders/OrderDetail';
import { UserProfilePage } from './user/profile/UserProfile';
import { UserMemberCenter } from './user/profile/UserMemberCenter';
import { CommunityPage } from './user/community/Community';
import { RepairPage } from './user/services/Repair';
import { InstallPage } from './user/services/Install';
import { ActivityPage } from './user/services/Activity';
import { ElectricianBookingPage } from './user/services/ElectricianBooking';
import { SafetyAcademyPage } from './user/services/SafetyAcademy';
import { SmartHomePage } from './user/services/SmartHome';
import { OnlineSupportModal } from './user/services/OnlineSupport';
import { SupportChatPage } from './user/services/SupportChat';
import { LocalServicesPage, LocalServiceDetail } from './user/services/LocalServices';
import { InspectionFlow } from './user/services/InspectionFlow';
import { AfterSalesPage } from './user/services/AfterSales';
import { AIDiagnosisIntroPage } from './user/services/AIDiagnosisIntro';
import { CareVersion } from './user/CareVersion';
import { ConvenienceStationPage } from './user/services/ConvenienceStation';
import { SafetyInspectionReport } from './user/services/SafetyInspectionReport';
import { DeepInspectionReport } from './user/services/DeepInspectionReport';

// Task Management
import { TaskList } from './user/tasks/TaskList';
import { TaskPublish } from './user/tasks/TaskPublish';
import { TaskDetail } from './user/tasks/TaskDetail';

// 商城专项功能
import { UserPointsTask } from './user/store/UserPointsTask';
import { UserTradeIn } from './user/store/UserTradeIn';
import { UserGoldInstall } from './user/store/UserGoldInstall';
import { UserGroupBuy } from './user/store/UserGroupBuy';
import { UserActivityZone } from './user/store/UserActivityZone';

import { UserCouponWallet } from './user/profile/UserCouponWallet';
import { UserWelfare } from './user/profile/UserWelfare';
import { UserBenefits } from './user/profile/UserBenefits';
import { UserAddresses } from './user/profile/UserAddresses';
import { UserAddressEdit } from './user/profile/UserAddressEdit';
import { UserReferral } from './user/profile/UserReferral';
import { UserSecurity } from './user/profile/UserSecurity';
import { UserSettings } from './user/profile/UserSettings';
import { UserFavorites } from './user/profile/UserFavorites';
import { UserBrowsingHistory } from './user/profile/UserBrowsingHistory';
import { IdentityVerify } from './shared/IdentityVerify';
import { UserIdentityVerify } from './user/profile/UserIdentityVerify';
import { MessageCenter } from './shared/MessageCenter';

export const UserLayout: React.FC = () => {
  const location = useLocation();
  const isMapPage = location.pathname === '/user/map';

  return (
    <div className={`h-full flex flex-col ${isMapPage ? 'pointer-events-none' : ''}`}>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20 relative">
        <Outlet />
      </div>
      <div className="pointer-events-auto">
        <BottomNav role="USER" />
      </div>
      <OnlineSupportModal />
    </div>
  );
};

export const UserRoutes = () => (
  <Routes>
    <Route path="orders" element={<Orders />} />
    <Route path="repair" element={<RepairPage />} />
    <Route path="install" element={<InstallPage />} />
    <Route path="activity" element={<ActivityPage />} />
    <Route path="inspection" element={<InspectionFlow />} />
    <Route path="inspection/report/:orderId" element={<SafetyInspectionReport />} />
    <Route path="inspection/deep-report/:orderId" element={<DeepInspectionReport />} />
    <Route path="book/:elecId" element={<ElectricianBookingPage />} />
    <Route path="after-sales" element={<AfterSalesPage />} />
    <Route path="service-chat" element={<SupportChatPage />} />
    <Route path="ai-intro" element={<AIDiagnosisIntroPage />} />
    <Route path="care" element={<CareVersion />} />

    {/* Task Management Routes */}
    <Route path="tasks" element={<TaskList />} />
    <Route path="task-publish" element={<TaskPublish />} />
    <Route path="task/:id" element={<TaskDetail />} />

    <Route path="order/:orderId" element={<OrderDetail />} />
    <Route path="coupons" element={<UserCouponWallet />} />
    <Route path="welfare" element={<UserWelfare />} />
    <Route path="favorites" element={<UserFavorites />} />
    <Route path="browsing-history" element={<UserBrowsingHistory />} />
    <Route path="benefits" element={<UserBenefits />} />
    <Route path="addresses" element={<UserAddresses />} />
    <Route path="address-add" element={<UserAddressEdit />} />
    <Route path="address-edit/:id" element={<UserAddressEdit />} />
    <Route path="referral" element={<UserReferral />} />
    <Route path="security" element={<UserSecurity />} />
    <Route path="settings" element={<UserSettings />} />
    <Route path="member-center" element={<UserMemberCenter />} />
    <Route path="academy" element={<SafetyAcademyPage />} />
    <Route path="smart-home" element={<SmartHomePage />} />
    <Route path="local/:serviceId" element={<LocalServiceDetail />} />
    <Route path="local" element={<LocalServicesPage />} />
    <Route path="convenience-station" element={<ConvenienceStationPage />} />
    <Route path="community" element={<CommunityPage />} />
    <Route path="identity-verify" element={<IdentityVerify />} />
    <Route path="special-verify" element={<UserIdentityVerify />} />
    <Route path="messages" element={<MessageCenter />} />

    {/* 商城专项功能 - 活动专区改为动态路由 */}
    <Route path="store/points" element={<UserPointsTask />} />
    <Route path="store/trade-in" element={<UserTradeIn />} />
    <Route path="store/gold-install" element={<UserGoldInstall />} />
    <Route path="store/group-buy" element={<UserGroupBuy />} />
    <Route path="store/activity/:type" element={<UserActivityZone />} />

    <Route element={<UserLayout />}>
      <Route path="home" element={<Home />} />
      <Route path="store" element={<UserStore />} />
      <Route path="points-mall" element={<PointsMall />} />
      <Route path="safety" element={<SafetyPage />} />
      <Route path="profile" element={<UserProfilePage />} />
      <Route path="map" element={<div className="h-full" />} />
    </Route>

    <Route path="*" element={<Navigate to="home" replace />} />
  </Routes>
);
