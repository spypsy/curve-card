import co from 'co';

// wraps a function with 'co' so we can write nice async
// code in api endpoints implementation
export const coWrapper = (generator, ...args) => {
  return (req, res, next) => {
    co(generator(req, res, ...args)).catch(err => {
      err.functionName = generator.name; // eslint-disable-line
      next(err);
    });
  };
};

export const getAmount = (amount, res) => {
  // parse num and round to 2 significant digits
  const numAmount = Math.round(parseFloat(amount) * 100) / 100;

  // check for NaN or negative
  if (isNaN(numAmount) || numAmount < 0) {
    return res.status(400).send('Invalid Top-Up amount');
  }

  return numAmount;
};
