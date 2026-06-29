import React from 'react';
import './StatusFilter.css';

const StatusFilter = ({ status, onStatusChange }) => {
  const filters = [
    { value: 'all', label: 'All Tasks', icon: '📋' },
    { value: 'pending', label: 'Pending', icon: '⏳' },
    { value: 'completed', label: 'Completed', icon: '✅' },
  ];

  return (
    <div className="status-filter">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onStatusChange(filter.value)}
          className={`filter-button ${status === filter.value ? 'active' : ''}`}
          aria-pressed={status === filter.value}
        >
          <span className="filter-icon">{filter.icon}</span>
          <span className="filter-label">{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
