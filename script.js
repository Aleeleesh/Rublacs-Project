document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HELPERS
       ===================================================== */

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);


    /* =====================================================
       1. DARK / LIGHT MODE
       ===================================================== */

    const themeButton = $("#theme-toggle-btn");

    function updateThemeButton() {
        if (!themeButton) return;

        const isLight = document.body.classList.contains("light-mode");

        themeButton.innerHTML = isLight
            ? "☀️ <span>Light</span>"
            : "🌙 <span>Dark</span>";
    }

    const savedTheme = localStorage.getItem("roblox-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }

    updateThemeButton();

    themeButton?.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const isLight =
            document.body.classList.contains("light-mode");

        localStorage.setItem(
            "roblox-theme",
            isLight ? "light" : "dark"
        );

        updateThemeButton();
    });


    /* =====================================================
       2. STREAM STATUS / TIMER / VIEWERS
       ===================================================== */

    let isLive = false;
    let viewerCount = 0;
    let secondsElapsed = 0;

    let viewerInterval = null;
    let timerInterval = null;

    const statusDot = $("#status-dot");
    const statusText = $("#status-text");
    const viewerDisplay = $("#viewer-count");
    const timerDisplay = $("#stream-timer");
    const streamButton = $("#toggle-stream-btn");

    function formatTime(seconds) {

        const hours = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, "0");

        const minutes = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0");

        const secs = (seconds % 60)
            .toString()
            .padStart(2, "0");

        return `${hours}:${minutes}:${secs}`;
    }

    function stopIntervals() {

        clearInterval(viewerInterval);
        clearInterval(timerInterval);

        viewerInterval = null;
        timerInterval = null;
    }

    function setStreamOffline() {

        statusDot?.classList.remove("status-live");
        statusDot?.classList.add("status-offline");

        if (statusText) {
            statusText.textContent = "OFFLINE";
        }

        if (streamButton) {
            streamButton.textContent = "Go Live";
        }

        if (viewerDisplay) {
            viewerDisplay.textContent = "0";
        }

        if (timerDisplay) {
            timerDisplay.textContent = "00:00:00";
        }

        stopIntervals();
    }

    function setStreamLive() {

        statusDot?.classList.remove("status-offline");
        statusDot?.classList.add("status-live");

        if (statusText) {
            statusText.textContent = "LIVE";
        }

        if (streamButton) {
            streamButton.textContent = "End Stream";
        }

        viewerCount =
            Math.floor(Math.random() * 50) + 100;

        secondsElapsed = 0;

        if (viewerDisplay) {
            viewerDisplay.textContent = viewerCount;
        }

        if (timerDisplay) {
            timerDisplay.textContent = formatTime(secondsElapsed);
        }

        viewerInterval = setInterval(() => {

            viewerCount +=
                Math.floor(Math.random() * 7) - 3;

            viewerCount = Math.max(1, viewerCount);

            if (viewerDisplay) {
                viewerDisplay.textContent = viewerCount;
            }

        }, 3000);

        timerInterval = setInterval(() => {

            secondsElapsed++;

            if (timerDisplay) {
                timerDisplay.textContent =
                    formatTime(secondsElapsed);
            }

        }, 1000);
    }

    streamButton?.addEventListener("click", () => {

        isLive = !isLive;

        if (isLive) {
            setStreamLive();
        } else {
            setStreamOffline();
        }

    });


    /* =====================================================
       3. LIKE BUTTON
       ===================================================== */

    let likes = 0;

    const likeButton = $("#like-btn");
    const likeCount = $("#like-count");

    likeButton?.addEventListener("click", () => {

        likes++;

        if (likeCount) {
            likeCount.textContent = likes;
        }

        likeButton.classList.add("liked");

        setTimeout(() => {
            likeButton.classList.remove("liked");
        }, 200);

    });


    /* =====================================================
       4. POLL
       ===================================================== */

    const pollButtons = $$(".poll-opt");
    const pollResults = $("#poll-results");

    pollButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedGame =
                button.dataset.game;

            pollButtons.forEach((btn) => {

                btn.disabled = true;

                btn.classList.remove("selected");

            });

            button.classList.add("selected");

            if (pollResults) {
                pollResults.textContent =
                    `✓ Thanks for voting! You selected ${selectedGame}.`;
            }

        });

    });


    /* =====================================================
       5. SHARE / COPY LINK
       ===================================================== */

    const copyButton = $("#copy-link-btn");
    const copyNotice = $("#copy-notice");

    copyButton?.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(
                window.location.href
            );

            if (copyNotice) {
                copyNotice.textContent =
                    "✓ Link copied to clipboard!";
            }

        } catch {

            if (copyNotice) {
                copyNotice.textContent =
                    "Copying isn't available in this browser.";
            }

        }

        setTimeout(() => {

            if (copyNotice) {
                copyNotice.textContent = "";
            }

        }, 2500);

    });


    /* =====================================================
       6. STAR RATING
       ===================================================== */

    const stars = $$(".star");
    const ratingFeedback = $("#rating-feedback");

    stars.forEach((star) => {

        star.addEventListener("click", () => {

            const rating =
                Number(star.dataset.value);

            stars.forEach((item) => {

                const value =
                    Number(item.dataset.value);

                item.classList.toggle(
                    "active",
                    value <= rating
                );

            });

            if (ratingFeedback) {

                ratingFeedback.textContent =
                    `✓ You rated this stream ${rating} out of 5 stars!`;

            }

        });

    });


    /* =====================================================
       7. LIVE CHAT
       ===================================================== */

    const chatBox = $("#chat-box");
    const chatInput = $("#chat-input");
    const sendChatButton = $("#send-chat-btn");

    function addChatMessage(user, message) {

        if (!chatBox) return;

        const messageElement =
            document.createElement("p");

        messageElement.classList.add("chat-message");

        const username =
            document.createElement("strong");

        username.textContent = `${user}: `;

        const messageText =
            document.createElement("span");

        messageText.textContent = message;

        messageElement.appendChild(username);
        messageElement.appendChild(messageText);

        chatBox.appendChild(messageElement);

        chatBox.scrollTop =
            chatBox.scrollHeight;
    }

    function sendChatMessage() {

        const message =
            chatInput?.value.trim();

        if (!message) return;

        addChatMessage("You", message);

        chatInput.value = "";
        chatInput.focus();
    }

    sendChatButton?.addEventListener(
        "click",
        sendChatMessage
    );

    chatInput?.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {
                event.preventDefault();
                sendChatMessage();
            }

        }
    );


    /* =====================================================
       8. CONTENT FILTER
       ===================================================== */

    const filterButtons = $$(".filter-btn");
    const filterItems = $$(".filter-item");

    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter =
                button.dataset.filter;

            filterItems.forEach((item) => {

                const shouldShow =
                    filter === "all" ||
                    item.classList.contains(filter);

                item.classList.toggle(
                    "hidden",
                    !shouldShow
                );

            });

        });

    });


    /* =====================================================
       9. ACTIVE NAVIGATION
       ===================================================== */

    const navLinks = $$(".nav-links a");
    const sections = $$("main section[id]");

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                navLinks.forEach((link) => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${entry.target.id}`
                    ) {
                        link.classList.add("active");
                    }

                });

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });


    /* =====================================================
       10. CLEANUP
       ===================================================== */

    window.addEventListener("beforeunload", () => {
        stopIntervals();
    });

});
