import React, { useState } from 'react';
import './styles/EInvoice.css';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import InvoiceContent from './components/InvoiceContent';

function App() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [filterValues, setFilterValues] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilterValues(newFilters);
  };

  return (
    <div className="invoice-app">
      <TopBar />
      <div className="content-container">
        <Sidebar
          invoiceData={invoiceData}
          onFilterChange={handleFilterChange}
          filterValues={filterValues}
        />
        <InvoiceContent
          onDataChange={setInvoiceData}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

export default App; 