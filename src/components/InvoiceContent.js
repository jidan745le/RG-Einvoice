import React from 'react';
import ActionBar from './ActionBar';
import InvoiceTable from './InvoiceTable';

const InvoiceContent = () => {
  return (
    <div className="main-content">
      <ActionBar />
      <InvoiceTable />
    </div>
  );
};

export default InvoiceContent; 