module.exports = (fn) => {
  return (req, res, next) => {
    // Wrap async function and pass errors to Express 'next()' function
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
