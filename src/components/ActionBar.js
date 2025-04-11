import React from 'react';
import { Icon } from '@material-ui/core';

const ActionBar = () => {
  return (
    <div className="action-bar">
      <div className="action-group">
        <div className="action-button">
          <div className="icon">
            <Icon className="icon-lightgrey icon-medium icon-light">merge</Icon>
          </div>
          <div className="action-button-text">Merge</div>
        </div>
        
        <div className="action-button">
          <div className="icon">
            <Icon className="icon-lightgrey icon-medium icon-light">api</Icon>
          </div>
          <div className="action-button-text">Submit</div>
        </div>
        
        <div className="action-button">
          <div className="icon">
            <Icon className="icon-lightgrey icon-medium icon-light">block</Icon>
          </div>
          <div className="action-button-text">Red Note</div>
        </div>
      </div>
      
      <div className="action-group">
        <div className="action-button">
          <div className="icon">
            <Icon className="icon-lightgrey icon-medium icon-light">table</Icon>
          </div>
          <div className="action-button-text">Export</div>
        </div>
        
        <div className="action-button action-button-icon-only action-button-blue">
          <div className="icon">
            <Icon className="icon-blue icon-medium icon-light">settings</Icon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionBar; 