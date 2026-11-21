const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const cleanBase = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;

const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('salonbook_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network request failed. Please check your connection.');
  }
};

// ImgBB Image Upload Utility
export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    // If no ImgBB API key provided in env, convert to data URL or return curated salon image URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (data.success && data.data?.url) {
    return data.data.url;
  }

  throw new Error(data.error?.message || 'Failed to upload image to ImgBB.');
};
