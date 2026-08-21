/** Strip non-digits. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

function allSameDigits(value: string): boolean {
  return /^(\d)\1+$/.test(value)
}

/** Brazilian mobile/landline with DDD (10 or 11 digits). */
export function isValidPhone(value: string): boolean {
  const d = digitsOnly(value)
  if (d.length < 10 || d.length > 11) return false
  const ddd = Number(d.slice(0, 2))
  if (ddd < 11 || ddd > 99) return false
  if (d.length === 11 && d[2] !== '9') return false
  return true
}

/** CPF with check digits. */
export function isValidCpf(value: string): boolean {
  const d = digitsOnly(value)
  if (d.length !== 11 || allSameDigits(d)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(d[i]) * (10 - i)
  let rest = (sum * 10) % 11
  if (rest === 10) rest = 0
  if (rest !== Number(d[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(d[i]) * (11 - i)
  rest = (sum * 10) % 11
  if (rest === 10) rest = 0
  return rest === Number(d[10])
}

/** CNPJ with check digits. */
export function isValidCnpj(value: string): boolean {
  const d = digitsOnly(value)
  if (d.length !== 14 || allSameDigits(d)) return false

  const calc = (base: string, factors: number[]) => {
    const sum = factors.reduce((acc, f, i) => acc + Number(base[i]) * f, 0)
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const f1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const f2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const d1 = calc(d, f1)
  if (d1 !== Number(d[12])) return false
  const d2 = calc(d, f2)
  return d2 === Number(d[13])
}
