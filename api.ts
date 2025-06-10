interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'paused';
  stats: {
    clicks: number;
    budget: number;
  };
}

interface Creative {
  id: number;
  name: string;
  preview: string;
  stats: {
    impressions: number;
  };
}

const API_BASE = '/api';

export async function getCampaigns(): Promise<Campaign[]> {
  const response = await fetch(`${API_BASE}/campaigns`);
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }
  return response.json();
}

export async function updateCampaignStatus(id: number, status: 'active' | 'paused'): Promise<void> {
  const response = await fetch(`${API_BASE}/campaigns/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update campaign status');
  }
}

export async function getCreatives(): Promise<Creative[]> {
  const response = await fetch(`${API_BASE}/creatives`);
  if (!response.ok) {
    throw new Error('Failed to fetch creatives');
  }
  return response.json();
}

export async function uploadCreative(file: File): Promise<Creative> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/creatives/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload creative');
  }
  return response.json();
}

export async function toggleAutopilot(enabled: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/autopilot`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enabled }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle autopilot');
  }
}

export async function getAutopilotStatus(): Promise<boolean> {
  const response = await fetch(`${API_BASE}/autopilot`);
  if (!response.ok) {
    throw new Error('Failed to get autopilot status');
  }
  const data = await response.json();
  return data.enabled;
} 