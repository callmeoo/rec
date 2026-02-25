import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import InitializationState from './components/CourseDevelopment/InitializationState';
import InviteMember from './components/MemberManagement/InviteMember';
import AuthorizationManagement from './components/MemberManagement/AuthorizationManagement';
import RecommendationPage from './components/CarRecommendation/RecommendationPage';

function App() {
  const [activeTab, setActiveTab] = useState('猜你喜欢');

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === '猜你喜欢' && <RecommendationPage />}
      {activeTab === '课程开发' && <InitializationState setActiveTab={setActiveTab} />}
      {activeTab === '邀请成员' && <InviteMember setActiveTab={setActiveTab} />}
      {activeTab === '授权管理' && <AuthorizationManagement setActiveTab={setActiveTab} />}
      {activeTab !== '猜你喜欢' && activeTab !== '课程开发' && activeTab !== '邀请成员' && activeTab !== '授权管理' && (
        <div className="h-full flex items-center justify-center text-slate-400">
          {activeTab} 模块开发中...
        </div>
      )}
    </DashboardLayout>
  );
}

export default App;
