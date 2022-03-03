function getDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return today.toLocaleDateString("en-US", options);
}

module.exports.logHello = function () {
  console.log(`Hello`);
};

//EXPORTING DIFFERENT FUNCTIONS with shortcut
exports.getDate = getDate;
