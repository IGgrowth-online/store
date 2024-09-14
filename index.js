const modal = document.getElementById("myModal");
const buttons = document.querySelectorAll('.HighQuality');
const closeBtn = document.getElementsByClassName("close")[0];
const button = document.querySelectorAll('.BuyButtons');
button.forEach(button => {
  button.addEventListener('click', updateText);
});

function updateText() {
  const amount = parseInt(event.target.id.substring(event.target.id.indexOf('-') + 1));
  const price = parseFloat(event.target.id.split('+')[1], 10);
  localStorage.setItem('amount', amount);
  localStorage.setItem('price', price);
  window.location.href = 'Checkout.html';
}

function showPopup() {
  modal.style.display = "block";
  setTimeout(function() {
    modal.classList.add("show");
  }, 10);
}

function hidePopup() {
  modal.classList.remove("show");
  setTimeout(function() {
    modal.style.display = "none";
  }, 300);
}

buttons.forEach(button => {
  button.addEventListener("click", showPopup);
});

closeBtn.addEventListener("click", hidePopup);
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    hidePopup();
  }
});

document.getElementById('How').addEventListener('click', function() {
    document.getElementById('section2').scrollIntoView({
      behavior: 'smooth'
    });
  });

document.getElementById('Contact').addEventListener('click', function() {
    document.getElementById('section3').scrollIntoView({
      behavior: 'smooth'
    });
  });
