import React, { useCallback, useRef, useState } from 'react';
import ActionBar from './ActionBar';
import InvoiceTable from './InvoiceTable';

const InvoiceContent = ({ onDataChange, filterValues, onFilterChange }) => {
  const [invoiceDataItems, setInvoiceDataItems] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const tableRef = useRef(null);
  
  // Handle when invoice selection changes
  const handleSelectionChange = (selectedInvoiceIds, selectedRows) => {
    setSelectedInvoices(selectedRows);
  };
  
  // Use useCallback to prevent re-creation of this function on every render
  const handleDataChange = useCallback((data) => {
    setInvoiceDataItems(data.items || []);
    
    // Only call parent onDataChange if actually needed
    if (onDataChange) {
      onDataChange(data);
    }
  }, [onDataChange]);
  
  // Create a refresh handler that calls the fetchData method on the table
  const handleRefresh = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.fetchData();
      tableRef.current.clearSelection();
      setSelectedInvoices([]);
    }
  }, []);
  
  return (
    <div className="main-content">
      <ActionBar 
        selectedInvoices={selectedInvoices} 
        onRefresh={handleRefresh}
      />
      <InvoiceTable
        ref={tableRef}
        onDataChange={handleDataChange}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default InvoiceContent; 