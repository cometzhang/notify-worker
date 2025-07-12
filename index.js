// 事件通知系统 - 基于CloudFlare Workers (V3.0)

// 定义HTML模板
const loginPage = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>事件通知系统</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
  <style>
    .login-container {
      background: linear-gradient(135deg, #87CEEB 0%, #1E90FF 100%);
      min-height: 100vh;
    }
    .login-box {
      backdrop-filter: blur(8px);
      background-color: rgba(255, 255, 255, 0.9);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    .btn-primary {
      background: linear-gradient(135deg, #87CEEB 0%, #1E90FF 100%);
      transition: all 0.3s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .input-field {
      transition: all 0.3s;
      border: 1px solid #e2e8f0;
    }
    .input-field:focus {
      border-color: #1E90FF;
      box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.25);
    }
  </style>
</head>
<body class="login-container flex items-center justify-center">
  <div class="login-box p-8 rounded-xl w-full max-w-md mx-4">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800"><i class="fas fa-calendar-check mr-2"></i>事件通知系统</h1>
    </div>
    
    <form id="loginForm" class="space-y-6">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
          <i class="fas fa-user mr-2"></i>用户名
        </label>
        <input type="text" id="username" name="username" required
          class="input-field w-full px-4 py-3 rounded-lg text-gray-700 focus:outline-none">
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          <i class="fas fa-lock mr-2"></i>密码
        </label>
        <input type="password" id="password" name="password" required
          class="input-field w-full px-4 py-3 rounded-lg text-gray-700 focus:outline-none">
      </div>
      
      <button type="submit" 
        class="btn-primary w-full py-3 rounded-lg text-white font-medium focus:outline-none">
        <i class="fas fa-sign-in-alt mr-2"></i>登录
      </button>
      
      <div id="errorMsg" class="text-red-500 text-center"></div>
    </form>
  </div>
  
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      const button = e.target.querySelector('button');
      const originalContent = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>登录中...';
      button.disabled = true;
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (result.success) {
          window.location.href = '/admin';
        } else {
          document.getElementById('errorMsg').textContent = result.message || '用户名或密码错误';
          button.innerHTML = originalContent;
          button.disabled = false;
        }
      } catch (error) {
        document.getElementById('errorMsg').textContent = '发生错误，请稍后再试';
        button.innerHTML = originalContent;
        button.disabled = false;
      }
    });
  </script>
</body>
</html>
`;
const adminPage = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>事件通知系统</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
  <style>
    :root {
        --bg-color: #f3f4f6;
        --text-color: #1f2937;
        --text-secondary-color: #6b7280;
        --card-bg: #ffffff;
        --border-color: #e5e7eb;
        --nav-bg: #ffffff;
        --nav-text: #4b5563;
        --hover-text: #111827;
        --active-link: #4f46e5;
        --row-hover-bg: #f9fafb;
    }
    .dark {
        --bg-color: #111827;
        --text-color: #FFFFFF;
        --text-secondary-color: #9ca3af;
        --card-bg: #1f2937;
        --border-color: #374151;
        --nav-bg: #1f2937;
        --nav-text: #E5E7EB;
        --hover-text: #FFFFFF;
        --active-link: #FFFFFF;
        --row-hover-bg: #000000;
    }
    body {
        background-color: var(--bg-color);
        color: var(--text-color);
        transition: background-color 0.3s, color 0.3s;
    }
    .table-container, .modal-content, nav {
        background-color: var(--card-bg);
        border-color: var(--border-color);
    }
    nav { background-color: var(--nav-bg); }
    nav a, #darkModeToggle { color: var(--nav-text);
    }
    nav a:hover, #darkModeToggle:hover { color: var(--hover-text); }
    nav a.active { color: var(--active-link);
    border-bottom-color: var(--active-link); }
    .table-container, .modal-content, .config-section {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
    }
    h2, h3, h4, .text-primary { color: var(--text-color);
    }
    .text-secondary { color: var(--text-secondary-color);
    }
    .bg-gray-50 { background-color: #f9fafb;
    }
    .dark .bg-gray-50 { background-color: #374151;
    }
    input, select, textarea {
        background-color: var(--bg-color);
        color: var(--text-color);
        border: 1px solid var(--border-color);
    }
    input:focus, select:focus, textarea:focus {
        border-color: var(--active-link);
    }
    .readonly-input {
      background-color: #f8fafc;
      border-color: #e2e8f0;
      cursor: not-allowed;
    }
    .dark .readonly-input {
        background-color: #374151;
        border-color: #4b5563;
    }
    tbody tr.deactivated {
        background-color: #f3f4f6;
    }
    .dark tbody tr.deactivated {
        background-color: var(--card-bg);
    }
    tbody tr:hover { 
      background-color: var(--row-hover-bg) !important;
    }
    
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); transition: all 0.3s;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .btn-danger { background: linear-gradient(135deg, #f87171 0%, #dc2626 100%); transition: all 0.3s;
    }
    .btn-danger:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .btn-success { background: linear-gradient(135deg, #34d399 0%, #059669 100%); transition: all 0.3s;
    }
    .btn-success:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .btn-warning { background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); transition: all 0.3s;
    }
    .btn-warning:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .btn-info { background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); transition: all 0.3s;
    }
    .btn-info:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .btn-secondary { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); transition: all 0.3s;
    }
    .btn-secondary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .table-container { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .modal-container { backdrop-filter: blur(8px);
    }
    .error-message { font-size: 0.875rem; margin-top: 0.25rem; display: none;
    }
    .error-message.show { display: block;
    }
    
    .toast {
      position: fixed;
      top: 20px;
      right: 20px; padding: 12px 20px; border-radius: 8px;
      color: white; font-weight: 500; z-index: 1000; transform: translateX(400px);
      transition: all 0.3s ease-in-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .toast.show { transform: translateX(0);
    }
    .toast.success { background-color: #10b981; }
    .toast.error { background-color: #ef4444;
    }
    .toast.info { background-color: #3b82f6; }
    .toast.warning { background-color: #f59e0b;
    }
  </style>
</head>
<body class="min-h-screen">
  <div id="toast-container"></div>

  <nav class="shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <i class="fas fa-calendar-check text-indigo-600 text-2xl mr-2"></i>
          <span class="font-bold text-lg text-primary">事件通知系统</span>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-4">
          <a href="/admin" class="active px-3 py-2 rounded-md text-sm font-bold">
             <i class="fas fa-list sm:mr-1"></i><span class="hidden sm:inline">列表</span>
          </a>
          <a href="/admin/config" class="px-3 py-2 rounded-md text-sm font-bold">
            <i class="fas fa-cog sm:mr-1"></i><span class="hidden sm:inline">配置</span>
          </a>
          <button id="darkModeToggle" class="px-3 py-2 rounded-md text-sm font-medium">
           <i class="fas fa-moon"></i>
          </button>
          <a href="/api/logout" class="px-3 py-2 rounded-md text-sm font-bold">
            <i class="fas fa-sign-out-alt sm:mr-1"></i><span class="hidden sm:inline">退出</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold text-primary">事件列表</h2>
       <div class="flex items-center space-x-4">
         <div id="datetime-display" class="text-right text-sm text-secondary"></div>
         <button id="addSubscriptionBtn" class="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 font-bold px-2 py-2 sm:px-3 sm:py-1 border border-gray-600 dark:border-gray-400 rounded-md text-sm flex items-center text-primary">
           <i class="fas fa-plus sm:mr-2"></i><span class="hidden sm:inline">添加事件</span>
         </button>
       </div>
    </div>
    
     <div class="table-container rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      
   <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-primary uppercase tracking-wider">名称</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-primary uppercase tracking-wider">类型</th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-primary uppercase tracking-wider">
                 起止时间 <i class="fas fa-sort-up ml-1 text-indigo-500" title="按到期时间升序排列"></i>
            </th>
            <th scope="col" class="px-6 py-3 text-left text-sm font-bold text-primary uppercase tracking-wider">状态</th>
            <th scope="col" class="px-6 py-3 text-right text-sm font-bold text-primary uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody id="subscriptionsBody" class="divide-y divide-gray-200 dark:divide-gray-700">
        </tbody>
      </table>
    </div>
  
 </main>

   <footer class="text-center text-sm text-secondary mt-8 pb-4">
    V3.0
  </footer>

  <div id="subscriptionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-container hidden flex items-center justify-center z-50">
    <div class="modal-content rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
      <div class="bg-gray-50 px-6 py-4 border-b rounded-t-lg">
        <div class="flex items-center justify-between">
          <h3 id="modalTitle" class="text-lg font-medium text-primary">添加新事件</h3>
           <button id="closeModal" class="text-gray-400 hover:text-gray-600">
             <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>
      
      <form id="subscriptionForm" class="p-6 space-y-6">
        <input type="hidden" id="subscriptionId">
        
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label for="name" class="block text-sm font-medium mb-1">事件名称 *</label>
             <input type="text" id="name" required
              class="w-full px-3 py-2 border rounded-md focus:outline-none">
            <div class="error-message text-red-500"></div>
          </div>
           <div>
             <label for="customType" class="block text-sm font-medium mb-1">事件类型</label>
             <input type="text" id="customType" list="customTypeList" placeholder="选择或输入自定义类型"
              class="w-full px-3 py-2 border rounded-md focus:outline-none">
             <datalist id="customTypeList">
                <option value="订阅"></option>
                <option value="航旅"></option>
                 <option value="日程"></option>
                <option value="云服务器"></option>
             </datalist>
            <div class="error-message text-red-500"></div>
          </div>
        </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label for="startDate" class="block text-sm font-medium mb-1">开始时间</label>
            <input type="date" id="startDate"
              class="w-full px-3 py-2 border rounded-md focus:outline-none">
            <div class="error-message text-red-500"></div>
          </div>
           <div>
             <label for="expiryDate" class="block text-sm font-medium mb-1">到期时间 *</label>
            <input type="datetime-local" id="expiryDate" required
           class="w-full px-3 py-2 border rounded-md focus:outline-none">
            <div class="error-message text-red-500"></div>
          </div>
        </div>
        
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
           <div class="flex items-end space-x-2">
            <div class="w-1/2">
              <label for="periodValue" class="block text-sm font-medium mb-1">周期 *</label>
              <input type="number" id="periodValue" list="periodValueList" min="1" value="1" required
                class="w-full px-3 py-2 border rounded-md focus:outline-none">
               <datalist id="periodValueList">
                 <option value="1"></option><option value="2"></option><option value="3"></option><option value="4"></option><option value="5"></option><option value="6"></option><option value="7"></option><option value="8"></option><option value="9"></option><option value="10"></option><option value="11"></option><option value="12"></option><option value="13"></option><option value="14"></option><option value="15"></option><option value="16"></option><option value="17"></option><option value="18"></option><option value="19"></option><option value="20"></option>
              </datalist>
              <div class="error-message text-red-500"></div>
            </div>
             <div class="w-1/2">
               <label for="periodUnit" class="block text-sm font-medium mb-1">单位 *</label>
              <select id="periodUnit" required
                class="w-full px-3 py-2 border rounded-md focus:outline-none">
                 <option value="day">天</option>
                <option value="week">周</option>
                 <option value="month" selected>月</option>
                 <option value="year">年</option>
              </select>
               <div class="error-message text-red-500"></div>
            </div>
          </div>
           <div class="flex items-center space-x-4">
             <label class="inline-flex items-center pt-6">
                  <input type="checkbox" id="autoRenew" checked 
                   class="form-checkbox h-4 w-4 text-indigo-600 rounded">
                  <span class="ml-2 text-sm">自动续订</span>
              </label>
           </div>
         </div>
         
        <div class="border-t pt-6">
            <div class="flex items-center space-x-4">
                <button type="button" id="addNotifyTimeBtn" class="bg-transparent text-primary hover:bg-gray-100 dark:hover:bg-black text-sm px-3 py-2 rounded-md flex items-center border border-gray-400">
                    增加通知时间
                  </button>
             </div>
            <p class="text-xs text-secondary mt-1">点击上方按钮可添加最多3个自定义通知时间点。</p>
            <div id="notifyTimesContainer" class="space-y-2 mt-2"></div>
        </div>
         
        <div>
          <label for="notes" class="block text-sm font-medium mb-1">备注</label>
           <textarea id="notes" rows="3" placeholder="可添加相关备注信息..."
             class="w-full px-3 py-2 border rounded-md focus:outline-none"></textarea>
          <div class="error-message text-red-500"></div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t">
           <button type="button" id="testCurrentSubscriptionBtn" class="hidden text-sm text-primary border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md flex items-center">
                <i class="fas fa-paper-plane mr-2"></i>测试通知
           </button>
           <button type="button" id="cancelBtn" 
            class="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50">
            取消
          </button>
          <button type="submit" 
            class="btn-info text-white px-4 py-2 rounded-md text-sm font-medium">
             <i class="fas fa-save mr-2"></i>保存
           </button>
        </div>
      </form>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/lunar-calendar@1.2.2/dist/lunar-calendar.min.js"></script>
  <script>
    const MAX_NOTIFY_TIMES = 3;
    function showToast(message, type = 'success', duration = 3000) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = 'toast ' + type;
      
      const icon = type === 'success' ? 'check-circle' :
                   type === 'error' ? 'exclamation-circle' :
                   type === 'warning' ? 'exclamation-triangle' : 'info-circle';
      
      toast.innerHTML = '<div class="flex items-center"><i class="fas fa-' + icon + ' mr-2"></i><span>' + message + '</span></div>';
      
      container.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (container.contains(toast)) {
            container.removeChild(toast);
          }
        }, 300);
      }, duration);
    }

    function escapeHtml(text) {
        if (typeof text !== 'string') return text;
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function showFieldError(fieldId, message) {
      const field = document.getElementById(fieldId);
      const errorDiv = field.parentElement.querySelector('.error-message');
      if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        field.classList.add('border-red-500');
      }
    }

    function clearFieldErrors() {
      document.querySelectorAll('.error-message').forEach(el => {
         el.classList.remove('show');
        el.textContent = '';
      });
      document.querySelectorAll('.border-red-500').forEach(el => {
        el.classList.remove('border-red-500');
      });
    }

    function formatToLocalDate(isoString) {
        if (!isoString) return '';
        try {
            const d = new Date(isoString);
            const timezoneOffset = d.getTimezoneOffset() * 60000;
            const localDate = new Date(d.getTime() - timezoneOffset);
            return localDate.toISOString().slice(0, 10);
        } catch(e) {
            return '';
        }
    }

    function formatToLocalDateTime(isoString) {
        if (!isoString) return '';
        try {
            const d = new Date(isoString);
            const timezoneOffset = d.getTimezoneOffset() * 60000;
            const localDate = new Date(d.getTime() - timezoneOffset);
            return localDate.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:MM
        } catch(e) {
            return '';
        }
    }

    function validateForm() {
      clearFieldErrors();
      let isValid = true;
      const name = document.getElementById('name').value.trim();
      if (!name) {
        showFieldError('name', '请输入事件名称');
        isValid = false;
      }

      const periodValue = document.getElementById('periodValue').value;
      if (!periodValue || periodValue < 1) {
        showFieldError('periodValue', '周期数值必须大于0');
        isValid = false;
      }

      const expiryDate = document.getElementById('expiryDate').value;
      if (!expiryDate) {
        showFieldError('expiryDate', '请选择到期时间');
        isValid = false;
      }
      return isValid;
    }

    async function loadSubscriptions() {
      try {
        const tbody = document.getElementById('subscriptionsBody');
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4"><i class="fas fa-spinner fa-spin mr-2"></i>加载中...</td></tr>';
        
        const response = await fetch('/api/subscriptions');
        const data = await response.json();
        tbody.innerHTML = '';
        
        if (data.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-secondary">没有事件数据</td></tr>';
          return;
        }
        
        data.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        data.forEach(subscription => {
          const row = document.createElement('tr');
          row.className = subscription.isActive === false ? 'deactivated' : '';
          
          const expiryDate = new Date(subscription.expiryDate);
          const now = new Date();
  
         const daysDiff = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
     
          let statusHtml = '';
          if (!subscription.isActive) {
            statusHtml = '<span class="px-2 py-1 text-xs font-medium rounded-full text-white bg-gray-500"><i class="fas fa-pause-circle mr-1"></i>已停用</span>';
          } else if (expiryDate < now) {
         statusHtml = '<span class="px-2 py-1 text-xs font-medium rounded-full text-white bg-red-500"><i class="fas fa-exclamation-circle mr-1"></i>已到期</span>';
          } else {
            statusHtml = '<span class="px-2 py-1 text-xs font-medium rounded-full text-white bg-green-500"><i class="fas fa-check-circle mr-1"></i>正常</span>';
          }
          
          let periodText = '';
          if (subscription.periodValue && subscription.periodUnit) {
            const unitMap = { day: '天', week: '周', month: '月', year: '年' };
            periodText = subscription.periodValue + ' ' + (unitMap[subscription.periodUnit] || subscription.periodUnit);
          }
          
          const autoRenewIcon = subscription.autoRenew !== false ?
            '<i class="fas fa-sync-alt text-blue-500 ml-1" title="自动续订"></i>' : '<i class="fas fa-ban text-gray-400 ml-1" title="不自动续订"></i>';
            
          let remainingDiv = '';
          if (daysDiff < 0) {
            remainingDiv = '<div class="text-xs font-bold text-red-500">剩余: 已到期</div>';
          } else {
            remainingDiv = '<div class="text-xs font-bold text-primary">剩余: ' + daysDiff + '天</div>';
          }

          let periodDiv = '';
          if (periodText) {
                periodDiv = '<div class="text-xs font-bold text-primary">周期: ' + periodText + autoRenewIcon + '</div>';
          }
            
          const bottomRowHtml = \`
              <div class="flex items-center space-x-4 mt-1">
                \${periodDiv}
                \${remainingDiv}
              </div>
          \`;
          const safeName = escapeHtml(subscription.name);
          const notesHtml = subscription.notes ?
            '<div class="text-xs text-secondary" style="white-space: pre-wrap; word-break: break-all;">' + escapeHtml(subscription.notes) + '</div>' : '';
          const expiryDateFormatted = formatToLocalDate(subscription.expiryDate);
          const startDateFormatted = subscription.startDate ? formatToLocalDate(subscription.startDate) : '';
          const expiryDateLine = '<div class="text-sm font-bold text-primary">到期: ' + expiryDateFormatted + '</div>';
          const startDateLine = startDateFormatted ?
            '<div class="text-xs font-bold text-primary mt-1">开始: ' + startDateFormatted + '</div>' : '';

          let statusButtonHtml;
          if (subscription.isActive) {
              statusButtonHtml = '<button class="toggle-status bg-transparent hover:bg-yellow-50 dark:hover:bg-gray-700 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-md text-xs font-medium" data-id="' + subscription.id + '" data-action="deactivate">停用</button>';
          } else {
              statusButtonHtml = '<button class="toggle-status bg-transparent hover:bg-green-50 dark:hover:bg-gray-700 text-green-600 dark:text-green-400 px-2 py-1 rounded-md text-xs font-medium" data-id="' + subscription.id + '" data-action="activate">启用</button>';
          }
          const actionsHtml = \`
            <div class="flex items-center justify-end space-x-2">
                <button class="edit bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-primary px-2 py-1 rounded-md text-xs font-medium" data-id="\${subscription.id}">编辑</button>
                \${statusButtonHtml}
                <button class="delete bg-transparent hover:bg-red-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 px-2 py-1 rounded-md text-xs font-medium" data-id="\${subscription.id}">删除</button>
            </div>
          \`;
          
          row.innerHTML = 
            '<td class="px-6 py-4">' + 
              '<div class="text-sm font-bold text-primary">' + safeName + '</div>' +
              notesHtml +
            '</td>' +
             '<td class="px-6 py-4 whitespace-nowrap">' + 
              '<div class="text-sm font-bold text-primary">' + 
                '<i class="fas fa-tag mr-1"></i>' + (subscription.customType || '其他') + 
              '</div>' +
            '</td>' +
             '<td class="px-6 py-4 whitespace-nowrap">' + 
              expiryDateLine +
               startDateLine +
              bottomRowHtml +
            '</td>' +
             '<td class="px-6 py-4 whitespace-nowrap">' + statusHtml + '</td>' +
             '<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">' + actionsHtml + '</td>';
          tbody.appendChild(row);
        });
        
        document.querySelectorAll('.edit').forEach(button => button.addEventListener('click', editSubscription));
        document.querySelectorAll('.delete').forEach(button => button.addEventListener('click', deleteSubscription));
        document.querySelectorAll('.toggle-status').forEach(button => button.addEventListener('click', toggleSubscriptionStatus));
        document.getElementById('testCurrentSubscriptionBtn').addEventListener('click', testCurrentSubscriptionNotification);
      } catch (error) {
        console.error('加载事件失败:', error);
        const tbody = document.getElementById('subscriptionsBody');
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500"><i class="fas fa-exclamation-circle mr-2"></i>加载失败，请刷新页面重试</td></tr>';
        showToast('加载事件列表失败', 'error');
      }
    }
    
    async function testCurrentSubscriptionNotification(e) {
        const button = e.target.closest('button');
        const id = document.getElementById('subscriptionId').value;
        if(!id) {
            showToast('请先保存事件才能进行测试', 'warning');
            return;
        }

        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>';
        button.disabled = true;
        try {
            const response = await fetch('/api/subscriptions/' + id + '/test-notify', { method: 'POST' });
            const result = await response.json();
            if (result.success) {
                showToast(result.message || '测试通知已发送', 'success');
            } else {
                showToast(result.message || '测试通知发送失败', 'error');
            }
        } catch (error) {
            console.error('测试通知失败:', error);
            showToast('发送测试通知时发生错误', 'error');
        } finally {
            button.innerHTML = originalContent;
            button.disabled = false;
        }
    }
    
    async function toggleSubscriptionStatus(e) {
      const button = e.target.closest('button');
      const id = button.dataset.id;
      const action = button.dataset.action;
      const isActivate = action === 'activate';
      
      const originalContent = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>' + (isActivate ? '启用中...' : '停用中...');
      button.disabled = true;
      try {
        const response = await fetch('/api/subscriptions/' + id + '/toggle-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: isActivate })
        });
        if (response.ok) {
          showToast((isActivate ? '启用' : '停用') + '成功', 'success');
          loadSubscriptions();
        } else {
          const error = await response.json();
          showToast((isActivate ? '启用' : '停用') + '失败: ' + (error.message || '未知错误'), 'error');
          button.innerHTML = originalContent;
          button.disabled = false;
        }
      } catch (error) {
        console.error((isActivate ? '启用' : '停用') + '事件失败:', error);
        showToast((isActivate ? '启用' : '停用') + '失败，请稍后再试', 'error');
        button.innerHTML = originalContent;
        button.disabled = false;
      }
    }
    
    document.getElementById('addSubscriptionBtn').addEventListener('click', () => {
      document.getElementById('modalTitle').textContent = '添加新事件';
      document.getElementById('subscriptionModal').classList.remove('hidden');
      document.getElementById('subscriptionForm').reset();
      document.getElementById('subscriptionId').value = '';
      document.getElementById('notifyTimesContainer').innerHTML = '';
      clearFieldErrors();
      
      document.getElementById('testCurrentSubscriptionBtn').classList.add('hidden');

      const now = new Date();
      document.getElementById('startDate').value = formatToLocalDate(now.toISOString());
      document.getElementById('autoRenew').checked = true;
       
      calculateExpiryDate();
      setupModalEventListeners();
    });

    function addNotifyTime(timeValue = '') {
        const container = document.getElementById('notifyTimesContainer');
        if (container.children.length >= MAX_NOTIFY_TIMES) {
            showToast('最多添加' + MAX_NOTIFY_TIMES + '个通知时间', 'warning');
            return;
        }
        
        let defaultValue = timeValue;
        if (!defaultValue) {
            const expiryDateValue = document.getElementById('expiryDate').value;
            if (expiryDateValue) {
                const expiry = new Date(expiryDateValue);
                expiry.setHours(expiry.getHours() + 1);
                defaultValue = formatToLocalDateTime(expiry.toISOString());
            }
        }

        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2';
        
        const input = document.createElement('input');
        input.type = 'datetime-local';
        input.className = 'w-full px-3 py-2 border rounded-md focus:outline-none notify-time-input';
        input.value = defaultValue;
        
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = '<i class="fas fa-trash-alt"></i>';
        button.className = 'text-red-500 hover:text-red-700 px-2';
        button.addEventListener('click', () => {
            div.remove();
        });
        div.appendChild(input);
        div.appendChild(button);
        container.appendChild(div);
    }

    function setupModalEventListeners() {
        ['startDate', 'periodValue', 'periodUnit'].forEach(id => {
            const element = document.getElementById(id);
            element.removeEventListener('change', calculateExpiryDate);
            element.addEventListener('change', calculateExpiryDate);
        });
        document.getElementById('addNotifyTimeBtn').onclick = () => addNotifyTime();
        document.getElementById('cancelBtn').onclick = () => {
            document.getElementById('subscriptionModal').classList.add('hidden');
        };
    }
    
    function calculateExpiryDate() {
      const startValue = document.getElementById('startDate').value;
      const periodValue = parseInt(document.getElementById('periodValue').value);
      const periodUnit = document.getElementById('periodUnit').value;
      
      if (!startValue || !periodValue || !periodUnit) return;
      
      const start = new Date(startValue);
      const expiry = new Date(start);
      
      if (periodUnit === 'day') {
        expiry.setDate(start.getDate() + periodValue);
      } else if (periodUnit === 'week') {
        expiry.setDate(start.getDate() + periodValue * 7);
      } else if (periodUnit === 'month') {
        expiry.setMonth(start.getMonth() + periodValue);
      } else if (periodUnit === 'year') {
        expiry.setFullYear(start.getFullYear() + periodValue);
      }
      
      document.getElementById('expiryDate').value = formatToLocalDateTime(expiry.toISOString());
    }
    
    document.getElementById('closeModal').addEventListener('click', () => {
      document.getElementById('subscriptionModal').classList.add('hidden');
    });
    document.getElementById('subscriptionModal').addEventListener('click', (event) => {
      if (event.target === document.getElementById('subscriptionModal')) {
        document.getElementById('subscriptionModal').classList.add('hidden');
      }
    });
    document.getElementById('subscriptionForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      
      const id = document.getElementById('subscriptionId').value;
      const customNotifyTimes = [];
      document.querySelectorAll('.notify-time-input').forEach(input => {
          if (input.value) {
              customNotifyTimes.push(new Date(input.value).toISOString());
          }
      });
      
           
       const subscription = {
        name: document.getElementById('name').value.trim(),
        customType: document.getElementById('customType').value.trim(),
        notes: document.getElementById('notes').value.trim() || '',
        autoRenew: document.getElementById('autoRenew').checked,
        startDate: document.getElementById('startDate').value ?
          new Date(document.getElementById('startDate').value).toISOString() : null,
        expiryDate: document.getElementById('expiryDate').value ?
          new Date(document.getElementById('expiryDate').value).toISOString() : null,
 
        periodValue: parseInt(document.getElementById('periodValue').value),
        periodUnit: document.getElementById('periodUnit').value,
        customNotifyTimes: customNotifyTimes,
      };
      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalContent = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>' + (id ? '更新中...' : '保存中...');
      submitButton.disabled = true;
      try {
        const url = id ? '/api/subscriptions/' + id : '/api/subscriptions';
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        });
        const result = await response.json();
        
        if (result.success) {
          showToast((id ? '更新' : '添加') + '事件成功', 'success');
          document.getElementById('subscriptionModal').classList.add('hidden');
          loadSubscriptions();
        } else {
          showToast((id ? '更新' : '添加') + '事件失败: ' + (result.message || '未知错误'), 'error');
        }
      } catch (error) {
        console.error((id ? '更新' : '添加') + '事件失败:', error);
        showToast((id ? '更新' : '添加') + '事件失败，请稍后再试', 'error');
      } finally {
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
      }
    });
    
    async function editSubscription(e) {
      const id = e.target.closest('button').dataset.id;
      try {
        const response = await fetch('/api/subscriptions/' + id);
        const subscription = await response.json();
        
        if (subscription) {
          document.getElementById('modalTitle').textContent = '编辑事件';
          document.getElementById('subscriptionId').value = subscription.id;
          document.getElementById('name').value = subscription.name;
          document.getElementById('customType').value = subscription.customType || '';
          document.getElementById('notes').value = subscription.notes || '';
          document.getElementById('autoRenew').checked = subscription.autoRenew !== false;
          
          document.getElementById('startDate').value = formatToLocalDate(subscription.startDate);
          document.getElementById('expiryDate').value = formatToLocalDateTime(subscription.expiryDate);

          document.getElementById('periodValue').value = subscription.periodValue || 1;
          document.getElementById('periodUnit').value = subscription.periodUnit || 'month';

          const notifyTimesContainer = document.getElementById('notifyTimesContainer');
          notifyTimesContainer.innerHTML = '';
          if (subscription.customNotifyTimes && Array.isArray(subscription.customNotifyTimes)) {
              subscription.customNotifyTimes.forEach(time => {
                  addNotifyTime(formatToLocalDateTime(time));
              });
          }

          document.getElementById('testCurrentSubscriptionBtn').classList.remove('hidden');
          clearFieldErrors();
          document.getElementById('subscriptionModal').classList.remove('hidden');
          setupModalEventListeners();
        }
      } catch (error) {
        console.error('获取事件信息失败:', error);
        showToast('获取事件信息失败', 'error');
      }
    }
    
    async function deleteSubscription(e) {
      const button = e.target.closest('button');
      const id = button.dataset.id;
      
      if (!confirm('确定要删除这个事件吗？此操作不可恢复。')) return;
      
      const originalContent = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>删除中...';
      button.disabled = true;
      
      try {
        const response = await fetch('/api/subscriptions/' + id, { method: 'DELETE' });
        if (response.ok) {
          showToast('删除成功', 'success');
          loadSubscriptions();
        } else {
          const error = await response.json();
          showToast('删除失败: ' + (error.message || '未知错误'), 'error');
          button.innerHTML = originalContent;
          button.disabled = false;
        }
      } catch (error) {
        console.error('删除事件失败:', error);
        showToast('删除失败，请稍后再试', 'error');
        button.innerHTML = originalContent;
        button.disabled = false;
      }
    }
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const toggleIcon = darkModeToggle.querySelector('i');

    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
    } else {
        document.documentElement.classList.remove('dark');
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
    }

    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            toggleIcon.classList.remove('fa-moon');
            toggleIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            toggleIcon.classList.remove('fa-sun');
             toggleIcon.classList.add('fa-moon');
        }
    });
    function updateBeijingTime() {
        const display = document.getElementById('datetime-display');
        if (!display) return;
        const now = new Date();
        const beijingTimeOptions = {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
               };
        const formatter = new Intl.DateTimeFormat('zh-CN', beijingTimeOptions);
        const parts = formatter.formatToParts(now);
        const
            year = parts.find(p => p.type === 'year').value,
            month = parts.find(p => p.type === 'month').value,
            day = parts.find(p => p.type === 'day').value,
            hour = parts.find(p => p.type === 'hour').value,
            minute = parts.find(p => p.type === 'minute').value;
        const beijingDateTime = \`\${year}年\${month}月\${day}日 \${hour}:\${minute}\`;
        
        try {
            const lunarData = calendar.solar2lunar(now.getFullYear(), now.getMonth() + 1, now.getDate());
            const lunarDate = \`农历: \${lunarData.lunarYear}年\${lunarData.monthStr}\${lunarData.dayStr}\`;
            display.innerHTML = beijingDateTime + '<br>' + lunarDate;
        } catch (e) {
            display.innerHTML = beijingDateTime;
            console.error("Lunar calendar conversion failed:", e);
        }
    }

    window.addEventListener('load', () => {
        loadSubscriptions();
        updateBeijingTime();
        setInterval(updateBeijingTime, 60000); // 每分钟更新一次
    });
  </script>
</body>
</html>
`;

// #############################################################################
// # Worker Logic
// #############################################################################

const configPage = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>系统配置 - 事件通知系统</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
  <style>
    :root {
        --bg-color: #f3f4f6;
        --text-color: #1f2937;
        --text-secondary-color: #6b7280;
        --card-bg: #ffffff;
        --border-color: #e5e7eb;
        --nav-bg: #ffffff;
        --nav-text: #4b5563;
        --hover-text: #111827;
        --active-link: #4f46e5;
    }
    .dark {
        --bg-color: #111827;
        --text-color: #FFFFFF;
        --text-secondary-color: #9ca3af;
        --card-bg: #1f2937;
        --border-color: #374151;
        --nav-bg: #1f2937;
        --nav-text: #E5E7EB;
        --hover-text: #FFFFFF;
        --active-link: #FFFFFF;
    }
    body {
        background-color: var(--bg-color);
        color: var(--text-color);
        transition: background-color 0.3s, color 0.3s;
    }
    .modal-content, nav, .bg-white {
        background-color: var(--card-bg);
        border-color: var(--border-color);
    }
    nav { background-color: var(--nav-bg); }
    nav a, #darkModeToggle { color: var(--nav-text);
    }
    nav a:hover, #darkModeToggle:hover { color: var(--hover-text); }
    nav a.active { color: var(--active-link);
    border-bottom-color: var(--active-link); }
    
    input, select, textarea {
        background-color: var(--bg-color);
        color: var(--text-color);
        border: 1px solid var(--border-color);
    }
    input:focus, select:focus, textarea:focus {
        border-color: var(--active-link);
    }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); transition: all 0.3s;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .btn-secondary { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); transition: all 0.3s;
    }
    .btn-secondary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .toast {
      position: fixed; top: 20px;
      right: 20px; padding: 12px 20px; border-radius: 8px;
      color: white; font-weight: 500; z-index: 1050; transform: translateX(400px);
      transition: all 0.3s ease-in-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .toast.show { transform: translateX(0);
    }
    .toast.success { background-color: #10b981; }
    .toast.error { background-color: #ef4444;
    }
    .toast.info { background-color: #3b82f6; }
    .toast.warning { background-color: #f59e0b;
    }
    .modal-container { backdrop-filter: blur(8px); z-index: 1040;
    }
  </style>
</head>
<body class="min-h-screen">
  <div id="toast-container"></div>

  <nav class="shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <i class="fas fa-calendar-check text-indigo-600 text-2xl mr-2"></i>
          <span class="font-bold text-xl text-primary">事件通知系统</span>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-4">
          <a href="/admin" class="px-3 py-2 rounded-md text-sm font-medium">
             <i class="fas fa-list sm:mr-1"></i><span class="hidden sm:inline">列表</span>
          </a>
          <a href="/admin/config" class="active px-3 py-2 rounded-md text-sm font-medium">
            <i class="fas fa-cog sm:mr-1"></i><span class="hidden sm:inline">配置</span>
          </a>
          <button id="darkModeToggle" class="px-3 py-2 rounded-md text-sm font-medium">
             <i class="fas fa-moon"></i>
           </button>
          <a href="/api/logout" class="px-3 py-2 rounded-md text-sm font-medium">
            <i class="fas fa-sign-out-alt sm:mr-1"></i><span class="hidden sm:inline">退出</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
  
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md">
      <form id="configForm" class="space-y-6 p-6">
        <div class="border-b pb-6">
          <h3 class="text-lg font-medium mb-2 text-primary">管理员账户</h3>
          <p class="text-sm text-secondary mb-4"></p>
          <button type="button" id="openAdminConfigBtn" class="btn-secondary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
              <i class="fas fa-user-cog mr-2"></i>修改账户信息
          </button>
        </div>
        
        <div class="border-b pb-6">
          <h3 class="text-lg font-medium mb-2 text-primary">通知设置（可多选）</h3>
          <p class="text-sm text-secondary mb-4"></p>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              
            <div class="flex flex-col items-center justify-center p-3 border rounded-lg space-y-2">
                 <span class="font-medium text-sm text-primary">WXPusher</span>
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="enableWXPusher" name="enabled_notifiers" value="wxpusher" class="form-checkbox h-5 w-5 text-indigo-600 rounded">
                    <button type="button" data-modal-target="wxpusherConfigModal" class="open-config-modal-btn text-gray-400 hover:text-gray-600 text-lg"><i class="fas fa-cog"></i></button>
                 </div>
            </div>

            <div class="flex flex-col items-center justify-center p-3 border rounded-lg space-y-2">
                <span class="font-medium text-sm text-primary">息知</span>
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="enableXiZhi" name="enabled_notifiers" value="xizhi" class="form-checkbox h-5 w-5 text-indigo-600 rounded">
                    <button type="button" data-modal-target="xizhiConfigModal" class="open-config-modal-btn text-gray-400 hover:text-gray-600 text-lg"><i class="fas fa-cog"></i></button>
                </div>
            </div>
            
            <div class="flex flex-col items-center justify-center p-3 border rounded-lg space-y-2">
              <span class="font-medium text-sm text-primary">NotifyX</span>
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="enableNotifyx" name="enabled_notifiers" value="notifyx" class="form-checkbox h-5 w-5 text-indigo-600 rounded">
                    <button type="button" data-modal-target="notifyxConfigModal" class="open-config-modal-btn text-gray-400 hover:text-gray-600 text-lg"><i class="fas fa-cog"></i></button>
                </div>
                 </div>

            <div class="flex flex-col items-center justify-center p-3 border rounded-lg space-y-2">
                <span class="font-medium text-sm text-primary">邮件</span>
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="enableEmail" name="enabled_notifiers" value="email" class="form-checkbox h-5 w-5 text-indigo-600 rounded">
                     <button type="button" data-modal-target="emailConfigModal" class="open-config-modal-btn text-gray-400 hover:text-gray-600 text-lg"><i class="fas fa-cog"></i></button>
                </div>
            </div>

            <div class="flex flex-col items-center justify-center p-3 border rounded-lg space-y-2">
               <span class="font-medium text-sm text-primary">Telegram</span>
                 <div class="flex items-center space-x-3">
                    <input type="checkbox" id="enableTelegram" name="enabled_notifiers" value="telegram" class="form-checkbox h-5 w-5 text-indigo-600 rounded">
                    <button type="button" data-modal-target="telegramConfigModal" class="open-config-modal-btn text-gray-400 hover:text-gray-600 text-lg"><i class="fas fa-cog"></i></button>
                </div>
            </div>
             <div class="flex flex-col items-center justify-center p-3 border rounded-lg space-y-2">
                <span class="font-medium text-sm text-primary">Bark</span>
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="enableBark" name="enabled_notifiers" value="bark" class="form-checkbox h-5 w-5 text-indigo-600 rounded">
                     <button type="button" data-modal-target="barkConfigModal" class="open-config-modal-btn text-gray-400 hover:text-gray-600 text-lg"><i class="fas fa-cog"></i></button>
                </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end pt-2">
          <button type="submit" class="btn-primary text-white px-6 py-2 rounded-md text-sm font-medium">
             <i class="fas fa-save mr-2"></i>保存所有配置
          </button>
        </div>
      </form>
    </div>
  </main>

  <div id="modals-container">
    <div id="adminConfigModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-container hidden flex items-center justify-center">
        <div class="modal-content rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div class="flex items-center justify-between px-6 py-4 border-b rounded-t-lg">
                 <h3 class="text-lg font-medium text-primary">管理员账户设置</h3>
                <button data-close-button class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label for="adminUsername" class="block text-sm font-medium text-primary">用户名</label>
                     <input type="text" id="adminUsername" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
                </div>
                <div>
                    <label for="adminPassword" class="block text-sm font-medium text-primary">新密码</label>
                    <input type="password" id="adminPassword" placeholder="如不修改密码，请留空" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
                    <p class="mt-1 text-sm text-secondary">留空表示不修改当前密码</p>
                </div>
            </div>
            <div class="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
                 <button type="button" data-close-button class="btn-secondary text-white px-4 py-2 rounded-md text-sm">完成</button>
            </div>
        </div>
    </div>
      
    <div id="wxpusherConfigModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-container hidden flex items-center justify-center">
      <div class="modal-content rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b rounded-t-lg">
          <h3 class="text-lg font-medium text-primary">WXPusher 配置</h3>
           <button data-close-button class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="wxpusherAppToken" class="block text-sm font-medium text-primary">AppToken</label>
              <input type="text" id="wxpusherAppToken" placeholder="在 WXPusher 后台获取" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
             </div>
            <div>
              <label for="wxpusherTopicId" class="block text-sm font-medium text-primary">Topic ID</label>
              <input type="text" id="wxpusherTopicId" placeholder="推送给主题, 可选" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
            </div>
           </div>
           <div>
            <label for="wxpusherUid" class="block text-sm font-medium text-primary">UIDs</label>
            <input type="text" id="wxpusherUid" placeholder="推送给多个用户, 用英文逗号隔开" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
          </div>
          <p class="text-sm text-secondary">UID 和 Topic ID 至少需要填写一个。从 <a href="http://wxpusher.zjiecode.com/" target="_blank" class="text-indigo-600 hover:text-indigo-800">WXPusher官网</a> 获取。</p>
        </div>
         <div class="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
           <button type="button" data-save-button class="btn-primary text-white px-4 py-2 rounded-md text-sm">保存</button>
          <button type="button" data-test-button="wxpusher" class="btn-secondary text-white px-4 py-2 rounded-md text-sm">测试</button>
        </div>
      </div>
    </div>
    
    <div id="xizhiConfigModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-container hidden flex items-center justify-center">
        <div class="modal-content rounded-lg shadow-xl max-w-lg w-full mx-4">
             <div class="flex items-center justify-between px-6 py-4 border-b rounded-t-lg">
                <h3 class="text-lg font-medium text-primary">息知 配置</h3>
                <button data-close-button class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6 space-y-4">
               <div>
                   <label for="xizhiPushUrl" class="block text-sm font-medium text-primary">息知推送URL (接口)</label>
                    <input type="text" id="xizhiPushUrl" placeholder="例如: https://xizhi.qqoq.net/xxxxxxxx.send" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
                    <p class="mt-1 text-sm text-secondary">从 <a href="https://xz.qqoq.net/" target="_blank" class="text-indigo-600 hover:text-indigo-800">息知官网</a> 获取完整的推送URL</p>
                </div>
              </div>
            <div class="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
                <button type="button" data-save-button class="btn-primary text-white px-4 py-2 rounded-md text-sm">保存</button>
                <button type="button" data-test-button="xizhi" class="btn-secondary text-white px-4 py-2 rounded-md text-sm">测试</button>
            </div>
        </div>
     </div>

    <div id="notifyxConfigModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-container hidden flex items-center justify-center">
        <div class="modal-content rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div class="flex items-center justify-between px-6 py-4 border-b rounded-t-lg">
                <h3 class="text-lg font-medium text-primary">NotifyX 配置</h3>
                <button data-close-button class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
             </div>
             <div class="p-6 space-y-4">
                <div>
                    <label for="notifyxApiKey" class="block text-sm font-medium text-primary">API Key</label>
                    <input type="text" id="notifyxApiKey" placeholder="从 NotifyX 平台获取的 API Key" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
                     <p class="mt-1 text-sm text-secondary">从 <a href="https://www.notifyx.cn/" target="_blank" class="text-indigo-600 hover:text-indigo-800">NotifyX官网</a> 获取</p>
                </div>
            </div>
            <div class="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
                 <button type="button" data-save-button class="btn-primary text-white px-4 py-2 rounded-md text-sm">保存</button>
                 <button type="button" data-test-button="notifyx" class="btn-secondary text-white px-4 py-2 rounded-md text-sm">测试</button>
            </div>
        </div>
    </div>

    <div id="emailConfigModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-container hidden flex items-center justify-center">
      <div class="modal-content rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b rounded-t-lg">
          <h3 class="text-lg font-medium text-primary">邮件 (Resend) 配置</h3>
           <button data-close-button class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label for="resendApiKey" class="block text-sm font-medium text-primary">Resend API Key</label>
            <input type="password" id="resendApiKey" placeholder="re_xxxxxxxxxxxxxx" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
            <p class="mt-1 text-sm text-secondary">从 <a href="https://resend.com/login" target="_blank" class="text-indigo-600 hover:text-indigo-800">Resend控制台</a> 获取的 API Key</p>
          </div>
          <div>
            <label for="senderEmail" class="block text-sm font-medium text-primary">发件人邮箱</label>
            <input type="email" id="senderEmail" placeholder="noreply@yourdomain.com" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
          </div>
           <div>
             <label for="senderName" class="block text-sm font-medium text-primary">发件人名称</label>
 
             <input type="text" id="senderName" placeholder="事件通知系统" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
          </div>
          <div>
            <label for="recipientEmail" class="block text-sm font-medium text-primary">收件人邮箱</label>
            <input type="email" id="recipientEmail" placeholder="your-email@example.com" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
          </div>
         </div>
        <div class="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
          <button type="button" data-save-button class="btn-primary text-white px-4 py-2 rounded-md text-sm">保存</button>
          <button type="button" data-test-button="email" class="btn-secondary text-white px-4 py-2 rounded-md text-sm">测试</button>
        </div>
      </div>
    </div>

     <div id="telegramConfigModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-container hidden flex items-center justify-center">
        <div class="modal-content rounded-lg shadow-xl max-w-lg w-full mx-4">
 
             <div class="flex items-center justify-between px-6 py-4 border-b rounded-t-lg">
                <h3 class="text-lg font-medium text-primary">Telegram Bot 配置</h3>
                <button data-close-button class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6 space-y-4">
               
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="tgBotToken" class="block text-sm font-medium text-primary">Bot Token</label>
                        <input type="text" id="tgBotToken" placeholder="从 BotFather 获取" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
       
                     </div>
                    <div>
                        <label for="tgChatId" class="block text-sm font-medium text-primary">Chat ID</label>
                        <input type="text" id="tgChatId" placeholder="用户、频道或群组的ID" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
  
                      </div>
                </div>
            </div>
            <div class="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
                <button type="button" data-save-button class="btn-primary text-white px-4 py-2 rounded-md text-sm">保存</button>
          
                 <button type="button" data-test-button="telegram" class="btn-secondary text-white px-4 py-2 rounded-md text-sm">测试</button>
            </div>
        </div>
    </div>
    
    <div id="barkConfigModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 modal-container hidden flex items-center justify-center">
        <div class="modal-content rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div class="flex items-center justify-between px-6 py-4 border-b rounded-t-lg">
           
                   <h3 class="text-lg font-medium text-primary">Bark 配置</h3>
                <button data-close-button class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div class="p-6 space-y-4">
                <div>
                    <label for="barkPushUrl" class="block text-sm font-medium text-primary">Bark 推送URL</label>
   
                                   <input type="text" id="barkPushUrl" placeholder="例如: https://api.day.app/your_key" class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none">
                    <p class="mt-1 text-sm text-secondary">从 Bark App 中获取完整的推送URL。</p>
                </div>
            </div>
            <div class="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg">
                <button type="button" data-save-button class="btn-primary text-white px-4 py-2 rounded-md text-sm">保存</button>
                <button type="button" data-test-button="bark" class="btn-secondary text-white px-4 py-2 rounded-md text-sm">测试</button>
            </div>
        </div>
    </div>
  </div>

  <script>
    function showToast(message, type = 'success', duration = 3000) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = 'toast ' + type;
      
      const icon = type === 'success' ? 'check-circle' :
                   type === 'error' ? 'exclamation-circle' :
                   type === 'warning' ? 'exclamation-triangle' : 'info-circle';
      
      toast.innerHTML = '<div class="flex items-center"><i class="fas fa-' + icon + ' mr-2"></i><span>' + message + '</span></div>';
      
      container.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (container.contains(toast)) {
            container.removeChild(toast);
          }
        }, 300);
      }, duration);
    }

    async function loadConfig() {
      try {
        const response = await fetch('/api/config');
        const config = await response.json();
        
        document.getElementById('adminUsername').value = config.ADMIN_USERNAME || '';
        document.getElementById('wxpusherAppToken').value = config.WXPUSHER_APP_TOKEN || '';
        document.getElementById('wxpusherUid').value = config.WXPUSHER_UID || '';
        document.getElementById('wxpusherTopicId').value = config.WXPUSHER_TOPIC_ID || '';
        document.getElementById('xizhiPushUrl').value = config.XIZHI_PUSH_URL || '';
        document.getElementById('notifyxApiKey').value = config.NOTIFYX_API_KEY || '';
        document.getElementById('resendApiKey').value = config.RESEND_API_KEY || '';
        document.getElementById('senderEmail').value = config.SENDER_EMAIL || '';
        document.getElementById('senderName').value = config.SENDER_NAME || '事件通知系统';
        document.getElementById('recipientEmail').value = config.RECIPIENT_EMAIL || '';
        document.getElementById('tgBotToken').value = config.TG_BOT_TOKEN || '';
        document.getElementById('tgChatId').value = config.TG_CHAT_ID || '';
        document.getElementById('barkPushUrl').value = config.BARK_PUSH_URL || '';
        if (config.ENABLED_NOTIFIERS && Array.isArray(config.ENABLED_NOTIFIERS)) {
            config.ENABLED_NOTIFIERS.forEach(notifier => {
                let checkbox;
                if (notifier === 'notifyx') checkbox = document.getElementById('enableNotifyx');
                else if (notifier === 'wxpusher') checkbox = document.getElementById('enableWXPusher');
                else if (notifier === 'telegram') checkbox = document.getElementById('enableTelegram');
                else if (notifier === 'email') checkbox = document.getElementById('enableEmail');
                else if (notifier === 'xizhi') checkbox = document.getElementById('enableXiZhi');
                else if (notifier === 'bark') checkbox = document.getElementById('enableBark');
                
                 if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
      } catch (error) {
        console.error('加载配置失败:', error);
        showToast('加载配置失败，请刷新页面重试', 'error');
      }
    }
    
    async function saveConfig(showSuccessToast = true) {
      const enabledNotifiers = [];
      document.querySelectorAll('input[name="enabled_notifiers"]:checked').forEach(checkbox => {
          enabledNotifiers.push(checkbox.value);
      });
      const config = {
        ADMIN_USERNAME: document.getElementById('adminUsername').value.trim(),
        ADMIN_PASSWORD: '', // Will be set below if not empty
        NOTIFYX_API_KEY: document.getElementById('notifyxApiKey').value.trim(),
        WXPUSHER_APP_TOKEN: document.getElementById('wxpusherAppToken').value.trim(),
        WXPUSHER_UID: document.getElementById('wxpusherUid').value.trim(),
        WXPUSHER_TOPIC_ID: document.getElementById('wxpusherTopicId').value.trim(),
        TG_BOT_TOKEN: document.getElementById('tgBotToken').value.trim(),
        TG_CHAT_ID: document.getElementById('tgChatId').value.trim(),
        RESEND_API_KEY: document.getElementById('resendApiKey').value.trim(),
        SENDER_EMAIL: document.getElementById('senderEmail').value.trim(),
        SENDER_NAME: document.getElementById('senderName').value.trim(),
        RECIPIENT_EMAIL: document.getElementById('recipientEmail').value.trim(),
        XIZHI_PUSH_URL: document.getElementById('xizhiPushUrl').value.trim(),
        BARK_PUSH_URL: document.getElementById('barkPushUrl').value.trim(),
        ENABLED_NOTIFIERS: enabledNotifiers
      };
      const passwordField = document.getElementById('adminPassword');
      if (passwordField.value.trim()) {
        config.ADMIN_PASSWORD = passwordField.value.trim();
      } else {
        delete config.ADMIN_PASSWORD;
      }

      try {
        const response = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        });
        const result = await response.json();
        
        if (result.success) {
          if(showSuccessToast) showToast('配置保存成功', 'success');
          if (config.ADMIN_PASSWORD) passwordField.value = '';
          return true;
        } else {
          showToast('配置保存失败: ' + (result.message || '未知错误'), 'error');
          return false;
        }
      } catch (error) {
        console.error('保存配置失败:', error);
        showToast('保存配置时发生网络错误', 'error');
        return false;
      }
    }
    
    document.getElementById('configForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitButton = e.target.querySelector('button[type="submit"]');
      const originalContent = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>保存中...';
      submitButton.disabled = true;
      
      const success = await saveConfig();

      if (success) {
        setTimeout(() => {
               window.location.href = '/admin';
        }, 1000); 
      } else {
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
      }
    });
    async function testNotification(button, type) {
      const originalContent = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      button.disabled = true;

      showToast('将首先保存所有配置...', 'info', 2000);
      const saveSuccess = await saveConfig(false);
      if (!saveSuccess) {
          showToast('保存配置失败，测试已取消', 'warning');
          button.innerHTML = '测试';
          button.disabled = false;
          return;
      }

      showToast('配置已保存，正在发送测试通知...', 'info', 2000);
      try {
        const response = await fetch('/api/test-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: type })
        });
        const result = await response.json();
        
        if (result.success) {
          showToast(type.toUpperCase() + ' 通知测试成功！', 'success');
        } else {
          showToast(type.toUpperCase() + ' 通知测试失败: ' + (result.message || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('测试通知失败:', error);
        showToast('测试失败，请稍后再试', 'error');
      } finally {
        button.innerHTML = '测试';
        button.disabled = false;
      }
    }

    // Modal handling logic
    document.getElementById('openAdminConfigBtn').addEventListener('click', () => {
        const modal = document.getElementById('adminConfigModal');
        if (modal) modal.classList.remove('hidden');
    });
    document.querySelectorAll('.open-config-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if(modal) modal.classList.remove('hidden');
        });
    });
    document.querySelectorAll('[data-close-button]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-container');
            if(modal) modal.classList.add('hidden');
        });
    });
    document.querySelectorAll('[data-test-button]').forEach(button => {
        button.addEventListener('click', (e) => testNotification(e.currentTarget, e.currentTarget.dataset.testButton));
    });
    document.querySelectorAll('[data-save-button]').forEach(button => {
        button.addEventListener('click', async (e) => {
            const modal = e.target.closest('.modal-container');
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            const success = await saveConfig();
         
           if (success) {
                setTimeout(() => {
                    if(modal) modal.classList.add('hidden');
                }, 1000);
            }
            button.innerHTML = originalContent;
            button.disabled = false;
        });
    });

 const darkModeToggle = document.getElementById('darkModeToggle');
 const toggleIcon = darkModeToggle.querySelector('i');
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
    } else {
        document.documentElement.classList.remove('dark');
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
    }

    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            toggleIcon.classList.remove('fa-moon');
            toggleIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            toggleIcon.classList.remove('fa-sun');
   
             toggleIcon.classList.add('fa-moon');
        }
    });
    window.addEventListener('load', loadConfig);
  </script>
</body>
</html>
`;

// #############################################################################
// # Worker Logic
// #############################################################################

const admin = {
  async handleRequest(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    const token = getCookieValue(request.headers.get('Cookie'), 'token');
    const config = await getConfig(env);
    const user = token ? await verifyJWT(token, config.JWT_SECRET) : null;
    
    if (!user) {
      return new Response('', {
        status: 302,
        headers: { 'Location': '/' }
      });
    }
    
    if (pathname === '/admin/config') {
      return new Response(configPage, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    return new Response(adminPage, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

const api = {
  async handleRequest(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.slice(4);
    const method = request.method;
    
    const config = await getConfig(env);
    if (path === '/login' && method === 'POST') {
      const body = await request.json();
      if (body.username === config.ADMIN_USERNAME && body.password === config.ADMIN_PASSWORD) {
        const token = await generateJWT(body.username, config.JWT_SECRET);
        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': 'token=' + token + '; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400'
            }
          }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, message: '用户名或密码错误' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    if (path === '/logout' && (method === 'GET' || method === 'POST')) {
      return new Response('', {
        status: 302,
        headers: {
          'Location': '/',
          'Set-Cookie': 'token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0'
        }
      });
    }
    
    const token = getCookieValue(request.headers.get('Cookie'), 'token');
    const user = token ? await verifyJWT(token, config.JWT_SECRET) : null;
    
    if (!user && path !== '/login') {
      return new Response(
        JSON.stringify({ success: false, message: '未授权访问' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (path === '/config') {
      if (method === 'GET') {
        const { JWT_SECRET, ADMIN_PASSWORD, ...safeConfig } = config;
        return new Response(
          JSON.stringify(safeConfig),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (method === 'POST') {
        try {
          const newConfig = await request.json();
          const currentConfig = await getConfig(env);

          const updatedConfig = { 
            ...currentConfig,
            ADMIN_USERNAME: newConfig.ADMIN_USERNAME,
            NOTIFYX_API_KEY: newConfig.NOTIFYX_API_KEY,
            WXPUSHER_APP_TOKEN: newConfig.WXPUSHER_APP_TOKEN,
            WXPUSHER_UID: newConfig.WXPUSHER_UID,
            WXPUSHER_TOPIC_ID: newConfig.WXPUSHER_TOPIC_ID,
            TG_BOT_TOKEN: newConfig.TG_BOT_TOKEN,
            TG_CHAT_ID: newConfig.TG_CHAT_ID,
            RESEND_API_KEY: newConfig.RESEND_API_KEY,
            SENDER_EMAIL: newConfig.SENDER_EMAIL,
            SENDER_NAME: newConfig.SENDER_NAME,
            RECIPIENT_EMAIL: newConfig.RECIPIENT_EMAIL,
            XIZHI_PUSH_URL: newConfig.XIZHI_PUSH_URL,
            BARK_PUSH_URL: newConfig.BARK_PUSH_URL,
            ENABLED_NOTIFIERS: newConfig.ENABLED_NOTIFIERS
           };
          if (newConfig.ADMIN_PASSWORD) {
            updatedConfig.ADMIN_PASSWORD = newConfig.ADMIN_PASSWORD;
          }
          
          await env.SUBSCRIPTIONS_KV.put('config', JSON.stringify(updatedConfig));
          return new Response(
            JSON.stringify({ success: true }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('保存配置失败:', error);
          return new Response(
            JSON.stringify({ success: false, message: '更新配置失败: ' + error.message }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }
    
    if (path === '/test-notification' && method === 'POST') {
      try {
        const body = await request.json();
        let success = false;
        
        const title = '测试通知';
        const content = '这是一条来自事件通知系统的测试通知。\n\n发送时间: ' + new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        if (body.type === 'notifyx') {
            success = await sendNotifyXNotification(title, '## ' + title + '\n\n' + content, '测试通知', config);
        } else if (body.type === 'wxpusher') {
            success = await sendWXPusherNotification(title, content, config);
        } else if (body.type === 'telegram') {
            success = await sendTelegramNotification(title, `**${title}**\n\n${content}`, config);
        } else if (body.type === 'email') {
            success = await sendResendEmailNotification(title, content, config);
        } else if (body.type === 'xizhi') {
            success = await sendXiZhiNotification(title, content, config);
        } else if (body.type === 'bark') {
            success = await sendBarkNotification(title, content, config);
        }

        const message = success ? (body.type.toUpperCase() + ' 通知测试成功') : (body.type.toUpperCase() + ' 通知发送失败，请检查配置');
        
        return new Response(
          JSON.stringify({ success, message }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('测试通知失败:', error);
        return new Response(
          JSON.stringify({ success: false, message: '测试通知失败: ' + error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    if (path === '/subscriptions') {
      if (method === 'GET') {
        const subscriptions = await getAllSubscriptions(env);
        return new Response(
          JSON.stringify(subscriptions),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (method === 'POST') {
        const subscription = await request.json();
        const result = await createSubscription(subscription, env);
        return new Response(
          JSON.stringify(result),
          { status: result.success ? 201 : 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    if (path.startsWith('/subscriptions/')) {
      const parts = path.split('/');
      const id = parts[2];
      
      if (parts[3] === 'toggle-status' && method === 'POST') {
        const body = await request.json();
        const result = await toggleSubscriptionStatus(id, body.isActive, env);
        return new Response(
          JSON.stringify(result),
          { status: result.success ? 200 : 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (parts[3] === 'test-notify' && method === 'POST') {
        const result = await testSingleSubscriptionNotification(id, env);
        return new Response(JSON.stringify(result), { status: result.success ? 200 : 500, headers: { 'Content-Type': 'application/json' } });
      }
      
      if (method === 'GET') {
        const subscription = await getSubscription(id, env);
        return new Response(
          JSON.stringify(subscription),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (method === 'PUT') {
        const subscription = await request.json();
        const result = await updateSubscription(id, subscription, env);
        return new Response(
          JSON.stringify(result),
          { status: result.success ? 200 : 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (method === 'DELETE') {
        const result = await deleteSubscription(id, env);
        return new Response(
          JSON.stringify(result),
          { status: result.success ? 200 : 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ success: false, message: '未找到请求的资源' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

async function getConfig(env) {
  try {
    const data = await env.SUBSCRIPTIONS_KV.get('config');
    const config = data ? JSON.parse(data) : {};
    
    return {
      ADMIN_USERNAME: config.ADMIN_USERNAME || 'admin',
      ADMIN_PASSWORD: config.ADMIN_PASSWORD || 'password',
      JWT_SECRET: config.JWT_SECRET || 'your-secret-key-change-me',
      NOTIFYX_API_KEY: config.NOTIFYX_API_KEY || '',
      WXPUSHER_APP_TOKEN: config.WXPUSHER_APP_TOKEN || '',
      WXPUSHER_UID: config.WXPUSHER_UID || '',
      WXPUSHER_TOPIC_ID: config.WXPUSHER_TOPIC_ID || '',
      TG_BOT_TOKEN: config.TG_BOT_TOKEN || '',
      TG_CHAT_ID: config.TG_CHAT_ID || '',
      RESEND_API_KEY: config.RESEND_API_KEY || '',
      SENDER_EMAIL: config.SENDER_EMAIL || '',
      SENDER_NAME: config.SENDER_NAME || '事件通知系统',
      RECIPIENT_EMAIL: config.RECIPIENT_EMAIL || '',
      XIZHI_PUSH_URL: config.XIZHI_PUSH_URL || '',
      BARK_PUSH_URL: config.BARK_PUSH_URL || '',
      ENABLED_NOTIFIERS: config.ENABLED_NOTIFIERS || []
    };
  } catch (error) {
    console.error("Failed to get or parse config from KV:", error);
    return {
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'password',
      JWT_SECRET: 'your-secret-key-change-me',
      NOTIFYX_API_KEY: '',
      WXPUSHER_APP_TOKEN: '',
      WXPUSHER_UID: '',
      WXPUSHER_TOPIC_ID: '',
      TG_BOT_TOKEN: '',
      TG_CHAT_ID: '',
      RESEND_API_KEY: '',
      SENDER_EMAIL: '',
      SENDER_NAME: '事件通知系统',
      RECIPIENT_EMAIL: '',
      XIZHI_PUSH_URL: '',
      BARK_PUSH_URL: '',
      ENABLED_NOTIFIERS: []
    };
  }
}

async function generateJWT(username, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { username, iat: Math.floor(Date.now() / 1000) };
  
  const headerBase64 = btoa(JSON.stringify(header));
  const payloadBase64 = btoa(JSON.stringify(payload));
  const signatureInput = headerBase64 + '.' + payloadBase64;
  const signature = await CryptoJS.HmacSHA256(signatureInput, secret);
  
  return headerBase64 + '.' + payloadBase64 + '.' + signature;
}

async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerBase64, payloadBase64, signature] = parts;
    const signatureInput = headerBase64 + '.' + payloadBase64;
    const expectedSignature = await CryptoJS.HmacSHA256(signatureInput, secret);
    
    if (signature !== expectedSignature) return null;
    
    return JSON.parse(atob(payloadBase64));
  } catch (error) {
    return null;
  }
}

async function getAllSubscriptions(env) {
  try {
    const data = await env.SUBSCRIPTIONS_KV.get('subscriptions');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get or parse subscriptions from KV:", error);
    return [];
  }
}

async function getSubscription(id, env) {
  const subscriptions = await getAllSubscriptions(env);
  return subscriptions.find(s => s.id === id);
}

async function createSubscription(subscription, env) {
  try {
    let subscriptions = await getAllSubscriptions(env);
    if (!subscription.name || !subscription.expiryDate) {
      return { success: false, message: '缺少必填字段' };
    }
    
    const newSubscription = {
      id: Date.now().toString(),
      name: subscription.name,
      customType: subscription.customType || '',
      startDate: subscription.startDate || null,
      expiryDate: subscription.expiryDate,
      periodValue: parseInt(subscription.periodValue) || 1,
      periodUnit: subscription.periodUnit || 'month',
      notes: subscription.notes || '',
      isActive: true,
      autoRenew: subscription.autoRenew !== false,
      customNotifyTimes: subscription.customNotifyTimes || [],
      sentCustomNotifications: [],
      createdAt: new Date().toISOString()
    };
    subscriptions.push(newSubscription);
    
    await env.SUBSCRIPTIONS_KV.put('subscriptions', JSON.stringify(subscriptions));
    
    return { success: true, subscription: newSubscription };
  } catch (error) {
    console.error("创建事件失败:", error);
    return { success: false, message: '创建事件失败: ' + error.message };
  }
}

async function updateSubscription(id, subscription, env) {
  try {
    let subscriptions = await getAllSubscriptions(env);
    const index = subscriptions.findIndex(s => s.id === id);
    
    if (index === -1) return { success: false, message: '事件不存在' };
    if (!subscription.name || !subscription.expiryDate) return { success: false, message: '缺少必填字段' };
    
    const existingSub = subscriptions[index];
    const updatedSub = {
      ...existingSub,
      ...subscription,
      autoRenew: subscription.autoRenew !== false,
      customNotifyTimes: subscription.customNotifyTimes || [],
      updatedAt: new Date().toISOString()
    };
    if (new Date(updatedSub.expiryDate) > new Date()) {
        delete updatedSub.expiredNotificationSent;
        delete updatedSub.sentCustomNotifications;
        // 重置自定义通知发送记录
    }
    
    subscriptions[index] = updatedSub;

    await env.SUBSCRIPTIONS_KV.put('subscriptions', JSON.stringify(subscriptions));
    return { success: true, subscription: subscriptions[index] };
  } catch (error) {
    console.error("更新事件失败:", error);
    return { success: false, message: '更新事件失败: ' + error.message };
  }
}

async function deleteSubscription(id, env) {
  try {
    let subscriptions = await getAllSubscriptions(env);
    const filteredSubscriptions = subscriptions.filter(s => s.id !== id);
    
    if (filteredSubscriptions.length === subscriptions.length) {
      return { success: false, message: '事件不存在' };
    }
    
    await env.SUBSCRIPTIONS_KV.put('subscriptions', JSON.stringify(filteredSubscriptions));
    return { success: true };
  } catch (error) {
    console.error("删除事件失败:", error);
    return { success: false, message: '删除事件失败: ' + error.message };
  }
}

async function toggleSubscriptionStatus(id, isActive, env) {
  try {
    let subscriptions = await getAllSubscriptions(env);
    const index = subscriptions.findIndex(s => s.id === id);
    
    if (index === -1) return { success: false, message: '事件不存在' };
    subscriptions[index].isActive = isActive;
    subscriptions[index].updatedAt = new Date().toISOString();
    
    await env.SUBSCRIPTIONS_KV.put('subscriptions', JSON.stringify(subscriptions));
    return { success: true, subscription: subscriptions[index] };
  } catch (error) {
    console.error("更新事件状态失败:", error);
    return { success: false, message: '更新事件状态失败: ' + error.message };
  }
}

async function sendNotifyXNotification(title, content, description, config) {
  try {
    if (!config.NOTIFYX_API_KEY) {
      console.log('[NotifyX] 通知未配置');
      return false;
    }
    const url = 'https://www.notifyx.cn/api/v1/send/' + config.NOTIFYX_API_KEY;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, description: description || '' })
    });
    const result = await response.json();
    if (result.status !== 'queued') console.error('[NotifyX] 发送结果失败:', result);
    return result.status === 'queued';
  } catch (error) {
    console.error('[NotifyX] 发送通知失败:', error);
    return false;
  }
}

async function sendWXPusherNotification(title, content, config) {
  try {
    if (!config.WXPUSHER_APP_TOKEN || (!config.WXPUSHER_UID && !config.WXPUSHER_TOPIC_ID)) {
      console.error('[WXPusher] 通知未配置 (缺少 AppToken, 或 UID/TopicID 都为空)');
      return false;
    }
    const url = 'https://wxpusher.zjiecode.com/api/send/message';
    const body = {
      appToken: config.WXPUSHER_APP_TOKEN,
      content: content,
      summary: title,
      contentType: 3, // Markdown
    };
    if (config.WXPUSHER_UID) {
      body.uids = config.WXPUSHER_UID.split(',').map(uid => uid.trim()).filter(uid => uid);
    }
    if (config.WXPUSHER_TOPIC_ID) {
      body.topicIds = [config.WXPUSHER_TOPIC_ID];
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    if (result.code !== 1000) console.error('[WXPusher] 发送结果失败:', result);
    return result.code === 1000;
  } catch (error) {
    console.error('[WXPusher] 发送通知失败:', error);
    return false;
  }
}

async function sendTelegramNotification(title, content, config) {
  try {
    if (!config.TG_BOT_TOKEN || !config.TG_CHAT_ID) {
      console.log('[Telegram] 通知未配置');
      return false;
    }
    const url = `https://api.telegram.org/bot${config.TG_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.TG_CHAT_ID,
        text: content,
        parse_mode: 'Markdown'
      })
    });
    const result = await response.json();
    if (!result.ok) console.error('[Telegram] 发送结果失败:', result);
    return result.ok;
  } catch (error) {
    console.error('[Telegram] 发送通知失败:', error);
    return false;
  }
}

async function sendResendEmailNotification(title, content, config) {
    if (!config.RESEND_API_KEY || !config.SENDER_EMAIL || !config.RECIPIENT_EMAIL) {
        console.error('[Email] Resend 配置不完整');
        return false;
    }
    const senderName = config.SENDER_NAME || '事件通知系统';
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: `${senderName} <${config.SENDER_EMAIL}>`,
                to: [config.RECIPIENT_EMAIL],
                subject: title,
                html: content.replace(/\n/g, '<br>'),
            })
        });
        const data = await response.json();
        if (data.id) {
            return true;
        } else {
            console.error('[Email] Resend API 错误:', data);
            return false;
        }
    } catch (error) {
        console.error('[Email] 发送邮件失败:', error);
        return false;
    }
}


async function sendXiZhiNotification(title, content, config) {
  try {
    if (!config.XIZHI_PUSH_URL) {
        console.log('[XiZhi] 推送URL未配置');
        return false;
    }
    const url = config.XIZHI_PUSH_URL;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });
    const result = await response.json();
    if (result.code !== 200) console.error('[XiZhi] 发送结果失败:', result);
    return result.code === 200;
  } catch (error) {
    console.error('[XiZhi] 发送通知失败:', error);
    return false;
  }
}

async function sendBarkNotification(title, content, config) {
    try {
        if (!config.BARK_PUSH_URL) {
            console.log('[Bark] 推送URL未配置');
            return false;
        }
        const url = `${config.BARK_PUSH_URL.replace(/\/$/, '')}/${encodeURIComponent(title)}/${encodeURIComponent(content)}`;
        const response = await fetch(url, {
            method: 'GET',
        });
        if (response.ok) {
            console.log('[Bark] 通知发送成功');
            return true;
        } else {
            const errorText = await response.text();
            console.error(`[Bark] 发送失败: Status ${response.status}`, errorText);
            return false;
        }
    } catch (error) {
        console.error('[Bark] 发送通知时发生网络错误:', error);
        return false;
    }
}

async function sendToAllEnabledChannels(title, content, description, config) {
    const promises = [];
    if (!config.ENABLED_NOTIFIERS || config.ENABLED_NOTIFIERS.length === 0) {
        console.log("No notification channels enabled.");
        return;
    }

    if (config.ENABLED_NOTIFIERS.includes('wxpusher')) {
        const mdContent = '### ' + title + '\n\n' + content;
        promises.push(sendWXPusherNotification(title, mdContent, config));
    }
    if (config.ENABLED_NOTIFIERS.includes('xizhi')) {
        const xizhiContent = content.replace(/🚨|⚠️|📅/g, '').replace(/\*\*/g, '');
        promises.push(sendXiZhiNotification(title, xizhiContent, config));
    }
    if (config.ENABLED_NOTIFIERS.includes('notifyx')) {
        promises.push(sendNotifyXNotification(title, '## ' + title + '\n\n' + content, description, config));
    }
    if (config.ENABLED_NOTIFIERS.includes('email')) {
        promises.push(sendResendEmailNotification(title, content, config));
    }
    if (config.ENABLED_NOTIFIERS.includes('telegram')) {
        const tgContent = `*${title}*\n\n${content.replace(/\*\*/g, '*')}`;
        promises.push(sendTelegramNotification(title, tgContent, config));
    }
    if (config.ENABLED_NOTIFIERS.includes('bark')) {
        const barkContent = content.replace(/🚨|⚠️|📅/g, '').replace(/\*\*/g, '');
        promises.push(sendBarkNotification(title, barkContent, config));
    }
    
    await Promise.all(promises);
}

async function testSingleSubscriptionNotification(id, env) {
  try {
    const subscription = await getSubscription(id, env);
    if (!subscription) return { success: false, message: '未找到该事件' };
    
    const config = await getConfig(env);
    const title = '手动测试通知: ' + subscription.name;
    const description = '这是一个对事件 "' + subscription.name + '" 的手动测试通知。';
    const expiryDateBJT = new Date(subscription.expiryDate).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    let content = `**事件详情**:\n- **类型**: ${subscription.customType || '其他'}\n- **到期日**: ${expiryDateBJT}\n- **备注**: ${subscription.notes || '无'}`;
    await sendToAllEnabledChannels(title, content, description, config);
    return { success: true, message: '测试通知已发送至所有已启用的渠道' };
  } catch (error) {
    console.error('[手动测试] 发送失败:', error);
    return { success: false, message: '发送时发生错误: ' + error.message };
  }
}

async function handleScheduledTasks(env) {
  const config = await getConfig(env);
  try {
    let subscriptions = await getAllSubscriptions(env);
    const now_utc = new Date();
    
    let notificationsToSend = [];
    let hasUpdates = false;
    for (const sub of subscriptions) {
      if (sub.isActive === false) continue;
      const expiryDate = new Date(sub.expiryDate);
      
      // 自动续订逻辑
      if (expiryDate < now_utc && sub.autoRenew !== false) {
        let newExpiryDate = new Date(expiryDate);
        while (newExpiryDate < now_utc) {
          const periodValue = sub.periodValue || 1;
          if (sub.periodUnit === 'day') newExpiryDate.setDate(newExpiryDate.getDate() + periodValue);
          else if (sub.periodUnit === 'week') newExpiryDate.setDate(newExpiryDate.getDate() + periodValue * 7);
          else if (sub.periodUnit === 'month') newExpiryDate.setMonth(newExpiryDate.getMonth() + periodValue);
          else if (sub.periodUnit === 'year') newExpiryDate.setFullYear(newExpiryDate.getFullYear() + periodValue);
          else break;
        }
        sub.expiryDate = newExpiryDate.toISOString();
        delete sub.expiredNotificationSent;
        delete sub.sentCustomNotifications;
        hasUpdates = true;
      }
      
      // 过期通知逻辑
      const hasExpired = expiryDate < now_utc;
      if (hasExpired && !sub.expiredNotificationSent) {
        notificationsToSend.push({ type: '已到期', sub: { ...sub }});
        sub.expiredNotificationSent = true;
        hasUpdates = true;
      }

      // 自定义时间通知逻辑
      if (sub.customNotifyTimes && Array.isArray(sub.customNotifyTimes)) {
        sub.sentCustomNotifications = sub.sentCustomNotifications || [];
        for (const notifyTimeISO of sub.customNotifyTimes) {
            const notifyTime = new Date(notifyTimeISO);
            if (now_utc >= notifyTime && !sub.sentCustomNotifications.includes(notifyTimeISO)) {
                notificationsToSend.push({ type: '自定义提醒', sub: { ...sub }, notifyTime: notifyTimeISO });
                sub.sentCustomNotifications.push(notifyTimeISO);
                hasUpdates = true;
            }
        }
      }
    }

    if (hasUpdates) {
      await env.SUBSCRIPTIONS_KV.put('subscriptions', JSON.stringify(subscriptions));
    }

    if (notificationsToSend.length > 0) {
      const uniqueNotifications = new Map();
      notificationsToSend.forEach(item => {
          const key = item.sub.id + '_' + item.type + '_' + (item.notifyTime || '');
          if (!uniqueNotifications.has(key)) {
              uniqueNotifications.set(key, item);
          }
      });
      const content = Array.from(uniqueNotifications.values())
        .sort((a, b) => new Date(a.sub.expiryDate) - new Date(b.sub.expiryDate))
        .map(item => {
            let statusText = '';
            const expiryDateFormatted = new Date(item.sub.expiryDate).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

            if (item.type === '已到期') {
                statusText = `🚨 **${item.sub.name}** 已到期`;
            } else if (item.type === '自定义提醒') {
                statusText = `📅 **${item.sub.name}** 自定义提醒`;
            }
            
            statusText += `\n   到期日: ${expiryDateFormatted}`;
            if (item.sub.notes) statusText += `\n   备注: ${item.sub.notes}`;
 
            return statusText;
        }).join('\n\n');
      if (content) {
        const title = '事件提醒';
        await sendToAllEnabledChannels(title, content, title, config);
      }
    }
  } catch (error) {
    console.error('[定时任务] 检查事件失败:', error);
    await sendToAllEnabledChannels('事件提醒任务失败', '检查过程中发生错误: ' + error.message, '任务失败', config);
  }
}


function getCookieValue(cookieString, key) {
  if (!cookieString) return null;
  const match = cookieString.match(new RegExp('(^| )' + key + '=([^;]+)'));
  return match ? match[2] : null;
}

async function handleRequest(request, env, ctx) {
  return new Response(loginPage, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

const CryptoJS = {
  HmacSHA256: function(message, key) {
    const keyData = new TextEncoder().encode(key);
    const messageData = new TextEncoder().encode(message);
    
    return crypto.subtle.importKey(
      "raw", 
      keyData,
      { name: "HMAC", hash: {name: "SHA-256"} },
      false,
      ["sign"]
    ).then(cryptoKey => {
      return crypto.subtle.sign("HMAC", cryptoKey, messageData);
    }).then(buffer => {
      const hashArray = Array.from(new Uint8Array(buffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    });
  }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api')) {
      return api.handleRequest(request, env, ctx);
    } else if (url.pathname.startsWith('/admin')) {
      return admin.handleRequest(request, env, ctx);
    } else {
      return handleRequest(request, env, ctx);
    }
  },
  
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduledTasks(env));
  }
};