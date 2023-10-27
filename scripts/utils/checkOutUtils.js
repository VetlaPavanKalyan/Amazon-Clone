export const checkOutQuantity = () => {
    let quantity = 0;
    if (localStorage.getItem('quantity')) {
        quantity = Number(localStorage.getItem('quantity'));
    }
    document.querySelector('.return-to-home-link').innerText = `${quantity} items`;
};

export const cartUpdate = () => {
    const quantity = localStorage.getItem('quantity');
    (quantity > 0) && (document.querySelector('.js-cart-quantity').innerHTML = quantity)
};