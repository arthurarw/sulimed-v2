import axios from 'axios';

class AuthService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async login(username: string, password: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async logout(token: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/logout`, {}, {
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

export default AuthService;
