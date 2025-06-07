
import { ApiError, Skip } from '../types/skip';

class ApiService {
  private baseUrl: string;
  
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || 'https://app.wewantwaste.co.uk/api';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError({
        message: errorData.message || `HTTP error! status: ${response.status}`,
        status: response.status,
        details: errorData
      });
    }
    
    return response.json();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        message: error instanceof Error ? error.message : 'Network error occurred',
        status: 0,
        details: error
      });
    }
  }

  // Only keep GET since we only need to fetch skips
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // Specific method for skips
  async getSkipsByLocation(
    postcode: string = import.meta.env.VITE_DEFAULT_POSTCODE || 'NR32',
    area: string = import.meta.env.VITE_DEFAULT_AREA || 'Lowestoft'
  ): Promise<Skip[]> {
    const response = await this.get<Skip[] | { data: Skip[] }>(
      `/skips/by-location?postcode=${postcode}&area=${area}`
    );
    
    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    } else if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
