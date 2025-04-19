import { useMemo } from 'react';
import { useCampaign } from '@/contexts/CampaignContext';
import { mockCallsByCampaign, Call } from '@/mocks/calls';

export function useCallAnalytics() {
  const { selectedCampaign } = useCampaign();

  const filteredCalls = useMemo(() => {
    console.log('useCallAnalytics - selectedCampaign:', selectedCampaign);
    if (selectedCampaign) {
      const calls = mockCallsByCampaign[selectedCampaign.id] || [];
      console.log('useCallAnalytics - filtered calls for campaign:', calls.length);
      return calls;
    }
    const allCalls = Object.values(mockCallsByCampaign).flat();
    console.log('useCallAnalytics - all calls:', allCalls.length);
    return allCalls;
  }, [selectedCampaign]);

  const metrics = useMemo(() => {
    const totalCalls = filteredCalls.length;
    const completedCalls = filteredCalls.filter(call => call.status === "completed").length;
    
    return {
      totalCalls,
      completedCalls,
      avgDuration: Math.round(
        filteredCalls.reduce((acc, call) => acc + call.duration, 0) / totalCalls || 0
      ),
      successRate: Math.round((completedCalls / totalCalls) * 100 || 0),
      avgCallScore: Math.round(
        filteredCalls.reduce((acc, call) => acc + (call.overall_score || 0), 0) / totalCalls || 0
      ),
      complianceRate: Math.round(
        (filteredCalls.filter(call => call.metrics?.compliance.score >= 90).length / totalCalls) * 100 || 0
      ),
      sentimentBreakdown: {
        positive: filteredCalls.filter(call => call.sentiment === 'positive').length,
        neutral: filteredCalls.filter(call => call.sentiment === 'neutral').length,
        negative: filteredCalls.filter(call => call.sentiment === 'negative').length,
      },
      topPerformingAgents: Array.from(
        filteredCalls.reduce((acc, call) => {
          if (!call.agent) return acc;
          const current = acc.get(call.agent) || { totalCalls: 0, successfulCalls: 0 };
          acc.set(call.agent, {
            totalCalls: current.totalCalls + 1,
            successfulCalls: current.successfulCalls + (call.status === 'completed' ? 1 : 0)
          });
          return acc;
        }, new Map())
      )
        .map(([agent, stats]) => ({
          agent,
          successRate: Math.round((stats.successfulCalls / stats.totalCalls) * 100),
          totalCalls: stats.totalCalls
        }))
        .sort((a, b) => b.successRate - a.successRate)
        .slice(0, 5),
      qualityScore: Math.round(
        filteredCalls.reduce((acc, call) => {
          const scores = Object.values(call.metrics || {}).map(m => m.score);
          const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          return acc + avgScore;
        }, 0) / totalCalls || 0
      ),
      complianceScore: Math.round(
        filteredCalls.reduce((acc, call) => acc + (call.metrics?.compliance.score || 0), 0) / totalCalls || 0
      )
    };
  }, [filteredCalls]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    calls: filteredCalls,
    metrics,
    formatDuration,
    isFiltered: !!selectedCampaign,
    campaignName: selectedCampaign?.name || 'All Campaigns'
  };
} 