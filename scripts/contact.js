function initContactForm() {
  const form = document.querySelector("#contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = form.querySelector("#contactFirstName").value.trim();
    const lastName = form.querySelector("#contactLastName").value.trim();
    const email = form.querySelector("#contactEmail").value.trim();
    const message = form.querySelector("#contactMessage").value.trim();
    const feedback = form.querySelector(".form-message");

    if (!firstName || !lastName || !email || !message) {
      feedback.textContent = "Please fill in all fields.";
      feedback.className = "form-message error";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      feedback.textContent = "Please enter a valid email address.";
      feedback.className = "form-message error";
      return;
    }

    feedback.textContent = "Message sent successfully.";
    feedback.className = "form-message success";
    form.reset();
  });
}
