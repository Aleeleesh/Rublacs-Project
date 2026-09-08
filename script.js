/* =========================================================
   BLOCKLIVE
   INTERACTIVE STREAMING EXPERIENCE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const startStreamButton = document.getElementById("startStreamButton");

  const streamStatus = document.getElementById("streamStatus");
  const videoLive = document.getElementById("videoLive");
  const videoMessage = document.getElementById("videoMessage");

  const sidebarStatus = document.getElementById("sidebarStatus");
  const sidebarViewers = document.getElementById("sidebarViewers");
  const sidebarDot = document.getElementById("sidebarDot");

  const chatStatus = document.getElementById("chatStatus");
  const chatMessages = document.getElementById("chatMessages");
  const chatEmpty = document.getElementById("chatEmpty");
  const chatInput = document.getElementById("chatInput");
  const sendChatButton = document.getElementById("sendChatButton");
  const clearChatButton = document.getElementById("clearChatButton");
  const typingIndicator = document.getElementById("typingIndicator");

  const viewerCount = document.getElementById("viewerCount");
  const streamTimer = document.getElementById("streamTimer");

  const streamTitle = document.getElementById("streamTitle");
  const currentGame = document.getElementById("currentGame");

  const likeButton = document.getElementById("likeButton");
  const likeCount = document.getElementById("likeCount");

  const statViewers = document.getElementById("statViewers");
  const statLikes = document.getElementById("statLikes");

  const statViewersBottom = document.getElementById("statViewersBottom");
  const statLikesBottom = document.getElementById("statLikesBottom");
  const statMessages = document.getElementById("statMessages");
  const statStatus = document.getElementById("statStatus");

  const shareButton = document.getElementById("shareButton");
  const notifyButton = document.getElementById("notifyButton");
  const notificationButton = document.getElementById("notificationButton");

  const muteButton = document.getElementById("muteButton");
  const fullscreenButton = document.getElementById("fullscreenButton");

  const toastContainer = document.getElementById("toastContainer");

  const navItems = document.querySelectorAll(".nav-item");
  const gameOptions = document.querySelectorAll(".game-option");
  const pollOptions = document.querySelectorAll(".poll-option");
  const readMoreButtons = document.querySelectorAll(".read-more");

  const pollTotal = document.getElementById("pollTotal");

  const video = document.getElementById("video");


  /* =======================================================
     STATE
     ======================================================= */

  let streamStarted = false;
  let streamSeconds = 0;

  let viewers = 0;
  let likes = 42;
  let messagesSent = 0;

  let muted = false;
  let liked = false;
  let notificationsEnabled = false;

  let selectedGame = "Brookhaven";

  let timerInterval = null;
  let viewerInterval = null;
  let chatInterval = null;

  let pollVotes = {
    "Brookhaven": 0,
    "Obby Challenge": 0,
    "Simulator": 0,
    "Adventure": 0
  };


  /* =======================================================
     CHAT USERS
     ======================================================= */

  const bots = [
    {
      name: "drossog",
      message: "tuff"
    },
    {
      name: "frenchfries",
      message: "rating this a 6.7"
    },
    {
      name: "jaymat1210",
      message: "I'm the goat"
    },
    {
      name: "scrappy",
      message: "dream of the year watch jobs minecraft"
    }
  ];


  const humans = [
    {
      name: "Denise",
      messages: [
        "wait this actually looks clean",
        "what game are we playing",
        "the chat is kinda fire",
        "LOL",
        "okay this is nice"
      ]
    },

    {
      name: "Alymer",
      messages: [
        "yo",
        "brookhaven again 😭",
        "this interface is clean",
        "W stream",
        "nah the poll is crazy"
      ]
    },

    {
      name: "Jayden",
      messages: [
        "I'm here",
        "this is actually cool",
        "bro started streaming",
        "W",
        "change the game"
      ]
    },

    {
      name: "Keysha",
      messages: [
        "HELP 😭",
        "why is everyone saying goat",
        "this is tuff",
        "I vote adventure",
        "okay okay"
      ]
    },

    {
      name: "Ash",
      messages: [
        "welcome everyone",
        "what should we play",
        "appreciate you guys",
        "stream is officially live",
        "W chat"
      ]
    }
  ];


  const gameMessages = {
    "Brookhaven": [
      "brookhaven arc",
      "this map is actually chill",
      "W choice",
      "okay we're cooking"
    ],

    "Obby Challenge": [
      "obby time",
      "bro is definitely falling",
      "good luck 😭",
      "this is gonna be painful"
    ],

    "Simulator": [
      "simulator grind",
      "time to grind",
      "W progression",
      "how long are we staying here"
    ],

    "Adventure": [
      "adventure arc",
      "this one looks interesting",
      "W exploration",
      "let's see what happens"
    ]
  };


  /* =======================================================
     UTILITY
     ======================================================= */

  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }


  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(remainingSeconds).padStart(2, "0")
    );
  }


  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;

    return div.innerHTML;
  }


  function showToast(message) {
    const toast = document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3100);
  }


  function updateStats() {
    viewerCount.textContent = viewers;

    statViewers.textContent = viewers;
    statViewersBottom.textContent = viewers;

    statLikes.textContent = likes;
    statLikesBottom.textContent = likes;

    statMessages.textContent = messagesSent;

    sidebarViewers.textContent =
      viewers === 1
        ? "1 viewer"
        : `${viewers} viewers`;
  }


  /* =======================================================
     CHAT
     ======================================================= */

  function addChatMessage(name, role, message) {

    if (chatEmpty && chatEmpty.parentNode) {
      chatEmpty.remove();
    }

    const item = document.createElement("div");

    item.className = "chat-message";

    const avatarLetter = name.charAt(0).toUpperCase();

    item.innerHTML = `
      <div class="chat-avatar">
        ${escapeHTML(avatarLetter)}
      </div>

      <div class="chat-content">

        <div class="chat-user">

          <span class="chat-name">
            ${escapeHTML(name)}
          </span>

          <span class="chat-role ${role === "BOT" ? "bot" : "human"}">
            ${role}
          </span>

        </div>

        <div class="chat-text">
          ${escapeHTML(message)}
        </div>

      </div>
    `;

    chatMessages.appendChild(item);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    messagesSent++;
    updateStats();
  }


  function addInitialChat() {

    const openingMessages = [
      ["Denise", "HUMAN", "yo"],
      ["drossog", "BOT", "tuff"],
      ["Keysha", "HUMAN", "we're live 😭"],
      ["frenchfries", "BOT", "rating this a 6.7"],
      ["Jayden", "HUMAN", "W stream"],
      ["jaymat1210", "BOT", "I'm the goat"]
    ];

    openingMessages.forEach((message, index) => {
      setTimeout(() => {
        addChatMessage(
          message[0],
          message[1],
          message[2]
        );
      }, index * 380);
    });
  }


  function sendRandomChat() {

    if (!streamStarted) {
      return;
    }

    const useBot = Math.random() < 0.42;

    if (useBot) {

      const bot = randomItem(bots);

      let message = bot.message;

      if (Math.random() > 0.5) {
        message = randomItem([
          bot.message,
          "W",
          "tuff",
          "this is crazy",
          "nah 😭",
          "goat behavior"
        ]);
      }

      addChatMessage(
        bot.name,
        "BOT",
        message
      );

      return;
    }


    const human = randomItem(humans);

    let message;

    if (Math.random() < 0.38) {
      message = randomItem(gameMessages[selectedGame]);
    } else {
      message = randomItem(human.messages);
    }

    addChatMessage(
      human.name,
      "HUMAN",
      message
    );
  }


  function startChatLoop() {

    clearInterval(chatInterval);

    chatInterval = setInterval(() => {

      if (!streamStarted) {
        return;
      }

      if (Math.random() < 0.35) {
        showTyping();
      }

      setTimeout(() => {

        if (streamStarted) {
          sendRandomChat();
        }

        hideTyping();

      }, 800);

    }, 4500);
  }


  function showTyping() {
    typingIndicator.classList.add("show");
  }


  function hideTyping() {
    typingIndicator.classList.remove("show");
  }


  /* =======================================================
     STREAM
     ======================================================= */

  function startStream() {

    if (streamStarted) {
      stopStream();
      return;
    }

    streamStarted = true;

    streamSeconds = 0;

    viewers = Math.floor(
      Math.random() * 25
    ) + 85;


    startStreamButton.innerHTML = `
      <span>■</span>
      End Stream
    `;


    streamStatus.classList.add("live");
    streamStatus.innerHTML = `
      <span></span>
      LIVE
    `;


    videoLive.classList.add("live");
    videoLive.innerHTML = `
      <span></span>
      LIVE
    `;


    sidebarStatus.textContent = "Live";
    sidebarDot.classList.add("live");

    chatStatus.textContent = "Live";
    chatStatus.classList.add("live");

    statStatus.textContent = "Live";


    streamTitle.textContent =
      `${selectedGame} • BlockLive Live Stream`;


    videoMessage.innerHTML = `
      <div class="video-message-icon">▶</div>
      <strong>BlockLive is live</strong>
      <span>${escapeHTML(selectedGame)}</span>
    `;


    addInitialChat();

    startTimer();
    startViewerCounter();
    startChatLoop();

    updateStats();

    showToast("Your BlockLive stream is now live.");
  }


  function stopStream() {

    streamStarted = false;

    clearInterval(timerInterval);
    clearInterval(viewerInterval);
    clearInterval(chatInterval);

    timerInterval = null;
    viewerInterval = null;
    chatInterval = null;

    hideTyping();

    viewers = 0;

    startStreamButton.innerHTML = `
      <span>▶</span>
      Start Stream
    `;


    streamStatus.classList.remove("live");
    streamStatus.innerHTML = `
      <span></span>
      OFFLINE
    `;


    videoLive.classList.remove("live");
    videoLive.innerHTML = `
      <span></span>
      OFFLINE
    `;


    sidebarStatus.textContent = "Offline";
    sidebarDot.classList.remove("live");

    chatStatus.textContent = "Offline";
    chatStatus.classList.remove("live");

    statStatus.textContent = "Offline";


    streamTitle.textContent =
      "Waiting for the stream to start...";


    videoMessage.innerHTML = `
      <div class="video-message-icon">▶</div>
      <strong>Stream is offline</strong>
      <span>Start the stream to begin</span>
    `;


    streamTimer.textContent = "00:00";

    updateStats();

    showToast("Stream ended.");
  }


  /* =======================================================
     TIMER
     ======================================================= */

  function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

      if (!streamStarted) {
        return;
      }

      streamSeconds++;

      streamTimer.textContent =
        formatTime(streamSeconds);

    }, 1000);
  }


  /* =======================================================
     VIEWER COUNTER
     ======================================================= */

  function startViewerCounter() {

    clearInterval(viewerInterval);

    viewerInterval = setInterval(() => {

      if (!streamStarted) {
        return;
      }

      const change =
        Math.floor(Math.random() * 9) - 4;

      viewers += change;

      if (viewers < 45) {
        viewers = 45;
      }

      updateStats();

    }, 3000);
  }


  /* =======================================================
     GAME SELECTOR
     ======================================================= */

  gameOptions.forEach(button => {

    button.addEventListener("click", () => {

      selectedGame = button.dataset.game;

      gameOptions.forEach(option => {
        option.classList.remove("active");
      });

      button.classList.add("active");

      currentGame.textContent = selectedGame;


      if (streamStarted) {

        streamTitle.textContent =
          `${selectedGame} • BlockLive Live Stream`;

        videoMessage.innerHTML = `
          <div class="video-message-icon">▶</div>
          <strong>Now playing ${escapeHTML(selectedGame)}</strong>
          <span>BlockLive Live Stream</span>
        `;

        showToast(
          `Game changed to ${selectedGame}.`
        );

        setTimeout(() => {

          if (streamStarted) {
            addChatMessage(
              "Ash",
              "HUMAN",
              randomItem(gameMessages[selectedGame])
            );
          }

        }, 500);

      } else {

        showToast(
          `Selected ${selectedGame}.`
        );
      }

    });

  });


  /* =======================================================
     CHAT INPUT
     ======================================================= */

  function sendUserMessage() {

    const message = chatInput.value.trim();

    if (!message) {
      return;
    }

    if (!streamStarted) {
      showToast("Start the stream before chatting.");
      return;
    }

    addChatMessage(
      "Ash",
      "HUMAN",
      message
    );

    chatInput.value = "";

    setTimeout(() => {

      if (!streamStarted) {
        return;
      }

      const replies = [
        "W",
        "real",
        "tuff 😭",
        "bro cooked",
        "I agree",
        "nah that's crazy",
        "W chat",
        "fr"
      ];

      addChatMessage(
        randomItem(humans).name,
        "HUMAN",
        randomItem(replies)
      );

    }, 900);
  }


  sendChatButton.addEventListener(
    "click",
    sendUserMessage
  );


  chatInput.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        event.preventDefault();
        sendUserMessage();
      }

    }
  );


  clearChatButton.addEventListener(
    "click",
    () => {

      chatMessages.innerHTML = `
        <div class="chat-empty" id="chatEmpty">

          <div class="empty-icon">💬</div>

          <strong>No messages yet</strong>
          <span>Start chatting to fill this space.</span>

        </div>
      `;

      messagesSent = 0;

      updateStats();

      showToast("Chat cleared.");

    }
  );


  /* =======================================================
     LIKE
     ======================================================= */

  likeButton.addEventListener(
    "click",
    () => {

      if (liked) {

        likes--;

        liked = false;

        likeButton.classList.remove("liked");

        likeButton.innerHTML = `
          ♡
          <span id="likeCount">${likes}</span>
        `;

        showToast("Like removed.");

      } else {

        likes++;

        liked = true;

        likeButton.classList.add("liked");

        likeButton.innerHTML = `
          ♥
          <span id="likeCount">${likes}</span>
        `;

        showToast("You liked the stream.");

      }

      updateStats();

    }
  );


  /* =======================================================
     POLL
     ======================================================= */

  pollOptions.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const option = button.dataset.option;

        pollVotes[option]++;

        pollOptions.forEach(item => {
          item.classList.remove("selected");
        });

        button.classList.add("selected");

        updatePoll();

        showToast(
          `Vote added for ${option}.`
        );

      }
    );

  });


  function updatePoll() {

    const total =
      Object.values(pollVotes)
        .reduce(
          (sum, value) => sum + value,
          0
        );

    pollTotal.textContent =
      `${total} ${total === 1 ? "vote" : "votes"}`;


    pollOptions.forEach(button => {

      const option = button.dataset.option;

      const votes = pollVotes[option];

      const percentage =
        total === 0
          ? 0
          : Math.round((votes / total) * 100);


      button.style.setProperty(
        "--vote-width",
        `${percentage}%`
      );


      const percentageElement =
        button.querySelector("strong");

      percentageElement.textContent =
        `${percentage}%`;

    });

  }


  /* =======================================================
     SHARE
     ======================================================= */

  shareButton.addEventListener(
    "click",
    async () => {

      const shareText =
        "Check out BlockLive — a Roblox streaming project.";

      try {

        if (
          navigator.clipboard &&
          window.isSecureContext
        ) {

          await navigator.clipboard.writeText(
            window.location.href
          );

          showToast(
            "BlockLive link copied."
          );

        } else {

          showToast(
            shareText
          );

        }

      } catch {

        showToast(
          shareText
        );

      }

    }
  );


  /* =======================================================
     NOTIFICATIONS
     ======================================================= */

  notifyButton.addEventListener(
    "click",
    () => {

      notificationsEnabled =
        !notificationsEnabled;


      if (notificationsEnabled) {

        notifyButton.textContent =
          "✓ Notifications on";

        showToast(
          "Stream notifications enabled."
        );

      } else {

        notifyButton.textContent =
          "♢ Notify me";

        showToast(
          "Stream notifications disabled."
        );

      }

    }
  );


  notificationButton.addEventListener(
    "click",
    () => {

      showToast(
        streamStarted
          ? "BlockLive is currently live."
          : "No new notifications."
      );

    }
  );


  /* =======================================================
     MUTE
     ======================================================= */

  muteButton.addEventListener(
    "click",
    () => {

      muted = !muted;

      muteButton.textContent =
        muted ? "🔇" : "🔊";

      muteButton.title =
        muted ? "Unmute" : "Mute";

      showToast(
        muted
          ? "Stream audio muted."
          : "Stream audio restored."
      );

    }
  );


  /* =======================================================
     FULLSCREEN
     ======================================================= */

  fullscreenButton.addEventListener(
    "click",
    async () => {

      try {

        if (!document.fullscreenElement) {

          await video.requestFullscreen();

        } else {

          await document.exitFullscreen();

        }

      } catch {

        showToast(
          "Fullscreen is not available here."
        );

      }

    }
  );


  /* =======================================================
     RESEARCH EXPANSION
     ======================================================= */

  readMoreButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const card =
          button.closest(".research-card");

        const expanded =
          card.classList.toggle("expanded");


        button.innerHTML = expanded
          ? `Show less <span>↑</span>`
          : `Read more <span>→</span>`;

      }
    );

  });


  /* =======================================================
     NAVIGATION
     ======================================================= */

  navItems.forEach(link => {

    link.addEventListener(
      "click",
      () => {

        navItems.forEach(item => {
          item.classList.remove("active");
        });

        link.classList.add("active");

      }
    );

  });


  /* =======================================================
     ACTIVE SECTION OBSERVER
     ======================================================= */

  if ("IntersectionObserver" in window) {

    const sections = document.querySelectorAll(
      "section[id]"
    );

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            navItems.forEach(item => {

              const target =
                item.getAttribute("href");

              item.classList.toggle(
                "active",
                target === `#${entry.target.id}`
              );

            });

          });

        },
        {
          rootMargin: "-25% 0px -65% 0px"
        }
      );


    sections.forEach(section => {
      observer.observe(section);
    });

  }


  /* =======================================================
     START BUTTON
     ======================================================= */

  startStreamButton.addEventListener(
    "click",
    startStream
  );


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  updateStats();
  updatePoll();

});
