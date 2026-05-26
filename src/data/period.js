// Helpers to compute the contribution per period when the user picks
// a target, term (in months) and a period (semanal / quincenal / mensual).

export const PERIODS = [
  { key: 'semanal', label: 'Semanal', adjective: 'semanal', perMonth: 4.345 },
  { key: 'quincenal', label: 'Quincenal', adjective: 'quincenal', perMonth: 2 },
  { key: 'mensual', label: 'Mensual', adjective: 'mensual', perMonth: 1 },
]

export const periodMeta = (key) => PERIODS.find((p) => p.key === key) || PERIODS[2]

// Number of periods that fit in N months for the chosen period.
export const periodsInMonths = (key, months) => {
  const m = periodMeta(key)
  return Math.max(1, Math.round(months * m.perMonth))
}

// What the user must abonar in each period to reach the target.
export const computeContribution = ({ target, initialPayment = 0, termMonths, period }) => {
  const t = Number(target) || 0
  const i = Number(initialPayment) || 0
  const m = Number(termMonths) || 0
  if (t <= 0 || m <= 0) return 0
  const remaining = Math.max(0, t - i)
  const periods = periodsInMonths(period, m)
  return Math.ceil(remaining / periods)
}
