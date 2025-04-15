import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Input, Select, DatePicker } from 'antd';
import moment from 'moment';
import { debounce } from 'lodash';

const { Option } = Select;

/**
 * 表格过滤行组件
 * 
 * @param {Object} props - 组件属性
 * @param {Function} props.onFilterChange - 当过滤条件改变时的回调函数
 * @param {Object} props.filterValues - 当前的过滤值
 * @param {Function} props.onClearFilters - 清除所有过滤条件的回调函数
 * @returns {JSX.Element} 过滤行组件
 */
const FilterRow = ({ onFilterChange, filterValues = {}, onClearFilters }) => {
  // Local state for immediate input values (before debounce)
  const [localFilterValues, setLocalFilterValues] = useState(filterValues);

  // Update local state when props change
  useEffect(() => {
    setLocalFilterValues(filterValues);
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
    const newValue = value === '' ? undefined : value;
    const newFilterValues = { ...localFilterValues, [field]: newValue };

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
  const handleDateChange = (date, dateString, field) => {
    if (date) {
      // Format date correctly for OData datetime compatibility
      const formattedDate = date.format('YYYY-MM-DD');
      handleFilterChange(field, formattedDate);
    } else {
      handleFilterChange(field, undefined);
    }
  };

  return (
    <div className="filter-row">
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

        <div className="cell-date filter-cell">
          <DatePicker
            placeholder="Post Date"
            value={localFilterValues.postDate ? moment(localFilterValues.postDate.split('T')[0]) : null}
            onChange={(date, dateString) => handleDateChange(date, dateString, 'postDate')}
            style={{ width: '80%' }}
            size="small"
            format="YYYY-MM-DD"
          />
        </div>

        <div className="cell-id filter-cell">
          <Input
            placeholder="ERP Invoice ID"
            style={{ width: '80%' }}
            value={localFilterValues.id}
            onChange={(e) => handleFilterChange('id', e.target.value)}
            size="small"
            allowClear
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
          >
            <Option value="SIMALFA 309 RED 20 kg">SIMALFA 309 RED 20 kg</Option>
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
          >
            <Option value="true">Yes</Option>
            <Option value="false">No</Option>
          </Select>
        </div>

        <div className="cell-einvoice-date filter-cell">
          <DatePicker
            placeholder="E-Invoice Date"
            value={localFilterValues.einvoiceDate ? moment(localFilterValues.einvoiceDate.split('T')[0]) : null}
            onChange={(date, dateString) => handleDateChange(date, dateString, 'einvoiceDate')}
            style={{ width: '80%' }}
            size="small"
            format="YYYY-MM-DD"
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
          />
        </div>
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