import { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import RecommendationPage from './components/CarRecommendation/RecommendationPage';
import MobileRecommendationPage from './components/CarRecommendation/MobileRecommendationPage';
import VehicleDetailPage from './components/VehicleDetail/VehicleDetailPage';
import SimpleVehicleDetailPage from './components/VehicleDetail/SimpleVehicleDetailPage';
import BuyerRecommendationVerify from './components/Admin/BuyerRecommendationVerify';
import TurnoverRanking from './components/Admin/TurnoverRanking';
import DataDashboard from './components/Admin/DataDashboard';
import VersionHistory from './components/Docs/VersionHistory';
import { FeatureOverview, RecommendStrategy, TrackingDocs, ConfigParams, ReleaseStrategy } from './components/Docs/FeatureDocs';

function App() {
  const [activeTab, setActiveTab] = useState('为您推荐（PC端）');
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === '为您推荐（PC端）' && (
        <RecommendationPage onVehicleClick={setSelectedVehicleId} />
      )}
      {activeTab === '为您推荐（移动端）' && (
        <MobileRecommendationPage onVehicleClick={setSelectedVehicleId} />
      )}
      {activeTab === '推荐算法验证' && <BuyerRecommendationVerify />}
      {activeTab === '平台周转排行' && <TurnoverRanking onVehicleClick={setSelectedVehicleId} />}
      {activeTab === '推荐数据看板' && <DataDashboard />}
      {activeTab === '版本说明' && <VersionHistory />}
      {activeTab === '目标和数据基础' && <FeatureOverview />}
      {activeTab === '推荐策略' && <RecommendStrategy />}
      {activeTab === '埋点说明' && <TrackingDocs />}
      {activeTab === '可配置参数' && <ConfigParams />}
      {activeTab === '发布策略' && <ReleaseStrategy />}
      {activeTab !== '为您推荐（PC端）' && 
       activeTab !== '为您推荐（移动端）' && 
       activeTab !== '推荐算法验证' && 
       activeTab !== '平台周转排行' && 
       activeTab !== '推荐数据看板' && 
       activeTab !== '版本说明' &&
       activeTab !== '目标和数据基础' &&
       activeTab !== '推荐策略' &&
       activeTab !== '埋点说明' &&
       activeTab !== '可配置参数' &&
       activeTab !== '发布策略' &&
       activeTab !== '课程开发' && 
       activeTab !== '邀请成员' && 
       activeTab !== '授权管理' && (
        <div className="h-full flex items-center justify-center text-slate-400">
          {activeTab} 模块开发中...
        </div>
      )}

      {/* 车辆详情弹窗 */}
      {selectedVehicleId && (
        <SimpleVehicleDetailPage
          vehicleId={selectedVehicleId}
          onClose={() => setSelectedVehicleId(null)}
        />
      )}
    </DashboardLayout>
  );
}

export default App;
