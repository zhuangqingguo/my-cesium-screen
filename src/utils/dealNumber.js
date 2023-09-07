// n: 保留几位有效数字
export default function dealNumber(number, n) {
  if (number === 0 || number === '0') return 0

  let num = +number
  if (num >= n * 10) {
    return +num.toFixed(0)
  }

  return +num.toPrecision(n)
}

export function getFixedNum(num) {
  if (num === 0 || num === '0') return 0
  if (!num) return '-'
  if (!+num) return 0
  return +num.toFixed(2)
}
