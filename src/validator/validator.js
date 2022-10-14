export const minMaxValidator = (el) => {
  const max = el.getAttribute("maxVal");
  const min = el.getAttribute("minVal");
  const validVal = parseInt(el.value.replace(/[^\d]/g, ""), 10);
  if (validVal > max || isNaN(validVal)) {
    return Number(max).toLocaleString("ru-RU");
  } else if (validVal < min || isNaN(validVal)) {
    return Number(min).toLocaleString("ru-RU");
  } else {
    return Number(validVal).toLocaleString("ru-RU");
  }
};