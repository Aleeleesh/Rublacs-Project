document.addEventListener("DOMContentLoaded", () => {

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];


  /* =========================================================
     STATE
  ========================================================= */

  let isLive = false;
  let seconds = 0;
  let viewers = 0;
  let messageCount = 0;
  let timer = null;
  let chatTimer = null;
  let typingTimer = null;
  let toastTimer = null;

  let likes = Number(localStorage.getItem("blockliveLikes"));

  if (!Number.isFinite(likes) || likes < 42) {
    likes = 42;
  }

  const pollVotes = {
    "Brookhaven": 0,
    "Obby Challenge": 0,
    "Simulator": 0,
    "Adventure": 0
  };


  /* =========================================================
     CHAT DATA
  ========================================================= */

  const chatQueue = [

    {
      name: "Aylmer",
      message: "BRO the lobby is already wild",
      type: "presenter"
    },

    {
      name: "Keysha",
      message: "let chat choose the next move",
      type: "presenter"
    },

    {
      name: "Jayden",
      message: "nah this is about to go bad",
      type: "presenter"
    },

    {
      name: "Denise",
      message: "I voted risk 😭",
      type: "presenter"
    },

    {
      name: "Aylmer",
      message: "we are NOT surviving this",
      type: "presenter"
    },

    {
      name: "Drossog",
      message: "wait that actually worked",
      type: "bot"
    },

    {
      name: "Frenchfries",
      message: "chat is cooking today",
      type: "bot"
    },

    {
      name: "Keysha",
      message: "Ash look behind you",
      type: "presenter"
    },

    {
      name: "Jaymat1210",
      message: "BRO 💀",
      type: "bot"
    },

    {
      name: "Scrappy",
      message: "classic stream moment",
      type: "bot"
    },

    {
      name: "Aylmer",
      message: "okay buddy",
      type: "presenter"
    },

    {
      name: "Ash",
      message: "six seven",
      type: "presenter"
    },

    {
      name: "Jayden",
      message: "HAHAHAHA",
      type: "presenter"
    },

    {
      name: "Keysha",
      message: "stop staring at me",
      type: "presenter"
    },

    {
      name: "Denise",
      message: "someone clip that",
      type: "presenter"
    }

  ];

  let chatIndex = 0;


  /* =========================================================
     UTILITIES
  ========================================================= */

  function showToast(message) {
    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }


  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secondsOnly = totalSeconds % 60;

    return [
      hours,
      minutes,
      secondsOnly
    ]
      .map(value => String(value).padStart(2, "0"))
      .join(":");
  }


  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }


  /* =========================================================
     UI UPDATE
  ========================================================= */

  function updateUI() {

    $("#globalStatus").classList.toggle("live", isLive);
    $("#globalStatus span").textContent = isLive ? "LIVE" : "OFFLINE";

    $("#streamStatus").textContent = isLive ? "LIVE" : "OFFLINE";

    $("#chatStatus").textContent = isLive ? "LIVE" : "OFFLINE";
    $("#chatStatus").classList.toggle("live", isLive);

    $("#statStatus").textContent = isLive ? "LIVE" : "OFFLINE";

    $("#statViewers").textContent = isLive
      ? viewers.toLocaleString()
      : "0";

    $("#viewerCount").textContent = isLive
      ? `${viewers.toLocaleString()} viewers`
      : "0 viewers";

    $("#statLikes").textContent = likes;
    $("#likeCount").textContent = likes;

    $("#statMessages").textContent = messageCount;

    $("#streamTimer").textContent = formatTime(seconds);

    $("#videoLive").classList.toggle("live", isLive);
    $("#liveOverlay").classList.toggle("live", isLive);
    $("#previewLive").classList.toggle("live", isLive);

    $("#previewLive").textContent = isLive
      ? "● LIVE"
      : "STREAM OFFLINE";

    $("#startStreamButton").textContent = isLive
      ? "Stream is Live"
      : "Start Stream";

    $("#startStreamButton").disabled = isLive;

    $("#chatInput").disabled = !isLive;
    $("#sendChatButton").disabled = !isLive;

    $("#chatInput").placeholder = isLive
      ? "Say something to the room..."
      : "Go live to chat...";

    $("#muteButton").disabled = !isLive;
    $("#fullscreenButton").disabled = false;
  }


  /* =========================================================
     CHAT
  ========================================================= */

  function createChatMessage(name, message, type = "presenter") {

    const container = $("#chatMessages");

    $("#chatEmpty")?.remove();

    const item = document.createElement("div");

    item.className = "chat-message";

    const safeName = escapeHTML(name);
    const safeMessage = escapeHTML(message);

    const badge = type === "bot"
      ? `<span class="bot-badge">BOT</span>`
      : `<span class="presenter-badge">PRESENTER</span>`;

    item.innerHTML = `
      <div class="chat-name">
        ${safeName}${badge}
      </div>

      <div class="chat-text">
        ${safeMessage}
      </div>
    `;

    container.appendChild(item);

    container.scrollTop = container.scrollHeight;

    messageCount++;

    $("#statMessages").textContent = messageCount;
  }


  function showTyping() {
    $("#typingIndicator").classList.add("show");

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      $("#typingIndicator").classList.remove("show");
    }, 900);
  }


  function addNextChatMessage() {

    if (!isLive) return;

    showTyping();

    clearTimeout(chatTimer);

    chatTimer = setTimeout(() => {

      const message = chatQueue[chatIndex];

      createChatMessage(
        message.name,
        message.message,
        message.type
      );

      chatIndex++;

      if (chatIndex >= chatQueue.length) {
        chatIndex = 0;
      }

      scheduleNextChat();

    }, 900);

  }


  function scheduleNextChat() {

    if (!isLive) return;

    clearTimeout(chatTimer);

    chatTimer = setTimeout(
      addNextChatMessage,
      1500 + Math.random() * 1800
    );

  }


  function clearChat() {

    $("#chatMessages").innerHTML = `
      <div class="chat-empty" id="chatEmpty">
        <span>✦</span>
        <strong>No messages yet</strong>
        <small>Start the stream to open the chat.</small>
      </div>
    `;

    messageCount = 0;

    $("#statMessages").textContent = "0";

    showToast("Chat cleared.");
  }


  /* =========================================================
     STREAM
  ========================================================= */

  function startStream() {

    if (isLive) return;

    isLive = true;
    seconds = 0;
    viewers = 117 + Math.floor(Math.random() * 35);
    chatIndex = 0;

    updateUI();

    showToast("Stream is now live.");

    scheduleNextChat();

    clearInterval(timer);

    timer = setInterval(() => {

      seconds++;

      const change =
        Math.floor(Math.random() * 15) - 5;

      viewers = Math.max(
        1,
        viewers + change
      );

      updateUI();

    }, 1000);
  }


  function stopStream() {

    if (!isLive) return;

    isLive = false;

    clearInterval(timer);
    clearTimeout(chatTimer);
    clearTimeout(typingTimer);

    timer = null;
    chatTimer = null;

    seconds = 0;
    viewers = 0;

    $("#typingIndicator").classList.remove("show");

    $("#chatMessages").innerHTML = `
      <div class="chat-empty" id="chatEmpty">
        <span>✦</span>
        <strong>No messages yet</strong>
        <small>Start the stream to open the chat.</small>
      </div>
    `;

    messageCount = 0;

    updateUI();

    showToast("Stream stopped.");
  }


  /* =========================================================
     START STREAM BUTTON
  ========================================================= */

  $("#startStreamButton").addEventListener(
    "click",
    startStream
  );


  /* =========================================================
     GAME SWITCHING
  ========================================================= */

  $$(".game-button").forEach(button => {

    button.addEventListener("click", () => {

      $$(".game-button").forEach(
        item => item.classList.remove("active")
      );

      button.classList.add("active");

      const game = button.dataset.game;

      $("#currentGame").textContent =
        game.toUpperCase();

      $("#previewGame").textContent =
        game.toUpperCase();

      showToast(`${game} selected.`);
    });

  });


  /* =========================================================
     LIKE BUTTON
     Every click adds a like.
     No toggle.
  ========================================================= */

  $("#likeButton").addEventListener("click", () => {

    likes++;

    localStorage.setItem(
      "blockliveLikes",
      likes
    );

    updateUI();

  });


  /* =========================================================
     SHARE
  ========================================================= */

  $("#shareButton").addEventListener(
    "click",
    async () => {

      const url = window.location.href;

      try {

        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          showToast("Stream link copied.");
        } else {
          showToast("Share link ready.");
        }

      } catch {
        showToast("Share link ready.");
      }

    }
  );


  /* =========================================================
     CHAT FORM
     IMPORTANT:
     Typed user messages = You, not Ash.
  ========================================================= */

  $("#chatForm").addEventListener(
    "submit",
    event => {

      event.preventDefault();

      if (!isLive) {
        showToast("Start the stream before chatting.");
        return;
      }

      const input = $("#chatInput");

      const message = input.value.trim();

      if (!message) return;

      createChatMessage(
        "You",
        message,
        "presenter"
      );

      input.value = "";

      input.focus();

    }
  );


  /* =========================================================
     CLEAR CHAT
  ========================================================= */

  $("#clearChatButton").addEventListener(
    "click",
    clearChat
  );


  /* =========================================================
     POLL
     Percentages appear after first click.
  ========================================================= */

  function updatePoll() {

    const total =
      Object.values(pollVotes)
        .reduce((sum, value) => sum + value, 0);

    if (total <= 0) return;

    $$(".poll-option").forEach(option => {

      const name = option.dataset.poll;
      const votes = pollVotes[name];

      const percentage =
        Math.round((votes / total) * 100);

      option.querySelector(".poll-result")
        .textContent = `${percentage}%`;

      option.querySelector(".poll-bar i")
        .style.width = `${percentage}%`;

    });

    $("#pollHint").textContent =
      `${total} vote${total === 1 ? "" : "s"} · percentages update live`;

  }


  $$(".poll-option").forEach(option => {

    option.addEventListener("click", () => {

      if (!isLive) {
        showToast("Start the stream before voting.");
        return;
      }

      const selected = option.dataset.poll;

      pollVotes[selected]++;

      $$(".poll-option").forEach(
        item => item.classList.remove("voted")
      );

      option.classList.add("voted");

      updatePoll();

    });

  });


  /* =========================================================
     READ MORE
  ========================================================= */

  $$(".read-more").forEach(button => {

    button.addEventListener("click", () => {

      const card =
        button.closest(".research-card");

      const expanded =
        card.classList.toggle("expanded");

      button.textContent =
        expanded
          ? "Read less −"
          : "Read more +";

    });

  });


  /* =========================================================
     MUTE BUTTON
  ========================================================= */

  let muted = false;

  $("#muteButton").addEventListener(
    "click",
    () => {

      muted = !muted;

      $("#muteButton").textContent =
        muted ? "🔇" : "🔊";

      showToast(
        muted
          ? "Stream muted."
          : "Stream audio restored."
      );

    }
  );


  /* =========================================================
     FULLSCREEN
  ========================================================= */

  $("#fullscreenButton").addEventListener(
    "click",
    async () => {

      const target = $("#videoLive");

      try {

        if (!document.fullscreenElement) {
          await target.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }

      } catch {
        showToast("Fullscreen is not available here.");
      }

    }
  );


  /* =========================================================
     THEME
  ========================================================= */

  const savedTheme =
    localStorage.getItem("blockliveTheme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
    $("#themeToggle").textContent = "☀";
  }


  $("#themeToggle").addEventListener(
    "click",
    () => {

      const light =
        document.body.classList.toggle("light");

      localStorage.setItem(
        "blockliveTheme",
        light ? "light" : "dark"
      );

      $("#themeToggle").textContent =
        light ? "☀" : "☾";

    }
  );


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  $("#mobileToggle").addEventListener(
    "click",
    () => {

      $("#navLinks").classList.toggle("open");

    }
  );


  $$("#navLinks a").forEach(link => {

    link.addEventListener("click", () => {
      $("#navLinks").classList.remove("open");
    });

  });


  /* =========================================================
     INITIAL STATE
  ========================================================= */

  updateUI();

});
