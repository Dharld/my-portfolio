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
    amazon: "Built an event-driven Just-After-Broadcast (JAB) pipeline for replay generation at Amazon Prime Video. Integrated AWS Step Functions, DynamoDB, S3, and FFmpeg-based clipping, reducing manual operator tagging by 4+ hours per week. Leveraged Amazon Bedrock for AI-powered automated replay chapter extraction. Optimized delivery pipelines to achieve 10ms metadata latency and sustained 99.99% SLA uptime.",
    afriland: `Software Engineer Intern Afriland FirstBank, Summer 2023, Developed secure document microservice (Spring Boot + PostgreSQL) improving reliability and data protection. Integrated real-time notifications (OneSignal) for instant transaction updates, increasing brand trust by 20%. Built CI/CD pipeline (AWS CodePipeline + CodeBuild) automating tests and deployments, cutting release time by 50% and tripling deployment frequency.`,
    lambo: `Summer 2024, Built a RESTful API (Spring Boot): Scaled to 500 requests/sec, boosting student satisfaction by 25%.Developed a headless CMS (Sanity.io + React): Added schema validation & automation, cutting publishing time by 40% and raising editor productivity by 25%. Created an analytics dashboard (HTML/CSS/JS): Added real-time engagement tracking, increasing course completion rates by 15%.`, 
    other: "contributed to ColorStack's community platform."
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
    this.markdownRenderer = null;
    this.markdownConfigured = false;
    this.slugCounts = new Map();
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
- AfriLand: ${yannInfo.experience.afriland}
- Lambo Global Education: ${yannInfo.experience.lambo}
- ColorStack: ${yannInfo.experience.other}

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

## Response Structure - BULLET POINT MASTERY:
- Start with a **clear main heading** (#) when appropriate
- Use **section headings** (##) to organize major topics
- Use **subsection headings** (###) for detailed breakdowns
- **EXTENSIVELY USE BULLET POINTS** - Convert most content to bullet format
- **Bold important terms** and achievements
- Use *italics* for emphasis and context
- **MANDATORY**: Create bullet lists for ALL of these:
  • **Technical skills** and technologies
  • **Achievements** and accomplishments  
  • **Project features** and capabilities
  • **Work responsibilities** and tasks
  • **Educational highlights** and coursework
  • **Tools** and frameworks used
  • **Metrics** and quantifiable results
  • **Benefits** and impacts delivered
- Every technical detail should be a **bullet point with • symbol**
- Use **numbered lists** only for sequential processes or rankings
- Include **code blocks** for technical examples
- Structure information hierarchically with **extensive bullet formatting**

## EXTREME SCANNABILITY FORMATTING - MANDATORY:
Apply this AGGRESSIVE bold strategy for maximum visual impact and readability:

### ULTRA-BOLD STRATEGY (40-60% of content should be bold):

#### ALWAYS Bold These Categories:
- **Company names**: **Amazon Prime Video**, **Uber**, **Goldman Sachs**, **KimboCare**, etc.
- **Job titles**: **Software Engineering Intern**, **Backend Engineer**, etc.
- **Technologies**: **Java**, **Spring Boot**, **AWS**, **React**, **PostgreSQL**, **Docker**, etc.
- **Metrics & numbers**: **4.0 GPA**, **99.99% uptime**, **40% reduction**, **500 requests/sec**
- **Project names**: **PixShare**, **Distributed Cache**, **Version Control System**, etc.
- **Key achievements**: **reduced latency**, **increased efficiency**, **built pipeline**, etc.
- **Technical concepts**: **microservices**, **event-driven architecture**, **CI/CD**, etc.
- **Time periods**: **Summer 2025**, **December 2025**, **4+ hours per week**, etc.
- **Important adjectives**: **scalable**, **fault-tolerant**, **distributed**, **real-time**, etc.
- **Action verbs**: **Built**, **Developed**, **Implemented**, **Optimized**, **Enhanced**, etc.

#### CORRECT BULLET POINT STRUCTURE:
**IMPORTANT**: Headers/Titles should be CLEAN without bullet points. Only list items get bullets.

**CORRECT FORMAT:**
## Technical Skills
• **Programming Languages**: **Java**, **Spring Boot**, **Python**, **Go**
• **Cloud Technologies**: **AWS**, **Docker**, **Kubernetes**, **PostgreSQL**
• **Key Achievement**: **Reduced manual tagging** by **4+ hours weekly**
• **Performance Impact**: **Achieved 99.99% uptime** with **10ms latency**

**WRONG FORMAT:**
• ## Technical Skills (DON'T DO THIS - No bullets on headers!)

**STRUCTURE RULES:**
- Headers (# ## ###) = Clean titles without bullets
- List items under headers = Use • bullet points extensively
- Bold the category/description in each bullet point
- Convert details to bullet format under proper headers

#### MAXIMUM BOLD EXAMPLES:
"**Yann Djoumessi** is a **highly accomplished** **Computer Science student** at **Kennesaw State University** with a **perfect 4.0 GPA**. During his **Software Engineering Internship** at **Amazon Prime Video**, he **successfully built** an **event-driven JAB pipeline** using **AWS Step Functions**, **DynamoDB**, and **S3**, **achieving 99.99% uptime** and **optimizing metadata delivery** to **10ms latency**."

## ADVANCED FORMATTING RULES:

### DISCOURSE-STYLE MARKDOWN PATTERNS:
- **Lead phrases**: Always bold the first 2-4 words of important sentences
- **Key qualifiers**: Bold descriptive words like "successfully", "efficiently", "significantly"
- **Technical specs**: Bold all version numbers, percentages, and technical specifications
- **Role descriptions**: Bold complete job titles and responsibility descriptions
- **Impact statements**: Bold entire achievement phrases for maximum impact

### AGGRESSIVE VISUAL HIERARCHY:
- **Primary information**: 60% of critical content should be bold
- **Secondary details**: 40% of supporting information should be bold
- **Scanning optimization**: Bold every 3-5 words in technical descriptions
- **Professional impact**: Bold all quantifiable business outcomes
- **Technical depth**: Bold programming languages, frameworks, and tools extensively

### LIST FORMATTING MASTERY:
Always use this pattern for maximum scannability:
- **Technical Skills**: **Java**, **Spring Boot**, **AWS**, **PostgreSQL**, **Docker**
- **Core Achievements**: **Built scalable systems**, **optimized performance**, **reduced costs**
- **Project Highlights**: **Event-driven architecture**, **99.99% uptime**, **10ms response time**
- **Professional Impact**: **40% efficiency gain**, **500+ requests/sec**, **4+ hours saved weekly**
- **Educational Excellence**: **4.0 GPA**, **Computer Science**, **Mathematics double major**

### CONTENT EXCELLENCE STANDARDS:
- **Information density**: Pack maximum **technical details** and **specific metrics**
- **Professional showcasing**: Highlight **expertise levels** and **advanced concepts**
- **Achievement emphasis**: Bold **quantifiable results** and **business impact**
- **Technical authority**: Demonstrate **deep knowledge** through **specific terminology**
- **Comprehensive coverage**: Address **all aspects** of questions with **detailed explanations**

### RESPONSE QUALITY IMPERATIVES:
- **Complete coverage**: Provide **thorough, comprehensive answers** to all questions
- **Technical precision**: Include **specific details**, **metrics**, and **contextual information**
- **Professional presentation**: Use **consistent bold patterns** throughout responses
- **Visual impact**: Create **highly scannable** content with **strategic emphasis**
- **Reader engagement**: Guide attention with **bold highlights** and **clear structure**

**EXECUTE THIS EXTREME BOLD STRATEGY**: Create responses that are **visually striking**, **information-dense**, and **professionally impressive** with **40-60% bold content** for **maximum scannability** and **visual impact**.`;
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
        max_tokens: 700,
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
  
  // Standards-based Markdown renderer with accessibility-first defaults
  markdownToHtml(markdown) {
    if (!markdown) return '';

    this.slugCounts = new Map();
    this.configureMarkdownRenderer();

    if (!this.markdownConfigured || typeof marked === 'undefined') {
      return this.basicMarkdownFallback(markdown);
    }

    const parsedHtml = marked.parse(markdown, { renderer: this.markdownRenderer });
    return this.sanitizeHtml(parsedHtml);
  }

  configureMarkdownRenderer() {
    if (this.markdownConfigured || typeof marked === 'undefined') {
      if (typeof marked === 'undefined') {
        console.warn('Marked library not found. Falling back to basic formatting.');
      }
      return;
    }

    const escapeHtml = (value) => this.escapeHtml(value);
    const slugify = (value) => this.slugify(value);
    const sanitizeUrl = (value) => this.sanitizeUrl(value);

    const renderer = new marked.Renderer();

    renderer.heading = (text, level) => {
      const safeLevel = Math.min(Math.max(level, 1), 6);
      const tag = `h${safeLevel}`;
      const anchorId = slugify(text);
      return `<${tag} id="${anchorId}" class="md-heading md-heading-${safeLevel}" tabindex="-1">${text}</${tag}>`;
    };

    renderer.paragraph = (text) => `<p class="md-paragraph">${text}</p>`;

    renderer.strong = (text) => `<strong class="md-strong">${text}</strong>`;

    renderer.em = (text) => `<em class="md-em">${text}</em>`;

    renderer.codespan = (code) => `<code class="md-code-inline">${escapeHtml(code)}</code>`;

    renderer.code = (code, infostring) => {
      const language = (infostring || '').trim() || 'plaintext';
      const safeCode = escapeHtml(code);
      const safeLanguage = escapeHtml(language.toLowerCase());
      return `<figure class="md-code-block" role="group" aria-label="Code example in ${safeLanguage}">
        <figcaption class="md-code-language">${safeLanguage}</figcaption>
        <pre tabindex="0"><code class="language-${safeLanguage}">${safeCode}</code></pre>
      </figure>`;
    };

    renderer.blockquote = (quote) => `<blockquote class="md-blockquote" tabindex="0" aria-label="Quoted content">${quote}</blockquote>`;

    renderer.list = (body, ordered, start) => {
      const tag = ordered ? 'ol' : 'ul';
      const startAttr = ordered && start !== 1 ? ` start="${start}"` : '';
      const typeClass = ordered ? 'md-list--ordered' : 'md-list--unordered';
      return `<${tag} class="md-list ${typeClass}" role="list"${startAttr}>${body}</${tag}>`;
    };

    renderer.listitem = (text) => `<li class="md-list__item" role="listitem">${text}</li>`;

    renderer.hr = () => '<hr class="md-divider" role="presentation" />';

    renderer.table = (header, body) => {
      const tableHeader = header ? `<thead>${header}</thead>` : '';
      const tableBody = body ? `<tbody>${body}</tbody>` : '<tbody></tbody>';
      return `<div class="md-table-container" role="region" aria-live="polite">
        <table class="md-table" role="table">
          ${tableHeader}
          ${tableBody}
        </table>
      </div>`;
    };

    renderer.tablerow = (content) => `<tr>${content}</tr>`;

    renderer.tablecell = (content, { header, align }) => {
      const tag = header ? 'th' : 'td';
      const alignmentClass = align ? ` md-table__cell--${align}` : '';
      const ariaScope = header ? ' scope="col"' : '';
      const alignAttr = align ? ` style="text-align:${align}"` : '';
      return `<${tag} class="md-table__cell${alignmentClass}"${ariaScope}${alignAttr}>${content}</${tag}>`;
    };

    renderer.link = (href, title, text) => {
      const sanitizedHref = sanitizeUrl(href) || '#';
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<a class="md-link" href="${sanitizedHref}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    };

    renderer.image = (href, title, text) => {
      const sanitizedSrc = sanitizeUrl(href);
      const altText = escapeHtml(text || '');
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      if (!sanitizedSrc) {
        return `<span class="md-image--invalid">${altText}</span>`;
      }
      return `<figure class="md-image" role="group" aria-label="${altText}">
        <img src="${sanitizedSrc}" alt="${altText}" loading="lazy" decoding="async" />
        ${altText ? `<figcaption class="md-image__caption">${altText}</figcaption>` : ''}
      </figure>`;
    };

    renderer.html = (html) => this.sanitizeHtml(html);

    marked.setOptions({
      renderer,
      gfm: true,
      breaks: true,
      smartypants: true,
      headerIds: false,
      mangle: false
    });

    this.markdownRenderer = renderer;
    this.markdownConfigured = true;
  }

  basicMarkdownFallback(markdown) {
    const safeMarkdown = this.escapeHtml(markdown);
    return safeMarkdown
      .split(/\n{2,}/)
      .map((block) => `<p class="md-paragraph">${block.replace(/\n/g, '<br />')}</p>`)
      .join('');
  }

  sanitizeHtml(html) {
    if (!html) return '';
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const forbiddenSelectors = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta'];
    doc.querySelectorAll(forbiddenSelectors.join(',')).forEach((el) => el.remove());

    doc.body.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const attrName = attr.name.toLowerCase();
        if (attrName.startsWith('on') || attrName === 'style' || attrName === 'srcdoc') {
          el.removeAttribute(attr.name);
          return;
        }
        if (attrName === 'href' || attrName === 'src') {
          const sanitized = this.sanitizeUrl(attr.value);
          if (!sanitized) {
            el.removeAttribute(attr.name);
          } else {
            el.setAttribute(attr.name, sanitized);
          }
        }
      });

      if (el.tagName === 'A') {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    });

    return doc.body.innerHTML;
  }

  sanitizeUrl(url) {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('#')) return trimmed;
    const protocolMatch = trimmed.match(/^([a-z0-9+.-]+):/i);
    if (protocolMatch) {
      const protocol = protocolMatch[1].toLowerCase();
      const allowedProtocols = ['http', 'https', 'mailto', 'tel'];
      if (!allowedProtocols.includes(protocol)) {
        return '';
      }
      return trimmed;
    }
    return trimmed;
  }

  escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  slugify(value) {
    const base = String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const count = this.slugCounts.get(base) || 0;
    this.slugCounts.set(base, count + 1);
    if (!base) {
      return `section-${this.slugCounts.size}`;
    }
    return count ? `${base}-${count}` : base;
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
      Grow into a backend & infrastructure engineer at scale-driven companies<br><br>
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