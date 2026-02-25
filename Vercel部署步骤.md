# Vercel 部署步骤（详细图文教程）

## 前提条件

✅ 项目已构建完成（dist文件夹已生成）
✅ 有GitHub、GitLab或Bitbucket账号（推荐）或直接拖拽部署

---

## 方法1：通过Git仓库部署（推荐）

### 步骤1：将代码推送到GitHub

如果还没有Git仓库：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 在GitHub上创建新仓库后，关联远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送代码
git push -u origin main
```

### 步骤2：访问Vercel

1. 打开浏览器，访问：https://vercel.com
2. 点击右上角 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub"（推荐）
4. 授权Vercel访问您的GitHub账号

### 步骤3：导入项目

1. 登录后，点击 "Add New..." 按钮
2. 选择 "Project"
3. 在 "Import Git Repository" 页面：
   - 找到您的仓库
   - 点击 "Import"

### 步骤4：配置项目

Vercel会自动检测到这是一个Vite项目，配置如下：

- **Framework Preset**: Vite
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: dist
- **Install Command**: `npm install`

通常不需要修改，直接点击 "Deploy"

### 步骤5：等待部署

- 部署过程约1-3分钟
- 可以看到实时日志
- 部署成功后会显示：✅ Deployment Ready

### 步骤6：获取访问链接

部署成功后，您会看到：

```
🎉 Your project is live at:
https://your-project-name.vercel.app
```

点击链接即可访问您的应用！

---

## 方法2：直接拖拽部署（最简单）

### 步骤1：确保已构建

```bash
npm run build
```

确认 `dist` 文件夹已生成。

### 步骤2：访问Vercel

1. 打开：https://vercel.com
2. 注册/登录账号

### 步骤3：拖拽部署

1. 在Vercel首页，找到 "Deploy" 区域
2. 直接将 `dist` 文件夹拖拽到页面上
3. 等待上传和部署（约30秒-1分钟）

### 步骤4：获取链接

部署完成后，自动生成访问链接：
```
https://your-project-xxxxx.vercel.app
```

---

## 方法3：使用Vercel CLI（开发者推荐）

### 步骤1：安装Vercel CLI

```bash
npm install -g vercel
```

### 步骤2：登录

```bash
vercel login
```

选择登录方式（GitHub/GitLab/Email）

### 步骤3：部署

在项目根目录执行：

```bash
vercel
```

按照提示操作：
- Set up and deploy? **Y**
- Which scope? 选择您的账号
- Link to existing project? **N**
- What's your project's name? 输入项目名称
- In which directory is your code located? **./
**
- Want to override the settings? **N**

### 步骤4：生产部署

```bash
vercel --prod
```

---

## 部署后配置

### 1. 自定义域名

1. 在Vercel项目页面，点击 "Settings"
2. 选择 "Domains"
3. 添加您的域名
4. 按照提示配置DNS记录

### 2. 环境变量

如果需要配置环境变量：

1. 进入项目 "Settings"
2. 选择 "Environment Variables"
3. 添加变量：
   - `VITE_API_URL`
   - `VITE_APP_TITLE`
   等

### 3. 自动部署

如果使用Git仓库部署：
- 每次推送到main分支，自动触发部署
- Pull Request会生成预览链接

---

## 常见问题

### Q1: 部署后页面空白

**原因**：路由配置问题

**解决**：确保 `vercel.json` 文件存在且配置正确（已创建）

### Q2: 图片加载失败

**原因**：图片路径不正确

**解决**：
- 图片放在 `public` 文件夹
- 使用绝对路径：`/image.jpg`

### Q3: 构建失败

**原因**：依赖安装失败或代码错误

**解决**：
1. 检查 `package.json` 是否正确
2. 本地运行 `npm run build` 测试
3. 查看Vercel部署日志

### Q4: 部署成功但功能不正常

**原因**：环境变量未配置

**解决**：在Vercel项目设置中添加环境变量

---

## 部署检查清单

部署前请确认：

- [ ] 本地构建成功（`npm run build`）
- [ ] dist文件夹已生成
- [ ] 所有图片资源在public文件夹
- [ ] 环境变量已配置（如需要）
- [ ] vercel.json文件已创建
- [ ] package.json配置正确

---

## 部署后测试

1. **功能测试**
   - 测试所有页面是否正常
   - 测试导航是否工作
   - 测试数据加载

2. **响应式测试**
   - 在手机上访问
   - 测试不同屏幕尺寸
   - 测试横屏/竖屏

3. **性能测试**
   - 使用Chrome Lighthouse
   - 检查加载速度
   - 检查性能评分

---

## 更新部署

### Git仓库方式

```bash
# 修改代码后
git add .
git commit -m "Update: 描述修改内容"
git push

# Vercel会自动重新部署
```

### 拖拽方式

```bash
# 重新构建
npm run build

# 再次拖拽dist文件夹到Vercel
```

### CLI方式

```bash
# 重新部署
vercel --prod
```

---

## 监控和分析

### 1. 访问统计

Vercel提供基础的访问统计：
- 访问量
- 带宽使用
- 部署历史

### 2. 性能监控

在项目页面查看：
- 响应时间
- 错误率
- 地理分布

### 3. 日志查看

在 "Deployments" 页面：
- 查看构建日志
- 查看运行时日志
- 调试错误

---

## 成本说明

### 免费套餐包含：

- ✅ 无限部署
- ✅ 100GB带宽/月
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ 自动部署
- ✅ 预览部署

### 升级Pro（$20/月）：

- 更多带宽
- 更多团队成员
- 优先支持
- 高级分析

对于个人项目和演示，免费套餐完全够用！

---

## 技术支持

- Vercel文档：https://vercel.com/docs
- Vercel社区：https://github.com/vercel/vercel/discussions
- Vite部署指南：https://vitejs.dev/guide/static-deploy.html

---

## 部署记录

**请在部署完成后填写：**

```
项目名称：____________________
部署时间：____________________
访问链接：https://____________________
部署方式：□ Git仓库  □ 拖拽  □ CLI
备注：____________________
```

---

## 下一步

部署成功后，您可以：

1. 分享链接给团队成员
2. 配置自定义域名
3. 设置自动部署
4. 添加访问统计
5. 优化性能和SEO

祝您部署顺利！🎉
