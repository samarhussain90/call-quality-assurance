import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';

// Types
export interface Call {
  id: string;
  status: string;
  duration: string;
  date: string;
  time: string;
  agent: string;
  customer: string;
  company: string;
  phoneNumber: string;
  quality?: {
    score: number;
    issues: string[];
  };
  compliance?: {
    status: "compliant" | "non-compliant" | "warning";
    violations: string[];
  };
  keywords?: string[];
  topics?: string[];
  sentiment?: {
    overall: "positive" | "negative" | "neutral";
    score: number;
  };
  transcript?: {
    segments: {
      id: string;
      timestamp: string;
      speaker: "agent" | "customer";
      text: string;
      sentiment?: "positive" | "negative" | "neutral";
      quality?: {
        score: number;
        issues: string[];
      };
      compliance?: {
        status: "compliant" | "warning" | "non-compliant";
        violations: string[];
      };
    }[];
    summary: {
      keyTakeaways: string[];
      actionItems: string[];
      coachingTips: string[];
    };
  };
}

// Query keys
export const callKeys = {
  all: ['calls'] as const,
  lists: () => [...callKeys.all, 'list'] as const,
  list: (filters: string) => [...callKeys.lists(), { filters }] as const,
  details: () => [...callKeys.all, 'detail'] as const,
  detail: (id: string) => [...callKeys.details(), id] as const,
};

// API functions
const fetchCalls = async (campaignId: string) => {
  const { data } = await apiClient.get<Call[]>(`/campaigns/${campaignId}/calls`);
  return data;
};

const fetchCallDetails = async (callId: string) => {
  const { data } = await apiClient.get<Call>(`/calls/${callId}`);
  return data;
};

const updateCallNotes = async ({ callId, notes }: { callId: string; notes: string }) => {
  const { data } = await apiClient.patch<Call>(`/calls/${callId}/notes`, { notes });
  return data;
};

const updateCallTags = async ({ callId, tags }: { callId: string; tags: string[] }) => {
  const { data } = await apiClient.patch<Call>(`/calls/${callId}/tags`, { tags });
  return data;
};

// Hooks
export function useCalls(campaignId: string) {
  return useQuery({
    queryKey: callKeys.list(campaignId),
    queryFn: () => fetchCalls(campaignId),
  });
}

export function useCallDetails(callId: string) {
  return useQuery({
    queryKey: callKeys.detail(callId),
    queryFn: () => fetchCallDetails(callId),
    enabled: !!callId,
  });
}

export function useUpdateCallNotes() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCallNotes,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(callKeys.detail(variables.callId), data);
    },
  });
}

export function useUpdateCallTags() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCallTags,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(callKeys.detail(variables.callId), data);
    },
  });
} 