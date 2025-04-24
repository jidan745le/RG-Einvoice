import { Icon } from '@material-ui/core';
import { Table, Tooltip } from 'antd';
import axios from 'axios';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import FilterRow from './FilterRow';
import PdfChip from './PdfChip';
import StatusChip from './StatusChip';
import { THEME } from './TopBar';

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
  return apiData.map(item => ({
    id: item.erpInvoiceId.toString(),
    postDate: item.orderDate ? new Date(item.orderDate).toLocaleDateString() : '--',
    type: item.fapiaoType || '--',
    customerName: item.customerName || '--',
    amount: item.invoiceAmount || 0,
    comment: item.invoiceComment || '',
    status: item.status || 'PENDING',
    hasPdf: !!item.eInvoicePdf,
    orderNum: item.orderNumber,
    poNum: item.poNumber,
    einvoiceId: item.eInvoiceId,
    einvoiceDate: item.eInvoiceDate ? new Date(item.eInvoiceDate).toLocaleDateString() : '--',
    submittedBy: item.submittedBy,
    invoiceDetails: item.invoiceDetails || [],
    eInvoicePdf: item.eInvoicePdf,
  }));
};

// Function to build query parameters for API request
const buildApiQueryParams = (filterValues) => {
  const params = new URLSearchParams();
  
  if (filterValues.page) params.append('page', filterValues.page);
  if (filterValues.limit) params.append('limit', filterValues.limit);
  
  // 映射前端过滤字段到API参数
  if (filterValues.id) params.append('erpInvoiceId', filterValues.id);
  if (filterValues.customerName) params.append('customerName', filterValues.customerName);
  if (filterValues.status) params.append('status', filterValues.status);
  if (filterValues.einvoiceId) params.append('eInvoiceId', filterValues.einvoiceId);
  if (filterValues.postDate) params.append('startDate', filterValues.postDate);
  if (filterValues.type) params.append('fapiaoType', filterValues.type);
  if (filterValues.submittedBy) params.append('submittedBy', filterValues.submittedBy);
  
  return params.toString();
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

const InvoiceTable = forwardRef(({ onDataChange, filterValues: externalFilterValues, onFilterChange, onSelectionChange }, ref) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showPopover, setShowPopover] = useState(false);
  const [errorInvoiceId, setErrorInvoiceId] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [filterValues, setFilterValues] = useState({}); // 使用组件内部的 filterValues 状态
  const [filteredData, setFilteredData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showFilterRow, setShowFilterRow] = useState(true);

  // 接收外部 filterValues 变化
  useEffect(() => {
    if (externalFilterValues) {
      setFilterValues(externalFilterValues);
    }
  }, [externalFilterValues]);

  // Create fetchData function outside useEffect
  const fetchData = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const queryParams = buildApiQueryParams({
        ...filterValues,
        page: currentPage,
        limit: pageSize
      });
      
      // 直接使用完整的URL访问API
      const url = `/e-invoice/api/invoice${queryParams ? `?${queryParams}` : ''}`;
      console.log('Fetching data with URL:', url);

      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = response.data;
      console.log('API Response:', data);
      
      // 转换数据
      const transformedData = transformInvoiceData(data.items);
      setFilteredData(transformedData);
      setTotalItems(data.total);
      
      // 调用数据变化回调
      if (onDataChange) {
        onDataChange({items: transformedData, total: data.total, totals: data.totals});
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // 获取数据的 useEffect
  useEffect(() => {
    fetchData();
  }, [filterValues, currentPage, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    fetchData,
    clearSelection: () => setSelectedRowKeys([])
  }));

  // 处理过滤器变化
  const handleFilterChange = (newFilterValues) => {
    console.log('newFilterValues', newFilterValues);
    // 重置到第一页
    setCurrentPage(1);
    setFilterValues(newFilterValues);

    // 如果提供了外部过滤回调，调用它
    if (onFilterChange) {
      onFilterChange(newFilterValues);
    }
  };

  // 清除所有过滤器
  const handleClearFilters = () => {
    setFilterValues({});
    setCurrentPage(1);

    // 如果提供了外部过滤回调，调用它
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  // Handler for pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Handler for filter icon click to toggle filter row
  const toggleFilterRow = () => {
    setShowFilterRow(!showFilterRow);
  };

  // Handler for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
      
      // Call the onSelectionChange callback if provided
      if (onSelectionChange) {
        // Get the full data for selected invoices
        const selectedInvoices = filteredData.filter(invoice => 
          selectedKeys.includes(invoice.id)
        );
        console.log('selectedInvoices', selectedInvoices);
        console.log('selectedKeys', selectedKeys);
        onSelectionChange(selectedKeys, selectedInvoices);
      }
    },
  };

  // Define expandable row content
  const expandedRowRender = (record) => {
    console.log('record', record);
    if (!record.invoiceDetails || record.invoiceDetails.length === 0) {
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
        dataIndex: 'lineDescription',
        key: 'lineDescription',
        width: 250,
      },
      {
        title: 'Qty',
        dataIndex: 'sellingShipQty',
        key: 'sellingShipQty',
        width: 80,
        align: 'right',
        render: (text, record) => `${text} ${record.uomDescription}`,
      },
      {
        title: 'Unit Price',
        dataIndex: 'docUnitPrice',
        key: 'docUnitPrice',
        width: 120,
        align: 'right',
        render: (text) => `¥${parseFloat(text).toFixed(2)}`,
      },
      {
        title: 'Subtotal',
        dataIndex: 'docExtPrice',
        key: 'docExtPrice',
        width: 120,
        align: 'right',
        render: (text) => `¥${parseFloat(text).toFixed(2)}`,
      },
      {
        title: 'Tax Rate',
        dataIndex: 'taxPercent',
        key: 'taxPercent',
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
        render: (text, record) => {
          const taxAmount = (parseFloat(record.docExtPrice) * parseFloat(record.taxPercent) / 100).toFixed(2);
          return `¥${taxAmount}`;
        },
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
          dataSource={record.invoiceDetails.map((item, index) => ({ ...item, lineNo: index + 1 }))}
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
        const formattedAmount = text ? `¥${parseFloat(text).toFixed(2)}` : '--';
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
      render: (hasPdf,record) => (
        hasPdf ? <PdfChip record={record} /> : <div className="cell-empty">--</div>
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
    rowSelection: {
      ...rowSelection,
      selectedRowKeys,
      columnWidth: 32,
      getCheckboxProps: record => ({
        style: {
          backgroundColor: selectedRowKeys.includes(record.id) ? '#FFF3E5' : ''
        }
      }),
    },
    expandable: {
      expandedRowRender,
      expandIcon: ({ expanded, onExpand, record, ...props }) => (
        <div className="icon" onClick={e => onExpand(record, e)}>
          <Icon className="icon-grey icon-medium icon-light">
            {expanded ? 'indeterminate_check_box' : 'add_box'}
          </Icon>
        </div>
      ),
      expandedRowKeys,
      onExpand: (expanded, record) => {
        setExpandedRowKeys(expanded 
          ? [...expandedRowKeys, record.id] 
          : expandedRowKeys.filter(id => id !== record.id)
        );
      }
    },
    rowClassName: (record, index) => {
      const isSelected = selectedRowKeys.includes(record.id);
      const baseClass = index % 2 === 0 ? 'table-body-row' : 'table-body-row-alternate';
      return isSelected ? `${baseClass} selected-row` : baseClass;
    },
    dataSource: filteredData.map(item => ({ ...item, key: item.id })),
    columns: columns,
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      total: totalItems,
      onChange: handlePaginationChange,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `总计 ${total} 条记录`
    },
    bordered: false,
    className: 'invoice-table-ant',
    size: 'middle',
    rowKey: 'id',
    tableLayout: 'fixed',
    showHeader: false,
    style: { width: '100%' },
    loading: loading
  };

  return (
    <div>
      <style>
        {`
          .invoice-table-ant .selected-row,
          .invoice-table-ant .selected-row:hover {
            background-color: #FFF3E5 !important;
          }
          
          .invoice-table-ant .selected-row td {
            background-color: #FFF3E5 !important;
          }
          
          .invoice-table-ant .ant-table-row-selected > td {
            background-color: #FFF3E5 !important;
          }
        `}
      </style>
      <div className="custom-table-header" style={{ backgroundColor: THEME.secondaryContainer }}>
        <div className="table-row">
          <div className="cell-expand" style={{ display: 'flex', flex: 48, minWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
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

      {showFilterRow && (
        <FilterRow
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      <Table {...tableConfig} />
    </div>
  );
});

export default InvoiceTable; 