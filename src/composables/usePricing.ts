export const usePricing = () => {
  const calcPrice = (params: {
    basePrice: number
    markupRate: number
    taxRate: number
    quantity: number
  }) => {
    const base = params.basePrice * (1 + params.markupRate)
    const tax = base * params.taxRate
    const subtotal = (base + tax) * params.quantity
    return {
      markedUpPrice: base,
      taxAmount: tax,
      total: subtotal,
    }
  }

  return {
    calcPrice,
  }
}