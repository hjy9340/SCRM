// 客户管理模块JavaScript功能

// 客户数据
let customerData = [];
let filteredCustomers = [];
let currentFilter = 'all';
let searchQuery = '';

// 客户数据加载
async function loadCustomerData() {
    try {
        const loadingState = document.getElementById('loadingState');
        const customerList = document.getElementById('customerList');
        const emptyState = document.getElementById('emptyState');
        
        if (loadingState) loadingState.style.display = 'block';
        if (customerList) customerList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
        
        // 获取客户数据
        const response = await API.request('/api/customers');
        if (response.success) {
            customerData = response.data;
            filteredCustomers = [...customerData];
            
            // 更新统计数据
            updateCustomerStats();
            
            // 渲染客户列表
            renderCustomerList();
            
            if (loadingState) loadingState.style.display = 'none';
            if (customerData.length > 0) {
                if (customerList) customerList.style.display = 'block';
            } else {
                if (emptyState) emptyState.style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('加载客户数据失败:', error);
        Utils.showToast('数据加载失败', 'error');
        
        const loadingState = document.getElementById('loadingState');
        const emptyState = document.getElementById('emptyState');
        if (loadingState) loadingState.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
    }
}

// 更新客户统计
function updateCustomerStats() {
    const total = customerData.length;
    const intent = customerData.filter(c => c.status === '初步意向').length;
    const viewing = customerData.filter(c => c.status === '带看中').length;
    const deal = customerData.filter(c => c.status === '已成交').length;
    
    const totalEl = document.getElementById('totalCustomers');
    const intentEl = document.getElementById('intentCustomers');
    const viewingEl = document.getElementById('viewingCustomers');
    const dealEl = document.getElementById('dealCustomers');
    const badgeEl = document.getElementById('customerBadge');
    
    if (totalEl) totalEl.textContent = total;
    if (intentEl) intentEl.textContent = intent;
    if (viewingEl) viewingEl.textContent = viewing;
    if (dealEl) dealEl.textContent = deal;
    if (badgeEl) badgeEl.textContent = total;
}

// 渲染客户列表
function renderCustomerList() {
    const container = document.getElementById('customerList');
    if (!container) return;
    
    if (filteredCustomers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">
                    <i class="fas fa-search"></i>
                </div>
                <div class="title">没有找到匹配的客户</div>
                <div class="description">尝试调整筛选条件或搜索关键词</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredCustomers.map(customer => createCustomerCard(customer)).join('');
}

// 创建客户卡片
function createCustomerCard(customer) {
    const statusClass = getStatusClass(customer.status);
    const statusColor = getStatusColor(customer.status);
    
    // 获取客户头像URL，如果没有则使用默认头像
    const avatarUrl = customer.avatar || 'https://via.placeholder.com/50x50?text=' + encodeURIComponent(customer.contact.charAt(0));
    
    return `
        <div class="list-item customer-card" data-customer-id="${customer.id}">
            <div class="customer-avatar">
                <img src="${avatarUrl}" alt="${customer.contact}" onerror="this.src='https://via.placeholder.com/50x50?text=${encodeURIComponent(customer.contact.charAt(0))}'">
            </div>
            <div class="customer-info">
                <div class="list-item-header">
                    <div class="list-item-title">
                        <i class="fas fa-building text-primary mr-2"></i>
                        ${customer.name}
                    </div>
                    <div class="status-badge ${statusClass}">
                        ${customer.status}
                    </div>
                </div>
                
                <div class="list-item-subtitle">
                    <i class="fas fa-user mr-1"></i>
                    ${customer.contact} 
                    <i class="fas fa-phone ml-3 mr-1"></i>
                    ${customer.phone}
                </div>
                
                <div class="list-item-meta">
                    <div class="meta-item">
                        <i class="fas fa-money-bill-wave"></i>
                        ${customer.budget}
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-ruler-combined"></i>
                        ${customer.area}
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-industry"></i>
                        ${customer.industry}
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        ${Utils.formatTime(new Date(customer.lastContact))}
                    </div>
                </div>
            </div>
            
            <div class="list-item-actions">
                <a href="tel:${customer.phone}" class="list-item-action">
                    <i class="fas fa-phone"></i>
                    电话
                </a>
                <a href="detail.html?id=${customer.id}" class="list-item-action primary">
                    <i class="fas fa-eye"></i>
                    详情
                </a>
                <a href="follow.html?id=${customer.id}" class="list-item-action success">
                    <i class="fas fa-edit"></i>
                    跟进
                </a>
            </div>
        </div>
    `;
}

// 获取状态样式类
function getStatusClass(status) {
    const statusMap = {
        '初步意向': 'primary',
        '带看中': 'warning',
        '已成交': 'success',
        '跟进中': 'info',
        '暂停': 'secondary'
    };
    return statusMap[status] || 'secondary';
}

// 获取状态颜色
function getStatusColor(status) {
    const colorMap = {
        '初步意向': '#2196f3',
        '带看中': '#ff9800',
        '已成交': '#4caf50',
        '跟进中': '#00bcd4',
        '暂停': '#9e9e9e'
    };
    return colorMap[status] || '#9e9e9e';
}

// 按状态筛选
function filterByStatus(status) {
    currentFilter = status;
    
    // 更新筛选标签状态
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.status === status) {
            tab.classList.add('active');
        }
    });
    
    // 筛选数据
    applyFilters();
}

// 搜索处理
function handleSearch(query) {
    searchQuery = query.toLowerCase();
    applyFilters();
}

// 应用筛选条件
function applyFilters() {
    filteredCustomers = customerData.filter(customer => {
        // 状态筛选
        const statusMatch = currentFilter === 'all' || customer.status === getStatusByFilter(currentFilter);
        
        // 搜索筛选
        const searchMatch = !searchQuery || 
            customer.name.toLowerCase().includes(searchQuery) ||
            customer.contact.toLowerCase().includes(searchQuery) ||
            customer.phone.includes(searchQuery) ||
            customer.industry.toLowerCase().includes(searchQuery);
        
        return statusMatch && searchMatch;
    });
    
    renderCustomerList();
}

// 根据筛选器获取状态
function getStatusByFilter(filter) {
    const filterMap = {
        'intent': '初步意向',
        'viewing': '带看中',
        'deal': '已成交',
        'follow': '跟进中'
    };
    return filterMap[filter] || filter;
}

// 显示搜索模态框
function showSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
    }
}

// 隐藏搜索模态框
function hideSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    }
}

// 显示筛选模态框
function showFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
    }
}

// 隐藏筛选模态框
function hideFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    }
}

// 重置搜索
function resetSearch() {
    document.getElementById('modalSearchInput').value = '';
    document.getElementById('phoneSearchInput').value = '';
    document.getElementById('industryFilter').value = '';
}

// 执行搜索
function performSearch() {
    const nameQuery = document.getElementById('modalSearchInput').value;
    const phoneQuery = document.getElementById('phoneSearchInput').value;
    const industry = document.getElementById('industryFilter').value;
    
    // 应用高级搜索逻辑
    filteredCustomers = customerData.filter(customer => {
        const nameMatch = !nameQuery || 
            customer.name.toLowerCase().includes(nameQuery.toLowerCase()) ||
            customer.contact.toLowerCase().includes(nameQuery.toLowerCase());
        
        const phoneMatch = !phoneQuery || customer.phone.includes(phoneQuery);
        const industryMatch = !industry || customer.industry === industry;
        
        return nameMatch && phoneMatch && industryMatch;
    });
    
    renderCustomerList();
    hideSearchModal();
    Utils.showToast(`找到 ${filteredCustomers.length} 个客户`, 'info');
}

// 重置筛选
function resetFilter() {
    // 重置表单
    document.getElementById('minBudget').value = '';
    document.getElementById('maxBudget').value = '';
    document.getElementById('minArea').value = '';
    document.getElementById('maxArea').value = '';
    document.getElementById('lastContactFilter').value = '';
    
    // 重置筛选标签
    const filterTabs = document.querySelectorAll('#filterModal .filter-tab');
    filterTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.status === 'all') {
            tab.classList.add('active');
        }
    });
}

// 应用筛选
function applyFilter() {
    const minBudget = parseFloat(document.getElementById('minBudget').value) || 0;
    const maxBudget = parseFloat(document.getElementById('maxBudget').value) || Infinity;
    const minArea = parseFloat(document.getElementById('minArea').value) || 0;
    const maxArea = parseFloat(document.getElementById('maxArea').value) || Infinity;
    const lastContact = document.getElementById('lastContactFilter').value;
    
    filteredCustomers = customerData.filter(customer => {
        // 预算筛选
        const budget = parseBudgetRange(customer.budget);
        const budgetMatch = budget.min >= minBudget && budget.max <= maxBudget;
        
        // 面积筛选
        const area = parseFloat(customer.area.replace(/[^\d.]/g, '')) || 0;
        const areaMatch = area >= minArea && area <= maxArea;
        
        // 最后跟进时间筛选
        const contactMatch = checkLastContactFilter(customer.lastContact, lastContact);
        
        return budgetMatch && areaMatch && contactMatch;
    });
    
    renderCustomerList();
    hideFilterModal();
    Utils.showToast(`筛选出 ${filteredCustomers.length} 个客户`, 'info');
}

// 解析预算范围
function parseBudgetRange(budgetStr) {
    const matches = budgetStr.match(/(\d+)-(\d+)/);
    if (matches) {
        return {
            min: parseFloat(matches[1]),
            max: parseFloat(matches[2])
        };
    }
    
    const singleMatch = budgetStr.match(/(\d+)/);
    if (singleMatch) {
        const value = parseFloat(singleMatch[1]);
        return { min: value, max: value };
    }
    
    return { min: 0, max: Infinity };
}

// 检查最后跟进时间筛选
function checkLastContactFilter(lastContact, filter) {
    if (!filter) return true;
    
    const contactDate = new Date(lastContact);
    const now = new Date();
    const diffDays = Math.floor((now - contactDate) / (1000 * 60 * 60 * 24));
    
    switch (filter) {
        case 'today':
            return diffDays === 0;
        case 'week':
            return diffDays <= 7;
        case 'month':
            return diffDays <= 30;
        case 'overdue':
            return diffDays > 7; // 超过7天未跟进
        default:
            return true;
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    loadCustomerData();
    
    // 处理筛选模态框中的筛选标签点击
    const filterModalTabs = document.querySelectorAll('#filterModal .filter-tab');
    filterModalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterModalTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// 导出函数供全局使用
window.loadCustomerData = loadCustomerData;
window.filterByStatus = filterByStatus;
window.handleSearch = handleSearch;
window.showSearchModal = showSearchModal;
window.hideSearchModal = hideSearchModal;
window.showFilterModal = showFilterModal;
window.hideFilterModal = hideFilterModal;
window.resetSearch = resetSearch;
window.performSearch = performSearch;
window.resetFilter = resetFilter;
window.applyFilter = applyFilter;