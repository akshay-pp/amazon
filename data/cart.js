import { updateCartQuantity } from "../scripts/amazon.js";
export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId,productQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += Number(productQuantity);
  } else {
    cart.push({
      productId: productId,
      quantity: Number(productQuantity)
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
  updateCartQuantity();
}

export function updateCart(productId, updatedQuantity){
  cart.forEach(cartItem => {
    if(cartItem.productId == productId){
      cartItem.quantity = updatedQuantity;
    }
  })
  saveToStorage();
  updateCartQuantity();
}