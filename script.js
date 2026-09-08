document.addEventListener("DOMContentLoaded", () => {

  const $ = (id) => document.getElementById(id);

  const startStream = $("startStream");
  const themeToggle = $("themeToggle");
  const gameSelect = $("gameSelect");

  const chatMessages = $("chatMessages");
  const chatForm = $("chatForm");
  const chatInput = $("chatInput");
  const emptyChat = $("emptyChat");

  const likeBtn = $("likeBtn");
  const clearChat = $("clearChat");

  const heroViewers = $("heroViewers");
  const heroLikes = $("heroLikes");
  const previewViewers = $("previewViewers");

  const streamViewers = $("streamViewers");
  const streamLikes = $("streamLikes");

  const chatUsers = $("chatUsers");

  const streamStatus = $("streamStatus");
  const streamLiveLabel = $("streamLiveLabel");
  const screenText = $("screenText");
  const screenSubtext = $("screenSubtext");
  const selectedGame = $("selectedGame");
  const streamTitle = $("streamTitle");

  const muteBtn = $("muteBtn");
  const fullscreenBtn = $("fullscreenBtn");
  const shareBtn = $("shareBtn");

  let live = false;
  let viewers = 0;
  let likes = Number(localStorage.getItem("blockliveLikes")) || 0;

  let chatTimer = null;
  let viewerTimer = null;

  const pollVotes = {
    risk: 0,
    safe: 0,
    chat: 0
  };

  /*
    These are the simulated stream participants.
    They are all PRESENTERS and have equal status.
  */

  const presenters = [
    {
      name: "Denise",
      type: "human",
      messages: [
        "I voted risk 😭",
        "someone clip that"
      ]
    },
    {
      name: "Aylmer",
      type: "human",
      messages: [
        "BRO the lobby is already wild",
        "we are NOT surviving this",
        "okay buddy",
        "six seven"
      ]
    },
    {
      name: "Jayden",
      type: "human",
      messages: [
        "nah this is about to go bad",
        "HAHAHAHA"
      ]
    },
    {
      name: "Keysha",
      type: "human",
      messages: [
        "let chat choose the next move",
        "Ash look behind you",
        "stop staring at me"
      ]
    },

    /*
      Ash is a simulated presenter.
      This is different from the real user typing.
    */
    {
      name: "Ash",
      type: "human",
      messages: [
        "chat what are we doing",
        "nahhh",
        "wait what 😭"
      ]
    }
  ];

  const bots = [
    {
      name: "Drossog",
      messages: [
        "wait that actually worked",
        "bro no way"
      ]
    },
    {
      name: "Frenchfries",
      messages: [
        "chat is cooking today",
        "this stream is crazy"
      ]
    },
    {
      name: "Jaymat1210",
      messages: [
        "BRO 💀",
        "nah"
      ]
    },
    {
      name: "Scrappy",
      messages: [
        "classic stream moment",
        "this is actually funny"
      ]
    }
  ];

  const allParticipants = [...presenters, ...bots];

  function updateStats() {
    heroViewers.textContent = viewers.toLocaleString();
    previewViewers.textContent = `${viewers.toLocaleString()} watching`;

    streamViewers.textContent = viewers.toLocaleString();

    heroLikes.textContent = likes.toLocaleString();
    streamLikes.textContent = likes.toLocaleString();
  }

  function setLiveUI() {
    streamStatus.textContent = live ? "LIVE" : "OFFLINE";
    streamLiveLabel.textContent = live ? "● LIVE" : "OFFLINE";

    streamLiveLabel.classList.toggle("active", live);

    if (live) {
      screenText.textContent = "You're live.";
      screenSubtext.textContent = "Chat is open — let's see what happens.";

      chatInput.disabled = false;
      chatInput.placeholder = "Say something...";
      startStream.textContent = "Stop Stream";
    } else {
      screenText.textContent = "Stream is offline";
      screenSubtext.textContent = "Press Start Stream when you're ready.";

      chatInput.disabled = true;
      chatInput.placeholder = "Go live to chat...";
      startStream.textContent = "Start Stream";
    }
  }

  function addChatMessage(name, message, type = "human") {

    if (emptyChat) {
      emptyChat.remove();
    }

    const item = document.createElement("div");

    item.className = `chat-message ${type}`;

    const displayName = type === "you" ? "You" : name;
    const badge = type === "bot" ? "BOT" : "Presenter";

    item.innerHTML = `
      <div class="chat-message-header">
        <strong>${escapeHTML(displayName)}</strong>
        <span class="chat-badge">${badge}</span>
      </div>
      <div class="chat-message-text">${escapeHTML(message)}</div>
    `;

    chatMessages.appendChild(item);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function randomMessage() {

    if (!live || allParticipants.length === 0) return;

    const participant =
      allParticipants[Math.floor(Math.random() * allParticipants.length)];

    const message =
      participant.messages[
        Math.floor(Math.random() * participant.messages.length)
      ];

    addChatMessage(
      participant.name,
      message,
      participant.type === "bot" ? "bot" : "human"
    );

    /*
      Occasionally bump the viewer count so the stream
      feels alive without going completely insane.
    */
    viewers += Math.floor(Math.random() * 7) - 2;

    if (viewers < 1) viewers = 1;

    updateStats();
  }

  function startChatLoop() {
    clearTimeout(chatTimer);

    function nextMessage() {
      if (!live) return;

      randomMessage();

      const delay = 1800 + Math.random() * 4000;

      chatTimer = setTimeout(nextMessage, delay);
    }

    /*
      First message is delayed so the room does NOT
      instantly fill when Start Stream is pressed.
    */
    chatTimer = setTimeout(nextMessage, 1800);
  }

  function startViewerLoop() {
    clearInterval(viewerTimer);

    viewerTimer = setInterval(() => {

      if (!live) return;

      const change = Math.floor(Math.random() * 9) - 3;

      viewers += change;

      if (viewers < 1) viewers = 1;
      if (viewers > 999) viewers = 999;

      chatUsers.textContent = `${viewers.toLocaleString()} watching`;

      updateStats();

    }, 3500);
  }

  function startTheStream() {

    live = true;

    viewers = Math.floor(35 + Math.random() * 45);

    setLiveUI();
    updateStats();

    chatUsers.textContent = `${viewers.toLocaleString()} watching`;

    startChatLoop();
    startViewerLoop();

    showToast("Stream started — chat is live.");
  }

  function stopTheStream() {

    live = false;

    clearTimeout(chatTimer);
    clearInterval(viewerTimer);

    viewers = 0;

    setLiveUI();
    updateStats();

    chatUsers.textContent = "0 watching";

    showToast("Stream ended.");

  }

  startStream.addEventListener("click", () => {

    if (live) {
      stopTheStream();
    } else {
      startTheStream();
    }

  });


  /*
    REAL USER CHAT
    ----------------
    This MUST say "You", not "Ash".
  */

  chatForm.addEventListener("submit", (event) => {

    event.preventDefault();

    if (!live) return;

    const message = chatInput.value.trim();

    if (!message) return;

    addChatMessage("You", message, "you");

    chatInput.value = "";

  });


  /*
    SPAM-ABLE LIKES
    ----------------
    Every click adds one like.
    There is no unlike/toggle.
  */

  likeBtn.addEventListener("click", () => {

    if (!live) {
      showToast("Start the stream first.");
      return;
    }

    likes += 1;

    localStorage.setItem("blockliveLikes", likes);

    updateStats();

  });


  /*
    GAME SELECTOR
  */

  gameSelect.addEventListener("change", () => {

    const game = gameSelect.value;

    selectedGame.textContent = game;
    streamTitle.textContent = game;

    showToast(`Game changed to ${game}`);

  });


  /*
    POLL
  */

  document.querySelectorAll(".poll-option").forEach(button => {

    button.addEventListener("click", () => {

      if (!live) {
        showToast("Start the stream before voting.");
        return;
      }

      const choice = button.dataset.poll;

      pollVotes[choice]++;

      button.classList.add("selected");

      updatePoll();

      showToast("Vote counted.");

    });

  });

  function updatePoll() {

    const total =
      pollVotes.risk +
      pollVotes.safe +
      pollVotes.chat;

    const percentage = (value) => {

      if (!total) return 0;

      return Math.round((value / total) * 100);

    };

    $("riskPercent").textContent =
      `${percentage(pollVotes.risk)}%`;

    $("safePercent").textContent =
      `${percentage(pollVotes.safe)}%`;

    $("chatPercent").textContent =
      `${percentage(pollVotes.chat)}%`;

    $("pollHint").textContent =
      `${total} vote${total === 1 ? "" : "s"} cast`;

  }


  /*
    CLEAR CHAT
  */

  clearChat.addEventListener("click", () => {

    chatMessages.innerHTML = `
      <div class="empty-chat" id="emptyChat">
        <div>💬</div>
        <strong>Room is quiet.</strong>
        <span>${live
          ? "Messages will appear again as the stream continues."
          : "Start the stream and the conversation will begin."
        }</span>
      </div>
    `;

    showToast("Chat cleared.");

  });


  /*
    MUTE
  */

  let muted = false;

  muteBtn.addEventListener("click", () => {

    muted = !muted;

    muteBtn.textContent = muted ? "🔇" : "🔊";

    showToast(muted ? "Audio muted." : "Audio unmuted.");

  });


  /*
    FULLSCREEN
  */

  fullscreenBtn.addEventListener("click", async () => {

    const screen = document.querySelector(".stream-screen");

    try {

      if (!document.fullscreenElement) {
        await screen.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }

    } catch {
      showToast("Fullscreen isn't available here.");
    }

  });


  /*
    SHARE
  */

  shareBtn.addEventListener("click", async () => {

    const shareData = {
      title: "BlockLive",
      text: "Check out our Roblox streaming project!"
    };

    try {

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Project link copied.");
      }

    } catch {
      // User cancelled sharing. Nothing needs to happen.
    }

  });


  /*
    LIGHT / DARK MODE
  */

  const savedTheme = localStorage.getItem("blockliveTheme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "🌙";
  }

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const light =
      document.body.classList.contains("light");

    localStorage.setItem(
      "blockliveTheme",
      light ? "light" : "dark"
    );

    themeToggle.textContent = light ? "🌙" : "☀";

  });


  /*
    SMALL TOAST SYSTEM
  */

  let toastTimeout;

  function showToast(message) {

    const toast = $("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);

  }


  /*
    INITIAL STATE
  */

  setLiveUI();
  updateStats();

});
