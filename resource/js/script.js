// --- ELEMENTS ---
const addBtns = document.querySelectorAll('.additem');
const addedItemsContainer = document.querySelector('.itemarea2');
const totalAmountEl = document.querySelector('.itemarea3 h3:last-child');
const bookingForm = document.querySelector('.service_main2 form');
const formInputs = bookingForm ? bookingForm.querySelectorAll('input') : [];
const bookNowBtn = document.querySelector('.button-book');
const warningContainer = document.getElementById('booking-warning');

// --- STATE ---
let cart = [];

// --- FUNCTIONS ---
function setFormEnabled(enabled) {
    formInputs.forEach(input => input.disabled = !enabled);
    if (bookNowBtn) {
        bookNowBtn.classList.toggle('active', enabled);
        bookNowBtn.classList.toggle('js-disabled', !enabled);
    }
}

function updateServiceButtons() {
    addBtns.forEach(btn => {
        const serviceName = btn.closest('.service-m1').querySelector('.psmall').textContent.trim();
        if (cart.some(item => item.name === serviceName)) {
            btn.classList.remove('additem');
            btn.classList.add('removeitem');
            btn.innerHTML = 'Remove Item <span class="remove-icon">&minus;</span>';
        } else {
            btn.classList.remove('removeitem');
            btn.classList.add('additem');
            btn.innerHTML = 'Add Item <ion-icon class="smallicon" name="add-circle-outline"></ion-icon>';
        }
    });
}

function updateCartDisplay() {
    if (cart.length === 0) {
        addedItemsContainer.innerHTML = `
            <ion-icon class="icon2" name="information-circle-outline"></ion-icon>
            <h5>No Items Added</h5>
            <p>Add items to the cart from the services bar</p>
        `;
        totalAmountEl.textContent = `₹0`;
        return;
    }
    let rows = cart.map((item, idx) => `
        <tr>
            <td class="sno">${idx + 1}</td>
            <td class="servicename">${item.name}</td>
            <td class="price">₹${item.price.toFixed(2)}</td>
        </tr>
    `).join('');
    addedItemsContainer.innerHTML = `
        <table class="cart-table"><tbody>${rows}</tbody></table>
    `;
    totalAmountEl.textContent = `₹${cart.reduce((t, i) => t + i.price, 0).toFixed(2)}`;
}

function showMessage(type, html, timeout = 0) {
    warningContainer.innerHTML = '';
    const el = document.createElement('div');
    el.className = type;
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.fontSize = '1rem';
    el.style.marginTop = '8px';
    el.style.background = 'none';
    el.style.padding = '0';
    el.style.boxShadow = 'none';
    el.style.borderRadius = '0';
    if (type === 'no-cart-warning') el.style.color = '#d10038';
    if (type === 'success-message') el.style.color = 'green';
    el.innerHTML = html;
    warningContainer.appendChild(el);
    if (timeout > 0) {
        setTimeout(() => { if (el.parentNode) el.remove(); }, timeout);
    }
}

// --- EVENTS: CART/BOOKING ---
addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const serviceName = btn.closest('.service-m1').querySelector('.psmall').textContent.trim();
        const servicePrice = parseFloat(btn.closest('.service-m1').querySelector('.prate').textContent.replace(/[₹,]/g, ''));
        if (cart.some(item => item.name === serviceName)) {
            cart = cart.filter(item => item.name !== serviceName);
        } else {
            cart.push({ name: serviceName, price: servicePrice });
        }
        updateCartDisplay();
        updateServiceButtons();
        setFormEnabled(cart.length > 0);
        warningContainer.innerHTML = "";
    });
});

if (bookNowBtn) {
    bookNowBtn.addEventListener('click', e => {
        // 1. If cart is empty
        if (cart.length === 0) {
            e.preventDefault();
            showMessage(
                'no-cart-warning',
                `<ion-icon name="information-circle-outline" style="color:#d10038; font-size:18px; margin-right:6px;"></ion-icon>
                 <span>Add the items to the cart to book</span>`
            );
            return;
        }
        // 2. HTML5 required validation
        if (!bookingForm.checkValidity()) {
            e.preventDefault();
            bookingForm.reportValidity();
            return;
        }
        // 3. Show success
        e.preventDefault();
        showMessage(
            'success-message',
            `<ion-icon name="checkmark-circle-outline" style="color:green; font-size:18px; margin-right:6px;"></ion-icon>
             <span>Email has been sent successfully</span>`,
            5000
        );
        // ✅ Immediately clear form & cart
        formInputs.forEach(inp => inp.value = '');
        cart = [];
        updateCartDisplay();
        updateServiceButtons();
        setFormEnabled(false);
    });
}

// --- EVENTS: NEWSLETTER SUBSCRIBE ---

// Make sure the HTML for your newsletter form matches instructions:
// - form has id="newsletter-form"
// - both inputs have required attribute
// - success message container has id="subscribe-message"
const newsletterForm = document.getElementById('newsletter-form');
const subscribeMessage = document.getElementById('subscribe-message');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default submit (no page reload)
        // HTML5 required validation
        if (!newsletterForm.checkValidity()) {
            newsletterForm.reportValidity();
            return;
        }
        // Show success message
        subscribeMessage.innerHTML = `
            <span style="color: green; font-size: 1.1rem; margin-top: 8px; display:block;">
              <ion-icon name="checkmark-circle-outline" style="color:green; font-size:18px; margin-right:6px;"></ion-icon>
              You have successfully subscribed!
            </span>
        `;
        // Clear inputs
        newsletterForm.reset();
        // Hide message after 5 seconds (optional)
        setTimeout(() => { subscribeMessage.innerHTML = ""; }, 5000);
    });
}

// --- INIT ---
updateCartDisplay();
updateServiceButtons();
setFormEnabled(false);
