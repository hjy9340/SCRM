// SCRM系统通用JavaScript功能

// 本地占位图片生成工具
const PlaceholderGenerator = {
    // 生成文字占位图
    generateTextPlaceholder(text = '', width = 50, height = 50, bgColor = '#e0e0e0', textColor = '#757575') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // 绘制背景
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // 如果有文字，绘制文字
        if (text) {
            ctx.fillStyle = textColor;
            ctx.font = `bold ${Math.min(width, height) / 2}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text.charAt(0).toUpperCase(), width / 2, height / 2);
        }
        
        return canvas.toDataURL('image/png');
    },
    
    // 生成错误占位图
    generateErrorPlaceholder(width = 50, height = 50) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // 绘制背景
        ctx.fillStyle = '#ffdddd';
        ctx.fillRect(0, 0, width, height);
        
        // 绘制X图案
        ctx.strokeStyle = '#f44336';
        ctx.lineWidth = Math.max(2, Math.min(width, height) / 20);
        ctx.beginPath();
        const padding = Math.min(width, height) / 4;
        ctx.moveTo(padding, padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.moveTo(width - padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
        
        return canvas.toDataURL('image/png');
    },
    
    // 生成空占位图
    generateEmptyPlaceholder(width = 50, height = 50, bgColor = '#f5f5f5') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // 绘制背景
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        return canvas.toDataURL('image/png');
    }
};

// 图片优化管理器 - 全局实例
let globalLazyLoader = null;
let globalResponsiveManager = null;
let globalImagePreloader = null;

// 初始化图片优化系统
function initImageOptimization() {
    // 初始化懒加载
    if (typeof LazyImageLoader !== 'undefined') {
        globalLazyLoader = new LazyImageLoader({
            rootMargin: '100px 0px',
            threshold: 0.1
        });
    }
    
    // 初始化响应式管理器
    if (typeof ResponsiveImageManager !== 'undefined') {
        globalResponsiveManager = new ResponsiveImageManager();
    }
    
    // 初始化图片预加载器
    if (typeof ImagePreloader !== 'undefined') {
        globalImagePreloader = new ImagePreloader();
        
        // 定期清理缓存
        setInterval(() => {
            globalImagePreloader.clearCache();
        }, 5 * 60 * 1000); // 5分钟清理一次
    }
    
    // 自动处理页面中的图片
    autoOptimizeImages();
    
    // 预加载关键图片
    preloadCriticalImages();
}

// 自动优化页面图片
function autoOptimizeImages() {
    // 为所有图片添加懒加载
    const images = document.querySelectorAll('img:not([data-no-lazy]):not([data-lazy-processed="true"])');
    if (globalLazyLoader && images.length > 0) {
        globalLazyLoader.observe(images);
    }
    
    // 为响应式图片设置适当的尺寸
    const responsiveImages = document.querySelectorAll('[data-responsive]:not([data-lazy-processed="true"])');
    if (globalResponsiveManager && responsiveImages.length > 0) {
        responsiveImages.forEach(img => {
            globalResponsiveManager.updateImageSrc(img);
        });
    }
}

// 预加载关键图片
function preloadCriticalImages() {
    if (!globalImagePreloader) return;
    
    const pathname = window.location.pathname;
    
    // 预加载当前页面的关键图片
    if (pathname.includes('property/index.html')) {
        // 房源列表页面，预加载首屏图片
        const criticalImages = [
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        ];
        globalImagePreloader.preloadImages(criticalImages, 9);
    }
    
    // 预加载可能访问的下一个页面的图片
    predictivePreload();
}

// 预测性预加载
function predictivePreload() {
    if (!globalImagePreloader) return;
    
    const pathname = window.location.pathname;
    
    // 根据当前页面预测用户可能访问的下一个页面
    if (pathname.includes('customer/index.html')) {
        // 在客户列表页，预加载客户详情页的图片
        globalImagePreloader.preloadPageImages('/pages/customer/detail.html');
    } else if (pathname.includes('property/index.html')) {
        // 在房源列表页，预加载房源详情页的图片
        globalImagePreloader.preloadPageImages('/pages/property/detail.html');
    }
}

// 监听链接点击，预加载目标页面图片
function setupLinkPreloading() {
    document.addEventListener('mouseenter', (e) => {
        const link = e.target.closest('a[href]');
        if (link && globalImagePreloader) {
            const href = link.getAttribute('href');
            if (href && href.includes('.html')) {
                globalImagePreloader.preloadPageImages(href);
            }
        }
    }, true);
}
// 监听 DOM 变化，自动处理新添加的图片
function observeImageChanges() {
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const images = node.tagName === 'IMG' ? [node] : 
                                         node.querySelectorAll ? Array.from(node.querySelectorAll('img')) : [];
                            
                            // 过滤已经处理过的图片
                            const unprocessedImages = images.filter(img => 
                                !img.dataset.lazyProcessed || img.dataset.lazyProcessed !== 'true'
                            );
                            
                            if (unprocessedImages.length > 0 && globalLazyLoader) {
                                globalLazyLoader.observe(unprocessedImages);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 设置链接预加载
    setupLinkPreloading();
}

// 工具函数
const Utils = {
    // 格式化时间
    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;
        
        return date.toLocaleDateString('zh-CN');
    },
    
    // 格式化数字
    formatNumber(num) {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num.toString();
    },
    
    // 格式化金额
    formatMoney(amount) {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
        }).format(amount);
    },
    
    // 获取URL参数
    getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    
    // 设置URL参数
    setUrlParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },
    
    // 显示提示消息
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // 添加样式
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: this.getToastColor(type),
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            zIndex: '1001',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500'
        });
        
        document.body.appendChild(toast);
        
        // 动画效果
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        
        requestAnimationFrame(() => {
            toast.style.transition = 'all 0.3s ease';
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // 自动消失
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    },
    
    // 获取提示图标
    getToastIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        return icons[type] || icons.info;
    },
    
    // 获取提示颜色
    getToastColor(type) {
        const colors = {
            info: '#2196f3',
            success: '#4caf50',
            warning: '#ff9800',
            error: '#f44336'
        };
        return colors[type] || colors.info;
    },
    
    // 显示确认对话框
    showConfirm(message, callback) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">确认操作</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="hideConfirm(false)">取消</button>
                    <button class="btn btn-primary" onclick="hideConfirm(true)">确认</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        window.hideConfirm = (result) => {
            document.body.removeChild(overlay);
            if (callback) callback(result);
            delete window.hideConfirm;
        };
    },
    
    // 显示加载状态
    showLoading(message = '加载中...') {
        const loading = document.createElement('div');
        loading.id = 'loading-overlay';
        loading.className = 'modal-overlay';
        loading.innerHTML = `
            <div style="text-align: center; color: white;">
                <div class="spinner" style="margin: 0 auto 16px;"></div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(loading);
    },
    
    // 隐藏加载状态
    hideLoading() {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            document.body.removeChild(loading);
        }
    },
    
    // 本地存储
    storage: {
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch {
                return defaultValue;
            }
        },
        
        remove(key) {
            localStorage.removeItem(key);
        },
        
        clear() {
            localStorage.clear();
        }
    }
};

// 页面导航功能
const Navigation = {
    // 页面跳转
    goto(url) {
        window.location.href = url;
    },
    
    // 返回上一页
    back() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.goto('index.html');
        }
    },
    
    // 替换当前页面
    replace(url) {
        window.location.replace(url);
    },
    
    // 重新加载页面
    reload() {
        window.location.reload();
    }
};

// 数据API模拟
const API = {
    // 基础URL
    baseURL: '',
    
    // 请求方法
    async request(url, options = {}) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 这里可以替换为真实的API调用
        // const response = await fetch(this.baseURL + url, options);
        // return response.json();
        
        // 模拟数据
        return this.getMockData(url, options);
    },
    
    // 模拟数据
    getMockData(url, options) {
        const mockData = {
            '/api/customers': this.getMockCustomers(),
            '/api/properties': this.getMockProperties(),
            '/api/activities': this.getMockActivities(),
            '/api/stats': this.getMockStats()
        };
        
        // 处理带ID的请求
        if (url.startsWith('/api/properties/')) {
            const propertyId = url.split('/')[3];
            return this.getMockPropertyDetail(propertyId);
        }
        
        if (url.startsWith('/api/customers/')) {
            const customerId = url.split('/')[3];
            if (url.includes('/followups')) {
                return this.getMockCustomerFollowups(customerId);
            }
            return this.getMockCustomerDetail(customerId);
        }
        
        return mockData[url] || { success: true, data: [] };
    },
    
    // 模拟客户数据
    getMockCustomers() {
        return {
            success: true,
            data: [
                {
                    id: 1,
                    name: '深圳XX科技公司',
                    contact: '张经理',
                    phone: '138-1234-5678',
                    industry: '电子制造业',
                    status: '初步意向',
                    budget: '500-800万',
                    area: '2000㎡',
                    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 2,
                    name: '广州YY制造有限公司',
                    contact: '李总',
                    phone: '139-1234-5678',
                    industry: '机械制造',
                    status: '带看中',
                    budget: '300-500万',
                    area: '1500㎡',
                    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                }
            ]
        };
    },
    
    // 模拟房源数据
    getMockProperties() {
        return {
            success: true,
            data: [
                {
                    id: 1,
                    title: '深圳宝安区工业园厂房',
                    location: '深圳市宝安区石岩工业园B区',
                    price: 80,
                    area: 3000,
                    height: 8,
                    load: 800,
                    type: '出租',
                    views: 125,
                    image: 'https://via.placeholder.com/300x200'
                },
                {
                    id: 2,
                    title: '东莞松山湖独栋厂房',
                    location: '东莞市松山湖高新区',
                    price: 1500,
                    priceUnit: '万',
                    area: 5000,
                    height: 10,
                    load: 1000,
                    type: '出售',
                    views: 89,
                    image: 'https://via.placeholder.com/300x200'
                }
            ]
        };
    },
    
    // 模拟动态数据
    getMockActivities() {
        return {
            success: true,
            data: [
                {
                    id: 1,
                    type: 'appointment',
                    title: '张三预约看房',
                    description: '深圳XX科技公司的张经理预约明天下午参观宝安工业园厂房',
                    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    icon: 'eye'
                },
                {
                    id: 2,
                    type: 'inquiry',
                    title: '李四咨询厂房',
                    description: '广州YY制造的李总电话咨询松山湖独栋厂房的租金和配套情况',
                    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
                    icon: 'phone'
                }
            ]
        };
    },
    
    // 模拟统计数据
    getMockStats() {
        return {
            success: true,
            data: {
                daily: { customers: 5, inquiries: 12, views: 156 },
                weekly: { followups: 23, appointments: 8, shares: 45 },
                monthly: { deals: 8, revenue: 2400000, commission: 240000 }
            }
        };
    },
    
    // 模拟房源详情数据
    getMockPropertyDetail(propertyId) {
        const properties = {
            '1': {
                id: 1,
                title: '深圳宝安区工业园区厂房',
                location: '深圳市宝安区石岩工业园区B区',
                price: 80,
                area: 3000,
                height: 8,
                load: 800,
                power: 1000,
                type: '出租',
                status: '可租',
                views: 125,
                todayViews: 8,
                inquiries: 12,
                collections: 5,
                landType: '工业用地',
                ownership: '红本独立产权',
                firefighting: '自动喷淋系统',
                isCollected: false,
                agent: {
                    name: '王销售',
                    title: '高级置业顾问',
                    phone: '138-1234-5678'
                },
                images: [
                    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop'
                ]
            },
            '2': {
                id: 2,
                title: '东莞松山湖独栋厂房',
                location: '东莞市松山湖高新区',
                price: 1500,
                area: 5000,
                height: 10,
                load: 1000,
                power: 1500,
                type: '出售',
                status: '在售',
                views: 89,
                todayViews: 5,
                inquiries: 8,
                collections: 3,
                landType: '工业用地',
                ownership: '红本独立产权',
                firefighting: '自动喷淋系统',
                isCollected: false,
                agent: {
                    name: '李销售',
                    title: '高级置业顾问',
                    phone: '139-2345-6789'
                },
                images: [
                    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
                ]
            }
        };
        
        const property = properties[propertyId] || properties['1'];
        
        return {
            success: true,
            data: property
        };
    },
    
    // 模拟客户详情数据
    getMockCustomerDetail(customerId) {
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
                lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        };
    },
    
    // 模拟客户跟进记录
    getMockCustomerFollowups(customerId) {
        return {
            success: true,
            data: [
                {
                    id: 1,
                    type: 'phone',
                    title: '电话沟通',
                    content: '与张经理电话沟通，了解了公司的具体需求，需要面积2000-3000平米的厂房。',
                    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    author: '王销售'
                },
                {
                    id: 2,
                    type: 'visit',
                    title: '实地带看',
                    content: '带张经理参观了宝安区的工业园，对地理位置和配套设施都比较满意。',
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
};

// 全局事件处理
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPage();
    
    // 处理返回按钮
    const backButtons = document.querySelectorAll('.navbar-back, [data-action="back"]');
    backButtons.forEach(button => {
        button.addEventListener('click', Navigation.back);
    });
    
    // 处理模态框关闭
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
        }
    });
    
    // 处理表单提交
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(form);
        });
    });
});

// 页面初始化
function initPage() {
    // 设置页面标题
    const pageTitle = document.querySelector('.navbar-title');
    if (pageTitle && !pageTitle.textContent) {
        pageTitle.textContent = document.title;
    }
    
    // 加载数据
    loadPageData();
    
    // 设置当前页面的底部导航状态
    updateTabbarState();
}

// 加载页面数据
async function loadPageData() {
    // 根据页面类型加载相应数据
    const pathname = window.location.pathname;
    
    if (pathname.includes('index.html') || pathname.endsWith('/')) {
        // 首页数据
        await loadHomeData();
    } else if (pathname.includes('customer')) {
        // 客户页面数据
        await loadCustomerData();
    } else if (pathname.includes('property')) {
        // 房源页面数据
        await loadPropertyData();
    }
}

// 更新底部导航状态
function updateTabbarState() {
    const pathname = window.location.pathname;
    const tabbarItems = document.querySelectorAll('.tabbar-item');
    
    tabbarItems.forEach(item => {
        item.classList.remove('active');
        
        const href = item.getAttribute('href');
        if (href && pathname.includes(href.replace('.html', ''))) {
            item.classList.add('active');
        }
    });
    
    // 如果是首页
    if (pathname.includes('index.html') || pathname.endsWith('/')) {
        const homeTab = document.querySelector('.tabbar-item[href*="index"]');
        if (homeTab) homeTab.classList.add('active');
    }
}

// 处理表单提交
async function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    Utils.showLoading('提交中...');
    
    try {
        // 模拟API提交
        await API.request('/api/submit', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        Utils.hideLoading();
        Utils.showToast('提交成功', 'success');
        
        // 可以在这里处理提交成功后的操作
        setTimeout(() => {
            Navigation.back();
        }, 1000);
        
    } catch (error) {
        Utils.hideLoading();
        Utils.showToast('提交失败，请重试', 'error');
    }
}

// 导出全局对象
window.Utils = Utils;
window.Navigation = Navigation;
window.API = API;
window.globalLazyLoader = () => globalLazyLoader;
window.globalResponsiveManager = () => globalResponsiveManager;
window.initImageOptimization = initImageOptimization;
window.autoOptimizeImages = autoOptimizeImages;

// 页面加载完成后初始化图片优化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initImageOptimization();
            observeImageChanges();
        }, 100);
    });
} else {
    setTimeout(() => {
        initImageOptimization();
        observeImageChanges();
    }, 100);
}