// Mane Chappals Website JavaScript

// Replace this with the shop's WhatsApp number.
// Format: country code 91 + 10-digit mobile number.
const SHOP_WHATSAPP = "918390582650";

// Product information and verified image paths matching your asset directory exactly
const products = [
  {
    id: "kapshi",
    category: "kapshi",
    name: "Kapshi Pattern Chappals",
    mr: "कापशी पॅटर्न चप्पल",
    price: 2500,
    priceLabel: "₹2,500–₹5,000",
    mrPrice: "₹२,५००–₹५,०००",
    images: [
      "assests/products/kapshi-1.jpeg",
      "assests/products/kapshi-2.jpeg",
      "assests/products/kapshi-3.jpeg"
    ]
  },
  {
    id: "kolhapuri",
    category: "kolhapuri",
    name: "Kolhapuri Pattern Chappals",
    mr: "कोल्हापुरी पॅटर्न चप्पल",
    price: 2500,
    priceLabel: "₹2,500",
    mrPrice: "₹२,५००",
    images: [
      "assests/products/kolhapuri-1.jpeg",
      "assests/products/kolhapuri-2.jpeg",
      "assests/products/kolhapuri-3.jpeg"
    ]
  },
  {
    id: "shahupuri",
    category: "shahupuri",
    name: "Shahupuri Pattern Chappals",
    mr: "शाहूपुरी पॅटर्न चप्पल",
    price: 5000,
    priceLabel: "₹5,000",
    mrPrice: "₹५,०००",
    images: [
      "assests/products/shahupuri-1.jpeg",
      "assests/products/shahupuri-2.jpeg",
      "assests/products/shahupuri-3.jpeg"
    ]
  },
  {
    id: "sankeshwar",
    category: "sankeshwar",
    name: "Sankeshwar Chappals",
    mr: "संकेश्वर चप्पल",
    price: 3000,
    priceLabel: "Starting at ₹3,000",
    mrPrice: "₹३,००० पासून",
    images: [
      "assests/products/sankeshwar-1.jpeg",
      "assests/products/sankeshwar-2.jpeg",
      "assests/products/sankeshwar-3.jpeg"
    ]
  }
];

// Website state management variables
let language = "en";
let activeFilter = "all";
let cart = [];

// DOM Element shortcuts selection wrappers
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

// Get the product name in the selected language
function displayName(product) {
  return language === "mr" ? product.mr : product.name;
}

// Get the product price label in the selected language
function displayPrice(product) {
  return language === "mr" ? product.mrPrice : product.priceLabel;
}

// Format currency amounts dynamically as Indian Rupees (INR)
function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

// Display alert notifications inside a snackbar toast element
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// Display the responsive dynamic catalog product cards
function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;

  const visibleProducts =
    activeFilter === "all"
      ? products
      : products.filter(product => product.category === activeFilter);

  grid.innerHTML = "";

  visibleProducts.forEach(product => {
    product.images.forEach((imagePath, index) => {
      // Product layout root structural block
      const card = document.createElement("article");
      card.className = "product-card";

      // Product image display frame wrapper
      const photo = document.createElement("div");
      photo.className = "product-photo";

      const image = document.createElement("img");
      image.src = imagePath;
      image.alt = displayName(product) + " design " + (index + 1);
      image.loading = "lazy";

      // Error handler to display elegant gray placeholders if image filenames don't match
      image.onerror = () => {
        image.src = "https://placeholder.com";
        image.alt = "Image location not found. Check target directory path: " + imagePath;
      };

      // Design count tracker flag overlays
      const number = document.createElement("span");
      number.className = "product-number";
      number.textContent = "DESIGN 0" + (index + 1);

      // Interactive add-to-cart layout triggers
      const addButton = document.createElement("button");
      addButton.className = "quick-add";
      addButton.type = "button";
      addButton.textContent = language === "mr" ? "+ पिशवीत जोडा" : "+ Add to bag";

      addButton.addEventListener("click", (event) => {
        event.stopPropagation();
        addToCart(product.id);
      });

      photo.append(image, number, addButton);

      // Product textual info metadata frames
      const info = document.createElement("div");
      info.className = "product-info";

      const category = document.createElement("p");
      category.className = "product-category";
      category.textContent = language === "mr" ? "पारंपरिक संग्रह" : "Traditional collection";

      const title = document.createElement("h3");
      title.textContent = displayName(product);

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = displayPrice(product);

      const sub = document.createElement("p");
      sub.className = "product-sub";
      sub.textContent = language === "mr" ? "साइजसाठी चौकशी करा" : "Enquire for sizes";

      info.append(category, title, price, sub);
      card.append(photo, info);
      grid.append(card);
    });
  });
}

// Add a specified product to the active array items shopping bag
function addToCart(productId) {
  const item = cart.find(entry => entry.id === productId);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  renderCart();
  showToast(language === "mr" ? "पिशवीत जोडले!" : "Added to your bag!");
}

// Modify single item quantities inside bag layout structures
function changeQuantity(productId, amount) {
  const item = cart.find(entry => entry.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(entry => entry.id !== productId);
  }

  renderCart();
}

// Remove an absolute product element stack entirely from the bag arrays
function removeFromCart(productId) {
  cart = cart.filter(entry => entry.id !== productId);
  renderCart();
}

// Re-render and build shopping cart sidebar contents dynamically
function renderCart() {
  const container = $("#cartItems");
  if (!container) return;

  container.innerHTML = "";

  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountEl = $("#cartCount");
  if (cartCountEl) cartCountEl.textContent = count;

  // Manage empty view states if items arrays are empty
  if (cart.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-cart";
    empty.innerHTML = "<span>✳</span>";

    const message = document.createElement("p");
    message.textContent = language === "mr"
      ? "तुमची पिशवी रिकामी आहे."
      : "Your bag is empty. Add a style from the collection.";

    empty.append(message);
    container.append(empty);

    const cartTotalEl = $("#cartTotal");
    if (cartTotalEl) cartTotalEl.textContent = formatMoney(0);
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    total += product.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    // Set first index element layout to thumbnail source paths
    const image = document.createElement("img");
    image.src = product.images[0];
    image.alt = displayName(product);

    // Text details configurations
    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = displayName(product);

    const price = document.createElement("small");
    price.textContent = (language === "mr" ? "सुरुवातीची किंमत: " : "Starting price: ") + formatMoney(product.price);

    // Dynamic item counter control buttons UI elements layouts
    const controls = document.createElement("div");
    controls.className = "qty-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease quantity");
    minus.addEventListener("click", () => changeQuantity(product.id, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase quantity");
    plus.addEventListener("click", () => changeQuantity(product.id, 1));

    controls.append(minus, quantity, plus);

    // Remove single row completely button configuration elements
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.textContent = language === "mr" ? "काढून टाका" : "Remove";
    remove.addEventListener("click", () => removeFromCart(product.id));

    details.append(title, price, controls, remove);

    // Subtotal output column mapping elements
    const subtotal = document.createElement("strong");
    subtotal.className = "item-price";
    subtotal.textContent = formatMoney(product.price * item.quantity);

    row.append(image, details, subtotal);
    container.append(row);
  });

  const cartTotalEl = $("#cartTotal");
  if (cartTotalEl) cartTotalEl.textContent = formatMoney(total);
}

// Open sliding shopping bag panel drawer
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#overlay").hidden = false;
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

// Close sliding shopping bag panel drawer
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#overlay").hidden = true;
$("#cartDrawer").setAttribute("aria-hidden", "true");
document.body.classList.remove("drawer-open");
}
// Open secure WhatsApp external link API endpoints
function openWhatsApp(message) {
if (!/^[1-9]\d{10,14}$/.test(SHOP_WHATSAPP)) {
showToast(
language === "mr"
? "script.js मध्ये दुकानाचा WhatsApp नंबर भरा."
: "Add the shop's WhatsApp number in script.js first."
);
return;
}
// FIXED: Added proper protocol structure and routing slashes
const url = "https://wa.me" + SHOP_WHATSAPP + "?text=" + encodeURIComponent(message);
window.open(url, "_blank", "noopener,noreferrer");
}
// Compile bag catalog selections metrics formatting lines for ordering text messages pipelines
function checkout() {
if (cart.length === 0) {
showToast(language === "mr" ? "आधी पिशवीत चप्पल जोडा." : "Your bag is empty.");
return;
}
const lines = cart.map(item => {
const product = products.find(p => p.id === item.id);
return "• " + product.name + " × " + item.quantity + " — from " + formatMoney(product.price) + " each";
});
const total = cart.reduce((sum, item) => {
const product = products.find(p => p.id === item.id);
return sum + (product.price * item.quantity);
}, 0);
const message =
"Hello Mane Chappals! I'd like to enquire about this order:\n\n" +
lines.join("\n") +
"\n\nEstimated starting total: " +
formatMoney(total) +
"\nPlease confirm sizes, availability, final price and delivery.";
openWhatsApp(message);
}
// Toggle language localized translation dataset strings states engine
function setLanguage(nextLanguage) {
language = nextLanguage;
document.documentElement.lang = language === "mr" ? "mr" : "en";
$$("[data-en][data-mr]").forEach(element => {
element.innerHTML = language === "mr" ? element.dataset.mr : element.dataset.en;
});
$("#languageButton").textContent = language === "en" ? "मराठी" : "English";
renderProducts();
renderCart();
}
// Product catalog sorting filters tabs click event registrations
$$(".filter-button").forEach(button => {
button.addEventListener("click", () => {
activeFilter = button.dataset.filter;
$$(".filter-button").forEach(item => item.classList.toggle("active", item === button));
renderProducts();
});
});
// Primary global operations UI listeners mappings
$("#languageButton").addEventListener("click", () => setLanguage(language === "en" ? "mr" : "en"));
$("#cartOpenButton").addEventListener("click", openCart);
$("#cartCloseButton").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#checkoutButton").addEventListener("click", checkout);
// Responsive mobile viewport menu drawer toggles layout parameters
$("#menuButton").addEventListener("click", () => $("#mainNav").classList.toggle("show"));
$$(".main-nav a").forEach(link => {
link.addEventListener("click", () => $("#mainNav").classList.remove("show"));
});
// Close open modal slide dialog overlay using Escape keyboard shortcut
document.addEventListener("keydown", event => {
if (event.key === "Escape") closeCart();
});
// Primary catalog bootloaders deployment triggers execution
renderProducts();
renderCart();
