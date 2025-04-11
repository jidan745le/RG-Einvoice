import React from 'react';
import './styles/EInvoice.css';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import InvoiceContent from './components/InvoiceContent';

function App() {
  return (
    <div className="invoice-app">
      <TopBar />
      <div className="content-container">
        <Sidebar />
        <InvoiceContent />
      </div>
    </div>
  );
}

export default App; 