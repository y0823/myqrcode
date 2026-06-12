# QR Code Studio / 二维码工作室

[English Version](#english-version) | [中文版](#chinese-version)

---

<a id="english-version"></a>
# English Version

**QR Code Studio** is a fully-featured, highly customizable, and modern QR code generation web application. It provides a beautiful native UI and a robust REST API for external system integrations.

## Key Features

- **Single & Batch Generation**: Support generating single QR codes or pasting multiple lines of text/URLs for batch processing.
- **Customization Options**:
  - Adjust QR code resolution size (px).
  - Native color pickers for foreground and background colors.
  - Upload any local image to embed as a custom high-definition Logo in the center.
- **Efficient Batch Export**: Automatically packages all generated images into a `.zip` file for 1-click download.
- **Open API**: Backend powered by Express provides standard `/api/generate` and `/api/generate-batch` endpoints.

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

## Using Excel IMAGE Formula
You can directly render QR codes in modern Excel (Office 365 / Excel 2024) using the provided GET API endpoint:
```excel
=IMAGE("http://localhost:3000/api/generate?text=" & ENCODEURL(A1))
```

## API Documentation

### 1. Single Generation
- **Endpoint:** `POST /api/generate` or `GET /api/generate`
- **Params:** `text` (required), `size`, `colorDark`, `colorLight`, `logo` (POST form-data only)

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "https://example.com", "size": 300}' \
  --output qrcode.png
```

### 2. Batch Generation
- **Endpoint:** `POST /api/generate-batch`
- **Params:** `texts` (Array of strings, required), `size`, `colorDark`, `colorLight`, `logo`

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

- **单张与批量生成**：支持单条内容生成，也支持输入多行文本（或网址）一次性批量生成二维码。
- **自定义二维码外观**：
  - 支持调整二维码分辨率尺寸 (px)。
  - 提供前景色与背景色的独立选色器（原生轮盘选色）。
  - 支持上传任意本地图片作为二维码中心的高清 Logo 嵌入。
- **高效的批量导出**：批量生成完毕后，会自动将所有生成的图片打包为一个 `.zip` 压缩文件，实现一键统一下载。
- **中英双语**：界面自带语言切换开关，一键切换。
- **开放 API 调用**：前后端分离，后端基于 Express 提供了完善的 `/api/generate` 接口，支持跨语言调用。

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

## 在 Excel 中使用 IMAGE 公式
借助后台提供的 GET 接口，您可以直接在较新版本的 Excel 中读取单元格生成二维码：
```excel
=IMAGE("http://localhost:3000/api/generate?text=" & ENCODEURL(A1))
```

## 实用小技巧：生成自动连接的 WiFi 二维码

您可以直接将特定格式的代码输入到内容框内，生成的二维码使用手机原生相机扫描后即可自动连接 WiFi：
```text
WIFI:S:您的WiFi名称;T:WPA;P:您的密码;;
```
> *结尾请注意务必带上 `;;` 两个分号。*

## API 接口文档 (面向开发者)

### 1. 单张生成接口

- **Endpoint:** `POST /api/generate` 或 `GET /api/generate`
- **支持的内容类型:** `application/json` 或 `multipart/form-data`（如果需要上传 Logo 必须使用表单数据）。
- **参数说明:**
  - `text` (String，必填): 需要编码的内容。
  - `size` (Number，选填): 图像宽高像素，默认 300。
  - `colorDark` (String，选填): 二维码颜色，支持 Hex 格式，默认 `#000000`。
  - `colorLight` (String，选填): 背景颜色，支持 Hex 格式，默认 `#ffffff`。
  - `logo` (File，选填): 作为 Logo 的图片文件（仅限 POST 表单数据）。

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
- **参数说明:**
  - `texts` (Array / String JSON / 多行字符串，必填): 包含多个需要编码文本的数组。
  - 其他选填参数（`size`, `colorDark`, `colorLight`, `logo`）将全局应用于本次批量生成的所有二维码。

**调用示例 (JSON):**
```bash
curl -X POST http://localhost:3000/api/generate-batch \
  -H "Content-Type: application/json" \
  -d '{"texts": ["https://google.com", "https://apple.com"]}' \
  --output my_batch.zip
```
