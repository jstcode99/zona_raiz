export enum Currency {
  COP = "COP",
  USD = "USD",
}

export const currencyOptions = [
  { label: "Peso colombiano", value: Currency.COP },
  { label: "Dólar estadounidense", value: Currency.USD },
]

export const CurrencyValues: string[] = Object.values(Currency);