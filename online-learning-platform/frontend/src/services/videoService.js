import { apiEndpoints } from "../constants/apiEndpoints";
import mainAxiosInstance from "../interceptor/api";
import Repository from "./repository";

class VideoService extends Repository {
  constructor() {
    super(apiEndpoints.VIDEOS);
  }

  async createVideo(videoData) {
    try {
      const response = await mainAxiosInstance.post(this.endpoint, videoData);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getAllVideos() {
    try {
      const response = await mainAxiosInstance.get(this.endpoint);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getVideoById(videoId) {
    try {
      const response = await mainAxiosInstance.get(
        `${this.endpoint}/${videoId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async updateVideo(videoId, videoData) {
    try {
      const response = await mainAxiosInstance.patch(
        `${this.endpoint}/${videoId}`,
        videoData
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async deleteVideo(videoId) {
    try {
      const response = await mainAxiosInstance.delete(
        `${this.endpoint}/${videoId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }
}

const videoService = new VideoService();
export default videoService;
