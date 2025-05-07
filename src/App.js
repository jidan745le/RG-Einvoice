import React, { useCallback, useState } from 'react';
import AppConfigProvider from './components/AppConfigProvider';
import InvoiceContent from './components/InvoiceContent';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import './styles/EInvoice.css';

function App() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [filterValues, setFilterValues] = useState({});

  // Remove unnecessary console.log that may cause extra renders
  // console.log('invoiceData', invoiceData);

  const handleFilterChange = useCallback((newFilters) => {
    // console.log('newFilters', newFilters);
    setFilterValues(newFilters);
  }, []);

  const handleDataChange = useCallback((newData) => {
    setInvoiceData(newData);
  }, []);



  return (
    <AppConfigProvider appcode="einvoice">
      <div className="invoice-app">
        <TopBar />
        <div className="content-container">
          <Sidebar
            invoiceData={invoiceData}
            onFilterChange={handleFilterChange}
            filterValues={filterValues}
          />
          <InvoiceContent
            onDataChange={handleDataChange}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </AppConfigProvider>
  );
}

export default App; 