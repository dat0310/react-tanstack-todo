import React from 'react';
import { useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import './TaskItem.css';

const TaskItem = ({ task }) => {
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleToggleComplete = async () => {
    await updateTaskMutation.mutateAsync({
      id: task.id,
      updates: { completed: !task.completed },
    });
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      await deleteTaskMutation.mutateAsync(task.id);
    }
  };

  const isLoading = updateTaskMutation.isPending || deleteTaskMutation.isPending;

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''} ${isLoading ? 'loading' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={isLoading}
          className="task-checkbox"
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="task-title">{task.title}</span>
      </div>
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="delete-button"
        aria-label={`Delete task ${task.title}`}
      >
        {deleteTaskMutation.isPending ? '...' : '🗑️'}
      </button>
    </li>
  );
};

export default TaskItem;
