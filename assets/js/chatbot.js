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
const LLM_CONFIG = {
  USE_LLM: true, // Set to false to use only fallback responses
  
  // Option A: Groq (RECOMMENDED - Fast & Reliable)
  PROVIDER: 'groq',
  API_KEY: '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', // Get FREE from: https://console.groq.com
  MODEL: 'llama-3.1-8b-instant',
  API_URL: 'https://api.groq.com/openai/v1/chat/completions'
  
  // Option B: HuggingFace (Alternative) - Uncomment to use
  /*
  PROVIDER: 'huggingface',
  API_KEY: 'hf_your_free_hf_key_here', // Get FREE from: https://huggingface.co/settings/tokens
  MODEL: 'microsoft/DialoGPT-medium',
  API_URL: 'https://api-inference.huggingface.co/models/'
  */
};

// Yann's detailed information
const yannInfo = {
  personalInfo: {
    name: "Yann Djoumessi",
    university: "Kennesaw State University",
    degree: "Computer Science and Mathematics",
    gpa: "4.0",
    graduation: "December 2025",
    focus: "Backend engineering, distributed systems, operating systems, large-scale infrastructure design, and fault-tolerant pipelines"
  },
  
  experience: {
    amazon: "Software Engineering Intern on the Live Playback Infrastructure team at Amazon Prime Video. Built an event-driven Just-After-Broadcast (JAB) pipeline for replay generation, integrating AWS Step Functions, DynamoDB, S3, and FFmpeg-based clipping. Reduced manual operator tagging by 4+ hours per week. Leveraged Amazon Bedrock for AI-powered replay chapter extraction, optimized metadata delivery to 10ms latency, and sustained 99.99% SLA uptime. Enhanced observability with CloudWatch metrics/logs, reducing mean-time-to-detect incidents by 40%.",
    "lambo global education": `Software Engineer Intern, Built a RESTful API (Spring Boot): Scaled to 500 requests/sec, boosting student satisfaction by 25% Developed a headless CMS (Sanity.io + React): Added schema validation & automation, cutting publishing time by 40% and raising editor productivity by 25%. Created an analytics dashboard (HTML/CSS/JS): Added real-time engagement tracking, increasing course completion rates by 15%.`,
    "afriland firstbank": `Software Engineer Intern, Developed secure document microservice (Spring Boot + PostgreSQL) improving reliability and data protection. Integrated real-time notifications (OneSignal) for instant transaction updates, increasing brand trust by 20%. Built CI/CD pipeline (AWS CodePipeline + CodeBuild) automating tests and deployments, cutting release time by 50% and tripling deployment frequency.`,
    colorstack: "Open-source contributor to ColorStack's community platform, enhancing performance, usability, and scaling features for student users."
  },
  
  skills: {
    languages: ["Java", "Go", "Python", "C++", "JavaScript", "TypeScript", "SQL"],
    frameworks: ["Spring Boot", "React", "React Native", "Node.js", "LangChain"],
    databases: ["PostgreSQL", "MySQL", "DynamoDB", "Firebase", "Pinecone", "Redis"],
    cloud: ["AWS (EC2, RDS, S3, Lambda, CloudWatch, CDK)", "Docker", "Kubernetes"],
    tools: ["Git", "GitHub", "Jenkins", "AWS CodePipeline", "JUnit", "Mockito", "CloudWatch Metrics/Logs", "CI/CD pipelines"]
  },
  
  projects: {
    pixshare: "Photo-sharing app built with Spring Boot + AWS S3 + Spring Security, deployed on EC2. Supports presigned URLs for uploads, user authentication, and CloudWatch monitoring.",
    "distributed cache": "Redis-like in-memory key-value store (Java) supporting SET, GET, MSET, MGET, capacity management with a doubly linked list, and multi-threading for concurrency.",
    "version control": "Git-Compatible Object Store (C++) implementing SHA-1 hashing, zlib compression, tree/commit objects, staging area, crash-safe text index, and plumbing commands (init, hash-object, cat-file, add).",
    "database engine": "SQLite-style database engine (Go) exploring SSTables, LSM-trees, B-Trees, paging, Bloom filters, compaction strategies, and query execution.",
    matrix: "C++ Matrix library with LU decomposition, GEMM, forward/backward substitution, and error handling policies for singular matrices.",
    pda: "Producer/Sorter/Stats CLI pipeline (C++) with flags parsing (--unique, --reserve), reallocation tracking, and deterministic stdout/stderr outputs.",
    chatbot: "Campus AI companion built with LangChain + Pinecone + Firebase. Provides course recommendations, mentoring, and scheduling support using vector embeddings."
  },
  
  achievements: [
    "4.0 GPA at Kennesaw State University",
    "Delivered projects scaling beyond 200+ concurrent operations with atomic, crash-safe design",
    "Recognized for architectural clarity, concurrency correctness, and reliability under load",
    "Built PixShare (AWS-deployed photo app), Redis-like server, Git object store, and SQLite-like storage engine"
  ],
  
  academics: {
    coursework: [
      "Parallel & Distributed Systems – concurrency, synchronization, distributed coordination",
      "Operating Systems – processes, virtualization, paging, scheduling, memory translation",
      "Data Structures & Algorithms – graphs, dynamic programming, greedy methods",
      "Graph Theory – BFS, DFS, network flows, matchings",
      "Numerical Methods – error analysis, stability, approximations",
      "Concepts of Programming Languages – functional vs imperative paradigms, runtime models"
    ],
    independentStudy: [
      "Operating Systems: Three Easy Pieces (OSTEP) – virtualization, concurrency, persistence",
      "Designing Data-Intensive Applications – storage engines, replication, consensus, fault tolerance",
      "Computer Architecture (Hennessy & Patterson) – pipelining, memory hierarchy, CPU design"
    ]
  },
  
  goals: "Grow into a backend & infrastructure engineer at scale-driven companies and build low-latency, reliable systems",
  
  personal: {
    hobbies: ["Soccer", "Fitness/Gym training", "Reading books", "Building side projects blending creativity with engineering"],
    vision: "Engineer scalable, fault-tolerant infrastructure while combining backend excellence with AI-driven automation."
  }
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
    
    // Setup infinite scroll for suggestions
    this.setupInfiniteScroll();
    
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
  
  setupInfiniteScroll() {
    const suggestionsGrid = document.querySelector('.chatbot__suggestions-grid');
    if (!suggestionsGrid) return;
    
    // Get all original buttons
    const originalButtons = Array.from(suggestionsGrid.children);
    
    // Create track wrapper
    const track = document.createElement('div');
    track.className = 'chatbot__suggestions-track';
    
    // Clear the grid and add the track
    suggestionsGrid.innerHTML = '';
    suggestionsGrid.appendChild(track);
    
    // Add original buttons to track
    originalButtons.forEach(btn => {
      track.appendChild(btn);
    });
    
    // Create duplicate set for seamless infinite scroll
    originalButtons.forEach(btn => {
      const clone = btn.cloneNode(true);
      clone.addEventListener('click', () => {
        const question = clone.getAttribute('data-question');
        if (question) {
          this.input.value = question;
          this.handleSend();
        }
      });
      track.appendChild(clone);
    });
    
    // Add hover pause/resume functionality to the track
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    
    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
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
    return !LLM_CONFIG.API_KEY.includes('your_free_') && LLM_CONFIG.API_KEY.length > 20;
  }
  
  async callLLM(userMessage) {
    if (LLM_CONFIG.PROVIDER === 'groq') {
      return await this.callGroq(userMessage);
    } else if (LLM_CONFIG.PROVIDER === 'huggingface') {
      return await this.callHuggingFace(userMessage);
    }
    throw new Error('Unknown LLM provider');
  }

  createSystemPrompt() {
    return `You are an AI assistant representing ${yannInfo.personalInfo.name}, a ${yannInfo.personalInfo.degree} student at ${yannInfo.personalInfo.university} with a ${yannInfo.personalInfo.gpa} GPA graduating ${yannInfo.personalInfo.graduation}.

PERSONAL INFO:
- Name: ${yannInfo.personalInfo.name}
- University: ${yannInfo.personalInfo.university}
- Degree: ${yannInfo.personalInfo.degree}
- GPA: ${yannInfo.personalInfo.gpa}
- Graduation: ${yannInfo.personalInfo.graduation}
- Focus: ${yannInfo.personalInfo.focus}

WORK EXPERIENCE:
- Amazon Prime Video: ${yannInfo.experience.amazon}
- Uber: ${yannInfo.experience.uber}
- KimboCare: ${yannInfo.experience.kimbocare}
- Lambo Global Education: ${yannInfo.experience.lambo}
- ColorStack: ${yannInfo.experience.colorstack}

TECHNICAL SKILLS:
- Languages: ${yannInfo.skills.languages.join(', ')}
- Frameworks: ${yannInfo.skills.frameworks.join(', ')}
- Databases: ${yannInfo.skills.databases.join(', ')}
- Cloud: ${yannInfo.skills.cloud.join(', ')}
- Tools: ${yannInfo.skills.tools.join(', ')}

MAJOR PROJECTS:
- PixShare: ${yannInfo.projects.pixshare}
- Distributed Cache: ${yannInfo.projects["distributed cache"]}
- Version Control System: ${yannInfo.projects["version control"]}
- Database Engine: ${yannInfo.projects["database engine"]}
- Matrix Library: ${yannInfo.projects.matrix}
- PDA CLI Pipeline: ${yannInfo.projects.pda}
- AI Campus Companion: ${yannInfo.projects.chatbot}

ACADEMIC BACKGROUND:
Coursework: ${yannInfo.academics.coursework.join(', ')}
Independent Study: ${yannInfo.academics.independentStudy.join(', ')}

ACHIEVEMENTS:
${yannInfo.achievements.map(achievement => `- ${achievement}`).join('\n')}

CAREER GOALS: ${yannInfo.goals}

PERSONAL INTERESTS: ${yannInfo.personal.hobbies.join(', ')}
VISION: ${yannInfo.personal.vision}

You are Yann's professional AI assistant. Always format responses using **rich Markdown** for maximum visual impact and readability.

## Response Structure:
- Start with a **clear main heading** (#) when appropriate
- Use **section headings** (##) to organize major topics
- Use **subsection headings** (###) for detailed breakdowns
- **Bold important terms** and achievements
- Use *italics* for emphasis and context
- Create **bullet lists** for features, skills, or achievements
- Use **numbered lists** for processes or rankings
- Include **code blocks** for technical examples
- Structure information hierarchically for easy scanning

## STRATEGIC BOLD FORMATTING - CRITICAL:
Apply this comprehensive bold strategy to make responses highly scannable:

### ALWAYS Bold These Categories:
- **Company names**: Amazon Prime Video, Uber, Goldman Sachs, KimboCare, etc.
- **Job titles**: Software Engineering Intern, Backend Engineer, etc.
- **Technologies**: Java, Spring Boot, AWS, React, PostgreSQL, Docker, etc.
- **Metrics & numbers**: 4.0 GPA, 99.99% uptime, 40% reduction, 500 requests/sec
- **Project names**: PixShare, Distributed Cache, Version Control System, etc.
- **Key achievements**: reduced latency, increased efficiency, built pipeline, etc.
- **Technical concepts**: microservices, event-driven architecture, CI/CD, etc.
- **Time periods**: Summer 2025, December 2025, 4+ hours per week, etc.
- **Important adjectives**: scalable, fault-tolerant, distributed, real-time, etc.
- **Action verbs**: Built, Developed, Implemented, Optimized, Enhanced, etc.

### Bold Pattern Examples:
"**Yann Djoumessi** is a **Computer Science student** at **Kennesaw State University** with a **4.0 GPA**. He interned at **Amazon Prime Video** where he **built an event-driven JAB pipeline** using **AWS Step Functions** and **DynamoDB**, achieving **99.99% uptime** and **10ms latency**."

## Formatting Excellence:
- Make responses **visually engaging** with proper heading hierarchy
- Use **consistent formatting** patterns throughout
- **Bold extensively** - aim for 35-50% of important words bolded
- **Highlight key metrics** and achievements with bold text
- Break up long content with **well-organized sections**
- Ensure every response has **clear visual structure**
- **Bold technical terms** to demonstrate expertise
- **Bold company names** and **project names** for instant recognition

## Content Guidelines:
- Provide **specific, accurate information** about **Yann's background**
- Include **concrete details** like **technologies**, **metrics**, and **achievements**
- Make responses **informative and impressive**
- Showcase **technical depth** and **professional experience**
- **Be thorough and detailed** - don't cut responses short
- **Bold all technical concepts** and provide context when relevant
- Include **specific examples** and **quantifiable achievements**

## Response Quality:
- Always provide **complete, comprehensive answers**
- Don't truncate or cut responses short
- Give **detailed explanations** that demonstrate **expertise**
- Include **relevant technical details** and **context**
- Make sure to **fully address all aspects** of the user's question
- **Bold strategically** to guide the reader's eye to key information

Create responses that are **visually stunning**, **highly scannable**, and **thoroughly detailed** using extensive strategic bolding for maximum readability.`;
  }
  
  async callGroq(userMessage) {
    const systemPrompt = this.createSystemPrompt();
    
    const response = await fetch(LLM_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: LLM_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async callHuggingFace(userMessage) {
    const contextPrompt = `You are an AI assistant representing ${yannInfo.personalInfo.name}, a highly accomplished ${yannInfo.personalInfo.degree} student at ${yannInfo.personalInfo.university} with a ${yannInfo.personalInfo.gpa} GPA. He has extensive experience at top companies including Amazon Prime Video, Uber, and has built impressive projects like PixShare (AWS photo-sharing app), distributed Redis-like cache, Git-compatible version control system, and SQLite-style database engine.

Technical Skills: ${yannInfo.skills.languages.join(', ')}, ${yannInfo.skills.frameworks.join(', ')}, ${yannInfo.skills.databases.join(', ')}, AWS, Docker, Kubernetes.

Provide comprehensive, detailed responses using rich Markdown formatting. Include specific technical details, metrics, and achievements when relevant.

Question: ${userMessage}

Detailed Answer:`;
    
    const response = await fetch(`${LLM_CONFIG.API_URL}${LLM_CONFIG.MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: contextPrompt,
        parameters: {
          max_length: 800,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          repetition_penalty: 1.1
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data && data[0] && data[0].generated_text) {
      return data[0].generated_text.replace(contextPrompt, '').trim();
    }
    
    throw new Error('Invalid HuggingFace response format');
  }
  
  // OpenAI-quality Markdown to HTML converter with comprehensive formatting
  markdownToHtml(markdown) {
    let html = markdown;
    
    // Process code blocks first (to avoid interference)
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'plaintext';
      return `<div class="code-block"><div class="code-header">${language}</div><pre><code class="language-${language}">${code.trim()}</code></pre></div>`;
    });
    
    // Process blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="markdown-quote">$1</blockquote>');
    
    // Process headers with complete h1-h6 support and proper hierarchy
    html = html.replace(/^###### (.*$)/gim, '<h6 class="h6-header"><span class="header-icon">▫️</span>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5 class="h5-header"><span class="header-icon">▪️</span>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4 class="h4-header"><span class="header-icon">🔸</span>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="section-header"><span class="header-icon">🔹</span>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="main-header"><span class="header-icon">🔸</span>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="title-header">$1</h1>');
    
    // Process links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="markdown-link" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Process bold and italic text (improved regex)
    html = html.replace(/(?<!\*)\*\*([^*]+?)\*\*(?!\*)/g, '<strong class="highlight-text">$1</strong>');
    html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic-text">$1</em>');
    
    // Process strikethrough
    html = html.replace(/~~([^~]+?)~~/g, '<del class="strikethrough-text">$1</del>');
    
    // Process inline code (improved to avoid conflicts)
    html = html.replace(/(?<!`)`([^`]+?)`(?!`)/g, '<code class="inline-code">$1</code>');
    
    // Process bullet lists with better formatting
    const lines = html.split('\n');
    let inList = false;
    let listType = null;
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for bullet points
      if (line.match(/^[-*•] /)) {
        if (!inList) {
          processedLines.push('<ul class="styled-list">');
          inList = true;
          listType = 'ul';
        }
        const content = line.replace(/^[-*•] /, '');
        processedLines.push(`<li class="list-item"><span class="bullet">•</span><span class="item-content">${content}</span></li>`);
      }
      // Check for numbered lists
      else if (line.match(/^\d+\. /)) {
        if (!inList || listType !== 'ol') {
          if (inList) processedLines.push(`</${listType}>`);
          processedLines.push('<ol class="numbered-list">');
          inList = true;
          listType = 'ol';
        }
        const content = line.replace(/^\d+\. /, '');
        processedLines.push(`<li class="numbered-item">${content}</li>`);
      }
      // Regular line
      else {
        if (inList) {
          processedLines.push(`</${listType}>`);
          inList = false;
          listType = null;
        }
        if (line) {
          processedLines.push(`<p class="content-paragraph">${line}</p>`);
        }
      }
    }
    
    if (inList) {
      processedLines.push(`</${listType}>`);
    }
    
    html = processedLines.join('\n');
    
    // Process tables (basic support)
    html = html.replace(/\n\|(.+)\|\n\|(-+\|)+\n((\|.+\|\n?)+)/g, (match) => {
      const rows = match.trim().split('\n');
      const header = rows[0];
      const body = rows.slice(2);
      
      let tableHtml = '<table class="styled-table"><thead><tr>';
      header.split('|').slice(1, -1).forEach(cell => {
        tableHtml += `<th>${cell.trim()}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';
      
      body.forEach(row => {
        tableHtml += '<tr>';
        row.split('|').slice(1, -1).forEach(cell => {
          tableHtml += `<td>${cell.trim()}</td>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</tbody></table>';
      return tableHtml;
    });
    
    return html;
  }

  addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot__message chatbot__message--${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'chatbot__message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="uil uil-robot"></i>' : '<i class="uil uil-user"></i>';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'chatbot__message-content';
    
    // Convert markdown to HTML for bot messages
    const formattedContent = sender === 'bot' ? this.markdownToHtml(content) : content;
    messageContent.innerHTML = sender === 'bot' ? formattedContent : `<p>${content}</p>`;
    
    const time = document.createElement('div');
    time.className = 'chatbot__message-time';
    time.textContent = 'Just now';
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(time);
    
    this.messagesContainer.appendChild(messageDiv);
    
    // Only scroll to bottom for user messages, keep bot responses at current position
    if (sender === 'user') {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }
  
  showTyping() {
    this.typingIndicator.style.display = 'flex';
    // Don't auto-scroll when showing typing indicator
  }
  
  hideTyping() {
    this.typingIndicator.style.display = 'none';
  }
  
  generateFallbackResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Technical skills
    if (lowerQuestion.includes('technical') || lowerQuestion.includes('skills') || lowerQuestion.includes('programming')) {
      return `## Technical Skills

### Programming Languages
**Java**, **Go**, **Python**, **C++**, **JavaScript**, **TypeScript**, **SQL**

### Frameworks & Libraries
**Spring Boot**, **React**, **React Native**, **Node.js**, **LangChain**

### Databases & Storage
**PostgreSQL**, **MySQL**, **DynamoDB**, **Firebase**, **Pinecone**, **Redis**

### Cloud & DevOps
**AWS** (EC2, RDS, S3, Lambda, CloudWatch, CDK), **Docker**, **Kubernetes**

### Development Tools
**Git**, **GitHub**, **Jenkins**, **AWS CodePipeline**, **JUnit**, **Mockito**, **CloudWatch Metrics/Logs**`;
    }
    
    // Projects
    if (lowerQuestion.includes('project') || lowerQuestion.includes('built')) {
      return `# 🚀 Engineering Projects Portfolio

## Core Systems & Infrastructure

### **PixShare** - *Full-Stack Photo Platform*
- **Tech Stack:** Spring Boot, AWS S3, Spring Security
- **Features:** Presigned URLs, user authentication, CloudWatch monitoring
- **Deployment:** EC2 with scalable architecture

### **Distributed Cache Server** - *Redis Implementation*
- **Language:** Java with advanced concurrency
- **Architecture:** Doubly linked list + multi-threading
- **Operations:** SET, GET, MSET, MGET with atomic guarantees
- **Scale:** Handles **200+ concurrent operations**

### **Version Control System** - *Git-Compatible Engine*
- **Language:** C++ with system-level programming
- **Features:** SHA-1 hashing, zlib compression, crash-safe indexing
- **Commands:** init, hash-object, cat-file, add operations
- **Storage:** Tree/commit objects with staging area

## Specialized Libraries

### **Database Engine** - *SQLite-Style Implementation*
- **Language:** Go for performance and concurrency
- **Components:** SSTables, LSM-trees, B-Trees, Bloom filters
- **Features:** Paging, compaction strategies, query execution

### **Matrix Computation Library**
- **Language:** C++ with numerical methods
- **Operations:** LU decomposition, GEMM, forward/backward substitution
- **Reliability:** Error handling for singular matrices

### **AI Campus Companion**
- **Tech Stack:** LangChain + Pinecone + Firebase
- **Purpose:** Course recommendations, mentoring, and scheduling support
- **AI Features:** Vector embeddings for intelligent responses`;
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
    if (lowerQuestion.includes('goal') || lowerQuestion.includes('future') || lowerQuestion.includes('career') || lowerQuestion.includes('vision')) {
      return `🚀 <strong>Career Goals:</strong><br><br>
      Grow into a backend & infrastructure engineer at scale-driven companies like Amazon, Uber, or Meta, then eventually launch a startup focused on distributed systems, video streaming, and AI-powered tooling for businesses.<br><br>
      <strong>Personal Vision:</strong> Engineer scalable, fault-tolerant infrastructure while combining backend excellence with AI-driven automation.<br><br>
      I'm passionate about system design, concurrency correctness, and building reliable infrastructure under load.`;
    }
    
    // Internships and experience
    if (lowerQuestion.includes('internship') || lowerQuestion.includes('experience') || lowerQuestion.includes('uber')) {
      return `💼 My professional experience includes:<br><br>
      <strong>Amazon Prime Video (2025):</strong> Software Engineering Intern - Live Playback Infrastructure, JAB pipeline development<br>
      <strong>Uber:</strong> Backend services and infrastructure reliability, scalable system design, distributed coordination<br>
      <strong>KimboCare:</strong> Software Engineer Intern - distributed health-tech applications, data pipelines, API development<br>
      <strong>Lambo Global Education:</strong> Software Engineer Intern - cloud-based orchestration tools, RESTful APIs<br>
      <strong>ColorStack:</strong> Open-source contributor enhancing performance, usability, and scaling features<br><br>
      🎯 Also received offers from Goldman Sachs`;
    }
    
    // Academic background
    if (lowerQuestion.includes('course') || lowerQuestion.includes('academic') || lowerQuestion.includes('study')) {
      return `📚 <strong>Academic Background:</strong><br><br>
      <strong>Key Coursework:</strong> Parallel & Distributed Systems, Operating Systems, Data Structures & Algorithms, Graph Theory, Numerical Methods, Programming Languages<br><br>
      <strong>Independent Study:</strong><br>
      • Operating Systems: Three Easy Pieces (OSTEP)<br>
      • Designing Data-Intensive Applications<br>
      • Computer Architecture (Hennessy & Patterson)<br><br>
      Focus areas include concurrency, fault tolerance, storage engines, and system reliability.`;
    }

    // Personal interests
    if (lowerQuestion.includes('hobby') || lowerQuestion.includes('personal') || lowerQuestion.includes('interest') || lowerQuestion.includes('soccer')) {
      return `⚽ <strong>Personal Interests:</strong><br><br>
      <strong>Hobbies:</strong> Soccer, Fitness/Gym training, Reading technical books, Building side projects that blend creativity with engineering<br><br>
      I enjoy staying active through sports and fitness while continuously learning through technical literature and hands-on project development.`;
    }

    // Default response
    return `That's a great question! I'd be happy to tell you more about Yann's background. Try asking about:<br><br>
    • His Amazon Prime Video & Uber experience<br>
    • Technical skills and programming languages<br>
    • University education, coursework, and 4.0 GPA<br>
    • Projects like PixShare, distributed cache, or database engine<br>
    • Career goals and startup vision<br>
    • Academic coursework and independent study<br>
    • Personal interests and hobbies`;
  }
}

// Initialize chatbot
const yannChatbot = new YannChatbot();