document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       DARK / LIGHT MODE
    ========================= */

    const themeBtn = document.getElementById("themeBtn");

    const savedTheme = localStorage.getItem("robloxTheme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeBtn.textContent = "☀️";
    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const light = document.body.classList.contains("light-mode");

        themeBtn.textContent = light ? "☀️" : "🌙";

        localStorage.setItem(
            "robloxTheme",
            light ? "light" : "dark"
        );

        showToast(light ? "Light mode enabled" : "Dark mode enabled");
    });


    /* =========================
       GAME INFORMATION
    ========================= */

    const gameInfo = {

        "Brookhaven RP": {
            icon: "🏙️",
            description:
                "Brookhaven RP is a roleplaying experience where players can explore the town, customize their characters, interact with others, and create their own stories."
        },

        "Adopt Me!": {
            icon: "🐶",
            description:
                "Adopt Me! focuses on collecting and caring for pets, customizing spaces, trading, and social interaction."
        },

        "Blox Fruits": {
            icon: "⚔️",
            description:
                "Blox Fruits is an adventure-focused Roblox experience featuring exploration, combat, abilities, islands, and character progression."
        },

        "Murder Mystery 2": {
            icon: "🔍",
            description:
                "Murder Mystery 2 uses short rounds where players take different roles and must figure out what is happening while surviving the round."
        },

        "DOORS": {
            icon: "🚪",
            description:
                "DOORS is an exploration and suspense experience where players progress through rooms while reacting to unexpected events."
        },

        "Dress To Impress": {
            icon: "👗",
            description:
                "Dress To Impress is a fashion competition experience where players create outfits around themes and receive ratings from other players."
        }

    };

    const modal = document.getElementById("gameModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalIcon = document.getElementById("modalIcon");

    document.querySelectorAll(".info-btn").forEach(button => {

        button.addEventListener("click", () => {

            const card = button.closest(".game-card");
            const gameName = card.dataset.game;
            const data = gameInfo[gameName];

            if (!data) return;

            modalTitle.textContent = gameName;
            modalDescription.textContent = data.description;
            modalIcon.textContent = data.icon;

            modal.classList.add("show");
        });

    });


    function closeModal() {
        modal.classList.remove("show");
    }

    document.getElementById("closeModal")
        .addEventListener("click", closeModal);

    document.getElementById("modalCloseButton")
        .addEventListener("click", closeModal);

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closeModal();
        }

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeModal();
        }

    });


    /* =========================
       VIEWER NEEDS ACCORDION
    ========================= */

    document.querySelectorAll(".need-item").forEach(item => {

        item.addEventListener("click", () => {

            item.classList.toggle("open");

        });

    });


    /* =========================
       STREAM SIMULATOR
    ========================= */

    const startBtn = document.getElementById("startBtn");
    const likeBtn = document.getElementById("likeBtn");
    const shareBtn = document.getElementById("shareBtn");

    const status = document.getElementById("streamStatus");
    const viewerCount = document.getElementById("viewerCount");
    const heroViewers = document.getElementById("heroViewers");
    const timer = document.getElementById("streamTimer");
    const likeCount = document.getElementById("likeCount");

    const screenTitle = document.getElementById("screenTitle");
    const screenText = document.getElementById("screenText");

    let streaming = false;
    let seconds = 0;
    let viewers = 0;
    let likes = 0;
    let timerInterval = null;
    let viewerInterval = null;

    startBtn.addEventListener("click", () => {

        streaming = !streaming;

        if (streaming) {

            status.textContent = "● LIVE";
            status.classList.remove("offline");
            status.classList.add("online");

            startBtn.textContent = "■ Stop Stream";

            screenTitle.textContent = "Roblox Stream is LIVE!";
            screenText.textContent =
                "Gameplay, reactions, challenges and viewer interaction.";

            viewers = 1284;
            seconds = 0;

            updateViewers();
            updateTimer();

            timerInterval = setInterval(() => {

                seconds++;
                updateTimer();

            }, 1000);

            viewerInterval = setInterval(() => {

                viewers += Math.floor(Math.random() * 21) - 8;

                if (viewers < 1) {
                    viewers = 1;
                }

                updateViewers();

            }, 2500);

            showToast("Stream started!");

        } else {

            clearInterval(timerInterval);
            clearInterval(viewerInterval);

            status.textContent = "● OFFLINE";
            status.classList.remove("online");
            status.classList.add("offline");

            startBtn.textContent = "▶ Start Stream";

            screenTitle.textContent = "Stream is offline";
            screenText.textContent =
                "Press Start Stream to begin the simulation.";

            viewerCount.textContent = "0";
            heroViewers.textContent = "1,284";

            showToast("Stream stopped.");

        }

    });


    function updateTimer() {

        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");

        const secs = (seconds % 60)
            .toString()
            .padStart(2, "0");

        timer.textContent = `${minutes}:${secs}`;

    }


    function updateViewers() {

        viewerCount.textContent =
            viewers.toLocaleString();

        heroViewers.textContent =
            viewers.toLocaleString();

    }


    /* =========================
       LIKE BUTTON
    ========================= */

    likeBtn.addEventListener("click", () => {

        likes++;

        likeCount.textContent =
            likes.toLocaleString();

        likeBtn.textContent = "❤️ Liked!";

        setTimeout(() => {
            likeBtn.textContent = "❤️ Like Stream";
        }, 900);

        showToast("Thanks for the like!");

    });


    /* =========================
       SHARE BUTTON
    ========================= */

    shareBtn.addEventListener("click", async () => {

        const shareText =
            "Check out our Roblox Streaming Project!";

        try {

            if (navigator.share) {

                await navigator.share({
                    title: "Roblox Stream",
                    text: shareText
                });

            } else if (navigator.clipboard) {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                showToast("Website link copied!");

            } else {

                showToast("Share this website with your friends!");

            }

        } catch (error) {

            // User cancelled sharing.
        }

    });


    /* =========================
       COMMUNITY POLL
    ========================= */

    const pollButtons =
        document.querySelectorAll(".poll-btn");

    const pollResult =
        document.getElementById("pollResult");

    pollButtons.forEach(button => {

        button.addEventListener("click", () => {

            pollButtons.forEach(btn => {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

            const choice = button.dataset.choice;

            pollResult.textContent =
                `You chose "${choice}"! Thanks for voting.`;

        });

    });


    /* =========================
       NAVIGATION ACTIVE STATE
    ========================= */

    const navLinks =
        document.querySelectorAll(".nav-link");

    const sections =
        document.querySelectorAll("main section[id]");

    const observer =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    navLinks.forEach(link => {
                        link.classList.remove("active");
                    });

                    const active =
                        document.querySelector(
                            `.nav-link[href="#${entry.target.id}"]`
                        );

                    if (active) {
                        active.classList.add("active");
                    }

                }

            });

        }, {
            rootMargin: "-30% 0px -60% 0px"
        });

    sections.forEach(section => {
        observer.observe(section);
    });


    /* =========================
       TOAST
    ========================= */

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    let toastTimeout;

    function showToast(message) {

        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);

    }

});
