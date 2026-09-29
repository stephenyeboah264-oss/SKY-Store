const products = [
  { id: 1, name: "Samsung TV",  price: 4500 },
  { id: 2, name: "Pixel 4a",    price: 2500 },
  { id: 3, name: "PS 5",        price: 6500 },
  { id: 4, name: "MacBook Air", price: 8000 },
  { id: 5, name: "Apple Watch", price: 1700 },
  { id: 6, name: "Air Pods",    price: 350  },
];

let cart = [];             
let customer = { name: "", email: "", phone: "" };


const productGrid       = document.getElementById("productGrid");
const cartBtn            = document.getElementById("cartBtn");
const cartCountEl        = document.getElementById("cartCount");

const cartOverlay        = document.getElementById("cartOverlay");
const closeCartBtn       = document.getElementById("closeCartBtn");
const continueShoppingBtn= document.getElementById("continueShoppingBtn");
const checkoutBtn        = document.getElementById("checkoutBtn");

const cartTableBody      = document.getElementById("cartTableBody");
const emptyCartMsg       = document.getElementById("emptyCartMsg");
const totalAmountEl      = document.getElementById("totalAmount");

const userNameInput      = document.getElementById("userName");
const userEmailInput     = document.getElementById("userEmail");
const userPhoneInput     = document.getElementById("userPhone");
const nameError           = document.getElementById("nameError");
const emailError          = document.getElementById("emailError");
const phoneError          = document.getElementById("phoneError");

const summaryOverlay      = document.getElementById("summaryOverlay");
const summaryMessage      = document.getElementById("summaryMessage");
const summaryTableBody    = document.getElementById("summaryTableBody");
const summaryOkBtn        = document.getElementById("summaryOkBtn");


function formatCurrency(amount) {
  return "₵" + amount.toLocaleString("en-GH");
}

function findProduct(id) {
  return products.find((p) => p.id === id);
}

function findCartItem(id) {
  return cart.find((c) => c.id === id);
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + findProduct(item.id).price * item.quantity, 0);
}


function updateProductButton(id) {
  const btn = document.querySelector(`.add-btn[data-id="${id}"]`);
  if (!btn) return;
  if (findCartItem(id)) {
    btn.textContent = "Remove from Cart";
    btn.classList.add("in-cart");
  } else {
    btn.textContent = "Add to Cart";
    btn.classList.remove("in-cart");
  }
}

function toggleProductInCart(id) {
  const existing = findCartItem(id);
  if (existing) {
    cart = cart.filter((c) => c.id !== id);
  } else {
    cart.push({ id, quantity: 1 });
  }
  updateProductButton(id);
  updateCartCount();
  renderCartItems();
}

productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  toggleProductInCart(Number(btn.dataset.id));
});


function updateCartCount() {
  cartCountEl.textContent = cart.length;
}


function openCartModal() {
  renderCartItems();
  cartOverlay.classList.remove("hidden");
}

function closeCartModal() {
  cartOverlay.classList.add("hidden");
}

cartBtn.addEventListener("click", openCartModal);
closeCartBtn.addEventListener("click", closeCartModal);
continueShoppingBtn.addEventListener("click", closeCartModal);

cartOverlay.addEventListener("click", (e) => {
  if (e.target === cartOverlay) closeCartModal();
});


function renderCartItems() {
  cartTableBody.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMsg.classList.remove("hidden");
  } else {
    emptyCartMsg.classList.add("hidden");
  }

  cart.forEach((item, index) => {
    const product = findProduct(item.id);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>${formatCurrency(product.price * item.quantity)}</td>
      <td>
        <div class="qty-cell">
          <button class="qty-btn decrement" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn increment" data-id="${item.id}">+</button>
        </div>
      </td>
      <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
    `;
    cartTableBody.appendChild(row);
  });

  totalAmountEl.textContent = formatCurrency(calculateTotal());
}


cartTableBody.addEventListener("click", (e) => {
  const target = e.target;
  const id = Number(target.dataset.id);
  if (!id) return;

  if (target.classList.contains("increment")) {
    findCartItem(id).quantity += 1;
    renderCartItems();
  } else if (target.classList.contains("decrement")) {
    const item = findCartItem(id);
    if (item.quantity > 1) item.quantity -= 1;
    renderCartItems();
  } else if (target.classList.contains("remove-btn")) {
    cart = cart.filter((c) => c.id !== id);
    updateProductButton(id);
    updateCartCount();
    renderCartItems();
  }
});


function validateName() {
  const value = userNameInput.value.trim();
  if (value.length === 0) {
    nameError.textContent = "Name is required.";
    userNameInput.classList.add("invalid");
    return false;
  }
  nameError.textContent = "";
  userNameInput.classList.remove("invalid");
  return true;
}

function validateEmail() {
  const value = userEmailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value.length === 0) {
    emailError.textContent = "Email is required.";
    userEmailInput.classList.add("invalid");
    return false;
  }
  if (!emailPattern.test(value)) {
    emailError.textContent = "Enter a valid email address.";
    userEmailInput.classList.add("invalid");
    return false;
  }
  emailError.textContent = "";
  userEmailInput.classList.remove("invalid");
  return true;
}

function validatePhone() {
  const value = userPhoneInput.value.trim();
  const digitsOnly = value.replace(/\D/g, "");
  if (value.length === 0) {
    phoneError.textContent = "Phone number is required.";
    userPhoneInput.classList.add("invalid");
    return false;
  }
  if (digitsOnly.length < 10 || digitsOnly.length > 11) {
    phoneError.textContent = "Enter a valid phone number.";
    userPhoneInput.classList.add("invalid");
    return false;
  }
  phoneError.textContent = "";
  userPhoneInput.classList.remove("invalid");
  return true;
}

userNameInput.addEventListener("blur", validateName);
userEmailInput.addEventListener("blur", validateEmail);
userPhoneInput.addEventListener("blur", validatePhone);

function validateForm() {
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  return isNameValid && isEmailValid && isPhoneValid;
}


checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty. Add a product before checking out.");
    return;
  }
  if (!validateForm()) return;

  customer.name = userNameInput.value.trim();
  customer.email = userEmailInput.value.trim();
  customer.phone = userPhoneInput.value.trim();

  closeCartModal();     
  payWithPaystack();    
});

function payWithPaystack() {
  const PAYSTACK_PUBLIC_KEY = "pk_test_026f2b9febb3387d1a33abd86eda0ebdcb6d88e8";

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: customer.email,
    amount: calculateTotal() * 100, 
    currency: "GHS",
    metadata: {
      custom_fields: [
        { display_name: "Full Name", variable_name: "full_name", value: customer.name },
        { display_name: "Phone Number", variable_name: "phone_number", value: customer.phone },
      ],
    },
    callback: function (response) {
      showSummaryModal();
    },
    onClose: function () {
    },
  });

  handler.openIframe();
}


function showSummaryModal() {
  summaryMessage.innerHTML = `Thank You, <span class="highlight">${customer.name}</span>, Your Order Has been Received`;

  summaryTableBody.innerHTML = "";
  cart.forEach((item, index) => {
    const product = findProduct(item.id);
    const row = document.createElement("tr");
    row.innerHTML = `<td>${index + 1}</td><td>${product.name}</td><td>${item.quantity}</td>`;
    summaryTableBody.appendChild(row);
  });

  summaryOverlay.classList.remove("hidden");
}

summaryOkBtn.addEventListener("click", () => {
  location.reload();
});