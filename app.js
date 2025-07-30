// Converge AI - ClaimCenter Integration
class ConvergeAI {
  constructor() {
    this.activeChat = null;
    this.activeChatId = null;
    this.messages = {};
    this.viewMode = 'active';
    this.chatCounter = 0;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateBreadcrumb('AI Intelligence > Converge Chat');
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
      this.updateBreadcrumb('AI Intelligence > Converge Chat');
      // Show converge chat interface
    } else if (section === 'analytics') {
      this.updateBreadcrumb('AI Intelligence > Analytics');
      this.showAnalyticsDashboard();
    }
  }

  showAnalyticsDashboard() {
    // Hide chat interface and show analytics placeholder
    document.getElementById('chat-interface').style.display = 'none';
    document.getElementById('welcome-state').style.display = 'none';
    
    // Create analytics placeholder
    let analyticsDiv = document.getElementById('analytics-dashboard');
    if (!analyticsDiv) {
      analyticsDiv = document.createElement('div');
      analyticsDiv.id = 'analytics-dashboard';
      analyticsDiv.className = 'cc-analytics-dashboard';
      analyticsDiv.innerHTML = `
        <div class="cc-analytics-content">
          <h2>Retirement Analytics Dashboard</h2>
          <div class="cc-analytics-grid">
            <div class="cc-analytics-card">
              <h3>Active Consultations</h3>
              <div class="cc-metric">0</div>
            </div>
            <div class="cc-analytics-card">
              <h3>Completed This Week</h3>
              <div class="cc-metric">12</div>
            </div>
            <div class="cc-analytics-card">
              <h3>Avg Response Time</h3>
              <div class="cc-metric">2.3s</div>
            </div>
            <div class="cc-analytics-card">
              <h3>Participant Satisfaction</h3>
              <div class="cc-metric">94%</div>
            </div>
          </div>
          <div class="cc-analytics-note">
            <p>Analytics module integration in development</p>
          </div>
        </div>
      `;
      document.querySelector('.cc-main-content').appendChild(analyticsDiv);
    }
    
    analyticsDiv.style.display = 'flex';
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
    this.activeChat = {
      id: 'james-jackson',
      clientId: 'P00051',
      name: 'James Jackson',
      company: 'Texas University',
      accountType: 'UT Saver TSA 403(b)',
      age: 35,
      avatar: 'JJ',
      balance: '$127,000'
    };
    this.activeChatId = 'james-jackson';
    
    if (!this.messages[this.activeChatId]) {
      this.messages[this.activeChatId] = [];
    }
    
    this.showChatInterface();
    this.addToSidebar(this.activeChat);
    this.addContextMessage();
    this.updateActiveCount();
    this.updateBreadcrumb('AI Intelligence > Converge Chat > Active Consultation');
  }

  startNewChat() {
    this.chatCounter++;
    const chatId = `consultation-${this.chatCounter}`;
    
    this.viewMode = 'active';
    this.activeChat = {
      id: chatId,
      clientId: `P${String(this.chatCounter + 50).padStart(5, '0')}`,
      name: 'New Client',
      company: 'Company Name',
      accountType: 'Account Type',
      age: '--',
      avatar: 'NC',
      balance: '--'
    };
    this.activeChatId = chatId;
    this.messages[this.activeChatId] = [];
    
    this.showChatInterface();
    this.addToSidebar(this.activeChat);
    this.addContextMessage();
    this.updateActiveCount();
    this.updateBreadcrumb('AI Intelligence > Converge Chat > New Consultation');
  }

  showChatInterface() {
    // Hide other views
    document.getElementById('welcome-state').style.display = 'none';
    const analyticsDiv = document.getElementById('analytics-dashboard');
    if (analyticsDiv) analyticsDiv.style.display = 'none';
    
    // Show chat interface
    document.getElementById('chat-interface').style.display = 'flex';
    document.getElementById('input-container').style.display = 'block';
    document.getElementById('archived-notice').style.display = 'none';
    
    // Update header
    document.getElementById('client-name').textContent = this.activeChat.name;
    document.getElementById('client-details').textContent = `${this.activeChat.company} • ${this.activeChat.accountType}`;
    document.getElementById('header-avatar').textContent = this.activeChat.avatar;
    document.getElementById('client-id').textContent = this.activeChat.clientId;
    document.getElementById('client-age').textContent = `Age ${this.activeChat.age}`;
    
    // Clear and reload messages
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    this.messages[this.activeChatId].forEach(msg => this.addMessage(msg.content, msg.isUser, false));
    
    document.getElementById('message-input').focus();
  }

  addToSidebar(client) {
    const chatList = document.getElementById('active-chats');
    
    // Remove active class from all items
    document.querySelectorAll('.cc-chat-item').forEach(item => item.classList.remove('active'));
    
    // Check if item already exists
    let existingItem = document.querySelector(`[data-chat-id="${client.id}"]`);
    if (!existingItem) {
      existingItem = document.createElement('div');
      existingItem.className = 'cc-chat-item';
      existingItem.dataset.chatId = client.id;
      chatList.appendChild(existingItem);
      
      existingItem.addEventListener('click', () => {
        if (this.activeChatId !== client.id) {
          this.switchToChat(client.id);
        }
      });
    }
    
    existingItem.classList.add('active');
    existingItem.innerHTML = `
      <div class="cc-chat-avatar">${client.avatar}</div>
      <div class="cc-chat-details">
        <div class="cc-chat-name">${client.name}</div>
        <div class="cc-chat-preview">Active consultation</div>
        <div class="cc-chat-status">Live</div>
      </div>
    `;
  }

  switchToChat(chatId) {
    // Find the chat data (simplified for demo)
    if (chatId === 'james-jackson') {
      this.activeChat = {
        id: 'james-jackson',
        clientId: 'P00051',
        name: 'James Jackson',
        company: 'Texas University',
        accountType: 'UT Saver TSA 403(b)',
        age: 35,
        avatar: 'JJ',
        balance: '$127,000'
      };
    }
    
    this.activeChatId = chatId;
    this.viewMode = 'active';
    this.showChatInterface();
    
    // Update sidebar selection
    document.querySelectorAll('.cc-chat-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-chat-id="${chatId}"]`).classList.add('active');
    
    this.updateBreadcrumb('AI Intelligence > Converge Chat > Active Consultation');
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
    
    // Hide other views
    document.getElementById('welcome-state').style.display = 'none';
    const analyticsDiv = document.getElementById('analytics-dashboard');
    if (analyticsDiv) analyticsDiv.style.display = 'none';
    
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
    this.updateBreadcrumb('AI Intelligence > Converge Chat > Archived Consultation');
  }

  loadArchivedMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    // Context message
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
    
    // Archived messages
    const archivedMessages = [
      {
        content: "I'm looking to borrow from my 403(b) account. What are my options?",
        isUser: true,
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        content: `Based on Dr. Eleanor Chen's Harvard TDA 403(b) plan:

**Loan Eligibility**: Yes, participant loans are permitted
**Maximum Amount**: $50,000 or 50% of vested balance (whichever is less)
**Current Vested Balance**: $342,000
**Maximum Loan Available**: $50,000

**Key Requirements**:
- Minimum loan amount: $1,000
- Maximum repayment period: 5 years (extended for primary residence)
- Interest rate: Prime Rate + 1% (currently 8.5%)
- Repayment: Automated payroll deduction required

**Important Considerations**:
- Outstanding loans reduce death benefit
- Default triggers taxable distribution
- Cannot borrow if previous loan in default

*Source: Harvard University Retirement Plan Document, Article VII, Section 7.2*`,
        isUser: false,
        timestamp: new Date(Date.now() - 3300000)
      },
      {
        content: "What happens if I leave Harvard before repaying the loan?",
        isUser: true,
        timestamp: new Date(Date.now() - 3000000)
      },
      {
        content: `Upon termination of employment with Harvard University:

**Loan Acceleration**: The entire outstanding balance becomes due
**Grace Period**: 90 days to repay in full
**Default Consequences**: 
- Unpaid balance treated as taxable distribution
- Additional 10% early withdrawal penalty if under age 59½
- 1099-R issued for tax reporting

**Options Available**:
1. **Full Repayment**: Pay outstanding balance within 90 days
2. **Rollover**: Some plans accept loans - verify with new employer
3. **Continue Payments**: May be possible if plan allows (rare)

**Recommendation**: Contact Harvard Benefits Office before separation to discuss options. Consider loan timing carefully if job change is anticipated.

*Reference: Harvard TDA Plan Loan Policy, Section 7.5 - Termination Provisions*`,
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
          <div class="message-text">${this.formatContent(content)}</div>
          <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    `;
    this.appendToChat(messageHtml);
    
    if (saveToHistory && this.activeChatId) {
      this.messages[this.activeChatId].push({ content, isUser, timestamp: new Date() });
    }
  }

  addArchivedMessage(content, isUser, timestamp) {
    const messageHtml = `
      <div class="message ${isUser ? 'user-message' : 'ai-message'} archived">
        <div class="message-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}">${isUser ? 'EC' : 'C'}</div>
        <div class="message-content">
          <div class="message-text">${this.formatContent(content)}</div>
          <div class="message-time">${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    `;
    this.appendToChat(messageHtml);
  }

  formatContent(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/^- /gm, '• ');
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
