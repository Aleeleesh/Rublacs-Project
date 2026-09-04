/* =========================================================
   ROBLOX STREAMING HUB
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const toastContainer =
    document.getElementById("toastContainer");

  const themeToggle =
    document.getElementById("themeToggle");

  const mobileMenu =
    document.getElementById("mobileMenu");

  const mainNav =
    document.getElementById("mainNav");

  const gameGrid =
    document.getElementById("gameGrid");

  const gameSearch =
    document.getElementById("gameSearch");

  const filterButtons =
    document.getElementById("filterButtons");

  const noGames =
    document.getElementById("noGames");

  const gameModal =
    document.getElementById("gameModal");

  const needModal =
    document.getElementById("needModal");

  const startStreamBtn =
    document.getElementById("startStream");

  const likeButton =
    document.getElementById("likeButton");

  const shareButton =
    document.getElementById("shareButton");

  const pollButton =
    document.getElementById("pollButton");

  const pollResult =
    document.getElementById("pollResult");

  const chatMessages =
    document.getElementById("chatMessages");

  const chatForm =
    document.getElementById("chatForm");

  const chatInput =
    document.getElementById("chatInput");

  const starRating =
    document.getElementById("starRating");


  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message) {

    const toast =
      document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3100);
  }


  /* =======================================================
     THEME
     ======================================================= */

  const savedTheme =
    localStorage.getItem("robloxTheme");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const isLight =
      document.body.classList.contains("light-theme");

    localStorage.setItem(
      "robloxTheme",
      isLight ? "light" : "dark"
    );

    showToast(
      isLight
        ? "Light theme enabled."
        : "Dark theme enabled."
    );
  });


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  mobileMenu.addEventListener("click", () => {

    const isOpen =
      mainNav.classList.toggle("open");

    mobileMenu.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });


  mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("open");

      mobileMenu.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });


  /* =======================================================
     GAME DATA
     ======================================================= */

  const games = [

    {
      id: "brookhaven",
      name: "Brookhaven RP",
      category: "roleplay",
      icon: "🏡",
      type: "Roleplay",
      value: "High",
      description:
        "A social roleplay experience where players can create stories and interact with others.",
      reason:
        "It gives the streamer many opportunities for funny situations, viewer suggestions, and collaborative roleplay."
    },

    {
      id: "adoptme",
      name: "Adopt Me!",
      category: "roleplay",
      icon: "🐶",
      type: "Roleplay",
      value: "High",
      description:
        "A social experience focused on pets, customization, trading, and exploring.",
      reason:
        "The variety of activities makes it easy to create casual and interactive content."
    },

    {
      id: "bloxfruits",
      name: "Blox Fruits",
      category: "action",
      icon: "⚔️",
      type: "Action",
      value: "Very High",
      description:
        "An action-focused adventure involving combat, progression, exploration, and abilities.",
      reason:
        "Progression and combat naturally create goals, challenges, reactions, and exciting moments."
    },

    {
      id: "mm2",
      name: "Murder Mystery 2",
      category: "competitive",
      icon: "🔎",
      type: "Competitive",
      value: "Very High",
      description:
        "A round-based mystery game where players take different roles.",
      reason:
        "Every round can create suspense, reactions, predictions, and funny interactions."
    },

    {
      id: "doors",
      name: "DOORS",
      category: "horror",
      icon: "🚪",
      type: "Horror",
      value: "Very High",
      description:
        "A horror adventure where players progress through rooms while dealing with threats.",
      reason:
        "Unexpected moments and reactions can make the stream entertaining for viewers."
    },

    {
      id: "towerofhell",
      name: "Tower of Hell",
      category: "challenge",
      icon: "🗼",
      type: "Challenge",
      value: "High",
      description:
        "An obstacle-course experience that tests movement and timing.",
      reason:
        "Failure, progress, and difficult sections create natural challenges for a stream."
    },

    {
      id: "arsenal",
      name: "Arsenal",
      category: "competitive",
      icon: "🎯",
      type: "Competitive",
      value: "Very High",
      description:
        "A fast-paced competitive shooter experience.",
      reason:
        "Quick rounds and changing situations create plenty of reactions and competitive moments."
    },

    {
      id: "bedwars",
      name: "BedWars",
      category: "competitive",
      icon: "🛏️",
      type: "Competitive",
      value: "Very High",
      description:
        "A team-based competitive game involving bases, resources, and combat.",
      reason:
        "Teamwork and objectives give the stream clear goals and opportunities for challenges."
    },

    {
      id: "piggy",
      name: "Piggy",
      category: "horror",
      icon: "🐷",
      type: "Horror",
      value: "High",
      description:
        "A suspenseful adventure involving puzzles, objectives, and escaping danger.",
      reason:
        "The story and suspense provide natural opportunities for reactions and discussion."
    },

    {
      id: "dress",
      name: "Dress to Impress",
      category: "roleplay",
      icon: "👗",
      type: "Social",
      value: "High",
      description:
        "A fashion competition where players create outfits around different themes.",
      reason:
        "Viewers can participate by suggesting themes, rating outfits, and reacting to results."
    },

    {
      id: "naturaldisaster",
      name: "Natural Disaster Survival",
      category: "challenge",
      icon: "🌪️",
      type: "Survival",
      value: "High",
      description:
        "Players attempt to survive different environmental disasters.",
      reason:
        "Each round changes the situation, making it easy to create unpredictable moments."
    },

    {
      id: "obby",
      name: "Obby Challenge",
      category: "challenge",
      icon: "🏃",
      type: "Challenge",
      value: "High",
      description:
        "An obstacle-course style challenge focused on movement and timing.",
      reason:
        "The streamer can set completion goals and let viewers react to progress or failure."
    }

  ];


  /* =======================================================
     FAVORITES
     ======================================================= */

  let favorites = [];

  try {

    const savedFavorites =
      JSON.parse(
        localStorage.getItem("robloxFavorites")
      );

    if (Array.isArray(savedFavorites)) {
      favorites = savedFavorites;
    }

  } catch {
    favorites = [];
  }


  function saveFavorites() {

    localStorage.setItem(
      "robloxFavorites",
      JSON.stringify(favorites)
    );

  }


  function isFavorite(gameId) {
    return favorites.includes(gameId);
  }


  /* =======================================================
     GAME CARDS
     ======================================================= */

  let currentFilter = "all";
  let currentSearch = "";


  function renderGames() {

    gameGrid.textContent = "";

    const search =
      currentSearch.trim().toLowerCase();

    const filtered =
      games.filter(game => {

        const matchesFilter =
          currentFilter === "all" ||
          game.category === currentFilter;

        const matchesSearch =
          !search ||
          game.name.toLowerCase().includes(search) ||
          game.description.toLowerCase().includes(search) ||
          game.category.toLowerCase().includes(search);

        return matchesFilter && matchesSearch;

      });


    noGames.classList.toggle(
      "hidden",
      filtered.length !== 0
    );


    filtered.forEach(game => {

      const card =
        document.createElement("article");

      card.className = "game-card";


      const top =
        document.createElement("div");

      top.className = "game-card-top";


      const icon =
        document.createElement("div");

      icon.className = "game-icon";
      icon.textContent = game.icon;


      const category =
        document.createElement("span");

      category.className = "game-category";
      category.textContent = game.category;


      top.appendChild(icon);
      top.appendChild(category);


      const title =
        document.createElement("h3");

      title.textContent = game.name;


      const description =
        document.createElement("p");

      description.textContent =
        game.description;


      const actions =
        document.createElement("div");

      actions.className = "game-actions";


      const viewButton =
        document.createElement("button");

      viewButton.className = "view-game";
      viewButton.textContent = "View";


      viewButton.addEventListener("click", () => {
        openGameModal(game);
      });


      const favoriteButton =
        document.createElement("button");

      favoriteButton.className = "favorite-game";

      updateFavoriteButton(
        favoriteButton,
        game
      );


      favoriteButton.addEventListener(
        "click",
        () => {

          toggleFavorite(
            game,
            favoriteButton
          );

        }
      );


      actions.appendChild(viewButton);
      actions.appendChild(favoriteButton);


      card.appendChild(top);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(actions);

      gameGrid.appendChild(card);

    });

  }


  function updateFavoriteButton(
    button,
    game
  ) {

    if (isFavorite(game.id)) {

      button.classList.add("saved");
      button.textContent = "★ Saved";

    } else {

      button.classList.remove("saved");
      button.textContent = "☆ Favorite";

    }

  }


  function toggleFavorite(
    game,
    button
  ) {

    if (isFavorite(game.id)) {

      favorites =
        favorites.filter(
          id => id !== game.id
        );

      showToast(
        `${game.name} removed from favorites.`
      );

    } else {

      favorites.push(game.id);

      showToast(
        `${game.name} added to favorites.`
      );

    }

    saveFavorites();

    updateFavoriteButton(
      button,
      game
    );

  }


  gameSearch.addEventListener(
    "input",
    event => {

      currentSearch =
        event.target.value;

      renderGames();

    }
  );


  filterButtons.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          ".filter-btn"
        );

      if (!button) return;

      currentFilter =
        button.dataset.filter;

      filterButtons
        .querySelectorAll(".filter-btn")
        .forEach(btn => {
          btn.classList.remove("active");
        });

      button.classList.add("active");

      renderGames();

    }
  );


  /* =======================================================
     GAME MODAL
     ======================================================= */

  let selectedGame = null;


  function openGameModal(game) {

    selectedGame = game;

    document.getElementById(
      "modalGameIcon"
    ).textContent = game.icon;

    document.getElementById(
      "modalGameCategory"
    ).textContent =
      game.category.toUpperCase();

    document.getElementById(
      "modalGameName"
    ).textContent = game.name;

    document.getElementById(
      "modalGameDescription"
    ).textContent =
      game.description;

    document.getElementById(
      "modalGameType"
    ).textContent =
      game.type;

    document.getElementById(
      "modalGameValue"
    ).textContent =
      game.value;

    document.getElementById(
      "modalGameReason"
    ).textContent =
      game.reason;

    updateModalFavorite();

    gameModal.classList.add("open");
    gameModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";

  }


  function closeGameModal() {

    gameModal.classList.remove("open");

    gameModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

  }


  function updateModalFavorite() {

    const button =
      document.getElementById(
        "modalFavorite"
      );

    if (!selectedGame) return;

    if (isFavorite(selectedGame.id)) {

      button.textContent =
        "★ Remove from Favorites";

    } else {

      button.textContent =
        "☆ Add to Favorites";

    }

  }


  document.querySelectorAll(
    "[data-close-modal]"
  ).forEach(element => {

    element.addEventListener(
      "click",
      closeGameModal
    );

  });


  document.getElementById(
    "modalFavorite"
  ).addEventListener(
    "click",
    () => {

      if (!selectedGame) return;

      if (isFavorite(selectedGame.id)) {

        favorites =
          favorites.filter(
            id => id !== selectedGame.id
          );

        showToast(
          `${selectedGame.name} removed from favorites.`
        );

      } else {

        favorites.push(
          selectedGame.id
        );

        showToast(
          `${selectedGame.name} added to favorites.`
        );

      }

      saveFavorites();

      updateModalFavorite();

      renderGames();

    }
  );


  /* =======================================================
     STREAM STATE
     ======================================================= */

  let isLive = false;
  let streamSeconds = 0;
  let streamTimerId = null;
  let viewerCount = 0;


  function formatTime(seconds) {

    const hours =
      Math.floor(seconds / 3600);

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;

    return [
      hours,
      minutes,
      secs
    ]
      .map(value =>
        String(value).padStart(2, "0")
      )
      .join(":");

  }


  function updateStreamUI() {

    const streamStatus =
      document.getElementById(
        "streamStatus"
      );

    const sideStatus =
      document.getElementById(
        "sideStatus"
      );

    const dashboardTitle =
      document.getElementById(
        "dashboardTitle"
      );

    const viewerElement =
      document.getElementById(
        "viewerCount"
      );

    const chatUsers =
      document.getElementById(
        "chatUsers"
      );

    const streamTimer =
      document.getElementById(
        "streamTimer"
      );


    streamTimer.textContent =
      formatTime(streamSeconds);


    viewerElement.textContent =
      isLive
        ? viewerCount.toLocaleString()
        : "0";


    chatUsers.textContent =
      isLive
        ? `${viewerCount.toLocaleString()} watching`
        : "0 watching";


    if (isLive) {

      streamStatus.textContent =
        "● LIVE";

      streamStatus.className =
        "status live";

      sideStatus.textContent =
        "Live";

      dashboardTitle.textContent =
        "Roblox Community Stream is LIVE";

    } else {

      streamStatus.textContent =
        "● OFFLINE";

      streamStatus.className =
        "status offline";

      sideStatus.textContent =
        "Offline";

      dashboardTitle.textContent =
        "Waiting to start...";

    }

  }


  function startStream() {

    if (isLive) {

      stopStream();
      return;

    }


    isLive = true;

    streamSeconds = 0;

    viewerCount =
      1100 +
      Math.floor(
        Math.random() * 400
      );


    startStreamBtn.textContent =
      "■ Stop Stream";


    updateStreamUI();


    streamTimerId =
      setInterval(() => {

        if (!isLive) return;

        streamSeconds++;

        const change =
          Math.floor(
            Math.random() * 31
          ) - 15;

        viewerCount =
          Math.max(
            0,
            viewerCount + change
          );

        updateStreamUI();

      }, 1000);


    startBotChat();

    showToast(
      "🔴 Stream started!"
    );

  }


  function stopStream() {

    isLive = false;


    if (streamTimerId !== null) {

      clearInterval(
        streamTimerId
      );

      streamTimerId = null;

    }


    stopBotChat();

    startStreamBtn.textContent =
      "▶ Start Stream";

    viewerCount = 0;

    updateStreamUI();

    showToast(
      "Stream stopped."
    );

  }


  startStreamBtn.addEventListener(
    "click",
    startStream
  );


  /* =======================================================
     LIKES
     ======================================================= */

  let likeCount =
    Number(
      localStorage.getItem(
        "robloxLikes"
      )
    ) || 0;


  function updateLikes() {

    document.getElementById(
      "likeCount"
    ).textContent =
      likeCount.toLocaleString();

    document.getElementById(
      "sideLikeCount"
    ).textContent =
      likeCount.toLocaleString();

  }


  likeButton.addEventListener(
    "click",
    () => {

      likeCount++;

      localStorage.setItem(
        "robloxLikes",
        String(likeCount)
      );

      updateLikes();

      showToast(
        "❤️ Like added!"
      );

    }
  );


  updateLikes();


  /* =======================================================
     SHARE
     ======================================================= */

  shareButton.addEventListener(
    "click",
    async () => {

      const shareData = {
        title: "Roblox Streaming Hub",
        text:
          "Check out our Roblox Streaming Hub school project!",
        url: window.location.href
      };


      try {

        if (
          navigator.share
        ) {

          await navigator.share(
            shareData
          );

          showToast(
            "Thanks for sharing!"
          );

        } else if (
          navigator.clipboard
        ) {

          await navigator.clipboard.writeText(
            window.location.href
          );

          showToast(
            "Link copied to clipboard!"
          );

        } else {

          showToast(
            "Sharing isn't available here."
          );

        }

      } catch (error) {

        if (
          error &&
          error.name !== "AbortError"
        ) {

          showToast(
            "Couldn't share right now."
          );

        }

      }

    }
  );


  /* =======================================================
     POLL
     ======================================================= */

  pollButton.addEventListener(
    "click",
    () => {

      const selected =
        document.querySelector(
          'input[name="poll"]:checked'
        );


      if (!selected) {

        showToast(
          "Choose a game first."
        );

        return;

      }


      pollResult.textContent =
        `${selected.value} received your vote!`;

      showToast(
        "Vote submitted!"
      );

    }
  );


  /* =======================================================
     AUDIENCE
     ======================================================= */

  const audienceData = {

    players: {
      icon: "🎮",
      title: "Roblox Players",
      description:
        "Players can relate to the games being played and may enjoy discovering strategies, experiences, challenges, or new games.",
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
        "Viewers who enjoy watching gameplay can follow entertaining moments, reactions, commentary, and challenges without playing themselves.",
      points: [
        "✓ Entertainment",
        "✓ Reactions",
        "✓ Interesting gameplay"
      ]
    },

    friends: {
      icon: "👥",
      title: "Social Viewers",
      description:
        "People watching with friends can enjoy shared jokes, discussions, polls, challenges, and moments that encourage everyone to participate.",
      points: [
        "✓ Group interaction",
        "✓ Polls",
        "✓ Shared reactions"
      ]
    }

  };


  document.querySelectorAll(
    ".audience-tab"
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const type =
          button.dataset.audience;

        const data =
          audienceData[type];

        if (!data) return;


        document.querySelectorAll(
          ".audience-tab"
        ).forEach(tab => {
          tab.classList.remove("active");
        });

        button.classList.add("active");


        const display =
          document.getElementById(
            "audienceDisplay"
          );

        display.querySelector(
          ".big-icon"
        ).textContent =
          data.icon;

        display.querySelector(
          "h3"
        ).textContent =
          data.title;

        display.querySelector(
          "p"
        ).textContent =
          data.description;


        const points =
          display.querySelector(
            ".audience-points"
          );

        points.textContent = "";

        data.points.forEach(point => {

          const span =
            document.createElement("span");

          span.textContent = point;

          points.appendChild(span);

        });

      }
    );

  });


  /* =======================================================
     VIEWER NEEDS
     ======================================================= */

  const needs = {

    entertainment: {
      icon: "🎉",
      title: "Entertainment",
      description:
        "Viewers need content that is enjoyable and interesting. Funny moments, challenges, reactions, and engaging commentary can help make gameplay entertaining."
    },

    interaction: {
      icon: "💬",
      title: "Interaction",
      description:
        "Viewers often enjoy having a way to participate. Chat, polls, questions, and suggestions can make them feel involved in the stream."
    },

    consistency: {
      icon: "📅",
      title: "Consistency",
      description:
        "A consistent style and reliable stream experience can help viewers know what to expect while still allowing different games and activities."
    },

    discovery: {
      icon: "🔎",
      title: "Discovery",
      description:
        "A stream can help viewers discover Roblox games and experiences they may not have tried before."
    }

  };


  document.querySelectorAll(
    ".need-card"
  ).forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const type =
          card.dataset.need;

        const data =
          needs[type];

        if (!data) return;


        document.getElementById(
          "needIcon"
        ).textContent =
          data.icon;

        document.getElementById(
          "needTitle"
        ).textContent =
          data.title;

        document.getElementById(
          "needDescription"
        ).textContent =
          data.description;


        needModal.classList.add(
          "open"
        );

        needModal.setAttribute(
          "aria-hidden",
          "false"
        );

        document.body.style.overflow =
          "hidden";

      }
    );

  });


  function closeNeedModal() {

    needModal.classList.remove(
      "open"
    );

    needModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";

  }


  document.querySelectorAll(
    "[data-close-need]"
  ).forEach(element => {

    element.addEventListener(
      "click",
      closeNeedModal
    );

  });


  /* =======================================================
     QUALITY ACCORDION
     ======================================================= */

  document.querySelectorAll(
    ".quality-header"
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const item =
          button.closest(
            ".quality-item"
          );

        if (!item) return;

        item.classList.toggle(
          "open"
        );

      }
    );

  });


  /* =======================================================
     RATINGS
     ======================================================= */

  let savedRating =
    Number(
      localStorage.getItem(
        "robloxRating"
      )
    ) || 0;


  function updateRatingDisplay() {

    const stars =
      starRating.querySelectorAll(
        "button"
      );


    stars.forEach(star => {

      const rating =
        Number(
          star.dataset.rating
        );

      star.classList.toggle(
        "active",
        rating <= savedRating
      );

    });


    const ratingText =
      document.getElementById(
        "ratingText"
      );


    ratingText.textContent =
      savedRating
        ? `${savedRating}/5 — Thanks for rating!`
        : "Not rated yet";

  }


  starRating.querySelectorAll(
    "button"
  ).forEach(star => {

    star.addEventListener(
      "click",
      () => {

        savedRating =
          Number(
            star.dataset.rating
          );

        localStorage.setItem(
          "robloxRating",
          String(savedRating)
        );

        updateRatingDisplay();

        showToast(
          `Rated ${savedRating}/5!`
        );

      }
    );

  });


  updateRatingDisplay();


  /* =======================================================
     CHAT
     ======================================================= */

  function addChatMessage(
    username,
    message,
    isBot = false
  ) {

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "chat-message";

    if (isBot) {
      wrapper.classList.add(
        "bot-message"
      );
    }


    const avatar =
      document.createElement("span");

    avatar.className =
      "avatar";

    avatar.textContent =
      username
        .charAt(0)
        .toUpperCase();


    const content =
      document.createElement("div");


    const name =
      document.createElement("strong");

    name.textContent =
      username;


    if (isBot) {

      const badge =
        document.createElement("span");

      badge.className =
        "bot-badge";

      badge.textContent =
        "BOT";

      name.appendChild(badge);

    }


    const text =
      document.createElement("p");

    text.textContent =
      message;


    content.appendChild(name);
    content.appendChild(text);

    wrapper.appendChild(avatar);
    wrapper.appendChild(content);

    chatMessages.appendChild(
      wrapper
    );


    while (
      chatMessages.children.length > 60
    ) {

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


  /* =======================================================
     BOT CHAT
     ======================================================= */

  const botMessages = [

    {
      username: "Jaymat1210",
      message: "I'm the goat"
    },

    {
      username: "Drossog",
      message: "tuff"
    },

    {
      username: "Frenchfries",
      message: "rating this a 6.7"
    },

    {
      username: "Scrappy",
      message: "monchayster city"
    }

  ];


  let botTimeout = null;


  function sendBotMessage() {

    if (!isLive) return;

    const randomIndex =
      Math.floor(
        Math.random() *
        botMessages.length
      );

    const bot =
      botMessages[randomIndex];

    addChatMessage(
      bot.username,
      bot.message,
      true
    );

  }


  function scheduleBotMessage() {

    if (!isLive) return;

    botTimeout =
      setTimeout(() => {

        botTimeout = null;

        if (!isLive) return;

        sendBotMessage();

        scheduleBotMessage();

      }, 3000 + Math.random() * 3000);

  }


  function startBotChat() {

    if (
      botTimeout ||
      !isLive
    ) {
      return;
    }

    sendBotMessage();

    scheduleBotMessage();

  }


  function stopBotChat() {

    if (botTimeout) {

      clearTimeout(
        botTimeout
      );

      botTimeout = null;

    }

  }


  /* =======================================================
     ESCAPE KEY
     ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }

      closeGameModal();
      closeNeedModal();

    }
  );


  /* =======================================================
     INITIALIZATION
     ======================================================= */

  renderGames();

  updateStreamUI();

});
