import React from 'react';
import ActionBar from './ActionBar';
import InvoiceTable from './InvoiceTable';

const InvoiceContent = ({ onDataChange, filterValues, onFilterChange }) => {
  return (
    <div className="main-content">
      <ActionBar />
      <InvoiceTable
        onDataChange={onDataChange}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};

export default InvoiceContent; 