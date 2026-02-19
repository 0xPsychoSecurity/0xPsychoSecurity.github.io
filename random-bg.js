(async () => {
    function setCookie(name, value) {
        document.cookie = name + "=" + value + "; path=/; max-age=31536000";
    }

    function getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const response = await fetch('/16dh80a2nlj9/k4mz8n5pq2rx/videos.json?t=' + Date.now());
    const videos = await response.json();
    const videoPath = '/16dh80a2nlj9/k4mz8n5pq2rx/';

    // Check if page was refreshed
    const isRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload' ||
                      sessionStorage.getItem('pageRefreshed') === 'true';

    if (isRefresh) {
        sessionStorage.removeItem('pageRefreshed');
        return; // Skip playing video on refresh
    }

    // Mark as refreshed for next load
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('pageRefreshed', 'true');
    });

    let played = JSON.parse(getCookie('playedVideos') || '[]');
    let available = videos.filter(v => !played.includes(v));
    if (available.length === 0) {
        played = [];
        available = [...videos];
        setCookie('playedVideos', JSON.stringify(played));
    }
    let playQueue = available.sort(() => Math.random() - 0.5);
    let currentIndex = 0;

    function playNextVideo() {
        const video = document.createElement('video');
        video.src = videoPath + playQueue[currentIndex];
        video.autoplay = true;
        video.muted = true;
        video.loop = false;
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.zIndex = '-1';
        document.body.appendChild(video);

        video.addEventListener('ended', () => {
            played.push(playQueue[currentIndex]);
            setCookie('playedVideos', JSON.stringify(played));
            document.body.removeChild(video);
            currentIndex++;
            if (currentIndex >= playQueue.length) {
                played = [];
                setCookie('playedVideos', JSON.stringify(played));
                playQueue = [...videos].sort(() => Math.random() - 0.5);
                currentIndex = 0;
            }
            playNextVideo();
        });

        video.addEventListener('error', () => {
            // Skip to next on error, mark as played
            played.push(playQueue[currentIndex]);
            setCookie('playedVideos', JSON.stringify(played));
            currentIndex++;
            if (currentIndex >= playQueue.length) {
                played = [];
                setCookie('playedVideos', JSON.stringify(played));
                playQueue = [...videos].sort(() => Math.random() - 0.5);
                currentIndex = 0;
            }
            playNextVideo();
        });
    }

    playNextVideo();
})();
