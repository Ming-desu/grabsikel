const Twig = require('twig');

/**
 * Contains filters and helpers for twig
 * 
 * @param {Twig} twig 
 * @returns {Twig}
 */
module.exports = function(twig) {
  twig.extendFilter('typeof', (v) => {
    return typeof v;
  });

  twig.extendFilter('indexOf', (x, y) => {
    return x.indexOf(y);
  });

  return twig;
};