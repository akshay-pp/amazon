import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let productsHTML = "";
export let cartQuantity = JSON.parse(localStorage.getItem("cart-quantity"));
const cartQuantityElements = document.querySelectorAll(".js-cart-quantity");

function cartQuantityHTML() {
  cartQuantityElements.forEach((cartQuantityElement) => {
    if (cartQuantity) {
      cartQuantityElement.innerHTML = cartQuantity;
    } else {
      cartQuantityElement.innerHTML = 0;
    }
  });
}

cartQuantityHTML();

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>

      <div class="product-quantity-container"  id="_${product.id}">
        <select class="dropdown-quantity">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});
const productsGrid = document.querySelector(".js-products-grid");

if (productsGrid) {
  productsGrid.innerHTML = productsHTML;
}
export function updateCartQuantity() {
  cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  cartQuantityHTML();
  cartQuantity = localStorage.setItem(
    "cart-quantity",
    JSON.stringify(cartQuantity)
  );
}

document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    const productQuantity = document.querySelector(
      `#_${productId} .dropdown-quantity`
    ).value;
    addToCart(productId, productQuantity);
    updateCartQuantity();
  });
});
