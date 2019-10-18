module.exports = (num: number): string => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
