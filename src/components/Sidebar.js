import React from 'react';

const Sidebar = () => {
  // Status items data
  const menuItems = [
    { id: 'viewAll', label: 'View All', count: 151, active: true },
    { id: 'pending', label: 'Pending', count: 30, active: false },
    { id: 'submitted', label: 'Submitted', count: 88, active: false },
    { id: 'error', label: 'Error', count: 32, active: false },
    { id: 'redNote', label: 'Red Note', count: 1, active: false }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <div className="sidebar-title-text">Invoice Status</div>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <div 
            key={item.id}
            className={`menu-item ${item.active ? 'menu-item-active' : ''}`}
          >
            <div className="menu-item-label">{item.label}</div>
            <div className="menu-item-badge">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 