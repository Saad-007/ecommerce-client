// utils/Prizeutils.js
export function getDiscountedPrice(price, off) {
  if (!price) return 0;

  const numericPrice = typeof price === "string"
    ? parseFloat(price.replace(/[^0-9.]/g, ""))
    : price || 0;

  const numericOff = typeof off === "string"
    ? parseFloat(off.replace(/[^0-9.]/g, ""))
    : off || 0;

  const discount = (numericPrice * numericOff) / 100;
  return +(numericPrice - discount).toFixed(2); // round to 2 decimal places
}
