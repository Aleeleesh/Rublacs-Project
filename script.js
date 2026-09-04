document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       THEME
    ========================= */

    const themeBtn =
        document.getElementById("themeBtn");

    const savedTheme =
        localStorage.getItem("roblox-stream-theme");

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        themeBtn.textContent = "☀️";

    }


    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const lightMode =
            document.body.classList.contains("light-mode");

        themeBtn.textContent =
            lightMode ? "☀️" : "🌙";

        localStorage.setItem(
            "roblox-stream-theme",
            lightMode ? "light" : "dark"
        );

        showToast(
            lightMode
                ? "Light mode enabled"
                : "Dark mode enabled"
        );

    });


    /* =========================
       SMOOTH SCROLL BUTTONS
    ========================= */

    document.querySelectorAll(
        "[data-scroll]"
    ).forEach(button => {

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
       GAME INFORMATION
    ========================= */

    const games = {

        "Brookhaven RP": {

            icon: "🏙️",

            value: "Social interaction",

            type: "Roleplay",

            description:
                "Brookhaven RP gives the stream opportunities for roleplay, exploration, funny situations, and interactions with other players. This can work well when the goal is to create social and entertaining moments."

        },

        "Adopt Me!": {

            icon: "🐶",

            value: "Casual entertainment",

            type: "Social",

            description:
                "Adopt Me! focuses on pets, customization, exploration, trading, and social interaction. These elements can give a stream different activities to discuss and explore."

        },

        "Blox Fruits": {

            icon: "⚔️",

            value: "Adventure & progression",

            type: "Action",

            description:
                "Blox Fruits provides adventure, combat, abilities, exploration, islands, and character progression. These features can create gameplay moments that are easy to comment on and react to."

        },

        "Murder Mystery 2": {

            icon: "🔎",

            value: "Reactions & strategy",

            type: "Round-based",

            description:
                "Murder Mystery 2 uses short rounds with different roles. The investigation and uncertainty can create opportunities for reactions, discussion, and interaction between players."

        },

        "DOORS": {

            icon: "🚪",

            value: "Reactions",

            type: "Exploration",

            description:
                "DOORS focuses on exploration and suspense. Unexpected events can create natural reactions, making it a useful choice when the stream wants more expressive gameplay."

        },

        "Dress To Impress": {

            icon: "👗",

            value: "Creativity & competition",

            type: "Fashion",

            description:
                "Dress To Impress combines themes, outfit creation, competition, and player ratings. It can create opportunities for commentary, discussion, and audience participation."

        }

    };


    const modal =
        document.getElementById("gameModal");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalIcon =
        document.getElementById("modalIcon");

    const modalValue =
        document.getElementById("modalValue");

    const modalType =
        document.getElementById("modalType");


    document.querySelectorAll(
        ".game-info-button"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".game-card");

            const gameName =
                card.dataset.game;

            const game =
                games[gameName];

            if (!game) return;

            modalTitle.textContent =
                gameName;

            modalDescription.textContent =
                game.description;

            modalIcon.textContent =
                game.icon;

            modalValue.textContent =
                game.value;

            modalType.textContent =
                game.type;

            modal.classList.add("show");

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.style.overflow =
                "hidden";

        });

    });


    function closeModal() {

        modal.classList.remove("show");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    }


    document.getElementById(
        "closeModal"
    ).addEventListener(
        "click",
        closeModal
    );


    document.getElementById(
        "modalDone"
    ).addEventListener(
        "click",
        closeModal
    );


    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {

                closeModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {

                closeModal();

            }

        }
    );


    /* =========================
       VIEWER NEEDS
    ========================= */

    document.querySelectorAll(
        ".need-item"
    ).forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const alreadyOpen =
                    item.classList.contains(
                        "open"
                    );

                document.querySelectorAll(
                    ".need-item"
                ).forEach(other => {

                    other.classList.remove(
                        "open"
                    );

                });

                if (!alreadyOpen) {

                    item.classList.add(
                        "open"
                    );

                }

            }
        );

    });


    /* =========================
       STREAM DASHBOARD
    ========================= */

    const startBtn =
        document.getElementById(
            "startBtn"
        );

    const likeBtn =
        document.getElementById(
            "likeBtn"
        );

    const shareBtn =
        document.getElementById(
            "shareBtn"
        );

    const streamStatus =
        document.getElementById(
            "streamStatus"
        );

    const sideStatus =
        document.getElementById(
            "sideStatus"
        );

    const viewerCount =
        document.getElementById(
            "viewerCount"
        );

    const heroViewers =
        document.getElementById(
            "heroViewers"
        );

    const streamTimer =
        document.getElementById(
            "streamTimer"
        );

    const likeCount =
        document.getElementById(
            "likeCount"
        );

    const screenTitle =
        document.getElementById(
            "screenTitle"
        );

    const screenText =
        document.getElementById(
            "screenText"
        );

    const offlineContent =
        document.getElementById(
            "offlineContent"
        );

    const liveContent =
        document.getElementById(
            "liveContent"
        );

    const chatOnline =
        document.getElementById(
            "chatOnline"
        );


    let streaming = false;

    let seconds = 0;

    let viewers = 0;

    let likes = 0;

    let timerInterval = null;

    let viewerInterval = null;


    function updateViewerDisplay() {

        viewerCount.textContent =
            viewers.toLocaleString();

        heroViewers.textContent =
            viewers.toLocaleString();

        chatOnline.textContent =
            `${viewers.toLocaleString()} online`;

    }


    function updateTimer() {

        const minutes =
            Math.floor(seconds / 60)
                .toString()
                .padStart(2, "0");

        const secs =
            (seconds % 60)
                .toString()
                .padStart(2, "0");

        streamTimer.textContent =
            `${minutes}:${secs}`;

    }


    startBtn.addEventListener(
        "click",
        () => {

            streaming = !streaming;


            if (streaming) {

                startStream();

            } else {

                stopStream();

            }

        }
    );


    function startStream() {

        streamStatus.textContent =
            "● LIVE";

        streamStatus.classList.remove(
            "offline"
        );

        streamStatus.classList.add(
            "online"
        );

        sideStatus.textContent =
            "Live";

        startBtn.textContent =
            "■ Stop Stream";

        screenTitle.textContent =
            "Roblox Stream is LIVE!";

        screenText.textContent =
            "Gameplay, reactions, commentary and interaction.";

        offlineContent.classList.add(
            "hidden"
        );

        liveContent.classList.remove(
            "hidden"
        );

        seconds = 0;

        viewers = 1284;

        updateTimer();

        updateViewerDisplay();


        timerInterval =
            setInterval(
                () => {

                    seconds++;

                    updateTimer();

                },
                1000
            );


        viewerInterval =
            setInterval(
                () => {

                    const change =
                        Math.floor(
                            Math.random() * 31
                        ) - 12;

                    viewers += change;

                    if (viewers < 1) {

                        viewers = 1;

                    }

                    updateViewerDisplay();

                },
                2500
            );


        addChatMessage(
            "System",
            "The stream is now live! Welcome everyone."
        );

        showToast(
            "🔵 Stream started!"
        );

    }


    function stopStream() {

        clearInterval(
            timerInterval
        );

        clearInterval(
            viewerInterval
        );

        timerInterval = null;

        viewerInterval = null;

        streamStatus.textContent =
            "● OFFLINE";

        streamStatus.classList.remove(
            "online"
        );

        streamStatus.classList.add(
            "offline"
        );

        sideStatus.textContent =
            "Offline";

        startBtn.textContent =
            "▶ Start Stream";

        screenTitle.textContent =
            "Stream is offline";

        screenText.textContent =
            "Start the stream to activate the dashboard.";

        offlineContent.classList.remove(
            "hidden"
        );

        liveContent.classList.add(
            "hidden"
        );

        viewers = 0;

        updateViewerDisplay();

        addChatMessage(
            "System",
            "The stream has ended."
        );

        showToast(
            "Stream stopped."
        );

    }


    /* =========================
       LIKE SYSTEM
    ========================= */

    likeBtn.addEventListener(
        "click",
        () => {

            likes++;

            likeCount.textContent =
                likes.toLocaleString();

            likeBtn.textContent =
                "❤️ Liked!";

            setTimeout(
                () => {

                    likeBtn.textContent =
                        "❤️ Like Stream";

                },
                1000
            );

            showToast(
                "Thanks for the like!"
            );

        }
    );


    /* =========================
       SHARE
    ========================= */

    shareBtn.addEventListener(
        "click",
        async () => {

            const shareData = {

                title:
                    "Roblox Stream Hub",

                text:
                    "Check out our Roblox Streaming Project!",

                url:
                    window.location.href

            };


            try {

                if (
                    navigator.share
                ) {

                    await navigator.share(
                        shareData
                    );

                    showToast(
                        "Shared successfully!"
                    );

                } else if (
                    navigator.clipboard
                ) {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    showToast(
                        "Website link copied!"
                    );

                } else {

                    showToast(
                        "Share this website with your friends!"
                    );

                }

            } catch (error) {

                if (
                    error &&
                    error.name === "AbortError"
                ) {

                    return;

                }

                showToast(
                    "Sharing cancelled."
                );

            }

        }
    );


    /* =========================
       CHAT
    ========================= */

    const chatInput =
        document.getElementById(
            "chatInput"
        );

    const sendChat =
        document.getElementById(
            "sendChat"
        );

    const chatMessages =
        document.getElementById(
            "chatMessages"
        );

    const chatCount =
        document.getElementById(
            "chatCount"
        );


    let messagesSent = 0;


    function addChatMessage(
        username,
        message
    ) {

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "chat-message";


        const name =
            document.createElement(
                "span"
            );

        name.textContent =
            username;


        const text =
            document.createElement(
                "p"
            );

        text.textContent =
            message;


        wrapper.appendChild(name);

        wrapper.appendChild(text);

        chatMessages.appendChild(
            wrapper
        );


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    function sendMessage() {

        const message =
            chatInput.value.trim();


        if (!message) {

            return;

        }


        if (!streaming) {

            showToast(
                "Start the stream first!"
            );

            return;

        }


        messagesSent++;

        chatCount.textContent =
            messagesSent;


        addChatMessage(
            "You",
            message
        );


        chatInput.value = "";


        setTimeout(
            () => {

                const responses = [

                    "That was actually funny 😂",

                    "Let's gooo! 🎮",

                    "What game should we play next?",

                    "This stream is getting good!",

                    "W choice 👀"

                ];


                const response =
                    responses[
                        Math.floor(
                            Math.random() *
                            responses.length
                        )
                    ];


                addChatMessage(
                    "Viewer",
                    response
                );


                messagesSent++;

                chatCount.textContent =
                    messagesSent;

            },
            800
        );

    }


    sendChat.addEventListener(
        "click",
        sendMessage
    );


    chatInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                sendMessage();

            }

        }
    );


    /* =========================
       POLL
    ========================= */

    const pollButtons =
        document.querySelectorAll(
            ".poll-option"
        );

    const pollResult =
        document.getElementById(
            "pollResult"
        );


    pollButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    pollButtons.forEach(
                        option => {

                            option.classList.remove(
                                "selected"
                            );

                        }
                    );


                    button.classList.add(
                        "selected"
                    );


                    const choice =
                        button.dataset.choice;


                    pollResult.textContent =
                        `✓ You voted for "${choice}". Thanks for participating!`;

                    showToast(
                        `Vote recorded: ${choice}`
                    );

                }
            );

        }
    );


    /* =========================
       RESEARCH TABS
    ========================= */

    const researchTabs =
        document.querySelectorAll(
            ".research-tab"
        );

    const researchPanels =
        document.querySelectorAll(
            ".research-panel"
        );


    researchTabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    const target =
                        tab.dataset.research;


                    researchTabs.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    researchPanels.forEach(
                        panel => {

                            panel.classList.remove(
                                "active"
                            );

                        }
                    );


                    tab.classList.add(
                        "active"
                    );


                    const panel =
                        document.querySelector(
                            `[data-panel="${target}"]`
                        );


                    if (panel) {

                        panel.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


    /* =========================
       STAR RATING
    ========================= */

    const stars =
        document.querySelectorAll(
            ".stars button"
        );

    const ratingText =
        document.getElementById(
            "ratingText"
        );


    stars.forEach(
        star => {

            star.addEventListener(
                "click",
                () => {

                    const rating =
                        Number(
                            star.dataset.rating
                        );


                    stars.forEach(
                        item => {

                            const itemRating =
                                Number(
                                    item.dataset.rating
                                );


                            item.classList.toggle(
                                "selected",
                                itemRating <= rating
                            );

                        }
                    );


                    const messages = {

                        1:
                            "Needs improvement",

                        2:
                            "Could be better",

                        3:
                            "Pretty good",

                        4:
                            "Very good!",

                        5:
                            "Excellent concept! ⭐"

                    };


                    ratingText.textContent =
                        `${rating}/5 — ${messages[rating]}`;


                    showToast(
                        `You rated the stream ${rating}/5`
                    );

                }
            );

        }
    );


    /* =========================
       NAVIGATION
    ========================= */

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    const observedSections =
        document.querySelectorAll(
            "main section[id]"
        );


    const sectionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            navLinks.forEach(
                                link => {

                                    link.classList.remove(
                                        "active"
                                    );

                                }
                            );


                            const activeLink =
                                document.querySelector(
                                    `.nav-link[href="#${entry.target.id}"]`
                                );


                            if (activeLink) {

                                activeLink.classList.add(
                                    "active"
                                );

                            }

                        }

                    }
                );

            },
            {
                rootMargin:
                    "-25% 0px -65% 0px"
            }
        );


    observedSections.forEach(
        section => {

            sectionObserver.observe(
                section
            );

        }
    );


    /* =========================
       TOAST
    ========================= */

    const toast =
        document.getElementById(
            "toast"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );

    let toastTimeout;


    function showToast(message) {

        toastMessage.textContent =
            message;

        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimeout
        );


        toastTimeout =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                2300
            );

    }


    /* =========================
       INITIAL STATE
    ========================= */

    updateViewerDisplay();

    updateTimer();

});
