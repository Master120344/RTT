var stripe = Stripe('pk_live_51R6J8VFKvRWz7VBsWPigFgiclkt9Fd38vZh7WlVTGPceFukJtK6pD68jrHtEdRyZQU0SMmmZ4F12gaRYpVGSF6Fs00UYc9vHMM');

var selectedAmount = 250;
var buttons = document.querySelectorAll('.tier-btn');
var customInput = document.getElementById('custom-amount');
var submitBtn = document.getElementById('submit-btn');

function updateText() {
var amount = customInput.value ? parseInt(customInput.value) : selectedAmount;
submitBtn.textContent = 'Donate $' + amount.toLocaleString();
}

buttons.forEach(b => {
b.onclick = () => {
buttons.forEach(x => x.classList.remove('active'));
b.classList.add('active');
selectedAmount = parseInt(b.dataset.amount);
customInput.value = '';
updateText();
};
});

customInput.oninput = updateText;

document.getElementById('donation-form').onsubmit = async e => {
e.preventDefault();

submitBtn.disabled = true;

var res = await fetch('create_checkout.php', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
amount: customInput.value || selectedAmount,
first: firstName.value,
last: lastName.value,
email: email.value,
token: document.querySelector('[name="cf-turnstile-response"]').value
})
});

var data = await res.json();
stripe.redirectToCheckout({ sessionId: data.id });
};
