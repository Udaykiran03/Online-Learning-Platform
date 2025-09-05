import { apiEndpoints } from "../constants/apiEndpoints";
import mainAxiosInstance from "../interceptor/api";
import Repository from "./repository";

class DepartmentService extends Repository {
  constructor() {
    super(apiEndpoints.DEPARTMENTS);
  }

  async createDepartment(departmentData) {
    try {
      const response = await mainAxiosInstance.post(
        this.endpoint,
        departmentData
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getAllDepartments() {
    try {
      const response = await mainAxiosInstance.get(this.endpoint);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getDepartmentById(departmentId) {
    try {
      const response = await mainAxiosInstance.get(
        `${this.endpoint}/${departmentId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async updateDepartment(departmentId, departmentData) {
    try {
      const response = await mainAxiosInstance.patch(
        `${this.endpoint}/${departmentId}`,
        departmentData
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async deleteDepartment(departmentId) {
    try {
      const response = await mainAxiosInstance.delete(
        `${this.endpoint}/${departmentId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }
}

const departmentService = new DepartmentService();
export default departmentService;
