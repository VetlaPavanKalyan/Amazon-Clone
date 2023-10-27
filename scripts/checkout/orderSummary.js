import { cart, removeFromCart, updateDeliveryOption } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { checkOutQuantity } from '../utils/checkOutUtils.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { options, saveDeliveryOptions } from '../../data/deliveryOptions.js';
import { getDate } from '../utils/dateFormat.js';
import { renderPaymentSummary } from './paymentSummary.js';

export const renderOrderSummary = () => {

    checkOutQuantity();
    saveDeliveryOptions();

    function showCart(cart, products) {
        let cartSummary = '';
    
        cart.forEach((productQuantity, productId) => {
            let matchingProduct;
            let productOption;
            products.forEach((product) => {
                if (product.id === productId) {
                    matchingProduct = product;
                    productOption = productQuantity.deliveryOptionId;
                }
            });
    
            const deliveryOption = options.get(productOption);
            const today = dayjs();
            const dayString = getDate(today, deliveryOption.days);
    
            cartSummary += `
            <div class="cart-item-container js-container-${matchingProduct.id}">
                <div class="delivery-date">
                Delivery date: ${dayString}
                </div>
    
                <div class="cart-item-details-grid">
                <img class="product-image"
                    src="${matchingProduct.image}">
    
                <div class="cart-item-details">
                    <div class="product-name">
                    ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity js-product-quantity-container">
                        <span>
                            Quantity: 
                        </span>
                        <input id="input-${matchingProduct.id}" class="quantity-update js-quantity-update" type="number" value="${productQuantity.quantity}">
                        <span id="quantity-${matchingProduct.id}" class="quantity-label">${productQuantity.quantity}</span>
                        <span id="update-${matchingProduct.id}" class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                            Update
                        </span>
                        <span id="save-${matchingProduct.id}" class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">
                            Save
                        </span>
                        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                            Delete
                        </span>
                    </div>
                </div>
    
                <div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct, productOption)}
                </div>
                </div>
            </div>
            `;
        });
    
        document.querySelector('.js-order-summary').innerHTML = cartSummary;
    }
    
    showCart(cart, products);
    
    function deliveryOptionsHTML(matchingProduct, productOption) {
        let html = '';
        options.forEach((value, key) => {
            const today = dayjs();
            const dateString = getDate(today, value.days);
            const priceString = value.priceCents == 0 ? "FREE" : `$${formatCurrency(value.priceCents)} -`;
            const isChecked = (productOption === key);
            html += `
                <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}"
                data-delivery-option="${key}">
                <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">
                    ${dateString}
                    </div>
                    <div class="delivery-option-price">
                    ${priceString} Shipping
                    </div>
                </div>
                </div>
            `;
        });
        return html;
    }
    
    function removeItem(productId, quantity) {
        const container = document.querySelector(`.js-container-${productId}`);
        container.remove();
        let cartQuantity = Number(localStorage.getItem('quantity'));
        localStorage.removeItem('quantity');
        cartQuantity -= quantity;
        cartQuantity && (localStorage.setItem('quantity', cartQuantity));
    }

    function updateCart(cart, productId, quantity) {
        const diff = quantity - cart.get(productId).quantity;
        const cartQuantity = Number(localStorage.getItem('quantity'));
        localStorage.setItem('quantity', cartQuantity + diff);
        cart.get(productId).quantity = quantity;
    }
    
    document.querySelectorAll('.js-delete-link').forEach((item) => {
        item.addEventListener('click', () => {
            const productId = item.dataset.productId;
            const quantity = cart.get(productId).quantity;
            removeFromCart(productId);
            removeItem(productId, quantity);
            checkOutQuantity();
            renderPaymentSummary();    
        });
    });
    
    document.querySelectorAll('.js-delivery-option').forEach((option) => {
        option.addEventListener('click', () => {
            const {productId, deliveryOption} = option.dataset;
            updateDeliveryOption(productId, Number(deliveryOption));
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

    document.querySelectorAll('.js-update-link').forEach((update) => {
        const productId = update.dataset.productId;
        update.addEventListener('click', () => {
            let quantityContainer = document.getElementById(`quantity-${productId}`);
            quantityContainer.style.display = 'none';
            let updateButton = document.getElementById(`update-${productId}`);
            updateButton.style.display = 'none';
            document.getElementById(`input-${productId}`).style.display = 'inline-block';
            document.getElementById(`save-${productId}`).style.display = 'inline-block';
        });
    });

    document.querySelectorAll('.js-save-link').forEach((save) => {
        const productId = save.dataset.productId;
        save.addEventListener('click', () => {
            const value = Number(document.getElementById(`input-${productId}`).value);
            updateCart(cart, productId, value);
            let quantityContainer = document.getElementById(`quantity-${productId}`);
            quantityContainer.style.display = 'inline-block';
            quantityContainer.innerText = value;
            let updateButton = document.getElementById(`update-${productId}`);
            updateButton.style.display = 'inline-block';
            document.getElementById(`input-${productId}`).style.display = 'none';
            document.getElementById(`save-${productId}`).style.display = 'none';
            renderOrderSummary();
            renderPaymentSummary();
        });
    });
};