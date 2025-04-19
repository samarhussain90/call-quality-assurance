import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import CampaignsPage from "@/pages/campaigns/CampaignsPage";
import AnalyticsDashboard from "@/pages/analytics/AnalyticsDashboard";
import PerformanceMonitoring from "@/pages/performance/PerformanceMonitoring";
import ReportsPage from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { CallDetailPage } from "@/pages/campaigns/CallDetailPage";
import { NewCampaignPage } from "@/pages/campaigns/NewCampaignPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import NotFound from "./pages/NotFound";
import { AIAssistant } from '@/components/support/AIAssistant';
import { UserProfile } from "@/pages/profile/UserProfile";
import { IntegrationHub } from "@/pages/settings/components/IntegrationHub";
import { ReportBuilder } from "@/pages/analytics/components/ReportBuilder";
import { ComplianceRulesEngine } from "@/pages/settings/components/ComplianceRulesEngine";
import { AgentAnalytics } from "@/pages/settings/components/AgentAnalytics";
import { ModelTraining } from "@/pages/settings/components/ModelTraining";
import { AgentPerformance } from "@/pages/performance/components/AgentPerformance";
import { CampaignPerformance } from "@/pages/performance/components/CampaignPerformance";
import { ComplianceMonitoring } from "@/pages/performance/components/ComplianceMonitoring";
import { QualityTrends } from "@/pages/performance/components/QualityTrends";
import { RealTimeMetrics } from "@/pages/analytics/components/RealTimeMetrics";
import { HistoricalTrends } from "@/pages/analytics/components/HistoricalTrends";
import { CallAnalytics } from "@/pages/analytics/components/CallAnalytics";
import { PerformanceMetrics } from "@/pages/analytics/components/PerformanceMetrics";
import { AIInsights } from "@/pages/analytics/components/AIInsights";
import { DataWarehouse } from "@/pages/analytics/components/DataWarehouse";
import { CustomReports } from "@/pages/analytics/components/CustomReports";
import { GeneralSettings } from "@/pages/settings/components/GeneralSettings";
import { Notifications } from "@/pages/notifications/Notifications";
import { HelpSupport } from "@/pages/help/HelpSupport";
import { CommunicationIntegrations } from "@/pages/settings/components/CommunicationIntegrations";
import { AIAssistantPage } from "@/pages/ai-assistant/AIAssistantPage";
import { CampaignDetailPage } from "@/pages/campaigns/CampaignDetailPage";
import { Overview } from "@/pages/analytics/components/Overview";
import { CampaignListPage } from "@/pages/campaigns/CampaignListPage";
import { CampaignCallsPage } from "@/pages/campaigns/CampaignCallsPage";
import { CampaignProvider } from "@/contexts/CampaignContext";
import { CampaignCallLogPage } from "@/pages/campaigns/CampaignCallLogPage";

// Mock data for components that require props
const mockAgents = [
  { 
    id: "agent-1", 
    name: "John Smith", 
    totalCalls: 150, 
    averageScore: 85, 
    complianceRate: 92,
    trends: {
      qualityScore: "up" as const,
      complianceRate: "stable" as const,
      callVolume: "up" as const
    }
  },
  { 
    id: "agent-2", 
    name: "Sarah Johnson", 
    totalCalls: 120, 
    averageScore: 78, 
    complianceRate: 88,
    trends: {
      qualityScore: "down" as const,
      complianceRate: "up" as const,
      callVolume: "stable" as const
    }
  },
  { 
    id: "agent-3", 
    name: "Michael Brown", 
    totalCalls: 180, 
    averageScore: 92, 
    complianceRate: 95,
    trends: {
      qualityScore: "up" as const,
      complianceRate: "up" as const,
      callVolume: "up" as const
    }
  }
];

export default function App() {
  return (
    <CampaignProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<AnalyticsDashboard />} />
          
          {/* Campaign Routes */}
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="campaigns/new" element={<NewCampaignPage />} />
          <Route path="campaigns/:campaignId/calls" element={<CampaignCallsPage />} />
          <Route path="campaigns/:campaignId/calls/:callId" element={<CallDetailPage />} />
          <Route path="call-log/:campaignId" element={<CampaignCallLogPage />} />
          
          {/* Analytics Routes */}
          <Route path="analytics" element={<AnalyticsDashboard />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="calls" element={<CallAnalytics />} />
            <Route path="performance" element={<PerformanceMetrics />} />
            <Route path="historical" element={<HistoricalTrends />} />
            <Route path="builder" element={<ReportBuilder onSave={() => {}} onCancel={() => {}} />} />
            <Route path="insights" element={<AIInsights />} />
            <Route path="warehouse" element={<DataWarehouse />} />
            <Route path="reports" element={<CustomReports />} />
          </Route>
          
          {/* Performance Routes */}
          <Route path="performance" element={<PerformanceMonitoring />}>
            <Route index element={<Navigate to="agents" replace />} />
            <Route path="agents" element={<AgentPerformance />} />
            <Route path="campaigns" element={<CampaignPerformance />} />
            <Route path="compliance" element={<ComplianceMonitoring />} />
            <Route path="quality" element={<QualityTrends />} />
          </Route>
          
          {/* Reports Routes */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/scheduled" element={<ReportsPage />} />
          <Route path="reports/builder" element={<ReportBuilder onSave={() => {}} onCancel={() => {}} />} />
          
          {/* Settings Routes */}
          <Route path="settings" element={<SettingsPage />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<GeneralSettings />} />
            <Route path="compliance" element={<ComplianceRulesEngine />} />
            <Route path="agent-analytics" element={<AgentAnalytics agents={mockAgents} />} />
            <Route path="integrations" element={<IntegrationHub />} />
            <Route path="model-training" element={<ModelTraining />} />
          </Route>
          
          {/* Service Routes */}
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="help" element={<HelpSupport />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <AIAssistant />
    </CampaignProvider>
  );
}
