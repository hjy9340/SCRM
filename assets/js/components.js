/**
 * SCRM系统组件库 - JavaScript工具类
 * 提供图片处理和数据可视化功能
 */

// ==================== 图片处理工具类 ====================

class ImageProcessor {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        this.compressionQuality = {
            thumbnail: 0.6,
            medium: 0.8,
            high: 0.9
        };
    }

    /**
     * 获取最佳图片格式
     * @param {string} originalFormat - 原始格式
     * @returns {string} - 最佳格式
     */
    getBestFormat(originalFormat) {
        // 检查浏览器支持
        if (this.supportsWebP() && originalFormat !== 'image/gif') {
            return 'image/webp';
        }
        return originalFormat === 'image/png' ? 'image/png' : 'image/jpeg';
    }

    /**
     * 检查WebP支持
     * @returns {boolean}
     */
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    /**
     * 智能压缩图片
     * @param {File|string} source - 图片文件或URL
     * @param {Object} options - 压缩选项
     * @returns {Promise<string>} - 压缩后的Base64图片
     */
    async compressImage(source, options = {}) {
        const {
            maxWidth = 1200,
            maxHeight = 800,
            quality = 'medium',
            format = 'auto'
        } = options;

        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                try {
                    const { width: newWidth, height: newHeight } = this.calculateDimensions(
                        img.width, img.height, maxWidth, maxHeight
                    );
                    
                    this.canvas.width = newWidth;
                    this.canvas.height = newHeight;
                    
                    this.ctx.drawImage(img, 0, 0, newWidth, newHeight);
                    
                    const outputFormat = format === 'auto' ? 
                        this.getBestFormat(source.type || 'image/jpeg') : format;
                    const compressionQuality = this.compressionQuality[quality] || 0.8;
                    
                    const compressedImage = this.canvas.toDataURL(outputFormat, compressionQuality);
                    resolve(compressedImage);
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = reject;
            
            if (typeof source === 'string') {
                img.crossOrigin = 'anonymous';
                img.src = source;
            } else {
                const reader = new FileReader();
                reader.onload = e => img.src = e.target.result;
                reader.readAsDataURL(source);
            }
        });
    }

    /**
     * 计算缩放后的尺寸
     */
    calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
        let width = originalWidth;
        let height = originalHeight;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }

    /**
     * 添加水印
     * @param {string} imageUrl - 原图URL
     * @param {string} watermarkText - 水印文字
     * @param {object} options - 水印选项
     */
    async addWatermark(imageUrl, watermarkText, options = {}) {
        const defaults = {
            position: 'bottom-right',
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.8)',
            padding: 20
        };
        
        const config = { ...defaults, ...options };
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                
                // 绘制原图
                this.ctx.drawImage(img, 0, 0);
                
                // 设置水印样式
                this.ctx.font = `${config.fontSize}px Arial`;
                this.ctx.fillStyle = config.color;
                this.ctx.textAlign = 'right';
                this.ctx.textBaseline = 'bottom';
                
                // 计算水印位置
                const x = img.width - config.padding;
                const y = img.height - config.padding;
                
                // 绘制水印
                this.ctx.fillText(watermarkText, x, y);
                
                resolve(this.canvas.toDataURL('image/jpeg', 0.9));
            };
            
            img.onerror = reject;
            img.src = imageUrl;
        });
    }

    /**
     * 图片滤镜效果
     * @param {string} imageUrl - 图片URL
     * @param {string} filter - 滤镜类型
     */
    async applyFilter(imageUrl, filter) {
        const filterMap = {
            grayscale: 'grayscale(100%)',
            sepia: 'sepia(100%)',
            blur: 'blur(5px)',
            brightness: 'brightness(1.2)',
            contrast: 'contrast(1.2)',
            vintage: 'sepia(50%) contrast(1.2) brightness(0.9)'
        };
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                
                this.ctx.filter = filterMap[filter] || 'none';
                this.ctx.drawImage(img, 0, 0);
                
                resolve(this.canvas.toDataURL('image/jpeg', 0.9));
            };
            
            img.onerror = reject;
            img.src = imageUrl;
        });
    }

    /**
     * 生成缩略图
     * @param {File} file - 图片文件
     * @param {number} size - 缩略图尺寸
     */
    async generateThumbnail(file, size = 150) {
        return this.resizeImage(file, size, size, 0.7);
    }
}

// ==================== 图片懒加载和响应式处理工具类 ====================

class LazyImageLoader {
    constructor(options = {}) {
        this.options = {
            rootMargin: '50px 0px',
            threshold: 0.01,
            className: 'lazy-image',
            loadingClass: 'loading',
            loadedClass: 'loaded',
            errorClass: 'error',
            placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMiAxNkwyMCAyNEwyOCAxNiIgc3Ryb2tlPSIjQkRCREJEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K',
            ...options
        };
        
        this.observer = null;
        this.images = new Set();
        this.processor = new ImageProcessor();
        
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                }
            );
        }
    }

    /**
     * 添加图片到懒加载队列
     * @param {HTMLImageElement|NodeList} images - 图片元素
     */
    observe(images) {
        const imageList = images instanceof NodeList ? Array.from(images) : [images];
        
        imageList.forEach(img => {
            if (img instanceof HTMLImageElement) {
                // 检查是否已经处理过
                if (img.dataset.lazyProcessed === 'true') {
                    return;
                }
                
                this.setupImage(img);
                if (this.observer) {
                    this.observer.observe(img);
                } else {
                    // 降级处理：直接加载
                    this.loadImage(img);
                }
                this.images.add(img);
                img.dataset.lazyProcessed = 'true';
            }
        });
    }

    /**
     * 设置图片初始状态
     * @param {HTMLImageElement} img - 图片元素
     */
    setupImage(img) {
        // 保存原始数据
        if (!img.dataset.src && img.src) {
            img.dataset.src = img.src;
        }
        
        // 设置占位符
        if (!img.src || img.src === img.dataset.src) {
            img.src = this.options.placeholder;
        }
        
        // 添加CSS类
        img.classList.add(this.options.className, this.options.loadingClass);
        
        // 设置基本样式
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '0.8';
    }

    /**
     * 处理图片进入视口
     * @param {IntersectionObserverEntry[]} entries
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // 检查是否已经处理过
                if (img.dataset.loadingStatus === 'loaded' || img.dataset.loadingStatus === 'loading') {
                    this.observer.unobserve(img);
                    return;
                }
                
                this.loadImage(img);
                this.observer.unobserve(img);
            }
        });
    }

    /**
     * 加载图片
     * @param {HTMLImageElement} img - 图片元素
     */
    async loadImage(img) {
        try {
            // 检查是否已经加载过
            if (img.dataset.loadingStatus === 'loaded') {
                return;
            }
            
            // 检查是否正在加载
            if (img.dataset.loadingStatus === 'loading') {
                // 防止重复加载
                return;
            }
            
            // 检查是否是外部placeholder域名
            const src = img.dataset.src || img.src;
            if (!src) return;
            
            // 如果是placeholder.com地址，使用本地占位图替代
            if (src.includes('via.placeholder.com') || src.includes('placeholder.com')) {
                const text = img.alt ? img.alt.charAt(0) : '';
                const width = img.width || 50;
                const height = img.height || 50;
                
                if (window.PlaceholderGenerator) {
                    img.src = window.PlaceholderGenerator.generateTextPlaceholder(text, width, height);
                    img.classList.remove(this.options.loadingClass);
                    img.classList.add(this.options.loadedClass);
                    img.style.opacity = '1';
                    img.dataset.loadingStatus = 'loaded';
                    img.dataset.lazyProcessed = 'true';
                    return;
                }
            }
            
            // 如果是占位符图片则不加载
            if (src === this.options.placeholder) return;

            // 标记为正在加载
            img.dataset.loadingStatus = 'loading';

            // 设置加载超时，防止长时间阻塞
            const timeout = setTimeout(() => {
                if (img.dataset.loadingStatus === 'loading') {
                    img.dataset.loadingStatus = 'error';
                    this.handleImageError(img);
                }
            }, 10000); // 10秒超时

            // 创建新的图片对象用于预加载
            const newImg = new Image();
            
            // 设置加载完成处理
            newImg.onload = () => {
                clearTimeout(timeout);
                img.src = src;
                img.classList.remove(this.options.loadingClass);
                img.classList.add(this.options.loadedClass);
                img.style.opacity = '1';
                
                // 标记为已加载
                img.dataset.loadingStatus = 'loaded';
                img.dataset.lazyProcessed = 'true';
                
                // 触发自定义事件
                img.dispatchEvent(new CustomEvent('imageLoaded', { detail: { src } }));
            };
            
            // 设置加载失败处理
            newImg.onerror = () => {
                clearTimeout(timeout);
                img.classList.remove(this.options.loadingClass);
                img.classList.add(this.options.errorClass);
                img.dataset.loadingStatus = 'error';
                this.handleImageError(img);
            };
            
            // 开始加载
            newImg.src = src;
            
        } catch (error) {
            console.error('图片加载失败:', error);
            img.dataset.loadingStatus = 'error';
            this.handleImageError(img);
        }
    }

    /**
     * 处理图片加载错误
     * @param {HTMLImageElement} img - 图片元素
     */
    handleImageError(img) {
        // 防止多次错误处理
        if (img.dataset.errorHandled === 'true') {
            return;
        }
        
        // 设置错误标记
        img.dataset.errorHandled = 'true';
        
        // 获取文字（用于生成占位图）
        const text = img.alt || '';
        
        // 获取宽高
        const width = img.width || 50;
        const height = img.height || 50;
        
        // 使用本地生成的数据 URI 代替远程图片
        if (window.PlaceholderGenerator) {
            img.src = window.PlaceholderGenerator.generateErrorPlaceholder(width, height);
        } else {
            // 内置错误占位图 (简单的 SVG 数据 URI)
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmRkZGQiLz48cGF0aCBkPSJNMTUgMTVMMzUgMzVNMzUgMTVMMTUgMzUiIHN0cm9rZT0iI2Y0NDMzNiIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+Cg==';
        }
        
        // 置空错误回调函数，防止无限错误循环
        img.onerror = null;
        
        // 添加错误样式
        img.classList.remove(this.options.loadingClass);
        img.classList.add(this.options.errorClass);
        
        // 触发错误事件
        img.dispatchEvent(new CustomEvent('imageError', { 
            detail: { 
                originalSrc: img.dataset.src,
                width: width,
                height: height 
            } 
        }));
    }

    /**
     * 销毁懒加载实例
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.images.clear();
    }
}

// ==================== 响应式图片工具类 ====================

class ResponsiveImageManager {
    constructor() {
        this.breakpoints = {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200
        };
        
        this.imageSizes = {
            thumbnail: { width: 150, height: 150 },
            small: { width: 300, height: 200 },
            medium: { width: 600, height: 400 },
            large: { width: 1200, height: 800 }
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.setupResizeListener();
    }

    /**
     * 获取当前断点
     * @returns {string} - 断点名称
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width >= this.breakpoints.xl) return 'xl';
        if (width >= this.breakpoints.lg) return 'lg';
        if (width >= this.breakpoints.md) return 'md';
        if (width >= this.breakpoints.sm) return 'sm';
        return 'xs';
    }

    /**
     * 设置窗口大小变化监听
     */
    setupResizeListener() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newBreakpoint = this.getCurrentBreakpoint();
                if (newBreakpoint !== this.currentBreakpoint) {
                    this.currentBreakpoint = newBreakpoint;
                    this.updateResponsiveImages();
                }
            }, 250);
        });
    }

    /**
     * 更新响应式图片
     */
    updateResponsiveImages() {
        const responsiveImages = document.querySelectorAll('[data-responsive]');
        responsiveImages.forEach(img => this.updateImageSrc(img));
    }

    /**
     * 更新单个图片源
     * @param {HTMLImageElement} img - 图片元素
     */
    updateImageSrc(img) {
        const baseUrl = img.dataset.baseUrl;
        const sizes = img.dataset.sizes ? JSON.parse(img.dataset.sizes) : null;
        
        if (!baseUrl) return;

        const targetSize = this.getTargetSize(this.currentBreakpoint, sizes);
        const newSrc = this.buildImageUrl(baseUrl, targetSize);
        
        if (img.dataset.src) {
            img.dataset.src = newSrc;
        } else {
            img.src = newSrc;
        }
    }

    /**
     * 获取目标尺寸
     * @param {string} breakpoint - 断点
     * @param {Object} customSizes - 自定义尺寸
     * @returns {Object} - 目标尺寸
     */
    getTargetSize(breakpoint, customSizes) {
        if (customSizes && customSizes[breakpoint]) {
            return customSizes[breakpoint];
        }
        
        // 默认尺寸映射
        const sizeMap = {
            xs: 'small',
            sm: 'small', 
            md: 'medium',
            lg: 'medium',
            xl: 'large'
        };
        
        return this.imageSizes[sizeMap[breakpoint]] || this.imageSizes.medium;
    }

    /**
     * 构建图片URL
     * @param {string} baseUrl - 基础URL
     * @param {Object} size - 尺寸对象
     * @returns {string} - 完整URL
     */
    buildImageUrl(baseUrl, size) {
        // 如果是外部URL（如Unsplash），添加尺寸参数
        if (baseUrl.includes('unsplash.com')) {
            const separator = baseUrl.includes('?') ? '&' : '?';
            return `${baseUrl}${separator}w=${size.width}&h=${size.height}&fit=crop&auto=format,compress&q=75`;
        }
        
        // 本地图片或其他服务的处理
        return baseUrl;
    }
}

// ==================== 图片预加载工具类 ====================

class ImagePreloader {
    constructor() {
        this.cache = new Map();
        this.loadingQueue = new Set();
        this.maxConcurrent = 3;
        this.currentLoading = 0;
    }

    /**
     * 预加载单个图片
     * @param {string} url - 图片URL
     * @param {number} priority - 优先级 (1-10)
     * @returns {Promise} 
     */
    preloadImage(url, priority = 5) {
        if (this.cache.has(url)) {
            return Promise.resolve(this.cache.get(url));
        }

        return new Promise((resolve, reject) => {
            const imageTask = {
                url,
                priority,
                resolve,
                reject,
                timestamp: Date.now()
            };

            this.addToQueue(imageTask);
            this.processQueue();
        });
    }

    /**
     * 批量预加载图片
     * @param {Array} urls - 图片URL数组
     * @param {number} priority - 优先级
     * @returns {Promise<Array>}
     */
    preloadImages(urls, priority = 5) {
        const promises = urls.map(url => this.preloadImage(url, priority));
        return Promise.all(promises);
    }

    /**
     * 预加载下一页面的关键图片
     * @param {string} pagePath - 页面路径
     */
    preloadPageImages(pagePath) {
        const imageUrls = this.getPageImageUrls(pagePath);
        if (imageUrls.length > 0) {
            this.preloadImages(imageUrls, 8); // 高优先级
        }
    }

    /**
     * 获取页面关键图片URL
     * @param {string} pagePath - 页面路径
     * @returns {Array} - 图片URL数组
     */
    getPageImageUrls(pagePath) {
        const imageMap = {
            '/pages/property/detail.html': [
                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop'
            ],
            '/pages/customer/detail.html': [
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'
            ],
            '/pages/property/index.html': [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
            ]
        };

        return imageMap[pagePath] || [];
    }

    /**
     * 添加到加载队列
     * @param {Object} imageTask - 图片任务
     */
    addToQueue(imageTask) {
        // 按优先级排序插入队列
        const queueArray = Array.from(this.loadingQueue);
        const insertIndex = queueArray.findIndex(task => task.priority < imageTask.priority);
        
        if (insertIndex === -1) {
            this.loadingQueue.add(imageTask);
        } else {
            // 重新构建队列以保持排序
            const newQueue = new Set();
            queueArray.forEach((task, index) => {
                if (index === insertIndex) {
                    newQueue.add(imageTask);
                }
                newQueue.add(task);
            });
            this.loadingQueue = newQueue;
        }
    }

    /**
     * 处理加载队列
     */
    processQueue() {
        if (this.currentLoading >= this.maxConcurrent || this.loadingQueue.size === 0) {
            return;
        }

        const task = this.loadingQueue.values().next().value;
        this.loadingQueue.delete(task);
        this.currentLoading++;

        this.loadImageInternal(task)
            .finally(() => {
                this.currentLoading--;
                this.processQueue();
            });
    }

    /**
     * 内部图片加载方法
     * @param {Object} task - 图片任务
     * @returns {Promise}
     */
    loadImageInternal(task) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.cache.set(task.url, img);
                task.resolve(img);
                resolve(img);
            };
            
            img.onerror = (error) => {
                console.warn(`图片预加载失败: ${task.url}`);
                task.reject(error);
                reject(error);
            };
            
            img.src = task.url;
        });
    }

    /**
     * 清理缓存
     * @param {number} maxAge - 最大存活时间(毫秒)
     */
    clearCache(maxAge = 5 * 60 * 1000) { // 5分钟
        const now = Date.now();
        for (const [url, data] of this.cache.entries()) {
            if (data.timestamp && now - data.timestamp > maxAge) {
                this.cache.delete(url);
            }
        }
    }

    /**
     * 获取缓存状态
     * @returns {Object} - 缓存统计信息
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            queueSize: this.loadingQueue.size,
            currentLoading: this.currentLoading
        };
    }
}

// ==================== 图片上传组件 ====================

class ImageUploader {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            maxFiles: 10,
            maxFileSize: 5 * 1024 * 1024, // 5MB
            acceptedTypes: ['image/jpeg', 'image/png', 'image/gif'],
            showPreview: true,
            ...options
        };
        
        this.files = [];
        this.processor = new ImageProcessor();
        
        this.init();
    }

    init() {
        this.createUploadArea();
        this.bindEvents();
    }

    createUploadArea() {
        this.container.innerHTML = `
            <div class="image-uploader" id="uploadArea">
                <div class="image-uploader-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <div class="image-uploader-text">点击或拖拽上传图片</div>
                <div class="image-uploader-hint">支持 JPG、PNG、GIF 格式，最大 5MB</div>
                <input type="file" multiple accept="image/*" style="display: none;" id="fileInput">
            </div>
            <div class="image-preview" id="imagePreview"></div>
        `;
    }

    bindEvents() {
        const uploadArea = this.container.querySelector('#uploadArea');
        const fileInput = this.container.querySelector('#fileInput');

        // 点击上传
        uploadArea.addEventListener('click', () => fileInput.click());

        // 文件选择
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(Array.from(e.target.files));
        });

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files).filter(
                file => file.type.startsWith('image/')
            );
            
            this.handleFiles(files);
        });
    }

    async handleFiles(newFiles) {
        for (const file of newFiles) {
            if (this.files.length >= this.options.maxFiles) {
                Utils.showToast(`最多只能上传${this.options.maxFiles}张图片`, 'warning');
                break;
            }

            if (!this.validateFile(file)) continue;

            try {
                const thumbnail = await this.processor.generateThumbnail(file);
                const fileObj = {
                    file,
                    id: Date.now() + Math.random(),
                    thumbnail,
                    name: file.name,
                    size: file.size
                };

                this.files.push(fileObj);
                this.renderPreview(fileObj);
                
                if (this.options.onFileAdded) {
                    this.options.onFileAdded(fileObj);
                }
            } catch (error) {
                console.error('处理图片失败:', error);
                Utils.showToast('图片处理失败', 'error');
            }
        }
    }

    validateFile(file) {
        if (!this.options.acceptedTypes.includes(file.type)) {
            Utils.showToast('不支持的文件格式', 'warning');
            return false;
        }

        if (file.size > this.options.maxFileSize) {
            Utils.showToast('文件大小超出限制', 'warning');
            return false;
        }

        return true;
    }

    renderPreview(fileObj) {
        const preview = this.container.querySelector('#imagePreview');
        
        const item = document.createElement('div');
        item.className = 'image-preview-item';
        item.dataset.id = fileObj.id;
        
        item.innerHTML = `
            <img src="${fileObj.thumbnail}" alt="${fileObj.name}">
            <div class="image-preview-overlay">
                <div class="image-preview-actions">
                    <button class="image-preview-action" onclick="this.closest('.image-uploader').component.editImage('${fileObj.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="image-preview-action" onclick="this.closest('.image-uploader').component.removeImage('${fileObj.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        preview.appendChild(item);
        
        // 保存组件引用
        this.container.component = this;
    }

    removeImage(id) {
        this.files = this.files.filter(file => file.id != id);
        const item = this.container.querySelector(`[data-id="${id}"]`);
        if (item) item.remove();
        
        if (this.options.onFileRemoved) {
            this.options.onFileRemoved(id);
        }
    }

    editImage(id) {
        const file = this.files.find(f => f.id == id);
        if (file && this.options.onFileEdit) {
            this.options.onFileEdit(file);
        }
    }

    getFiles() {
        return this.files;
    }

    clear() {
        this.files = [];
        const preview = this.container.querySelector('#imagePreview');
        if (preview) preview.innerHTML = '';
    }
}

// ==================== 数据可视化工具类 ====================

class ChartRenderer {
    /**
     * 渲染柱状图
     * @param {HTMLElement} container - 容器元素
     * @param {Array} data - 数据数组
     * @param {object} options - 配置选项
     */
    static renderBarChart(container, data, options = {}) {
        const maxValue = Math.max(...data.map(item => item.value));
        
        container.innerHTML = `
            <div class="chart-title">${options.title || '柱状图'}</div>
            <div class="bar-chart">
                ${data.map(item => `
                    <div class="bar-chart-item">
                        <div class="bar-chart-bar" style="height: ${(item.value / maxValue) * 100}%">
                            <div class="bar-chart-value">${item.value}</div>
                        </div>
                        <div class="bar-chart-label">${item.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * 渲染进度环
     * @param {HTMLElement} container - 容器元素
     * @param {number} percentage - 百分比
     * @param {object} options - 配置选项
     */
    static renderProgressRing(container, percentage, options = {}) {
        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
        
        container.innerHTML = `
            <div class="progress-ring">
                <svg width="120" height="120">
                    <circle class="progress-ring-bg" cx="60" cy="60" r="${radius}"></circle>
                    <circle class="progress-ring-fill" cx="60" cy="60" r="${radius}" 
                            style="stroke-dasharray: ${strokeDasharray}"></circle>
                </svg>
                <div class="progress-ring-text">
                    <div>${percentage}%</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${options.label || ''}</div>
                </div>
            </div>
        `;
    }

    /**
     * 渲染KPI卡片
     * @param {HTMLElement} container - 容器元素
     * @param {object} data - KPI数据
     */
    static renderKPICard(container, data) {
        const changeClass = data.change > 0 ? 'positive' : 'negative';
        const changeIcon = data.change > 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        container.innerHTML = `
            <div class="kpi-card">
                <div class="kpi-card-icon" style="background: ${data.color || 'var(--primary-color)'}">
                    <i class="${data.icon || 'fas fa-chart-line'}"></i>
                </div>
                <div class="kpi-card-value">${data.value}</div>
                <div class="kpi-card-label">${data.label}</div>
                ${data.change !== undefined ? `
                    <div class="kpi-card-change ${changeClass}">
                        <i class="fas ${changeIcon}"></i>
                        ${Math.abs(data.change)}%
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * 渲染数据表格
     * @param {HTMLElement} container - 容器元素
     * @param {Array} data - 表格数据
     * @param {Array} columns - 列配置
     */
    static renderDataTable(container, data, columns) {
        const headers = columns.map(col => `
            <th class="${col.sortable ? 'sortable' : ''}" data-key="${col.key}">
                ${col.title}
            </th>
        `).join('');
        
        const rows = data.map(row => `
            <tr>
                ${columns.map(col => `
                    <td>${col.formatter ? col.formatter(row[col.key], row) : row[col.key]}</td>
                `).join('')}
            </tr>
        `).join('');
        
        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>${headers}</tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
        
        // 绑定排序事件
        container.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const key = header.dataset.key;
                const isAsc = header.classList.contains('asc');
                
                // 清除其他排序状态
                container.querySelectorAll('.sortable').forEach(h => {
                    h.classList.remove('asc', 'desc');
                });
                
                // 设置当前排序状态
                header.classList.add(isAsc ? 'desc' : 'asc');
                
                // 重新渲染表格
                const sortedData = [...data].sort((a, b) => {
                    const aVal = a[key];
                    const bVal = b[key];
                    
                    if (typeof aVal === 'number') {
                        return isAsc ? bVal - aVal : aVal - bVal;
                    } else {
                        return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
                    }
                });
                
                ChartRenderer.renderDataTable(container, sortedData, columns);
            });
        });
    }
}

// ==================== 图片轮播组件 ====================

class ImageCarousel {
    constructor(container, images, options = {}) {
        this.container = container;
        this.images = images;
        this.options = {
            autoPlay: false,
            interval: 3000,
            showNav: true,
            showIndicators: true,
            ...options
        };
        
        this.currentIndex = 0;
        this.autoPlayTimer = null;
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="image-carousel">
                <div class="image-carousel-track" id="carouselTrack">
                    ${this.images.map((img, index) => `
                        <div class="image-carousel-slide">
                            <img src="${img.url}" alt="${img.alt || ''}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
                
                ${this.options.showNav ? `
                    <button class="image-carousel-nav image-carousel-prev" id="prevBtn">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="image-carousel-nav image-carousel-next" id="nextBtn">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                ` : ''}
                
                ${this.options.showIndicators ? `
                    <div class="image-carousel-indicators" id="indicators">
                        ${this.images.map((_, index) => `
                            <button class="image-carousel-indicator ${index === 0 ? 'active' : ''}" 
                                    data-index="${index}"></button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    bindEvents() {
        const prevBtn = this.container.querySelector('#prevBtn');
        const nextBtn = this.container.querySelector('#nextBtn');
        const indicators = this.container.querySelectorAll('.image-carousel-indicator');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goTo(index));
        });

        // 触摸支持
        let startX = 0;
        const track = this.container.querySelector('#carouselTrack');
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
    }

    prev() {
        this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.updateCarousel();
    }

    next() {
        this.currentIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
        this.updateCarousel();
    }

    goTo(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const track = this.container.querySelector('#carouselTrack');
        const indicators = this.container.querySelectorAll('.image-carousel-indicator');

        track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        if (this.options.onChange) {
            this.options.onChange(this.currentIndex, this.images[this.currentIndex]);
        }
    }

    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            this.next();
        }, this.options.interval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    destroy() {
        this.stopAutoPlay();
        this.container.innerHTML = '';
    }
}

// ==================== 工具函数 ====================

const ComponentUtils = {
    /**
     * 防抖函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * 生成随机颜色
     */
    randomColor() {
        return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    },

    /**
     * 将数字转换为K/M格式
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
};

// 导出到全局对象
window.ImageProcessor = ImageProcessor;
window.ImageUploader = ImageUploader;
window.ChartRenderer = ChartRenderer;
window.ImageCarousel = ImageCarousel;
window.ComponentUtils = ComponentUtils;