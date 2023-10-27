import { cart } from '../../data/cart.js';
import { products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { options } from '../../data/deliveryOptions.js';

export const renderPaymentSummary = () => {
    const quantity = localStorage.getItem('quantity');
    let paymentSummary = '';
    if (quantity) {
        const {prodcutsCost, deliveryCost} = getProuctsCost(cart);
        const totalCost = Number(formatCurrency(prodcutsCost + deliveryCost));
        const taxCost = Number((totalCost / 10).toFixed(2));
        paymentSummary += `
            <div class="payment-summary-title">
                Order Summary
            </div>

            <div class="payment-summary-row">
                <div>Items (${formatCurrency(quantity)}):</div>
                <div class="payment-summary-money">$${formatCurrency(prodcutsCost)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">$${formatCurrency(deliveryCost)}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">$${totalCost}</div>
            </div>

            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">$${formatCurrency(taxCost)}</div>
            </div>

            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">$${(totalCost + taxCost).toFixed(2)}</div>
            </div>

            <button class="place-order-button button-primary">
                Place your order
            </button>
        `;
    } else {
        let cartSummary = `
            <div>Your Cart is Empty. </div>
            <a class="button-primary view-products-link" href="./amazon.html">
                View products
            </a>
        `;
        document.querySelector('.js-order-summary').innerHTML = cartSummary;
        paymentSummary += `
            <div class="payment-summary-title">
                Order Summary
            </div>

            <div class="payment-summary-row">
                <div>Items (${0}):</div>
                <div class="payment-summary-money">$${formatCurrency(0)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">$${formatCurrency(0)}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">$${formatCurrency(0)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">$${formatCurrency(0)}</div>
            </div>

            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">$${(0).toFixed(2)}</div>
            </div>

            <button class="place-order-button button-primary">
                Place your order
            </button>
        `;
    }
    document.querySelector('.js-payment-summary').innerHTML = paymentSummary;
};

function getProuctsCost(cart) {
    let prodcutsCost = 0, deliveryCost = 0;
    cart.forEach((value, key) => {
        let matchingProduct;
        products.forEach((product) => {
            if (product.id === key) {
                matchingProduct = product;
            }
        });
        prodcutsCost += matchingProduct.priceCents * value.quantity;
        deliveryCost += options.get(value.deliveryOptionId).priceCents;
    });
    const totalCost = {prodcutsCost, deliveryCost};
    return totalCost;
}