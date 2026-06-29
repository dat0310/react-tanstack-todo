import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import StatusFilter from './components/StatusFilter';
import './App.css';

function App() {
  const [status, setStatus] = useState('all');

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>📋 Advanced Task Manager</h1>
          <p>Manage your tasks efficiently with TanStack Query</p>
        </div>
      </header>

      <main className="app-container">
        <div className="app-content">
          <TaskForm />
          <StatusFilter status={status} onStatusChange={setStatus} />
          <TaskList status={status} page={1} />
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React, TanStack Query & localStorage Mock API</p>
      </footer>
    </div>
  );
}

export default App;
