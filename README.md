# EC BBF V2

一个基于 Tauri + React + TypeScript 开发的桌面应用。

## 功能特性

- 学生管理功能
  - 支持随机点名
  - 支持多选操作
  - 支持批量导入
- 成绩管理功能
  - 支持添加多个成绩主题
  - 支持添加多个成绩事件
- 正计时/倒计时功能
  - 支持添加多个计时任务
  - 可自定义任务名称和时长
  - 支持毫秒显示切换
  - 支持暂停/继续/重置操作
  - 任务数据本地持久化存储

## 安装
可从 [Release](https://github.com/ec50n9/ec-bbf-v2/releases) 页面下载最新版本的安装包:

可从 [Release](https://github.com/your-repo/ec-bbf-v2/releases) 页面下载最新版本的安装包。

### Windows
- `.msi` - Windows 安装程序
- `.exe` - 便携版程序

### macOS
- `_x64.dmg` - 适用于 Intel 芯片的 Mac
- `_aarch64.dmg` - 适用于 M1/M2 等 ARM 芯片的 Mac

### Linux
- `_amd64.deb` - 适用于 Ubuntu/Debian 系统
- `_amd64.AppImage` - 通用的 Linux 可执行文件

下载对应系统的安装包后按提示安装即可。

### 注意事项

#### Windows 用户
- 首次运行可能会提示"Windows 已保护你的电脑"
- 点击"更多信息"后选择"仍要运行"即可

#### macOS 用户
- 首次打开需要在"系统偏好设置 > 安全性与隐私"中允许运行
- 如果提示"xxx已损坏,无法打开"，请在终端执行:
  ```bash
  sudo xattr -rd com.apple.quarantine /Applications/ec-bbf-v2.app
  ```

#### Linux 用户
使用 AppImage:
1. 赋予执行权限:
   ```bash
   chmod +x *.AppImage
   ```
2. 直接运行:
   ```bash
   ./应用名称.AppImage
   ```

使用 deb 包:
1. 安装:
   ```bash
   sudo dpkg -i 应用名称.deb
   # 或
   sudo apt install ./应用名称.deb
   ```
2. 如果提示依赖问题,执行:
   ```bash
   sudo apt-get install -f
   ```
3. 可以从应用程序菜单启动,或在终端输入应用名称运行

## 技术栈

- 前端
  - React 
  - TypeScript
  - Vite
  - TailwindCSS
  - Framer Motion (动画效果)
  - Radash (工具函数库)

- 后端
  - Tauri
  - Rust
  - SQLite

## 开发环境配置

1. 安装必要的开发工具：
   - [VS Code](https://code.visualstudio.com/)
   - [Rust](https://www.rust-lang.org/)
   - [Node.js](https://nodejs.org/) (推荐 v20+)
   - [pnpm](https://pnpm.io/)

2. 克隆项目并安装依赖：

```bash
git clone https://github.com/ec50n9/ec-bbf-v2.git
cd ec-bbf-v2
pnpm install
```

3. 启动开发服务器：

```bash
pnpm tauri dev
```

## 构建

执行以下命令进行生产环境构建：

```bash
pnpm tauri build
```

构建完成后的安装包将位于 `src-tauri/target/release/bundle` 目录下。

## 自动化发布

项目配置了 GitHub Actions 自动化发布流程，当代码推送到 `release` 分支时会自动触发构建并创建新的 Release。支持以下平台：

- Windows (x64)
- macOS (Intel & Apple Silicon)
- Linux (x64)

## 许可证

[MIT License](LICENSE)

## 贡献指南

欢迎提交 Issue 和 Pull Request。在提交 PR 之前，请确保：

1. 代码经过格式化
2. 所有测试通过
3. 遵循现有的代码风格
4. 提供必要的文档说明

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件至 [shelloworld@qq.com](mailto:shelloworld@qq.com)