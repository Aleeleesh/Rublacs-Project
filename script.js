/* =========================================================
   BLOCKLIVE
   ROBLOX STREAMING PROJECT
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const body = document.body;

  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  const heroStart = document.getElementById("heroStart");
  const playButton = document.getElementById("playButton");

  const streamStatus = document.getElementById("streamStatus");
  const navStatus = document.getElementById("navStatus");

  const streamTimer = document.getElementById("streamTimer");
  const progressBar = document.getElementById("progressBar");

  const chatStatus = document.getElementById("chatStatus");
  const chatMessages = document.getElementById("chatMessages");
  const emptyChat = document.getElementById("emptyChat");

  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatSendButton = chatForm
    ? chatForm.querySelector("button")
    : null;

  const messageCount = document.getElementById("messageCount");
  const viewerCount = document.getElementById("viewerCount");

  const statStatus = document.getElementById("statStatus");

  const likeButton = document.getElementById("likeButton");
  const likeCount = document.getElementById("likeCount");
  const statLikes = document.getElementById("statLikes");

  const shareButton = document.getElementById("shareButton");

  const currentExperience =
    document.getElementById("currentExperience");

  const toast = document.getElementById("toast");


  /* =======================================================
     STATE
     ======================================================= */

  let isLive = false;
  let streamSeconds = 0;
  let streamInterval = null;

  let likeTotal = 42;
  let messageTotal = 0;

  let pollVoted = false;

  /*
    This ID prevents an old bot-chat sequence from
    continuing after the stream has been restarted.
  */
  let chatRunId = 0;

  const pollVotes = {
    "Brookhaven": 0,
    "Obby Challenge": 0,
    "Simulator": 0,
    "Adventure": 0
  };


  const chatSequence = [
    {
      name: "Aylmer",
      role: "Presenter",
      text: "BRO the lobby is already wild"
    },
    {
      name: "Keysha",
      role: "Presenter",
      text: "let chat choose the next move"
    },
    {
      name: "Jayden",
      role: "Presenter",
      text: "nah this is about to go bad"
    },
    {
      name: "Denise",
      role: "Presenter",
      text: "I voted risk 😭"
    },
    {
      name: "Aylmer",
      role: "Presenter",
      text: "we are NOT surviving this"
    },
    {
      name: "Drossog",
      role: "BOT",
      text: "wait that actually worked"
    },
    {
      name: "Frenchfries",
      role: "BOT",
      text: "chat is cooking today"
    },
    {
      name: "Keysha",
      role: "Presenter",
      text: "Ash look behind you"
    },
    {
      name: "Jaymat1210",
      role: "BOT",
      text: "BRO 💀"
    },
    {
      name: "Scrappy",
      role: "BOT",
      text: "classic stream moment"
    },
    {
      name: "Aylmer",
      role: "Presenter",
      text: "okay buddy"
    },
    {
      name: "Ash",
      role: "Presenter",
      text: "six seven"
    },
    {
      name: "Jayden",
      role: "Presenter",
      text: "HAHAHAHA"
    },
    {
      name: "Keysha",
      role: "Presenter",
      text: "stop staring at me"
    },
    {
      name: "Denise",
      role: "Presenter",
      text: "someone clip that"
    }
  ];


  /* =======================================================
     HELPERS
     ======================================================= */

  function showToast(message) {

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }


  function formatTime(totalSeconds) {

    const hours = Math.floor(totalSeconds / 3600);
    const minutes =
      Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours,
      minutes,
      seconds
    ]
      .map(value => String(value).padStart(2, "0"))
      .join(":");
  }


  function updateStreamUI() {

    body.classList.toggle("live", isLive);

    if (isLive) {

      if (streamStatus) {
        streamStatus.innerHTML = "<i></i> LIVE";
      }

      if (navStatus) {
        navStatus.innerHTML =
          '<span class="status-dot"></span> LIVE';
      }

      if (chatStatus) {
        chatStatus.textContent = "LIVE";
      }

      if (statStatus) {
        statStatus.textContent = "LIVE";
      }

      if (playButton) {
        playButton.textContent = "Ⅱ";
        playButton.setAttribute(
          "aria-label",
          "Stop stream"
        );
      }

      if (chatInput) {
        chatInput.disabled = false;
        chatInput.placeholder = "Say something...";
      }

      if (chatSendButton) {
        chatSendButton.disabled = false;
      }

      if (viewerCount) {
        viewerCount.textContent = "12";
      }

    } else {

      if (streamStatus) {
        streamStatus.innerHTML = "<i></i> OFFLINE";
      }

      if (navStatus) {
        navStatus.innerHTML =
          '<span class="status-dot"></span> OFFLINE';
      }

      if (chatStatus) {
        chatStatus.textContent = "OFFLINE";
      }

      if (statStatus) {
        statStatus.textContent = "OFFLINE";
      }

      if (playButton) {
        playButton.textContent = "▶";
        playButton.setAttribute(
          "aria-label",
          "Start stream"
        );
      }

      if (chatInput) {
        chatInput.disabled = true;
        chatInput.placeholder = "Go live to chat...";
      }

      if (chatSendButton) {
        chatSendButton.disabled = true;
      }

      if (viewerCount) {
        viewerCount.textContent = "0";
      }
    }
  }


  /* =======================================================
     THEME
     ======================================================= */

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      body.classList.toggle("light");

      const isLight =
        body.classList.contains("light");

      themeToggle.textContent =
        isLight ? "☀" : "☾";

      localStorage.setItem(
        "blocklive-theme",
        isLight ? "light" : "dark"
      );
    });

  }


  const savedTheme =
    localStorage.getItem("blocklive-theme");

  if (savedTheme === "light") {

    body.classList.add("light");

    if (themeToggle) {
      themeToggle.textContent = "☀";
    }
  }


  /* =======================================================
     MOBILE NAV
     ======================================================= */

  if (menuToggle && mobileNav) {

    menuToggle.addEventListener("click", () => {

      mobileNav.classList.toggle("open");

      menuToggle.textContent =
        mobileNav.classList.contains("open")
          ? "×"
          : "☰";
    });


    document
      .querySelectorAll(".mobile-nav a")
      .forEach(link => {

        link.addEventListener("click", () => {

          mobileNav.classList.remove("open");
          menuToggle.textContent = "☰";
        });

      });
  }


  /* =======================================================
     STREAM
     ======================================================= */

  function startStream() {

    if (isLive) return;

    isLive = true;
    streamSeconds = 0;

    /*
      Always reset the timer/progress when a new session starts.
    */
    if (streamTimer) {
      streamTimer.textContent = "00:00:00";
    }

    if (progressBar) {
      progressBar.style.width = "0%";
    }

    updateStreamUI();

    clearInterval(streamInterval);

    streamInterval = setInterval(() => {

      streamSeconds++;

      if (streamTimer) {
        streamTimer.textContent =
          formatTime(streamSeconds);
      }

      const progress =
        ((streamSeconds % 60) / 60) * 100;

      if (progressBar) {
        progressBar.style.width =
          `${progress}%`;
      }

    }, 1000);


    addChatMessage({
      name: "System",
      role: "LIVE",
      text: "The stream is now live."
    });

    showToast("BlockLive is now live.");


    chatRunId++;

    const currentRun = chatRunId;

    setTimeout(() => {
      runBotChat(currentRun);
    }, 900);
  }


  function stopStream() {

    if (!isLive) return;

    isLive = false;

    clearInterval(streamInterval);

    streamInterval = null;

    /*
      Invalidate any currently running bot sequence.
    */
    chatRunId++;

    updateStreamUI();

    showToast("Stream ended.");
  }


  function toggleStream() {

    if (isLive) {
      stopStream();
    } else {
      startStream();
    }
  }


  if (heroStart) {

    heroStart.addEventListener("click", () => {

      startStream();

      const liveSection =
        document.getElementById("live-stream");

      if (liveSection) {
        liveSection.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  }


  if (playButton) {
    playButton.addEventListener(
      "click",
      toggleStream
    );
  }


  /* =======================================================
     CHAT
     ======================================================= */

  function addChatMessage(message) {

    if (!chatMessages) return;

    if (emptyChat && emptyChat.isConnected) {
      emptyChat.remove();
    }

    const wrapper =
      document.createElement("div");

    wrapper.className = "chat-message";


    const name =
      document.createElement("div");

    name.className = "chat-name";


    const nameText =
      document.createElement("span");

    nameText.textContent = message.name;


    const role =
      document.createElement("span");

    role.className = "chat-role";
    role.textContent = message.role;


    name.appendChild(nameText);
    name.appendChild(role);


    const text =
      document.createElement("div");

    text.className = "chat-text";
    text.textContent = message.text;


    wrapper.appendChild(name);
    wrapper.appendChild(text);

    chatMessages.appendChild(wrapper);


    chatMessages.scrollTop =
      chatMessages.scrollHeight;


    messageTotal++;

    if (messageCount) {
      messageCount.textContent =
        messageTotal;
    }
  }


  function runBotChat(runId) {

    if (!isLive || runId !== chatRunId) {
      return;
    }

    let index = 0;


    const nextMessage = () => {

      if (
        !isLive ||
        runId !== chatRunId
      ) {
        return;
      }

      if (index >= chatSequence.length) {
        return;
      }


      addChatMessage(
        chatSequence[index]
      );

      index++;


      setTimeout(
        nextMessage,
        1400 + Math.random() * 1200
      );
    };


    nextMessage();
  }


  if (chatForm) {

    chatForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        if (!isLive || !chatInput) {
          return;
        }

        const text =
          chatInput.value.trim();

        if (!text) return;


        addChatMessage({
          name: "You",
          role: "Presenter",
          text
        });


        chatInput.value = "";
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

        likeTotal++;

        if (likeCount) {
          likeCount.textContent =
            likeTotal;
        }

        if (statLikes) {
          statLikes.textContent =
            likeTotal;
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
            "Check out our BlockLive Roblox streaming project.",

          url:
            window.location.href
        };


        try {

          if (navigator.share) {

            await navigator.share(
              shareData
            );

          } else if (
            navigator.clipboard
          ) {

            await navigator.clipboard.writeText(
              window.location.href
            );

            showToast(
              "Project link copied."
            );

          } else {

            showToast(
              "Sharing is unavailable here."
            );
          }

        } catch (error) {

          if (
            error.name !== "AbortError"
          ) {

            showToast(
              "Could not share right now."
            );
          }
        }
      }
    );
  }


  /* =======================================================
     MUTE
     ======================================================= */

  const muteButton =
    document.getElementById("muteButton");

  let muted = false;

  if (muteButton) {

    muteButton.addEventListener(
      "click",
      () => {

        muted = !muted;

        muteButton.textContent =
          muted ? "🔇" : "🔊";

        muteButton.setAttribute(
          "aria-label",
          muted
            ? "Unmute"
            : "Mute"
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

  const fullscreenButton =
    document.getElementById(
      "fullscreenButton"
    );

  const streamScreen =
    document.getElementById(
      "streamScreen"
    );


  if (
    fullscreenButton &&
    streamScreen
  ) {

    fullscreenButton.addEventListener(
      "click",
      async () => {

        try {

          if (!document.fullscreenElement) {

            await streamScreen.requestFullscreen();

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
     EXPERIENCE SWITCHING
     ======================================================= */

  document
    .querySelectorAll(".experience-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".experience-button"
            )
            .forEach(item => {

              item.classList.remove(
                "active"
              );
            });


          button.classList.add("active");


          const game =
            button.dataset.game;


          if (currentExperience) {

            currentExperience.textContent =
              game;
          }


          showToast(
            `Experience changed to ${game}.`
          );
        }
      );
    });


  /* =======================================================
     POLL
     ======================================================= */

  document
    .querySelectorAll(".poll-option")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const selected =
            button.dataset.option;

          if (
            !Object.prototype.hasOwnProperty.call(
              pollVotes,
              selected
            )
          ) {
            return;
          }


          pollVotes[selected]++;
          pollVoted = true;


          document
            .querySelectorAll(
              ".poll-option"
            )
            .forEach(option => {

              option.classList.remove(
                "selected"
              );
            });


          button.classList.add(
            "selected"
          );


          updatePoll();
        }
      );
    });


  function updatePoll() {

    const total =
      Object.values(pollVotes)
        .reduce(
          (sum, value) =>
            sum + value,
          0
        );


    document
      .querySelectorAll(".poll-option")
      .forEach(button => {

        const option =
          button.dataset.option;

        let percentage = 0;


        if (total > 0) {

          percentage =
            Math.round(
              (
                pollVotes[option] /
                total
              ) * 100
            );
        }


        const percentageElement =
          button.querySelector("b");


        if (percentageElement) {

          percentageElement.textContent =
            `${percentage}%`;
        }
      });


    const pollNote =
      document.getElementById(
        "pollNote"
      );


    if (
      pollNote &&
      pollVoted
    ) {

      pollNote.textContent =
        "Live percentages update as viewers vote.";
    }
  }


  /* =======================================================
     READ MORE
     ======================================================= */

  document
    .querySelectorAll(".read-more")
    .forEach(button => {

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


          button.innerHTML =
            expanded
              ? 'Read less <span>+</span>'
              : 'Read more <span>+</span>';
        }
      );
    });


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  if (streamTimer) {
    streamTimer.textContent = "00:00:00";
  }

  if (progressBar) {
    progressBar.style.width = "0%";
  }

  updateStreamUI();

});
