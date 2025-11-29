// Simple client-side form handling for join form (no server submission)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("joinForm");
  if (!form) return;

  const successEl = document.getElementById("joinSuccess");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Basic validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const username = form.username.value.trim();
    const agree = form.agree.checked;

    if (!name || !email || !username || !agree) {
      alert("Please fill the required fields and agree to receive updates.");
      return;
    }

    // Fake submission: show success message and reset form
    successEl.hidden = false;
    form.reset();

    // Optionally hide success after a few seconds
    setTimeout(() => {
      successEl.hidden = true;
    }, 6000);
  });
});