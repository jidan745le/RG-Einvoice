import { Icon } from '@material-ui/core';
import { DatePicker, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 表格过滤行组件
 * 
 * @param {Object} props - 组件属性
 * @param {Function} props.onFilterChange - 当过滤条件改变时的回调函数
 * @param {Object} props.filterValues - 当前的过滤值
 * @param {Function} props.onClearFilters - 清除所有过滤条件的回调函数
 * @returns {JSX.Element} 过滤行组件
 */
const FilterRow = ({ onFilterChange, filterValues = {}, onClearFilters, columns, showFilterRow }) => {
  // Local state for immediate input values (before debounce)
  const [localFilterValues, setLocalFilterValues] = useState(filterValues);

  // Update local state when props change
  useEffect(() => {
    console.log("FilterValues changed from props:", filterValues);
    setLocalFilterValues(prevValues => {
      // 避免不必要的更新
      if (JSON.stringify(prevValues) === JSON.stringify(filterValues)) {
        return prevValues;
      }
      return filterValues;
    });
  }, [filterValues]);

  /**
   * 防抖处理的过滤值更新函数
   */
  // Create a memoized debounced function
  const debouncedFilterChange = useCallback(
    debounce((newFilterValues) => {
      if (onFilterChange) {
        onFilterChange(newFilterValues);
      }
    }, 500),
    [] // Empty dependency array as the debounce function itself doesn't need to change
  );

  // Effect to clean up the debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedFilterChange.cancel();
    };
  }, [debouncedFilterChange]);

  /**
   * 处理过滤输入变化
   * @param {string} field - 字段名
   * @param {*} value - 新的值
   */
  const handleFilterChange = (field, value) => {
    console.log(`Filter change for ${field}:`, value);

    // Special handling for empty strings
    const newValue = value === '' ? undefined : value;

    const newFilterValues = { ...localFilterValues, [field]: newValue };
    console.log('Updated filter values:', newFilterValues);

    // Update local state immediately for responsive UI
    setLocalFilterValues(newFilterValues);

    // Debounce the actual filter change that triggers API calls
    debouncedFilterChange(newFilterValues);
  };

  /**
   * 清除所有过滤条件
   */
  const handleClearAll = () => {
    setLocalFilterValues({});
    if (onClearFilters) {
      onClearFilters();
    }
  };

  /**
   * 处理日期变化
   * 转换为OData兼容的日期格式
   */
  const handleDateChange = (dates, dateStrings, field) => {
    console.log(`Date range change for ${field}:`, dates, dateStrings);

    // 如果dates为null，说明用户清除了选择
    if (!dates) {
      console.log(`Clearing date range for ${field}`);
      handleFilterChange(field, undefined);
      return;
    }

    // 检查是否有有效的开始和结束日期
    if (dates && dates[0] && dates[1]) {
      // Format dates correctly for OData datetime compatibility
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      console.log(`Setting date range for ${field}:`, startDate, endDate);

      // Store as an object with start and end properties
      handleFilterChange(field, { start: startDate, end: endDate });
    } else {
      // 如果有任何一个日期未选择，则不设置过滤
      console.log(`Incomplete date range for ${field}, clearing filter`);
      handleFilterChange(field, undefined);
    }
  };

  console.log(localFilterValues, "localFilterValues")

  const filterFields = useMemo(() => {
    console.log("Creating filter fields with values:", localFilterValues);

    // 辅助函数来检查日期范围值是否有效
    const getDateRangeValue = (dateRange) => {
      if (!dateRange) return null;

      try {
        // 确保是对象且有start和end属性
        if (typeof dateRange === 'object' && dateRange.start && dateRange.end) {
          const startDayjs = dayjs(dateRange.start);
          const endDayjs = dayjs(dateRange.end);

          // 验证是否为有效的dayjs对象
          if (startDayjs.isValid() && endDayjs.isValid()) {
            return [startDayjs, endDayjs];
          }
        }
      } catch (error) {
        console.error("Error parsing date range:", error);
      }

      return null;
    };

    const components = [
      <RangePicker
        placeholder={["Start Date", "End Date"]}
        value={getDateRangeValue(localFilterValues.postDate)}
        onChange={(dates, dateStrings) => handleDateChange(dates, dateStrings, 'postDate')}
        style={{ width: '80%' }}
        size="small"
        format="YYYY-MM-DD"
        title="Filter by post date range"
        allowClear
        showToday={false}
      />, <Input
        placeholder="ERP Invoice ID"
        style={{ width: '80%' }}
        value={localFilterValues.id}
        onChange={(e) => handleFilterChange('id', e.target.value)}
        size="small"
        allowClear
        title="Filter by invoice ID"
      />,
      <Select
        placeholder="Fapiao Type"
        value={localFilterValues.type}
        onChange={(value) => handleFilterChange('type', value)}
        style={{ width: '80%' }}
        size="small"
        allowClear
        title="Filter by fapiao type"
      >
        <Option value="增值税专用发票">增值税专用发票</Option>
        <Option value="普通发票">普通发票</Option>
      </Select>,
      <Input
        placeholder="Customer Name"
        style={{ width: '80%' }}
        value={localFilterValues.customerName}
        onChange={(e) => handleFilterChange('customerName', e.target.value)}
        size="small"
        allowClear
        title="Filter by customer name"
      />,
      <Input
        placeholder="Invoice Amount"
        style={{ width: '80%' }}
        value={localFilterValues.amount}
        onChange={(e) => handleFilterChange('amount', e.target.value)}
        size="small"
        allowClear
        type="number"
        title="Filter by exact amount"
      />, <Input
        placeholder="Comment"
        style={{ width: '80%' }}
        value={localFilterValues.comment}
        onChange={(e) => handleFilterChange('comment', e.target.value)}
        size="small"
        allowClear
        title="Filter by comment text"
      />,


      <Select
        placeholder="Status"
        value={localFilterValues.status}
        onChange={(value) => handleFilterChange('status', value)}
        style={{ width: '80%' }}
        size="small"
        allowClear
        title="Filter by invoice status"
      >
        <Option value="SUBMITTED">Submitted</Option>
        <Option value="PENDING">Pending</Option>
        <Option value="ERROR">Error</Option>
        <Option value="RED_NOTE">Red Note</Option>
      </Select>,

      <Input
        placeholder="E-Invoice ID"
        style={{ width: '80%' }}
        value={localFilterValues.einvoiceId}
        onChange={(e) => handleFilterChange('einvoiceId', e.target.value)}
        size="small"
        allowClear
        title="Filter by e-invoice ID"
      />,


      <Select
        placeholder="E-Invoice PDF"
        value={localFilterValues.hasPdf === undefined ? undefined : String(localFilterValues.hasPdf)}
        onChange={(value) => handleFilterChange('hasPdf', value === undefined ? undefined : value === 'true')}
        style={{ width: '80%' }}
        size="small"
        allowClear
        title="Filter by PDF availability"
      >
        <Option value="true">Yes</Option>
        <Option value="false">No</Option>
      </Select>,

      <RangePicker
        placeholder={["Start Date", "End Date"]}
        value={getDateRangeValue(localFilterValues.einvoiceDate)}
        onChange={(dates, dateStrings) => handleDateChange(dates, dateStrings, 'einvoiceDate')}
        style={{ width: '80%' }}
        size="small"
        format="YYYY-MM-DD"
        title="Filter by e-invoice date range"
        allowClear
        showToday={false}
        disabledDate={() => false}
      />,
      <Input
        placeholder="E-Invoice Submitted By"
        style={{ width: '80%' }}
        value={localFilterValues.submittedBy}
        onChange={(e) => handleFilterChange('submittedBy', e.target.value)}
        size="small"
        allowClear
        title="Filter by submission user"
      />
    ]
    return columns.map((column, index) => {
      return {
        key: column.key,
        title: column.title,
        width: column.width,
        component: components[index]
      }
    })
  }, [localFilterValues])

  return (
    <div style={{ display: showFilterRow ? 'flex' : 'none' }} className="filter-row">
      <div className="table-row">
        <div style={{ display: 'flex', flex: 48, minWidth: 0, justifyContent: 'center', alignItems: 'center' }} className="cell cell-checkbox">
          <div className="icon">
            <Icon className="icon-grey icon-medium icon-light">filter_alt</Icon>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 32, minWidth: 0, justifyContent: 'center', alignItems: 'center' }} className="cell cell-expand">
          <div className="icon" onClick={handleClearAll} style={{ cursor: 'pointer' }}>
            <Icon className="icon-grey icon-medium icon-light">cancel</Icon>
          </div>
        </div>
        {
          filterFields.map(item => {
            return <div style={{ flex: item.width }} className="filter-cell">
              {item.component}
            </div>
          })
        }


        {/* <div className="cell-id filter-cell">
          <Input
            placeholder="ERP Invoice ID"
            style={{ width: '80%' }}
            value={localFilterValues.id}
            onChange={(e) => handleFilterChange('id', e.target.value)}
            size="small"
            allowClear
            title="Filter by invoice ID"
          />
        </div>

        <div className="cell-type filter-cell">
          <Select
            placeholder="Fapiao Type"
            value={localFilterValues.type}
            onChange={(value) => handleFilterChange('type', value)}
            style={{ width: '80%' }}
            size="small"
            allowClear
            title="Filter by fapiao type"
          >
            <Option value="增值税专用发票">增值税专用发票</Option>
            <Option value="普通发票">普通发票</Option>
          </Select>
        </div>

        <div className="cell-customer filter-cell">
          <Input
            placeholder="Customer Name"
            style={{ width: '80%' }}
            value={localFilterValues.customerName}
            onChange={(e) => handleFilterChange('customerName', e.target.value)}
            size="small"
            allowClear
            title="Filter by customer name"
          />
        </div>

        <div className="cell-amount filter-cell">
          <Input
            placeholder="Invoice Amount"
            style={{ width: '80%' }}
            value={localFilterValues.amount}
            onChange={(e) => handleFilterChange('amount', e.target.value)}
            size="small"
            allowClear
            type="number"
            title="Filter by exact amount"
          />
        </div>

        <div className="cell-comment filter-cell">
          <Input
            placeholder="Comment"
            style={{ width: '80%' }}
            value={localFilterValues.comment}
            onChange={(e) => handleFilterChange('comment', e.target.value)}
            size="small"
            allowClear
            title="Filter by comment text"
          />
        </div>

        <div className="cell-status filter-cell">
          <Select
            placeholder="Status"
            value={localFilterValues.status}
            onChange={(value) => handleFilterChange('status', value)}
            style={{ width: '80%' }}
            size="small"
            allowClear
            title="Filter by invoice status"
          >
            <Option value="SUBMITTED">Submitted</Option>
            <Option value="PENDING">Pending</Option>
            <Option value="ERROR">Error</Option>
            <Option value="RED_NOTE">Red Note</Option>
          </Select>
        </div>

        <div className="cell-einvoice-id filter-cell">
          <Input
            placeholder="E-Invoice ID"
            style={{ width: '80%' }}
            value={localFilterValues.einvoiceId}
            onChange={(e) => handleFilterChange('einvoiceId', e.target.value)}
            size="small"
            allowClear
            title="Filter by e-invoice ID"
          />
        </div>

        <div className="cell-pdf filter-cell">
          <Select
            placeholder="E-Invoice PDF"
            value={localFilterValues.hasPdf === undefined ? undefined : String(localFilterValues.hasPdf)}
            onChange={(value) => handleFilterChange('hasPdf', value === undefined ? undefined : value === 'true')}
            style={{ width: '80%' }}
            size="small"
            allowClear
            title="Filter by PDF availability"
          >
            <Option value="true">Yes</Option>
            <Option value="false">No</Option>
          </Select>
        </div>

        <div className="cell-einvoice-date filter-cell">
          <DatePicker
            placeholder="E-Invoice Date"
            value={localFilterValues.einvoiceDate ? dayjs(localFilterValues.einvoiceDate) : null}
            onChange={(date, dateString) => handleDateChange(date, dateString, 'einvoiceDate')}
            style={{ width: '80%' }}
            size="small"
            format="YYYY-MM-DD"
            title="Filter by e-invoice date"
          />
        </div>

        <div className="cell-submitted-by filter-cell">
          <Input
            placeholder="E-Invoice Submitted By"
            style={{ width: '80%' }}
            value={localFilterValues.submittedBy}
            onChange={(e) => handleFilterChange('submittedBy', e.target.value)}
            size="small"
            allowClear
            title="Filter by submission user"
          />
        </div> */}
      </div>
    </div>
  );
};

FilterRow.propTypes = {
  onFilterChange: PropTypes.func,
  filterValues: PropTypes.object,
  onClearFilters: PropTypes.func
};

export default FilterRow; 