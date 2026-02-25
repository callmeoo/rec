import React, { useEffect } from 'react';

const SimpleVehicleDetailPage = ({ vehicleId, onClose }) => {
  useEffect(() => {
    // 获取当前应用的基础URL
    const baseUrl = window.location.origin;
    
    // 在新窗口中打开车辆详情页
    const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    
    if (newWindow) {
      // 创建新窗口的HTML内容
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>车辆详情</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              background-color: #f8fafc;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              color: #1e293b;
              margin-bottom: 8px;
            }
            .header p {
              color: #64748b;
              font-size: 14px;
            }
            .content {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            .content img {
              max-width: 100%;
              height: auto;
              border-radius: 4px;
              display: block;
              margin: 0 auto;
            }
            .error-message {
              display: none;
              padding: 60px 40px;
              text-align: center;
              background-color: #f1f5f9;
              border-radius: 8px;
              border: 2px dashed #cbd5e1;
            }
            .error-message.show {
              display: block;
            }
            .error-message .icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            .error-message p {
              color: #475569;
              margin-bottom: 12px;
              font-size: 16px;
            }
            .error-message .hint {
              color: #94a3b8;
              font-size: 14px;
              line-height: 1.6;
            }
            .error-message .path {
              background-color: #e2e8f0;
              padding: 8px 12px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 13px;
              color: #334155;
              margin-top: 12px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>车辆详情</h1>
              <p>车辆ID: ${vehicleId || 'N/A'}</p>
            </div>
            <div class="content">
              <img 
                id="vehicleImage"
                src="${baseUrl}/vehicle-detail-template.jpg" 
                alt="车辆详情"
              />
              <div class="error-message" id="errorMessage">
                <div class="icon">📷</div>
                <p><strong>车辆详情图片未找到</strong></p>
                <p class="hint">请将车辆详情页图片保存到以下位置：</p>
                <div class="path">public/vehicle-detail-template.jpg</div>
                <p class="hint" style="margin-top: 16px;">
                  保存图片后，请刷新页面查看。<br>
                  图片格式支持：JPG、PNG、JPEG
                </p>
              </div>
            </div>
          </div>
          <script>
            const img = document.getElementById('vehicleImage');
            const errorMsg = document.getElementById('errorMessage');
            
            img.onerror = function() {
              this.style.display = 'none';
              errorMsg.classList.add('show');
            };
            
            img.onload = function() {
              errorMsg.style.display = 'none';
            };
          </script>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
    
    // 立即关闭当前弹窗
    onClose();
  }, [vehicleId, onClose]);

  // 这个组件不需要渲染任何内容，因为它会立即打开新窗口并关闭
  return null;
};

export default SimpleVehicleDetailPage;
