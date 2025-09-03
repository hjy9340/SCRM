// 首页专用JavaScript功能

// 首页数据加载
async function loadHomeData() {
    try {
        Utils.showLoading('加载数据中...');
        
        // 加载统计数据
        const statsResponse = await API.request('/api/stats');
        if (statsResponse.success) {
            updateStatsCards(statsResponse.data);
        }
        
        // 加载最近动态
        const activitiesResponse = await API.request('/api/activities');
        if (activitiesResponse.success) {
            updateActivitiesList(activitiesResponse.data);
        }
        
        Utils.hideLoading();
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showToast('数据加载失败', 'error');
    }
}

// 更新统计卡片
function updateStatsCards(data) {
    const cards = document.querySelectorAll('.stats-card');
    
    if (cards[0]) {
        cards[0].querySelector('.number').textContent = data.daily.customers || 5;
        cards[0].querySelector('.label').textContent = '今日客户';
    }
    
    if (cards[1]) {
        cards[1].querySelector('.number').textContent = data.weekly.followups || 23;
        cards[1].querySelector('.label').textContent = '本周跟进';
    }
    
    if (cards[2]) {
        cards[2].querySelector('.number').textContent = data.monthly.deals || 8;
        cards[2].querySelector('.label').textContent = '本月成交';
    }
}

// 更新动态列表
function updateActivitiesList(data) {
    const timeline = document.querySelector('.timeline');
    if (!timeline || !data.length) return;
    
    // 清空现有内容
    timeline.innerHTML = '';
    
    data.forEach(activity => {
        const timelineItem = createTimelineItem(activity);
        timeline.appendChild(timelineItem);
    });
}

// 创建时间轴项目
function createTimelineItem(activity) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    
    const iconClass = getActivityIcon(activity.type);
    const iconColor = getActivityIconColor(activity.type);
    
    item.innerHTML = `
        <div class="timeline-content">
            <div class="timeline-time">${Utils.formatTime(new Date(activity.time))}</div>
            <div class="timeline-title">
                <i class="fas fa-${iconClass} ${iconColor} mr-2"></i>
                ${activity.title}
            </div>
            <div class="timeline-desc">
                ${activity.description}
            </div>
        </div>
    `;
    
    return item;
}

// 获取活动图标
function getActivityIcon(type) {
    const icons = {
        appointment: 'eye',
        inquiry: 'phone',
        deal: 'handshake',
        share: 'share',
        follow: 'user-clock',
        view: 'chart-line'
    };
    return icons[type] || 'info-circle';
}

// 获取活动图标颜色
function getActivityIconColor(type) {
    const colors = {
        appointment: 'text-primary',
        inquiry: 'text-success',
        deal: 'text-warning',
        share: 'text-info',
        follow: 'text-secondary',
        view: 'text-primary'
    };
    return colors[type] || 'text-secondary';
}

// 查看每日统计
function viewDailyStats() {
    Utils.showToast('跳转到每日统计页面', 'info');
    // Navigation.goto('stats/daily.html');
}

// 查看每周统计
function viewWeeklyStats() {
    Utils.showToast('跳转到每周统计页面', 'info');
    // Navigation.goto('stats/weekly.html');
}

// 查看每月统计
function viewMonthlyStats() {
    Utils.showToast('跳转到每月统计页面', 'info');
    // Navigation.goto('stats/monthly.html');
}

// 显示通知
function showNotifications() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
    }
}

// 隐藏通知
function hideNotifications() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    }
}

// 显示用户信息
function showProfile() {
    Navigation.goto('profile/index.html');
}

// 显示快捷操作
function showQuickActions() {
    const modal = document.getElementById('quickActionModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('fade-in');
    }
}

// 隐藏快捷操作
function hideQuickActions() {
    const modal = document.getElementById('quickActionModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    }
}

// 加载更多动态
async function loadMoreActivities() {
    try {
        Utils.showLoading('加载更多...');
        
        // 模拟加载更多数据
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Utils.hideLoading();
        Utils.showToast('已加载全部动态', 'info');
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showToast('加载失败', 'error');
    }
}

// 刷新页面数据
async function refreshPageData() {
    await loadHomeData();
    Utils.showToast('数据已刷新', 'success');
}

// 导出函数供全局使用
window.viewDailyStats = viewDailyStats;
window.viewWeeklyStats = viewWeeklyStats;
window.viewMonthlyStats = viewMonthlyStats;
window.showNotifications = showNotifications;
window.hideNotifications = hideNotifications;
window.showProfile = showProfile;
window.showQuickActions = showQuickActions;
window.hideQuickActions = hideQuickActions;
window.loadMoreActivities = loadMoreActivities;
window.refreshPageData = refreshPageData;