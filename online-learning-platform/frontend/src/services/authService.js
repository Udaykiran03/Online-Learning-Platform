import { apiEndpoints } from "../constants/apiEndpoints";
import mainAxiosInstance from "../interceptor/api";
import Repository from "./repository";

class AuthService extends Repository {
  constructor() {
    super(apiEndpoints.AUTH_SERVICE);
  }

  async post(endpoint, data) {
    try {
      const response = await mainAxiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async onError(error) {
    throw error;
  }

  async register(userData) {
    try {
      const response = await this.post(apiEndpoints.AUTH_REGISTER, userData);
      return response;
    } catch (error) {
      return this.onError(error);
    }
  }

  async login(loginData) {
    try {
      const response = await this.post(apiEndpoints.AUTH_LOGIN, loginData);
      return response;
    } catch (error) {
      return this.onError(error);
    }
  }
}

const authService = new AuthService();
export default authService;
