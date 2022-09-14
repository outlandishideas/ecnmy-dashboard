/**
 * @param {string} indicator
 * @returns {string}
 */
const indicatorGroup = (indicator) => {
  if (indicator === 'poverty rate') {
    return 'poverty';
  }

  if (indicator.startsWith('life expectancy')) {
    return 'life expectancy';
  }

  if (indicator.startsWith('low paid')) {
    return 'low pay';
  }

  return indicator;
}

module.exports = indicatorGroup;
