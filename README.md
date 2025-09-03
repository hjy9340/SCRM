# 工业地产SCRM系统原型页面

## 项目概述

这是一个基于HTML/CSS/JavaScript的工业地产SCRM（Social Customer Relationship Management）系统原型页面设计项目，完整展示了工业地产行业客户关系管理系统的核心功能和用户界面。

## 快速开始

1. **直接访问**：在浏览器中打开 `index.html` 查看原型导航页面
2. **本地服务器**：使用本地HTTP服务器运行项目以获得最佳体验
3. **移动端体验**：使用Chrome开发者工具的移动端模拟器查看移动端效果

## 项目结构

```
SCRM/
├── index.html             # 原型导航页面（入口）
├── pages/                  # 页面文件
│   ├── index.html         # 系统首页
│   ├── customer/          # 客户管理模块
│   │   ├── index.html     # 客户列表页
│   │   └── detail.html    # 客户详情页
│   ├── property/          # 房源管理模块
│   │   └── index.html     # 房源列表页
│   └── share/             # H5分享页面
│       └── property.html  # 房源分享落地页
├── assets/                # 静态资源
│   ├── css/              # 样式文件
│   │   ├── global.css     # 全局样式
│   │   └── components.css # 组件样式
│   └── js/               # 脚本文件
│       ├── common.js      # 通用功能
│       ├── home.js        # 首页功能
│       ├── customer.js    # 客户管理
│       └── customer-detail.js # 客户详情
├── components/           # 组件文件（预留）
├── package.json         # 项目配置
└── README.md            # 项目说明
```

## 功能模块

### 1. 首页
- 数据概览卡片
- 快捷功能入口
- 最近动态列表
- 底部导航栏

### 2. 客户管理
- 客户列表页
- 客户详情页
- 跟进记录页
- 需求匹配功能

### 3. 房源管理
- 房源列表页
- 房源详情页
- 房源发布页
- 全景看房功能

### 4. 推广中心
- 推广中心首页
- 海报生成功能
- 分享统计页
- 佣金管理

### 5. 个人中心
- 个人信息管理
- 业绩统计
- 系统设置
- 帮助中心

### 6. H5分享页面
- 房源分享落地页
- 推广信息展示

## 设计特点

- **移动优先**: 针对微信小程序和移动端H5优化
- **响应式设计**: 适配多种屏幕尺寸
- **简洁高效**: 界面简洁明了，操作流程高效
- **数据驱动**: 突出关键业务数据和指标
- **社交化**: 支持便捷的分享和推广功能

## 使用说明

### 方式一：直接访问
```bash
# 克隆或下载项目到本地
git clone <repository-url>
cd SCRM

# 在浏览器中打开入口页面
open index.html  # macOS
start index.html # Windows
```

### 方式二：本地服务器（推荐）
```bash
# 使用Python启动本地服务器
python -m http.server 8000
# 或使用Node.js
npx http-server
# 或使用PHP
php -S localhost:8000

# 在浏览器中访问
http://localhost:8000
```

### 方式三：使用live-server
```bash
npm install -g live-server
live-server --port=3000
```

## 技术栈

### 前端技术
- **HTML5** - 语义化标签，良好的可访问性
- **CSS3** - 现代CSS特性，CSS变量，Flexbox/Grid布局
- **JavaScript ES6+** - 模块化编程，异步处理，现代语法
- **Font Awesome 6.0** - 丰富的图标库

### 设计模式
- **移动优先** - Mobile First 设计理念
- **响应式布局** - 适配各种屏幕尺寸
- **组件化设计** - 可复用的UI组件
- **模块化开发** - 功能模块独立开发

### 兼容性
- **现代浏览器** - Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **移动端浏览器** - iOS Safari, Chrome Mobile, 微信内置浏览器
- **屏幕适配** - 320px - 1920px 全屏幕尺寸支持

### 开发工具
- **代码编辑器** - VS Code / WebStorm
- **版本控制** - Git
- **调试工具** - Chrome DevTools
- **测试工具** - 浏览器兼容性测试

## 部署说明

### 静态部署
本项目为纯前端静态页面，可部署到任何支持静态文件托管的平台：

- **GitHub Pages** - 免费托管
- **Netlify** - 自动部署
- **Vercel** - 零配置部署
- **Apache/Nginx** - 传统Web服务器
- **CDN** - 全球加速

### 部署步骤
1. 将整个项目文件夹上传到Web服务器
2. 确保服务器支持HTML5 History API（可选）
3. 配置MIME类型支持
4. 设置缓存策略（可选）

### 性能优化
- CSS/JS文件已优化，无需额外压缩
- 图片使用占位符，实际部署时替换为优化后的图片
- 支持CDN加速Font Awesome字体文件
- 建议启用Gzip压缩

## 已完成页面

### ✅ 核心页面
- [x] 原型导航页面 (`index.html`)
- [x] 系统首页 (`pages/index.html`)
- [x] 客户列表页 (`pages/customer/index.html`)
- [x] 客户详情页 (`pages/customer/detail.html`)
- [x] 客户跟进记录页 (`pages/customer/follow.html`)
- [x] 房源列表页 (`pages/property/index.html`)
- [x] 房源详情页 (`pages/property/detail.html`)
- [x] 房源发布页 (`pages/property/add.html`)
- [x] 推广中心首页 (`pages/promotion/index.html`)
- [x] 海报生成页 (`pages/promotion/poster.html`)
- [x] 分享统计页 (`pages/promotion/stats.html`)
- [x] 个人中心页 (`pages/profile/index.html`)
- [x] H5分享页面 (`pages/share/property.html`)

### ✅ 核心功能
- [x] 响应式布局设计
- [x] 移动端优化
- [x] 数据概览统计
- [x] 搜索筛选功能
- [x] 模态框交互
- [x] 表单验证
- [x] 页面导航
- [x] 状态管理
- [x] 分享推广功能
- [x] 海报生成功能
- [x] 统计分析功能
- [x] 图片上传功能
- [x] 多步骤表单
- [x] 客户跟进管理
- [x] 房源发布流程

### 🚧 待完善功能
- [x] 客户跟进记录页
- [x] 房源详情页
- [x] 房源发布页
- [x] 推广中心模块
- [x] 个人中心模块
- [ ] 数据图表展示（推荐使用Chart.js或ECharts）
- [ ] 实时通知功能

## 功能演示

### 页面截图

> 建议使用Chrome浏览器的移动端模拟器查看最佳效果

1. **系统首页** - 展示数据概览、快捷功能入口和最近动态
2. **客户管理** - 客户列表、搜索筛选、客户详情、跟进记录
3. **房源管理** - 房源展示、分类筛选、房源详情
4. **H5分享页** - 移动端优化的房源展示和预约功能

### 交互功能

- **搜索筛选**：支持关键词搜索和多条件筛选
- **数据统计**：实时显示业务数据和统计指标
- **模态框**：优雅的弹窗交互体验
- **表单验证**：完整的表单输入验证机制
- **响应式设计**：适配各种屏幕尺寸
- **移动端优化**：针对手机浏览器和微信内置浏览器优化

## 版本历史

- **v1.0.0** - 2024.09.02
  - ✅ 完成项目基础架构
  - ✅ 实现所有核心页面原型
  - ✅ 完成响应式布局
  - ✅ 实现全部交互功能
  - ✅ 完成移动端优化
  - ✅ 实现客户管理模块
  - ✅ 实现房源管理模块
  - ✅ 实现推广中心模块
  - ✅ 实现个人中心模块
  - ✅ 实现H5分享页面

## 联系方式

如有问题或建议，欢迎联系：

- **项目文档** - [查看详细文档](.qoder/quests/prototype-page-design.md)
- **问题反馈** - 通过Issue提交问题
- **功能建议** - 欢迎提出改进建议

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

> 💡 **提示**: 建议使用Chrome浏览器的移动端模拟器（iPhone/Android）查看移动端效果，获得最佳的原型体验。