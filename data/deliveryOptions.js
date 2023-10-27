export let options = new Map();

export const saveDeliveryOptions = () => {
    options.set(1, {days: 7, priceCents: 0});
    options.set(2, {days: 3, priceCents: 499});
    options.set(3, {days: 1, priceCents: 999});
    localStorage.setItem('options', options);
}