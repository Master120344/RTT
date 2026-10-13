document.addEventListener('DOMContentLoaded', function () {
var stripe = Stripe('pk_live_51R6J8VFKvRWz7VBsWPigFgiclkt9Fd38vZh7WlVTGPceFukJtK6pD68jrHtEdRyZQU0SMmmZ4F12gaRYpVGSF6Fs00UYc9vHMM');
var selectedAmount = 250;
var buttons = document.querySelectorAll('.tier-btn');
var customInput = document.getElementById('custom-amount');
var submitBtn = document.getElementById('submit-btn');
var form = document.getElementById('donation-form');
var firstName = document.getElementById('first-name');
var lastName = document.getElementById('last-name');
var email = document.getElementById('email');

function getAmount() {
    var raw = customInput.value.trim();
    if (raw !== '') {
        var parsed = Number(raw);
        if (!Number.isNaN(parsed) && parsed >= 1) {
            return Math.round(parsed);
        }
    }
    return selectedAmount;
}

function updateText() {
    var amount = getAmount();
    submitBtn.textContent = 'Donate $' + amount.toLocaleString();
}

buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        buttons.forEach(function (btn) {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        selectedAmount = Number(button.dataset.amount);
        customInput.value = '';
        updateText();
    });
});

function handleCustomInput() {
    var raw = customInput.value.trim();
    if (raw !== '') {
        buttons.forEach(function (btn) {
            btn.classList.remove('active');
        });
    } else {
        buttons.forEach(function (btn) {
            if (Number(btn.dataset.amount) === selectedAmount) {
                btn.classList.add('active');
            }
        });
    }
    updateText();
}

customInput.addEventListener('input', handleCustomInput);
customInput.addEventListener('change', handleCustomInput);
customInput.addEventListener('keyup', handleCustomInput);

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim()) {
        alert('Please fill out all fields');
        return;
    }

    var amount = getAmount();

    if (!amount || amount < 1) {
        alert('Please enter a valid amount');
        return;
    }

    var tokenField = document.querySelector('[name="cf-turnstile-response"]');
    var token = tokenField ? tokenField.value.trim() : '';

    if (!token) {
        alert('Please complete the captcha');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
        var response = await fetch('create_checkout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                first: firstName.value.trim(),
                last: lastName.value.trim(),
                email: email.value.trim(),
                token: token
            })
        });

        var rawText = await response.text();
        var data;

        try {
            data = JSON.parse(rawText);
        } catch (err) {
            throw new Error(rawText || 'Invalid server response');
        }

        if (!response.ok) {
            throw new Error(data.error || 'Checkout error');
        }

        if (!data.id) {
            throw new Error('Missing Stripe session');
        }

        var result = await stripe.redirectToCheckout({
            sessionId: data.id
        });

        if (result && result.error) {
            throw new Error(result.error.message || 'Unable to open checkout');
        }
    } catch (err) {
        alert(err.message || 'Something went wrong');
        submitBtn.disabled = false;
        updateText();
        if (window.turnstile) {
            turnstile.reset();
        }
    }
});

updateText();
});
