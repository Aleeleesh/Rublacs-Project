/* =========================================================
   BLOCKLIVE
   ROBLOX STREAMING PROJECT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENT HELPER
  ======================================================= */

  const $ = (id) => document.getElementById(id);
  const $$ = (selector) => [...document.querySelectorAll(selector)];


  /* =======================================================
     STATE
  ======================================================= */

  let live = false;
  let muted = false;

  let seconds = 0;
  let viewers = 0;

  let likes = Number(localStorage.getItem("blockliveLikes")) || 42;

  let messageCount = 0;

  let streamTimer = null;
  let chatTimer = null;

  let currentGame = "Brookhaven";


  /* =======================================================
     CHAT DATA
     ======================================================= */

  const conversations = [

    {
      name: "Aylmer",
      role: "presenter",
      messages: [
        "BRO the lobby is already wild",
        "we are NOT surviving this",
        "okay buddy",
        "six seven"
      ]
    },

    {
      name: "Keysha",
      role: "presenter",
      messages: [
        "let chat choose the next move",
        "Ash look behind you",
        "stop staring at me"
      ]
    },

    {
      name: "Jayden",
      role: "presenter",
      messages: [
        "nah this is about to go bad",
        "HAHAHAHA"
      ]
    },

    {
      name: "Denise",
      role: "presenter",
      messages: [
        "I voted risk 😭",
        "someone clip that"
      ]
    },

    {
      name: "Ash",
      role: "presenter",
      messages: [
        "this is actually crazy"
      ]
    },

    {
      name: "Drossog",
      role: "bot",
      messages: [
        "wait that actually worked",
        "tuff",
        "okay this is actually clean",
        "nah that was crazy"
      ]
    },

    {
      name: "Frenchfries",
      role: "bot",
      messages: [
        "chat is cooking today",
        "rating this a 6.7",
        "this stream is getting better"
      ]
    },

    {
      name: "Jaymat1210",
      role: "bot",
      messages: [
        "BRO 💀",
        "I'm the goat",
        "nahhhh"
      ]
    },

    {
      name: "Scrappy",
      role: "bot",
      messages: [
        "classic stream moment",
        "dream of the year watch jobs minecraft"
      ]
    }

  ];


  /* =======================================================
     POLL
  ======================================================= */

  const pollVotes = {
    Brookhaven: 34,
    "Obby Challenge": 28,
    Simulator: 21,
    Adventure: 17
  };

  let pollRevealed = false;


  /* =======================================================
     TOAST
  ======================================================= */

  function showToast(message) {

    const container = $("toastContainer");

    if (!container) return;

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `
      <strong>BLOCKLIVE</strong> · ${escapeHTML(message)}
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2500);
  }


  /* =======================================================
     SAFE TEXT
  ======================================================= */

  function escapeHTML(text) {

    return String(text).replace(/[&<>"']/g, (character) => {

      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    });

  }


  /* =======================================================
     UPDATE GENERAL UI
  ======================================================= */

  function updateUI() {

    $("heroStatus").textContent = live ? "LIVE" : "OFFLINE";

    $("streamStatus").textContent =
      live ? "● LIVE" : "● OFFLINE";

    $("chatStatus").textContent =
      live ? "Stream is active" : "Stream is offline";

    $("viewerCount").textContent =
      `${live ? viewers.toLocaleString() : 0} viewers`;

    $("statStatus").textContent =
      live ? "Live" : "Offline";

    $("statViewers").textContent =
      live ? viewers.toLocaleString() : "0";

    $("statLikes").textContent =
      likes;

    $("statMessages").textContent =
      messageCount;

    $("startStreamButton").textContent =
      live ? "Stream is Live" : "Start Stream";

    $("chatInput").disabled = !live;

    $("chatInput").placeholder =
      live
        ? "Say something..."
        : "Start the stream to chat...";

    $("offlineMessage").classList.toggle(
      "hidden",
      live
    );

    $("liveOverlay").classList.toggle(
      "visible",
      live
    );

  }


  /* =======================================================
     STREAM TIMER
  ======================================================= */

  function updateTimer() {

    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60)
      .toString()
      .padStart(2, "0");

    $("streamTimer").textContent =
      `${minutes}:${secs}`;

  }


  /* =======================================================
     RESET CHAT
  ======================================================= */

  function resetChat() {

    clearTimeout(chatTimer);

    messageCount = 0;

    $("chatMessages").innerHTML = `
      <div class="chat-empty" id="chatEmpty">

        <span>✦</span>

        <strong>Chat is quiet.</strong>

        <small>
          Start the stream to see the conversation.
        </small>

      </div>
    `;

    $("typingIndicator").classList.remove("visible");

    updateUI();

  }


  /* =======================================================
     ADD CHAT MESSAGE
  ======================================================= */

  function addChatMessage(
    name,
    message,
    role = "presenter"
  ) {

    const empty = $("chatEmpty");

    if (empty) {
      empty.remove();
    }

    const messageElement =
      document.createElement("div");

    messageElement.className =
      "chat-message";

    const roleText =
      role === "bot"
        ? "BOT"
        : "Presenter";

    const roleClass =
      role === "bot"
        ? "chat-role bot"
        : "chat-role";

    messageElement.innerHTML = `

      <div class="chat-name">

        ${escapeHTML(name)}

        <span class="${roleClass}">
          ${roleText}
        </span>

      </div>

      <div class="chat-text">
        ${escapeHTML(message)}
      </div>

    `;

    $("chatMessages").appendChild(
      messageElement
    );

    $("chatMessages").scrollTop =
      $("chatMessages").scrollHeight;

    messageCount++;

    updateUI();

  }


  /* =======================================================
     SIMULATED CHAT
  ======================================================= */

  let conversationIndex = 0;
  let messageIndex = 0;

  function nextChatMessage() {

    if (!live) return;

    const person =
      conversations[conversationIndex];

    const message =
      person.messages[messageIndex];

    addChatMessage(
      person.name,
      message,
      person.role
    );

    messageIndex++;

    if (
      messageIndex >=
      person.messages.length
    ) {

      messageIndex = 0;

      conversationIndex++;

      if (
        conversationIndex >=
        conversations.length
      ) {
        conversationIndex = 0;
      }

    }

    $("typingIndicator")
      .classList.add("visible");

    chatTimer = setTimeout(() => {

      $("typingIndicator")
        .classList.remove("visible");

      nextChatMessage();

    }, 2200);

  }


  /* =======================================================
     START STREAM
  ======================================================= */

  function startStream() {

    if (live) return;

    live = true;

    seconds = 0;

    viewers =
      1180 +
      Math.floor(Math.random() * 350);

    conversationIndex = 0;
    messageIndex = 0;

    resetChat();

    live = true;

    updateUI();

    showToast("Stream started.");

    clearInterval(streamTimer);

    streamTimer = setInterval(() => {

      seconds++;

      viewers +=
        Math.floor(Math.random() * 19) - 7;

      viewers =
        Math.max(100, viewers);

      updateTimer();
      updateUI();

    }, 1000);

    setTimeout(() => {

      nextChatMessage();

    }, 700);

  }


  /* =======================================================
     START STREAM BUTTON
  ======================================================= */

  $("startStreamButton")
    .addEventListener("click", () => {

      if (!live) {

        startStream();

      } else {

        document
          .querySelector("#stream")
          .scrollIntoView({
            behavior: "smooth"
          });

        showToast("The stream is already live.");

      }

    });


  /* =======================================================
     LIKE BUTTON
     ======================================================= */

  $("likeButton")
    .addEventListener("click", () => {

      if (!live) {

        showToast(
          "Start the stream before reacting."
        );

        return;
      }

      /* Every click adds another like. */

      likes++;

      localStorage.setItem(
        "blockliveLikes",
        likes
      );

      $("likeButton").classList.add("active");

      setTimeout(() => {

        $("likeButton")
          .classList.remove("active");

      }, 160);

      updateUI();

    });


  /* =======================================================
     SHARE
  ======================================================= */

  $("shareButton")
    .addEventListener("click", async () => {

      try {

        await navigator.clipboard.writeText(
          window.location.href
        );

        showToast("Page link copied.");

      } catch {

        showToast(
          "You can copy the page link from your browser."
        );

      }

    });


  /* =======================================================
     NOTIFY
  ======================================================= */

  $("notifyButton")
    .addEventListener("click", () => {

      $("notifyButton")
        .classList.toggle("active");

      const active =
        $("notifyButton")
          .classList.contains("active");

      showToast(
        active
          ? "Notifications enabled."
          : "Notifications disabled."
      );

    });


  /* =======================================================
     MUTE
  ======================================================= */

  $("muteButton")
    .addEventListener("click", () => {

      muted = !muted;

      $("muteButton").textContent =
        muted
          ? "🔇 Unmute"
          : "🔊 Mute";

      showToast(
        muted
          ? "Audio muted."
          : "Audio unmuted."
      );

    });


  /* =======================================================
     FULLSCREEN
  ======================================================= */

  $("fullscreenButton")
    .addEventListener("click", async () => {

      const screen = $("videoScreen");

      try {

        if (!document.fullscreenElement) {

          await screen.requestFullscreen();

        } else {

          await document.exitFullscreen();

        }

      } catch {

        showToast(
          "Fullscreen is not available here."
        );

      }

    });


  /* =======================================================
     GAME SELECTOR
  ======================================================= */

  $$(".game-button")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          $$(".game-button")
            .forEach((item) => {

              item.classList.remove(
                "active"
              );

            });

          button.classList.add("active");

          currentGame =
            button.dataset.game;

          $("currentGame").textContent =
            currentGame;

          $("heroGame").textContent =
            currentGame;

          $("streamTitle").textContent =
            `${currentGame} · Roblox Gameplay & Viewer Interaction`;

          showToast(
            `${currentGame} selected.`
          );

        }
      );

    });


  /* =======================================================
     CHAT SEND
  ======================================================= */

  $("chatForm")
    .addEventListener("submit", (event) => {

      event.preventDefault();

      if (!live) {

        showToast(
          "Chat is locked while offline."
        );

        return;

      }

      const input =
        $("chatInput");

      const text =
        input.value.trim();

      if (!text) return;

      /*
        Important:
        Actual user messages display as
        "You", not "Ash".
      */

      addChatMessage(
        "You",
        text,
        "presenter"
      );

      input.value = "";

    });


  /* =======================================================
     CLEAR CHAT
  ======================================================= */

  $("clearChatButton")
    .addEventListener("click", () => {

      if (!live) {

        resetChat();

        showToast("Chat cleared.");

        return;
      }

      $("chatMessages").innerHTML = "";

      messageCount = 0;

      updateUI();

      showToast("Chat cleared.");

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

          const content =
            card.querySelector(
              ".expand-content"
            );

          const isOpen =
            content.classList.contains(
              "open"
            );

          content.classList.toggle(
            "open"
          );

          button.textContent =
            isOpen
              ? "Read More"
              : "Read Less";

        }
      );

    });


  /* =======================================================
     POLL
  ======================================================= */

  function updatePoll() {

    const total =
      Object.values(pollVotes)
        .reduce(
          (sum, value) =>
            sum + value,
          0
        );

    $$(".poll-option")
      .forEach((option) => {

        const game =
          option.dataset.poll;

        const percentage =
          Math.round(
            (pollVotes[game] / total) * 100
          );

        const percentElement =
          option.querySelector(
            ".poll-percent"
          );

        const bar =
          option.querySelector(
            ".poll-bar span"
          );

        percentElement.textContent =
          `${percentage}%`;

        bar.style.width =
          `${percentage}%`;

      });

  }


  $$(".poll-option")
    .forEach((option) => {

      option.addEventListener(
        "click",
        () => {

          /*
            Percentages are hidden until
            the user actually chooses.
          */

          const selected =
            option.dataset.poll;

          pollVotes[selected]++;

          pollRevealed = true;

          $$(".poll-option")
            .forEach((item) => {

              item.classList.remove(
                "selected"
              );

            });

          option.classList.add("selected");

          $("pollCard")?.classList.add(
            "poll-results-visible"
          );

          const pollCard =
            document.querySelector(
              ".poll-card"
            );

          pollCard.classList.add(
            "poll-results-visible"
          );

          $("pollStatus").textContent =
            "Live results";

          updatePoll();

          showToast(
            `Vote counted for ${selected}.`
          );

        }
      );

    });


  /* =======================================================
     THEME
  ======================================================= */

  function updateThemeButton() {

    const light =
      document.body
        .classList.contains(
          "light-mode"
        );

    $("themeToggle").textContent =
      light
        ? "☀"
        : "☾";

    $("themeToggle").setAttribute(
      "aria-label",
      light
        ? "Switch to dark mode"
        : "Switch to light mode"
    );

  }


  const savedTheme =
    localStorage.getItem(
      "blockliveTheme"
    );

  if (savedTheme === "light") {

    document.body.classList.add(
      "light-mode"
    );

  }

  updateThemeButton();


  $("themeToggle")
    .addEventListener("click", () => {

      document.body.classList.toggle(
        "light-mode"
      );

      const light =
        document.body
          .classList.contains(
            "light-mode"
          );

      localStorage.setItem(
        "blockliveTheme",
        light
          ? "light"
          : "dark"
      );

      updateThemeButton();

      showToast(
        light
          ? "Light mode enabled."
          : "Dark mode enabled."
      );

    });


  /* =======================================================
     INITIAL STATE
  ======================================================= */

  /*
    Make absolutely sure the poll begins
    with NO percentages visible.
  */

  document
    .querySelector(".poll-card")
    .classList.remove(
      "poll-results-visible"
    );

  updatePoll();

  updateTimer();

  updateUI();

});
