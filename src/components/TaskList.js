import React from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ status = 'all', page = 1 }) => {
  const { data, isLoading, isError, error } = useTasks(status, page, 10);

  if (isLoading) {
    return (
      <div className="task-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="task-list-container">
        <div className="error-message">
          <p>❌ Error loading tasks</p>
          <p className="error-details">{error?.message}</p>
        </div>
      </div>
    );
  }

  const { tasks = [], total = 0 } = data || {};

  if (tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="empty-state">
          <p>✨ No tasks yet</p>
          <p className="empty-text">
            {status === 'completed' ? 'No completed tasks' : 'No pending tasks'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <p className="task-count">
          Showing {tasks.length} of {total} tasks
        </p>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
