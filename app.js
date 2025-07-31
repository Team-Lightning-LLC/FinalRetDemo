// Converge AI - Financial Services Integration
class ConvergeAI {
  constructor() {
    this.activeChat = null;
    this.activeChatId = null;
    this.messages = {};
    this.viewMode = 'active';
    this.chatCounter = 0;
    this.chatData = {}; // Store all chat data persistently

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateBreadcrumb('Financial Intelligence > Converge Chat');
    setTimeout(() => this.showIncomingCall(), 3000);
  }

  setupEventListeners() {
    // Accept client button
    document.getElementById('accept-client-btn')?.addEventListener('click', () => this.acceptClient());
    
    // Send message
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('message-input');
    sendBtn?.addEventListener('click', () => this.sendMessage());
    input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendMessage(); });
    
    // New chat button
    document.getElementById('new-chat-btn')?.addEventListener('click', () => this.startNewChat());
    
    // Archived chat click
    document.querySelector('[data-chat-id="eleanor-chen"]')?.addEventListener('click', () => this.viewArchivedChat());
    
    // Sidebar navigation
    document.querySelectorAll('.cc-subsection').forEach(item => {
      item.addEventListener('click', () => this.handleSidebarNavigation(item));
    });
  }

  handleSidebarNavigation(item) {
    // Remove active class from all subsections
    document.querySelectorAll('.cc-subsection').forEach(sub => sub.classList.remove('active'));
    
    // Add active class to clicked item
    item.classList.add('active');
    
    const section = item.dataset.section;
    
    if (section === 'converge') {
      this.updateBreadcrumb('Financial Intelligence > Converge Chat');
      this.showConvergeInterface();
    }
  }

  showConvergeInterface() {
    // Show welcome state if no active chat
    if (!this.activeChat || this.viewMode === 'archived') {
      document.getElementById('welcome-state').style.display = 'flex';
      document.getElementById('chat-interface').style.display = 'none';
      this.viewMode = 'active';
      this.activeChat = null;
      this.activeChatId = null;
    } else {
      this.showChatInterface();
    }
  }

  updateBreadcrumb(path) {
    document.getElementById('breadcrumb').textContent = path;
  }

  showIncomingCall() {
    const banner = document.getElementById('client-banner');
    banner.style.display = 'block';
    setTimeout(() => banner.classList.add('show'), 100);
  }

  acceptClient() {
    const banner = document.getElementById('client-banner');
    banner.classList.remove('show');
    setTimeout(() => {
      banner.style.display = 'none';
      this.startJamesJacksonConsultation();
    }, 300);
  }

  startJamesJacksonConsultation() {
    this.chatCounter++;
    this.viewMode = 'active';
    
    const jamesData = {
      id: 'james-jackson',
      clientId: 'P00051',
      name: 'James Jackson',
      company: 'Texas University',
      accountType: 'UT Saver TSA 403(b)',
      age: 35,
      avatar: 'JJ',
      balance: '$127,000'
    };
    
    this.activeChat = jamesData;
    this.activeChatId = 'james-jackson';
    
    // Store chat data persistently
    this.chatData['james-jackson'] = jamesData;
    
    if (!this.messages[this.activeChatId]) {
      this.messages[this.activeChatId] = [];
    }
    
    this.showChatInterface();
    this.addToSidebar(this.activeChat);
    this.updateActiveCount();
    this.updateBreadcrumb('Financial Intelligence > Converge Chat > Active Consultation');
  }

  startNewChat() {
    this.chatCounter++;
    const chatId = `consultation-${this.chatCounter}`;
    
    this.viewMode = 'active';
    
    const newChatData = {
      id: chatId,
      clientId: `P${String(this.chatCounter + 50).padStart(5, '0')}`,
      name: 'New Client',
      company: 'Company Name',
      accountType: 'Account Type',
      age: '--',
      avatar: 'NC',
      balance: '--'
    };
    
    this.activeChat = newChatData;
    this.activeChatId = chatId;
    
    // Store chat data persistently
    this.chatData[chatId] = newChatData;
    
    this.messages[this.activeChatId] = [];
    
    this.showChatInterface();
    this.addToSidebar(this.activeChat);
    this.updateActiveCount();
    this.updateBreadcrumb('Financial Intelligence > Converge Chat > New Consultation');
  }

  showChatInterface() {
    // Hide welcome
    document.getElementById('welcome-state').style.display = 'none';
    
    // Show chat interface
    document.getElementById('chat-interface').style.display = 'flex';
    document.getElementById('input-container').style.display = 'block';
    document.getElementById('archived-notice').style.display = 'none';
    
    // Update header with current active chat data
    document.getElementById('client-name').textContent = this.activeChat.name;
    document.getElementById('client-details').textContent = `${this.activeChat.company} • ${this.activeChat.accountType}`;
    document.getElementById('header-avatar').textContent = this.activeChat.avatar;
    document.getElementById('client-id').textContent = this.activeChat.clientId;
    document.getElementById('client-age').textContent = `Age ${this.activeChat.age}`;
    
    // Clear and reload messages
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Always add context message for active chats
    if (this.viewMode === 'active') {
      this.addContextMessage();
    }
    
    // Load existing messages
    if (this.messages[this.activeChatId]) {
      this.messages[this.activeChatId].forEach(msg => this.addMessage(msg.content, msg.isUser, false));
    }
    
    document.getElementById('message-input').focus();
  }

  addToSidebar(client) {
    const chatList = document.getElementById('active-chats');
    
    // Check if item already exists
    let existingItem = document.querySelector(`[data-chat-id="${client.id}"]`);
    if (!existingItem) {
      existingItem = document.createElement('div');
      existingItem.className = 'cc-chat-item';
      existingItem.dataset.chatId = client.id;
      chatList.appendChild(existingItem);
      
      existingItem.addEventListener('click', () => {
        this.switchToChat(client.id);
      });
    }
    
    // Update content
    existingItem.innerHTML = `
      <div class="cc-chat-avatar">${client.avatar}</div>
      <div class="cc-chat-details">
        <div class="cc-chat-name">${client.name}</div>
        <div class="cc-chat-preview">Active consultation</div>
        <div class="cc-chat-status">Live</div>
      </div>
    `;
    
    // Update sidebar selection
    this.updateSidebarSelection(client.id);
  }

  switchToChat(chatId) {
    console.log('Switching to chat:', chatId);
    
    // Don't switch if already on this chat
    if (this.activeChatId === chatId && this.viewMode === 'active') {
      return;
    }
    
    // Get stored chat data
    const chatData = this.chatData[chatId];
    if (!chatData) {
      console.error('No chat data found for:', chatId);
      return;
    }
    
    // Switch to this chat
    this.activeChat = chatData;
    this.activeChatId = chatId;
    this.viewMode = 'active';
    
    console.log('Switched to chat data:', this.activeChat);
    
    this.showChatInterface();
    this.updateSidebarSelection(chatId);
    this.updateBreadcrumb('Financial Intelligence > Converge Chat > Active Consultation');
  }

  addContextMessage() {
    const contextHtml = `
      <div class="context-message">
        <div class="context-header">Client Context Synchronized</div>
        <div class="context-grid">
          <div class="context-item"><span class="label">Participant ID:</span><span class="value">${this.activeChat.clientId}</span></div>
          <div class="context-item"><span class="label">Plan Type:</span><span class="value">${this.activeChat.accountType}</span></div>
          <div class="context-item"><span class="label">Current Balance:</span><span class="value">${this.activeChat.balance}</span></div>
          <div class="context-item"><span class="label">Vesting Status:</span><span class="value">100% Vested</span></div>
        </div>
      </div>
    `;
    this.appendToChat(contextHtml);
  }

  viewArchivedChat() {
    this.viewMode = 'archived';
    this.activeChat = {
      name: 'Dr. Eleanor Chen',
      company: 'Harvard University',
      accountType: 'Harvard TDA 403(b)',
      clientId: 'P00087',
      age: 48,
      avatar: 'EC',
      balance: '$342,000'
    };
    
    // Don't store archived chat in chatData since it's read-only
    
    // Hide welcome
    document.getElementById('welcome-state').style.display = 'none';
    
    // Show chat interface in archived mode
    document.getElementById('chat-interface').style.display = 'flex';
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('archived-notice').style.display = 'block';
    
    // Update header
    document.getElementById('client-name').textContent = this.activeChat.name;
    document.getElementById('client-details').textContent = `${this.activeChat.company} • ${this.activeChat.accountType}`;
    document.getElementById('header-avatar').textContent = this.activeChat.avatar;
    document.getElementById('client-id').textContent = this.activeChat.clientId;
    document.getElementById('client-age').textContent = `Age ${this.activeChat.age}`;
    
    this.loadArchivedMessages();
    this.updateSidebarSelection('eleanor-chen');
    this.updateBreadcrumb('Financial Intelligence > Converge Chat > Archived Consultation');
  }

  loadArchivedMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Context message for archived
    const contextHtml = `
      <div class="context-message archived">
        <div class="context-header">Archived Consultation - ${new Date().toLocaleDateString()}</div>
        <div class="context-grid">
          <div class="context-item"><span class="label">Participant:</span><span class="value">${this.activeChat.name}</span></div>
          <div class="context-item"><span class="label">Balance:</span><span class="value">${this.activeChat.balance}</span></div>
          <div class="context-item"><span class="label">Outcome:</span><span class="value">Loan inquiry resolved</span></div>
          <div class="context-item"><span class="label">Duration:</span><span class="value">24 minutes</span></div>
        </div>
      </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', contextHtml);
    
    // Archived messages with proper formatting
    const archivedMessages = [
      {
        content: "I'm looking to borrow from my 403(b) account. What are my options?",
        isUser: true,
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        content: `
          <div class="ai-response">
            <div class="response-header">
              <strong>Answer</strong>
            </div>
            <p>Dr. Chen, based on your Harvard TDA - 403(b) plan, you can borrow a <strong>minimum of $1,000 up to a maximum of 50% of your account balance, not to exceed $50,000</strong>. The $50,000 limit would be reduced if you've had any other TDA loans outstanding in the past 12 months. You're currently showing no active loans in our system.</p>
            
            <div class="response-section">
              <div class="section-header">
                <strong>Next Steps</strong>
              </div>
              <ol>
                <li>Verify loan eligibility (must be actively employed)</li>
                <li>Determine maximum loan amount (50% of TDA accumulations, up to $50,000)</li>
                <li>Select loan type (general-purpose or residential)</li>
                <li>Complete loan application with spousal consent if married</li>
                <li>Pay applicable loan fees ($75 for general-purpose, $125 for residential)</li>
              </ol>
            </div>
            
            <div class="response-section">
              <div class="section-header">
                <strong>Reminders</strong>
              </div>
              <ul>
                <li>Maximum of two outstanding loans allowed</li>
                <li>Loan repayment period: 5 years (general) or 10 years (residential)</li>
                <li>$25 annual maintenance fee applies</li>
              </ul>
            </div>
            
            <div class="response-section">
              <div class="section-header">
                <strong>Citations</strong>
              </div>
              <ul class="citations">
                <li>Harvard University Tax-Deferred Annuity (TDA) Plan Summary Plan Description</li>
                <li>Synthetic Participant Database (P00052 - Dr. Eleanor Chen)</li>
              </ul>
            </div>
          </div>
        `,
        isUser: false,
        timestamp: new Date(Date.now() - 3300000)
      },
      {
        content: "What happens if I leave Harvard before repaying the loan?",
        isUser: true,
        timestamp: new Date(Date.now() - 3000000)
      },
      {
        content: `
          <div class="ai-response">
            <div class="response-header">
              <strong>Answer</strong>
            </div>
            <p>Upon termination of employment with Harvard University, the loan acceleration provisions of your TDA plan will be triggered. <strong>The entire outstanding balance becomes due within 90 days</strong> of your separation from service.</p>
            
            <div class="response-section">
              <div class="section-header">
                <strong>Next Steps</strong>
              </div>
              <ol>
                <li>Contact Harvard Benefits Office before separation</li>
                <li>Determine exact outstanding loan balance</li>
                <li>Arrange for full repayment within 90-day grace period</li>
                <li>Consider rollover options with new employer plan</li>
                <li>Consult tax advisor regarding potential tax implications</li>
              </ol>
            </div>
            
            <div class="response-section">
              <div class="section-header">
                <strong>Reminders</strong>
              </div>
              <ul>
                <li>Unpaid balance becomes taxable distribution</li>
                <li>10% early withdrawal penalty applies if under age 59½</li>
                <li>New employer plan may not accept loan transfers</li>
              </ul>
            </div>
            
            <div class="response-section">
              <div class="section-header">
                <strong>Citations</strong>
              </div>
              <ul class="citations">
                <li>Harvard TDA Plan Loan Policy, Section 7.5 - Termination Provisions</li>
                <li>IRS Publication 575 - Pension and Annuity Income</li>
              </ul>
            </div>
          </div>
        `,
        isUser: false,
        timestamp: new Date(Date.now() - 2700000)
      }
    ];
    
    archivedMessages.forEach(msg => {
      this.addArchivedMessage(msg.content, msg.isUser, msg.timestamp);
    });
  }

  async sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (!message || this.viewMode !== 'active') return;
    
    input.value = '';
    this.addMessage(message, true, true);
    this.showTyping();
    
    try {
      const response = await fetch('https://muinf.app.n8n.cloud/webhook-test/62377baa-ee4e-4802-9377-ccc0114a159b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message,
          participant: this.activeChat
        })
      });
      
      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();
      
      this.hideTyping();
      
      let replyText = '';
      if (typeof result === 'string') {
        replyText = result;
      } else if (result.reply) {
        replyText = result.reply;
      } else if (result.content) {
        replyText = result.content;
      } else {
        replyText = JSON.stringify(result);
      }
      
      this.addMessage(replyText, false, true);
    } catch (err) {
      console.error('Webhook error:', err);
      this.hideTyping();
      this.addMessage('Sorry, there was an error processing your request. Please try again.', false, true);
    }
  }

  addMessage(content, isUser, saveToHistory = false) {
    const messageHtml = `
      <div class="message ${isUser ? 'user-message' : 'ai-message'}">
        <div class="message-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}">${isUser ? 'FA' : 'C'}</div>
        <div class="message-content">
          <div class="message-text">${content}</div>
          <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    `;
    this.appendToChat(messageHtml);
    
    if (saveToHistory && this.activeChatId) {
      if (!this.messages[this.activeChatId]) {
        this.messages[this.activeChatId] = [];
      }
      this.messages[this.activeChatId].push({ content, isUser, timestamp: new Date() });
    }
  }

  addArchivedMessage(content, isUser, timestamp) {
    const messageHtml = `
      <div class="message ${isUser ? 'user-message' : 'ai-message'} archived">
        <div class="message-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}">${isUser ? 'EC' : 'C'}</div>
        <div class="message-content">
          <div class="message-text">${content}</div>
          <div class="message-time">${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    `;
    this.appendToChat(messageHtml);
  }

  showTyping() {
    const typingHtml = `
      <div class="typing-indicator" id="typing-indicator">
        <div class="message-avatar ai-avatar">C</div>
        <div class="typing-bubble">
          <div class="typing-dots"><span></span><span></span><span></span></div>
          <div class="typing-text">Analyzing request...</div>
        </div>
      </div>
    `;
    this.appendToChat(typingHtml);
  }

  hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }

  appendToChat(html) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.insertAdjacentHTML('beforeend', html);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  updateSidebarSelection(selectedId) {
    document.querySelectorAll('.cc-chat-item').forEach(item => item.classList.remove('active'));
    const selectedItem = document.querySelector(`[data-chat-id="${selectedId}"]`);
    if (selectedItem) selectedItem.classList.add('active');
  }

  updateActiveCount() {
    const activeChats = document.querySelectorAll('#active-chats .cc-chat-item').length;
    document.getElementById('active-count').textContent = activeChats;
    document.getElementById('ai-count').textContent = activeChats > 0 ? activeChats : '1';
  }
}

// Initialize Converge AI
document.addEventListener('DOMContentLoaded', () => {
  window.convergeAI = new ConvergeAI();
});
