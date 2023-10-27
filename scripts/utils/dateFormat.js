export function getDate(today, days) {
    const deliveryDate = today.add(days, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    return dateString;
}