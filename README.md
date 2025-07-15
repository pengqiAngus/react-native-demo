# React Native 社交媒体应用

这是一个功能丰富的React Native社交媒体应用，包含文章浏览、视频观看、用户管理和内容发布等功能。

## 主要功能

### 🏠 首页
- 文章列表展示（瀑布流布局）
- 支持下拉刷新
- 文章卡片包含图片、标题、内容预览
- 显示作者信息和发布时间
- 点赞和评论功能

### 📱 视频页
- 类似抖音的全屏视频播放
- 支持上下滑动切换视频
- 视频播放控制（播放/暂停/静音）
- 视频信息展示（标题、描述、作者）
- 点赞、评论和分享功能
- 自动播放当前视频

### 👤 我的页面
- 个人信息展示（头像、姓名、邮箱）
- 用户统计（发布数、点赞数、粉丝数）
- Google邮箱登录功能
- 头像上传功能
- 用户发布的内容列表
- 退出登录功能

### ✍️ 发布页面
- 支持三种内容类型：文字、文章、视频
- 标题和内容输入
- 图片/视频媒体选择
- 实时字数统计
- 发布状态提示

## 技术特性

### 🎨 界面设计
- 干净简洁的现代UI设计
- 流畅的动画效果
- 响应式布局
- 渐变背景和阴影效果
- 图标和视觉元素丰富

### 💾 数据管理
- 本地数据存储（AsyncStorage）
- 模拟API请求
- 数据持久化
- 实时数据更新

### 🔐 用户认证
- 模拟Google登录
- 用户状态管理
- 登录状态持久化

## 项目结构

```
src/
├── components/          # 可复用组件
├── screens/            # 页面组件
│   ├── HomeScreen.tsx     # 首页
│   ├── VideoScreen.tsx    # 视频页
│   ├── ProfileScreen.tsx  # 我的页面
│   └── CreatePostScreen.tsx # 发布页面
├── services/           # 服务层
│   └── StorageService.ts  # 数据存储服务
├── data/              # 数据层
│   └── mockData.ts       # 模拟数据
├── types/             # 类型定义
│   └── index.ts         # 接口定义
└── utils/             # 工具函数
    └── index.ts          # 工具函数
```

## 安装和运行

### 前置要求
- Node.js 18+
- React Native 开发环境
- Android Studio（Android开发）
- Xcode（iOS开发）

### 安装依赖
```bash
pnpm install
```

### iOS 额外设置
```bash
cd ios && pod install && cd ..
```

### 运行应用
```bash
# 启动开发服务器
pnpm start

# 运行Android版本
pnpm android

# 运行iOS版本
pnpm ios
```

## 主要依赖

- `@react-navigation/native` - 导航管理
- `@react-navigation/bottom-tabs` - 底部标签导航
- `@react-navigation/stack` - 堆栈导航
- `react-native-vector-icons` - 图标库
- `react-native-video` - 视频播放
- `react-native-linear-gradient` - 渐变背景
- `@react-native-async-storage/async-storage` - 本地存储
- `@react-native-google-signin/google-signin` - Google登录

## 功能演示

### 首页功能
- 瀑布流布局展示文章
- 支持点赞和评论
- 作者信息和时间显示
- 下拉刷新功能

### 视频页功能
- 全屏视频播放
- 滑动切换视频
- 播放控制
- 社交功能（点赞、评论、分享）

### 个人页面
- 个人信息管理
- Google登录集成
- 内容发布历史
- 统计信息展示

### 发布功能
- 多种内容类型支持
- 媒体文件上传
- 实时预览
- 发布状态管理

## 数据模型

### 用户 (User)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isGoogleUser: boolean;
  createdAt: Date;
}
```

### 文章 (Article)
```typescript
interface Article {
  id: string;
  title: string;
  content: string;
  image?: string;
  authorId: string;
  author: User;
  createdAt: Date;
  likes: number;
  comments: Comment[];
}
```

### 视频 (Video)
```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  authorId: string;
  author: User;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  duration: number;
}
```

## 开发说明

### 添加新功能
1. 在相应的目录中创建新的组件或服务
2. 更新类型定义
3. 添加相应的样式
4. 测试功能

### 数据管理
所有数据都存储在本地，使用AsyncStorage进行持久化。StorageService类提供了统一的数据访问接口。

### 样式指南
- 使用一致的颜色方案
- 保持组件间距的一致性
- 使用合适的字体大小和权重
- 添加适当的阴影和圆角

## 已知问题

1. 视频播放在某些设备上可能需要额外的配置
2. Google登录功能需要在真实设备上测试
3. 图片上传功能目前为模拟实现

## 未来改进

- [ ] 添加推送通知
- [ ] 实现实时聊天功能
- [ ] 添加更多的社交功能
- [ ] 性能优化
- [ ] 添加深色模式支持
- [ ] 实现搜索功能

## 贡献

欢迎提交Pull Request和Issue来帮助改进这个项目。

## 许可证

MIT License

---

这个应用展示了现代React Native开发的最佳实践，包括组件化架构、状态管理、导航系统和用户体验设计。
