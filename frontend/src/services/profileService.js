import { authAPI } from './api';

import { questionsAPI } from './api';

export const profileService = {
  async getProfile() {
    const response = await authAPI.getProfile();
    return response.data;
  },
  async updateProfile(profileData) {
    const response = await authAPI.updateProfile(profileData);
    return response.data;
  },
  async getUserQuestions() {
    // Assumes backend returns only current user's questions if no userId is provided
    const response = await questionsAPI.getAll({ mine: true });
    return response.data;
  },
};


