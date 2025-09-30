/*=============== CHATBOT SECTION ===============*/
/*
🆓 FREE LLM SETUP INSTRUCTIONS:
1. Option A - Groq (RECOMMENDED - Super Fast & Reliable):
   - Go to https://console.groq.com (free signup)
   - Get your free API key
   - Replace 'gsk_your_free_groq_key_here' below with your key

2. Option B - HuggingFace (Alternative):
   - Go to https://huggingface.co/settings/tokens
   - Create a "Read" token
   - Replace the API key below

Both are 100% FREE with no credit card required!
*/

// SIMPLE & RELIABLE FREE LLM Configuration
const ENV_CONFIG = window.__CHATBOT_CONFIG__ || {};

function normalizeProxyUrl(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  if (/^localhost(:\d+)?\//i.test(trimmed)) {
    return `http://${trimmed}`;
  }
  if (/^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return `/${trimmed.replace(/^\/+/, '')}`;
}

const rawProxyUrl = ENV_CONFIG.CHATBOT_PROXY_URL || '';
const LLM_CONFIG = {
  USE_LLM: true, // Set to false to use only fallback responses
  
  // Option A: Groq (RECOMMENDED - Fast & Reliable)
  PROVIDER: 'groq',
  API_KEY: ENV_CONFIG.GROQ_API_KEY || '',
  MODEL: ENV_CONFIG.GROQ_MODEL || 'llama-3.1-8b-instant',
  API_URL: ENV_CONFIG.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions',
  PROXY_URL: normalizeProxyUrl(rawProxyUrl)
  
  // Option B: HuggingFace (Alternative) - Uncomment to use
  /*
  PROVIDER: 'huggingface',
  API_KEY: 'hf_your_free_hf_key_here', // Get FREE from: https://huggingface.co/settings/tokens
  MODEL: 'microsoft/DialoGPT-medium',
  API_URL: 'https://api-inference.huggingface.co/models/'
  */
};

LLM_CONFIG.USE_PROXY = typeof LLM_CONFIG.PROXY_URL === 'string' && LLM_CONFIG.PROXY_URL.trim().length > 0;

if (LLM_CONFIG.USE_LLM && !LLM_CONFIG.USE_PROXY && !LLM_CONFIG.API_KEY) {
  console.warn('[Chatbot] No LLM credentials detected. Add GROQ_API_KEY to your .env file or configure CHATBOT_PROXY_URL, then run "npm run generate:creds" to enable live responses.');
}

// Yann's detailed information
const yannInfo = {
  personalInfo: {
    name: "Yann Djoumessi",
    university: "Kennesaw State University",
    degree: "Computer Science and Mathematics",
    gpa: "4.0",
    graduation: "December 2025",
    focus: "Backend engineering, distributed systems, operating systems, and large-scale infrastructure design"
  },
  
  experience: {
    amazon: "Summer 2025 — Software Engineering Intern at Prime Video. Built an event-driven Just-After-Broadcast (JAB) pipeline, integrating AWS Step Functions, DynamoDB, S3, and FFmpeg. Automation cut manual replay tagging by 4+ hours weekly and held metadata latency to 10ms with 99.99% uptime.",
    lambo: "Summer 2024 — Software Engineering Intern at Lambo Global Education. Delivered a Spring Boot REST API handling 500 requests/sec, automated a Sanity.io + React CMS workflow, and launched an analytics dashboard that lifted course completion by 15%.",
    afriland: "Summer 2023 — Software Engineering Intern at Afriland FirstBank. Built a Spring Boot + PostgreSQL document microservice, wired OneSignal notifications that increased brand trust by 20%, and automated releases with AWS CodePipeline/CodeBuild to slash deployment time by 50%.",
        other: "contributed to ColorStack's community platform."
    },
    
    skills: {
    languages: ["Java", "Go", "Python", "C++", "JavaScript", "TypeScript", "SQL"],
    frameworks: ["Spring Boot", "React", "React Native", "Node.js", "LangChain"],
    databases: ["PostgreSQL", "MySQL", "DynamoDB", "Firebase", "Pinecone", "Redis"],
    cloud: ["AWS (EC2, RDS, S3, Lambda, CloudWatch, CDK)", "Docker", "Kubernetes"],
    tools: ["Git", "GitHub", "Jenkins", "AWS CodePipeline", "JUnit", "Mockito"]
  },
  
  projects: {
    pixshare: "Photo-sharing app built with Spring Boot + AWS S3 + Spring Security, deployed on EC2",
    redis: "In-memory key-value store supporting SET, GET, MSET, MGET, capacity management, and multi-threading (Java)",
    git: "Git-Compatible Object Store with SHA-1 hashing, zlib compression, tree/commit objects (C++)",
    sqlite: "Database engine studying SSTables, LSM-trees, B-Trees, paging, and query execution (Go)",
    chatbot: "AI companion for students using LangChain + Pinecone + Firebase"
  },
  
  achievements: [
    "Secured internships with Amazon Prime Video, Uber and Goldman Sachs",
    "4.0 GPA at Kennesaw State University",
    "Delivered projects scaling beyond 200+ concurrent operations",
    "Recognized for architectural clarity and system reliability"
  ],
  
  goals: "Long-term vision: grow into a backend & infrastructure engineer at scale-driven companies and launch a startup focused on distributed systems and AI-powered tooling for businesses."
};

// Chatbot functionality
class YannChatbot {
  constructor() {
    this.messagesContainer = null;
    this.input = null;
    this.sendButton = null;
    this.typingIndicator = null;
    this.init();
  }
  
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.messagesContainer = document.getElementById('chatbot-messages');
      this.input = document.getElementById('chatbot-input');
      this.sendButton = document.getElementById('chatbot-send');
      this.typingIndicator = document.getElementById('chatbot-typing');
      
      this.setupEventListeners();
    });
  }
  
  setupEventListeners() {
    // Send button click
    this.sendButton?.addEventListener('click', () => this.handleSend());
    
    // Enter key press
    this.input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSend();
      }
    });
    
    // Suggestion buttons
    document.querySelectorAll('.chatbot__suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        if (question) {
          this.input.value = question;
          this.handleSend();
        }
      });
    });
  }
  
  async handleSend() {
    const message = this.input.value.trim();
    if (!message) return;
    
    // Add user message
    this.addMessage(message, 'user');
    this.input.value = '';
    
    // Show typing indicator
    this.showTyping();
    
    let response = '';
    
    // Try LLM first if enabled and configured
    if (LLM_CONFIG.USE_LLM && this.isLLMConfigured()) {
      try {
        console.log('🤖 Trying LLM...');
        response = await this.callLLM(message);
        console.log('✅ LLM response received');
      } catch (error) {
        console.log('❌ LLM failed, using fallback:', error.message);
        response = this.generateFallbackResponse(message);
      }
    } else {
      console.log('ℹ️ Using fallback responses (LLM not configured)');
      response = this.generateFallbackResponse(message);
    }
    
    this.hideTyping();
    this.addMessage(response, 'bot');
  }
  
  isLLMConfigured() {
    const hasApiKey = typeof LLM_CONFIG.API_KEY === 'string' && LLM_CONFIG.API_KEY.trim().length > 0;
    return LLM_CONFIG.USE_PROXY || hasApiKey;
  }
  
  async callLLM(userMessage) {
    if (LLM_CONFIG.PROVIDER === 'groq') {
      return await this.callGroq(userMessage);
    } else if (LLM_CONFIG.PROVIDER === 'huggingface') {
      return await this.callHuggingFace(userMessage);
    }
    throw new Error('Unknown LLM provider');
  }
  
  async callGroq(userMessage) {
    const requestPayload = {
      model: LLM_CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant representing Yann Djoumessi, a Computer Science student at Kennesaw State University with a 4.0 GPA graduating December 2025. 

Key facts about Yann:
- Interned at Amazon Prime Video (Live Playback Infrastructure)
- Built projects: PixShare (photo-sharing app), Redis clone, Git object store, SQLite engine
- Skills: Java, Go, Python, C++, AWS, Spring Boot, distributed systems
- Goals: backend engineering at scale-driven companies, startup focused on distributed systems

Respond as Yann's professional AI assistant. Keep responses under 100 words, friendly but professional.`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 700,
      temperature: 0.7,
      top_p: 0.9
    };

    if (LLM_CONFIG.USE_PROXY) {
      const response = await fetch(LLM_CONFIG.PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: 'groq',
          ...requestPayload
        })
      });

      if (!response.ok) {
        throw new Error(`Proxy error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const messageContent = data?.choices?.[0]?.message?.content || data?.output;
      if (!messageContent) {
        throw new Error('Proxy response missing content');
      }
      return messageContent;
    }

    const response = await fetch(LLM_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async callHuggingFace(userMessage) {
    const response = await fetch(`${LLM_CONFIG.API_URL}${LLM_CONFIG.MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: userMessage,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data && data[0] && data[0].generated_text) {
      return data[0].generated_text.replace(userMessage, '').trim();
    }
    
    throw new Error('Invalid HuggingFace response format');
  }
  
  addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot__message chatbot__message--${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'chatbot__message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="uil uil-robot"></i>' : '<i class="uil uil-user"></i>';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'chatbot__message-content';
    messageContent.innerHTML = `<p>${content}</p>`;
    
    const time = document.createElement('div');
    time.className = 'chatbot__message-time';
    time.textContent = 'Just now';
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(time);
    
    this.messagesContainer.appendChild(messageDiv);
    if (sender === 'user') {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    } else if (sender === 'bot') {
      requestAnimationFrame(() => {
        messageDiv.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      });
    }
  }
  
  showTyping() {
    this.typingIndicator.style.display = 'flex';
  }
  
  hideTyping() {
    this.typingIndicator.style.display = 'none';
  }
  
  generateFallbackResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Amazon experience
    if (lowerQuestion.includes('amazon') || lowerQuestion.includes('prime video')) {
      return `At Amazon Prime Video (Summer 2025), I worked on Live Playback Infrastructure where I:<br><br>
      🔧 Built an event-driven Just-After-Broadcast (JAB) pipeline for replay generation<br>
      ⏱️ Reduced manual operator tagging by 4+ hours per week<br>
      🤖 Used Amazon Bedrock for AI-powered automated replay chapter extraction<br>
      🚀 Achieved 10ms metadata latency and 99.99% SLA uptime<br>
      📊 Enhanced observability with CloudWatch, cutting incident detection time by 40%`;
    }
    
    // Technical skills
    if (lowerQuestion.includes('technical') || lowerQuestion.includes('skills') || lowerQuestion.includes('programming')) {
      return `Here are my technical skills:<br><br>
      <strong>Languages:</strong> Java, Go, Python, C++, JavaScript, TypeScript, SQL<br>
      <strong>Frameworks:</strong> Spring Boot, React, React Native, Node.js, LangChain<br>
      <strong>Databases:</strong> PostgreSQL, MySQL, DynamoDB, Firebase, Pinecone, Redis<br>
      <strong>Cloud:</strong> AWS (EC2, RDS, S3, Lambda, CloudWatch, CDK), Docker, Kubernetes<br>
      <strong>Tools:</strong> Git, GitHub, Jenkins, AWS CodePipeline, JUnit, Mockito`;
    }
    
    // Projects
    if (lowerQuestion.includes('project') || lowerQuestion.includes('built')) {
      return `Here are some key projects I've worked on:<br><br>
      <strong>PixShare:</strong> Photo-sharing app with Spring Boot + AWS S3 + Spring Security<br>
      <strong>Redis Clone:</strong> In-memory key-value store with multi-threading support (Java)<br>
      <strong>Git Object Store:</strong> Git-compatible system with SHA-1 hashing (C++)<br>
      <strong>SQLite Clone:</strong> Database engine studying SSTables and LSM-trees (Go)<br>
      <strong>Campus Chatbot:</strong> AI companion using LangChain + Pinecone + Firebase`;
    }
    
    // Education
    if (lowerQuestion.includes('education') || lowerQuestion.includes('gpa') || lowerQuestion.includes('university')) {
      return `📚 <strong>Education Details:</strong><br><br>
      <strong>University:</strong> Kennesaw State University<br>
      <strong>Degree:</strong> Computer Science and Mathematics<br>
      <strong>GPA:</strong> 4.0<br>
      <strong>Graduation:</strong> December 2025<br><br>
      I focus on backend engineering, distributed systems, operating systems, and large-scale infrastructure design.`;
    }
    
    // Career goals
    if (lowerQuestion.includes('goal') || lowerQuestion.includes('future') || lowerQuestion.includes('career')) {
      return `🚀 My long-term vision is to grow into a backend & infrastructure engineer at scale-driven companies and eventually launch a startup focused on distributed systems and AI-powered tooling for businesses.<br><br>
      I'm passionate about system design, fault-tolerant infrastructure, and video streaming pipelines.`;
    }
    
    // Internships
    if (lowerQuestion.includes('internship') || lowerQuestion.includes('experience')) {
      return `💼 Internship timeline (2025 → 2023):<br><br>
      <strong>Amazon Prime Video — Summer 2025:</strong> Built an event-driven JAB pipeline, automated replay tagging, and held 10ms latency with AWS Step Functions, DynamoDB, S3, FFmpeg, and Bedrock.<br><br>
      <strong>Lambo Global Education — Summer 2024:</strong> Scaled a Spring Boot REST API to 500 requests/sec, automated a Sanity.io + React CMS workflow, and shipped an analytics dashboard that lifted course completion by 15%.<br><br>
      <strong>Afriland FirstBank — Summer 2023:</strong> Delivered a Spring Boot + PostgreSQL document microservice, added OneSignal notifications that increased brand trust by 20%, and automated releases with AWS CodePipeline/CodeBuild to cut deployment time by 50%.`;
    }
    
    // Default response
    return `That's a great question! I'd be happy to tell you more about Yann's background. Try asking about:<br><br>
    • His Amazon Prime Video experience<br>
    • Technical skills and programming languages<br>
    • University education and 4.0 GPA<br>
    • Projects like PixShare or Redis Clone<br>
    • Career goals and future vision<br>
    • Internship experiences`;
  }
}

// Initialize chatbot
const yannChatbot = new YannChatbot();