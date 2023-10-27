const items = JSON.parse(localStorage.getItem('cart'));

export let cart = new Map();

if (items) {
    addItems(items, cart);
}

function saveToStorage(cart) {
    const cartArray = Array.from(cart);
    localStorage.setItem('cart', JSON.stringify(cartArray));
}

function addItems(items, cart) {
    for (const [key, value] of items) {
        cart.set(key, value);
    }
}

export function addToCart(productId, productQuantity) {
    if (cart.has(productId)) {
        cart.get(productId).quantity += productQuantity;
    } else {
        cart.set(productId, {quantity: productQuantity, deliveryOptionId: 1});
    }
    saveToStorage(cart);
}

export function removeFromCart(productId) {
    cart.delete(productId);
    saveToStorage(cart);
}

export function updateDeliveryOption(productId, deliveryOption) {
    cart.get(productId).deliveryOptionId = deliveryOption;
    saveToStorage(cart);
}