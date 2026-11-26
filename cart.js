
const CART_KEY = "hcw_cart";

function getCart() {
  try {
    const items = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(
    CART_KEY, JSON.stringify(cart)
  );
  updateCartCount();
  renderCart();
}

function addToCart(id, name, price, image = "") {
  const cart = getCart();
  const item = cart.find(p => p.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      id, name, price, image, quantity: 1
    });
  }

  saveCart(cart);
  showCartMessage();
}

function changeQuantity(id, amount) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);

  if (item) {
    item.quantity = Math.max(
      1, item.quantity + amount
    );
  }

  saveCart(cart);
}

function removeItem(id) {
  saveCart(
    getCart().filter(p => p.id !== id)
  );
}

function updateCartCount() {
  const count = getCart().reduce(
    (total, item) => total + item.quantity, 0
  );

  document.querySelectorAll(
    "#cart-count"
  ).forEach(el => {
    el.textContent = count;
  });
}

function showCartMessage() {
  document.getElementById(
    "cart-message"
  )?.remove();

  const message = document.createElement("div");
  message.id = "cart-message";
  message.textContent = "Item added to your cart!";
  message.setAttribute("role", "status");

  Object.assign(message.style, {
    position: "fixed",
    bottom: "25px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#30251c",
    color: "#fff4df",
    padding: "15px 22px",
    borderRadius: "8px",
    textAlign: "center",
    zIndex: "9999"
  });

  document.body.appendChild(message);

  setTimeout(() => message.remove(), 2500);
}

function renderCart() {
  const container = document.getElementById(
    "cart-items"
  );
  const subtotal = document.getElementById(
    "cart-subtotal"
  );

  if (!container || !subtotal) return;

  const cart = getCart();
  container.replaceChildren();

  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <h2>Your cart is empty</h2>
        <p>Explore our handcrafted wood products.</p>
      </div>
    `;
  }

  cart.forEach(item => {
    total += Math.round(item.price * 100)
      * item.quantity;

    const row = document.createElement("div");
    row.style.padding = "15px 0";
    row.style.borderBottom = "1px solid #c5b49b";

    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;
      img.style.width = "100px";
      img.style.borderRadius = "5px";
      row.appendChild(img);
    }

    const name = document.createElement("h3");
    name.textContent = item.name;
    row.appendChild(name);

    const price = document.createElement("p");
    price.textContent =
      "$" + item.price.toFixed(2) + " each";
    row.appendChild(price);

    const controls = document.createElement("div");

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.onclick = () => changeQuantity(item.id, -1);

    const quantity = document.createElement("span");
    quantity.textContent = "  " + item.quantity + "  ";

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.onclick = () => changeQuantity(item.id, 1);

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.style.marginLeft = "15px";
    remove.onclick = () => removeItem(item.id);

    controls.append(minus, quantity, plus, remove);
    row.appendChild(controls);
    container.appendChild(row);
  });

  subtotal.textContent = "$" + (total / 100).toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
});

window.addEventListener("pageshow", () => {
  updateCartCount();
  renderCart();
});
