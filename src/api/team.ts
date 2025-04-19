import { TeamMember } from '@/types/team';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock database
let mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://github.com/shadcn.png',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    status: 'active',
    avatar: 'https://github.com/shadcn.png',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'agent',
    status: 'active',
    avatar: 'https://github.com/shadcn.png',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'agent',
    status: 'pending',
  },
];

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  await delay(500);
  return mockTeamMembers;
}

export async function createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
  await delay(500);
  const newMember = {
    ...member,
    id: Math.random().toString(36).substr(2, 9),
  };
  mockTeamMembers.push(newMember);
  return newMember;
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
  await delay(500);
  const index = mockTeamMembers.findIndex(member => member.id === id);
  if (index === -1) {
    throw new Error('Team member not found');
  }
  mockTeamMembers[index] = { ...mockTeamMembers[index], ...updates };
  return mockTeamMembers[index];
}

export async function deleteTeamMember(id: string): Promise<void> {
  await delay(500);
  const index = mockTeamMembers.findIndex(member => member.id === id);
  if (index === -1) {
    throw new Error('Team member not found');
  }
  mockTeamMembers = mockTeamMembers.filter(member => member.id !== id);
}

export async function updateMemberRole(id: string, role: TeamMember['role']): Promise<TeamMember> {
  return updateTeamMember(id, { role });
}

export async function updateMemberStatus(id: string, status: TeamMember['status']): Promise<TeamMember> {
  return updateTeamMember(id, { status });
} 