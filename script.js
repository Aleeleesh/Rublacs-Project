document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       GAME DATABASE
    ========================================== */

    const games = {

        brookhaven: {
            title: "Brookhaven RP",
            icon: "🏙️",
            category: "ROLEPLAY",
            genre: "Roleplay / Social",
            potential: "Very High",
            idea: "Viewer roleplay sessions",
            description:
                "Brookhaven is a social roleplay experience where players can explore a city, customize their characters, use vehicles, choose homes and create their own stories."
        },

        adoptme: {
            title: "Adopt Me!",
            icon: "🐶",
            category: "ROLEPLAY / PETS",
            genre: "Roleplay / Collection",
            potential: "Very High",
            idea: "Pet challenges",
            description:
                "Adopt Me! focuses on collecting and caring for pets, customizing homes and interacting with other players in a social environment."
        },

        bloxfruits: {
            title: "Blox Fruits",
            icon: "⚔️",
            category: "ACTION / ADVENTURE",
            genre: "Action / RPG",
            potential: "Very High",
            idea: "Island exploration",
            description:
                "Blox Fruits is an action-adventure experience inspired by anime and pirate themes. Players explore different areas, fight enemies and develop their characters."
        },

        mm2: {
            title: "Murder Mystery 2",
            icon: "🔪",
            category: "ACTION / SOCIAL",
            genre: "Social Deduction",
            potential: "High",
            idea: "Viewer mystery rounds",
            description:
                "Murder Mystery 2 places players into different roles during rounds. Players must figure out what is happening while completing their objectives."
        },

        doors: {
            title: "DOORS",
            icon: "🚪",
            category: "HORROR",
            genre: "Horror / Survival",
            potential: "Very High",
            idea: "Viewer survival challenge",
            description:
                "DOORS is a horror experience centered around exploring rooms and surviving dangerous encounters while progressing through the game."
        },

        tower: {
            title: "Tower of Hell",
            icon: "🗼",
            category: "OBBY",
            genre: "Obstacle Course",
            potential: "High",
            idea: "Speedrun challenge",
            description:
                "Tower of Hell is an obstacle-course experience where players attempt to climb challenging towers without traditional checkpoints."
        },

        arsenal: {
            title: "Arsenal",
            icon: "🎯",
            category: "ACTION / FPS",
            genre: "FPS / Competitive",
            potential: "High",
            idea: "Viewer competition",
            description:
                "Arsenal is a fast-paced competitive shooter featuring different weapons and quick rounds."
        },

        bedwars: {
            title: "BedWars",
            icon: "🛏️",
            category: "ACTION / PVP",
            genre: "PvP / Strategy",
            potential: "Very High",
            idea: "Team battle challenge",
            description:
                "BedWars is a team-based competitive experience where players gather resources, defend their beds and battle opposing teams."
        },

        piggy: {
            title: "Piggy",
            icon: "🐷",
            category: "HORROR / SURVIVAL",
            genre: "Horror / Puzzle",
            potential: "High",
            idea: "Story mode challenge",
            description:
                "Piggy combines survival, puzzles and horror elements. Players work through maps while trying to escape danger and uncover the story."
        },

        dti: {
            title: "Dress to Impress",
            icon: "👗",
            category: "FASHION / COMPETITION",
            genre: "Fashion / Competition",
            potential: "Very High",
            idea: "Viewer outfit competition",
            description:
                "Dress to Impress challenges players to create outfits based on different themes and compete through fashion-based rounds."
        }

    };


    /* ==========================================
       THEME SYSTEM
    ========================================== */

    const themeButton =
        document.getElementById("theme-toggle");

    const savedTheme =
        localStorage.getItem("rsh-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeButton.textContent = "☀️";
    }

    themeButton?.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const lightMode =
            document.body.classList.contains("light-mode");

        localStorage.setItem(
            "rsh-theme",
            lightMode ? "light" : "dark"
        );

        themeButton.textContent =
            lightMode ? "☀️" : "🌙";

        showToast(
            lightMode
                ? "Light mode enabled"
                : "Dark mode enabled"
        );

    });


    /* ==========================================
       ACTIVE NAVIGATION
    ========================================== */

    const sections =
        document.querySelectorAll("section[id]");

    const navLinks =
        document.querySelectorAll(".nav-link");

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    navLinks.forEach(link => {
                        link.classList.remove("active");
                    });

                    const active =
                        document.querySelector(
                            `.nav-link[href="#${entry.target.id}"]`
                        );

                    active?.classList.add("active");

                });

            },
            {
                threshold: 0.35
            }
        );

    sections.forEach(section => {
        observer.observe(section);
    });


    /* ==========================================
       GAME SEARCH + FILTER
    ========================================== */

    const gameCards =
        document.querySelectorAll(".game-card");

    const filterButtons =
        document.querySelectorAll(".filter-button");

    const searchInput =
        document.getElementById("game-search");

    const noGames =
        document.getElementById("no-games");

    let currentCategory = "all";


    function filterGames() {

        const search =
            searchInput.value
                .toLowerCase()
                .trim();

        let visible = 0;

        gameCards.forEach(card => {

            const categories =
                card.dataset.category
                    .toLowerCase();

            const searchable =
                card.dataset.search
                    .toLowerCase();

            const matchesCategory =
                currentCategory === "all" ||
                categories.includes(currentCategory);

            const matchesSearch =
                searchable.includes(search);

            if (matchesCategory && matchesSearch) {

                card.classList.remove("hidden");

                visible++;

            } else {

                card.classList.add("hidden");

            }

        });

        noGames.classList.toggle(
            "hidden",
            visible !== 0
        );

    }


    searchInput?.addEventListener(
        "input",
        filterGames
    );


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentCategory =
                button.dataset.category;

            filterGames();

        });

    });


    /* ==========================================
       GAME MODAL
    ========================================== */

    const modal =
        document.getElementById("game-modal");

    const closeModal =
        document.getElementById("close-modal");

    const modalTitle =
        document.getElementById("modal-title");

    const modalIcon =
        document.getElementById("modal-icon");

    const modalCategory =
        document.getElementById("modal-category");

    const modalDescription =
        document.getElementById("modal-description");

    const modalGenre =
        document.getElementById("modal-genre");

    const modalPotential =
        document.getElementById("modal-potential");

    const modalIdea =
        document.getElementById("modal-idea");

    const modalFavorite =
        document.getElementById("modal-favorite");

    let currentGame = null;


    function openGame(gameID) {

        const game =
            games[gameID];

        if (!game) {
            return;
        }

        currentGame = gameID;

        modalTitle.textContent =
            game.title;

        modalIcon.textContent =
            game.icon;

        modalCategory.textContent =
            game.category;

        modalDescription.textContent =
            game.description;

        modalGenre.textContent =
            game.genre;

        modalPotential.textContent =
            game.potential;

        modalIdea.textContent =
            game.idea;

        updateModalFavorite();

        modal.classList.add("show");

        document.body.style.overflow = "hidden";

    }


    function closeGameModal() {

        modal.classList.remove("show");

        document.body.style.overflow = "";

    }


    document
        .querySelectorAll(".game-open")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {
                    openGame(
                        button.dataset.game
                    );
                }
            );

        });


    closeModal?.addEventListener(
        "click",
        closeGameModal
    );


    document
        .querySelector(".modal-overlay")
        ?.addEventListener(
            "click",
            closeGameModal
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal.classList.contains("show")
            ) {
                closeGameModal();
            }

        }
    );


    /* ==========================================
       FAVORITES
    ========================================== */

    let favorites =
        JSON.parse(
            localStorage.getItem("rsh-favorites")
        ) || [];


    function updateFavoriteButtons() {

        document
            .querySelectorAll("[data-favorite]")
            .forEach(button => {

                const id =
                    button.dataset.favorite;

                if (favorites.includes(id)) {

                    button.textContent = "★";

                    button.classList.add(
                        "favorited"
                    );

                } else {

                    button.textContent = "☆";

                    button.classList.remove(
                        "favorited"
                    );

                }

            });

    }


    function updateModalFavorite() {

        if (!currentGame) {
            return;
        }

        const saved =
            favorites.includes(currentGame);

        modalFavorite.textContent =
            saved
                ? "★ Remove from Favorites"
                : "☆ Add to Favorites";

    }


    document
        .querySelectorAll("[data-favorite]")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const id =
                        button.dataset.favorite;

                    if (favorites.includes(id)) {

                        favorites =
                            favorites.filter(
                                item => item !== id
                            );

                        showToast(
                            "Removed from favorites"
                        );

                    } else {

                        favorites.push(id);

                        showToast(
                            "Added to favorites ⭐"
                        );

                    }

                    localStorage.setItem(
                        "rsh-favorites",
                        JSON.stringify(favorites)
                    );

                    updateFavoriteButtons();

                    if (currentGame === id) {
                        updateModalFavorite();
                    }

                }
            );

        });


    modalFavorite?.addEventListener(
        "click",
        () => {

            if (!currentGame) {
                return;
            }

            const button =
                document.querySelector(
                    `[data-favorite="${currentGame}"]`
                );

            button?.click();

            updateModalFavorite();

        }
    );


    updateFavoriteButtons();


    /* ==========================================
       STREAM SYSTEM
    ========================================== */

    let isLive = false;

    let viewerCount = 0;

    let streamSeconds = 0;

    let viewerInterval = null;

    let timerInterval = null;

    let likes = 0;


    const streamToggle =
        document.getElementById(
            "stream-toggle"
        );

    const statusDot =
        document.getElementById(
            "status-dot"
        );

    const statusText =
        document.getElementById(
            "status-text"
        );

    const viewerDisplay =
        document.getElementById(
            "viewer-count"
        );

    const timerDisplay =
        document.getElementById(
            "stream-timer"
        );

    const videoStatus =
        document.getElementById(
            "video-status"
        );


    function formatTime(seconds) {

        const hours =
            Math.floor(
                seconds / 3600
            )
            .toString()
            .padStart(2, "0");

        const minutes =
            Math.floor(
                (seconds % 3600) / 60
            )
            .toString()
            .padStart(2, "0");

        const secs =
            (seconds % 60)
            .toString()
            .padStart(2, "0");

        return `${hours}:${minutes}:${secs}`;

    }


    function startStream() {

        isLive = true;

        viewerCount =
            Math.floor(
                Math.random() * 80
            ) + 120;

        streamSeconds = 0;

        statusText.textContent =
            "LIVE";

        statusDot.classList.add("live");

        streamToggle.textContent =
            "End Stream";

        videoStatus.textContent =
            "🔴 STREAM LIVE";

        viewerDisplay.textContent =
            viewerCount;

        viewerInterval =
            setInterval(() => {

                const change =
                    Math.floor(
                        Math.random() * 9
                    ) - 3;

                viewerCount =
                    Math.max(
                        1,
                        viewerCount + change
                    );

                viewerDisplay.textContent =
                    viewerCount;

            }, 3000);


        timerInterval =
            setInterval(() => {

                streamSeconds++;

                timerDisplay.textContent =
                    formatTime(streamSeconds);

            }, 1000);


        showToast(
            "You are now LIVE 🔴"
        );

    }


    function endStream() {

        isLive = false;

        clearInterval(viewerInterval);

        clearInterval(timerInterval);

        viewerInterval = null;
        timerInterval = null;

        statusText.textContent =
            "OFFLINE";

        statusDot.classList.remove(
            "live"
        );

        streamToggle.textContent =
            "Go Live";

        videoStatus.textContent =
            "STREAM OFFLINE";

        viewerDisplay.textContent =
            "0";

        timerDisplay.textContent =
            "00:00:00";

        showToast(
            "Stream ended"
        );

    }


    streamToggle?.addEventListener(
        "click",
        () => {

            if (isLive) {
                endStream();
            } else {
                startStream();
            }

        }
    );


    /* ==========================================
       LIKE BUTTON
    ========================================== */

    const likeButton =
        document.getElementById(
            "like-button"
        );

    const likeCount =
        document.getElementById(
            "like-count"
        );


    likeButton?.addEventListener(
        "click",
        () => {

            likes++;

            likeCount.textContent =
                likes;

            likeButton.style.transform =
                "scale(.96)";

            setTimeout(() => {

                likeButton.style.transform =
                    "";

            }, 150);

            showToast(
                "Thanks for the like! 👍"
            );

        }
    );


    /* ==========================================
       SHARE
    ========================================== */

    const shareButton =
        document.getElementById(
            "share-button"
        );

    const shareMessage =
        document.getElementById(
            "share-message"
        );


    shareButton?.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                shareMessage.textContent =
                    "Link copied!";

                showToast(
                    "Stream link copied 🔗"
                );

            } catch {

                shareMessage.textContent =
                    "Copy unavailable";

            }

            setTimeout(() => {

                shareMessage.textContent =
                    "";

            }, 2500);

        }
    );


    /* ==========================================
       POLL
    ========================================== */

    const pollButtons =
        document.querySelectorAll(
            ".poll-option"
        );

    const pollResult =
        document.getElementById(
            "poll-result"
        );


    pollButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                pollButtons.forEach(
                    btn => {
                        btn.classList.remove(
                            "selected"
                        );
                    }
                );

                button.classList.add(
                    "selected"
                );

                const game =
                    button.dataset.game;

                pollResult.textContent =
                    `You voted for ${game}! 🎮`;

                showToast(
                    `Vote submitted: ${game}`
                );

            }
        );

    });


    /* ==========================================
       STAR RATING
    ========================================== */

    const stars =
        document.querySelectorAll(
            "#stars button"
        );

    const ratingResult =
        document.getElementById(
            "rating-result"
        );


    stars.forEach(star => {

        star.addEventListener(
            "click",
            () => {

                const rating =
                    Number(
                        star.dataset.rating
                    );

                stars.forEach(
                    (item, index) => {

                        item.classList.toggle(
                            "active",
                            index < rating
                        );

                    }
                );

                ratingResult.textContent =
                    `You rated the stream ${rating}/5 ⭐`;

                showToast(
                    "Rating submitted!"
                );

            }
        );

    });


    /* ==========================================
       CHAT
    ========================================== */

    const chatBox =
        document.getElementById(
            "chat-box"
        );

    const chatInput =
        document.getElementById(
            "chat-input"
        );

    const sendChat =
        document.getElementById(
            "send-chat"
        );


    function sendMessage() {

        const text =
            chatInput.value.trim();

        if (!text) {
            return;
        }

        const message =
            document.createElement("div");

        message.className =
            "chat-message";

        const name =
            document.createElement("strong");

        name.textContent =
            "You";

        const content =
            document.createElement("span");

        content.textContent =
            text;

        message.appendChild(name);

        message.appendChild(content);

        chatBox.appendChild(message);

        chatInput.value = "";

        chatBox.scrollTop =
            chatBox.scrollHeight;

    }


    sendChat?.addEventListener(
        "click",
        sendMessage
    );


    chatInput?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                sendMessage();
            }

        }
    );


    /* ==========================================
       TOAST
    ========================================== */

    const toast =
        document.getElementById(
            "toast"
        );

    let toastTimeout;


    function showToast(message) {

        const toastText =
            toast.querySelector("p");

        toastText.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2200);

    }

});
