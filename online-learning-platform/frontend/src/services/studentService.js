import { apiEndpoints } from "../constants/apiEndpoints";
import mainAxiosInstance from "../interceptor/api";
import Repository from "./repository";

class StudentService extends Repository {
  constructor() {
    super(apiEndpoints.STUDENTS);
  }

  async createStudent(studentData) {
    try {
      const response = await mainAxiosInstance.post(this.endpoint, studentData);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getAllStudents() {
    try {
      const response = await mainAxiosInstance.get(this.endpoint);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getStudentById(studentId) {
    try {
      const response = await mainAxiosInstance.get(
        `${this.endpoint}/${studentId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async updateStudent(studentId, studentData) {
    try {
      const response = await mainAxiosInstance.patch(
        `${this.endpoint}/${studentId}`,
        studentData
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async deleteStudent(studentId) {
    try {
      const response = await mainAxiosInstance.delete(
        `${this.endpoint}/${studentId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }
}

const studentService = new StudentService();
export default studentService;
