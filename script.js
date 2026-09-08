document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       HELPERS
    ========================= */

    const $ = (selector) => document.querySelector(selector);

    const $$ = (selector) => [
        ...document.querySelectorAll(selector)
    ];


    /* =========================
       GAME DATA
    ========================= */

    const games = [

        {
            name: "Brookhaven RP",
            type: "roleplay",
            icon: "🏙️",
            description: "A social sandbox where spontaneous stories and community interaction happen naturally.",
            energy: "HIGH",
            best: "Social"
        },

        {
            name: "Adopt Me!",
            type: "roleplay",
            icon: "🐾",
            description: "Collect pets, explore the world, trade, and build a community-focused stream.",
            energy: "MEDIUM",
            best: "Community"
        },

        {
            name: "Blox Fruits",
            type: "action",
            icon: "⚔️",
            description: "Progression, combat, exploration, and objectives that keep viewers invested.",
            energy: "HIGH",
            best: "Progression"
        },

        {
            name: "Murder Mystery 2",
            type: "action",
            icon: "🔎",
            description: "Short rounds with simple rules and plenty of opportunities for reactions.",
            energy: "HIGH",
            best: "Reactions"
        },

        {
            name: "DOORS",
            type: "horror",
            icon: "🚪",
            description: "A tense horror experience that naturally creates reaction moments.",
            energy: "HIGH",
            best: "Reactions"
        },

        {
            name: "Tower of Hell",
            type: "obby",
            icon: "🗼",
            description: "Precision platforming with clear challenges and easy viewer stakes.",
            energy: "EXTREME",
            best: "Challenges"
        },

        {
            name: "Arsenal",
            type: "action",
            icon: "🎯",
            description: "Fast matches and competitive gameplay for a high-energy stream.",
            energy: "HIGH",
            best: "Competition"
        },

        {
            name: "BedWars",
            type: "action",
            icon: "🛏️",
            description: "Strategy, teamwork, defense, and clutch moments.",
            energy: "HIGH",
            best: "Team Play"
        },

        {
            name: "Piggy",
            type: "horror",
            icon: "🐷",
            description: "Puzzle-solving and escape gameplay with a strong story element.",
            energy: "MEDIUM",
            best: "Story"
        },

        {
            name: "Dress to Impress",
            type: "roleplay",
            icon: "👗",
            description: "Theme rounds that naturally encourage audience voting.",
            energy: "MEDIUM",
            best: "Voting"
        },

        {
            name: "Natural Disaster Survival",
            type: "action",
            icon: "🌪️",
            description: "Simple objectives with unpredictable moments and reactions.",
            energy: "HIGH",
            best: "Reactions"
        },

        {
            name: "Obby Challenge",
            type: "obby",
            icon: "🧱",
            description: "A straightforward challenge format that works well with viewer dares.",
            energy: "EXTREME",
            best: "Challenges"
        }

    ];


    /* =========================
       STREAM STATE
    ========================= */

    let isLive = false;

    let streamSeconds = 0;

    let viewerCount = 0;

    let streamTimer = null;

    let botTimer = null;

    let selectedGame = games[0];

    let likes = Number(
        localStorage.getItem("rshLikes") || 0
    );


    /* =========================
       BOT CONVERSATIONS
    ========================= */

    const conversations = [

        [
            ["Aylmer", "BRO the lobby is already wild"],
            ["Keysha", "let chat choose the next move"],
            ["Jayden", "nah this is about to go bad"],
            ["Denise", "I voted risk 😭"],
            ["Aylmer", "we are NOT surviving this"]
        ],

        [
            ["Drossog", "wait that actually worked"],
            ["Frenchfries", "chat is cooking today"],
            ["Keysha", "Ash look behind you"],
            ["Jaymat1210", "BRO 💀"],
            ["Scrappy", "classic stream moment"]
        ],

        [
            ["Ash", "okay buddy"],
            ["Aylmer", "six seven"],
            ["Jayden", "HAHAHAHA"],
            ["Keysha", "stop staring at me"],
            ["Denise", "someone clip that"]
        ]

    ];

    let currentConversation = 0;

    let currentMessage = 0;


    /* =========================
       TOAST
    ========================= */

    function showToast(message) {

        const toast = document.createElement("div");

        toast.className = "toast";

        toast.innerHTML = `
            <strong>RSH</strong> · ${message}
        `;

        $("#toastWrap").appendChild(toast);

        setTimeout(() => {

            toast.remove();

        }, 2600);
    }


    /* =========================
       HTML ESCAPE
    ========================= */

    function escapeHTML(text) {

        return text.replace(
            /[&<>"']/g,
            char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            })[char]
        );

    }


    /* =========================
       GAME LIBRARY
    ========================= */

    function renderGames() {

        const search =
            $("#gameSearch").value
                .toLowerCase()
                .trim();

        const filter =
            $("#gameFilter").value;


        const savedGames =
            JSON.parse(
                localStorage.getItem("rshFavorites") || "[]"
            );


        const filteredGames =
            games.filter(game => {

                const matchesSearch =
                    game.name
                        .toLowerCase()
                        .includes(search);

                const matchesFilter =
                    filter === "all" ||
                    game.type === filter;

                return matchesSearch && matchesFilter;

            });


        $("#gameGrid").innerHTML =
            filteredGames.map(game => {

                const gameIndex =
                    games.indexOf(game);

                const favorite =
                    savedGames.includes(game.name);


                return `

                    <article
                        class="game-card"
                        data-index="${gameIndex}"
                    >

                        <button
                            class="favorite-button ${favorite ? "active" : ""}"
                            data-favorite="${game.name}"
                        >
                            ★
                        </button>


                        <div class="game-thumbnail">

                            <div class="game-symbol">
                                ${game.icon}
                            </div>

                        </div>


                        <div class="game-card-content">

                            <h3>
                                ${game.name}
                            </h3>

                            <p>
                                ${game.description}
                            </p>

                            <div class="game-meta">
                                ${game.type.toUpperCase()}
                                ·
                                ${game.energy}
                            </div>

                        </div>

                    </article>

                `;

            }).join("");


        $$(".game-card").forEach(card => {

            card.addEventListener("click", event => {

                if (
                    event.target.closest(
                        ".favorite-button"
                    )
                ) {
                    return;
                }

                openGame(
                    Number(card.dataset.index)
                );

            });

        });


        $$(".favorite-button").forEach(button => {

            button.addEventListener("click", event => {

                event.stopPropagation();

                let favorites =
                    JSON.parse(
                        localStorage.getItem(
                            "rshFavorites"
                        ) || "[]"
                    );

                const game =
                    button.dataset.favorite;


                if (favorites.includes(game)) {

                    favorites =
                        favorites.filter(
                            item => item !== game
                        );

                    button.classList.remove(
                        "active"
                    );

                    showToast(
                        `${game} removed from favorites.`
                    );

                } else {

                    favorites.push(game);

                    button.classList.add(
                        "active"
                    );

                    showToast(
                        `${game} saved to favorites.`
                    );

                }


                localStorage.setItem(
                    "rshFavorites",
                    JSON.stringify(favorites)
                );

            });

        });

    }


    /* =========================
       GAME MODAL
    ========================= */

    function openGame(index) {

        selectedGame = games[index];

        $("#modalTitle").textContent =
            selectedGame.name;

        $("#modalDescription").textContent =
            selectedGame.description;

        $("#modalType").textContent =
            selectedGame.type.toUpperCase();

        $("#modalEnergy").textContent =
            selectedGame.energy;

        $("#modalBest").textContent =
            selectedGame.best;

        $("#gameModal").classList.add("open");

    }


    /* =========================
       UPDATE STREAM UI
    ========================= */

    function updateStreamUI() {

        $("#statStatus").textContent =
            isLive ? "LIVE" : "OFFLINE";

        $("#statStatusText").textContent =
            isLive
                ? "Broadcasting now"
                : "Not broadcasting";


        $("#viewerCount").textContent =
            isLive
                ? viewerCount.toLocaleString()
                : "0";

        $("#sideViewerCount").textContent =
            isLive
                ? viewerCount.toLocaleString()
                : "0";


        $("#sideStatus").textContent =
            isLive
                ? "LIVE"
                : "OFFLINE";


        $("#streamTimer").textContent =
            formatTime(streamSeconds);


        $("#chatUsers").textContent =
            isLive
                ? `${viewerCount.toLocaleString()} WATCHING`
                : "0 WATCHING";


        $("#likeCount").textContent =
            likes;

        $("#sideLikeCount").textContent =
            likes;


        $("#offlineScreen")
            .classList.toggle(
                "live",
                isLive
            );


        $("#startStream").disabled =
            isLive;

        $("#startStream").textContent =
            isLive
                ? "STREAM LIVE"
                : "Start Stream";


        $("#chatInput").disabled =
            !isLive;

        $("#chatInput").placeholder =
            isLive
                ? "Say something..."
                : "Go live to chat...";

    }


    /* =========================
       TIME FORMAT
    ========================= */

    function formatTime(totalSeconds) {

        const hours =
            Math.floor(totalSeconds / 3600);

        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );

        const seconds =
            totalSeconds % 60;


        if (hours > 0) {

            return [
                hours,
                minutes,
                seconds
            ]
                .map(
                    value =>
                        String(value).padStart(2, "0")
                )
                .join(":");

        }


        return [
            minutes,
            seconds
        ]
            .map(
                value =>
                    String(value).padStart(2, "0")
            )
            .join(":");

    }


    /* =========================
       CHAT
    ========================= */

    function addChatMessage(
        username,
        message,
        isBot = false
    ) {

        $("#emptyChat")?.remove();


        const messageElement =
            document.createElement("div");

        messageElement.className =
            "chat-message";


        messageElement.innerHTML = `

            <div class="chat-name">

                ${escapeHTML(username)}

                ${
                    isBot
                        ? `<span class="bot-badge">BOT</span>`
                        : ""
                }

            </div>

            <div class="chat-text">
                ${escapeHTML(message)}
            </div>

        `;


        $("#chatMessages")
            .appendChild(messageElement);


        $("#chatMessages").scrollTop =
            $("#chatMessages").scrollHeight;

    }


    /* =========================
       BOT CHAT
    ========================= */

    function sendBotMessage() {

        if (!isLive) {
            return;
        }


        const conversation =
            conversations[
                currentConversation
            ];


        const message =
            conversation[currentMessage];


        addChatMessage(
            message[0],
            message[1],
            true
        );


        currentMessage++;


        if (
            currentMessage >=
            conversation.length
        ) {

            currentMessage = 0;

            currentConversation =
                (currentConversation + 1)
                % conversations.length;

        }


        botTimer =
            setTimeout(
                sendBotMessage,
                1800 +
                Math.random() * 2200
            );

    }


    /* =========================
       START STREAM
    ========================= */

    function startStream() {

        if (isLive) {
            return;
        }


        isLive = true;

        streamSeconds = 0;

        viewerCount =
            1100 +
            Math.floor(
                Math.random() * 400
            );


        currentConversation =
            Math.floor(
                Math.random() *
                conversations.length
            );

        currentMessage = 0;


        showToast(
            "Your stream is now live."
        );


        updateStreamUI();


        streamTimer =
            setInterval(() => {

                streamSeconds++;


                viewerCount =
                    Math.max(
                        0,
                        viewerCount +
                        Math.floor(
                            Math.random() * 25
                        ) - 11
                    );


                updateStreamUI();

            }, 1000);


        botTimer =
            setTimeout(
                sendBotMessage,
                900
            );

    }


    /* =========================
       STOP STREAM
    ========================= */

    function stopStream() {

        isLive = false;

        clearInterval(streamTimer);

        clearTimeout(botTimer);


        streamTimer = null;

        botTimer = null;


        streamSeconds = 0;

        viewerCount = 0;


        $("#chatMessages").innerHTML = `

            <div
                class="empty-chat"
                id="emptyChat"
            >

                <div>◌</div>

                <strong>
                    The room is quiet.
                </strong>

                <span>
                    Start the stream to open the conversation.
                </span>

            </div>

        `;


        showToast(
            "Stream stopped and session reset."
        );


        updateStreamUI();

    }


    /* =========================
       LIKE
    ========================= */

    $("#likeButton")
        .addEventListener(
            "click",
            () => {

                if (!isLive) {

                    showToast(
                        "Go live before reacting."
                    );

                    return;
                }


                likes++;

                localStorage.setItem(
                    "rshLikes",
                    likes
                );


                updateStreamUI();


                showToast(
                    "Like sent to the stream."
                );

            }
        );


    /* =========================
       SHARE
    ========================= */

    $("#shareButton")
        .addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard
                        .writeText(
                            window.location.href
                        );

                    showToast(
                        "Stream link copied."
                    );

                } catch {

                    showToast(
                        "Share link ready."
                    );

                }

            }
        );


    /* =========================
       CHAT FORM
    ========================= */

    $("#chatForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (!isLive) {

                    showToast(
                        "Chat is locked while offline."
                    );

                    return;
                }


                const message =
                    $("#chatInput")
                        .value
                        .trim();


                if (!message) {
                    return;
                }


                addChatMessage(
                    "You",
                    message,
                    false
                );


                $("#chatInput").value = "";

            }
        );


    /* =========================
       POLL
    ========================= */

    const pollVotes = {
        optionA: 0,
        optionB: 0,
        optionC: 0
    };


    $$("[data-poll]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (!isLive) {

                        showToast(
                            "Start the stream before voting."
                        );

                        return;
                    }


                    const option =
                        button.dataset.poll;


                    pollVotes[option]++;


                    const total =
                        Object.values(
                            pollVotes
                        )
                        .reduce(
                            (sum, value) =>
                                sum + value,
                            0
                        );


                    $$("[data-poll]")
                        .forEach(
                            pollButton => {

                                const key =
                                    pollButton.dataset.poll;

                                const percentage =
                                    Math.round(
                                        (
                                            pollVotes[key] /
                                            total
                                        ) * 100
                                    );


                                pollButton
                                    .querySelector("b")
                                    .textContent =
                                    `${percentage}%`;

                            }
                        );


                    $("#pollHint").textContent =
                        `${total} vote${
                            total === 1
                                ? ""
                                : "s"
                        } recorded`;


                    showToast(
                        "Vote counted."
                    );

                }
            );

        }
    );


    /* =========================
       AUDIENCE
    ========================= */

    const audienceData = {

        core: {
            title: "Core viewers",
            text: "These are viewers who already understand your style and are most likely to participate in polls, chat, and recurring stream activities.",
            stat: "High interaction",
            best: "Chat + community"
        },

        new: {
            title: "New viewers",
            text: "New viewers need context quickly. Make the game, goal, and reason to stay obvious within the first few moments.",
            stat: "Discovery",
            best: "Clear hooks"
        },

        returning: {
            title: "Returning viewers",
            text: "Returning viewers are familiar with the stream. Recurring challenges and community choices give them another reason to come back.",
            stat: "Strong loyalty",
            best: "Recurring segments"
        }

    };


    function showAudience(type) {

        const data =
            audienceData[type];


        $("#audienceDetail").innerHTML = `

            <h3>
                ${data.title}
            </h3>

            <p>
                ${data.text}
            </p>

            <div class="audience-stat">

                <span>
                    ${data.stat}
                </span>

                <strong>
                    ${data.best}
                </strong>

            </div>

        `;

    }


    $$("[data-audience]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    $$("[data-audience]")
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    showAudience(
                        button.dataset.audience
                    );

                }
            );

        }
    );


    /* =========================
       GAME SEARCH
    ========================= */

    $("#gameSearch")
        .addEventListener(
            "input",
            renderGames
        );


    $("#gameFilter")
        .addEventListener(
            "change",
            renderGames
        );


    /* =========================
       SELECT GAME
    ========================= */

    $("#selectGame")
        .addEventListener(
            "click",
            () => {

                $("#previewGame")
                    .textContent =
                    selectedGame.name;


                $("#currentGame")
                    .textContent =
                    selectedGame.name;


                $("#gameModal")
                    .classList.remove(
                        "open"
                    );


                showToast(
                    `${selectedGame.name} selected.`
                );

            }
        );


    /* =========================
       CLOSE MODAL
    ========================= */

    $$("[data-close]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    $(
                        `#${button.dataset.close}`
                    )
                        .classList.remove(
                            "open"
                        );

                }
            );

        }
    );


    $("#gameModal")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "gameModal"
                ) {

                    event.currentTarget
                        .classList.remove(
                            "open"
                        );

                }

            }
        );


    /* =========================
       THEME
    ========================= */

    $("#themeToggle")
        .addEventListener(
            "click",
            () => {

                document.body
                    .classList.toggle(
                        "light"
                    );


                $("#themeToggle")
                    .textContent =
                    document.body.classList.contains(
                        "light"
                    )
                        ? "☀"
                        : "☾";

            }
        );


    /* =========================
       BUTTONS
    ========================= */

    $("#startStream")
        .addEventListener(
            "click",
            startStream
        );


    $("#stopStream")
        .addEventListener(
            "click",
            stopStream
        );


    /* =========================
       INITIALIZE
    ========================= */

    renderGames();

    showAudience("core");

    updateStreamUI();

});
