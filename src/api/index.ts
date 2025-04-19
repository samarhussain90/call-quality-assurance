// Placeholder API module simulating backend interactions with dummy data

import apiClient from './client';

// Mock data
const mockCampaigns = [
  { id: "1", name: "Default Campaign" },
  { id: "2", name: "Sales Q1 2024" },
  { id: "3", name: "Customer Support" },
  { id: "4", name: "Product Demo" },
  { id: "5", name: "Onboarding Calls" }
];

const mockCalls = {
  "1": [
    { id: "101", date: "2024-03-15", agent: "John Smith", duration: "15:32", score: 85, status: "Completed" },
    { id: "102", date: "2024-03-14", agent: "Sarah Johnson", duration: "12:45", score: 92, status: "Completed" },
    { id: "103", date: "2024-03-13", agent: "Michael Brown", duration: "18:20", score: 78, status: "Completed" },
    { id: "104", date: "2024-03-12", agent: "Emily Davis", duration: "10:15", score: 88, status: "In Progress" },
    { id: "105", date: "2024-03-11", agent: "David Wilson", duration: "22:05", score: 65, status: "Failed" },
    { id: "106", date: "2024-03-10", agent: "Lisa Anderson", duration: "14:30", score: 90, status: "Completed" },
    { id: "107", date: "2024-03-09", agent: "Robert Taylor", duration: "16:45", score: 82, status: "Completed" },
    { id: "108", date: "2024-03-08", agent: "Jennifer Martinez", duration: "11:20", score: 75, status: "Completed" },
    { id: "109", date: "2024-03-07", agent: "Thomas Garcia", duration: "19:10", score: 87, status: "Completed" },
    { id: "110", date: "2024-03-06", agent: "Patricia Lee", duration: "13:25", score: 93, status: "Completed" }
  ],
  "2": [
    { id: "201", date: "2024-03-15", agent: "James Wilson", duration: "20:15", score: 89, status: "Completed" },
    { id: "202", date: "2024-03-14", agent: "Mary Johnson", duration: "17:30", score: 76, status: "Completed" },
    { id: "203", date: "2024-03-13", agent: "Robert Smith", duration: "25:40", score: 81, status: "In Progress" },
    { id: "204", date: "2024-03-12", agent: "Patricia Brown", duration: "18:20", score: 94, status: "Completed" },
    { id: "205", date: "2024-03-11", agent: "Michael Davis", duration: "22:10", score: 70, status: "Failed" }
  ],
  "3": [
    { id: "301", date: "2024-03-15", agent: "Jennifer Taylor", duration: "30:45", score: 95, status: "Completed" },
    { id: "302", date: "2024-03-14", agent: "David Anderson", duration: "28:20", score: 88, status: "Completed" },
    { id: "303", date: "2024-03-13", agent: "Sarah Martinez", duration: "35:15", score: 92, status: "Completed" },
    { id: "304", date: "2024-03-12", agent: "Thomas Garcia", duration: "32:30", score: 85, status: "In Progress" }
  ],
  "4": [
    { id: "401", date: "2024-03-15", agent: "Emily Lee", duration: "45:20", score: 96, status: "Completed" },
    { id: "402", date: "2024-03-14", agent: "James Wilson", duration: "42:15", score: 90, status: "Completed" },
    { id: "403", date: "2024-03-13", agent: "Lisa Anderson", duration: "48:30", score: 93, status: "Completed" }
  ],
  "5": [
    { id: "501", date: "2024-03-15", agent: "Robert Taylor", duration: "25:10", score: 87, status: "Completed" },
    { id: "502", date: "2024-03-14", agent: "Jennifer Martinez", duration: "28:45", score: 91, status: "Completed" },
    { id: "503", date: "2024-03-13", agent: "Thomas Garcia", duration: "22:30", score: 84, status: "In Progress" },
    { id: "504", date: "2024-03-12", agent: "Patricia Lee", duration: "26:15", score: 89, status: "Completed" },
    { id: "505", date: "2024-03-11", agent: "Michael Wilson", duration: "24:20", score: 86, status: "Completed" },
    { id: "506", date: "2024-03-10", agent: "Sarah Johnson", duration: "27:40", score: 90, status: "Completed" }
  ]
};

// Mock call details data
const mockCallDetails: { [key: string]: any } = {
  "101": {
    id: "101",
    status: "Completed",
    duration: "15:23",
    date: "2024-03-15T14:30:00",
    agent: "John Smith",
    quality: {
      score: 89,
      issues: [
        "Could improve clarity in technical explanations",
        "Should have asked about security software earlier"
      ],
      trends: {
        clarity: "up",
        empathy: "stable",
        professionalism: "up"
      }
    },
    compliance: {
      status: "warning",
      violations: [
        "Should have mentioned security protocols earlier",
        "Missing required disclaimer at the end of the call"
      ],
      score: 85
    },
    keywords: [
      "malware",
      "security",
      "performance",
      "task manager",
      "CPU usage"
    ],
    topics: [
      "Technical Support",
      "Security",
      "Performance Issues"
    ],
    sentiment: {
      overall: "positive",
      score: 0.75
    },
    analytics: {
      duration: {
        total: "15:23",
        agent: "08:45",
        customer: "06:12",
        silence: "00:26"
      },
      speaking: {
        agent: 57,
        customer: 40,
        interruptions: 3
      }
    }
  },
  "102": {
    id: "102",
    status: "Completed",
    duration: "12:45",
    date: "2024-03-14T16:15:00",
    agent: "Sarah Johnson",
    quality: {
      score: 92,
      issues: [
        "Could provide more detailed follow-up instructions"
      ],
      trends: {
        clarity: "up",
        empathy: "up",
        professionalism: "stable"
      }
    },
    compliance: {
      status: "compliant",
      violations: [],
      score: 95
    },
    keywords: [
      "billing",
      "payment",
      "discount",
      "subscription",
      "renewal"
    ],
    topics: [
      "Billing",
      "Account Management",
      "Payment Processing"
    ],
    sentiment: {
      overall: "positive",
      score: 0.85
    },
    analytics: {
      duration: {
        total: "12:45",
        agent: "07:30",
        customer: "04:45",
        silence: "00:30"
      },
      speaking: {
        agent: 59,
        customer: 37,
        interruptions: 2
      }
    }
  }
};

// Utility function for simulating API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth
export async function apiLogin(email: string, password: string): Promise<{ token: string; user: { id: string; fullName: string; email: string }; organizationId?: string }> {
  // Mock login - in a real app, this would call the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "mock-jwt-token",
        user: {
          id: "1",
          fullName: "Test User",
          email: email
        },
        organizationId: "1"
      });
    }, 500);
  });
}

export async function apiSignup(fullName: string, email: string, password: string): Promise<{ token: string; user: { id: string; fullName: string; email: string }; organizationId?: string }> {
  // Mock signup - in a real app, this would call the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "mock-jwt-token",
        user: {
          id: "1",
          fullName: fullName,
          email: email
        },
        organizationId: "1"
      });
    }, 500);
  });
}

// Campaigns
export async function apiFetchCampaigns(): Promise<{ id: string; name: string }[]> {
  // Mock campaigns - in a real app, this would call the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCampaigns);
    }, 500);
  });
}

// Calls list with filters and pagination
export interface CallFilterParams {
  campaignId: string;
  status?: string;
  agent?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function apiFetchCalls(params: CallFilterParams): Promise<{ calls: any[]; total: number }> {
  // Mock calls - in a real app, this would call the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      let calls = mockCalls[params.campaignId as keyof typeof mockCalls] || [];
      
      // Apply search filter if provided
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        calls = calls.filter(call => 
          call.agent.toLowerCase().includes(searchLower) || 
          call.status.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply status filter if provided
      if (params.status) {
        calls = calls.filter(call => call.status.toLowerCase() === params.status?.toLowerCase());
      }
      
      // Apply pagination
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCalls = calls.slice(startIndex, endIndex);
      
      resolve({
        calls: paginatedCalls,
        total: calls.length
      });
    }, 500);
  });
}

// Single call details
export const apiFetchCallDetails = async (callId: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // First try to find the call details directly
  if (mockCallDetails[callId]) {
    return mockCallDetails[callId];
  }

  // If not found, try to find the call in mockCalls and create a basic details object
  const allCalls = Object.values(mockCalls).flat();
  const call = allCalls.find(c => c.id === callId);
  if (call) {
    return {
      id: call.id,
      status: call.status,
      duration: call.duration,
      date: call.date,
      agent: call.agent,
      quality: {
        score: call.score,
        issues: [],
        trends: {
          clarity: "stable",
          empathy: "stable",
          professionalism: "stable"
        }
      },
      compliance: {
        status: "compliant",
        violations: [],
        score: 100
      },
      keywords: [],
      topics: [],
      sentiment: {
        overall: "neutral",
        score: 0.5
      }
    };
  }

  throw new Error("Call not found");
}

// Update call
export async function apiUpdateCall(callId: string, data: any): Promise<any> {
  // Mock update - in a real app, this would call the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, callId, ...data });
    }, 500);
  });
}

// Bulk update calls
export async function apiBulkUpdateCalls(payload: { callIds: string[]; status?: string; tagsToAdd?: string[]; tagsToRemove?: string[] }): Promise<any> {
  // Mock bulk update - in a real app, this would call the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, updatedCount: payload.callIds.length });
    }, 500);
  });
}

// Fetch user profile
export const apiFetchUserProfile = async () => {
  await delay(1000);
  return {
    name: "John Doe",
    email: "john.doe@example.com",
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    twoFactorEnabled: false
  };
};

// Update user profile
export const apiUpdateUserProfile = async (data: { name: string; email: string }) => {
  await delay(1000);
  return {
    success: true,
    data
  };
};

// Fetch organization settings
export async function apiFetchOrganizationSettings(): Promise<{ name: string; webhookUrl: string }> {
  // Mock settings - in a real app, this would call the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: "Test Organization", webhookUrl: "https://example.com/webhook" });
    }, 500);
  });
}

// Fetch team members list
export async function apiFetchTeamMembers(): Promise<{ email: string; role: string }[]> {
  // Mock team members - in a real app, this would call the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { email: "admin@example.com", role: "Admin" },
        { email: "manager@example.com", role: "Manager" },
        { email: "agent@example.com", role: "Agent" }
      ]);
    }, 500);
  });
}

// Invite a team member
export async function apiInviteTeamMember(
  email: string,
  role: string
): Promise<{ success: boolean }> {
  // Mock invite - in a real app, this would call the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
} 