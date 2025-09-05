import { apiEndpoints } from "../constants/apiEndpoints";
import mainAxiosInstance from "../interceptor/api";
import Repository from "./repository";

class NoteService extends Repository {
  constructor() {
    super(apiEndpoints.NOTES);
  }

  async createNote(noteData) {
    try {
      const response = await mainAxiosInstance.post(this.endpoint, noteData);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getAllNotes() {
    try {
      const response = await mainAxiosInstance.get(this.endpoint);
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async getNoteById(noteId) {
    try {
      const response = await mainAxiosInstance.get(
        `${this.endpoint}/${noteId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async updateNote(noteId, noteData) {
    try {
      const response = await mainAxiosInstance.patch(
        `${this.endpoint}/${noteId}`,
        noteData
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }

  async deleteNote(noteId) {
    try {
      const response = await mainAxiosInstance.delete(
        `${this.endpoint}/${noteId}`
      );
      return response.data;
    } catch (error) {
      return this.onError(error);
    }
  }
}

const noteService = new NoteService();
export default noteService;
