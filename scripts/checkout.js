import { cart, removeFromCart, updateCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
let amountExcludingTax = 0;
generateItemsList();
function generateItemsList() {
  let cartSummaryHTML = "";
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });
    cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>
  
        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">
  
          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price" data-product-quantity="${
              cartItem.quantity
            }">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span id="_${
                  matchingProduct.id
                }-quantity" class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span id="_${
                matchingProduct.id
              }-update" class="update-quantity link-primary" data-product-id="${
      matchingProduct.id
    }">
                Update
              </span>
              <input data-product-id="${
                matchingProduct.id
              }" class="update-input" id="_${
      matchingProduct.id
    }-input" type="number"/>
              <span id="_${
                matchingProduct.id
              }-save" class="save-quantity link-primary" data-product-id="${
      matchingProduct.id
    }">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                matchingProduct.id
              }">
                Delete
              </span>
            </div>
          </div>
  
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input type="radio" checked
                class="delivery-option-input"
                name="delivery-option-${
                  matchingProduct.id
                }" data-shipping-cents = "0">
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${
                  matchingProduct.id
                }" data-shipping-cents = "499">
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${
                  matchingProduct.id
                }" data-shipping-cents = "999">
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
  updateItemsPrice();
}

function updateItemsPrice() {
  amountExcludingTax = 0;
  const excludingTaxHTMLS = document.querySelectorAll(".product-price");
  excludingTaxHTMLS.forEach((excludingTaxHTML) => {
    const itemQuantity = excludingTaxHTML.dataset.productQuantity;
    const itemPrice = excludingTaxHTML.innerText.match(/[0-9.]+/g) * 100;
    amountExcludingTax += Number(itemPrice.toFixed() * itemQuantity);
  });
  document.querySelector(".js-excluding-tax").innerText = `$${formatCurrency(
    amountExcludingTax
  )}`;
}

let totalDataShippingCents = 0;
const totalBeforeTax = amountExcludingTax + totalDataShippingCents;
const estimatedTax = totalBeforeTax / 10;
let orderTotal = estimatedTax + totalBeforeTax;
document.querySelector(".js-excluding-tax").innerText = `$${formatCurrency(
  amountExcludingTax
)}`;
document.querySelector(".js-total-before-tax").innerText = `$${formatCurrency(
  totalBeforeTax
)}`;
document.querySelector(".js-estimated-tax").innerText = `$${formatCurrency(
  estimatedTax
)}`;
document.querySelector(".js-total-amount").innerText = `$${formatCurrency(
  orderTotal
)}`;

function updatePriceDetails() {
  updateItemsPrice();
  const shippingPriceHTMLS = document.querySelectorAll(
    "input[type=radio]:checked"
  );
  totalDataShippingCents = 0;
  shippingPriceHTMLS.forEach((shippingPriceHTML) => {
    let dataShippingCents = shippingPriceHTML.dataset.shippingCents;
    totalDataShippingCents += Number(dataShippingCents);
  });
  document.querySelector(".js-shipping-amount").innerText = `$${formatCurrency(
    totalDataShippingCents
  )}`;
  const totalBeforeTax = amountExcludingTax + totalDataShippingCents;
  document.querySelector(".js-total-before-tax").innerText = `$${formatCurrency(
    totalBeforeTax
  )}`;
  const estimatedTax = totalBeforeTax / 10;

  document.querySelector(".js-estimated-tax").innerText = `$${formatCurrency(
    estimatedTax
  )}`;
  orderTotal = estimatedTax + totalBeforeTax;
  document.querySelector(".js-total-amount").innerText = `$${formatCurrency(
    orderTotal
  )}`;
}

const radioButtons = document.querySelectorAll("input[type=radio]");
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", () => {
    updatePriceDetails();
  });
});

function priceDetailsRemove() {
  updatePriceDetails();
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("js-delete-link")) {
    const productId = event.target.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();
    priceDetailsRemove();
  }
});

const orderButton = document.querySelector(".place-order-button");
const errorMsg = document.querySelector(".checkout-error-msg");
const orderAnchorTag = document.querySelector(".order-anchor");

orderButton.addEventListener("click", () => {
  if (orderTotal <= 0) {
    errorMsg.style.display = "block";
  } else {
    orderAnchorTag.href = "orders.html";
  }
});
const updateInput = document.querySelectorAll(".update-input");
let updatedQuantity;
document.addEventListener("input", (event) => {
  if (event.target.classList.contains("update-input")) {
    resizeInput.call(event.target);
  }
});

function resizeInput() {
  this.style.width = this.value.length + 2 + "ch";
}
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("update-quantity")) {
    const updateProductId = event.target.dataset.productId;
    event.target.style.display = "none";
    document.querySelector(`#_${updateProductId}-input`).style.display =
      "inline-block";
    document.querySelector(`#_${updateProductId}-save`).style.display =
      "inline-block";
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("save-quantity")) {
    const updateProductId = event.target.dataset.productId;
    const currentInput = document.querySelector(`#_${updateProductId}-input`);
    updatedQuantity = Number(currentInput.value);
    event.target.style.display = "none";
    currentInput.style.display = "none";
    document.querySelector(`#_${updateProductId}-update`).style.display =
      "inline-block";
    if (updatedQuantity > 0) {
      updateCart(updateProductId, updatedQuantity);
      generateItemsList();
      updatePriceDetails();
      document.querySelector(`#_${updateProductId}-quantity`).innerText =
        updatedQuantity;
    } else {
      alert("Invalid Quantity");
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.classList.contains("update-input")) {
    const updateInput = event.target;
    const updatedQuantity = Number(updateInput.value);
    const updateProductId = updateInput.dataset.productId;
    
    if (updatedQuantity > 0) {
      updateCart(updateProductId, updatedQuantity);
      generateItemsList();
      updatePriceDetails();
      document.querySelector(`#_${updateProductId}-quantity`).innerText = updatedQuantity;
    } else {
      alert("Invalid Quantity");
    }

    updateInput.style.display = "none";
    document.querySelector(`#_${updateProductId}-update`).style.display = "inline-block";
    document.querySelector(`#_${updateProductId}-save`).style.display = "none";
  }
});

