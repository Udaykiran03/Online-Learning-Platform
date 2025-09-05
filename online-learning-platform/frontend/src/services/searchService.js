import { apiEndpoints } from "../constants/apiEndpoints";
import mainAxiosInstance from "../interceptor/api";
import Repository from "./repository";

class SearchService extends Repository {
  constructor() {
    super(apiEndpoints.SEARCH);
  }
  async getSearch(query) {
    try {
      const response = await mainAxiosInstance.get(`${this.endpoint}?${query}`);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }
}

const searchService = new SearchService();
export default searchService;
