# QR Code Studio / 二维码工作室

[English Version](#english-version) | [中文版](#chinese-version)

---

<a id="english-version"></a>
# English Version

**QR Code Studio** is a fully-featured, highly customizable, and modern QR code generation web application. It provides a beautiful native UI and a robust REST API for external system integrations.

## Key Features

### Generation Modes
- **Single Generation**: Enter a URL, text, or data — instantly get a PNG QR code. Supports copying to clipboard or downloading as `.png`.
- **Batch Generation**: Input multiple lines (one per line) or upload a `.txt` file. All QR codes are packaged into a single `.zip` archive for one-click download.

### Customization Options
- **Size**: Adjustable from 100px to 1000px (single mode) or 500px (batch mode), default 300px.
- **Colors**: Native HTML5 color pickers for foreground (QR code) and background colors, with real-time hex value display.
- **Logo**: Upload any local image (≤500KB) to embed as a centered logo. Logo is automatically resized to 25% of QR code width with alpha transparency support.

### Smart Validation
- **Text Length Limit**: Single content limited to 100 characters. Exceeding triggers a visible toast notification and auto-truncation.
- **Size Validation**: Invalid (non-numeric) or out-of-range values trigger instant alerts. Single mode capped at 1000px, batch mode at 500px.
- **Batch Limits**: Maximum 100 items per batch, 100 characters per item. All violations produce clear error messages.

### Usability
- **Clear Buttons**: One-click clear buttons on both single and batch text inputs, placed outside the textarea for easy access. Batch clear also resets any uploaded TXT file state.
- **Bilingual UI**: One-click toggle between Chinese and English. All UI text, alerts, and placeholders switch instantly.
- **Copy to Clipboard**: Copy generated QR code image directly to clipboard (requires HTTPS or localhost).

### API
- **REST API**: Backend powered by Express, exposing `/api/generate` (single) and `/api/generate-batch` (batch) endpoints.
- **Rate Limiting**: Batch endpoint limited to 5 requests per minute per IP.

## Requirements

- Node.js (v14+ recommended)
- npm package manager

## Setup & Running

1. **Enter Directory:**
   ```bash
   cd qrcode
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start Server:**
   ```bash
   node server.js
   ```
   *The server runs by default on http://localhost:3000*

4. **Open in Browser:**
   Open `http://localhost:3000` in any modern browser.

## Deployment (VPS + Cloudflare Recommended)

For unrestricted usage (especially batch generation with large ZIP files), we highly recommend deploying to a standard VPS rather than serverless environments (like Cloudflare Workers/Vercel) to avoid CPU timeouts and RAM limits.

1. **Install Node.js & Git (Ubuntu/Debian):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs git
   ```
2. **Clone & Install:**
   ```bash
   git clone https://github.com/y0823/myqrcode.git
   cd myqrcode
   npm install
   ```
3. **Run Continuously with PM2:**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "qrcode"
   pm2 startup
   pm2 save
   ```
4. **Expose with Cloudflare:**
   In Cloudflare DNS, add an `A Record` for your domain pointing to the VPS IP, and enable the proxy (Orange Cloud). Then, configure an **Origin Rule** in Cloudflare to rewrite incoming traffic for your hostname to destination port `3000`.

## Pro Tips

### WiFi Auto-Connect QR Codes
Enter this exact format in the content box to generate a QR code that automatically connects smartphones to your WiFi when scanned with the native camera app:
```text
WIFI:S:YourNetworkName;T:WPA;P:YourPassword;;
```
> *Note: It must end with two semicolons `;;`*

### Using Excel IMAGE Formula
You can directly render QR codes in modern Excel (Office 365 / Excel 2024) using the provided GET API endpoint:
```excel
=IMAGE("http://localhost:3000/api/generate?text=" & ENCODEURL(A1))
```
For custom colors, escape `#` as `%23`:
```excel
=IMAGE("http://localhost:3000/api/generate?size=200&colorDark=%230000FF&text=" & ENCODEURL(A1))
```

## API Documentation

### 1. Single Generation

- **Endpoint:** `POST /api/generate` or `GET /api/generate`
- **Content-Type:** `application/json` or `multipart/form-data` (required for logo uploads)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `text` | String | Yes | — | Content to encode (max 100 chars) |
| `size` | Number | No | 300 | Image dimensions in px (100–1000) |
| `margin` | Number | No | 4 | Quiet zone margin in modules |
| `colorDark` | String | No | `#000000` | QR code foreground color (hex) |
| `colorLight` | String | No | `#ffffff` | Background color (hex) |
| `logo` | File | No | — | Center logo image (POST form-data only, max 500KB) |

**Example (cURL — no logo, JSON):**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "https://example.com", "size": 300}' \
  --output qrcode.png
```

**Example (cURL — with logo, Form-Data):**
```bash
curl -X POST http://localhost:3000/api/generate \
  -F "text=https://example.com" \
  -F "logo=@/path/to/logo.png" \
  --output qrcode.png
```

### 2. Batch Generation

- **Endpoint:** `POST /api/generate-batch`
- **Content-Type:** `application/json` or `multipart/form-data`
- **Response:** `application/zip` binary stream
- **Rate Limit:** 5 requests per minute per IP

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `texts` | Array | Yes | — | Array of content strings (max 100 items, 100 chars each) |
| `size` | Number | No | 300 | Image dimensions in px (100–500) |
| `margin` | Number | No | 4 | Quiet zone margin |
| `colorDark` | String | No | `#000000` | QR code color (hex) |
| `colorLight` | String | No | `#ffffff` | Background color (hex) |
| `logo` | File | No | — | Logo applied to all items (POST form-data only, max 500KB) |

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/generate-batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["https://google.com", "https://apple.com"]}' \
  --output my_batch.zip
```

---

<a id="chinese-version"></a>
# 中文版

**二维码工作室** 是一个功能齐全、支持高自由度定制的现代化二维码生成 Web 应用。它提供了原生美观的用户界面，以及供外部系统集成的强大 REST API 接口。

## 主要功能特性

### 生成模式
- **单张生成**：输入网址、文本或数据，即时生成 PNG 格式二维码。支持复制图片到剪贴板或下载为 `.png` 文件。
- **批量生成**：输入多行内容（每行一条），或上传 `.txt` 文件。系统自动将所有二维码打包为一个 `.zip` 压缩包，一键下载。

### 自定义外观
- **尺寸调节**：支持 100px 至 1000px（单张模式）或 500px（批量模式），默认 300px。
- **颜色自定义**：原生 HTML5 取色器，独立设置二维码前景色和背景色，实时显示 Hex 色值。
- **中心 Logo**：支持上传任意本地图片（≤500KB）作为二维码中心的高清 Logo，自动缩放至二维码宽度的 25%，支持透明通道。

### 智能校验
- **文本长度限制**：单条内容限 100 个字符。超出时弹出醒目的红色 toast 提示并自动截断。
- **尺寸校验**：输入非数字或超出范围时即时弹窗提示。单张模式上限 1000px，批量模式上限 500px；非数字输入自动重置为默认值 300px。
- **批量数量限制**：每批最多 100 条，每条不超过 100 字符。违规时均有明确的错误提示。

### 便捷操作
- **一键清空**：单张和批量文本框均配有清空按钮（位于文本框外部标签行），一键重置内容。批量模式下同时重置 TXT 文件上传状态。
- **中英双语**：界面自带语言切换按钮，一键切换中文/英文。所有 UI 文字、提示、占位符即时切换。
- **剪贴板复制**：生成的二维码图片可直接复制到剪贴板（需 HTTPS 或 localhost 环境）。

### API 接口
- **REST API**：后端基于 Express，提供 `/api/generate`（单张）和 `/api/generate-batch`（批量）接口。
- **访问控制**：批量接口限制每 IP 每分钟 5 次请求。

## 环境要求

- Node.js (建议 v14+ 或以上版本)
- npm 包管理器

## 安装与运行步骤

1. **进入目录：**
   ```bash
   cd qrcode
   ```
2. **安装依赖：**
   ```bash
   npm install
   ```
3. **启动后台服务：**
   ```bash
   node server.js
   ```
   *服务将默认运行在 http://localhost:3000*

4. **打开网页：**
   使用任意现代浏览器访问 `http://localhost:3000` 即可开始使用。

## 部署到云服务器 (推荐 VPS + Cloudflare)

为了彻底解除由于"批量生成大量图片"和"大体积 ZIP 压缩包"导致的 Serverless（如 Cloudflare Workers/Vercel）超时和内存报错限制，强烈建议将其部署在一台普通的云服务器（VPS）上：

1. **安装 Node.js 与 Git:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs git
   ```
2. **下载代码并安装依赖:**
   ```bash
   git clone https://github.com/y0823/myqrcode.git
   cd myqrcode
   npm install
   ```
3. **使用 PM2 后台常驻运行:**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "qrcode"
   pm2 startup
   pm2 save
   ```
4. **配置外网访问:**
   在 Cloudflare DNS 中添加一条指向您 VPS IP 的 A 记录并开启"小黄云"。随后在 Cloudflare 的"规则 → 源站规则 (Origin Rules)"中，配置将访问您域名的请求目标端口"重写 (Rewrite to...)"为 `3000` 即可，从而实现零配置免证书的 HTTPS 外网访问。

## 实用小技巧

### 生成自动连接的 WiFi 二维码
您可以直接将特定格式的代码输入到内容框内，生成的二维码使用手机原生相机扫描后即可自动连接 WiFi：
```text
WIFI:S:您的WiFi名称;T:WPA;P:您的密码;;
```
> *结尾请注意务必带上 `;;` 两个分号。*

### 在 Excel 中使用 IMAGE 公式
借助后台提供的 GET 接口，您可以直接在较新版本的 Excel 中读取单元格生成二维码：
```excel
=IMAGE("http://localhost:3000/api/generate?text=" & ENCODEURL(A1))
```
若要自定义颜色（例如蓝色），记得将 `#` 转义为 `%23`：
```excel
=IMAGE("http://localhost:3000/api/generate?size=200&colorDark=%230000FF&text=" & ENCODEURL(A1))
```

## API 接口文档 (面向开发者)

### 1. 单张生成接口

- **Endpoint:** `POST /api/generate` 或 `GET /api/generate`
- **支持的内容类型:** `application/json` 或 `multipart/form-data`（如需上传 Logo 必须使用表单数据）

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|-----------|------|----------|---------|-------------|
| `text` | String | 是 | — | 编码内容（最长 100 字符） |
| `size` | Number | 否 | 300 | 图像宽高像素（100–1000） |
| `margin` | Number | 否 | 4 | 二维码边距（模块数） |
| `colorDark` | String | 否 | `#000000` | 二维码颜色（Hex 格式） |
| `colorLight` | String | 否 | `#ffffff` | 背景颜色（Hex 格式） |
| `logo` | File | 否 | — | Logo 图片文件（仅限 POST 表单数据，最大 500KB） |

**调用示例 (无Logo - JSON):**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "https://example.com", "size": 300}' \
  --output qrcode.png
```

**调用示例 (带Logo - Form-Data):**
```bash
curl -X POST http://localhost:3000/api/generate \
  -F "text=https://example.com" \
  -F "logo=@/本地路径/logo.png" \
  --output qrcode.png
```

### 2. 批量生成接口

- **Endpoint:** `POST /api/generate-batch`
- **支持的内容类型:** 同上。该接口会直接返回一个 `application/zip` 的二进制文件流。
- **访问限制:** 每 IP 每分钟最多 5 次请求

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|-----------|------|----------|---------|-------------|
| `texts` | Array | 是 | — | 内容字符串数组（最多 100 条，每条最多 100 字符） |
| `size` | Number | 否 | 300 | 图像宽高像素（100–500） |
| `margin` | Number | 否 | 4 | 二维码边距 |
| `colorDark` | String | 否 | `#000000` | 二维码颜色（Hex 格式） |
| `colorLight` | String | 否 | `#ffffff` | 背景颜色（Hex 格式） |
| `logo` | File | 否 | — | Logo 应用于全部二维码（仅限 POST 表单数据，最大 500KB） |

**调用示例 (JSON):**
```bash
curl -X POST http://localhost:3000/api/generate-batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["https://google.com", "https://apple.com"]}' \
  --output my_batch.zip
```
