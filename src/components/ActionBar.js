import { Icon } from '@material-ui/core';
import { Button, message, Tooltip } from 'antd';
import axios from 'axios';
import React from 'react';

const ActionBar = ({ selectedInvoices = [], onRefresh }) => {
  // Check if all selected invoices have status 'PENDING'
  const allPending = selectedInvoices.length > 0 &&
    selectedInvoices.every(invoice => invoice.status === 'PENDING');

  // Check if all selected invoices have status 'SUBMITTED'
  const allSubmitted = selectedInvoices.length > 0 &&
    selectedInvoices.every(invoice => invoice.status === 'SUBMITTED');

  // Button style based on the original action-button class
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    gap: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: 'none',
  };

  const iconButtonStyle = {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    padding: '0',
  };

  // Handle submit action for invoices
  const handleSubmit = async () => {
    if (!allPending || selectedInvoices.length === 0) return;

    try {
      // Get current user or use a default
      const submittedBy = localStorage.getItem('username') || 'current_user';
      let allSuccessful = true;

      // Submit each invoice in sequence
      for (const invoice of selectedInvoices) {
        const response = await axios.post(`/e-invoice/api/${invoice.id}/submit`, 
          { submittedBy },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        console.log(response);

        if (response.status !== 200) {
          allSuccessful = false;
          message.error(`Failed to submit invoice ${invoice.id}`);
        }
      }

      if (allSuccessful) {
        // Show success message
        message.success(`Successfully submitted ${selectedInvoices.length} invoice(s)`);
        
        // Refresh the data by calling the onRefresh function if provided
        if (typeof onRefresh === 'function') {
          onRefresh();
        }
      }
    } catch (error) {
      console.error('Error submitting invoices:', error);
      message.error(`Error submitting invoices: ${error?.response?.data?.error}`);
    }
  };

  return (
    <div className="action-bar">
      <div className="action-group">
        <Tooltip title={!allPending ? "Only pending invoices can be merged" : ""}>
          <Button
            style={buttonStyle}
            disabled={!allPending}
            icon={<Icon className={allPending ? "icon-medium" : "icon-lightgrey icon-medium icon-light"}>merge</Icon>}
          >
            Merge
          </Button>
        </Tooltip>

        <Tooltip title={!allPending ? "Only pending invoices can be submitted" : ""}>
          <Button
            style={buttonStyle}
            disabled={!allPending}
            onClick={() => {
              handleSubmit();
            }}
            icon={<Icon className={allPending ? "icon-medium" : "icon-lightgrey icon-medium icon-light"}>api</Icon>}
          >
            Submit
          </Button>
        </Tooltip>

        <Tooltip title={!allSubmitted ? "Only submitted invoices can be marked as Red Note" : ""}>
          <Button
            style={buttonStyle}
            disabled={!allSubmitted}
            icon={<Icon className={allSubmitted ? "icon-medium" : "icon-lightgrey icon-medium icon-light"}>block</Icon>}
          >
            Red Note
          </Button>
        </Tooltip>
      </div>

      <div className="action-group">
        <Button
          style={buttonStyle}
          icon={<Icon className="icon-medium">table</Icon>}
        >
          Export
        </Button>

        <Button
          type="primary"
          style={iconButtonStyle}
          icon={<Icon className="icon-blue icon-medium icon-light">settings</Icon>}
        />
      </div>
    </div>
  );
};

export default ActionBar; 