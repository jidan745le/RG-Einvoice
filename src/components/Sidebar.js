import React, { useMemo, useState, useEffect } from 'react';

const Sidebar = ({ invoiceData = [], onFilterChange, filterValues = {} }) => {
  const [activeId, setActiveId] = useState('viewAll');

  // 当外部 filterValues 中的 status 变化时，更新活动项
  useEffect(() => {
    if (filterValues.status) {
      console.log('filterValues.status', filterValues.status);
      setActiveId(filterValues.status);
    } else {
      setActiveId('viewAll');
    }
  }, [filterValues.status]);

  // 使用 useMemo 动态计算各状态的发票数量
  const menuItems = useMemo(() => {
    // 计算各状态的数量
    const countByStatus = {
      PENDING: 0,
      SUBMITTED: 0,
      ERROR: 0,
      RED_NOTE: 0
    };

    // 统计数量
    invoiceData.forEach(invoice => {
      if (invoice.status && countByStatus.hasOwnProperty(invoice.status)) {
        countByStatus[invoice.status]++;
      }
    });

    // 计算总数
    const totalCount = invoiceData.length;

    // 返回完整的菜单项数组，设置活动状态
    return [
      { id: 'viewAll', label: 'View All', count: totalCount, active: activeId === 'viewAll' },
      { id: 'PENDING', label: 'Pending', count: countByStatus.PENDING, active: activeId === 'PENDING' },
      { id: 'SUBMITTED', label: 'Submitted', count: countByStatus.SUBMITTED, active: activeId === 'SUBMITTED' },
      { id: 'ERROR', label: 'Error', count: countByStatus.ERROR, active: activeId === 'ERROR' },
      { id: 'RED_NOTE', label: 'Red Note', count: countByStatus.RED_NOTE, active: activeId === 'RED_NOTE' }
    ];
  }, [invoiceData, activeId]);

  // 处理菜单项点击
  const handleMenuItemClick = (id) => {
    setActiveId(id);

    // 触发过滤器变更
    if (onFilterChange) {
      if (id === 'viewAll') {
        // 如果是 viewAll，创建一个不包含 status 的新过滤对象
        const newFilters = { ...filterValues };
        delete newFilters.status;
        onFilterChange(newFilters);
      } else {
        // 否则添加状态过滤
        onFilterChange({
          ...filterValues,
          status: id
        });
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <div className="sidebar-title-text">Invoice Status</div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`menu-item ${item.active ? 'menu-item-active' : ''}`}
            onClick={() => handleMenuItemClick(item.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="menu-item-label">{item.label}</div>
            <div className="menu-item-badge">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 