import React from 'react';
import { Icon } from '@material-ui/core';

const PdfChip = () => {
  return (
    <div className="pdf-chip">
      <div className="icon">
        <Icon className="icon-blue icon-small">picture_as_pdf</Icon>
      </div>
      <div className="pdf-chip-text">eFapiao</div>
    </div>
  );
};

export default PdfChip; 