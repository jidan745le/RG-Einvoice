import React from 'react';
import { Icon } from '@material-ui/core';
import PropTypes from 'prop-types';

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
  /**
   * 处理过滤输入变化
   * @param {string} field - 字段名
   * @param {*} value - 新的值
   */
  const handleFilterChange = (field, value) => {
    if (onFilterChange) {
      onFilterChange({ ...filterValues, [field]: value });
    }
  };

  /**
   * 清除所有过滤条件
   */
  const handleClearAll = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className="filter-row">
      <div className="table-row">
        <div className="cell cell-checkbox">
          <div className="icon">
            <Icon className="icon-grey icon-medium icon-light">filter_alt</Icon>
          </div>
        </div>

        <div className="cell cell-expand">
          <div className="icon" onClick={handleClearAll}>
            <Icon className="icon-grey icon-medium icon-light">cancel</Icon>
          </div>
        </div>

        <div className="cell-date filter-cell">
          <div 
            className={`filter-input ${filterValues.postDate ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('postDate', filterValues.postDate || 'Date')}
          >
            <div className="filter-input-text">
              {filterValues.postDate || 'Date'}
            </div>
            <div className="icon">
              <Icon className="icon-grey icon-medium icon-light">calendar_month</Icon>
            </div>
          </div>
        </div>

        <div className="cell-id filter-cell">
          <div 
            className={`filter-input ${filterValues.id ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('id', filterValues.id || '')}
          >
            <div className="filter-input-text">
              {filterValues.id || 'ERP Invoice ID'}
            </div>
          </div>
        </div>

        <div className="cell-type filter-cell">
          <div 
            className={`filter-input ${filterValues.type && filterValues.type !== 'All' ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('type', filterValues.type || 'All')}
          >
            <div className="filter-input-text">
              {filterValues.type || 'All'}
            </div>
            <div className="icon">
              <Icon className="icon-grey icon-medium icon-light">arrow_drop_down</Icon>
            </div>
          </div>
        </div>

        <div className="cell-customer filter-cell">
          <div 
            className={`filter-input ${filterValues.customerName ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('customerName', filterValues.customerName || '')}
          >
            <div className="filter-input-text">
              {filterValues.customerName || 'Customer Name'}
            </div>
          </div>
        </div>

        <div className="cell-amount filter-cell">
          <div 
            className={`filter-input ${filterValues.amount ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('amount', filterValues.amount || '')}
          >
            <div className="filter-input-text">
              {filterValues.amount || 'Invoice Amount'}
            </div>
          </div>
        </div>

        <div className="cell-comment filter-cell">
          <div 
            className={`filter-input ${filterValues.comment ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('comment', filterValues.comment || '')}
          >
            <div className="filter-input-text">
              {filterValues.comment || 'Comment'}
            </div>
          </div>
        </div>

        <div className="cell-status filter-cell">
          <div 
            className={`filter-input ${filterValues.status && filterValues.status !== 'All' ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('status', filterValues.status || 'All')}
          >
            <div className="filter-input-text">
              {filterValues.status || 'All'}
            </div>
            <div className="icon">
              <Icon className="icon-grey icon-medium icon-light">arrow_drop_down</Icon>
            </div>
          </div>
        </div>

        <div className="cell-einvoice-id filter-cell">
          <div 
            className={`filter-input ${filterValues.einvoiceId ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('einvoiceId', filterValues.einvoiceId || '')}
          >
            <div className="filter-input-text">
              {filterValues.einvoiceId || 'E-Invoice ID'}
            </div>
          </div>
        </div>

        <div className="cell-pdf filter-cell">
          <div 
            className={`filter-input ${filterValues.hasPdf !== undefined ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('hasPdf', filterValues.hasPdf || '')}
          >
            <div className="filter-input-text">
              {filterValues.hasPdf !== undefined ? (filterValues.hasPdf ? 'Yes' : 'No') : 'E-Invoice PDF'}
            </div>
          </div>
        </div>

        <div className="cell-einvoice-date filter-cell">
          <div 
            className={`filter-input ${filterValues.einvoiceDate ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('einvoiceDate', filterValues.einvoiceDate || '')}
          >
            <div className="filter-input-text">
              {filterValues.einvoiceDate || 'E-Invoice Date'}
            </div>
          </div>
        </div>

        <div className="cell-submitted-by filter-cell">
          <div 
            className={`filter-input ${filterValues.submittedBy ? 'filter-input-active' : ''}`}
            onClick={() => handleFilterChange('submittedBy', filterValues.submittedBy || '')}
          >
            <div className="filter-input-text">
              {filterValues.submittedBy || 'E-Invoice Submitted By'}
            </div>
          </div>
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