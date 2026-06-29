import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, fetchTask, createTask, updateTask, deleteTask } from '../api/mockApi';

const TASKS_QUERY_KEY = 'tasks';

// Hook to fetch all tasks with filtering and pagination
export const useTasks = (status = 'all', page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, status, page, pageSize],
    queryFn: () => fetchTasks(status, page, pageSize),
  });
};

// Hook to fetch single task
export const useTask = (id) => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, id],
    queryFn: () => fetchTask(id),
    enabled: !!id,
  });
};

// Hook to create new task
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title) => createTask(title),
    onSuccess: () => {
      // Invalidate the tasks query to refetch
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

// Hook to update task (with optimistic update)
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData([TASKS_QUERY_KEY, 'all', 1, 10]);
      const previousTasksPending = queryClient.getQueryData([TASKS_QUERY_KEY, 'pending', 1, 10]);
      const previousTasksCompleted = queryClient.getQueryData([TASKS_QUERY_KEY, 'completed', 1, 10]);

      // Optimistically update all relevant queries
      const updateQueryData = (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          tasks: oldData.tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
          ),
        };
      };

      queryClient.setQueryData([TASKS_QUERY_KEY, 'all', 1, 10], updateQueryData(previousTasks));
      queryClient.setQueryData([TASKS_QUERY_KEY, 'pending', 1, 10], updateQueryData(previousTasksPending));
      queryClient.setQueryData([TASKS_QUERY_KEY, 'completed', 1, 10], updateQueryData(previousTasksCompleted));
      queryClient.setQueryData([TASKS_QUERY_KEY, id], (oldData) =>
        oldData ? { ...oldData, ...updates } : oldData
      );

      return { previousTasks, previousTasksPending, previousTasksCompleted };
    },
    onError: (err, { id, updates }, context) => {
      // Rollback on error
      if (context) {
        queryClient.setQueryData([TASKS_QUERY_KEY, 'all', 1, 10], context.previousTasks);
        queryClient.setQueryData([TASKS_QUERY_KEY, 'pending', 1, 10], context.previousTasksPending);
        queryClient.setQueryData([TASKS_QUERY_KEY, 'completed', 1, 10], context.previousTasksCompleted);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

// Hook to delete task (with optimistic update)
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY] });

      const previousTasks = queryClient.getQueryData([TASKS_QUERY_KEY, 'all', 1, 10]);
      const previousTasksPending = queryClient.getQueryData([TASKS_QUERY_KEY, 'pending', 1, 10]);
      const previousTasksCompleted = queryClient.getQueryData([TASKS_QUERY_KEY, 'completed', 1, 10]);

      const removeFromQueryData = (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          tasks: oldData.tasks.filter(task => task.id !== id),
          total: Math.max(0, oldData.total - 1),
        };
      };

      queryClient.setQueryData([TASKS_QUERY_KEY, 'all', 1, 10], removeFromQueryData(previousTasks));
      queryClient.setQueryData([TASKS_QUERY_KEY, 'pending', 1, 10], removeFromQueryData(previousTasksPending));
      queryClient.setQueryData([TASKS_QUERY_KEY, 'completed', 1, 10], removeFromQueryData(previousTasksCompleted));

      return { previousTasks, previousTasksPending, previousTasksCompleted };
    },
    onError: (err, id, context) => {
      if (context) {
        queryClient.setQueryData([TASKS_QUERY_KEY, 'all', 1, 10], context.previousTasks);
        queryClient.setQueryData([TASKS_QUERY_KEY, 'pending', 1, 10], context.previousTasksPending);
        queryClient.setQueryData([TASKS_QUERY_KEY, 'completed', 1, 10], context.previousTasksCompleted);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};
