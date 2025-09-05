import { apiEndpoints } from "../constants/apiEndpoints";
import mainAxiosInstance from "../interceptor/api";
import Repository from "./repository";

class TeacherService extends Repository {
  constructor() {
    super(apiEndpoints.TEACHERS);
  }

  async createTeacher(teacherData) {
    try {
      const response = await mainAxiosInstance.post(this.endpoint, teacherData);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getAllTeachers() {
    try {
      const response = await mainAxiosInstance.get(this.endpoint);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getTeacherById(teacherId) {
    try {
      const response = await mainAxiosInstance.get(
        `${this.endpoint}/${teacherId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async updateTeacher(teacherId, teacherData) {
    try {
      const response = await mainAxiosInstance.patch(
        `${this.endpoint}/${teacherId}`,
        teacherData
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async deleteTeacher(teacherId) {
    try {
      const response = await mainAxiosInstance.delete(
        `${this.endpoint}/${teacherId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }
}

const teacherService = new TeacherService();
export default teacherService;
