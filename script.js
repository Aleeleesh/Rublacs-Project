document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. STREAM STATUS, TIMER & VIEWER COUNTER
    // ==========================================
    let isLive = false;
    let viewerCount = 0;
    let viewerInterval = null;
    let timerInterval = null;
    let secondsElapsed = 0;

    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const countDisplay = document.getElementById("viewer-count");
    const toggleBtn = document.getElementById("toggle-stream-btn");
    const timerDisplay = document.getElementById("stream-timer");

    function formatTime(sec) {
        const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
        const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
        const secs = (sec % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    }

    toggleBtn?.addEventListener("click", () => {
        isLive = !isLive;
        
        if (isLive) {
            if (statusDot) {
                statusDot.style.background = "#22c55e"; // Green
                statusDot.className = "status-live";
            }
            if (statusText) statusText.textContent = "LIVE";
            toggleBtn.textContent = "End Stream";
            
            // Viewers logic
            viewerCount = Math.floor(Math.random() * 50) + 100;
            if (countDisplay) countDisplay.textContent = viewerCount;
            
            viewerInterval = setInterval(() => {
                viewerCount += Math.floor(Math.random() * 7) - 3;
                if (countDisplay) countDisplay.textContent = Math.max(1, viewerCount);
            }, 3000);

            // Stream Timer Uptime
            secondsElapsed = 0;
            timerInterval = setInterval(() => {
                secondsElapsed++;
                if (timerDisplay) timerDisplay.textContent = formatTime(secondsElapsed);
            }, 1000);

        } else {
            if (statusDot) {
                statusDot.style.background = "#ef4444"; // Red
                statusDot.className = "status-offline";
            }
            if (statusText) statusText.textContent = "OFFLINE";
            toggleBtn.textContent = "Go Live";
            if (countDisplay) countDisplay.textContent = "0";
            
            clearInterval(viewerInterval);
            clearInterval(timerInterval);
            if (timerDisplay) timerDisplay.textContent = "00:00:00";
        }
    });

    // ==========================================
    // 2. LIKE BUTTON WITH PERSISTENT COUNTER
    // ==========================================
    let likes = 0;
    const likeBtn = document.getElementById("like-btn");
    const likeCount = document.getElementById("like-count");

    likeBtn?.addEventListener("click", () => {
        likes++;
        if (likeCount) likeCount.textContent = likes;
        likeBtn.style.transform = "scale(1.1)";
        setTimeout(() => likeBtn.style.transform = "scale(1)", 150);
    });

    // ==========================================
    // 3. INTERACTIVE POLL SYSTEM
    // ==========================================
    const pollButtons = document.querySelectorAll(".poll-opt");
    const pollResults = document.getElementById("poll-results");

    pollButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const selectedGame = e.target.getAttribute("data-game");
            if (pollResults) pollResults.textContent = `Thanks for voting! You selected: ${selectedGame}`;
            pollButtons.forEach(b => b.disabled = true);
        });
    });

    // ==========================================
    // 4. COPY STREAM LINK BUTTON
    // ==========================================
    const copyBtn = document.getElementById("copy-link-btn");
    const copyNotice = document.getElementById("copy-notice");

    copyBtn?.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        if (copyNotice) copyNotice.textContent = "Link copied to clipboard!";
        setTimeout(() => {
            if (copyNotice) copyNotice.textContent = "";
        }, 2500);
    });

    // ==========================================
    // 5. DARK / LIGHT MODE TOGGLE
    // ==========================================
    const themeBtn = document.getElementById("theme-toggle-btn");
    themeBtn?.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        themeBtn.textContent = isLight ? "☀️ Light Mode" : "🌙 Dark Mode";
    });

    // ==========================================
    // 6. STREAM RATING SYSTEM
    // ==========================================
    const stars = document.querySelectorAll(".star");
    const ratingFeedback = document.getElementById("rating-feedback");

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            stars.forEach((s, i) => {
                s.style.color = i <= index ? "#f59e0b" : "#666";
            });
            if (ratingFeedback) {
                ratingFeedback.textContent = `You rated this stream ${index + 1} out of 5 stars!`;
            }
        });
    });

    // ==========================================
    // 7. LIVE CHAT SIMULATOR
    // ==========================================
    const chatBox = document.getElementById("chat-box");
    const chatInput = document.getElementById("chat-input");
    const sendChatBtn = document.getElementById("send-chat-btn");

    function addChatMessage(user, message) {
        if (!chatBox) return;
        const msgPara = document.createElement("p");
        msgPara.style.margin = "4px 0";
        msgPara.innerHTML = `<strong>${user}:</strong> ${message}`;
        chatBox.appendChild(msgPara);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendChatBtn?.addEventListener("click", () => {
        const text = chatInput?.value.trim();
        if (text) {
            addChatMessage("You", text);
            chatInput.value = "";
        }
    });

    // ==========================================
    // 8. CONTENT FILTER
    // ==========================================
    const filterBtns = document.querySelectorAll(".filter-btn");
    const filterItems = document.querySelectorAll(".filter-item");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");
            filterItems.forEach(item => {
                if (filterValue === "all" || item.classList.contains(filterValue)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

});