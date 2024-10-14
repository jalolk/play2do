import { create } from 'zustand';
import apiClient from '../utils/api-client';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>()((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/tasks');
      set({ tasks: response.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },
  addTask: async (title: string, description: string) => {
    try {
      const response = await apiClient.post('/tasks', { title, description });
      set((state) => ({ tasks: [...state.tasks, response.data] }));
    } catch (error) {
      set({ error: 'Failed to add task' });
    }
  },
  updateTask: async (id: number, updates: Partial<Task>) => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, updates);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? response.data : task,
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to update task' });
    }
  },
  deleteTask: async (id: number) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete task' });
    }
  },
}));
