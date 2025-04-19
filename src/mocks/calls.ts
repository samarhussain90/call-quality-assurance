export interface Call {
  id: string;
  phoneNumber: string;
  duration: number;
  status: "completed" | "failed" | "in-progress";
  timestamp: string;
  agent: string;
  notes?: string;
  transcript?: string;
  sentiment?: "positive" | "neutral" | "negative";
  tags?: string[];
  callType?: string;
  debtAmount?: number;
  recordingUrl?: string;
  // Call Quality Metrics
  call_result?: string;
  overall_score?: number;
  summary?: string;
  metrics?: {
    proper_greeting: {
      score: number;
      explanation: string;
    };
    needs_assessment: {
      score: number;
      explanation: string;
    };
    product_presentation: {
      score: number;
      explanation: string;
    };
    handling_objections: {
      score: number;
      explanation: string;
    };
    closing_techniques: {
      score: number;
      explanation: string;
    };
    approved_language: {
      score: number;
      explanation: string;
    };
    call_structure: {
      score: number;
      explanation: string;
    };
    compliance: {
      score: number;
      explanation: string;
    };
    customer_engagement: {
      score: number;
      explanation: string;
    };
    tone_and_pacing: {
      score: number;
      explanation: string;
    };
    handling_interruptions: {
      score: number;
      explanation: string;
    };
    company_policies: {
      score: number;
      explanation: string;
    };
    post_call_procedures: {
      score: number;
      explanation: string;
    };
    emotional_intelligence: {
      score: number;
      explanation: string;
    };
    prohibited_actions: {
      score: number;
      explanation: string;
    };
  };
}

// Mock data for calls organized by campaign
export const mockCallsByCampaign: Record<string, Call[]> = {
  "debt": [
    {
      id: "call-1",
      phoneNumber: "+1 (555) 123-4567",
      duration: 245,
      status: "completed",
      timestamp: "2024-03-15T10:00:00Z",
      agent: "John Doe",
      notes: "Customer interested in payment plan",
      transcript: "Agent: Hello, this is John from Neural Call. How can I help you today?\nCustomer: Hi, I'm interested in setting up a payment plan.\nAgent: I'd be happy to help you with that. Let me check your account...",
      sentiment: "positive",
      tags: ["payment-plan", "interested", "follow-up"],
      callType: "Outbound",
      debtAmount: 1250.00,
      recordingUrl: "https://example.com/recordings/call-1.mp3",
      call_result: "Successful payment plan setup",
      overall_score: 92,
      summary: "Excellent call handling with strong compliance and customer engagement",
      metrics: {
        proper_greeting: {
          score: 95,
          explanation: "Agent properly identified themselves and the company"
        },
        needs_assessment: {
          score: 90,
          explanation: "Thoroughly assessed customer's financial situation"
        },
        product_presentation: {
          score: 88,
          explanation: "Clearly explained payment plan options"
        },
        handling_objections: {
          score: 85,
          explanation: "Effectively addressed concerns about payment amounts"
        },
        closing_techniques: {
          score: 95,
          explanation: "Successfully secured agreement on payment plan"
        },
        approved_language: {
          score: 100,
          explanation: "Used only approved language throughout the call"
        },
        call_structure: {
          score: 90,
          explanation: "Followed proper call structure and flow"
        },
        compliance: {
          score: 100,
          explanation: "Fully compliant with all legal requirements"
        },
        customer_engagement: {
          score: 95,
          explanation: "Maintained high customer engagement throughout"
        },
        tone_and_pacing: {
          score: 90,
          explanation: "Appropriate tone and pacing maintained"
        },
        handling_interruptions: {
          score: 85,
          explanation: "Handled customer interruptions professionally"
        },
        company_policies: {
          score: 100,
          explanation: "Adhered to all company policies"
        },
        post_call_procedures: {
          score: 95,
          explanation: "Completed all required post-call procedures"
        },
        emotional_intelligence: {
          score: 90,
          explanation: "Demonstrated strong emotional intelligence"
        },
        prohibited_actions: {
          score: 100,
          explanation: "Avoided all prohibited actions"
        }
      }
    },
    {
      id: "call-2",
      phoneNumber: "+1 (555) 234-5678",
      duration: 180,
      status: "completed",
      timestamp: "2024-03-15T10:15:00Z",
      agent: "Jane Smith",
      notes: "Follow-up needed in 2 weeks",
      transcript: "Agent: Thank you for calling Neural Call. This is Jane speaking.\nCustomer: Hi, I have a question about my current plan...",
      sentiment: "neutral",
      tags: ["support", "billing"],
      callType: "Inbound",
      debtAmount: 750.00,
      recordingUrl: "https://example.com/recordings/call-2.mp3"
    }
  ],
  "roofing": [
    {
      id: "call-3",
      phoneNumber: "+1 (555) 345-6789",
      duration: 0,
      status: "failed",
      timestamp: "2024-03-20T14:00:00Z",
      agent: "Mike Johnson",
      notes: "No answer",
      callType: "Outbound",
      recordingUrl: "https://example.com/recordings/call-3.mp3"
    },
    {
      id: "call-4",
      phoneNumber: "+1 (555) 456-7890",
      duration: 300,
      status: "completed",
      timestamp: "2024-03-10T09:00:00Z",
      agent: "Sarah Wilson",
      notes: "Customer scheduled inspection for next week",
      transcript: "Customer: I'd like to schedule an inspection for my roof.\nAgent: I can help you with that. Let me check our availability...",
      sentiment: "positive",
      tags: ["inspection", "scheduled"],
      callType: "Inbound",
      recordingUrl: "https://example.com/recordings/call-4.mp3"
    }
  ],
  "medicare": [
    {
      id: "call-5",
      phoneNumber: "+1 (555) 567-8901",
      duration: 420,
      status: "completed",
      timestamp: "2024-03-05T11:30:00Z",
      agent: "David Lee",
      notes: "Customer enrolled in Medicare Advantage plan",
      transcript: "Agent: Have you considered our Medicare Advantage plan?\nCustomer: Yes, I'd like to learn more about it.\nAgent: Great! Let me walk you through the benefits...",
      sentiment: "positive",
      tags: ["enrollment", "medicare-advantage"],
      callType: "Outbound",
      recordingUrl: "https://example.com/recordings/call-5.mp3"
    },
    {
      id: "call-6",
      phoneNumber: "+1 (555) 678-9012",
      duration: 150,
      status: "completed",
      timestamp: "2024-03-07T15:45:00Z",
      agent: "Emily Brown",
      notes: "Customer requested information packet",
      transcript: "Customer: Can you send me some information about your plans?\nAgent: Of course! I'll have that sent to you right away.",
      sentiment: "neutral",
      tags: ["information-request"],
      callType: "Inbound",
      recordingUrl: "https://example.com/recordings/call-6.mp3"
    }
  ]
};

// Flattened version for the call detail page
export const mockCalls: Record<string, Call> = {
  "call-1": mockCallsByCampaign["debt"][0],
  "call-2": mockCallsByCampaign["debt"][1],
  "call-3": mockCallsByCampaign["roofing"][0],
  "call-4": mockCallsByCampaign["roofing"][1],
  "call-5": mockCallsByCampaign["medicare"][0],
  "call-6": mockCallsByCampaign["medicare"][1]
}; 