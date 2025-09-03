// 客户详情页JavaScript功能

let customerId = null;
let customerData = null;
let selectedStatus = null;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取客户ID
    customerId = Utils.getUrlParam('id');
    
    if (!customerId) {
        Utils.showToast('客户ID无效', 'error');
        setTimeout(() => Navigation.back(), 1500);
        return;
    }
    
    // 加载客户数据
    loadCustomerDetail();
    loadFollowUpHistory();
    
    // 初始化状态选择
    initStatusSelection();
});

// 加载客户详情
async function loadCustomerDetail() {
    try {
        Utils.showLoading('加载客户信息...');
        
        // 模拟API调用
        const response = await API.request(`/api/customers/${customerId}`);
        
        if (response.success) {
            customerData = response.data;
            renderCustomerDetail(customerData);
        } else {
            throw new Error('客户数据不存在');
        }
        
        Utils.hideLoading();
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showToast('客户信息加载失败', 'error');
        setTimeout(() => Navigation.back(), 1500);
    }
}

// 渲染客户详情
function renderCustomerDetail(data) {
    // 基本信息
    document.getElementById('companyName').textContent = data.name || '-';
    document.getElementById('contactPerson').textContent = data.contact || '-';
    
    const phoneEl = document.getElementById('contactPhone');
    if (data.phone) {
        phoneEl.textContent = data.phone;
        phoneEl.href = `tel:${data.phone}`;
    } else {
        phoneEl.textContent = '-';
        phoneEl.href = '#';
    }
    
    document.getElementById('email').textContent = data.email || '-';
    document.getElementById('industry').textContent = data.industry || '-';
    document.getElementById('address').textContent = data.address || '-';
    
    // 需求信息
    document.getElementById('budget').textContent = data.budget || '-';
    document.getElementById('areaRequirement').textContent = data.area || '-';
    document.getElementById('preferredArea').textContent = data.preferredArea || '-';
    document.getElementById('heightRequirement').textContent = data.heightRequirement || '-';
    document.getElementById('loadRequirement').textContent = data.loadRequirement || '-';
    document.getElementById('otherRequirements').textContent = data.otherRequirements || '-';
    
    // 状态信息
    const statusEl = document.getElementById('currentStatus');
    statusEl.textContent = data.status || '初步意向';
    statusEl.className = `status-badge ${getStatusClass(data.status)}`;
    
    const statusTimeEl = document.getElementById('statusTime');
    statusTimeEl.textContent = `更新于 ${Utils.formatTime(new Date(data.lastContact))}`;
}

// 获取状态样式类
function getStatusClass(status) {
    const statusMap = {
        '初步意向': 'primary',
        '带看中': 'warning',
        '谈判中': 'info',
        '已成交': 'success',
        '暂停跟进': 'secondary'
    };
    return statusMap[status] || 'primary';
}

// 加载跟进历史
async function loadFollowUpHistory() {
    try {
        const response = await API.request(`/api/customers/${customerId}/followups`);
        
        if (response.success) {
            renderFollowUpList(response.data);
        }
        
    } catch (error) {
        console.error('跟进记录加载失败:', error);
    }
}

// 渲染跟进记录列表
function renderFollowUpList(followUps) {
    const container = document.getElementById('followUpList');
    
    if (!followUps || followUps.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 20px;">
                <div class="icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="title">暂无跟进记录</div>
                <div class="description">点击添加跟进记录开始客户管理</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = followUps.map(followUp => createFollowUpItem(followUp)).join('');
    
    // 显示加载更多按钮
    if (followUps.length >= 5) {
        document.getElementById('loadMoreFollowUps').style.display = 'block';
    }
}

// 创建跟进记录项
function createFollowUpItem(followUp) {
    const iconClass = getFollowUpIcon(followUp.type);
    const iconColor = getFollowUpIconColor(followUp.type);
    
    return `
        <div class="timeline-item">
            <div class="timeline-content">
                <div class="timeline-time">${Utils.formatTime(new Date(followUp.time))}</div>
                <div class="timeline-title">
                    <i class="fas fa-${iconClass} ${iconColor} mr-2"></i>
                    ${followUp.title}
                </div>
                <div class="timeline-desc">
                    ${followUp.content}
                </div>
                <div class="timeline-author text-secondary">
                    <i class="fas fa-user mr-1"></i>
                    业务员：${followUp.author}
                </div>
            </div>
        </div>
    `;
}

// 获取跟进类型图标
function getFollowUpIcon(type) {
    const icons = {
        'phone': 'phone',
        'meeting': 'users',
        'wechat': 'comments',
        'email': 'envelope',
        'visit': 'eye',
        'other': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// 获取跟进类型图标颜色
function getFollowUpIconColor(type) {
    const colors = {
        'phone': 'text-success',
        'meeting': 'text-primary',
        'wechat': 'text-success',
        'email': 'text-info',
        'visit': 'text-warning',
        'other': 'text-secondary'
    };
    return colors[type] || 'text-secondary';
}

// 编辑客户
function editCustomer() {
    Navigation.goto(`edit.html?id=${customerId}`);
}

// 显示更多操作
function showMoreActions() {
    const modal = document.getElementById('moreActionsModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
    }
}

// 隐藏更多操作
function hideMoreActions() {
    const modal = document.getElementById('moreActionsModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    }
}

// 推荐房源
function recommendProperties() {
    Navigation.goto(`../property/index.html?recommend=${customerId}`);
}

// 添加跟进
function addFollowUp() {
    Navigation.goto(`follow.html?id=${customerId}`);
}

// 更改状态
function changeStatus() {
    const modal = document.getElementById('statusModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
    }
}

// 隐藏状态模态框
function hideStatusModal() {
    const modal = document.getElementById('statusModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    }
    
    // 重置选择
    selectedStatus = null;
    document.querySelectorAll('.status-option').forEach(option => {
        option.classList.remove('selected');
    });
}

// 初始化状态选择
function initStatusSelection() {
    const statusOptions = document.querySelectorAll('.status-option');
    statusOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除之前的选择
            statusOptions.forEach(opt => opt.classList.remove('selected'));
            
            // 选择当前项
            this.classList.add('selected');
            selectedStatus = this.dataset.status;
        });
    });
}

// 确认状态更改
async function confirmStatusChange() {
    if (!selectedStatus) {
        Utils.showToast('请选择新状态', 'warning');
        return;
    }
    
    const note = document.getElementById('statusNote').value.trim();
    
    try {
        Utils.showLoading('更新状态中...');
        
        // 模拟API调用
        await API.request(`/api/customers/${customerId}/status`, {
            method: 'PUT',
            body: JSON.stringify({
                status: selectedStatus,
                note: note
            })
        });
        
        // 更新页面显示
        customerData.status = selectedStatus;
        const statusEl = document.getElementById('currentStatus');
        statusEl.textContent = selectedStatus;
        statusEl.className = `status-badge ${getStatusClass(selectedStatus)}`;
        
        const statusTimeEl = document.getElementById('statusTime');
        statusTimeEl.textContent = '更新于 刚刚';
        
        Utils.hideLoading();
        Utils.showToast('状态更新成功', 'success');
        hideStatusModal();
        
        // 重新加载跟进记录
        loadFollowUpHistory();
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showToast('状态更新失败', 'error');
    }
}

// 分享客户
function shareCustomer() {
    if (navigator.share) {
        navigator.share({
            title: `客户信息 - ${customerData.name}`,
            text: `${customerData.name} - ${customerData.contact}`,
            url: window.location.href
        });
    } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href).then(() => {
            Utils.showToast('链接已复制到剪贴板', 'success');
        });
    }
    hideMoreActions();
}

// 导出客户
function exportCustomer() {
    Utils.showToast('客户资料导出功能开发中', 'info');
    hideMoreActions();
}

// 复制客户
function duplicateCustomer() {
    Navigation.goto(`add.html?duplicate=${customerId}`);
    hideMoreActions();
}

// 删除客户
function deleteCustomer() {
    Utils.showConfirm(
        `确定要删除客户 "${customerData.name}" 吗？此操作不可恢复。`,
        (confirmed) => {
            if (confirmed) {
                performDeleteCustomer();
            }
        }
    );
    hideMoreActions();
}

// 执行删除客户
async function performDeleteCustomer() {
    try {
        Utils.showLoading('删除客户中...');
        
        await API.request(`/api/customers/${customerId}`, {
            method: 'DELETE'
        });
        
        Utils.hideLoading();
        Utils.showToast('客户删除成功', 'success');
        
        setTimeout(() => {
            Navigation.goto('index.html');
        }, 1000);
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showToast('删除失败', 'error');
    }
}

// 加载更多跟进记录
async function loadMoreFollowUps() {
    try {
        Utils.showLoading('加载更多记录...');
        
        // 模拟加载更多数据
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Utils.hideLoading();
        Utils.showToast('已加载全部记录', 'info');
        
        // 隐藏加载更多按钮
        document.getElementById('loadMoreFollowUps').style.display = 'none';
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showToast('加载失败', 'error');
    }
}

// 扩展API模拟数据
API.getMockData = function(url, options) {
    const customerId = url.match(/\/api\/customers\/(\d+)/)?.[1];
    
    if (url.includes('/api/customers/') && url.includes('/followups')) {
        // 跟进记录数据
        return {
            success: true,
            data: [
                {
                    id: 1,
                    type: 'phone',
                    title: '电话沟通',
                    content: '客户对面积和价格都比较满意，询问了具体的配套设施和交通情况。预约明天下午实地看房。',
                    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    author: '王销售'
                },
                {
                    id: 2,
                    type: 'meeting',
                    title: '初次接触',
                    content: '通过朋友介绍认识，初步了解客户需求。客户正在寻找2000㎡左右的工业厂房，预算500-800万。',
                    time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    author: '王销售'
                },
                {
                    id: 3,
                    type: 'wechat',
                    title: '微信沟通',
                    content: '发送了几个房源信息给客户，客户对宝安工业园的厂房比较感兴趣。',
                    time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    author: '王销售'
                }
            ]
        };
    }
    
    if (url.includes('/api/customers/') && customerId) {
        // 客户详情数据
        return {
            success: true,
            data: {
                id: customerId,
                name: '深圳XX科技公司',
                contact: '张经理',
                phone: '138-1234-5678',
                email: 'zhang@xxtech.com',
                industry: '电子制造业',
                address: '深圳市南山区科技园南区',
                status: '初步意向',
                budget: '500-800万',
                area: '2000㎡左右',
                preferredArea: '深圳、东莞',
                heightRequirement: '≥6米',
                loadRequirement: '≥500kg/㎡',
                otherRequirements: '需要独立办公区域，有员工宿舍配套',
                lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                createTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        };
    }
    
    return { success: true, data: [] };
};

// 导出函数供全局使用
window.editCustomer = editCustomer;
window.showMoreActions = showMoreActions;
window.hideMoreActions = hideMoreActions;
window.recommendProperties = recommendProperties;
window.addFollowUp = addFollowUp;
window.changeStatus = changeStatus;
window.hideStatusModal = hideStatusModal;
window.confirmStatusChange = confirmStatusChange;
window.shareCustomer = shareCustomer;
window.exportCustomer = exportCustomer;
window.duplicateCustomer = duplicateCustomer;
window.deleteCustomer = deleteCustomer;
window.loadMoreFollowUps = loadMoreFollowUps;