// Username verification and the Yoco checkout both run on this server.
const SERVER_URL = 'https://desired-kingfish-deciding.ngrok-free.app';
const submitBtn = document.getElementById("submitBtn");
const errorText = document.getElementById("errorText");

document.addEventListener('DOMContentLoaded', function() {
  const textAmount = localStorage.getItem('amount');
  const textElement = document.getElementById('text-amount');
  textElement.textContent = textAmount +' Instagram Followers';

  // Yoco sends the customer back here with ?status=cancelled|failed.
  // Successful payments return to the Buy page instead, which shows the order confirmation.
  const status = new URLSearchParams(window.location.search).get('status');
  if (status === 'cancelled') {
    errorText.textContent = "Payment was cancelled. You have not been charged.";
  } else if (status === 'failed') {
    errorText.textContent = "Payment did not go through. Please try again.";
  }
});

// Re-enable the button if the customer comes back from Yoco with the browser's Back button.
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    submitBtn.textContent = "Continue";
    submitBtn.disabled = false;
  }
});

function updateLoadingText() {
  let dots = submitBtn.textContent;

  if (dots === '...') {
    dots = ".";
  } else {
    dots += ".";
  }

  submitBtn.textContent = dots;
}

submitBtn.addEventListener("click", async function() {

  const usernameInput = document.getElementById("usernameInput");
  const emailInput = document.getElementById("emailInput");
  errorText.textContent = "";
  usernameInput.style.borderColor = "";
  emailInput.style.borderColor = "";

  const usernameValue = usernameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (usernameValue.length === 0) {
    usernameInput.style.borderColor = "red";
    errorText.textContent = "Please enter a username";
    return;
  } else if (emailValue.length === 0) {
    emailInput.style.borderColor = "red";
    errorText.textContent = "Please enter an email address";
    return;
  } else if (!emailRegex.test(emailValue)) {
    emailInput.style.borderColor = "red";
    errorText.textContent = "Please enter a valid email address";
    return;
  }

  const packageId = localStorage.getItem('amount');
  if (!packageId) {
    errorText.textContent = "Please pick a package first";
    return;
  }

  // Start the animation; it keeps running until the customer is sent to Yoco.
  submitBtn.disabled = true;
  submitBtn.textContent = ".";
  const intervalId = setInterval(updateLoadingText, 250);
  const username = usernameValue.replace(/^@/, '').replace(/\s/g, '');
  const email = emailValue;

  function stopLoading(message) {
    clearInterval(intervalId);
    submitBtn.textContent = "Continue";
    submitBtn.disabled = false;
    errorText.textContent = message;
  }

  try {
    // 1. Check that the Instagram account exists and is public.
    const verifyResponse = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    });
    const verification = await verifyResponse.json();
    if (verification.Message !== 'No error message found') {
      stopLoading(verification.Message || "Please try again.");
      return;
    }

    // 2. Create the Yoco checkout. The server sets the price from the package.
    const checkoutResponse = await fetch(`${SERVER_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ package: packageId, username, email })
    });
    const checkout = await checkoutResponse.json();
    if (!checkoutResponse.ok || !checkout.redirectUrl) {
      stopLoading(checkout.error || "Could not start payment. Please try again.");
      return;
    }

    // 3. Send the customer to Yoco's payment page.
    window.location.href = checkout.redirectUrl;
  } catch (error) {
    console.error("Error:", error);
    stopLoading("Please try again.");
  }
});
