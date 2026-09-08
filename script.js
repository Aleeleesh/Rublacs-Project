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
     STATE
  ======================================================= */

  let live = false;

  let seconds = 0;

  let viewers = 0;

  let likes = Number(
    localStorage.getItem("blockliveLikes") || 42
  );

  let messagesSent = 0;

  let timer = null;

  let chatTimer = null;

  let typingTimer = null;

  let muted = false;

  let selectedGame = "Brookhaven";


  /* =======================================================
     PEOPLE
  ======================================================= */

  const humanMessages = [

    {
      name: "Denise",
      messages: [
        "I voted risk 😭",
        "someone clip that",
        "this is getting chaotic"
      ]
    },

    {
      name: "Alymer",
      messages: [
        "BRO the lobby is already wild",
        "we are NOT surviving this",
        "okay buddy",
        "six seven"
      ]
    },

    {
      name: "Jayden",
      messages: [
        "nah this is about to go bad",
        "HAHAHAHA",
        "bro what just happened"
      ]
    },

    {
      name: "Keysha",
      messages: [
        "let chat choose the next move",
        "Ash look behind you",
        "stop staring at me"
      ]
    },

    {
      name: "Ash",
      messages: [
        "six seven",
        "nah we're actually cooking",
        "okay this is crazy"
      ]
    }

  ];


  const botMessages = [

    {
      name: "Drossog",
      messages: [
        "wait that actually worked",
        "tuff",
        "okay this is actually clean",
        "nah that was crazy"
      ]
    },

    {
      name: "Frenchfries",
      messages: [
        "chat is cooking today",
        "rating this a 6.7",
        "this stream is tuff"
      ]
    },

    {
      name: "Jaymat1210",
      messages: [
        "I'm the goat",
        "BRO 💀",
        "nahhhhh"
      ]
    },

    {
      name: "Scrappy",
      messages: [
        "classic stream moment",
        "dream of the year watch jobs minecraft",
        "this is peak"
      ]
    }

  ];


  /* =======================================================
     POLL
  ======================================================= */

  const pollVotes = {
    "Brookhaven": 34,
    "Obby Challenge": 28,
    "Simulator": 21,
    "Adventure": 17
  };

  let pollHasBeenRevealed = false;


  /* =======================================================
     TOAST
  ======================================================= */

  function showToast(message) {

    const container = $("toastContainer");

    if (!container) {
      return;
    }

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `
      <strong>BLOCKLIVE</strong> · ${escapeHTML(message)}
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2700);
  }


  /* =======================================================
     SAFE HTML
  ======================================================= */

  function escapeHTML(value) {

    return String(value).replace(
      /[&<>"']/g,
      (character) => {

        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"
        };

        return map[character];
      }
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

    const secondsPart = totalSeconds % 60;

    return [
      hours,
      minutes,
      secondsPart
    ]
      .map((value) =>
        String(value).padStart(2, "0")
      )
      .join(":");
  }


  /* =======================================================
     UPDATE UI
  ======================================================= */

  function updateUI() {

    const statusText = live ? "LIVE" : "OFFLINE";

    const viewerText = live
      ? `${viewers.toLocaleString()} viewers`
      : "0 viewers";


    /* TOP STATUS */

    if ($("topStatus")) {
      $("topStatus").textContent = statusText;
    }


    const systemStatus =
      document.querySelector(".system-status");

    if (systemStatus) {
      systemStatus.classList.toggle(
        "live",
        live
      );
    }


    /* STREAM STATUS */

    if ($("streamStatus")) {

      $("streamStatus").innerHTML = `
        <span></span>
        ${statusText}
      `;

      $("streamStatus").classList.toggle(
        "live",
        live
      );
    }


    if ($("videoLive")) {
      $("videoLive").textContent = statusText;
    }


    if ($("viewerCount")) {
      $("viewerCount").textContent = viewerText;
    }


    if ($("chatStatus")) {
      $("chatStatus").textContent = statusText;

      $("chatStatus").classList.toggle(
        "live",
        live
      );
    }


    /* STREAM TIMER */

    if ($("streamTimer")) {
      $("streamTimer").textContent =
        formatTime(seconds);
    }


    /* CURRENT GAME */

    if ($("currentGame")) {
      $("currentGame").textContent =
        selectedGame;
    }

    if ($("heroGameName")) {
      $("heroGameName").textContent =
        selectedGame.toUpperCase();
    }


    if ($("selectedGameLabel")) {
      $("selectedGameLabel").textContent =
        selectedGame;
    }


    /* COUNTERS */

    if ($("likeCount")) {
      $("likeCount").textContent =
        likes.toLocaleString();
    }

    if ($("statLikes")) {
      $("statLikes").textContent =
        likes.toLocaleString();
    }

    if ($("statViewers")) {
      $("statViewers").textContent =
        live ? viewers.toLocaleString() : "0";
    }

    if ($("statMessages")) {
      $("statMessages").textContent =
        messagesSent.toLocaleString();
    }

    if ($("statStatus")) {
      $("statStatus").textContent =
        statusText;
    }


    /* OFFLINE COVER */

    if ($("offlineMessage")) {

      $("offlineMessage").classList.toggle(
        "hidden",
        live
      );
    }


    /* LIVE DOT */

    const liveDot =
      document.querySelector(".live-dot");

    if (liveDot) {
      liveDot.classList.toggle(
        "active",
        live
      );
    }


    /* CHAT INPUT */

    if ($("chatInput")) {

      $("chatInput").disabled = !live;

      $("chatInput").placeholder =
        live
          ? "Say something to the room..."
          : "Go live to chat...";
    }


    if ($("sendChatButton")) {
      $("sendChatButton").disabled = !live;
    }


    /* START BUTTON */

    if ($("startStreamButton")) {

      $("startStreamButton").disabled = live;

      $("startStreamButton").innerHTML = live
        ? `
          <span class="button-dot"></span>
          Stream is Live
        `
        : `
          <span class="button-dot"></span>
          Start Stream
        `;
    }

  }


  /* =======================================================
     CHAT
  ======================================================= */

  function resetChat() {

    const chat = $("chatMessages");

    if (!chat) {
      return;
    }

    chat.innerHTML = `
      <div class="chat-empty" id="chatEmpty">

        <span>✦</span>

        <strong>No messages yet</strong>

        <small>
          Start the stream to open the chat.
        </small>

      </div>
    `;

    messagesSent = 0;

    updateUI();
  }


  function addChatMessage(
    name,
    message,
    type = "human"
  ) {

    const chat = $("chatMessages");

    if (!chat) {
      return;
    }


    const empty = $("chatEmpty");

    if (empty) {
      empty.remove();
    }


    const messageElement =
      document.createElement("div");

    messageElement.className =
      "chat-message";


    const badge =
      type === "bot"
        ? `<span class="bot-badge">BOT</span>`
        : `<span class="presenter-badge">Presenter</span>`;


    messageElement.innerHTML = `
      <div class="chat-name">
        ${escapeHTML(name)}
        ${badge}
      </div>

      <div class="chat-text">
        ${escapeHTML(message)}
      </div>
    `;


    chat.appendChild(messageElement);

    chat.scrollTop = chat.scrollHeight;

    messagesSent++;

    updateUI();
  }


  function showTyping(show) {

    const indicator =
      $("typingIndicator");

    if (!indicator) {
      return;
    }

    indicator.classList.toggle(
      "show",
      show
    );
  }


  /* =======================================================
     SIMULATED CHAT
  ======================================================= */

  function randomFrom(array) {

    return array[
      Math.floor(
        Math.random() * array.length
      )
    ];
  }


  function sendNextSimulatedMessage() {

    if (!live) {
      return;
    }


    const useBot =
      Math.random() > 0.42;

    const people =
      useBot
        ? botMessages
        : humanMessages;

    const person =
      randomFrom(people);

    const message =
      randomFrom(person.messages);


    showTyping(true);


    setTimeout(() => {

      if (!live) {
        showTyping(false);
        return;
      }

      showTyping(false);

      addChatMessage(
        person.name,
        message,
        useBot ? "bot" : "human"
      );

    }, 600);


    chatTimer = setTimeout(
      sendNextSimulatedMessage,
      1900 + Math.random() * 2200
    );

  }


  /* =======================================================
     START STREAM
  ======================================================= */

  function startStream() {

    if (live) {
      return;
    }


    live = true;

    seconds = 0;

    viewers =
      1100 +
      Math.floor(
        Math.random() * 450
      );


    resetChat();

    updateUI();

    showToast(
      "Stream room is now live."
    );


    timer = setInterval(() => {

      if (!live) {
        return;
      }


      seconds++;


      viewers +=
        Math.floor(
          Math.random() * 25
        ) - 10;


      viewers =
        Math.max(
          850,
          viewers
        );


      updateUI();

    }, 1000);


    chatTimer = setTimeout(
      sendNextSimulatedMessage,
      900
    );

  }


  /* =======================================================
     STOP STREAM
  ======================================================= */

  function stopStream() {

    live = false;

    clearInterval(timer);

    clearTimeout(chatTimer);

    clearTimeout(typingTimer);

    timer = null;

    chatTimer = null;

    typingTimer = null;

    seconds = 0;

    viewers = 0;

    showTyping(false);

    resetChat();

    updateUI();

    showToast(
      "Stream stopped."
    );

  }


  /* =======================================================
     START STREAM BUTTON
  ======================================================= */

  if ($("startStreamButton")) {

    $("startStreamButton")
      .addEventListener(
        "click",
        startStream
      );

  }


  /* =======================================================
     LIKE BUTTON
     SPAM-ABLE — NEVER DECREASES
  ======================================================= */

  if ($("likeButton")) {

    $("likeButton")
      .addEventListener(
        "click",
        () => {

          if (!live) {

            showToast(
              "Start the stream before reacting."
            );

            return;
          }


          likes++;

          localStorage.setItem(
            "blockliveLikes",
            likes
          );


          $("likeButton")
            .classList.remove("pop");


          void $("likeButton").offsetWidth;


          $("likeButton")
            .classList.add("pop");


          updateUI();

        }
      );

  }


  /* =======================================================
     CHAT FORM
  ======================================================= */

  if ($("chatForm")) {

    $("chatForm")
      .addEventListener(
        "submit",
        (event) => {

          event.preventDefault();


          if (!live) {

            showToast(
              "Start the stream before chatting."
            );

            return;
          }


          const input =
            $("chatInput");

          const message =
            input.value.trim();


          if (!message) {
            return;
          }


          /*
             IMPORTANT:
             Actual user's identity is "You",
             while simulated Ash remains Ash.
          */

          addChatMessage(
            "You",
            message,
            "human"
          );


          input.value = "";

        }
      );

  }


  /* =======================================================
     GAME SELECTOR
  ======================================================= */

  $$(".game-button")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          selectedGame =
            button.dataset.game;


          $$(".game-button")
            .forEach((item) => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          updateUI();


          showToast(
            `${selectedGame} selected.`
          );

        }
      );

    });


  /* =======================================================
     POLL
     RESULTS ONLY APPEAR AFTER CLICK
  ======================================================= */

  function updatePollResults() {

    const total =
      Object.values(pollVotes)
        .reduce(
          (sum, value) => sum + value,
          0
        );


    Object.entries(pollVotes)
      .forEach(([option, votes]) => {

        const percentage =
          total === 0
            ? 0
            : Math.round(
                (votes / total) * 100
              );


        const result =
          document.querySelector(
            `[data-result="${CSS.escape(option)}"]`
          );


        const bar =
          document.querySelector(
            `[data-bar="${CSS.escape(option)}"]`
          );


        if (result) {
          result.textContent =
            `${percentage}%`;
        }


        if (bar) {
          bar.style.width =
            `${percentage}%`;
        }

      });


    if ($("pollHint")) {

      $("pollHint").textContent =
        `${total} votes recorded · Live poll`;

    }

  }


  function revealPoll() {

    if (pollHasBeenRevealed) {
      return;
    }

    pollHasBeenRevealed = true;

    updatePollResults();

  }


  $$(".poll-option")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          if (!live) {

            showToast(
              "Start the stream before voting."
            );

            return;
          }


          const option =
            button.dataset.poll;


          pollVotes[option]++;


          $$(".poll-option")
            .forEach((item) => {

              item.classList.remove(
                "selected"
              );

            });


          button.classList.add(
            "selected"
          );


          revealPoll();


          updatePollResults();


          showToast(
            `Vote counted for ${option}.`
          );

        }
      );

    });


  /* =======================================================
     READ MORE
  ======================================================= */

  $$(".read-more")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const card =
            button.closest(
              ".research-card"
            );


          if (!card) {
            return;
          }


          const expanded =
            card.classList.toggle(
              "expanded"
            );


          button.firstChild.textContent =
            expanded
              ? "Read less "
              : "Read more ";

        }
      );

    });


  /* =======================================================
     SHARE
  ======================================================= */

  if ($("shareButton")) {

    $("shareButton")
      .addEventListener(
        "click",
        async () => {

          const url =
            window.location.href;


          try {

            if (
              navigator.clipboard &&
              window.isSecureContext
            ) {

              await navigator.clipboard
                .writeText(url);

              showToast(
                "Stream link copied."
              );

            } else {

              showToast(
                "Share link ready."
              );

            }

          } catch {

            showToast(
              "Share link ready."
            );

          }

        }
      );

  }


  /* =======================================================
     MUTE
  ======================================================= */

  if ($("muteButton")) {

    $("muteButton")
      .addEventListener(
        "click",
        () => {

          muted = !muted;


          $("muteButton")
            .textContent =
            muted ? "🔇" : "🔊";


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

  if ($("fullscreenButton")) {

    $("fullscreenButton")
      .addEventListener(
        "click",
        async () => {

          const video =
            $("videoPanel");


          if (!video) {
            return;
          }


          try {

            if (!document.fullscreenElement) {

              await video.requestFullscreen();

            } else {

              await document.exitFullscreen();

            }

          } catch {

            showToast(
              "Fullscreen is unavailable."
            );

          }

        }
      );

  }


  /* =======================================================
     THEME
  ======================================================= */

  function applyTheme(theme) {

    const light =
      theme === "light";


    document.body.classList.toggle(
      "light-mode",
      light
    );


    if ($("themeToggle")) {

      $("themeToggle").textContent =
        light ? "☀" : "☾";


      $("themeToggle").title =
        light
          ? "Switch to dark mode"
          : "Switch to light mode";

    }


    localStorage.setItem(
      "blockliveTheme",
      light ? "light" : "dark"
    );

  }


  const savedTheme =
    localStorage.getItem(
      "blockliveTheme"
    );


  applyTheme(
    savedTheme === "light"
      ? "light"
      : "dark"
  );


  if ($("themeToggle")) {

    $("themeToggle")
      .addEventListener(
        "click",
        () => {

          const isLight =
            document.body.classList
              .contains("light-mode");


          applyTheme(
            isLight
              ? "dark"
              : "light"
          );


          showToast(
            isLight
              ? "Dark mode enabled."
              : "Light mode enabled."
          );

        }
      );

  }


  /* =======================================================
     MOBILE NAV
  ======================================================= */

  if ($("mobileToggle")) {

    $("mobileToggle")
      .addEventListener(
        "click",
        () => {

          $("mainNav")
            .classList.toggle(
              "open"
            );

        }
      );

  }


  $$("#mainNav a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          $("mainNav")
            .classList.remove(
              "open"
            );

        }
      );

    });


  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  const sections =
    $$(".section-anchor");


  const navLinks =
    $$("#mainNav a");


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            const id =
              entry.target.id;


            navLinks
              .forEach((link) => {

                link.classList.toggle(
                  "active",
                  link.getAttribute(
                    "href"
                  ) === `#${id}`
                );

              });

          }
        );

      },
      {
        rootMargin:
          "-30% 0px -55% 0px"
      }
    );


  sections.forEach(
    (section) =>
      observer.observe(section)
  );


  /* =======================================================
     INITIAL STATE
  ======================================================= */

  updateUI();

});
