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

  const selectAll = (selector) =>
    Array.from(document.querySelectorAll(selector));


  /* =======================================================
     ELEMENTS
  ======================================================= */

  const body = document.body;

  const themeToggle = $("themeToggle");

  const startStreamButton = $("startStreamButton");

  const heroStreamStatus = $("heroStreamStatus");
  const heroLiveBadge = $("heroLiveBadge");
  const heroOffline = $("heroOffline");
  const heroGameName = $("heroGameName");

  const videoLive = $("videoLive");
  const videoOverlayLive = $("videoOverlayLive");
  const videoMessage = $("videoMessage");

  const viewerCount = $("viewerCount");
  const streamTimer = $("streamTimer");

  const currentGame = $("currentGame");

  const likeButton = $("likeButton");
  const likeCount = $("likeCount");

  const statStatus = $("statStatus");
  const statViewers = $("statViewers");
  const statLikes = $("statLikes");
  const statMessages = $("statMessages");

  const chatStatus = $("chatStatus");
  const chatMessages = $("chatMessages");
  const chatEmpty = $("chatEmpty");

  const chatForm = $("chatForm");
  const chatInput = $("chatInput");
  const sendChatButton = $("sendChatButton");

  const typingIndicator = $("typingIndicator");
  const clearChatButton = $("clearChatButton");

  const muteButton = $("muteButton");
  const fullscreenButton = $("fullscreenButton");

  const shareButton = $("shareButton");
  const notifyButton = $("notifyButton");

  const pollStatus = $("pollStatus");

  const toastContainer = $("toastContainer");


  /* =======================================================
     STATE
  ======================================================= */

  let streamLive = false;

  let streamSeconds = 0;

  let viewers = 0;

  let likes = 42;

  let messageCount = 0;

  let timerInterval = null;

  let chatTimeouts = [];

  let muted = false;

  let notificationsEnabled = false;

  let pollRevealed = false;


  const pollVotes = {
    "Brookhaven": 34,
    "Obby Challenge": 28,
    "Simulator": 21,
    "Adventure": 17
  };


  /* =======================================================
     CHAT DATA
  ======================================================= */

  const chatSequence = [

    {
      name: "Drossog",
      type: "bot",
      text: "tuff"
    },

    {
      name: "Frenchfries",
      type: "bot",
      text: "rating this a 6.7"
    },

    {
      name: "Jaymat1210",
      type: "bot",
      text: "I'm the goat"
    },

    {
      name: "Scrappy",
      type: "bot",
      text: "dream of the year watch jobs minecraft"
    },

    {
      name: "Keysha",
      type: "human",
      text: "let chat choose the next move"
    },

    {
      name: "Aylmer",
      type: "human",
      text: "BRO the lobby is already wild"
    },

    {
      name: "Jayden",
      type: "human",
      text: "nah this is about to go bad"
    },

    {
      name: "Denise",
      type: "human",
      text: "I voted risk 😭"
    },

    {
      name: "Aylmer",
      type: "human",
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
      type: "human",
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
      type: "human",
      text: "okay buddy"
    },

    {
      name: "Aylmer",
      type: "human",
      text: "six seven"
    },

    {
      name: "Jayden",
      type: "human",
      text: "HAHAHAHA"
    },

    {
      name: "Keysha",
      type: "human",
      text: "stop staring at me"
    },

    {
      name: "Denise",
      type: "human",
      text: "someone clip that"
    }

  ];


  /* =======================================================
     THEME
  ======================================================= */

  function updateThemeIcon() {

    if (!themeToggle) return;

    const lightMode =
      body.classList.contains("light-mode");

    themeToggle.textContent =
      lightMode ? "☀" : "☾";

    themeToggle.setAttribute(
      "aria-label",
      lightMode
        ? "Switch to dark mode"
        : "Switch to light mode"
    );
  }


  function setTheme(mode) {

    if (mode === "light") {
      body.classList.add("light-mode");
      localStorage.setItem("blocklive-theme", "light");
    } else {
      body.classList.remove("light-mode");
      localStorage.setItem("blocklive-theme", "dark");
    }

    updateThemeIcon();
  }


  const savedTheme =
    localStorage.getItem("blocklive-theme");

  if (savedTheme === "light") {
    setTheme("light");
  } else {
    setTheme("dark");
  }


  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      const lightMode =
        body.classList.contains("light-mode");

      setTheme(lightMode ? "dark" : "light");

      showToast(
        lightMode
          ? "Dark mode enabled."
          : "Light mode enabled."
      );

    });

  }


  /* =======================================================
     TOAST
  ======================================================= */

  function showToast(message) {

    if (!toastContainer) return;

    const toast =
      document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2800);
  }


  /* =======================================================
     FORMAT TIME
  ======================================================= */

  function formatTime(totalSeconds) {

    const minutes =
      Math.floor(totalSeconds / 60);

    const seconds =
      totalSeconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  }


  /* =======================================================
     UPDATE STREAM UI
  ======================================================= */

  function updateStreamUI() {

    const status =
      streamLive ? "LIVE" : "OFFLINE";

    const viewerText =
      streamLive
        ? `${viewers.toLocaleString()} viewers`
        : "0 viewers";


    if (heroStreamStatus) {
      heroStreamStatus.textContent = status;
    }

    if (heroLiveBadge) {
      heroLiveBadge.textContent = status;
    }

    if (videoLive) {

      videoLive.textContent = status;

      videoLive.classList.toggle(
        "live",
        streamLive
      );

    }

    if (videoOverlayLive) {
      videoOverlayLive.textContent = status;
    }

    if (viewerCount) {
      viewerCount.textContent = viewerText;
    }

    if (streamTimer) {
      streamTimer.textContent =
        formatTime(streamSeconds);
    }

    if (statStatus) {
      statStatus.textContent =
        streamLive ? "Live" : "Offline";
    }

    if (statViewers) {
      statViewers.textContent =
        streamLive
          ? viewers.toLocaleString()
          : "0";
    }

    if (statLikes) {
      statLikes.textContent =
        likes.toLocaleString();
    }

    if (statMessages) {
      statMessages.textContent =
        messageCount.toString();
    }

    if (chatStatus) {
      chatStatus.textContent =
        streamLive
          ? `${viewers.toLocaleString()} watching`
          : "Waiting for stream";
    }

    if (heroOffline) {
      heroOffline.style.opacity =
        streamLive ? "0" : "1";

      heroOffline.style.pointerEvents =
        streamLive ? "none" : "auto";
    }

    if (videoMessage) {
      videoMessage.classList.toggle(
        "hidden",
        streamLive
      );
    }

    if (chatInput) {
      chatInput.disabled = !streamLive;

      chatInput.placeholder =
        streamLive
          ? "Say something..."
          : "Start the stream to chat...";
    }

    if (sendChatButton) {
      sendChatButton.disabled =
        !streamLive;
    }

  }


  /* =======================================================
     START STREAM
  ======================================================= */

  function startStream() {

    if (streamLive) return;

    streamLive = true;

    streamSeconds = 0;

    viewers =
      1100 +
      Math.floor(Math.random() * 300);

    messageCount = 0;

    clearScheduledChat();

    resetChat();

    updateStreamUI();

    showToast(
      "The BlockLive stream is now live."
    );


    timerInterval =
      setInterval(() => {

        streamSeconds++;

        const change =
          Math.floor(
            Math.random() * 19
          ) - 7;

        viewers =
          Math.max(
            0,
            viewers + change
          );

        updateStreamUI();

      }, 1000);


    scheduleChat();

  }


  /* =======================================================
     STOP STREAM
  ======================================================= */

  function stopStream() {

    if (!streamLive) return;

    streamLive = false;

    clearInterval(timerInterval);

    timerInterval = null;

    clearScheduledChat();

    streamSeconds = 0;

    viewers = 0;

    messageCount = 0;

    resetChat();

    updateStreamUI();

    showToast(
      "Stream ended. The room is offline."
    );

  }


  if (startStreamButton) {

    startStreamButton.addEventListener(
      "click",
      () => {

        if (streamLive) {
          stopStream();
        } else {
          startStream();
        }

      }
    );

  }


  /* =======================================================
     CHAT
  ======================================================= */

  function clearScheduledChat() {

    chatTimeouts.forEach(
      (timeout) => clearTimeout(timeout)
    );

    chatTimeouts = [];

    if (typingIndicator) {
      typingIndicator.classList.remove("show");
    }

  }


  function resetChat() {

    if (!chatMessages) return;

    chatMessages.innerHTML = `
      <div class="chat-empty" id="chatEmpty">
        <span>✦</span>
        <strong>Chat is quiet.</strong>
        <small>
          Start the stream and the conversation will begin.
        </small>
      </div>
    `;

  }


  function escapeHTML(text) {

    const div =
      document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
  }


  function addChatMessage(
    name,
    text,
    type = "human"
  ) {

    if (!chatMessages) return;

    const empty =
      chatMessages.querySelector(
        ".chat-empty"
      );

    if (empty) {
      empty.remove();
    }


    const message =
      document.createElement("div");

    message.className =
      "chat-message";


    const role =
      type === "bot"
        ? "BOT"
        : "Presenter";


    const roleClass =
      type === "bot"
        ? "chat-role bot"
        : "chat-role";


    message.innerHTML = `
      <div class="chat-message-header">

        <span class="chat-name">
          ${escapeHTML(name)}
        </span>

        <span class="${roleClass}">
          ${role}
        </span>

      </div>

      <div class="chat-text">
        ${escapeHTML(text)}
      </div>
    `;


    chatMessages.appendChild(message);

    chatMessages.scrollTop =
      chatMessages.scrollHeight;

    messageCount++;

    updateStreamUI();

  }


  function scheduleChat() {

    clearScheduledChat();


    chatSequence.forEach(
      (message, index) => {

        const delay =
          700 +
          index * 1150;


        const timeout =
          setTimeout(() => {

            if (!streamLive) return;

            if (typingIndicator) {

              typingIndicator.classList.add(
                "show"
              );

            }


            const typingTime =
              250 +
              Math.floor(
                Math.random() * 350
              );


            const secondTimeout =
              setTimeout(() => {

                if (!streamLive) return;

                if (typingIndicator) {

                  typingIndicator.classList.remove(
                    "show"
                  );

                }

                addChatMessage(
                  message.name,
                  message.text,
                  message.type
                );

              }, typingTime);


            chatTimeouts.push(
              secondTimeout
            );

          }, delay);


        chatTimeouts.push(timeout);

      }
    );

  }


  if (chatForm) {

    chatForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        if (!streamLive) {

          showToast(
            "Start the stream before chatting."
          );

          return;
        }


        const text =
          chatInput.value.trim();

        if (!text) return;


        /*
          IMPORTANT:
          The actual user is displayed as "You",
          while the simulated Ash presenter remains
          "Ash" in the stream conversation.
        */

        addChatMessage(
          "You",
          text,
          "human"
        );


        chatInput.value = "";

        chatInput.focus();

      }
    );

  }


  if (clearChatButton) {

    clearChatButton.addEventListener(
      "click",
      () => {

        resetChat();

        messageCount = 0;

        updateStreamUI();

        showToast(
          "Chat cleared."
        );

      }
    );

  }


  /* =======================================================
     LIKES
  ======================================================= */

  if (likeButton) {

    likeButton.addEventListener(
      "click",
      () => {

        likes++;

        if (likeCount) {
          likeCount.textContent =
            likes.toLocaleString();
        }

        if (statLikes) {
          statLikes.textContent =
            likes.toLocaleString();
        }


        likeButton.classList.add(
          "pressed"
        );


        setTimeout(() => {

          likeButton.classList.remove(
            "pressed"
          );

        }, 130);

      }
    );

  }


  /* =======================================================
     GAME SELECTOR
  ======================================================= */

  const gameButtons =
    selectAll(".game-button");


  gameButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const game =
            button.dataset.game ||
            button.textContent.trim();


          gameButtons.forEach(
            (other) => {

              other.classList.toggle(
                "active",
                other === button
              );

            }
          );


          if (currentGame) {
            currentGame.textContent =
              game;
          }

          if (heroGameName) {
            heroGameName.textContent =
              game;
          }


          if (streamLive) {

            addChatMessage(
              "You",
              `Let's switch to ${game}.`,
              "human"
            );

          }


          showToast(
            `${game} selected.`
          );

        }
      );

    }
  );


  /* =======================================================
     POLL
  ======================================================= */

  const pollOptions =
    selectAll(".poll-option");


  function updatePollResults() {

    const total =
      Object.values(pollVotes)
        .reduce(
          (sum, value) => sum + value,
          0
        );


    pollOptions.forEach(
      (option) => {

        const name =
          option.dataset.poll;

        const votes =
          pollVotes[name] || 0;

        const percentage =
          Math.round(
            (votes / total) * 100
          );


        const percent =
          option.querySelector(
            ".poll-percent"
          );

        const fill =
          option.querySelector(
            ".poll-fill"
          );


        if (percent) {
          percent.textContent =
            `${percentage}%`;
        }

        if (fill) {
          fill.style.width =
            `${percentage}%`;
        }

        option.classList.add(
          "results-visible"
        );

      }
    );


    pollRevealed = true;

    if (pollStatus) {
      pollStatus.textContent =
        "Live results";
    }

  }


  pollOptions.forEach(
    (option) => {

      option.addEventListener(
        "click",
        () => {

          const choice =
            option.dataset.poll;


          /*
            The important behavior:
            percentages are hidden until the
            viewer clicks a poll option.
          */

          if (!pollRevealed) {

            pollVotes[choice]++;

            updatePollResults();

          } else {

            pollVotes[choice]++;

            updatePollResults();

          }


          pollOptions.forEach(
            (other) => {

              other.classList.toggle(
                "selected",
                other === option
              );

            }
          );


          if (streamLive) {

            addChatMessage(
              "You",
              `I voted for ${choice}.`,
              "human"
            );

          }


          showToast(
            `Vote recorded: ${choice}`
          );

        }
      );

    }
  );


  /* =======================================================
     MUTE
  ======================================================= */

  if (muteButton) {

    muteButton.addEventListener(
      "click",
      () => {

        muted = !muted;

        muteButton.textContent =
          muted ? "🔇" : "🔊";

        muteButton.setAttribute(
          "aria-label",
          muted ? "Unmute stream" : "Mute stream"
        );

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

  if (fullscreenButton) {

    fullscreenButton.addEventListener(
      "click",
      async () => {

        const videoArea =
          $("videoArea");

        if (!videoArea) return;


        try {

          if (!document.fullscreenElement) {

            await videoArea.requestFullscreen();

          } else {

            await document.exitFullscreen();

          }

        } catch (error) {

          showToast(
            "Fullscreen is unavailable here."
          );

        }

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

        const shareData = {
          title:
            "BlockLive | Roblox Streaming Project",

          text:
            "Check out our Roblox streaming project.",

          url:
            window.location.href
        };


        try {

          if (
            navigator.share &&
            window.isSecureContext
          ) {

            await navigator.share(
              shareData
            );

          } else if (
            navigator.clipboard &&
            window.isSecureContext
          ) {

            await navigator.clipboard.writeText(
              window.location.href
            );

            showToast(
              "Project link copied."
            );

          } else {

            showToast(
              "Project is ready to share."
            );

          }

        } catch (error) {

          if (
            error &&
            error.name !== "AbortError"
          ) {

            showToast(
              "Project is ready to share."
            );

          }

        }

      }
    );

  }


  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  if (notifyButton) {

    notifyButton.addEventListener(
      "click",
      () => {

        notificationsEnabled =
          !notificationsEnabled;


        notifyButton.textContent =
          notificationsEnabled
            ? "Notifications On"
            : "Notify Me";


        showToast(
          notificationsEnabled
            ? "Notifications enabled."
            : "Notifications disabled."
        );

      }
    );

  }


  /* =======================================================
     READ MORE
  ======================================================= */

  const readMoreButtons =
    selectAll(".read-more");


  readMoreButtons.forEach(
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
     NAVIGATION
  ======================================================= */

  const navLinks =
    selectAll(".nav-link");


  navLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          navLinks.forEach(
            (other) =>
              other.classList.remove(
                "active"
              )
          );

          link.classList.add(
            "active"
          );

        }
      );

    }
  );


  const sections =
    selectAll("main section[id]");


  const observer =
    new IntersectionObserver(
      (entries) => {

        const visible =
          entries
            .filter(
              (entry) => entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            )[0];


        if (!visible) return;


        navLinks.forEach(
          (link) => {

            const target =
              link.getAttribute("href");


            link.classList.toggle(
              "active",
              target ===
                `#${visible.target.id}`
            );

          }
        );

      },
      {
        threshold: .18
      }
    );


  sections.forEach(
    (section) =>
      observer.observe(section)
  );


  /* =======================================================
     MOBILE NAV
  ======================================================= */

  const nav =
    document.querySelector(
      ".main-nav"
    );


  if (nav && window.innerWidth <= 760) {

    const mobileButton =
      document.createElement("button");

    mobileButton.className =
      "icon-button mobile-nav-button";

    mobileButton.type =
      "button";

    mobileButton.textContent =
      "☰";

    mobileButton.setAttribute(
      "aria-label",
      "Open navigation"
    );


    const navActions =
      document.querySelector(
        ".nav-actions"
      );


    if (navActions) {

      navActions.prepend(
        mobileButton
      );


      mobileButton.addEventListener(
        "click",
        () => {

          nav.classList.toggle(
            "mobile-open"
          );

        }
      );


      navLinks.forEach(
        (link) => {

          link.addEventListener(
            "click",
            () => {

              nav.classList.remove(
                "mobile-open"
              );

            }
          );

        }
      );

    }

  }


  /* =======================================================
     INITIAL STATE
  ======================================================= */

  if (likeCount) {
    likeCount.textContent =
      likes.toLocaleString();
  }

  if (statLikes) {
    statLikes.textContent =
      likes.toLocaleString();
  }

  updateStreamUI();

});
