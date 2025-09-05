import mainAxiosInstance from "../interceptor/api";

class Repository {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async get(id) {
    const url = id ? `${this.endpoint}/${id}` : this.endpoint;
    try {
      const response = await mainAxiosInstance.get(url);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async post(id, data) {
    const url = `${this.endpoint}/${id}`;
    try {
      const response = await mainAxiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async patch(id, data) {
    const url = `${this.endpoint}/${id}`;
    try {
      const response = await mainAxiosInstance.patch(url, data);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async patch(id, data) {
    let url;
    if (data?.query) {
      url = `${this.endpoint}/${id}?${data?.query}`;
    } else {
      url = `${this.endpoint}/${id}`;
    }
    try {
      const response = await mainAxiosInstance.patch(url, data);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async delete(id) {
    const url = `${this.endpoint}/${id}`;
    try {
      const response = await mainAxiosInstance.delete(url);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  onError(error) {
    throw error;
  }
}

export default Repository;
