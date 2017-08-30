const arr = window.location.search.substring(1).split('&');
const obj = {};
arr.forEach((item) => {
  const temArr = item.split('=');
  obj[temArr[0]] = temArr[1] || undefined;
});
module.exports = obj;