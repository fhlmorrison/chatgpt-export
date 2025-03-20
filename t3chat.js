(function () {
  console.log("SCRIPT STARTED");
  function createDownloadButton() {
    const button = document.createElement("button");
    button.textContent = "Download Chat";
    button.classList.add(
      "download-button",
      "btn",
      "relative",
      "btn-secondary",
      "text-token-text-primary"
    );
    button.onclick = cleanChatForPrint;

    const MAX_RETRIES = 20;
    let retries = 0;

    // Wait for the button to appear before inserting the download button
    const waitForShareButton = setInterval(() => {
      const share_button = document.querySelector(
        '[aria-label="Go to settings"]'
      );
      if (share_button) {
        // share_button.parentElement.insertBefore(button, share_button);
        share_button.parentElement.prepend(button);
        clearInterval(waitForShareButton);
        console.log("Download button inserted.");
      }
      retries++;
      if (retries >= MAX_RETRIES) {
        clearInterval(waitForShareButton);
        console.log("Download button not found in time.");
      }
    }, 250); // Check every quarter-second up to 5 seconds

    console.log("Download button created.");
  }

  function cleanChatForPrint() {
    // Hide everything except the chat messages
    const style = document.createElement("style");
    style.textContent = `
            @media print {
                * { 
                    -webkit-print-color-adjust: exact !important; /* Safari/Chrome */
                    print-color-adjust: exact !important; /* Firefox */
                }
                body { 
                    color: #fff !important; /* Ensure white text */
                }
                article {
                    color: #fff !important; /* Keep white text */
                    padding: 10px;
                    border-radius: 10px;
                }
            }

            .chat-container { width: 100% !important; margin: 0 auto !important; }
            `;

    // pre { page-break-inside: avoid; }

    // .chat-message { page-break-inside: avoid; margin-bottom: 10px; font-size: 16px; }

    document.head.appendChild(style);

    const chatContainer = document.querySelector(
      '[aria-label="Chat messages"]'
    );

    chatContainer.classList.add("chat-container");

    console.log("Collecting chat messages...");

    // Remove everything from body and insert only chat messages
    document.body.innerHTML = "";
    document.body.appendChild(chatContainer);

    // Start printing
    setTimeout(triggerPrint, 500); // Delay ensures UI updates before printing
  }

  function restorePageAfterPrint() {
    window.removeEventListener("afterprint", restorePageAfterPrint);
    window.location.reload(); // Reload to ensure full functionality
  }

  function triggerPrint() {
    // Listen for when printing is done (both success & cancel)
    window.addEventListener("afterprint", restorePageAfterPrint);
    window.print();
  }

  // Ensure the script runs immediately after ChatGPT is fully loaded
  if (document.readyState === "complete") {
    createDownloadButton();
  } else {
    window.addEventListener("load", createDownloadButton);
  }
})();
