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

  twig.extendFilter('format_duration', (v) => {
    return `Approx. ${Math.ceil(v / 60)} mins.`
  })

  twig.extendFilter('format_distance', (v) => {
    return `(${Math.ceil(v)} km)`
  })

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2
  })

  twig.extendFilter('format_fare', (v) => {
    return `Php ${formatter.format(parseFloat(v))}`
  })

  return twig;
};