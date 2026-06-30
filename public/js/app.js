function showAlert(message) {
    if (!message) return;
    console.warn('[QR Code Studio]', message);
    
    // Inject toast animation keyframes once
    if (!document.getElementById('toast-keyframes')) {
        const style = document.createElement('style');
        style.id = 'toast-keyframes';
        style.textContent = '@keyframes toastSlideIn{from{opacity:0;transform:translateX(-50%) translateY(-16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
        document.head.appendChild(style);
    }
    
    let toast = document.getElementById('custom-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        document.body.appendChild(toast);
    }
    
    // Atomic cssText for reliable cross-browser rendering
    toast.style.cssText = [
        'position:fixed',
        'top:20px',
        'left:50%',
        'transform:translateX(-50%)',
        'background:#ef4444',
        'color:white',
        'padding:14px 36px',
        'border-radius:10px',
        'z-index:99999',
        'font-size:15px',
        'font-weight:600',
        'text-align:center',
        'opacity:1',
        'display:block',
        'box-shadow:0 4px 24px rgba(239,68,68,0.45)',
        'animation:toastSlideIn 0.35s ease',
        'pointer-events:none'
    ].join(';');
    toast.textContent = message;
    
    if (toast._timeout) clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 4000);
}
window.alert = showAlert;

const i18n = {
    "title": {"zh": "二维码工作室", "en": "QR Code Studio"},
    "tab_single": {"zh": "单张生成", "en": "Single Generation"},
    "tab_batch": {"zh": "批量生成", "en": "Batch Generation"},
    "label_content": {"zh": "二维码内容", "en": "Content"},
    "placeholder_single": {"zh": "请输入网址、文本或数据...", "en": "Enter URL, text, or data..."},
    "label_batch": {"zh": "批量内容（每行一条，最多100条）", "en": "Batch Content (max 100 lines)"},
    "btn_upload_txt": {"zh": "上传 TXT 文件", "en": "Upload TXT File"},
    "placeholder_batch": {"zh": "https://example.com\nhttps://google.com\n你好，世界", "en": "https://example.com\nhttps://google.com\nHello World"},
    "label_size": {"zh": "尺寸 (px)", "en": "Size (px)"},
    "label_color_dark": {"zh": "二维码颜色", "en": "QR Color"},
    "label_color_light": {"zh": "背景颜色", "en": "Background"},
    "label_logo": {"zh": "自定义 Logo（可选）", "en": "Custom Logo (Optional)"},
    "btn_generate": {"zh": "生成二维码", "en": "Generate QR Code"},
    "header_preview": {"zh": "预览", "en": "Preview"},
    "text_loading": {"zh": "生成中...", "en": "Generating..."},
    "alt_qr": {"zh": "已生成的二维码", "en": "Generated QR Code"},
    "text_empty": {"zh": "您的二维码将显示在这里", "en": "Your QR Code will appear here"},
    "btn_copy": {"zh": "复制图片", "en": "Copy Image"},
    "btn_download": {"zh": "下载", "en": "Download"},
    "btn_download_batch": {"zh": "全部下载 (ZIP压缩包)", "en": "Download All (ZIP)"},
    "link_guide": {"zh": "📖 使用说明", "en": "📖 Guide"},
    "alert_content_empty": {"zh": "请输入内容", "en": "Please enter some content"},
    "alert_batch_empty": {"zh": "请输入批量生成内容", "en": "Please enter batch content"},
    "alert_batch_invalid": {"zh": "请输入有效的批量生成内容", "en": "Please enter valid batch content"},
    "alert_batch_limit": {"zh": "批量生成最多支持100条内容", "en": "Batch generation supports a maximum of 100 items"},
    "alert_gen_error": {"zh": "生成二维码失败", "en": "Error generating QR code"},
    "text_batch_success": {"zh": "{n} 个二维码已成功生成。", "en": "{n} QR Codes generated successfully."},
    "alert_batch_error": {"zh": "批量生成二维码失败", "en": "Error generating batch QR codes"},
    "text_copied": {"zh": "已复制！", "en": "Copied!"},
    "alert_copy_failed": {"zh": "复制到剪贴板失败。请确保您使用的是 HTTPS 或 localhost。", "en": "Failed to copy to clipboard. Ensure you are using HTTPS or localhost."},
    "btn_remove_file": {"zh": "移除文件", "en": "Remove File"},
    "alert_length_limit": {"zh": "单条内容长度不能超过100个字符", "en": "Content length cannot exceed 100 characters per item"},
    "alert_size_limit": {"zh": "当前模式下尺寸不能超过 {max}px", "en": "Size cannot exceed {max}px in current mode"},
    "alert_size_invalid": {"zh": "请输入有效的数字（100-{max}）", "en": "Please enter a valid number (100-{max})"},
    "label_qr_type": {"zh": "二维码类型", "en": "QR Code Type"},
    "type_text": {"zh": "文本/链接", "en": "Text/URL"},
    "type_wifi": {"zh": "WiFi 网络", "en": "WiFi Network"},
    "type_vcard": {"zh": "电子名片", "en": "vCard Contact"},
    "label_wifi_ssid": {"zh": "WiFi 名称 (SSID)", "en": "WiFi Name (SSID)"},
    "label_wifi_password": {"zh": "密码", "en": "Password"},
    "label_wifi_security": {"zh": "加密类型", "en": "Security Type"},
    "label_wifi_hidden": {"zh": "隐藏网络", "en": "Hidden SSID"},
    "wifi_security_none": {"zh": "无加密 (Open)", "en": "No Encryption (Open)"},
    "label_vcard_fn": {"zh": "姓名", "en": "Full Name"},
    "label_vcard_org": {"zh": "公司 / 组织", "en": "Company / Org"},
    "label_vcard_title": {"zh": "职位 / 头衔", "en": "Job Title"},
    "label_vcard_tel": {"zh": "电话号码", "en": "Phone Number"},
    "label_vcard_email": {"zh": "电子邮箱", "en": "Email Address"},
    "label_vcard_url": {"zh": "网址", "en": "Website"},
    "btn_download_png": {"zh": "下载 PNG", "en": "Download PNG"},
    "btn_download_svg": {"zh": "下载 SVG", "en": "Download SVG"},
    "alert_wifi_ssid_empty": {"zh": "请输入 WiFi SSID 名称", "en": "Please enter the WiFi SSID name"},
    "alert_vcard_name_empty": {"zh": "请输入名片姓名", "en": "Please enter the vCard name"},
    "alert_length_limit_500": {"zh": "单条内容长度不能超过500个字符", "en": "Content length cannot exceed 500 characters"},
    "placeholder_wifi_ssid": {"zh": "请输入 WiFi 名称", "en": "Enter WiFi name (SSID)"},
    "placeholder_wifi_password": {"zh": "请输入 WiFi 密码", "en": "Enter WiFi password"},
    "placeholder_vcard_fn": {"zh": "例如：张三", "en": "e.g. John Doe"},
    "placeholder_vcard_org": {"zh": "公司或学校名称", "en": "Company or school name"},
    "placeholder_vcard_title": {"zh": "例如：产品经理", "en": "e.g. Product Manager"},
    "placeholder_vcard_tel": {"zh": "请输入手机或电话号码", "en": "Enter cell or work phone number"},
    "placeholder_vcard_email": {"zh": "example@email.com", "en": "example@email.com"},
    "placeholder_vcard_url": {"zh": "https://example.com", "en": "https://example.com"}
};

let currentLang = 'zh';

function t(key, params = {}) {
    let str = i18n[key][currentLang];
    for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, v);
    }
    return str;
}

function updateDOMTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[key]) {
            el.textContent = i18n[key][currentLang];
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[key]) {
            el.placeholder = i18n[key][currentLang];
        }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        const key = el.getAttribute('data-i18n-alt');
        if (i18n[key]) {
            el.alt = i18n[key][currentLang];
        }
    });
    
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
}

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // QR Type Selector Elements
    const typeBtns = document.querySelectorAll('.type-btn');
    const typeForms = document.querySelectorAll('.type-forms'); // Wait, we can just toggle style.display on forms directly by ID
    
    const singleText = document.getElementById('qr-text');
    const singleCharCount = document.getElementById('single-char-count');
    const singleClearBtn = document.getElementById('single-clear-btn');
    
    const batchText = document.getElementById('qr-batch-text');
    const batchFileInput = document.getElementById('qr-batch-file');
    const batchInputArea = document.getElementById('batch-input-area');
    const batchFileInfo = document.getElementById('batch-file-info');
    const batchFilename = document.getElementById('batch-filename');
    const batchClearBtn = document.getElementById('batch-clear-btn');
    const batchFilelines = document.getElementById('batch-filelines');
    const batchFileRemove = document.getElementById('batch-file-remove');
    const batchUploadWrapper = document.getElementById('batch-upload-wrapper');
    const batchFileLabel = document.getElementById('qr-batch-file-label');
    const batchLineCount = document.getElementById('batch-line-count');

    
    const sizeInput = document.getElementById('qr-size');
    const colorDark = document.getElementById('qr-color-dark');
    const colorLight = document.getElementById('qr-color-light');
    const colorDarkHex = document.getElementById('color-dark-hex');
    const colorLightHex = document.getElementById('color-light-hex');
    const logoInput = document.getElementById('qr-logo');
    
    const generateBtn = document.getElementById('generate-btn');
    
    const qrPreview = document.getElementById('qr-preview');
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading');
    
    const resultActions = document.getElementById('result-actions');
    const batchActions = document.getElementById('batch-actions');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    const downloadBatchBtn = document.getElementById('download-batch-btn');

    let currentMode = 'single'; // 'single' or 'batch'
    let currentSingleType = 'text'; // 'text', 'wifi', or 'vcard'
    let lastGeneratedBlob = null;
    let lastGeneratedBatchBlob = null;

    // Language Toggle
    const langZhBtn = document.getElementById('lang-zh');
    const langEnBtn = document.getElementById('lang-en');

    langZhBtn.addEventListener('click', () => {
        currentLang = 'zh';
        langZhBtn.classList.add('active');
        langEnBtn.classList.remove('active');
        updateDOMTranslations();
        
        // Update empty state if no blob is generated
        if (!lastGeneratedBlob && !lastGeneratedBatchBlob && emptyState.textContent !== '') {
            emptyState.textContent = t('text_empty');
        } else if (lastGeneratedBatchBlob && emptyState.textContent !== t('text_empty')) {
            const lines = batchText.value.trim().split('\n').filter(t => t.trim()).length;
            emptyState.textContent = t('text_batch_success', {n: lines});
        }
    });

    langEnBtn.addEventListener('click', () => {
        currentLang = 'en';
        langEnBtn.classList.add('active');
        langZhBtn.classList.remove('active');
        updateDOMTranslations();
        
        // Update empty state if no blob is generated
        if (!lastGeneratedBlob && !lastGeneratedBatchBlob && emptyState.textContent !== '') {
            emptyState.textContent = t('text_empty');
        } else if (lastGeneratedBatchBlob && emptyState.textContent !== t('text_empty')) {
            const lines = batchText.value.trim().split('\n').filter(t => t.trim()).length;
            emptyState.textContent = t('text_batch_success', {n: lines});
        }
    });

    // Initial Translation
    updateDOMTranslations();

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
            currentMode = target;
            
            // Adjust size limits based on mode
            if (currentMode === 'batch') {
                sizeInput.max = 500;
                if (parseInt(sizeInput.value) > 500) sizeInput.value = 500;
            } else {
                sizeInput.max = 1000;
            }
            
            resetPreviewUI();
        });
    });

    // QR Type Selector Switch
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentSingleType = btn.getAttribute('data-type');
            
            // Hide all single type forms and show active one
            document.querySelectorAll('.type-form').forEach(f => f.style.display = 'none');
            document.getElementById(`type-form-${currentSingleType}`).style.display = 'block';
            
            // Show/hide char count & clear btn
            if (currentSingleType === 'text') {
                singleCharCount.style.display = 'block';
                singleClearBtn.style.display = singleText.value.length > 0 ? 'block' : 'none';
            } else {
                singleCharCount.style.display = 'none';
                singleClearBtn.style.display = 'none';
            }
            resetPreviewUI();
        });
    });

    // Size Input Validation
    const validateSize = () => {
        const max = parseInt(sizeInput.max) || 1000;
        const raw = sizeInput.value.trim();
        let val = parseInt(raw);
        // Use explicit numeric check (more reliable than validity API)
        if (raw !== '' && !isNaN(val) && val > max) {
            alert(t('alert_size_limit', { max: max }));
            sizeInput.value = max;
        }
    };
    sizeInput.addEventListener('input', validateSize);
    sizeInput.addEventListener('keyup', validateSize);
    sizeInput.addEventListener('change', validateSize);
    sizeInput.addEventListener('blur', () => {
        const max = parseInt(sizeInput.max) || 1000;
        let val = parseInt(sizeInput.value);
        if (isNaN(val)) {
            alert(t('alert_size_invalid', { max: max }));
            sizeInput.value = 300;
        } else if (val < 100) {
            sizeInput.value = 100;
        } else if (val > max) {
            sizeInput.value = max;
        }
    });

    // File Upload Handlers logic
    colorDark.addEventListener('input', (e) => colorDarkHex.textContent = e.target.value);
    colorLight.addEventListener('input', (e) => colorLightHex.textContent = e.target.value);

    // TXT File Upload
    batchFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            const content = evt.target.result;
            const texts = content.split('\n').map(t => t.trim()).filter(t => t);
            if (texts.length > 100) {
                alert(t('alert_batch_limit'));
                batchFileInput.value = '';
                return;
            }
            batchText.value = content;
            // Trigger input event to update line count
            batchText.dispatchEvent(new Event('input'));
            
            // UI switch
            batchInputArea.style.display = 'none';
            batchUploadWrapper.style.display = 'none';
            batchFileInfo.style.display = 'block';
            batchFilename.textContent = file.name;
            batchFilelines.textContent = texts.length;
        };
        reader.readAsText(file);
    });

    batchFileRemove.addEventListener('click', () => {
        batchText.value = '';
        batchFileInput.value = '';
        batchInputArea.style.display = 'block';
        batchUploadWrapper.style.display = 'block';
        batchFileInfo.style.display = 'none';
        batchText.dispatchEvent(new Event('input'));
    });

    // Single Text Input & Clear Button
    if (singleText) singleText.removeAttribute('maxlength'); // Bypass cached HTML restrictions
    singleText.addEventListener('input', () => {
        const count = singleText.value.length;
        singleCharCount.textContent = `${count} / 500`;
        if (count > 500) {
            singleCharCount.style.color = 'red';
            singleText.value = singleText.value.substring(0, 500);
            singleCharCount.textContent = `500 / 500`;
            alert(t('alert_length_limit_500'));
        } else {
            singleCharCount.style.color = 'var(--text-secondary)';
        }
        if(singleClearBtn) singleClearBtn.style.display = count > 0 ? 'block' : 'none';
    });

    if(singleClearBtn) singleClearBtn.addEventListener('click', () => {
        singleText.value = '';
        singleText.dispatchEvent(new Event('input'));
    });

    if(batchClearBtn) batchClearBtn.addEventListener('click', () => {
        batchText.value = '';
        // Also reset TXT file upload state
        batchFileInput.value = '';
        batchInputArea.style.display = 'block';
        batchUploadWrapper.style.display = 'block';
        batchUploadWrapper.style.opacity = '1';
        batchFileLabel.style.cursor = 'pointer';
        batchFileInput.disabled = false;
        batchFileInfo.style.display = 'none';
        batchText.dispatchEvent(new Event('input'));
    });

    batchText.addEventListener('input', () => {
        const lines = batchText.value.split('\n');
        // Enforce max length of 100 per line
        let modified = false;
        const enforcedLines = lines.map(line => {
            if (line.length > 100) {
                modified = true;
                return line.substring(0, 100);
            }
            return line;
        });
        if (modified) {
            batchText.value = enforcedLines.join('\n');
            alert(t('alert_length_limit'));
        }

        const texts = enforcedLines.map(t => t.trim()).filter(t => t);
        const count = texts.length;
        batchLineCount.textContent = `${count} / 100`;
        if (count > 100) {
            batchLineCount.style.color = 'red';
            // Only alert if we just crossed the threshold to avoid spamming
            if (batchText.dataset.overlimit !== 'true') {
                alert(t('alert_batch_limit'));
                batchText.dataset.overlimit = 'true';
            }
        } else {
            batchLineCount.style.color = 'var(--text-secondary)';
            batchText.dataset.overlimit = 'false';
        }

        if(batchClearBtn) batchClearBtn.style.display = batchText.value.length > 0 ? 'block' : 'none';

        // Mutual exclusivity: disable file upload if textarea has content AND we are not in "uploaded file" mode
        if (batchFileInfo.style.display !== 'block') {
            if (count > 0) {
                batchUploadWrapper.style.opacity = '0.5';
                batchFileLabel.style.cursor = 'not-allowed';
                batchFileInput.disabled = true;
            } else {
                batchUploadWrapper.style.opacity = '1';
                batchFileLabel.style.cursor = 'pointer';
                batchFileInput.disabled = false;
            }
        }
    });

    function getSingleTextContent() {
        if (currentSingleType === 'text') {
            const val = singleText.value.trim();
            if (!val) {
                alert(t('alert_content_empty'));
                return null;
            }
            return val;
        } else if (currentSingleType === 'wifi') {
            const ssid = document.getElementById('wifi-ssid').value.trim();
            const password = document.getElementById('wifi-password').value.trim();
            const security = document.getElementById('wifi-security').value;
            const hidden = document.getElementById('wifi-hidden').checked;
            
            if (!ssid) {
                alert(t('alert_wifi_ssid_empty'));
                return null;
            }
            
            const escapeWifi = (val) => {
                if (!val) return '';
                return val.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/,/g, '\\,');
            };
            
            return `WIFI:S:${escapeWifi(ssid)};T:${security};P:${escapeWifi(password)};H:${hidden ? 'true' : ''};;`;
        } else if (currentSingleType === 'vcard') {
            const fn = document.getElementById('vcard-fn').value.trim();
            const org = document.getElementById('vcard-org').value.trim();
            const title = document.getElementById('vcard-title').value.trim();
            const tel = document.getElementById('vcard-tel').value.trim();
            const email = document.getElementById('vcard-email').value.trim();
            const url = document.getElementById('vcard-url').value.trim();
            
            if (!fn) {
                alert(t('alert_vcard_name_empty'));
                return null;
            }
            
            let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
            vcard += `FN:${fn}\nN:;${fn};;;\n`;
            if (org) vcard += `ORG:${org}\n`;
            if (title) vcard += `TITLE:${title}\n`;
            if (tel) vcard += `TEL;TYPE=CELL:${tel}\n`;
            if (email) vcard += `EMAIL;TYPE=PREF,INTERNET:${email}\n`;
            if (url) vcard += `URL:${url}\n`;
            vcard += 'END:VCARD';
            return vcard;
        }
        return null;
    }

    // Generate Button Click
    generateBtn.addEventListener('click', async () => {
        if (currentMode === 'single') {
            const text = getSingleTextContent();
            if (text === null) return;
            if (text.length > 500) return alert(t('alert_length_limit_500'));
            await generateSingle(text);
        } else {
            const text = batchText.value;
            const texts = text.split('\n').map(t => t.trim()).filter(t => t);
            if (texts.length === 0) return alert(t('alert_batch_invalid'));
            if (texts.length > 100) return alert(t('alert_batch_limit'));
            if (texts.some(t => t.length > 100)) return alert(t('alert_length_limit'));
            await generateBatch(texts);
        }
    });

    function resetPreviewUI() {
        qrPreview.classList.add('hidden');
        qrPreview.src = '';
        emptyState.classList.remove('hidden');
        emptyState.textContent = t('text_empty');
        resultActions.classList.add('hidden');
        batchActions.classList.add('hidden');
        lastGeneratedBlob = null;
        lastGeneratedBatchBlob = null;
    }

    function showLoading(show) {
        if (show) {
            emptyState.classList.add('hidden');
            qrPreview.classList.add('hidden');
            loadingState.classList.remove('hidden');
            resultActions.classList.add('hidden');
            batchActions.classList.add('hidden');
        } else {
            loadingState.classList.add('hidden');
        }
    }

    // Single Generation
    async function generateSingle(text) {
        showLoading(true);
        
        const formData = new FormData();
        formData.append('text', text);
        formData.append('size', sizeInput.value);
        formData.append('colorDark', colorDark.value);
        formData.append('colorLight', colorLight.value);
        if (logoInput.files[0]) {
            formData.append('logo', logoInput.files[0]);
        }

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to generate QR code');

            const blob = await response.blob();
            lastGeneratedBlob = blob;
            const objectURL = URL.createObjectURL(blob);

            showLoading(false);
            qrPreview.src = objectURL;
            qrPreview.classList.remove('hidden');
            resultActions.classList.remove('hidden');
        } catch (error) {
            console.error(error);
            showLoading(false);
            emptyState.classList.remove('hidden');
            emptyState.textContent = t('text_empty');
            alert(t('alert_gen_error'));
        }
    }

    // Batch Generation
    async function generateBatch(texts) {
        showLoading(true);
        
        const formData = new FormData();
        formData.append('texts', JSON.stringify(texts));
        formData.append('size', sizeInput.value);
        formData.append('colorDark', colorDark.value);
        formData.append('colorLight', colorLight.value);
        if (logoInput.files[0]) {
            formData.append('logo', logoInput.files[0]);
        }

        try {
            const response = await fetch('/api/generate-batch', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to generate batch QR codes');

            const blob = await response.blob();
            lastGeneratedBatchBlob = blob;
            
            showLoading(false);
            emptyState.textContent = t('text_batch_success', {n: texts.length});
            emptyState.classList.remove('hidden');
            batchActions.classList.remove('hidden');
        } catch (error) {
            console.error(error);
            showLoading(false);
            emptyState.classList.remove('hidden');
            emptyState.textContent = t('text_empty');
            alert(t('alert_batch_error'));
        }
    }

    // Copy to clipboard
    copyBtn.addEventListener('click', async () => {
        if (!lastGeneratedBlob) return;
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [lastGeneratedBlob.type]: lastGeneratedBlob
                })
            ]);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = t('text_copied');
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        } catch (err) {
            console.error('Failed to copy', err);
            alert(t('alert_copy_failed'));
        }
    });

    // Download Single (PNG)
    downloadBtn.addEventListener('click', () => {
        if (!lastGeneratedBlob) return;
        const objectURL = URL.createObjectURL(lastGeneratedBlob);
        const a = document.createElement('a');
        a.href = objectURL;
        a.download = 'qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectURL);
    });

    // Download Single (SVG)
    downloadSvgBtn.addEventListener('click', async () => {
        const text = getSingleTextContent();
        if (text === null) return;
        
        const originalText = downloadSvgBtn.textContent;
        downloadSvgBtn.disabled = true;
        downloadSvgBtn.textContent = t('text_loading');

        const formData = new FormData();
        formData.append('text', text);
        formData.append('size', sizeInput.value);
        formData.append('colorDark', colorDark.value);
        formData.append('colorLight', colorLight.value);
        formData.append('format', 'svg');
        if (logoInput.files[0]) {
            formData.append('logo', logoInput.files[0]);
        }

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to generate SVG');

            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectURL;
            a.download = 'qrcode.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(objectURL);
        } catch (error) {
            console.error(error);
            alert(t('alert_gen_error'));
        } finally {
            downloadSvgBtn.disabled = false;
            downloadSvgBtn.textContent = originalText;
        }
    });

    // Download Batch
    downloadBatchBtn.addEventListener('click', () => {
        if (!lastGeneratedBatchBlob) return;
        const objectURL = URL.createObjectURL(lastGeneratedBatchBlob);
        const a = document.createElement('a');
        a.href = objectURL;
        a.download = 'qrcodes.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectURL);
    });
});
