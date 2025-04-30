import { Icon } from '@material-ui/core';
import React from 'react';

const StatusChip = ({ status }) => {
  // Configure the chip based on status
  const getChipConfig = () => {
    switch (status) {
      case 'SUBMITTED':
        return {
          className: 'status-chip status-submitted',
          textClassName: 'status-chip-text status-submitted-text',
          text: 'Submitted',
          icon: null
        };
      case 'PENDING':
        return {
          className: 'status-chip status-pending',
          textClassName: 'status-chip-text status-pending-text',
          text: 'Pending',
          icon: null
        };
      case 'ERROR':
        return {
          className: 'status-chip status-error',
          textClassName: 'status-chip-text status-error-text',
          text: 'Error',
          icon: 'error'
        };
      case 'RED_NOTE':
        return {
          className: 'status-chip status-red-note',
          textClassName: 'status-chip-text status-red-note-text',
          text: 'Red Note',
          icon: null
        };
      default:
        return {
          className: 'status-chip',
          textClassName: 'status-chip-text',
          text: status,
          icon: null
        };
    }
  };

  const config = getChipConfig();

  return (
    <div className={config.className} style={{ cursor: 'default' }}>
      {config.icon && (
        <div className="icon">
          <Icon className="icon-small">{config.icon}</Icon>
        </div>
      )}
      <div className={config.textClassName}>{config.text}</div>
    </div>
  );
};

export default StatusChip; 