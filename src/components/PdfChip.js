import { Icon } from '@material-ui/core';
import React from 'react';

const PdfChip = ({ record }) => {
  return (
    <div style={{cursor: 'pointer'}} onClick={() => {
      console.log('record', record);
      window.open(record.eInvoicePdf, '_blank');
    }} className="pdf-chip">
      <div className="icon">
        <Icon className="icon-blue icon-small">picture_as_pdf</Icon>
      </div>
      <div className="pdf-chip-text">eFapiao</div>
    </div>
  );
};

export default PdfChip; 