import React from 'react';
import { Icon } from '@material-ui/core';
import StatusChip from './StatusChip';
import PdfChip from './PdfChip';

const TableRow = ({ invoice, isAlternate, onErrorClick }) => {
  const rowClass = isAlternate ? 'table-body-row-alternate' : 'table-body-row';
  
  return (
    <div className={`table-row ${rowClass}`}>
      <div className="cell cell-checkbox">
        <div className="icon">
          <Icon className="icon-grey icon-medium icon-light">check_box_outline_blank</Icon>
        </div>
      </div>
      
      <div className="cell cell-expand">
        <div className="icon">
          <Icon className="icon-grey icon-medium icon-light">add_box</Icon>
        </div>
      </div>
      
      <div className="cell cell-date">
        <div className="cell-text">{invoice.postDate}</div>
      </div>
      
      <div className="cell cell-id">
        <div className="cell-text cell-link">{invoice.id}</div>
      </div>
      
      <div className="cell cell-type">
        <div className="cell-text">{invoice.type}</div>
      </div>
      
      <div className="cell cell-customer">
        <div className="cell-text">{invoice.customerName}</div>
      </div>
      
      <div className="cell cell-amount">
        <div className="cell-text">{invoice.amount}</div>
      </div>
      
      <div className="cell cell-comment">
        <div className="cell-text">{invoice.comment}</div>
      </div>
      
      <div className="cell cell-status" onClick={invoice.status === 'ERROR' ? onErrorClick : undefined}>
        <StatusChip status={invoice.status} />
      </div>
      
      <div className="cell cell-einvoice-id">
        {invoice.einvoiceId ? (
          <div className="cell-text">{invoice.einvoiceId}</div>
        ) : (
          <div className="cell-empty">--</div>
        )}
      </div>
      
      <div className="cell cell-pdf">
        {invoice.hasPdf ? (
          <PdfChip />
        ) : (
          <div className="cell-empty">--</div>
        )}
      </div>
      
      <div className="cell cell-einvoice-date">
        {invoice.einvoiceDate ? (
          <div className="cell-text">{invoice.einvoiceDate}</div>
        ) : (
          <div className="cell-empty">--</div>
        )}
      </div>
      
      <div className="cell cell-submitted-by">
        {invoice.submittedBy ? (
          <div className="cell-text">{invoice.submittedBy}</div>
        ) : (
          <div className="cell-empty">--</div>
        )}
      </div>
    </div>
  );
};

export default TableRow; 