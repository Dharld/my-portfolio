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
    uber: "Worked on backend services and infrastructure reliability, focusing on scalable system design, distributed coordination, and high-availability systems.",
    kimbocare: "Software Engineer Intern contributing to distributed health-tech applications with focus on data pipelines, API development, and cloud integration.",
    lambo: "Software Engineer Intern designing and implementing cloud-based orchestration tools and building scalable web applications with RESTful APIs.",
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
    "Secured internships with Amazon Prime Video and offers from Uber, and Goldman Sachs",
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
  
  goals: "Grow into a backend & infrastructure engineer at scale-driven companies (Amazon, Uber, Meta) and eventually launch a startup focused on distributed systems, video streaming, and AI-powered tooling for businesses.",
  
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

Respond as Yann's professional AI assistant. Keep responses under 150 words, friendly but professional. Use the detailed information above to provide accurate, specific answers about Yann's background, experience, and projects.`;
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
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  async callHuggingFace(userMessage) {
    const contextPrompt = `Context: You are answering questions about ${yannInfo.personalInfo.name}, a ${yannInfo.personalInfo.degree} student at ${yannInfo.personalInfo.university} with ${yannInfo.personalInfo.gpa} GPA. He interned at Amazon Prime Video and built projects like PixShare, Redis clone, Git object store. Skills: ${yannInfo.skills.languages.slice(0, 4).join(', ')}, AWS, Spring Boot.\n\nQuestion: ${userMessage}\nAnswer:`;
    
    const response = await fetch(`${LLM_CONFIG.API_URL}${LLM_CONFIG.MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLM_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: contextPrompt,
        parameters: {
          max_length: 150,
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
      return data[0].generated_text.replace(contextPrompt, '').trim();
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
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  showTyping() {
    this.typingIndicator.style.display = 'flex';
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  hideTyping() {
    this.typingIndicator.style.display = 'none';
  }
  
  generateFallbackResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Amazon experience
    if (lowerQuestion.includes('amazon') || lowerQuestion.includes('prime video')) {
      return `At Amazon Prime Video (Summer 2025), I was a Software Engineering Intern on the Live Playback Infrastructure team:<br><br>
      🔧 Built an event-driven Just-After-Broadcast (JAB) pipeline for replay generation<br>
      ⏱️ Reduced manual operator tagging by 4+ hours per week<br>
      🤖 Used Amazon Bedrock for AI-powered automated replay chapter extraction<br>
      🚀 Achieved 10ms metadata latency and 99.99% SLA uptime<br>
      📊 Enhanced observability with CloudWatch metrics/logs, reducing mean-time-to-detect incidents by 40%<br>
      ⚡ Integrated AWS Step Functions, DynamoDB, S3, and FFmpeg-based clipping`;
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
      return `Here are some key projects I've built:<br><br>
      <strong>PixShare:</strong> Photo-sharing app with Spring Boot + AWS S3 + Spring Security, presigned URLs, CloudWatch monitoring<br>
      <strong>Distributed Cache:</strong> Redis-like key-value store (Java) with doubly linked list, multi-threading, atomic operations<br>
      <strong>Version Control System:</strong> Git-compatible object store (C++) with SHA-1 hashing, zlib compression, crash-safe indexing<br>
      <strong>Database Engine:</strong> SQLite-style engine (Go) with SSTables, LSM-trees, B-Trees, Bloom filters<br>
      <strong>Matrix Library:</strong> C++ library with LU decomposition, GEMM, error handling for singular matrices<br>
      <strong>Campus AI Companion:</strong> LangChain + Pinecone + Firebase chatbot for course recommendations and mentoring`;
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