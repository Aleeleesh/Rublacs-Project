/* =========================================================
   ROBLOX STREAMING HUB — JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {
        let toast = $("#toast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.className = "toast";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    /* =====================================================
       THEME
       ===================================================== */

    const themeToggle = $("#themeToggle");

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }

    themeToggle?.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("light-mode")
                ? "light"
                : "dark"
        );
    });

    /* =====================================================
       MOBILE NAV
       ===================================================== */

    const menuBtn = $("#menuBtn");
    const navLinks = $(".nav-links");

    menuBtn?.addEventListener("click", () => {
        navLinks?.classList.toggle("show");
    });

    $$(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks?.classList.remove("show");
        });
    });

    /* =====================================================
       ACTIVE NAV
       ===================================================== */

    const sections = $$("section[id]");
    const navItems = $$(".nav-links a");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navItems.forEach(link => {
                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            `#${entry.target.id}`
                        ) {
                            link.classList.add("active");
                        }
                    });
                }
            });
        },
        {
            threshold: 0.25
        }
    );

    sections.forEach(section => observer.observe(section));

    /* =====================================================
       GAME DATABASE
       ===================================================== */

    const games = [
        {
            name: "Brookhaven RP",
            category: "Roleplay",
            icon: "🏡",
            description: "A social roleplay experience with houses, vehicles, and open-ended stories."
        },
        {
            name: "Adopt Me!",
            category: "Roleplay",
            icon: "🐶",
            description: "A popular roleplay game focused on pets, trading, homes, and exploration."
        },
        {
            name: "Blox Fruits",
            category: "Adventure",
            icon: "⚔️",
            description: "Explore islands, fight enemies, gain abilities, and level up."
        },
        {
            name: "Murder Mystery 2",
            category: "Action",
            icon: "🔎",
            description: "A round-based mystery game where players have different hidden roles."
        },
        {
            name: "DOORS",
            category: "Horror",
            icon: "🚪",
            description: "Explore a mysterious hotel while surviving unexpected encounters."
        },
        {
            name: "Tower of Hell",
            category: "Obby",
            icon: "🗼",
            description: "A challenging obstacle course with no checkpoints."
        },
        {
            name: "Arsenal",
            category: "Action",
            icon: "🎯",
            description: "Fast-paced competitive shooting gameplay with changing weapons."
        },
        {
            name: "BedWars",
            category: "Action",
            icon: "🛏️",
            description: "Protect your bed, gather resources, and compete against other teams."
        },
        {
            name: "Piggy",
            category: "Horror",
            icon: "🐷",
            description: "Solve puzzles and escape while avoiding the pursuing enemy."
        },
        {
            name: "Dress to Impress",
            category: "Roleplay",
            icon: "👗",
            description: "Create outfits around themes and compete through fashion rounds."
        },
        {
            name: "Natural Disaster Survival",
            category: "Survival",
            icon: "🌪️",
            description: "Survive random disasters using quick decisions and environmental awareness."
        },
        {
            name: "Obby Challenge",
            category: "Obby",
            icon: "🧱",
            description: "A flexible obstacle-course concept for testing reactions and movement."
        }
    ];

    const gameGrid = $("#gameGrid");
    const gameSearch = $("#gameSearch");
    const filterButtons = $$(".filter-btn");

    let currentFilter = "All";

    function renderGames() {
        if (!gameGrid) return;

        const searchTerm =
            gameSearch?.value.toLowerCase().trim() || "";

        const filtered = games.filter(game => {
            const matchesCategory =
                currentFilter === "All" ||
                game.category === currentFilter;

            const matchesSearch =
                game.name.toLowerCase().includes(searchTerm) ||
                game.category.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesSearch;
        });

        gameGrid.innerHTML = "";

        if (filtered.length === 0) {
            gameGrid.innerHTML = `
                <div class="card">
                    <h3>No games found</h3>
                    <p>Try another search or category.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(game => {
            const card = document.createElement("article");
            card.className = "game-card";

            card.innerHTML = `
                <div class="game-icon">${game.icon}</div>
                <h3>${game.name}</h3>
                <p>${game.description}</p>

                <div class="game-actions">
                    <button class="view-game">View</button>
                    <button class="favorite-game">☆</button>
                </div>
            `;

            card.querySelector(".view-game")
                .addEventListener("click", () => openGameModal(game));

            card.querySelector(".favorite-game")
                .addEventListener("click", event => {
                    event.currentTarget.textContent =
                        event.currentTarget.textContent === "☆"
                            ? "★"
                            : "☆";

                    showToast(
                        event.currentTarget.textContent === "★"
                            ? `${game.name} added to favorites`
                            : `${game.name} removed from favorites`
                    );
                });

            gameGrid.appendChild(card);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            currentFilter =
                button.dataset.category ||
                button.textContent.trim();

            renderGames();
        });
    });

    gameSearch?.addEventListener("input", renderGames);

    renderGames();

    /* =====================================================
       GAME MODAL
       ===================================================== */

    const gameModal = $("#gameModal");
    const gameModalContent = $("#gameModalContent");

    function openGameModal(game) {
        if (!gameModal || !gameModalContent) return;

        gameModalContent.innerHTML = `
            <button class="modal-close">&times;</button>

            <div class="game-icon">${game.icon}</div>

            <h2>${game.name}</h2>

            <p style="margin: 10px 0;">
                <strong>Category:</strong> ${game.category}
            </p>

            <p>${game.description}</p>

            <br>

            <p>
                This game can work well for a stream because it gives
                viewers something to react to, discuss, or participate in.
            </p>
        `;

        gameModal.classList.add("show");

        gameModalContent
            .querySelector(".modal-close")
            ?.addEventListener("click", closeGameModal);
    }

    function closeGameModal() {
        gameModal?.classList.remove("show");
    }

    gameModal?.addEventListener("click", event => {
        if (event.target === gameModal) {
            closeGameModal();
        }
    });

    /* =====================================================
       VIEWER NEED MODAL
       ===================================================== */

    const needModal = $("#needModal");
    const needModalContent = $("#needModalContent");

    $$(".need-card, [data-need]").forEach(card => {
        card.addEventListener("click", () => {
            if (!needModal || !needModalContent) return;

            const title =
                card.dataset.title ||
                card.querySelector("h3")?.textContent ||
                "Viewer Need";

            const description =
                card.dataset.description ||
                card.querySelector("p")?.textContent ||
                "This feature helps make the stream more enjoyable.";

            needModalContent.innerHTML = `
                <button class="modal-close">&times;</button>
                <h2>${title}</h2>
                <p>${description}</p>
            `;

            needModal.classList.add("show");

            needModalContent
                .querySelector(".modal-close")
                ?.addEventListener("click", () => {
                    needModal.classList.remove("show");
                });
        });
    });

    needModal?.addEventListener("click", event => {
        if (event.target === needModal) {
            needModal.classList.remove("show");
        }
    });

    /* =====================================================
       AUDIENCE TABS
       ===================================================== */

    const tabButtons = $$(".tab-btn");
    const tabContents = $$(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const target = button.dataset.tab;

            tabButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            tabContents.forEach(content =>
                content.classList.remove("active")
            );

            button.classList.add("active");

            document
                .getElementById(target)
                ?.classList.add("active");
        });
    });

    /* =====================================================
       ACCORDION
       ===================================================== */

    $$(".accordion-header").forEach(button => {
        button.addEventListener("click", () => {
            const item = button.closest(".accordion-item");

            if (!item) return;

            item.classList.toggle("open");
        });
    });

    /* =====================================================
       STREAM DASHBOARD
       ===================================================== */

    let streamLive = false;
    let streamSeconds = 0;
    let streamTimer = null;
    let viewers = 0;
    let likes = 0;

    const streamStatus = $("#streamStatus");
    const streamTimerDisplay = $("#streamTimer");
    const viewerDisplay = $("#viewerCount");
    const likeDisplay = $("#likeCount");
    const startStreamBtn = $("#startStream");
    const stopStreamBtn = $("#stopStream");
    const likeBtn = $("#likeBtn");
    const shareBtn = $("#shareBtn");

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    function updateStreamUI() {
        if (streamTimerDisplay) {
            streamTimerDisplay.textContent =
                formatTime(streamSeconds);
        }

        if (viewerDisplay) {
            viewerDisplay.textContent =
                viewers.toLocaleString();
        }

        if (likeDisplay) {
            likeDisplay.textContent =
                likes.toLocaleString();
        }
    }

    function startTheStream() {
        if (streamLive) return;

        streamLive = true;
        streamSeconds = 0;
        viewers = Math.floor(Math.random() * 70) + 30;

        if (streamStatus) {
            streamStatus.textContent = "LIVE";
        }

        startStreamBtn?.setAttribute("disabled", "true");

        streamTimer = setInterval(() => {
            streamSeconds++;

            viewers += Math.floor(Math.random() * 7) - 2;

            if (viewers < 1) {
                viewers = 1;
            }

            updateStreamUI();
        }, 1000);

        startBotChat();

        showToast("Stream started! Chat is now active.");
    }

    function stopTheStream() {
        if (!streamLive) return;

        streamLive = false;

        clearInterval(streamTimer);
        streamTimer = null;

        stopBotChat();

        if (streamStatus) {
            streamStatus.textContent = "OFFLINE";
        }

        startStreamBtn?.removeAttribute("disabled");

        showToast("Stream ended.");
    }

    startStreamBtn?.addEventListener("click", startTheStream);
    stopStreamBtn?.addEventListener("click", stopTheStream);

    likeBtn?.addEventListener("click", () => {
        likes++;

        updateStreamUI();

        showToast("Like added 👍");
    });

    shareBtn?.addEventListener("click", async () => {
        const shareData = {
            title: "Roblox Streaming Hub",
            text: "Check out our Roblox Streaming Hub!"
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(
                    window.location.href
                );

                showToast("Link copied!");
            } else {
                showToast("Share the page URL with your friends!");
            }
        } catch (error) {
            console.log("Share cancelled.");
        }
    });

    updateStreamUI();

    /* =====================================================
       POLL
       ===================================================== */

    $$(".poll-option").forEach(option => {
        option.addEventListener("click", () => {
            $$(".poll-option").forEach(btn => {
                btn.classList.remove("selected");
            });

            option.classList.add("selected");

            showToast(
                `Vote submitted: ${option.textContent.trim()}`
            );
        });
    });

    /* =====================================================
       STAR RATING
       ===================================================== */

    const ratingButtons = $$(".rating button");

    ratingButtons.forEach(button => {
        button.addEventListener("click", () => {
            const rating = Number(button.dataset.rating);

            ratingButtons.forEach(star => {
                star.classList.toggle(
                    "active",
                    Number(star.dataset.rating) <= rating
                );
            });

            localStorage.setItem(
                "streamRating",
                rating
            );

            showToast(`You rated the project ${rating}/5!`);
        });
    });

    const savedRating =
        Number(localStorage.getItem("streamRating"));

    if (savedRating) {
        ratingButtons.forEach(star => {
            star.classList.toggle(
                "active",
                Number(star.dataset.rating) <= savedRating
            );
        });
    }

    /* =====================================================
       CHAT
       ===================================================== */

    const chatForm = $("#chatForm");
    const chatInput = $("#chatInput");
    const chatMessages = $("#chatMessages");

    function addChatMessage(username, message, isBot = false) {
        if (!chatMessages) return;

        const messageElement =
            document.createElement("div");

        messageElement.className =
            isBot
                ? "chat-message bot-message"
                : "chat-message";

        const usernameElement =
            document.createElement("strong");

        usernameElement.textContent = username;

        messageElement.appendChild(usernameElement);

        if (isBot) {
            const badge =
                document.createElement("span");

            badge.className = "bot-badge";
            badge.textContent = "BOT";

            messageElement.appendChild(badge);
        }

        const text =
            document.createElement("p");

        text.textContent = message;

        messageElement.appendChild(text);

        chatMessages.appendChild(messageElement);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }

    chatForm?.addEventListener("submit", event => {
        event.preventDefault();

        const message =
            chatInput?.value.trim();

        if (!message) return;

        addChatMessage("You", message);

        chatInput.value = "";

        setTimeout(() => {
            if (streamLive) {
                sendBotMessage();
            }
        }, 1000);
    });

    /* =====================================================
       BOT CHAT
       ===================================================== */

    const chatBots = [
        {
            name: "Jaymat1210",
            messages: [
                "I'm the goat",
                "W stream",
                "Easy work 😭",
                "This is actually fire"
            ]
        },
        {
            name: "Drossog",
            messages: [
                "tuff",
                "Actually fire",
                "W website",
                "nah this is tuff"
            ]
        },
        {
            name: "Frenchfries",
            messages: [
                "rating this a 6.7",
                "6.7/10 chat",
                "Could be higher 💀",
                "I'm giving this a 6.7"
            ]
        },
        {
            name: "Scrappy",
            messages: [
                "monchayster city",
                "MONCHAYSTER CITY 🗣️",
                "city mentioned",
                "monchayster"
            ]
        },
        {
            name: "Key",
            messages: [
                "Sam just called our work a 'slop'",
                "NAHHH 😭",
                "bro really said slop 💀",
                "Sam said slop and dipped"
            ]
        },
        {
            name: "Menoopy",
            messages: [
                "the website got broken",
                "bro the website is cooked 💀",
                "something broke 😭",
                "WHO BROKE THE WEBSITE"
            ]
        }
    ];

    let botInterval = null;

    function sendBotMessage() {
        if (!chatMessages) return;

        const bot =
            chatBots[
                Math.floor(
                    Math.random() * chatBots.length
                )
            ];

        const message =
            bot.messages[
                Math.floor(
                    Math.random() * bot.messages.length
                )
            ];

        addChatMessage(
            bot.name,
            message,
            true
        );
    }

    function startBotChat() {
        if (botInterval) return;

        sendBotMessage();

        botInterval = setInterval(() => {
            sendBotMessage();
        }, Math.floor(Math.random() * 3000) + 3000);
    }

    function stopBotChat() {
        if (!botInterval) return;

        clearInterval(botInterval);
        botInterval = null;
    }

    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeGameModal();
            needModal?.classList.remove("show");
        }
    });

});
