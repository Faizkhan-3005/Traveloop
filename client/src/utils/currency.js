const CURRENCIES = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  INR: { symbol: '₹', rate: 83.5, name: 'Indian Rupee' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.78, name: 'British Pound' },
  AED: { symbol: 'د.إ', rate: 3.67, name: 'UAE Dirham' },
  JPY: { symbol: '¥', rate: 156.4, name: 'Japanese Yen' }
}

export const formatCurrency = (amount, code = 'USD') => {
  const currency = CURRENCIES[code] || CURRENCIES.USD
  const converted = amount * currency.rate
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(converted)
}

export { CURRENCIES }
