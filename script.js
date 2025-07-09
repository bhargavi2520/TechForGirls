// ======== Constants ========
const whatsappBtn = document.getElementById('whatsappShareBtn');
const counterText = document.getElementById('shareCounter');
const shareMessage = document.getElementById('shareMessage');
const submitBtn = document.getElementById('submitBtn');
const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const shareProgressBar = document.getElementById('shareProgressBar');
const shareCountLabel = document.getElementById('shareCountLabel');

let clickCount = 0;
const maxClicks = 5;

// ======== Load Submission Lock from localStorage ========
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("techGirlsSubmitted") === "true") {
    disableForm();
    successMessage.classList.remove("hidden");
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

function updateShareProgress() {
  shareProgressBar.style.width = `${(clickCount / maxClicks) * 100}%`;
  shareCountLabel.textContent = `${clickCount}/${maxClicks}`;
}

// ======== WhatsApp Share Button Logic ========
whatsappBtn.addEventListener('click', () => {
  if (clickCount >= maxClicks) return;

  const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community!");
  const url = `https://wa.me/?text=${message}`;
  window.open(url, '_blank');

  clickCount++;
  updateShareProgress();

  if (clickCount === maxClicks) {
    shareMessage.classList.remove("hidden");
  }
});

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("techGirlsSubmitted") === "true") {
    disableForm();
    successMessage.classList.remove("hidden");
  }
  updateShareProgress();
});

// ======== Form Submission ========
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (clickCount < maxClicks) {
    alert("Please complete WhatsApp sharing (5/5) before submitting.");
    return;
  }

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
  const fileBase64 = await toBase64(file);

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("college", college);
    formData.append("screenshot", fileBase64);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzRycNwQ-VW_9NQWYWXWTaokz2QvzKl0zxbk75adk6QxYSc3MBB92o0_tUsfze-sWB7AA/exec",
      {
        method: "POST",
        body: formData
      }
    );

    const resultText = await response.text();  // HTMLService returns text
    const result = JSON.parse(resultText);     // Parse it to JSON manually

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
