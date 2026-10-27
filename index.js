// Shared behavior. Each feature is optional because pages use different controls.
document.querySelectorAll('.BuyButtons').forEach(button => {
  button.addEventListener('click', () => {
    localStorage.setItem('amount', button.dataset.amount);
    window.location.href = 'Checkout.html';
  });
});

const modal = document.getElementById('myModal');
if (modal) {
  const closeButton = modal.querySelector('.close');
  let timer;
  let opener;

  function hidePopup() {
    clearTimeout(timer);
    modal.classList.remove('show');
    timer = setTimeout(() => { modal.style.display = 'none'; }, 300);
    opener?.focus();
  }

  document.querySelectorAll('.HighQuality').forEach(button => {
    button.addEventListener('click', () => {
      clearTimeout(timer);
      opener = button;
      modal.style.display = 'block';
      timer = setTimeout(() => modal.classList.add('show'), 10);
      closeButton?.focus();
    });
  });
  closeButton?.addEventListener('click', hidePopup);
  closeButton?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      hidePopup();
    }
  });
  modal.addEventListener('click', event => {
    if (event.target === modal) hidePopup();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('show')) hidePopup();
  });
}

// Order confirmation, shown when Yoco sends the customer back with ?status=success.
// This only changes what the customer sees; paid orders are confirmed by Yoco's webhook on the server.
const orderModal = document.getElementById('chkmodal');
if (orderModal && new URLSearchParams(window.location.search).get('status') === 'success') {
  orderModal.style.display = 'block';
  setTimeout(() => orderModal.classList.add('show'), 10);
}

// Section links use the stylesheet's native smooth scrolling.
