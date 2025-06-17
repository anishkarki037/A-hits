// views/assets/js/anix-agent.js
console.log("Anix Reactive Agent Loaded.");

document.addEventListener("click", handleAnixEvent);
document.addEventListener("submit", handleAnixEvent);

async function handleAnixEvent(e) {
  const triggerElement = e.target.closest("[data-anix-trigger]");
  if (!triggerElement) return;

  // Check if the trigger event type matches the event that occurred
  const triggerType = triggerElement.dataset.anixTrigger;
  if (triggerType !== e.type) return;

  e.preventDefault();

  const eventName = triggerElement.dataset.anixEvent;

  try {
    const response = await fetch("/__anix-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: eventName }),
    });

    if (!response.ok) {
      throw new Error("Server responded with an error.");
    }

    const updates = await response.json();

    // The server sends back an array of updates
    updates.forEach((update) => {
      const targetElement = document.querySelector(update.target);
      if (targetElement) {
        // morphdom is more efficient, but innerHTML is simpler for this demo
        targetElement.innerHTML = update.html;
      } else {
        console.error(
          `Anix Agent: Target element "${update.target}" not found.`
        );
      }
    });
  } catch (err) {
    console.error("Anix Agent Error:", err);
  }
}
