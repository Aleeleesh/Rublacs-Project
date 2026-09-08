/* =========================================================
   BLOCKLIVE
   ROBLOX STREAMING PROJECT
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const startStreamButton =
        document.getElementById("startStreamButton");

    const videoLive =
        document.getElementById("videoLive");

    const streamStatus =
        document.getElementById("streamStatus");

    const videoMessage =
        document.getElementById("videoMessage");

    const viewerCount =
        document.getElementById("viewerCount");

    const streamTimer =
        document.getElementById("streamTimer");

    const currentGame =
        document.getElementById("currentGame");

    const streamTitle =
        document.getElementById("streamTitle");

    const sidebarStatus =
        document.getElementById("sidebarStatus");

    const sidebarViewers =
        document.getElementById("sidebarViewers");

    const sidebarStatusBox =
        document.querySelector(".sidebar-stream-status");

    const chatStatus =
        document.getElementById("chatStatus");

    const chatMessages =
        document.getElementById("chatMessages");

    const chatEmpty =
        document.getElementById("chatEmpty");

    const chatInput =
        document.getElementById("chatInput");

    const sendChatButton =
        document.getElementById("sendChatButton");

    const typingIndicator =
        document.getElementById("typingIndicator");

    const likeButton =
        document.getElementById("likeButton");

    const likeCount =
        document.getElementById("likeCount");

    const shareButton =
        document.getElementById("shareButton");

    const notifyButton =
        document.getElementById("notifyButton");

    const notificationButton =
        document.getElementById("notificationButton");

    const clearChatButton =
        document.getElementById("clearChatButton");

    const muteButton =
        document.getElementById("muteButton");

    const fullscreenButton =
        document.getElementById("fullscreenButton");

    const statStatus =
        document.getElementById("statStatus");

    const statViewers =
        document.getElementById("statViewers");

    const statLikes =
        document.getElementById("statLikes");

    const statMessages =
        document.getElementById("statMessages");

    const toastContainer =
        document.getElementById("toastContainer");


    /* =====================================================
       STATE
       ===================================================== */

    let streamStarted = false;

    let streamSeconds = 0;

    let viewers = 0;

    let likes = 42;

    let messagesSent = 0;

    let muted = false;

    let liked = false;

    let notificationsEnabled = false;

    let selectedGame = "Brookhaven";

    let streamTimerInterval = null;

    let viewerInterval = null;

    let chatInterval = null;


    /* =====================================================
       PEOPLE
       ===================================================== */

    const humans = [
        "Denise",
        "Alymer",
        "Jayden",
        "Keysha",
        "Ash"
    ];


    const bots = [
        "drossog",
        "frenchfries",
        "jaymat1210",
        "scrappy"
    ];


    /* =====================================================
       BOT MESSAGES
       ===================================================== */

    const botMessages = {

        drossog: [
            "tuff",
            "okay this is actually clean",
            "nah that was crazy",
            "bro is cooking",
            "W stream",
            "that jump was questionable",
            "this game is kinda fire",
            "chat is alive today",
            "that was NOT supposed to happen 😭",
            "okay I see the vision"
        ],

        frenchfries: [
            "rating this a 6.7",
            "okay maybe 7.2 now",
            "solid stream so far",
            "the gameplay is decent",
            "im giving that one an 8",
            "chat what are we rating this",
            "honestly not bad",
            "this deserves a higher rating",
            "6.9 after that one",
            "I might have to raise the score"
        ],

        jaymat1210: [
            "I'm the goat",
            "easy",
            "I could do this first try",
            "chat knows I'm right",
            "absolute cinema",
            "W",
            "bro trust me",
            "this is peak",
            "too easy",
            "goat behavior"
        ],

        scrappy: [
            "dream of the year watch jobs minecraft",
            "any minecraft players here",
            "this is actually entertaining",
            "what game next",
            "chat is moving fast",
            "someone clip that",
            "that was funny",
            "we need another challenge",
            "okay what are we playing",
            "minecraft mentioned 🗣️"
        ]

    };


    /* =====================================================
       HUMAN MESSAGES
       ===================================================== */

    const humanMessages = {

        Denise: [
            "wait this is actually fun 😭",
            "what game are we playing next?",
            "LOL",
            "I wasn't expecting that",
            "the chat is moving so fast",
            "okay I'm invested now",
            "that was actually good",
            "can we do the obby next?",
            "bro 😭",
            "W stream"
        ],

        Alymer: [
            "yo the stream is finally up",
            "this looks clean",
            "what happened 💀",
            "nahhh",
            "I vote obby",
            "that was actually crazy",
            "chat what are we doing",
            "someone explain what just happened",
            "this is kinda fire",
            "W"
        ],

        Jayden: [
            "Roblox has way too many games bro",
            "this is why we picked Roblox",
            "the stream idea is actually working",
            "I vote simulator",
            "chat interaction is important fr",
            "that was clean",
            "we should try something harder",
            "okay that was unexpected",
            "W gameplay"
        ],

        Keysha: [
            "HELLO CHAT 👋",
            "okay everyone behave 😭",
            "what should we play next?",
            "I think the audience is gonna like this",
            "the reactions are funny",
            "this is exactly what we were talking about",
            "wait I actually like this game",
            "someone vote",
            "W chat",
            "okay that was good"
        ],

        Ash: [
            "yo chat",
            "we are actually live now",
            "this took way too long 😭",
            "okay we're cooking",
            "what should I play next?",
            "chat is already chaotic",
            "nah bro",
            "I swear that wasn't intentional",
            "W",
            "this stream is gonna be good"
        ]

    };


    /* =====================================================
       GAME MESSAGES
       ===================================================== */

    const gameMessages = {

        Brookhaven: [
            "Brookhaven time",
            "this place is huge",
            "what are we doing first?",
            "someone start a random scenario"
        ],

        "Obby Challenge": [
            "OBBY TIME",
            "this is where the stream ends 💀",
            "good luck",
            "no way you beat this first try"
        ],

        Simulator: [
            "simulator arc begins",
            "this is gonna be grindy",
            "okay let's see how far we get",
            "W choice"
        ],

        Adventure: [
            "adventure time",
            "this actually looks interesting",
            "let's explore",
            "what is over there?"
        ]

    };


    /* =====================================================
       UTILITY
       ===================================================== */

    function randomItem(array) {

        return array[
            Math.floor(Math.random() * array.length)
        ];

    }


    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent = value;

        return element.innerHTML;

    }


    function formatTime(totalSeconds) {

        const minutes =
            Math.floor(totalSeconds / 60);

        const seconds =
            totalSeconds % 60;

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")
        );

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        const toast =
            document.createElement("div");

        toast.className = "toast";

        toast.textContent = message;

        toastContainer.appendChild(toast);


        setTimeout(() => {

            toast.style.opacity = "0";

            toast.style.transform =
                "translateX(10px)";

            setTimeout(() => {
                toast.remove();
            }, 200);

        }, 2400);

    }


    /* =====================================================
       CHAT MESSAGE
       ===================================================== */

    function addChatMessage(
        name,
        text,
        type = "human"
    ) {

        if (chatEmpty) {
            chatEmpty.remove();
        }


        const message =
            document.createElement("div");

        message.className =
            `chat-message ${type}`;


        const letter =
            name.charAt(0).toUpperCase();


        const role =
            type === "bot"
                ? "BOT"
                : "HUMAN";


        const roleClass =
            type === "bot"
                ? "bot"
                : "human";


        message.innerHTML = `

            <div class="chat-avatar">
                ${letter}
            </div>

            <div>

                <div class="chat-author">

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                    <span class="role ${roleClass}">
                        ${role}
                    </span>

                    <time>now</time>

                </div>

                <div class="chat-text">
                    ${escapeHTML(text)}
                </div>

            </div>
        `;


        chatMessages.appendChild(message);


        chatMessages.scrollTop =
            chatMessages.scrollHeight;


        messagesSent++;

        statMessages.textContent =
            messagesSent;

    }


    /* =====================================================
       INITIAL CHAT
       ===================================================== */

    function addInitialChat() {

        const openingMessages = [

            {
                name: "drossog",
                text: "tuff",
                type: "bot"
            },

            {
                name: "frenchfries",
                text: "rating this a 6.7",
                type: "bot"
            },

            {
                name: "jaymat1210",
                text: "I'm the goat",
                type: "bot"
            },

            {
                name: "scrappy",
                text: "dream of the year watch jobs minecraft",
                type: "bot"
            }

        ];


        openingMessages.forEach((message, index) => {

            setTimeout(() => {

                addChatMessage(
                    message.name,
                    message.text,
                    message.type
                );

            }, index * 450);

        });


        setTimeout(() => {

            addChatMessage(
                "Keysha",
                "HELLO CHAT 👋",
                "human"
            );

        }, 2100);


        setTimeout(() => {

            addChatMessage(
                "Ash",
                "yo chat",
                "human"
            );

        }, 2750);


        setTimeout(() => {

            addChatMessage(
                "Jayden",
                "Roblox has way too many games bro",
                "human"
            );

        }, 3450);

    }


    /* =====================================================
       RANDOM CHAT
       ===================================================== */

    function sendRandomChat() {

        if (!streamStarted) {
            return;
        }


        const shouldBot =
            Math.random() < 0.48;


        if (shouldBot) {

            const bot =
                randomItem(bots);

            const message =
                randomItem(botMessages[bot]);


            showTyping();


            setTimeout(() => {

                hideTyping();

                addChatMessage(
                    bot,
                    message,
                    "bot"
                );

            }, 650);

        } else {

            const human =
                randomItem(humans);

            const message =
                randomItem(humanMessages[human]);


            showTyping();


            setTimeout(() => {

                hideTyping();

                addChatMessage(
                    human,
                    message,
                    "human"
                );

            }, 700);

        }

    }


    /* =====================================================
       TYPING
       ===================================================== */

    function showTyping() {

        typingIndicator.classList.add("show");

    }


    function hideTyping() {

        typingIndicator.classList.remove("show");

    }


    /* =====================================================
       START TIMER
       ===================================================== */

    function startTimer() {

        clearInterval(streamTimerInterval);


        streamTimerInterval =
            setInterval(() => {

                if (!streamStarted) {
                    return;
                }

                streamSeconds++;

                streamTimer.textContent =
                    formatTime(streamSeconds);

            }, 1000);

    }


    /* =====================================================
       VIEWER COUNTER
       ===================================================== */

    function startViewerCounter() {

        clearInterval(viewerInterval);


        viewerInterval =
            setInterval(() => {

                if (!streamStarted) {
                    return;
                }


                const change =
                    Math.floor(
                        Math.random() * 9
                    ) - 4;


                viewers += change;


                if (viewers < 40) {
                    viewers = 40;
                }


                viewerCount.textContent =
                    viewers;

                statViewers.textContent =
                    viewers;

                sidebarViewers.textContent =
                    `${viewers} viewers`;

            }, 4000);

    }


    /* =====================================================
       RANDOM CHAT TIMER
       ===================================================== */

    function startRandomChat() {

        clearInterval(chatInterval);


        chatInterval =
            setInterval(() => {

                sendRandomChat();

            }, 4500);

    }


    /* =====================================================
       START STREAM
       ===================================================== */

    function startStream() {

        if (streamStarted) {
            stopStream();
            return;
        }


        streamStarted = true;

        streamSeconds = 0;

        viewers =
            Math.floor(Math.random() * 25) + 85;


        startStreamButton.innerHTML = `
            <span>■</span>
            End Stream
        `;


        videoLive.textContent = "LIVE";

        videoLive.classList.add("live");


        streamStatus.innerHTML = `
            <span></span>
            LIVE NOW
        `;

        streamStatus.classList.add("live");


        videoMessage.innerHTML = `
            <div class="video-play">▶</div>

            <h3>
                BlockLive is live
            </h3>

            <p>
                Welcome to the Roblox stream.
            </p>
        `;


        viewerCount.textContent =
            viewers;


        sidebarStatus.textContent =
            "Live Now";


        sidebarViewers.textContent =
            `${viewers} viewers`;


        sidebarStatusBox.classList.add("live");


        chatStatus.textContent =
            "Live conversation";


        statStatus.textContent =
            "LIVE";


        statViewers.textContent =
            viewers;


        showToast(
            "🔴 Stream started — chat is live"
        );


        addInitialChat();

        startTimer();

        startViewerCounter();

        startRandomChat();

    }


    /* =====================================================
       STOP STREAM
       ===================================================== */

    function stopStream() {

        streamStarted = false;


        clearInterval(streamTimerInterval);

        clearInterval(viewerInterval);

        clearInterval(chatInterval);


        startStreamButton.innerHTML = `
            <span>▶</span>
            Start Stream
        `;


        videoLive.textContent =
            "OFFLINE";

        videoLive.classList.remove("live");


        streamStatus.innerHTML = `
            <span></span>
            OFFLINE
        `;

        streamStatus.classList.remove("live");


        videoMessage.innerHTML = `
            <div class="video-play">▶</div>

            <h3>
                Stream has ended
            </h3>

            <p>
                Start the stream again to continue.
            </p>
        `;


        viewerCount.textContent =
            "0";


        sidebarStatus.textContent =
            "Offline";


        sidebarViewers.textContent =
            "Waiting for stream";


        sidebarStatusBox.classList.remove("live");


        chatStatus.textContent =
            "Stream ended";


        statStatus.textContent =
            "OFFLINE";


        statViewers.textContent =
            "0";


        showToast(
            "Stream ended"
        );

    }


    /* =====================================================
       START STREAM BUTTON
       ===================================================== */

    startStreamButton.addEventListener(
        "click",
        startStream
    );


    /* =====================================================
       SEND CHAT
       ===================================================== */

    function sendUserMessage() {

        const text =
            chatInput.value.trim();


        if (!text) {
            return;
        }


        if (!streamStarted) {

            showToast(
                "Start the stream before chatting"
            );

            return;

        }


        addChatMessage(
            "Ash",
            text,
            "human"
        );


        chatInput.value = "";


        setTimeout(() => {

            const responses = [
                "W",
                "fr",
                "real",
                "😭",
                "that's actually true",
                "chat agrees",
                "LMAO",
                "nahhh"
            ];


            const responder =
                Math.random() < .5
                    ? "Denise"
                    : "Keysha";


            addChatMessage(
                responder,
                randomItem(responses),
                "human"
            );

        }, 900);

    }


    sendChatButton.addEventListener(
        "click",
        sendUserMessage
    );


    chatInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                sendUserMessage();
            }

        }
    );


    /* =====================================================
       LIKE BUTTON
       ===================================================== */

    likeButton.addEventListener(
        "click",
        () => {

            if (liked) {

                likes--;

                liked = false;

                likeButton.classList.remove(
                    "liked"
                );

            } else {

                likes++;

                liked = true;

                likeButton.classList.add(
                    "liked"
                );

                showToast(
                    "♥ Stream liked"
                );

            }


            likeCount.textContent =
                likes;

            statLikes.textContent =
                likes;

        }
    );


    /* =====================================================
       GAME SELECTOR
       ===================================================== */

    document
        .querySelectorAll(".game-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedGame =
                        button.dataset.game;


                    document
                        .querySelectorAll(".game-option")
                        .forEach(item => {
                            item.classList.remove(
                                "active"
                            );
                        });


                    button.classList.add(
                        "active"
                    );


                    currentGame.textContent =
                        selectedGame;


                    streamTitle.textContent =
                        `${selectedGame} — Project Stream`;


                    showToast(
                        `Game changed to ${selectedGame}`
                    );


                    if (streamStarted) {

                        addChatMessage(
                            "Ash",
                            `okay chat, we're playing ${selectedGame}`,
                            "human"
                        );


                        setTimeout(() => {

                            addChatMessage(
                                randomItem(bots),
                                randomItem(
                                    gameMessages[selectedGame]
                                ),
                                "bot"
                            );

                        }, 750);

                    }

                }
            );

        });


    /* =====================================================
       POLL
       ===================================================== */

    document
        .querySelectorAll(".poll-option")
        .forEach(option => {

            option.addEventListener(
                "click",
                () => {

                    const game =
                        option.dataset.option;


                    showToast(
                        `Vote recorded for ${game}`
                    );


                    if (streamStarted) {

                        addChatMessage(
                            "Keysha",
                            `I voted for ${game}`,
                            "human"
                        );

                    }

                }
            );

        });


    /* =====================================================
       SHARE
       ===================================================== */

    shareButton.addEventListener(
        "click",
        async () => {

            const url =
                window.location.href;


            try {

                await navigator.clipboard.writeText(
                    url
                );

                showToast(
                    "Stream link copied"
                );

            } catch {

                showToast(
                    "Stream link ready to share"
                );

            }

        }
    );


    /* =====================================================
       NOTIFY
       ===================================================== */

    notifyButton.addEventListener(
        "click",
        () => {

            notificationsEnabled =
                !notificationsEnabled;


            if (notificationsEnabled) {

                notifyButton.textContent =
                    "✓ Notifications On";

                showToast(
                    "Stream notifications enabled"
                );

            } else {

                notifyButton.textContent =
                    "♢ Notify Me";

                showToast(
                    "Stream notifications disabled"
                );

            }

        }
    );


    notificationButton.addEventListener(
        "click",
        () => {

            showToast(
                streamStarted
                    ? "You are already watching the live stream"
                    : "No new stream notifications"
            );

        }
    );


    /* =====================================================
       CLEAR CHAT
       ===================================================== */

    clearChatButton.addEventListener(
        "click",
        () => {

            chatMessages.innerHTML = `

                <div class="chat-empty">

                    <div>💬</div>

                    <strong>
                        Chat cleared
                    </strong>

                    <span>
                        New messages will appear
                        when the stream continues.
                    </span>

                </div>

            `;


            messagesSent = 0;

            statMessages.textContent =
                "0";


            showToast(
                "Chat cleared"
            );

        }
    );


    /* =====================================================
       MUTE
       ===================================================== */

    muteButton.addEventListener(
        "click",
        () => {

            muted = !muted;


            if (muted) {

                muteButton.textContent =
                    "🔇";

                showToast(
                    "Stream audio muted"
                );

            } else {

                muteButton.textContent =
                    "🔊";

                showToast(
                    "Stream audio unmuted"
                );

            }

        }
    );


    /* =====================================================
       FULLSCREEN
       ===================================================== */

    fullscreenButton.addEventListener(
        "click",
        () => {

            const video =
                document.querySelector(".video");


            if (!document.fullscreenElement) {

                if (video.requestFullscreen) {

                    video.requestFullscreen();

                } else {

                    showToast(
                        "Fullscreen isn't supported here"
                    );

                }

            } else {

                document.exitFullscreen();

            }

        }
    );


    /* =====================================================
       READ MORE
       ===================================================== */

    document
        .querySelectorAll(".read-more")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const content =
                        button.previousElementSibling;


                    const isOpen =
                        content.classList.toggle(
                            "open"
                        );


                    button.textContent =
                        isOpen
                            ? "Show less ↑"
                            : "Read full research →";

                }
            );

        });


    /* =====================================================
       NAVIGATION ACTIVE STATE
       ===================================================== */

    const navLinks =
        document.querySelectorAll(".nav-link");


    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    navLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );


                        if (
                            link.getAttribute("href") ===
                            `#${entry.target.id}`
                        ) {

                            link.classList.add(
                                "active"
                            );

                        }

                    });

                });

            },
            {
                rootMargin: "-30% 0px -60% 0px"
            }
        );


    sections.forEach(section => {

        observer.observe(section);

    });

});
