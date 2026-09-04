document.addEventListener("DOMContentLoaded", () => {

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  /* =========================
     TOAST
  ========================= */

  function showToast(message) {
    const container = $("#toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }


  /* =========================
     THEME
  ========================= */

  const themeToggle = $("#themeToggle");

  if (localStorage.getItem("robloxTheme") === "light") {
    document.body.classList.add("light-mode");
  }

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    localStorage.setItem(
      "robloxTheme",
      document.body.classList.contains("light-mode")
        ? "light"
        : "dark"
    );

  });


  /* =========================
     MOBILE NAV
  ========================= */

  const mobileMenu = $("#mobileMenu");
  const mainNav = $("#mainNav");

  mobileMenu.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  $$("#mainNav a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
    });
  });


  /* =========================
     GAME DATA
  ========================= */

  const games = [

    {
      name: "Brookhaven RP",
      icon: "🏡",
      category: "roleplay",
      type: "Roleplay",
      value: "High",
      description: "A social roleplay experience based around exploring a town and creating stories.",
      reason: "Viewers can suggest scenarios and react to funny or unexpected moments."
    },

    {
      name: "Adopt Me!",
      icon: "🐶",
      category: "roleplay",
      type: "Social",
      value: "High",
      description: "A social experience involving pets, homes, trading and exploration.",
      reason: "The social gameplay creates many opportunities for audience interaction."
    },

    {
      name: "Blox Fruits",
      icon: "⚔️",
      category: "action",
      type: "Adventure",
      value: "High",
      description: "Explore islands, fight enemies, level up and discover abilities.",
      reason: "Progression and combat give viewers clear goals to follow."
    },

    {
      name: "Murder Mystery 2",
      icon: "🔎",
      category: "competitive",
      type: "Mystery",
      value: "High",
      description: "Players receive different roles and try to figure out what is happening.",
      reason: "Mystery creates suspense and gives the streamer plenty to react to."
    },

    {
      name: "DOORS",
      icon: "🚪",
      category: "horror",
      type: "Horror",
      value: "High",
      description: "Explore a mysterious environment while surviving unexpected encounters.",
      reason: "Unexpected events create natural reactions and memorable moments."
    },

    {
      name: "Tower of Hell",
      icon: "🗼",
      category: "challenge",
      type: "Obby",
      value: "High",
      description: "A difficult obstacle course where players try to reach the top.",
      reason: "The difficulty gives viewers something to root for."
    },

    {
      name: "Arsenal",
      icon: "🎯",
      category: "competitive",
      type: "Action",
      value: "High",
      description: "Fast-paced competitive matches with constantly changing weapons.",
      reason: "Quick rounds keep the stream active and exciting."
    },

    {
      name: "BedWars",
      icon: "🛏️",
      category: "competitive",
      type: "Strategy",
      value: "High",
      description: "Protect your team's bed while gathering resources and fighting opponents.",
      reason: "Teamwork and strategy give the stream a clear objective."
    },

    {
      name: "Piggy",
      icon: "🐷",
      category: "horror",
      type: "Survival",
      value: "High",
      description: "Solve puzzles and escape while trying to survive.",
      reason: "The survival format creates suspense and reactions."
    },

    {
      name: "Dress to Impress",
      icon: "👗",
      category: "roleplay",
      type: "Fashion",
      value: "Medium",
      description: "Create outfits based on themes and compete in fashion rounds.",
      reason: "Viewers can react to outfits and suggest ideas."
    },

    {
      name: "Natural Disaster Survival",
      icon: "🌪️",
      category: "challenge",
      type: "Survival",
      value: "High",
      description: "Try to survive random disasters using quick decisions.",
      reason: "Every round can create a different situation."
    },

    {
      name: "Obby Challenge",
      icon: "🧱",
      category: "challenge",
      type: "Obstacle Course",
      value: "High",
      description: "Test movement, timing and reactions through obstacle courses.",
      reason: "Challenges are simple for viewers to understand and follow."
    }

  ];


  /* =========================
     GAME LIBRARY
  ========================= */

  const gameGrid = $("#gameGrid");
  const noGames = $("#noGames");
  const gameSearch = $("#gameSearch");

  let currentFilter = "all";

  function getFavorites() {
    try {
      return JSON.parse(
        localStorage.getItem("robloxFavorites") || "[]"
      );
    } catch {
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(
      "robloxFavorites",
      JSON.stringify(favorites)
    );
  }

  function renderGames() {

    const search =
      gameSearch.value.toLowerCase().trim();

    const results = games.filter(game => {

      const categoryMatch =
        currentFilter === "all" ||
        game.category === currentFilter;

      const searchMatch =
        game.name.toLowerCase().includes(search) ||
        game.type.toLowerCase().includes(search);

      return categoryMatch && searchMatch;
    });

    gameGrid.replaceChildren();

    noGames.classList.toggle(
      "hidden",
      results.length > 0
    );

    results.forEach(game => {

      const card = document.createElement("article");
      card.className = "game-card";

      const icon = document.createElement("div");
      icon.className = "game-icon";
      icon.textContent = game.icon;

      const title = document.createElement("h3");
      title.textContent = game.name;

      const description = document.createElement("p");
      description.textContent = game.description;

      const category = document.createElement("span");
      category.className = "game-category";
      category.textContent = game.type;

      const actions = document.createElement("div");
      actions.className = "game-actions";

      const viewButton = document.createElement("button");
      viewButton.textContent = "View Details";

      const favoriteButton = document.createElement("button");

      const favorites = getFavorites();

      favoriteButton.textContent =
        favorites.includes(game.name)
          ? "★ Saved"
          : "☆ Save";

      viewButton.addEventListener("click", () => {
        openGameModal(game);
      });

      favoriteButton.addEventListener("click", () => {

        let saved = getFavorites();

        if (saved.includes(game.name)) {

          saved = saved.filter(
            name => name !== game.name
          );

          favoriteButton.textContent = "☆ Save";

          showToast(
            `${game.name} removed from favorites`
          );

        } else {

          saved.push(game.name);

          favoriteButton.textContent = "★ Saved";

          showToast(
            `${game.name} added to favorites`
          );
        }

        saveFavorites(saved);
      });

      actions.appendChild(viewButton);
      actions.appendChild(favoriteButton);

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(category);
      card.appendChild(actions);

      gameGrid.appendChild(card);
    });
  }

  $$(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

      $$(".filter-btn").forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      currentFilter =
        button.dataset.filter;

      renderGames();
    });

  });

  gameSearch.addEventListener(
    "input",
    renderGames
  );

  renderGames();


  /* =========================
     GAME MODAL
  ========================= */

  const gameModal = $("#gameModal");

  let selectedGame = null;

  function openGameModal(game) {

    selectedGame = game;

    $("#modalGameIcon").textContent =
      game.icon;

    $("#modalGameCategory").textContent =
      game.category.toUpperCase();

    $("#modalGameName").textContent =
      game.name;

    $("#modalGameDescription").textContent =
      game.description;

    $("#modalGameType").textContent =
      game.type;

    $("#modalGameValue").textContent =
      game.value;

    $("#modalGameReason").textContent =
      game.reason;

    updateModalFavorite();

    gameModal.classList.add("show");
    gameModal.setAttribute("aria-hidden","false");
  }

  function closeGameModal() {

    gameModal.classList.remove("show");
    gameModal.setAttribute("aria-hidden","true");

  }

  $$("[data-close-modal]").forEach(element => {

    element.addEventListener(
      "click",
      closeGameModal
    );

  });

  function updateModalFavorite() {

    if (!selectedGame) return;

    const favorites = getFavorites();

    const button = $("#modalFavorite");

    if (favorites.includes(selectedGame.name)) {

      button.textContent =
        "★ Remove from Favorites";

    } else {

      button.textContent =
        "☆ Add to Favorites";
    }
  }

  $("#modalFavorite").addEventListener("click", () => {

    if (!selectedGame) return;

    let favorites = getFavorites();

    if (favorites.includes(selectedGame.name)) {

      favorites = favorites.filter(
        name => name !== selectedGame.name
      );

      showToast(
        `${selectedGame.name} removed from favorites`
      );

    } else {

      favorites.push(selectedGame.name);

      showToast(
        `${selectedGame.name} added to favorites`
      );
    }

    saveFavorites(favorites);
    updateModalFavorite();
    renderGames();

  });


  /* =========================
     NEED MODAL
  ========================= */

  const needModal = $("#needModal");

  const needs = {

    entertainment: {
      icon: "🎉",
      title: "Entertainment",
      description:
        "Viewers need fun moments, interesting gameplay, challenges, reactions and commentary that keep the stream enjoyable."
    },

    interaction: {
      icon: "💬",
      title: "Interaction",
      description:
        "Viewers should have opportunities to participate through chat, polls, questions, suggestions and challenges."
    },

    consistency: {
      icon: "📅",
      title: "Consistency",
      description:
        "A consistent style helps viewers understand what kind of experience they can expect from the stream."
    },

    discovery: {
      icon: "🔎",
      title: "Discovery",
      description:
        "Introducing viewers to interesting Roblox experiences can help them discover new games and ideas."
    }

  };

  $$(".need-card").forEach(card => {

    card.addEventListener("click", () => {

      const data =
        needs[card.dataset.need];

      if (!data) return;

      $("#needIcon").textContent =
        data.icon;

      $("#needTitle").textContent =
        data.title;

      $("#needDescription").textContent =
        data.description;

      needModal.classList.add("show");
      needModal.setAttribute("aria-hidden","false");

    });

  });

  $$("[data-close-need]").forEach(element => {

    element.addEventListener("click", () => {

      needModal.classList.remove("show");
      needModal.setAttribute("aria-hidden","true");

    });

  });


  /* =========================
     AUDIENCE
  ========================= */

  const audienceData = {

    players: {
      icon: "🎮",
      title: "Roblox Players",
      description:
        "Players can relate to the games being played and may enjoy discovering strategies, experiences, challenges or new games.",
      points: [
        "✓ Game discovery",
        "✓ Gameplay ideas",
        "✓ Shared interests"
      ]
    },

    viewers: {
      icon: "👀",
      title: "Roblox Viewers",
      description:
        "Viewers can enjoy reactions, commentary, challenges, funny moments and the personality of the streamer.",
      points: [
        "✓ Entertainment",
        "✓ Reactions",
        "✓ Commentary"
      ]
    },

    friends: {
      icon: "👥",
      title: "Social Viewers",
      description:
        "People watching with friends can discuss games, vote in polls, react together and participate in challenges.",
      points: [
        "✓ Group interaction",
        "✓ Polls",
        "✓ Shared reactions"
      ]
    }

  };

  $$(".audience-tab").forEach(tab => {

    tab.addEventListener("click", () => {

      $$(".audience-tab").forEach(item =>
        item.classList.remove("active")
      );

      tab.classList.add("active");

      const data =
        audienceData[tab.dataset.audience];

      if (!data) return;

      $("#audienceIcon").textContent =
        data.icon;

      $("#audienceTitle").textContent =
        data.title;

      $("#audienceDescription").textContent =
        data.description;

      const points =
        $("#audiencePoints");

      points.replaceChildren();

      data.points.forEach(point => {

        const span =
          document.createElement("span");

        span.textContent = point;

        points.appendChild(span);
      });

    });

  });


  /* =========================
     QUALITY ACCORDION
  ========================= */

  $$(".quality-header").forEach(header => {

    header.addEventListener("click", () => {

      const item =
        header.closest(".quality-item");

      item.classList.toggle("open");

    });

  });


  /* =========================
     STREAM DASHBOARD
  ========================= */

  let streamLive = false;
  let streamSeconds = 0;
  let viewers = 0;
  let streamTimer = null;

  let likes =
    Number(
      localStorage.getItem("robloxLikes") || 0
    );

  function formatTime(totalSeconds) {

    const hours =
      Math.floor(totalSeconds / 3600);

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    const seconds =
      totalSeconds % 60;

    return [
      hours,
      minutes,
      seconds
    ]
      .map(value =>
        String(value).padStart(2,"0")
      )
      .join(":");
  }

  function updateDashboard() {

    $("#streamTimer").textContent =
      formatTime(streamSeconds);

    $("#viewerCount").textContent =
      viewers.toLocaleString();

    $("#chatUsers").textContent =
      `${viewers.toLocaleString()} watching`;

    $("#likeCount").textContent =
      likes.toLocaleString();

    $("#sideLikeCount").textContent =
      likes.toLocaleString();

    $("#sideStatus").textContent =
      streamLive ? "Live" : "Offline";
  }

  function startStream() {

    if (streamLive) return;

    streamLive = true;

    streamSeconds = 0;

    viewers =
      Math.floor(Math.random() * 70) + 80;

    $("#streamStatus").textContent =
      "● LIVE";

    $("#streamStatus").className =
      "status live";

    $("#dashboardTitle").textContent =
      "Roblox Community Stream is LIVE!";

    $("#dashboardSubtitle").textContent =
      "Viewers are joining the stream.";

    $("#startStream").textContent =
      "■ Stop Stream";

    updateDashboard();

    streamTimer = setInterval(() => {

      streamSeconds++;

      const change =
        Math.floor(Math.random() * 9) - 3;

      viewers += change;

      if (viewers < 1) {
        viewers = 1;
      }

      updateDashboard();

    },1000);

    startBotChat();

    showToast("🔴 Stream started!");
  }

  function stopStream() {

    if (!streamLive) return;

    streamLive = false;

    clearInterval(streamTimer);
    streamTimer = null;

    stopBotChat();

    $("#streamStatus").textContent =
      "● OFFLINE";

    $("#streamStatus").className =
      "status offline";

    $("#dashboardTitle").textContent =
      "Stream ended.";

    $("#dashboardSubtitle").textContent =
      "Press Start Stream to begin another session.";

    $("#startStream").textContent =
      "▶ Start Stream";

    viewers = 0;

    updateDashboard();

    showToast("⏹️ Stream stopped.");
  }

  $("#startStream").addEventListener(
    "click",
    () => {

      if (streamLive) {
        stopStream();
      } else {
        startStream();
      }

    }
  );


  /* =========================
     LIKES
  ========================= */

  $("#likeButton").addEventListener("click", () => {

    likes++;

    localStorage.setItem(
      "robloxLikes",
      likes
    );

    updateDashboard();

    showToast("❤️ Like added!");

  });


  /* =========================
     SHARE
  ========================= */

  $("#shareButton").addEventListener(
    "click",
    async () => {

      try {

        if (navigator.share) {

          await navigator.share({
            title: "Roblox Streaming Hub",
            text: "Check out our Roblox Streaming Hub!"
          });

        } else if (navigator.clipboard) {

          await navigator.clipboard.writeText(
            window.location.href
          );

          showToast("🔗 Link copied!");

        } else {

          showToast(
            "Copy this page link and share it!"
          );
        }

      } catch {

        showToast("Share cancelled.");

      }

    }
  );


  /* =========================
     POLL
  ========================= */

  $("#pollButton").addEventListener(
    "click",
    () => {

      const selected =
        document.querySelector(
          'input[name="poll"]:checked'
        );

      if (!selected) {

        showToast(
          "Choose a game first!"
        );

        return;
      }

      $("#pollResult").textContent =
        `✓ Vote submitted for ${selected.value}!`;

      showToast("📊 Vote submitted!");

    }
  );


  /* =========================
     RATINGS
  ========================= */

  const ratingButtons =
    $$("#starRating button");

  const ratingText =
    $("#ratingText");

  const savedRating =
    Number(
      localStorage.getItem("robloxRating") || 0
    );

  function updateRating(rating) {

    ratingButtons.forEach(button => {

      button.classList.toggle(
        "active",
        Number(button.dataset.rating) <= rating
      );

    });

    ratingText.textContent =
      rating
        ? `${rating}/5 stars`
        : "Not rated yet";
  }

  ratingButtons.forEach(button => {

    button.addEventListener("click", () => {

      const rating =
        Number(button.dataset.rating);

      localStorage.setItem(
        "robloxRating",
        rating
      );

      updateRating(rating);

      showToast(
        `⭐ You rated it ${rating}/5!`
      );

    });

  });

  updateRating(savedRating);


  /* =========================
     CHAT
  ========================= */

  const chatMessages =
    $("#chatMessages");

  const chatForm =
    $("#chatForm");

  const chatInput =
    $("#chatInput");

  function addChatMessage(
    username,
    message,
    isBot = false
  ) {

    const wrapper =
      document.createElement("div");

    wrapper.className =
      isBot
        ? "chat-message bot-message"
        : "chat-message";

    const avatar =
      document.createElement("span");

    avatar.className = "avatar";

    avatar.textContent =
      username.charAt(0).toUpperCase();

    const content =
      document.createElement("div");

    const name =
      document.createElement("strong");

    name.textContent = username;

    content.appendChild(name);

    if (isBot) {

      const badge =
        document.createElement("span");

      badge.className = "bot-badge";

      badge.textContent = "BOT";

      content.appendChild(badge);
    }

    const text =
      document.createElement("p");

    text.textContent = message;

    content.appendChild(text);

    wrapper.appendChild(avatar);
    wrapper.appendChild(content);

    chatMessages.appendChild(wrapper);

    while (chatMessages.children.length > 45) {
      chatMessages.firstElementChild.remove();
    }

    chatMessages.scrollTop =
      chatMessages.scrollHeight;
  }

  chatForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const message =
        chatInput.value.trim();

      if (!message) return;

      addChatMessage(
        "You",
        message,
        false
      );

      chatInput.value = "";

    }
  );


  /* =========================
     SIMULATED BOTS
  ========================= */

  const bots = [

    {
      name: "Jaymat1210",
      messages: [
        "I'm the goat",
        "W stream",
        "This is actually fire",
        "Easy work 😭"
      ]
    },

    {
      name: "Drossog",
      messages: [
        "tuff",
        "W website",
        "nah this is tuff",
        "Actually fire"
      ]
    },

    {
      name: "Frenchfries",
      messages: [
        "rating this a 6.7",
        "6.7/10",
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
        "bro really said slop 💀",
        "NAHHH 😭",
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

  let botTimeout = null;

  function sendRandomBotMessage() {

    if (!streamLive) return;

    const bot =
      bots[
        Math.floor(
          Math.random() * bots.length
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

  function scheduleBotMessage() {

    if (!streamLive) return;

    const delay =
      Math.floor(
        Math.random() * 3000
      ) + 3000;

    botTimeout =
      setTimeout(() => {

        sendRandomBotMessage();

        scheduleBotMessage();

      },delay);
  }

  function startBotChat() {

    if (botTimeout) return;

    sendRandomBotMessage();

    scheduleBotMessage();
  }

  function stopBotChat() {

    if (botTimeout) {

      clearTimeout(botTimeout);

      botTimeout = null;
    }
  }


  /* =========================
     KEYBOARD CONTROLS
  ========================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") return;

      closeGameModal();

      needModal.classList.remove("show");
      needModal.setAttribute("aria-hidden","true");

    }
  );


  /* =========================
     INITIAL DASHBOARD
  ========================= */

  updateDashboard();

});
