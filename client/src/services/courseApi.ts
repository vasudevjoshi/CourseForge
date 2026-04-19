import axios from 'axios';
import type { CourseResponse } from '../types/course';

const BASE_URL = 'http://localhost:8080/api/course';

export const generateCourse = async (topic: string): Promise<CourseResponse> => {
  const response = await axios.post<CourseResponse>(`${BASE_URL}/generate`, { topic });
  return response.data;
};
