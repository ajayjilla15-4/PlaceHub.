import { User, Job, Application, Alumni, InterviewExperience, Stats, MentorshipRequestData } from '../types';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'https://placehub-tflr.onrender.com'}/api`;

export const getAuthToken = (): string | null => localStorage.getItem('placehub_token');
export const setAuthToken = (token: string): void => localStorage.setItem('placehub_token', token);
export const removeAuthToken = (): void => localStorage.removeItem('placehub_token');

export const getStoredUser = (): User | null => {
  const user = localStorage.getItem('placehub_user');
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user: User): void => localStorage.setItem('placehub_user', JSON.stringify(user));
export const removeStoredUser = (): void => localStorage.removeItem('placehub_user');

const request = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
};

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  register: async (userData: Partial<User> & { password: string }): Promise<{ token: string; user: User }> => {
    const res = await request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setAuthToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  getProfile: (): Promise<{ user: User }> => request('/auth/me'),
  updateProfile: (updates: Partial<User>): Promise<{ user: User }> =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) }),

  // Stats
  getStats: (): Promise<Stats> => request<Stats>('/stats'),
  getHealth: (): Promise<{ status: string; uptime: number }> => request('/health'),

  // Jobs / Drives
  getJobs: (params: Record<string, string> = {}): Promise<Job[]> => {
    const query = new URLSearchParams(params).toString();
    return request<Job[]>(`/jobs${query ? `?${query}` : ''}`);
  },
  getJobById: (id: string): Promise<Job> => request<Job>(`/jobs/${id}`),
  createJob: (jobData: Partial<Job>): Promise<Job> =>
    request<Job>('/jobs', { method: 'POST', body: JSON.stringify(jobData) }),
  deleteJob: (id: string): Promise<{ message: string }> => request(`/jobs/${id}`, { method: 'DELETE' }),
  applyJob: (jobId: string): Promise<{ message: string; application: Application }> =>
    request<{ message: string; application: Application }>(`/jobs/${jobId}/apply`, { method: 'POST' }),

  // Applications
  getMyApplications: (): Promise<Application[]> => request<Application[]>('/applications/my'),
  getAllApplications: (): Promise<Application[]> => request<Application[]>('/applications/all'),
  updateApplicationStatus: (id: string, status: string, notes?: string): Promise<{ message: string; application: Application }> =>
    request(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),

  // Alumni & Mentorship
  getAlumni: (params: Record<string, string> = {}): Promise<Alumni[]> => {
    const query = new URLSearchParams(params).toString();
    return request<Alumni[]>(`/alumni${query ? `?${query}` : ''}`);
  },
  requestMentorship: (data: MentorshipRequestData): Promise<{ message: string; request: any }> =>
    request('/mentorship/request', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMyMentorships: (): Promise<any[]> => request('/mentorship/my'),
  updateMentorshipStatus: (id: string, status: string): Promise<{ message: string }> =>
    request(`/mentorship/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Experiences
  getExperiences: (params: Record<string, string> = {}): Promise<InterviewExperience[]> => {
    const query = new URLSearchParams(params).toString();
    return request<InterviewExperience[]>(`/experiences${query ? `?${query}` : ''}`);
  },
  createExperience: (data: Partial<InterviewExperience>): Promise<InterviewExperience> =>
    request<InterviewExperience>('/experiences', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  likeExperience: (id: string): Promise<{ likes: number }> =>
    request<{ likes: number }>(`/experiences/${id}/like`, { method: 'POST' }),
};
