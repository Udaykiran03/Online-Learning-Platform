const LocalStorageRepository = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error getting localStorage item ${key}`);
      return null;
    }
  },

  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting localStorage item ${key}`);
    }
  },

  update: (key, update) => {
    try {
      const existingItem = LocalStorageRepository.get(key);

      if (typeof existingItem === "object" && existingItem !== null) {
        const updatedItem = { ...existingItem, ...update };
        LocalStorageRepository.set(key, updatedItem);
      } else {
        LocalStorageRepository.set(key, update);
      }
    } catch (error) {
      console.error(`Error updating localStorage item ${key}`);
    }
  },

  delete: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting localStorage item ${key}`);
    }
  },
};

export const storeUserInfo = (token) => {
  LocalStorageRepository.set("token", token);
};

export const updateUserInfoOnly = (token) => {
  LocalStorageRepository.update("token", token);
};

export const deleteUserInfo = () => {
  LocalStorageRepository.delete("token");
};

export default LocalStorageRepository;
