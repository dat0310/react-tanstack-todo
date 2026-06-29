// Mock API using localStorage with simulated delays
const STORAGE_KEY = 'tasks_db';

// Initialize localStorage with sample data if empty
const initializeMockData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const sampleTasks = [
      { id: 1, title: 'Learn React Hooks', completed: true, createdAt: new Date().toISOString() },
      { id: 2, title: 'Master TanStack Query', completed: false, createdAt: new Date().toISOString() },
      { id: 3, title: 'Build Task Manager App', completed: false, createdAt: new Date().toISOString() },
      { id: 4, title: 'Implement Optimistic Updates', completed: false, createdAt: new Date().toISOString() },
      { id: 5, title: 'Add Error Handling', completed: true, createdAt: new Date().toISOString() },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
  }
};

// Simulate network delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Get all tasks
export const fetchTasks = async (status = 'all', page = 1, pageSize = 10) => {
  await delay(300);
  
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  
  // Filter by status
  if (status === 'completed') {
    tasks = tasks.filter(t => t.completed);
  } else if (status === 'pending') {
    tasks = tasks.filter(t => !t.completed);
  }
  
  // Pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedTasks = tasks.slice(start, end);
  
  return {
    tasks: paginatedTasks,
    total: tasks.length,
    page,
    pageSize,
    hasMore: end < tasks.length,
  };
};

// Get single task
export const fetchTask = async (id) => {
  await delay(200);
  
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }
  
  return task;
};

// Create new task
export const createTask = async (title) => {
  if (!title || title.trim() === '') {
    throw new Error('Task title cannot be empty');
  }
  
  await delay(500);
  
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  
  const newTask = {
    id: Math.max(...tasks.map(t => t.id), 0) + 1,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  
  return newTask;
};

// Update task
export const updateTask = async (id, updates) => {
  await delay(400);
  
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    throw new Error(`Task with id ${id} not found`);
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  
  return tasks[taskIndex];
};

// Delete task
export const deleteTask = async (id) => {
  await delay(400);
  
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    throw new Error(`Task with id ${id} not found`);
  }
  
  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  
  return deletedTask;
};

// Initialize mock data on module load
initializeMockData();
