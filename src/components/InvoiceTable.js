import React, { useState, useEffect } from 'react';
import { Icon } from '@material-ui/core';
import { Table, Popover } from 'antd';
import StatusChip from './StatusChip';
import PdfChip from './PdfChip';
import { invoiceData } from '../data/mockData';
import FilterRow from './FilterRow';

const InvoiceTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showPopover, setShowPopover] = useState(false);
  const [errorInvoiceId, setErrorInvoiceId] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [filteredData, setFilteredData] = useState(invoiceData);

  // Apply filters to data
  useEffect(() => {
    let newData = [...invoiceData];
    
    // Apply filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'All') {
        newData = newData.filter(item => {
          if (key === 'hasPdf') {
            return item[key] === (value === 'Yes');
          }
          
          if (typeof item[key] === 'string') {
            return item[key].toLowerCase().includes(value.toLowerCase());
          }
          
          return item[key] === value;
        });
      }
    });
    
    setFilteredData(newData);
  }, [filterValues]);

  // Handler for filter changes
  const handleFilterChange = (newFilterValues) => {
    setFilterValues(newFilterValues);
  };

  // Handler for clearing all filters
  const handleClearFilters = () => {
    setFilterValues({});
  };

  // Handler for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // Define expandable row content
  const expandedRowRender = (record) => {
    if (!record.childs || record.childs.length === 0) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fafafa' }}>
          <p><strong>详细信息：</strong> {record.id} - {record.customerName}</p>
          <p><strong>备注：</strong> {record.comment}</p>
        </div>
      );
    }

    const lineItemColumns = [
      {
        title: 'Line No.',
        dataIndex: 'lineNo',
        key: 'lineNo',
        width: 80,
      },
      {
        title: 'Part No.',
        dataIndex: 'partNo',
        key: 'partNo',
        width: 100,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 250,
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        width: 80,
        align: 'right',
      },
      {
        title: 'Unit Price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 120,
        align: 'right',
      },
      {
        title: 'Subtotal',
        dataIndex: 'subtotal',
        key: 'subtotal',
        width: 120,
        align: 'right',
      },
      {
        title: 'Tax Rate',
        dataIndex: 'taxRate',
        key: 'taxRate',
        width: 100,
        align: 'right',
      },
      {
        title: 'Tax Total',
        dataIndex: 'taxTotal',
        key: 'taxTotal',
        width: 100,
        align: 'right',
        className: 'highlighted-column',
      },
    ];

    return (
      <div style={{ padding: '10px', backgroundColor: '#fafafa' }}>
        <div style={{
          fontSize: '14px',
          color: '#44464f',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          lineHeight: '20px',
          letterSpacing: '0.1px',
          fontWeight: '500',
        }}>
          Invoice Details
        </div>
        <Table
          columns={lineItemColumns}
          dataSource={record.childs}
          pagination={false}
          bordered
          size="small"
          rowKey="lineNo"
          style={{
            borderRadius: '4px',
          }}
        />
      </div>
    );
  };

  // Handler for error cell click
  const handleErrorClick = (invoiceId) => {
    setErrorInvoiceId(invoiceId);
    setShowPopover(true);
  };

  // Define table columns
  const columns = [
    {
      title: 'Post Date',
      dataIndex: 'postDate',
      key: 'postDate',
      className: 'cell cell-date',
      width: 100,
      render: (text) => <div className="cell-text">{text}</div>,
    },
    {
      title: 'ERP Invoice ID',
      dataIndex: 'id',
      key: 'id',
      className: 'cell cell-id',
      width: 100,
      render: (text) => <div className="cell-text cell-link">{text}</div>,
    },
    {
      title: 'Fapiao Type',
      dataIndex: 'type',
      key: 'type',
      className: 'cell cell-type',
      width: 100,
      render: (text) => <div className="cell-text">{text}</div>,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      className: 'cell cell-customer',
      width: 100,
      render: (text) => <div className="cell-text">{text}</div>,
    },
    {
      title: 'Invoice Amount',
      dataIndex: 'amount',
      key: 'amount',
      className: 'cell cell-amount',
      width: 100,
      render: (text) => <div className="cell-text">{text}</div>,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      className: 'cell cell-comment',
      width: 100,
      render: (text) => <div className="cell-text">{text}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      className: 'cell cell-status',
      width: 100,
      render: (text, record) => (
        <div onClick={() => text === 'ERROR' && handleErrorClick(record.id)}>
          <StatusChip status={text} />
        </div>
      ),
    },
    {
      title: 'E-Invoice ID',
      dataIndex: 'einvoiceId',
      key: 'einvoiceId',
      className: 'cell cell-einvoice-id',
      width: 100,
      render: (text) => (
        text ? <div className="cell-text">{text}</div> : <div className="cell-empty">--</div>
      ),
    },
    {
      title: 'E-Invoice PDF',
      dataIndex: 'hasPdf',
      key: 'hasPdf',
      className: 'cell cell-pdf',
      width: 100,
      render: (hasPdf) => (
        hasPdf ? <PdfChip /> : <div className="cell-empty">--</div>
      ),
    },
    {
      title: 'E-Invoice Date',
      dataIndex: 'einvoiceDate',
      key: 'einvoiceDate',
      className: 'cell cell-einvoice-date',
      width: 100,
      render: (text) => (
        text ? <div className="cell-text">{text}</div> : <div className="cell-empty">--</div>
      ),
    },
    {
      title: 'E-Invoice Submitted By',
      dataIndex: 'submittedBy',
      key: 'submittedBy',
      className: 'cell cell-submitted-by',
      width: 100,
      render: (text) => (
        text ? <div className="cell-text">{text}</div> : <div className="cell-empty">--</div>
      ),
    },
  ];

  // Define table configurations
  const tableConfig = {
    rowSelection: rowSelection,
    expandable: {
      expandedRowRender,
      expandIcon: ({ expanded, onExpand, record, ...props }) => (
        <div className="icon" onClick={e => {
          console.log('onExpand', onExpand, props);
          onExpand(record, e)
        }}>
          <Icon className="icon-grey icon-medium icon-light">
            {expanded ? 'indeterminate_check_box' : 'add_box'}
          </Icon>
        </div>
      ),
      expandedRowKeys,
      onExpand: (expanded, record) => {
        console.log('expanded', expanded);
        console.log('record', record);
        setExpandedRowKeys(expanded ? [...expandedRowKeys, record.id] : expandedRowKeys.filter(id => id !== record.id));
      }
    },
    rowClassName: (record, index) => (
      index % 2 === 0 ? 'table-body-row' : 'table-body-row-alternate'
    ),

    dataSource: filteredData.map(item => ({ ...item, key: item.id })),
    columns: columns,
    pagination: true,
    bordered: false,
    className: 'invoice-table-ant',
    size: 'middle',
    rowKey: 'id',
    tableLayout: 'fixed',
    showHeader: false,
    style: { width: '100%' }
  };

  return (
    <div>
      {/* 自定义表头 */}
      <div className="custom-table-header">
        <div className="table-row">
          <div className=" cell-expand" style={{ display: 'flex', flex: 48, minWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
            <Icon className="icon-grey icon-medium icon-light">
              {'filter_alt'}
            </Icon>
          </div>
          <div className="cell-checkbox" style={{ display: 'flex', flex: 32, minWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
            <input style={{ width: '16px', height: '16px' }} type="checkbox" />
          </div>
          <div className="header-cell cell-date">
            <div className="cell-header-text">Post Date</div>
          </div>
          <div className="header-cell cell-id">
            <div className="cell-header-text">ERP Invoice ID</div>
          </div>
          <div className="header-cell cell-type">
            <div className="cell-header-text">Fapiao Type</div>
          </div>
          <div className="header-cell cell-customer">
            <div className="cell-header-text">Customer Name</div>
          </div>
          <div className="header-cell cell-amount">
            <div className="cell-header-text">Invoice Amount</div>
          </div>
          <div className="header-cell cell-comment">
            <div className="cell-header-text">Comment</div>
          </div>
          <div className="header-cell cell-status">
            <div className="cell-header-text">Status</div>
          </div>
          <div className="header-cell cell-einvoice-id">
            <div className="cell-header-text">E-Invoice ID</div>
          </div>
          <div className="header-cell cell-pdf">
            <div className="cell-header-text">E-Invoice PDF</div>
          </div>
          <div className="header-cell cell-einvoice-date">
            <div className="cell-header-text">E-Invoice Date</div>
          </div>
          <div className="header-cell cell-submitted-by">
            <div className="cell-header-text">E-Invoice Submitted By</div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <FilterRow 
        filterValues={filterValues} 
        onFilterChange={handleFilterChange} 
        onClearFilters={handleClearFilters} 
      />

      {/* Table Body - using Ant Design Table */}
      <Table {...tableConfig} />

      {/* Error popover */}
      {/* <Popover
        content={(
          <div>
            <div className="popover-title">Duplicate Request</div>
            <div className="popover-message">
              A fapiao has already been issued for the same invoice.
            </div>
          </div>
        )}
        visible={showPopover && errorInvoiceId === 'ERP8240'}
        onVisibleChange={(visible) => !visible && setShowPopover(false)}
        overlayClassName="error-popover"
        placement="top"
        trigger="click"
      /> */}
    </div>
  );
};

export default InvoiceTable; 