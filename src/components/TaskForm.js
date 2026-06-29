import React, { useState } from 'react';
import { useCreateTask } from '../hooks/useTasks';
import './TaskForm.css';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const createTaskMutation = useCreateTask();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim()) {
      await createTaskMutation.mutateAsync(title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new task..."
          disabled={createTaskMutation.isPending}
          className="form-input"
        />
        <button
          type="submit"
          disabled={createTaskMutation.isPending || !title.trim()}
          className="form-button"
        >
          {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
        </button>
      </div>
      {createTaskMutation.isError && (
        <div className="form-error">
          Error: {createTaskMutation.error?.message}
        </div>
      )}
    </form>
  );
};

export default TaskForm;
