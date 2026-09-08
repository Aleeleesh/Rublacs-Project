document.addEventListener("DOMContentLoaded", () => {

    console.log("BlockLive loaded successfully");


    /* =========================
       ELEMENTS
    ========================= */

    const $ = (id) => document.getElementById(id);

    const startStreamButton = $("startStreamButton");
    const streamStatus = $("streamStatus");
    const videoLive = $("videoLive");
    const videoMessage = $("videoMessage");
    const streamTimer = $("streamTimer");

    const viewerCount = $("viewerCount");
    const statStatus = $("statStatus");
    const statViewers = $("statViewers");
    const statLikes = $("statLikes");
    const statMessages = $("statMessages");

    const likeButton = $("likeButton");
    const likeCount = $("likeCount");

    const shareButton = $("shareButton");
    const notifyButton = $("notifyButton");
    const notificationButton = $("notificationButton");

    const muteButton = $("muteButton");
    const fullscreenButton = $("fullscreenButton");

    const chatMessages = $("chatMessages");
    const chatInput = $("chatInput");
    const sendChatButton = $("sendChatButton");
    const clearChatButton = $("clearChatButton");

    const typingIndicator = $("typingIndicator");

    const pollResult = $("pollResult");

    const toastContainer = $("toastContainer");


    /* =========================
       STATE
    ========================= */

    let streamStarted = false;
    let streamSeconds = 0;
    let streamInterval = null;

    let viewers = 128;
    let likes = 42;
    let messages = 6;

    let liked = false;
    let muted = false;
    let notifications = false;


    /* =========================
       TOAST
    ========================= */

    function toast(message) {

        if (!toastContainer) return;

        const item = document.createElement("div");

        item.className = "toast";
        item.textContent = message;

        toastContainer.appendChild(item);

        setTimeout(() => {
            item.classList.add("hide");

            setTimeout(() => {
                item.remove();
            }, 250);

        }, 2200);
    }


    /* =========================
       STREAM TIMER
    ========================= */

    function formatTime(seconds) {

        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
        );
    }


    function startTimer() {

        clearInterval(streamInterval);

        streamInterval = setInterval(() => {

            streamSeconds++;

            if (streamTimer) {
                streamTimer.textContent =
                    formatTime(streamSeconds);
            }

        }, 1000);
    }


    function stopTimer() {

        clearInterval(streamInterval);
        streamInterval = null;
    }


    /* =========================
       START / END STREAM
    ========================= */

    if (startStreamButton) {

        startStreamButton.addEventListener("click", () => {

            streamStarted = !streamStarted;

            if (streamStarted) {

                startStreamButton.classList.add("streaming");

                startStreamButton.innerHTML =
                    "<span>End Stream</span>";

                streamStatus.textContent = "LIVE";
                streamStatus.classList.add("live");

                videoLive.classList.add("active");

                videoMessage.style.display = "none";

                statStatus.textContent = "Live";

                streamSeconds = 0;

                streamTimer.textContent = "00:00";

                startTimer();

                viewers = 128;

                viewerCount.textContent = viewers;
                statViewers.textContent = viewers;

                toast("Stream started");

            } else {

                startStreamButton.classList.remove("streaming");

                startStreamButton.innerHTML =
                    "<span>Start Stream</span>";

                streamStatus.textContent = "OFFLINE";
                streamStatus.classList.remove("live");

                videoLive.classList.remove("active");

                videoMessage.style.display = "flex";

                statStatus.textContent = "Offline";

                stopTimer();

                toast("Stream ended");
            }

        });

    }


    /* =========================
       LIKE
    ========================= */

    if (likeButton) {

        likeButton.addEventListener("click", () => {

            if (!liked) {

                likes++;
                liked = true;

                likeButton.innerHTML =
                    `♥ <span id="likeCount">${likes}</span>`;

                toast("Liked the stream");

            } else {

                likes--;
                liked = false;

                likeButton.innerHTML =
                    `♡ <span id="likeCount">${likes}</span>`;

                toast("Like removed");
            }

            statLikes.textContent = likes;
        });

    }


    /* =========================
       SHARE
    ========================= */

    if (shareButton) {

        shareButton.addEventListener("click", async () => {

            const shareData = {
                title: "BlockLive",
                text: "Check out the BlockLive Roblox streaming project."
            };

            try {

                if (navigator.share) {

                    await navigator.share(shareData);

                } else if (navigator.clipboard) {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    toast("Link copied");

                } else {

                    toast("Share link ready");

                }

            } catch (error) {

                if (error.name !== "AbortError") {
                    toast("Couldn't open sharing");
                }

            }

        });

    }


    /* =========================
       NOTIFICATIONS
    ========================= */

    function toggleNotifications(button) {

        notifications = !notifications;

        if (notifications) {

            button.textContent = "♧ On";
            toast("Notifications enabled");

        } else {

            button.textContent = "♧ Notify";
            toast("Notifications disabled");
        }
    }


    if (notifyButton) {

        notifyButton.addEventListener("click", () => {
            toggleNotifications(notifyButton);
        });

    }


    if (notificationButton) {

        notificationButton.addEventListener("click", () => {

            notifications = !notifications;

            toast(
                notifications
                    ? "Notifications enabled"
                    : "Notifications disabled"
            );

        });

    }


    /* =========================
       MUTE
    ========================= */

    if (muteButton) {

        muteButton.addEventListener("click", () => {

            muted = !muted;

            muteButton.textContent =
                muted ? "🔇" : "🔊";

            toast(
                muted
                    ? "Audio muted"
                    : "Audio unmuted"
            );

        });

    }


    /* =========================
       FULLSCREEN
    ========================= */

    if (fullscreenButton) {

        fullscreenButton.addEventListener("click", () => {

            const video = document.querySelector(".video");

            if (!video) return;

            if (!document.fullscreenElement) {

                if (video.requestFullscreen) {
                    video.requestFullscreen();
                }

            } else {

                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }

            }

        });

    }


    /* =========================
       CHAT
    ========================= */

    function sendMessage() {

        if (!chatInput || !chatMessages) return;

        const text = chatInput.value.trim();

        if (!text) return;

        const message = document.createElement("div");

        message.className =
            "chat-message human-message";

        message.innerHTML = `
            <div class="chat-avatar">A</div>

            <div>
                <div class="chat-name">
                    Ash
                    <span class="role">LEADER</span>
                </div>

                <p></p>
            </div>
        `;

        message.querySelector("p").textContent = text;

        chatMessages.appendChild(message);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

        chatInput.value = "";

        messages++;

        statMessages.textContent = messages;

        toast("Message sent");

        botReply();
    }


    if (sendChatButton) {
        sendChatButton.addEventListener(
            "click",
            sendMessage
        );
    }


    if (chatInput) {

        chatInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();
            }

        });

    }


    /* =========================
       BOT REPLY
    ========================= */

    function botReply() {

        if (typingIndicator) {
            typingIndicator.style.display = "block";
        }

        setTimeout(() => {

            if (typingIndicator) {
                typingIndicator.style.display = "none";
            }

            const replies = [
                ["drossog", "tuff"],
                ["frenchfries", "rating this a 6.7"],
                ["jaymat1210", "I'm the goat"],
                ["scrappy", "this stream is cooking"]
            ];

            const reply =
                replies[Math.floor(Math.random() * replies.length)];

            const name = reply[0];
            const text = reply[1];

            const message = document.createElement("div");

            message.className =
                "chat-message bot-message";

            message.innerHTML = `
                <div class="chat-avatar bot">
                    ${name.charAt(0).toUpperCase()}
                </div>

                <div>
                    <div class="chat-name">
                        ${name}
                        <span class="role bot-role">BOT</span>
                    </div>

                    <p></p>
                </div>
            `;

            message.querySelector("p").textContent = text;

            chatMessages.appendChild(message);

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

            messages++;

            statMessages.textContent = messages;

        }, 900);

    }


    /* =========================
       CLEAR CHAT
    ========================= */

    if (clearChatButton) {

        clearChatButton.addEventListener("click", () => {

            chatMessages.innerHTML = "";

            messages = 0;

            statMessages.textContent = "0";

            toast("Chat cleared");

        });

    }


    /* =========================
       POLL
    ========================= */

    document.querySelectorAll(".poll-option")
        .forEach((option) => {

            option.addEventListener("click", () => {

                document
                    .querySelectorAll(".poll-option")
                    .forEach((item) => {
                        item.style.borderColor = "";
                    });

                option.style.borderColor = "#3b82f6";

                const choice =
                    option.dataset.option;

                pollResult.textContent =
                    `You voted for ${choice}.`;

                toast(`Vote submitted: ${choice}`);

            });

        });


    /* =========================
       READ MORE
    ========================= */

    document.querySelectorAll(".read-more")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const card =
                    button.closest(".content-card");

                if (!card) return;

                const expanded =
                    card.classList.toggle("expanded");

                button.innerHTML =
                    expanded
                        ? `Read less <span>−</span>`
                        : `Read more <span>+</span>`;

            });

        });


    /* =========================
       SCROLL BUTTONS
    ========================= */

    document.querySelectorAll("[data-scroll]")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const target =
                    document.querySelector(
                        button.dataset.scroll
                    );

                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            });

        });


    /* =========================
       NAVIGATION
    ========================= */

    document.querySelectorAll(".nav-link")
        .forEach((link) => {

            link.addEventListener("click", () => {

                document
                    .querySelectorAll(".nav-link")
                    .forEach((item) => {
                        item.classList.remove("active");
                    });

                link.classList.add("active");

            });

        });


    /* =========================
       VIEWER SIMULATION
    ========================= */

    setInterval(() => {

        if (!streamStarted) return;

        const change =
            Math.random() > 0.5 ? 1 : -1;

        viewers = Math.max(
            1,
            viewers + change
        );

        viewerCount.textContent = viewers;
        statViewers.textContent = viewers;

    }, 5000);


    /* =========================
       FINAL CHECK
    ========================= */

    console.log(
        "BlockLive interactive controls ready."
    );

});
