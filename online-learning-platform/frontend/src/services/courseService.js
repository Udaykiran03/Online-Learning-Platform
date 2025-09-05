import { apiEndpoints } from "../constants/apiEndpoints";
import mainAxiosInstance from "../interceptor/api";
import Repository from "./repository";

class CourseService extends Repository {
  constructor() {
    super(apiEndpoints.COURSES);
  }

  async createCourse(courseData) {
    try {
      const response = await mainAxiosInstance.post(this.endpoint, courseData);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getAllCourses() {
    try {
      const response = await mainAxiosInstance.get(this.endpoint);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await mainAxiosInstance.get(
        `${this.endpoint}/${courseId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const response = await mainAxiosInstance.patch(
        `${this.endpoint}/${courseId}`,
        courseData
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async deleteCourse(courseId) {
    try {
      const response = await mainAxiosInstance.delete(
        `${this.endpoint}/${courseId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }
}

const courseService = new CourseService();
export default courseService;
