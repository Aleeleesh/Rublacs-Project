/* =========================================================
   BLOCKLIVE
   ROBLOX STREAMING PROJECT
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     HELPERS
     ======================================================= */

  const $ = (id) => document.getElementById(id);

  const $$ = (selector) => [
    ...document.querySelectorAll(selector)
  ];


  /* =======================================================
     ELEMENTS
     ======================================================= */

  const startStreamButton = $("startStreamButton");

  const sidebarStreamStatus = $("sidebarStreamStatus");
  const sidebarStatus = $("sidebarStatus");
  const sidebarViewers = $("sidebarViewers");

  const streamStatus = $("streamStatus");
  const videoLive = $("videoLive");
  const videoMessage = $("videoMessage");

  const viewerCount = $("viewerCount");
  const currentGame = $("currentGame");
  const streamTimer = $("streamTimer");

  const likeButton = $("likeButton");
  const likeCount = $("likeCount");

  const shareButton = $("shareButton");
  const notifyButton = $("notifyButton");

  const muteButton = $("muteButton");
  const fullscreenButton = $("fullscreenButton");
  const videoStage = $("videoStage");

  const gameButtons = $$(".game-button");

  const chatMessages = $("chatMessages");
  const chatStatus = $("chatStatus");
  const chatForm = $("chatForm");
  const chatInput = $("chatInput");
  const sendChatButton = $("sendChatButton");
  const clearChatButton = $("clearChatButton");
  const chatEmpty = $("chatEmpty");
  const typingIndicator = $("typingIndicator");

  const pollOptions = $$(".poll-option");
  const pollStatus = $("pollStatus");

  const statViewers = $("statViewers");
  const statLikes = $("statLikes");
  const statMessages = $("statMessages");
  const statStatus = $("statStatus");

  const toastContainer = $("toastContainer");


  /* =======================================================
     STATE
     ======================================================= */

  let live = false;

  let seconds = 0;

  let viewers = 0;

  let likes = 42;

  let messagesSent = 0;

  let streamTimerInterval = null;

  let chatSequenceTimers = [];

  let selectedGame = "Brookhaven";

  let muted = false;

  let themeButton = null;


  /* =======================================================
     CHAT DATA
     ======================================================= */

  const humanMessages = {

    Denise: [
      "I voted risk 😭",
      "someone clip that",
      "WAIT WHAT",
      "this stream is actually getting chaotic",
      "chat is choosing violence"
    ],

    Alymer: [
      "BRO the lobby is already wild",
      "we are NOT surviving this",
      "okay buddy",
      "six seven",
      "nah this is getting crazy"
    ],

    Jayden: [
      "nah this is about to go bad",
      "HAHAHAHA",
      "bro what just happened",
      "we definitely planned this",
      "there is no way"
    ],

    Keysha: [
      "let chat choose the next move",
      "Ash look behind you",
      "stop staring at me",
      "chat actually has good ideas",
      "vote right now"
    ],

    Ash: [
      "I'm actually doing this",
      "chat relax 😭",
      "wait wait wait",
      "okay that was clean",
      "who voted for this"
    ]

  };


  const botMessages = {

    Drossog: [
      "tuff",
      "wait that actually worked",
      "okay this is actually clean",
      "nah that was crazy"
    ],

    Frenchfries: [
      "rating this a 6.7",
      "chat is cooking today",
      "that's kinda tuff",
      "this is getting better"
    ],

    Jaymat1210: [
      "I'm the goat",
      "BRO 💀",
      "nah trust",
      "we're so back"
    ],

    Scrappy: [
      "dream of the year watch jobs minecraft",
      "classic stream moment",
      "this is peak",
      "I was here"
    ]

  };


  /* =======================================================
     LIVE CHAT ORDER
     ======================================================= */

  const streamMessages = [

    { name: "Aylmer", type: "human" },
    { name: "Keysha", type: "human" },
    { name: "Jayden", type: "human" },
    { name: "Denise", type: "human" },
    { name: "Drossog", type: "bot" },
    { name: "Frenchfries", type: "bot" },
    { name: "Keysha", type: "human" },
    { name: "Jaymat1210", type: "bot" },
    { name: "Scrappy", type: "bot" },
    { name: "Ash", type: "human" },
    { name: "Alymer", type: "human" },
    { name: "Jayden", type: "human" },
    { name: "Keysha", type: "human" },
    { name: "Denise", type: "human" }
  ];


  const messageIndexes = {
    Denise: 0,
    Alymer: 0,
    Jayden: 0,
    Keysha: 0,
    Ash: 0,

    Drossog: 0,
    Frenchfries: 0,
    Jaymat1210: 0,
    Scrappy: 0
  };


  /* =======================================================
     POLL
     ======================================================= */

  const pollVotes = {

    Brookhaven: 34,
    "Obby Challenge": 28,
    Simulator: 21,
    Adventure: 17

  };


  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message) {

    if (!toastContainer) return;

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `
      <strong>BlockLive</strong>
      · ${escapeHTML(message)}
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2600);

  }


  /* =======================================================
     HTML ESCAPE
     ======================================================= */

  function escapeHTML(value) {

    return String(value).replace(
      /[&<>"']/g,
      (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character])
    );

  }


  /* =======================================================
     FORMAT TIME
     ======================================================= */

  function formatTime(totalSeconds) {

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const secondsOnly =
      totalSeconds % 60;

    return [
      hours,
      minutes,
      secondsOnly
    ]
      .map((value) =>
        String(value).padStart(2, "0")
      )
      .join(":");

  }


  /* =======================================================
     UI UPDATE
     ======================================================= */

  function updateUI() {

    if (streamStatus) {

      streamStatus.classList.toggle(
        "live",
        live
      );

      streamStatus.innerHTML = `
        <span></span>
        <strong>${live ? "LIVE" : "OFFLINE"}</strong>
      `;

    }


    if (sidebarStreamStatus) {
      sidebarStreamStatus.classList.toggle(
        "live",
        live
      );
    }


    if (sidebarStatus) {
      sidebarStatus.textContent =
        live
          ? "Broadcast active"
          : "Not broadcasting";
    }


    if (sidebarViewers) {
      sidebarViewers.textContent =
        live
          ? `${viewers.toLocaleString()} viewers`
          : "0 viewers";
    }


    if (videoLive) {

      videoLive.textContent =
        live ? "LIVE" : "OFFLINE";

      videoLive.classList.toggle(
        "live",
        live
      );

    }


    if (videoMessage) {

      videoMessage.classList.toggle(
        "live",
        live
      );

      if (!live) {

        videoMessage.querySelector("h3").textContent =
          "Stream Offline";

        videoMessage.querySelector("p").textContent =
          "Start the stream to activate the room.";

      } else {

        videoMessage.querySelector("h3").textContent =
          "Live Now";

        videoMessage.querySelector("p").textContent =
          "The BlockLive room is active.";

      }

    }


    if (viewerCount) {
      viewerCount.textContent =
        live
          ? viewers.toLocaleString()
          : "0";
    }


    if (streamTimer) {
      streamTimer.textContent =
        formatTime(seconds);
    }


    if (likeCount) {
      likeCount.textContent =
        likes.toLocaleString();
    }


    if (statViewers) {
      statViewers.textContent =
        live
          ? viewers.toLocaleString()
          : "0";
    }


    if (statLikes) {
      statLikes.textContent =
        likes.toLocaleString();
    }


    if (statMessages) {
      statMessages.textContent =
        messagesSent.toLocaleString();
    }


    if (statStatus) {
      statStatus.textContent =
        live ? "LIVE" : "OFFLINE";
    }


    if (chatStatus) {
      chatStatus.textContent =
        live
          ? `${viewers.toLocaleString()} watching`
          : "Room is quiet";
    }


    if (chatInput) {

      chatInput.disabled = !live;

      chatInput.placeholder =
        live
          ? "Say something to the room..."
          : "Go live to chat...";

    }


    if (sendChatButton) {
      sendChatButton.disabled = !live;
    }


    if (startStreamButton) {

      startStreamButton.textContent =
        live
          ? "Stream is Live"
          : "Start Stream";

      startStreamButton.disabled = live;

    }

  }


  /* =======================================================
     RESET CHAT
     ======================================================= */

  function resetChat() {

    chatSequenceTimers.forEach((timer) =>
      clearTimeout(timer)
    );

    chatSequenceTimers = [];

    if (!chatMessages) return;

    chatMessages.innerHTML = `
      <div class="chat-empty" id="chatEmpty">
        <div class="chat-empty-icon">✦</div>
        <strong>No messages yet</strong>
        <span>
          Start the stream and the room will come alive.
        </span>
      </div>
    `;

    messagesSent = 0;

    updateUI();

  }


  /* =======================================================
     CHAT MESSAGE
     ======================================================= */

  function addChatMessage(
    name,
    text,
    type = "human",
    displayedName = null
  ) {

    if (!chatMessages) return;

    const existingEmpty =
      chatMessages.querySelector(".chat-empty");

    if (existingEmpty) {
      existingEmpty.remove();
    }


    const message = document.createElement("div");

    message.className = "chat-message";


    const shownName =
      displayedName || name;


    const role =
      type === "bot"
        ? `<span class="bot-badge">BOT</span>`
        : `<span class="chat-role">Presenter</span>`;


    message.innerHTML = `
      <div class="chat-name">
        ${escapeHTML(shownName)}
        ${role}
      </div>

      <div class="chat-text">
        ${escapeHTML(text)}
      </div>
    `;


    chatMessages.appendChild(message);

    chatMessages.scrollTop =
      chatMessages.scrollHeight;


    messagesSent++;

    updateUI();

  }


  /* =======================================================
     MESSAGE PICKER
     ======================================================= */

  function getNextMessage(name) {

    const collection =
      humanMessages[name] ||
      botMessages[name];

    if (!collection || !collection.length) {
      return "nice";
    }


    const index =
      messageIndexes[name] %
      collection.length;


    messageIndexes[name]++;

    return collection[index];

  }


  /* =======================================================
     STREAM CHAT SEQUENCE
     ======================================================= */

  function startChatSequence() {

    chatSequenceTimers.forEach((timer) =>
      clearTimeout(timer)
    );

    chatSequenceTimers = [];


    streamMessages.forEach(
      (entry, index) => {

        const delay =
          550 +
          index * 1350 +
          Math.floor(Math.random() * 450);


        const timer =
          setTimeout(() => {

            if (!live) return;


            if (typingIndicator) {
              typingIndicator.classList.add("show");
            }


            const typingTimer =
              setTimeout(() => {

                if (typingIndicator) {
                  typingIndicator.classList.remove("show");
                }


                const message =
                  getNextMessage(entry.name);


                addChatMessage(
                  entry.name,
                  message,
                  entry.type
                );

              }, 450);


            chatSequenceTimers.push(
              typingTimer
            );


          }, delay);


        chatSequenceTimers.push(timer);

      }
    );

  }


  /* =======================================================
     RANDOM CHAT LOOP
     ======================================================= */

  function continueChatLoop() {

    if (!live) return;


    const randomDelay =
      4500 +
      Math.floor(Math.random() * 3500);


    const timer =
      setTimeout(() => {

        if (!live) return;


        const randomEntry =
          streamMessages[
            Math.floor(
              Math.random() *
              streamMessages.length
            )
          ];


        const message =
          getNextMessage(randomEntry.name);


        addChatMessage(
          randomEntry.name,
          message,
          randomEntry.type
        );


        continueChatLoop();

      }, randomDelay);


    chatSequenceTimers.push(timer);

  }


  /* =======================================================
     START STREAM
     ======================================================= */

  function startStream() {

    if (live) return;


    live = true;

    seconds = 0;

    viewers =
      1100 +
      Math.floor(Math.random() * 400);


    selectedGame = "Brookhaven";


    resetChat();


    pollVotes.Brookhaven = 34;
    pollVotes["Obby Challenge"] = 28;
    pollVotes.Simulator = 21;
    pollVotes.Adventure = 17;


    updatePoll();


    updateUI();


    showToast(
      "Stream room is live."
    );


    streamTimerInterval =
      setInterval(() => {

        if (!live) return;


        seconds++;


        viewers +=
          Math.floor(
            Math.random() * 31
          ) - 14;


        viewers =
          Math.max(
            850,
            viewers
          );


        updateUI();

      }, 1000);


    startChatSequence();


    setTimeout(() => {

      if (live) {
        continueChatLoop();
      }

    }, 15000);

  }


  /* =======================================================
     STOP STREAM
     ======================================================= */

  function stopStream() {

    if (!live) return;


    live = false;


    clearInterval(
      streamTimerInterval
    );


    streamTimerInterval = null;


    chatSequenceTimers.forEach(
      (timer) =>
        clearTimeout(timer)
    );


    chatSequenceTimers = [];


    seconds = 0;
    viewers = 0;


    resetChat();


    showToast(
      "Stream stopped."
    );


    updateUI();

  }


  /* =======================================================
     START BUTTON
     ======================================================= */

  if (startStreamButton) {

    startStreamButton.addEventListener(
      "click",
      startStream
    );

  }


  /* =======================================================
     LIKE BUTTON
     ======================================================= */

  if (likeButton) {

    likeButton.addEventListener(
      "click",
      () => {

        if (!live) {

          showToast(
            "Go live before reacting."
          );

          return;
        }


        likes++;


        updateUI();


        likeButton.classList.add(
          "liked"
        );


        setTimeout(() => {

          likeButton.classList.remove(
            "liked"
          );

        }, 180);

      }
    );

  }


  /* =======================================================
     SHARE
     ======================================================= */

  if (shareButton) {

    shareButton.addEventListener(
      "click",
      async () => {

        try {

          await navigator.clipboard.writeText(
            window.location.href
          );

          showToast(
            "Stream link copied."
          );

        } catch {

          showToast(
            "Share link is ready."
          );

        }

      }
    );

  }


  /* =======================================================
     NOTIFY
     ======================================================= */

  if (notifyButton) {

    notifyButton.addEventListener(
      "click",
      () => {

        notifyButton.classList.toggle(
          "active"
        );


        showToast(
          notifyButton.classList.contains("active")
            ? "Stream notifications enabled."
            : "Stream notifications disabled."
        );

      }
    );

  }


  /* =======================================================
     NOTIFICATION TOPBAR
     ======================================================= */

  const notificationButton =
    $("notificationButton");


  if (notificationButton) {

    notificationButton.addEventListener(
      "click",
      () => {

        showToast(
          live
            ? "BlockLive is currently live."
            : "No new project notifications."
        );

      }
    );

  }


  /* =======================================================
     MUTE
     ======================================================= */

  if (muteButton) {

    muteButton.addEventListener(
      "click",
      () => {

        muted = !muted;


        muteButton.textContent =
          muted
            ? "🔇"
            : "🔊";


        showToast(
          muted
            ? "Stream audio muted."
            : "Stream audio unmuted."
        );

      }
    );

  }


  /* =======================================================
     FULLSCREEN
     ======================================================= */

  if (fullscreenButton && videoStage) {

    fullscreenButton.addEventListener(
      "click",
      async () => {

        try {

          if (!document.fullscreenElement) {

            await videoStage.requestFullscreen();

          } else {

            await document.exitFullscreen();

          }

        } catch {

          showToast(
            "Fullscreen is unavailable here."
          );

        }

      }
    );

  }


  /* =======================================================
     GAME SELECTOR
     ======================================================= */

  gameButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          gameButtons.forEach(
            (item) =>
              item.classList.remove("active")
          );


          button.classList.add(
            "active"
          );


          selectedGame =
            button.dataset.game ||
            "Brookhaven";


          if (currentGame) {

            currentGame.textContent =
              selectedGame;

          }


          if (live) {

            addChatMessage(
              "Ash",
              `switching to ${selectedGame}`,
              "human"
            );

          }


          showToast(
            `${selectedGame} selected.`
          );

        }
      );

    }
  );


  /* =======================================================
     CHAT SUBMIT
     ======================================================= */

  if (chatForm) {

    chatForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        if (!live) {

          showToast(
            "Chat is locked while offline."
          );

          return;

        }


        const text =
          chatInput.value.trim();


        if (!text) return;


        /*
          IMPORTANT:
          Actual user's messages appear as
          "You" + "Presenter".
          This is separate from the simulated
          Ash presenter in the stream chat.
        */

        addChatMessage(
          "You",
          text,
          "human"
        );


        chatInput.value = "";

      }
    );

  }


  /* =======================================================
     CLEAR CHAT
     ======================================================= */

  if (clearChatButton) {

    clearChatButton.addEventListener(
      "click",
      () => {

        if (!chatMessages) return;


        chatSequenceTimers.forEach(
          (timer) =>
            clearTimeout(timer)
        );


        chatSequenceTimers = [];


        chatMessages.innerHTML = `
          <div class="chat-empty">
            <div class="chat-empty-icon">✦</div>
            <strong>Chat cleared</strong>
            <span>
              New messages can appear while the stream continues.
            </span>
          </div>
        `;


        messagesSent = 0;


        updateUI();


        showToast(
          "Chat cleared."
        );

      }
    );

  }


  /* =======================================================
     POLL UPDATE
     ======================================================= */

  function updatePoll() {

    const total =
      Object.values(pollVotes).reduce(
        (sum, value) =>
          sum + value,
        0
      );


    pollOptions.forEach(
      (option) => {

        const game =
          option.dataset.poll;


        const percentage =
          total === 0
            ? 0
            : Math.round(
                (pollVotes[game] / total) * 100
              );


        const value =
          option.querySelector("b");


        const bar =
          option.querySelector("em");


        if (value) {
          value.textContent =
            `${percentage}%`;
        }


        if (bar) {
          bar.style.width =
            `${percentage}%`;
        }

      }
    );

  }


  /* =======================================================
     POLL CLICK
     ======================================================= */

  pollOptions.forEach(
    (option) => {

      option.addEventListener(
        "click",
        () => {

          if (!live) {

            showToast(
              "Start the stream before voting."
            );

            return;

          }


          const selected =
            option.dataset.poll;


          pollVotes[selected]++;


          updatePoll();


          if (pollStatus) {

            pollStatus.textContent =
              "VOTE RECORDED";

          }


          showToast(
            `Vote counted for ${selected}.`
          );


          setTimeout(() => {

            if (pollStatus) {

              pollStatus.textContent =
                "LIVE POLL";

            }

          }, 1400);

        }
      );

    }
  );


  /* =======================================================
     READ MORE
     ======================================================= */

  $$(".read-more").forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const card =
            button.closest(
              ".research-card"
            );


          if (!card) return;


          const expanded =
            card.classList.toggle(
              "expanded"
            );


          button.textContent =
            expanded
              ? "Show Less"
              : "Read More";

        }
      );

    }
  );


  /* =======================================================
     THEME TOGGLE
     ======================================================= */

  function createThemeToggle() {

    if (themeButton) return;


    themeButton =
      document.createElement("button");


    themeButton.id =
      "themeToggle";


    themeButton.className =
      "small-icon-button";


    themeButton.type =
      "button";


    themeButton.setAttribute(
      "aria-label",
      "Toggle light and dark mode"
    );


    const savedTheme =
      localStorage.getItem(
        "blocklive-theme"
      );


    if (savedTheme === "light") {

      document.body.classList.add(
        "light-mode"
      );

    }


    updateThemeIcon();


    const topbarRight =
      document.querySelector(
        ".topbar-right"
      );


    if (topbarRight) {

      topbarRight.insertBefore(
        themeButton,
        topbarRight.firstChild
      );

    }


    themeButton.addEventListener(
      "click",
      () => {

        const light =
          document.body.classList.toggle(
            "light-mode"
          );


        localStorage.setItem(
          "blocklive-theme",
          light
            ? "light"
            : "dark"
        );


        updateThemeIcon();


        showToast(
          light
            ? "Light mode enabled."
            : "Dark mode enabled."
        );

      }
    );

  }


  function updateThemeIcon() {

    if (!themeButton) return;


    themeButton.textContent =
      document.body.classList.contains(
        "light-mode"
      )
        ? "☀"
        : "☾";

  }


  createThemeToggle();


  /* =======================================================
     NAV ACTIVE STATE
     ======================================================= */

  const sections =
    $$("main section[id]");


  const navLinks =
    $$(".nav-link");


  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        const visible =
          entries
            .filter(
              (entry) =>
                entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            )[0];


        if (!visible) return;


        navLinks.forEach(
          (link) => {

            const matches =
              link.getAttribute("href") ===
              `#${visible.target.id}`;


            link.classList.toggle(
              "active",
              matches
            );

          }
        );

      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.05, 0.2, 0.5]
      }
    );


  sections.forEach(
    (section) =>
      sectionObserver.observe(section)
  );


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  resetChat();

  updatePoll();

  updateUI();

});
