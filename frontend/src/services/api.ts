import {
  User,
  Job,
  Application,
  Alumni,
  InterviewExperience,
  Stats,
  MentorshipRequestData,
} from '../types';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL ||
  'https://placehub-tflr.onrender.com'
  }/api`;

// ============================================
// AUTHENTICATION STORAGE
// ============================================

export const getAuthToken = (): string | null => {
  return localStorage.getItem('placehub_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('placehub_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('placehub_token');
};

export const getStoredUser = (): User | null => {
  const token = localStorage.getItem('placehub_token');
  const storedUser = localStorage.getItem('placehub_user');

  // A stored user without a token is not an authenticated session.
  if (!token || !storedUser) {
    localStorage.removeItem('placehub_token');
    localStorage.removeItem('placehub_user');
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem('placehub_token');
    localStorage.removeItem('placehub_user');
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  localStorage.setItem('placehub_user', JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem('placehub_user');
};

// Clear both pieces of authentication data.
export const clearAuthSession = (): void => {
  removeAuthToken();
  removeStoredUser();
};

// ============================================
// API REQUEST HANDLER
// ============================================

const request = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  // Clear an invalid session when a protected request returns 401.
  if (response.status === 401 && token) {
    clearAuthSession();
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data as T;
};

// ============================================
// PLACEHUB API
// ============================================

export const api = {
  // ------------------------------------------
  // AUTHENTICATION
  // ------------------------------------------

  login: async (
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> => {
    const response = await request<{ token: string; user: User }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    setAuthToken(response.token);
    setStoredUser(response.user);

    return response;
  },

  register: async (
    userData: Partial<User> & { password: string }
  ): Promise<{ token: string; user: User }> => {
    const response = await request<{ token: string; user: User }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      }
    );

    setAuthToken(response.token);
    setStoredUser(response.user);

    return response;
  },

  getProfile: (): Promise<{ user: User }> => {
    return request<{ user: User }>('/auth/me');
  },

  updateProfile: (
    updates: Partial<User>
  ): Promise<{ user: User }> => {
    return request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // ------------------------------------------
  // STATISTICS
  // ------------------------------------------

  getStats: (): Promise<Stats> => {
    return request<Stats>('/stats');
  },

  getHealth: (): Promise<{ status: string; uptime: number }> => {
    return request<{ status: string; uptime: number }>('/health');
  },

  // ------------------------------------------
  // JOBS AND PLACEMENT DRIVES
  // ------------------------------------------

  getJobs: (
    params: Record<string, string> = {}
  ): Promise<Job[]> => {
    const query = new URLSearchParams(params).toString();

    return request<Job[]>(
      `/jobs${query ? `?${query}` : ''}`
    );
  },

  getJobById: (id: string): Promise<Job> => {
    return request<Job>(`/jobs/${id}`);
  },

  createJob: (jobData: Partial<Job>): Promise<Job> => {
    return request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  deleteJob: (id: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  applyJob: (
    jobId: string
  ): Promise<{ message: string; application: Application }> => {
    return request<{ message: string; application: Application }>(
      `/jobs/${jobId}/apply`,
      {
        method: 'POST',
      }
    );
  },

  // ------------------------------------------
  // APPLICATIONS
  // ------------------------------------------

  getMyApplications: (): Promise<Application[]> => {
    return request<Application[]>('/applications/my');
  },

  getAllApplications: (): Promise<Application[]> => {
    return request<Application[]>('/applications/all');
  },

  updateApplicationStatus: (
    id: string,
    status: string,
    notes?: string
  ): Promise<{ message: string; application: Application }> => {
    return request<{ message: string; application: Application }>(
      `/applications/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }
    );
  },

  // ------------------------------------------
  // ALUMNI DIRECTORY
  // ------------------------------------------

  getAlumni: (
    params: Record<string, string> = {}
  ): Promise<Alumni[]> => {
    const query = new URLSearchParams(params).toString();

    return request<Alumni[]>(
      `/alumni${query ? `?${query}` : ''}`
    );
  },

  // ------------------------------------------
  // MENTORSHIP
  // ------------------------------------------

  requestMentorship: (
    data: MentorshipRequestData
  ): Promise<{ message: string; request: any }> => {
    return request<{ message: string; request: any }>(
      '/mentorship/request',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  getMyMentorships: (): Promise<any[]> => {
    return request<any[]>('/mentorship/my');
  },

  updateMentorshipStatus: (
    id: string,
    status: string
  ): Promise<{ message: string }> => {
    return request<{ message: string }>(
      `/mentorship/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  },

  // ------------------------------------------
  // INTERVIEW EXPERIENCES
  // ------------------------------------------

  getExperiences: (
    params: Record<string, string> = {}
  ): Promise<InterviewExperience[]> => {
    const query = new URLSearchParams(params).toString();

    return request<InterviewExperience[]>(
      `/experiences${query ? `?${query}` : ''}`
    );
  },

  createExperience: (
    data: Partial<InterviewExperience>
  ): Promise<InterviewExperience> => {
    return request<InterviewExperience>('/experiences', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  likeExperience: (
    id: string
  ): Promise<{ likes: number }> => {
    return request<{ likes: number }>(
      `/experiences/${id}/like`,
      {
        method: 'POST',
      }
    );
  },
};