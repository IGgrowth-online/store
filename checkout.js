document.addEventListener('DOMContentLoaded', function() {
  const textAmount = localStorage.getItem('amount');
  const textElement = document.getElementById('text-amount');
  textElement.textContent = textAmount +' Instagram Followers';
});

document.getElementById("submitBtn").addEventListener("click", function() {

function updateLoadingText() {
  const loadingText = document.getElementById("loadingText");
  let dots = submitBtn.textContent;

  if (dots === '...') {
    dots = ".";
  } else {
    dots += ".";
  }

  submitBtn.textContent = dots;
}   

  const usernameInput = document.getElementById("usernameInput");
  const emailInput = document.getElementById("emailInput");
  const errorText = document.getElementById("errorText");
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
  } else {
    usernameInput.style.borderColor = "";
    emailInput.style.borderColor = "";
  }

    // Start the animation
    submitBtn.disabled = true;
    document.getElementById("submitBtn").textContent = ".";
    const intervalId = setInterval(updateLoadingText, 250);
    var amount = localStorage.getItem('amount');
    var price = localStorage.getItem('price');
    var username = usernameValue.replace(/\s/g, '');
    var email = emailValue.replace(/\s/g, '');
    var data = {'username': username};

    fetch("https://5364-102-39-135-10.ngrok-free.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.Message === 'Please set your Instagram account to public') {
        document.getElementById("errorText").textContent = "Please set your Instagram account to public";
              setTimeout(() => {
  clearInterval(intervalId);
}, 0);
      submitBtn.textContent = "Continue";
      submitBtn.disabled = false;
      } else if (data.Message === 'Please enter a valid Instagram username') {
    document.getElementById("errorText").textContent = "Please enter a valid Instagram username.";
              setTimeout(() => {
  clearInterval(intervalId);
}, 0);
      submitBtn.textContent = "Continue";
      submitBtn.disabled = false;
      } else {
        var userID = data.User_ID
        var details = {'username': username, 'amount': amount, 'email': email, 'userID': userID};
              setTimeout(() => {
  clearInterval(intervalId);
}, 0);
submitBtn.textContent = "Continue";
startAnimation();

function startAnimation() {
      const continueButton = document.getElementById('submitBtn');
      const paypalContainer = document.querySelector('.paypal-button-container');
      const selectButton = document.getElementById('sd');
      const emailInput = document.getElementById('emailInput');
      const usernameInput = document.getElementById('usernameInput');

      // Move the continue button out to the left
      continueButton.style.transform = 'translateX(-150%)';
      selectButton.style.transform = 'translateX(-200%)';
      emailInput.style.transform = 'translateX(-150%)';
      usernameInput.style.transform = 'translateX(-150%)';

      // Show the PayPal container and move it into view from the right
      paypalContainer.style.display = 'block';
      paypalContainer.style.transform = 'translateX(100%)';

      // After the initial animation, move PayPal container into place
      setTimeout(() => {
        paypalContainer.style.transform = 'translateX(0)';
      }, 10); // Slight delay to trigger the CSS transition

      // Render the PayPal buttons after the animation completes
      renderPayPalButtons(); // Match the duration of the CSS transition
    }

function renderPayPalButtons() {
      paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: price // Replace with your transaction amount
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function() {
            // Payment completed, trigger the save procedure
            fetch("https://460e-102-39-238-82.ngrok-free.app/msg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(details)
    });
    const modal = document.getElementById('chkmodal');
    modal.style.display = "block";
    setTimeout(function() {
        modal.classList.add("show");
      }, 10);
          });
        }
      }).render('#paypal-button-container');
    }

}
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById("errorText").textContent = "Please try again.";
      setTimeout(() => {
  clearInterval(intervalId);
}, 0);
    submitBtn.textContent = "Continue";
      submitBtn.disabled = false;
    });
});
