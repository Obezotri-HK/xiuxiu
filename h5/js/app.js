// ============================================
// 绣绣AI H5版本
// ============================================

// ============================================
// 后端API配置 - 请修改为你的后端地址
// ============================================
const API_BASE_URL = 'https://your-api-domain.com/api';
const API_KEY = 'your-api-key';

// ============================================
// 全局状态
// ============================================
const state = {
  currentPage: 'login',
  isLoggedIn: false,
  isGuest: false,
  userInfo: {},
  remainingCount: 50,
  conversationId: '',
  messageList: [],
  msgIdCounter: 0,
  isLoading: false,
  codeCountdown: 0,
  currentCode: '',
  currentTab: 'phone'
};

// ============================================
// 工具函数
// ============================================
function showToast(message, duration = 2000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

function showModal(title, content, onConfirm) {
  let mask = document.querySelector('.modal-mask');
  if (!mask) {
    mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.innerHTML = `
      <div class="modal">
        <div class="modal-title"></div>
        <div class="modal-content"></div>
        <div class="modal-btns">
          <button class="modal-btn cancel">取消</button>
          <button class="modal-btn primary confirm">确定</button>
        </div>
      </div>
    `;
    document.body.appendChild(mask);
  }
  
  mask.querySelector('.modal-title').textContent = title;
  mask.querySelector('.modal-content').textContent = content;
  mask.classList.add('show');
  
  const cancelBtn = mask.querySelector('.cancel');
  const confirmBtn = mask.querySelector('.confirm');
  
  const closeModal = () => {
    mask.classList.remove('show');
    cancelBtn.removeEventListener('click', closeModal);
    confirmBtn.removeEventListener('click', handleConfirm);
  };
  
  const handleConfirm = () => {
    closeModal();
    if (onConfirm) onConfirm();
  };
  
  cancelBtn.addEventListener('click', closeModal);
  confirmBtn.addEventListener('click', handleConfirm);
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, defaultValue = null) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}

// ============================================
// 页面路由
// ============================================
function navigateTo(pageName) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById('page-' + pageName).classList.add('active');
  state.currentPage = pageName;
}

function initConversation() {
  let conversationId = getFromStorage('conversationId');
  if (!conversationId) {
    conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    saveToStorage('conversationId', conversationId);
  }
  state.conversationId = conversationId;
}

// ============================================
// 登录相关
// ============================================
function initLoginPage() {
  // Tab切换
  document.querySelectorAll('.login-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });

  // 发送验证码
  document.getElementById('sendCodeBtn').addEventListener('click', sendCode);

  // 手机号登录
  document.getElementById('phoneLoginBtn').addEventListener('click', phoneLogin);

  // 微信登录
  document.getElementById('wechatLoginBtn').addEventListener('click', wechatLogin);

  // 游客登录
  document.getElementById('guestLoginBtn').addEventListener('click', guestLogin);

  // 用户协议链接
  document.querySelectorAll('.link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateTo(page);
    });
  });

  // 返回按钮
  document.getElementById('backFromAgreement').addEventListener('click', () => {
    navigateTo('login');
  });
  document.getElementById('backFromPrivacy').addEventListener('click', () => {
    navigateTo('login');
  });
}

function switchTab(tabName) {
  state.currentTab = tabName;
  
  document.querySelectorAll('.login-tabs .tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  
  document.querySelectorAll('.login-form').forEach(form => {
    form.classList.remove('active');
  });
  document.querySelector('.' + tabName + '-form').classList.add('active');
}

function sendCode() {
  if (state.codeCountdown > 0) return;
  
  const phone = document.getElementById('phoneInput').value.trim();
  
  if (!phone) {
    showToast('请输入手机号');
    return;
  }
  
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    showToast('请输入正确的手机号');
    return;
  }
  
  const agreeCheck = document.getElementById('agreeCheck');
  if (!agreeCheck.checked) {
    showToast('请先阅读并同意用户协议和隐私政策');
    return;
  }

  // 生成6位验证码（模拟）
  state.currentCode = Math.floor(100000 + Math.random() * 900000).toString();
  showToast('验证码已发送：' + state.currentCode, 3000);

  // 60秒倒计时
  state.codeCountdown = 60;
  const btn = document.getElementById('sendCodeBtn');
  btn.disabled = true;
  btn.textContent = `${state.codeCountdown}s后重发`;
  
  const timer = setInterval(() => {
    state.codeCountdown--;
    if (state.codeCountdown <= 0) {
      clearInterval(timer);
      btn.disabled = false;
      btn.textContent = '获取验证码';
    } else {
      btn.textContent = `${state.codeCountdown}s后重发`;
    }
  }, 1000);
}

function phoneLogin() {
  const phone = document.getElementById('phoneInput').value.trim();
  const code = document.getElementById('codeInput').value.trim();
  const agreeCheck = document.getElementById('agreeCheck');

  if (!agreeCheck.checked) {
    showToast('请先阅读并同意用户协议和隐私政策');
    return;
  }

  if (!phone) {
    showToast('请输入手机号');
    return;
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    showToast('请输入正确的手机号');
    return;
  }

  if (!code) {
    showToast('请输入验证码');
    return;
  }

  if (code !== state.currentCode) {
    showToast('验证码错误');
    return;
  }

  // 登录成功
  const userInfo = {
    phone: phone,
    nickname: '微信用户',
    avatar: '',
    vip: true,
    vipExpire: '2026-12-31'
  };

  saveToStorage('userInfo', userInfo);
  saveToStorage('isLoggedIn', true);
  saveToStorage('isGuest', false);
  saveToStorage('remainingCount', 9999);

  state.userInfo = userInfo;
  state.isLoggedIn = true;
  state.isGuest = false;

  showToast('登录成功');
  setTimeout(() => {
    enterChat();
  }, 800);
}

function wechatLogin() {
  const agreeCheck = document.getElementById('agreeCheck');
  
  if (!agreeCheck.checked) {
    showToast('请先阅读并同意用户协议和隐私政策');
    return;
  }

  // 模拟微信登录
  showToast('微信授权中...');

  setTimeout(() => {
    const userInfo = {
      phone: '138****8888',
      nickname: '微信用户',
      avatar: '',
      vip: true,
      vipExpire: '2026-12-31'
    };

    saveToStorage('userInfo', userInfo);
    saveToStorage('isLoggedIn', true);
    saveToStorage('isGuest', false);
    saveToStorage('remainingCount', 9999);

    state.userInfo = userInfo;
    state.isLoggedIn = true;
    state.isGuest = false;

    showToast('登录成功');
    setTimeout(() => {
      enterChat();
    }, 800);
  }, 1500);
}

function guestLogin() {
  const agreeCheck = document.getElementById('agreeCheck');
  
  if (!agreeCheck.checked) {
    showToast('请先阅读并同意用户协议和隐私政策');
    return;
  }

  const guestInfo = {
    nickname: '游客',
    avatar: '',
    vip: false
  };

  saveToStorage('userInfo', guestInfo);
  saveToStorage('isGuest', true);
  saveToStorage('isLoggedIn', false);
  saveToStorage('remainingCount', 50);

  state.userInfo = guestInfo;
  state.isGuest = true;
  state.remainingCount = 50;

  showToast('游客登录成功');
  setTimeout(() => {
    enterChat();
  }, 600);
}

// ============================================
// 对话相关
// ============================================
function enterChat() {
  initConversation();
  state.messageList = [];
  state.msgIdCounter = 0;
  state.isLoading = false;
  renderMessages();
  navigateTo('chat');
}

function initChatPage() {
  const inputField = document.getElementById('inputField');
  const sendBtn = document.getElementById('sendBtn');
  const charCount = document.getElementById('charCount');

  // 输入监听
  inputField.addEventListener('input', () => {
    const value = inputField.value;
    charCount.textContent = value.length + '/2000';
    
    if (value.trim()) {
      sendBtn.classList.add('active');
    } else {
      sendBtn.classList.remove('active');
    }

    // 自适应高度
    inputField.style.height = 'auto';
    inputField.style.height = Math.min(inputField.scrollHeight, 120) + 'px';
  });

  // 发送按钮
  sendBtn.addEventListener('click', sendMessage);

  // 回车发送
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // 新对话
  document.getElementById('newChatBtn').addEventListener('click', () => {
    if (state.messageList.length === 0) return;
    
    showModal('提示', '确定要开始新对话吗？当前对话记录将被清空。', () => {
      newChat();
    });
  });

  // 快捷提示
  document.querySelectorAll('.prompt-item').forEach(item => {
    item.addEventListener('click', () => {
      const prompt = item.dataset.prompt;
      inputField.value = prompt;
      inputField.dispatchEvent(new Event('input'));
      sendMessage();
    });
  });
}

function sendMessage() {
  const inputField = document.getElementById('inputField');
  const content = inputField.value.trim();
  
  if (!content || state.isLoading) return;

  // 游客次数检查
  if (state.isGuest) {
    const remaining = getFromStorage('remainingCount', 50);
    if (remaining <= 0) {
      showToast('对话次数已用完，请登录后继续使用');
      return;
    }
    saveToStorage('remainingCount', remaining - 1);
  }

  // 添加用户消息
  const userMsgId = state.msgIdCounter + 1;
  state.msgIdCounter = userMsgId;
  
  state.messageList.push({
    id: userMsgId,
    role: 'user',
    content: content,
    timestamp: Date.now()
  });

  // 清空输入框
  inputField.value = '';
  inputField.style.height = 'auto';
  document.getElementById('charCount').textContent = '0/2000';
  document.getElementById('sendBtn').classList.remove('active');

  renderMessages();
  scrollToBottom();

  // 显示加载状态
  state.isLoading = true;
  renderMessages();
  scrollToBottom();

  // 调用AI接口
  callAIApi(content);
}

function callAIApi(userMessage) {
  // 如果后端未配置，使用模拟回复
  if (API_BASE_URL === 'https://your-api-domain.com/api') {
    mockAIReply(userMessage);
    return;
  }

  fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'X-Conversation-Id': state.conversationId
    },
    body: JSON.stringify({
      message: userMessage,
      conversation_id: state.conversationId,
      user_id: state.userInfo?.phone || 'guest'
    })
  })
  .then(res => res.json())
  .then(data => {
    const reply = data.reply || data.content || data.message || '抱歉，我没有收到回复';
    addAIMessage(reply);
  })
  .catch(err => {
    console.error('API调用失败:', err);
    addAIMessage('网络连接失败，请检查网络后重试。');
  });
}

function addAIMessage(content) {
  const aiMsgId = state.msgIdCounter + 1;
  state.msgIdCounter = aiMsgId;
  
  state.messageList.push({
    id: aiMsgId,
    role: 'ai',
    content: content,
    timestamp: Date.now()
  });

  state.isLoading = false;
  renderMessages();
  scrollToBottom();
}

function mockAIReply(userMessage) {
  setTimeout(() => {
    const replies = [
      `好的，我来帮你解答关于"${userMessage}"的问题。桂林是世界著名的风景游览城市，有着举世无双的喀斯特地貌，山青、水秀、洞奇、石美堪称桂林四绝。`,
      `感谢你的提问！关于"${userMessage}"，我可以给你一些建议。桂林的最佳旅游季节是每年的4-10月，这个时候气候宜人，风景最美。`,
      `收到！关于"${userMessage}"，我推荐你去这些地方：漓江（船游百里画廊）、象鼻山（桂林城徽）、阳朔西街（洋人街）、遇龙河（竹筏漂流）。`,
      `你好！${userMessage}是个很棒的话题。在桂林旅游，除了欣赏美景，还可以品尝地道的桂林米粉、阳朔啤酒鱼、荔浦芋扣肉等美食。`,
      `我来帮你分析一下"${userMessage}"。桂林景点众多，建议你根据天数来规划：1-2天游市区，3-5天深度游阳朔和周边。`
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    addAIMessage(randomReply);
  }, 1000 + Math.random() * 1500);
}

function renderMessages() {
  const messageList = document.getElementById('messageList');
  const emptyState = document.getElementById('emptyState');

  if (state.messageList.length === 0) {
    emptyState.style.display = 'flex';
    messageList.innerHTML = '';
    return;
  }

  emptyState.style.display = 'none';

  let html = '';
  state.messageList.forEach(msg => {
    html += `
      <div class="message-wrapper ${msg.role}">
        <div class="message-avatar">
          ${msg.role === 'user' ? '👤' : '🤖'}
        </div>
        <div class="message-content">
          <div class="message-bubble ${msg.role}">
            <span class="message-text">${escapeHtml(msg.content)}</span>
          </div>
        </div>
      </div>
    `;
  });

  if (state.isLoading) {
    html += `
      <div class="message-wrapper ai">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <div class="message-bubble ai loading">
            <div class="loading-dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
            <span class="loading-text">思考中...</span>
          </div>
        </div>
      </div>
    `;
  }

  messageList.innerHTML = html;
}

function scrollToBottom() {
  const chatMessages = document.getElementById('chatMessages');
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 50);
}

function newChat() {
  const newId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  saveToStorage('conversationId', newId);
  state.conversationId = newId;
  state.messageList = [];
  state.msgIdCounter = 0;
  state.isLoading = false;
  renderMessages();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// 初始化
// ============================================
function init() {
  // 恢复登录状态
  state.isLoggedIn = getFromStorage('isLoggedIn', false);
  state.isGuest = getFromStorage('isGuest', false);
  state.userInfo = getFromStorage('userInfo', {});
  state.remainingCount = getFromStorage('remainingCount', 50);

  initLoginPage();
  initChatPage();

  // 已登录直接进入对话
  if (state.isLoggedIn) {
    enterChat();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
