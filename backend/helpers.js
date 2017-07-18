import co from 'co';

// wraps a function with 'co' so we can write nice async
// code in api endpoints implementation
export const coWrapper = (generator, ...args) => {
  return (req, res, next) => {
    co(generator(req, res, ...args)).catch((err) => {
      err.functionName = generator.name; // eslint-disable-line
      next(err);
    });
  };
};
