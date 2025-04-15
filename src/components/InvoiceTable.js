import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@material-ui/core';
import { Table, Popover, Tooltip } from 'antd';
import StatusChip from './StatusChip';
import PdfChip from './PdfChip';
import FilterRow from './FilterRow';

// Helper function to determine status from API data
const mapApiToStatus = (item) => {
  // This is a sample logic - adjust according to your actual business rules
  if (item.einvoiceId || item.hasPdf) {
    return 'SUBMITTED'; // If it has e-invoice ID or PDF, it's submitted
  } else if (item.InvcHead_InvoiceComment &&
    (item.InvcHead_InvoiceComment.includes('error') ||
      item.InvcHead_InvoiceComment.toLowerCase().includes('fault'))) {
    return 'ERROR';     // If comment contains error-related text
  } else if (item.InvcHead_InvoiceComment &&
    item.InvcHead_InvoiceComment.toLowerCase().includes('red')) {
    return 'RED_NOTE';  // If comment contains 'red', it's a red note
  } else {
    return 'PENDING';   // Default status
  }
};

// Function to transform API response data
const transformInvoiceData = (apiData) => {
  const invoiceMap = new Map();
  // Fapiao type constants
  const FAPIAO_TYPES = ['增值税专用发票', '普通发票'];

  // First pass: group by InvoiceNum and create parent invoice objects
  apiData.forEach(item => {
    const invoiceNum = item.InvcHead_InvoiceNum;

    if (!invoiceMap.has(invoiceNum)) {
      // Calculate the invoice total amount from this first line item
      // We'll add more line items to the total in the second pass
      const amount = parseFloat(item.InvcDtl_DocExtPrice || 0);

      // Randomly select a Fapiao type
      const randomFapiaoType = FAPIAO_TYPES[Math.floor(Math.random() * FAPIAO_TYPES.length)];

      invoiceMap.set(invoiceNum, {
        id: invoiceNum,
        postDate: new Date(item.OrderHed_OrderDate).toLocaleDateString(),
        type: randomFapiaoType,
        customerName: item.Customer_Name,
        amount: amount,
        comment: item.InvcHead_InvoiceComment || '',
        status: mapApiToStatus(item),
        hasPdf: false, // Assuming no PDF by default
        orderNum: item.OrderHed_OrderNum,
        poNum: item.OrderHed_PONum,
        childs: [],
        totalAmount: amount // Keep track of total amount
      });
    } else {
      // If we see another line for the same invoice, add its amount to the total
      const invoice = invoiceMap.get(invoiceNum);
      const lineAmount = parseFloat(item.InvcDtl_DocExtPrice || 0);
      invoice.totalAmount += lineAmount;
    }
  });

  // Second pass: add line items to each invoice
  apiData.forEach(item => {
    const invoiceNum = item.InvcHead_InvoiceNum;
    const invoice = invoiceMap.get(invoiceNum);

    invoice.childs.push({
      lineNo: invoice.childs.length + 1,
      partNo: item.InvcDtl_CommodityCode || '',
      description: item.InvcDtl_LineDesc,
      qty: item.InvcDtl_SellingShipQty,
      unitPrice: item.InvcDtl_DocUnitPrice,
      subtotal: item.InvcDtl_DocExtPrice,
      taxRate: item.InvcTax_Percent,
      taxTotal: (parseFloat(item.InvcDtl_DocExtPrice) * parseFloat(item.InvcTax_Percent) / 100).toFixed(2),
      uom: item.InvcDtl_SalesUM
    });
  });

  // Update each invoice with the correct total amount
  invoiceMap.forEach(invoice => {
    invoice.amount = invoice.totalAmount; // Set the final calculated amount
    delete invoice.totalAmount; // Remove the temporary tracking property
  });

  return Array.from(invoiceMap.values());
};

// Function to construct OData filter query from filterValues
const buildODataFilterQuery = (filterValues) => {
  if (!filterValues || Object.keys(filterValues).length === 0) {
    return '';
  }

  const filters = [];

  // Map the filter fields to their corresponding OData fields
  const fieldMappings = {
    id: 'InvcHead_InvoiceNum',
    customerName: 'Customer_Name',
    amount: 'InvcDtl_DocExtPrice',
    comment: 'InvcHead_InvoiceComment',
    type: 'InvcDtl_LineDesc', // Assuming Fapiao Type maps to line description
    postDate: 'OrderHed_OrderDate',
    orderNum: 'OrderHed_OrderNum',
    poNum: 'OrderHed_PONum',
    einvoiceId: 'InvcHead_InvoiceNum', // Placeholder - adjust as needed
    submittedBy: 'Customer_Name', // Placeholder - adjust as needed
  };

  Object.entries(filterValues).forEach(([key, value]) => {
    if (value && value !== 'All' && fieldMappings[key]) {
      const field = fieldMappings[key];

      // Handle different filter types
      if (key === 'postDate' || key === 'einvoiceDate') {
        // For date fields, use datetime function to convert string to OData datetime
        // Format: year-month-day
        filters.push(`${field} eq datetime'${value}'`);
      } else if (key === 'id' || key === 'einvoiceId' || key === 'orderNum') {
        // Number filtering for IDs - use exact matches
        if (!isNaN(value)) {
          filters.push(`${field} eq ${value}`);
        }
      } else if (key === 'amount') {
        // For amount, use exact match
        if (!isNaN(value)) {
          filters.push(`${field} eq ${value}`);
        }
      } else if (typeof value === 'string') {
        // String filtering - use exact match instead of contains
        const escapedValue = value.replace(/'/g, "''");
        filters.push(`${field} eq '${escapedValue}'`);
      } else if (key === 'hasPdf') {
        // Boolean filtering
        const boolValue = value ? 'true' : 'false';
        filters.push(`HasPdf eq ${boolValue}`);
      }
    }
  });

  // Build the OData query string
  let queryString = '';
  if (filters.length > 0) {
    queryString = `$filter=${filters.join(' and ')}`;
  }

  return queryString;
};

// Smart tooltip component that only shows when text is truncated
const TruncatedCell = ({ text, className = 'cell-text', estimatedCharWidth = 8, cellWidth = 100 }) => {
  const cellRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const content = text || '--';

  // Check if text might be truncated based on character count and estimated width
  const checkTruncation = () => {
    const textLength = content.length;
    // Estimate if text will be truncated (approximate calculation)
    // This is a simple estimation - actual truncation depends on font, characters, etc.
    const estimatedTextWidth = textLength * estimatedCharWidth;
    return estimatedTextWidth > cellWidth - 10; // Allow for some padding
  };

  useEffect(() => {
    // Set truncated state based on estimation
    setIsTruncated(checkTruncation());
  }, [text, cellWidth]);

  return isTruncated ? (
    <Tooltip title={content} placement="topLeft">
      <div className={className} ref={cellRef}>{content}</div>
    </Tooltip>
  ) : (
    <div className={className}>{content}</div>
  );
};

const InvoiceTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showPopover, setShowPopover] = useState(false);
  const [errorInvoiceId, setErrorInvoiceId] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [showFilterRow, setShowFilterRow] = useState(true);

  // Fetch and transform data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const filterQuery = buildODataFilterQuery(filterValues);
        const url = `https://simalfa.kineticcloud.cn/simalfaprod/api/v1/BaqSvc/InvReport(SIMALFA)${filterQuery ? `?${filterQuery}` : ''}`;

        console.log('Fetching data with URL:', url);

        const response = await fetch(url, {
          headers: {
            'Authorization': 'Basic bWFuYWdlcjo0V2slNkJu'
          }
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const transformedData = transformInvoiceData(data.value);
        setInvoiceData(transformedData);
        setFilteredData(transformedData);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };

    fetchData();
  }, [filterValues]); // Re-fetch when filterValues change

  // Handler for filter icon click to toggle filter row
  const toggleFilterRow = () => {
    setShowFilterRow(!showFilterRow);
  };

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
        align: 'center',
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
        render: (text, record) => `${text} ${record.uom}`,
      },
      {
        title: 'Unit Price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 120,
        align: 'right',
        render: (text) => `¥${parseFloat(text).toFixed(2)}`,
      },
      {
        title: 'Subtotal',
        dataIndex: 'subtotal',
        key: 'subtotal',
        width: 120,
        align: 'right',
        render: (text) => `¥${parseFloat(text).toFixed(2)}`,
      },
      {
        title: 'Tax Rate',
        dataIndex: 'taxRate',
        key: 'taxRate',
        width: 100,
        align: 'right',
        render: (text) => `${text}%`,
      },
      {
        title: 'Tax Total',
        dataIndex: 'taxTotal',
        key: 'taxTotal',
        width: 100,
        align: 'right',
        render: (text) => `¥${text}`,
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
          padding: '10px',
          marginBottom: '10px',
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
      render: (text) => <TruncatedCell text={text} />,
    },
    {
      title: 'ERP Invoice ID',
      dataIndex: 'id',
      key: 'id',
      className: 'cell cell-id',
      width: 100,
      render: (text) => <TruncatedCell text={text} className="cell-text cell-link" />,
    },
    {
      title: 'Fapiao Type',
      dataIndex: 'type',
      key: 'type',
      className: 'cell cell-type',
      width: 100,
      render: (text) => <TruncatedCell text={text} />,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      className: 'cell cell-customer',
      width: 100,
      render: (text) => <TruncatedCell text={text} />,
    },
    {
      title: 'Invoice Amount',
      dataIndex: 'amount',
      key: 'amount',
      className: 'cell cell-amount',
      width: 100,
      render: (text) => {
        const formattedAmount = `¥${parseFloat(text).toFixed(2)}`;
        return <TruncatedCell text={formattedAmount} />;
      },
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      className: 'cell cell-comment',
      width: 100,
      render: (text) => <TruncatedCell text={text} />,
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
      render: (text) => text ? <TruncatedCell text={text} /> : <div className="cell-empty">--</div>,
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
      render: (text) => <TruncatedCell text={text} />,
    },
    {
      title: 'E-Invoice Submitted By',
      dataIndex: 'submittedBy',
      key: 'submittedBy',
      className: 'cell cell-submitted-by',
      width: 100,
      render: (text) => text ? <TruncatedCell text={text} /> : <div className="cell-empty">--</div>,
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
            <Icon
              className="icon-grey icon-medium icon-light"
              style={{ cursor: 'pointer' }}
              onClick={toggleFilterRow}
              title="Toggle filter row visibility"
            >
              {'filter_alt'}
            </Icon>
          </div>
          <div className="cell-checkbox" style={{ display: 'flex', flex: 32, minWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
            <input style={{ width: '16px', height: '16px' }} type="checkbox" title="Select all rows" />
          </div>
          <div className="header-cell cell-date">
            <div className="cell-header-text" title="Date when invoice was posted">Post Date</div>
          </div>
          <div className="header-cell cell-id">
            <div className="cell-header-text" title="ERP system invoice identifier">ERP Invoice ID</div>
          </div>
          <div className="header-cell cell-type">
            <div className="cell-header-text" title="Type of fapiao document">Fapiao Type</div>
          </div>
          <div className="header-cell cell-customer">
            <div className="cell-header-text" title="Name of the customer">Customer Name</div>
          </div>
          <div className="header-cell cell-amount">
            <div className="cell-header-text" title="Total invoice amount">Invoice Amount</div>
          </div>
          <div className="header-cell cell-comment">
            <div className="cell-header-text" title="Additional notes about the invoice">Comment</div>
          </div>
          <div className="header-cell cell-status">
            <div className="cell-header-text" title="Current status of the invoice">Status</div>
          </div>
          <div className="header-cell cell-einvoice-id">
            <div className="cell-header-text" title="Electronic invoice identifier">E-Invoice ID</div>
          </div>
          <div className="header-cell cell-pdf">
            <div className="cell-header-text" title="PDF document availability">E-Invoice PDF</div>
          </div>
          <div className="header-cell cell-einvoice-date">
            <div className="cell-header-text" title="Date of electronic invoice issuance">E-Invoice Date</div>
          </div>
          <div className="header-cell cell-submitted-by">
            <div className="cell-header-text" title="Person who submitted the electronic invoice">E-Invoice Submitted By</div>
          </div>
        </div>
      </div>

      {/* Filter Row - Only show if showFilterRow is true */}
      {showFilterRow && (
        <FilterRow
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

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