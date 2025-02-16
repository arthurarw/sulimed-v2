import axios, { AxiosInstance } from 'axios';

class AuthService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://179.108.169.90:8088/ecard',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  async login(username: string, password: string): Promise<{ id: number, name: string, token: string }> {
    try {
      /*const response = await axios.post(`/login`, {
        username,
        password
      });

      return response.data;*/

      return { id: 1, name: 'admin', token: 'bla' };
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async logout(token: string) {
    try {
      const response = await axios.post(`/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
}

export default new AuthService();
