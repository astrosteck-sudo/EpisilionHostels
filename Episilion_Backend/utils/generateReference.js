const generateReference = () => {
  return `EPS_${Date.now()}_${Math.floor(
    Math.random() * 1000000
  )}`;
};

module.exports = generateReference;