document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     ELEMENTS
  ====================================================== */

  const startButton = document.getElementById("startStreamButton");
  const playButton = document.getElementById("playButton");

  const topStatus = document.getElementById("topStatus");
  const streamStatusText = document.getElementById("streamStatusText");
  const chatStatus = document.getElementById("chatStatus");

  const streamStage = document.getElementById("streamStage");
  const streamDot = document.getElementById("streamDot");
  const liveOverlay = document.getElementById("liveOverlay");
  const offlineMessage = document.getElementById("offlineMessage");

  const timerDisplay = document.getElementById("timer");
  const viewerDisplay = document.getElementById("viewerDisplay");

  const statStatus = document.getElementById("statStatus");
  const statViewers = document.getElementById("statViewers");
  const statLikes = document.getElementById("statLikes");
  const statMessages = document.getElementById("statMessages");

  const likeButton = document.getElementById("likeButton");
  const likeCount = document.getElementById("likeCount");

  const chatMessages = document.getElementById("chatMessages");
  const chatEmpty = document.getElementById("chatEmpty");

  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");

  const typingIndicator = document.getElementById("typingIndicator");
  const clearChat = document.getElementById("clearChat");

  const themeButton = document.getElementById("themeButton");
  const mobileButton = document.getElementById("mobileButton");
  const navLinks = document.getElementById("navLinks");

  const toast = document.getElementById("toast");

  const sceneTitle = document.getElementById("sceneTitle");
  const currentExperience =
    document.getElementById("currentExperience");

  const keyboardStatus =
    document.getElementById("keyboardStatus");

  const keyButtons =
    document.querySelectorAll(".key-control");

  const gameButtons =
    document.querySelectorAll(".game-button");

  const pollOptions =
    document.querySelectorAll(".poll-option");

  const researchCards =
    document.querySelectorAll(".research-card");


  /* =====================================================
     STATE
  ====================================================== */

  let streamLive = false;

  let seconds = 0;
  let timerInterval = null;

  let likes = 42;
  let viewers = 0;

  let chatCount = 0;

  let controlInterval = null;
  let controlTimeout = null;

  let pollStarted = false;

  let currentGame = "Brookhaven";


  /* =====================================================
     CHAT DATA
  ====================================================== */

  const chatQueue = [

    {
      name: "Aylmer",
      type: "presenter",
      text: "BRO the lobby is already wild"
    },

    {
      name: "Keysha",
      type: "presenter",
      text: "let chat choose the next move"
    },

    {
      name: "Jayden",
      type: "presenter",
      text: "nah this is about to go bad"
    },

    {
      name: "Denise",
      type: "presenter",
      text: "I voted risk 😭"
    },

    {
      name: "Aylmer",
      type: "presenter",
      text: "we are NOT surviving this"
    },

    {
      name: "Drossog",
      type: "bot",
      text: "wait that actually worked"
    },

    {
      name: "Frenchfries",
      type: "bot",
      text: "chat is cooking today"
    },

    {
      name: "Keysha",
      type: "presenter",
      text: "Ash look behind you"
    },

    {
      name: "Jaymat1210",
      type: "bot",
      text: "BRO 💀"
    },

    {
      name: "Scrappy",
      type: "bot",
      text: "classic stream moment"
    },

    {
      name: "Aylmer",
      type: "presenter",
      text: "okay buddy"
    },

    {
      name: "Ash",
      type: "presenter",
      text: "six seven"
    },

    {
      name: "Jayden",
      type: "presenter",
      text: "HAHAHAHA"
    },

    {
      name: "Keysha",
      type: "presenter",
      text: "stop staring at me"
    },

    {
      name: "Denise",
      type: "presenter",
      text: "someone clip that"
    }

  ];


  /* =====================================================
     TOAST
  ====================================================== */

  function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }


  /* =====================================================
     TIMER
  ====================================================== */

  function formatTime(totalSeconds) {

    const hours =
      String(Math.floor(totalSeconds / 3600)).padStart(2, "0");

    const minutes =
      String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");

    const secondsValue =
      String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${secondsValue}`;
  }


  function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

      seconds++;

      timerDisplay.textContent =
        formatTime(seconds);

    }, 1000);
  }


  function stopTimer() {
    clearInterval(timerInterval);
  }


  /* =====================================================
     STREAM VIEWERS
  ====================================================== */

  function updateViewers() {

    if (!streamLive) {
      viewers = 0;
    } else {

      viewers =
        18 +
        Math.floor(seconds / 8) +
        Math.floor(Math.random() * 7);

    }

    viewerDisplay.textContent =
      `${viewers} viewers`;

    statViewers.textContent =
      viewers;
  }


  /* =====================================================
     STREAM STATE
  ====================================================== */

  function setStreamUI(live) {

    streamLive = live;

    if (live) {

      startButton.textContent = "Stop Stream";
      playButton.textContent = "⏸";

      topStatus.classList.add("live");
      topStatus.querySelector("span:last-child").textContent = "LIVE";

      streamStatusText.textContent = "LIVE";

      chatStatus.textContent = "LIVE";
      chatStatus.classList.add("live");

      streamDot.classList.add("live");
      streamStage.classList.add("live");
      liveOverlay.classList.add("live");

      statStatus.textContent = "LIVE";

      chatInput.disabled = false;
      chatForm.querySelector("button").disabled = false;

      chatInput.placeholder = "Say something...";

      startTimer();

      viewers = 21;
      updateViewers();

      startControlSimulation();

      showToast("BlockLive is now live.");

      beginChatSimulation();

    } else {

      startButton.textContent = "Start Stream";
      playButton.textContent = "▶";

      topStatus.classList.remove("live");
      topStatus.querySelector("span:last-child").textContent = "OFFLINE";

      streamStatusText.textContent = "OFFLINE";

      chatStatus.textContent = "OFFLINE";
      chatStatus.classList.remove("live");

      streamDot.classList.remove("live");
      streamStage.classList.remove("live");
      liveOverlay.classList.remove("live");

      statStatus.textContent = "OFFLINE";

      chatInput.disabled = true;
      chatForm.querySelector("button").disabled = true;

      chatInput.placeholder = "Go live to chat...";

      stopTimer();

      stopControlSimulation();

      clearAllKeys();

      viewers = 0;
      updateViewers();

      showToast("Stream ended.");

    }
  }


  function toggleStream() {

    setStreamUI(!streamLive);

  }


  startButton.addEventListener(
    "click",
    toggleStream
  );

  playButton.addEventListener(
    "click",
    toggleStream
  );


  /* =====================================================
     WASD SYSTEM
  ====================================================== */

  const movementPatterns = [

    ["w"],

    ["w", "d"],

    ["d"],

    ["d", "s"],

    ["s"],

    ["s", "a"],

    ["a"],

    ["a", "w"],

    ["w"],

    ["space"],

    ["w", "space"],

    ["d"]

  ];


  function activateKeys(keys) {

    clearAllKeys();

    keys.forEach(key => {

      const button =
        document.querySelector(
          `.key-control[data-key="${key}"]`
        );

      if (button) {
        button.classList.add("active");
      }

    });

    if (keys.length > 0) {

      keyboardStatus.textContent =
        `INPUT · ${keys.join(" + ").toUpperCase()}`;

      keyboardStatus.classList.add("active");

    }

  }


  function clearAllKeys() {

    keyButtons.forEach(button => {
      button.classList.remove("active");
    });

    keyboardStatus.textContent =
      streamLive ? "READY" : "OFFLINE";

    keyboardStatus.classList.toggle(
      "active",
      streamLive
    );

  }


  function startControlSimulation() {

    stopControlSimulation();

    let index = 0;

    function nextMovement() {

      if (!streamLive) {
        return;
      }

      const pattern =
        movementPatterns[index];

      activateKeys(pattern);

      index =
        (index + 1) %
        movementPatterns.length;

      const delay =
        650 +
        Math.floor(Math.random() * 650);

      controlTimeout =
        setTimeout(nextMovement, delay);

    }

    nextMovement();

  }


  function stopControlSimulation() {

    clearInterval(controlInterval);
    clearTimeout(controlTimeout);

    controlInterval = null;
    controlTimeout = null;

  }


  /* =====================================================
     REAL KEYBOARD INPUT
     ===================================================== */

  document.addEventListener("keydown", event => {

    if (!streamLive) {
      return;
    }

    const key =
      event.key.toLowerCase();

    let target = key;

    if (event.code === "Space") {
      target = "space";
    }

    const button =
      document.querySelector(
        `.key-control[data-key="${target}"]`
      );

    if (!button) {
      return;
    }

    button.classList.add("active");

    keyboardStatus.textContent =
      `INPUT · ${target.toUpperCase()}`;

    keyboardStatus.classList.add("active");

  });


  document.addEventListener("keyup", event => {

    if (!streamLive) {
      return;
    }

    const key =
      event.key.toLowerCase();

    let target = key;

    if (event.code === "Space") {
      target = "space";
    }

    const button =
      document.querySelector(
        `.key-control[data-key="${target}"]`
      );

    if (button) {
      button.classList.remove("active");
    }

  });


  /* =====================================================
     GAME SWITCHING
  ====================================================== */

  gameButtons.forEach(button => {

    button.addEventListener("click", () => {

      gameButtons.forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      currentGame =
        button.dataset.game;

      currentExperience.textContent =
        currentGame;

      sceneTitle.textContent =
        currentGame.toUpperCase();

      showToast(
        `${currentGame} selected.`
      );

    });

  });


  /* =====================================================
     LIKES
     ===================================================== */

  likeButton.addEventListener("click", () => {

    likes++;

    likeCount.textContent =
      likes;

    statLikes.textContent =
      likes;

  });


  /* =====================================================
     SHARE
  ====================================================== */

  document
    .getElementById("shareButton")
    .addEventListener("click", async () => {

      const shareData = {
        title: "BlockLive",
        text: "Check out our BlockLive Roblox streaming project."
      };

      try {

        if (
          navigator.share &&
          location.protocol !== "file:"
        ) {

          await navigator.share(shareData);

        } else {

          await navigator.clipboard.writeText(
            window.location.href
          );

          showToast(
            "Project link copied."
          );

        }

      } catch {
        showToast("Share cancelled.");
      }

    });


  /* =====================================================
     CHAT
  ====================================================== */

  function addChatMessage(
    name,
    type,
    text
  ) {

    if (chatEmpty) {
      chatEmpty.remove();
    }

    const message =
      document.createElement("div");

    message.className =
      "chat-message";

    const badge =
      type === "bot"
        ? `<span class="bot-badge">BOT</span>`
        : `<span class="presenter-badge">PRESENTER</span>`;

    const displayName =
      name === "Ash"
        ? "Ash"
        : name;

    message.innerHTML = `
      <div class="chat-name">
        ${displayName}
        ${badge}
      </div>

      <div class="chat-text">
        ${escapeHTML(text)}
      </div>
    `;

    chatMessages.appendChild(message);

    chatMessages.scrollTop =
      chatMessages.scrollHeight;

    chatCount++;

    statMessages.textContent =
      chatCount;

  }


  function escapeHTML(text) {

    const div =
      document.createElement("div");

    div.textContent =
      text;

    return div.innerHTML;

  }


  let chatIndex = 0;
  let chatTimeout = null;


  function beginChatSimulation() {

    chatIndex = 0;

    clearTimeout(chatTimeout);

    scheduleNextChat();

  }


  function scheduleNextChat() {

    if (!streamLive) {
      return;
    }

    if (chatIndex >= chatQueue.length) {
      return;
    }

    typingIndicator.classList.add("show");

    const delay =
      1100 +
      Math.floor(Math.random() * 1200);

    chatTimeout =
      setTimeout(() => {

        typingIndicator.classList.remove("show");

        const message =
          chatQueue[chatIndex];

        addChatMessage(
          message.name,
          message.type,
          message.text
        );

        chatIndex++;

        scheduleNextChat();

      }, delay);

  }


  chatForm.addEventListener("submit", event => {

    event.preventDefault();

    if (!streamLive) {
      return;
    }

    const text =
      chatInput.value.trim();

    if (!text) {
      return;
    }

    addChatMessage(
      "You",
      "presenter",
      text
    );

    chatInput.value = "";

  });


  clearChat.addEventListener("click", () => {

    chatMessages.innerHTML = "";

    chatCount = 0;

    statMessages.textContent = "0";

    if (!streamLive) {

      chatMessages.innerHTML = `
        <div class="chat-empty" id="chatEmpty">
          <span>✦</span>
          <strong>No messages yet</strong>
          <small>
            Start the stream to open the chat.
          </small>
        </div>
      `;

    }

  });


  /* =====================================================
     POLL
  ====================================================== */

  const pollVotes = {
    "Brookhaven": 0,
    "Obby Challenge": 0,
    "Simulator": 0,
    "Adventure": 0
  };


  pollOptions.forEach(option => {

    option.addEventListener("click", () => {

      const selected =
        option.dataset.option;

      pollVotes[selected]++;

      pollStarted = true;

      updatePoll();

    });

  });


  function updatePoll() {

    const total =
      Object.values(pollVotes)
        .reduce(
          (sum, value) => sum + value,
          0
        );

    if (!total) {
      return;
    }

    pollOptions.forEach(option => {

      const name =
        option.dataset.option;

      const votes =
        pollVotes[name];

      const percentage =
        Math.round(
          (votes / total) * 100
        );

      const bar =
        option.querySelector(
          ".poll-bar i"
        );

      const result =
        option.querySelector(
          ".poll-result"
        );

      option.classList.add("voted");

      bar.style.width =
        `${percentage}%`;

      result.textContent =
        `${percentage}%`;

    });

  }


  /* =====================================================
     RESEARCH READ MORE
  ====================================================== */

  researchCards.forEach(card => {

    const button =
      card.querySelector(".read-more");

    button.addEventListener("click", () => {

      const expanded =
        card.classList.toggle("expanded");

      button.textContent =
        expanded
          ? "Read less −"
          : "Read more +";

    });

  });


  /* =====================================================
     THEME
  ====================================================== */

  themeButton.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const light =
      document.body.classList.contains("light");

    themeButton.textContent =
      light ? "☀" : "☾";

    localStorage.setItem(
      "blocklive-theme",
      light ? "light" : "dark"
    );

  });


  const savedTheme =
    localStorage.getItem(
      "blocklive-theme"
    );

  if (savedTheme === "light") {

    document.body.classList.add("light");

    themeButton.textContent = "☀";

  }


  /* =====================================================
     MOBILE NAV
  ====================================================== */

  mobileButton.addEventListener("click", () => {

    navLinks.classList.toggle("open");

  });


  navLinks.querySelectorAll("a")
    .forEach(link => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("open");

      });

    });


  /* =====================================================
     FULLSCREEN
  ====================================================== */

  document
    .getElementById("fullscreenButton")
    .addEventListener("click", () => {

      const stage =
        document.getElementById("streamStage");

      if (!document.fullscreenElement) {

        if (stage.requestFullscreen) {
          stage.requestFullscreen();
        }

      } else {

        document.exitFullscreen();

      }

    });


  /* =====================================================
     MUTE BUTTON
  ====================================================== */

  let muted = false;

  document
    .getElementById("muteButton")
    .addEventListener("click", event => {

      muted = !muted;

      event.currentTarget.textContent =
        muted ? "🔇" : "🔊";

      showToast(
        muted
          ? "Stream audio muted."
          : "Stream audio restored."
      );

    });


  /* =====================================================
     VIEWER SIMULATION
  ====================================================== */

  setInterval(() => {

    if (streamLive) {
      updateViewers();
    }

  }, 5000);


  /* =====================================================
     INITIAL STATE
  ====================================================== */

  statLikes.textContent =
    likes;

  statMessages.textContent =
    chatCount;

  statViewers.textContent =
    "0";

  keyboardStatus.textContent =
    "OFFLINE";

});
