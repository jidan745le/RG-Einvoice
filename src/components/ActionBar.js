import { Icon } from '@material-ui/core';
import { Button, message, Tooltip } from 'antd';
import React from 'react';
import axiosInstance from '../utils/axiosConfig';

const ActionBar = ({ selectedInvoices = [], onRefresh, currentStatus }) => {
  // Check if all selected invoices have status 'PENDING'
  const allPending = selectedInvoices.length > 0 &&
    selectedInvoices.every(invoice => invoice.status === 'PENDING');

  // Check if all selected invoices have status 'SUBMITTED'
  const allSubmitted = selectedInvoices.length > 0 &&
    selectedInvoices.every(invoice => invoice.status === 'SUBMITTED');

  // Check if all selected invoices are from the same customer (for merge button)
  const sameCustomer = selectedInvoices.length > 0 &&
    selectedInvoices.every(invoice =>
      invoice.customerName === selectedInvoices[0].customerName
    );

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
        const response = await axiosInstance.post(`/invoice/${invoice.id}/submit`, { submittedBy });
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

  // Handle export action for invoices
  const handleExport = async () => {
    if (!allPending || selectedInvoices.length === 0) return;
    try {
      const epicorIds = selectedInvoices.map(inv => inv.id);
      const response = await axiosInstance.post(
        '/excel/export',
        { epicorIds },
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice_export.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败', error);
      message.error('导出失败，请重试');
    }
  };

  const handleRedNote = async () => {
    if (!allSubmitted || selectedInvoices.length === 0) return;

    try {
      const submittedBy = localStorage.getItem('username') || 'current_user';
      let allSuccessful = true;

      for (const invoice of selectedInvoices) {
        const response = await axiosInstance.post(`/invoice/${invoice.id}/red`, { submittedBy });

        if (response.status !== 200) {
          allSuccessful = false;
          message.error(`Failed to submit red note for invoice ${invoice.id}`);
        }
      }

      if (allSuccessful) {
        message.success(`Successfully submitted red note for ${selectedInvoices.length} invoice(s)`);
        if (typeof onRefresh === 'function') {
          onRefresh();
        }
      }
    } catch (error) {
      console.error('Error submitting red note:', error);
      message.error(`Error submitting red note: ${error?.response?.data?.error}`);
    }
  };

  const handleMerge = async () => {
    if (!sameCustomer || !allPending || selectedInvoices.length === 0) return;

    try {
      const submittedBy = localStorage.getItem('username') || 'current_user';
      const erpInvoiceIds = selectedInvoices.map(invoice => invoice.id);

      const response = await axiosInstance.post('/invoice/merge', {
        erpInvoiceIds,
        submittedBy
      });

      if (response.status === 200) {
        message.success(`Successfully merged ${selectedInvoices.length} invoice(s)`);
        if (typeof onRefresh === 'function') {
          onRefresh();
        }
      } else {
        message.error('Failed to merge invoices');
      }
    } catch (error) {
      console.error('Error merging invoices:', error);
      message.error(`Error merging invoices: ${error?.response?.data?.error || error.message}`);
    }
  };

  console.log("currentStatus", currentStatus);

  return (
    <div className="action-bar">
      <div className="action-group">

        <>
          {(!currentStatus || currentStatus === 'PENDING' || currentStatus === 'ERROR') && (
            <Tooltip title={!sameCustomer ? "All invoices must be from the same customer to merge" : ""}>
              <Button
                style={buttonStyle}
                disabled={!sameCustomer || !allPending}
                onClick={handleMerge}
                icon={<Icon className={(sameCustomer && allPending) ? "icon-medium" : "icon-lightgrey icon-medium icon-light"}>merge</Icon>}
              >
                Merge
              </Button>
            </Tooltip>
          )}

          {(!currentStatus || currentStatus === 'PENDING' || currentStatus === 'ERROR') && (
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
          )}

          {(!currentStatus || currentStatus === 'SUBMITTED') && (
            <Button
              style={buttonStyle}
              disabled={!allSubmitted}
              onClick={handleRedNote}
              icon={<Icon className={allSubmitted ? "icon-medium" : "icon-lightgrey icon-medium icon-light"}>block</Icon>}
            >
              Red Note
            </Button>
          )}
        </>



      </div>

      <div className="action-group">
        <Button
          style={buttonStyle}
          disabled={!allPending}
          onClick={handleExport}
          icon={<Icon className={allPending ? "icon-medium" : "icon-lightgrey icon-medium icon-light"}>table</Icon>}
        >
          Export
        </Button>

      </div>
    </div>
  );
};

export default ActionBar; 