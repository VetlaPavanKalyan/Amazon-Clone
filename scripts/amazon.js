import { addToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { cartUpdate } from './utils/checkOutUtils.js';

cartUpdate();

function loadProducts(products) {
    let productsHTML = '';

    products.forEach(product => {
        productsHTML += `
            <div class="product-container">
                <div class="product-image-container">
                <img class="product-image"
                    src=${product.image}>
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

                <div class="product-quantity-container">
                <select id="select-${product.id}">
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

                <div class="added-to-cart js-added-to-cart" id="${product.id}">
                    <img src="images/icons/checkmark.png">
                    Added
                </div>

                <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}">
                    Add to Cart
                </button>
            </div>
        `;
    });

    document.querySelector('.products-grid').innerHTML = productsHTML;
}

function saveCartQuantity(cartQuantity) {
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    localStorage.removeItem('quantity');
    localStorage.setItem('quantity', cartQuantity);
}

function updateCartQuantity(quantity) {
    let cartQuantity = Number(document.querySelector('.js-cart-quantity').innerText);
    cartQuantity += quantity;
    saveCartQuantity(cartQuantity);
}

loadProducts(products);

function addedAnimation(productId) {
    const div = document.getElementById(productId);
    div.classList.add('added');
    setTimeout(function() {
        div.classList.remove('added');
    }, 1500);
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
        let productId = button.dataset.productId;

        addedAnimation(productId);

        const quantity = Number(document.getElementById(`select-${productId}`).value);

        addToCart(productId, quantity);

        updateCartQuantity(quantity);
    });
});