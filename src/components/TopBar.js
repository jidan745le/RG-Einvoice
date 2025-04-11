import React from 'react';
import { Icon } from '@material-ui/core';

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="logo-container">
          <div className="top-bar-logo">
            <div className="icon">
              <Icon className="icon-primary icon-medium">water_drop</Icon>
            </div>
          </div>
          <div className="app-name">Purple Brand</div>
        </div>
        
        <div className="tabs">
          <div className="tab tab-selected">
            <div className="icon">
              <Icon className="icon-medium">receipt_long</Icon>
            </div>
            <div className="tab-label tab-label-selected">E-Invoice (China)</div>
          </div>
          
          <div className="tab">
            <div className="icon">
              <Icon className="icon-onprimary icon-medium icon-light">box</Icon>
            </div>
            <div className="tab-label">Lot Management</div>
          </div>
          
          <div className="vertical-divider"></div>
          
          <div className="tab">
            <div className="icon">
              <Icon className="icon-onprimary icon-medium icon-light">family_history</Icon>
            </div>
            <div className="tab-label">Cross Entity Orders</div>
          </div>
          
          <div className="vertical-divider"></div>
          
          <div className="tab">
            <div className="icon">
              <Icon className="icon-onprimary icon-medium icon-light">psychiatry</Icon>
            </div>
            <div className="tab-label">OMS</div>
          </div>
        </div>
        
        <div className="actions-container">
          <div className="language-selector">
            <div className="icon">
              <Icon className="icon-secondary icon-medium icon-light">language</Icon>
            </div>
            <div className="language-text">English</div>
            <div className="icon">
              <Icon className="icon-secondary icon-medium icon-light">arrow_drop_down</Icon>
            </div>
          </div>
          
          <div className="user-avatar">
            <div className="avatar-text">AB</div>
            {/* If you have an avatar image, uncomment this line */}
            {/* <img className="avatar-image" src="/path/to/avatar.png" alt="User Avatar" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 