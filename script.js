// ======== Constants ========
const whatsappBtn = document.getElementById('whatsappShareBtn');
const counterText = document.getElementById('shareCounter');
const shareMessage = document.getElementById('shareMessage');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');

let clickCount = 0;
const maxClicks = 5;

// ======== Load Submission Lock from localStorage ========
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("techGirlsSubmitted") === "true") {
    disableForm();
    successMessage.classList.remove("hidden");
  }
});

// ======== WhatsApp Share Button Logic ========
whatsappBtn.addEventListener('click', () => {
  if (clickCount >= maxClicks) return;

  const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community!");
  const url = `https://wa.me/?text=${message}`;
  window.open(url, '_blank');

  clickCount++;
  counterText.textContent = `Click count: ${clickCount}/${maxClicks}`;

  if (clickCount === maxClicks) {
    shareMessage.classList.remove("hidden");
  }
});

// ======== Form Submission ========
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (clickCount < maxClicks) {
    alert("Please complete WhatsApp sharing (5/5) before submitting.");
    return;
  }

  // Get form data
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const college = document.getElementById('college').value.trim();
  const fileInput = document.getElementById('screenshot');

  if (!fileInput.files.length) {
    alert("Please upload a screenshot before submitting.");
    return;
  }

  const file = fileInput.files[0];

  // Upload file to a cloud (e.g. Imgur, Firebase, or temporary image host)
  // For now, let's assume we simulate this with a base64 string.
  const fileBase64 = await toBase64(file);

  // Send to Google Sheets via Google Apps Script Web App
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxcu772XV6PQiwD8TSHw-PnJcEI3vTSpvqG2fQI_j7t25RPwQN7Bq8ohEalxXZ9_98ZZw/exec", {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
        email,
        college,
        screenshot: fileBase64
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("techGirlsSubmitted", "true");
      disableForm();
      successMessage.classList.remove("hidden");
    } else {
      alert("There was an issue submitting your form. Please try again later.");
    }

  } catch (error) {
    console.error("Submission error:", error);
    alert("Submission failed. Please check your internet connection or try again.");
  }
});

// ======== Helper Functions ========
function disableForm() {
  const inputs = form.querySelectorAll("input, button");
  inputs.forEach(input => {
    input.disabled = true;
  });
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
