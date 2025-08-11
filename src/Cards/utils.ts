// @ts-nocheck
export function processCardDisplay(card_display) {
  const card_display_arr = []
  if (Array.isArray(card_display)) {
    card_display.forEach(d => {
      if (typeof d === 'function') {
        card_display_arr.push(d)
      } else if (typeof d === 'string') {
        card_display_arr.push(d1 => d1.data[d])
      } else if (Array.isArray(d)) {
        card_display_arr.push(d1 => d.map(d2 => d1.data[d2]).join(' '))
      }
    })
  } else if (typeof card_display === 'function') {
    card_display_arr.push(card_display)
  } else if (typeof card_display === 'string') {
    card_display_arr.push(d1 => d1.data[card_display])
  }
  return card_display_arr
}

export function calculateAge(birthday) {
  if (!birthday) return ''
  const date = new Date(birthday)
  if (!isNaN(date)) {
    const today = new Date()
    let age = today.getFullYear() - date.getFullYear()
    const m = today.getMonth() - date.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--
    return age
  }
  const year = parseInt(birthday, 10)
  if (!isNaN(year)) return new Date().getFullYear() - year
  return ''
}

export function defaultCardLabel(person) {
  const first = person['first name'] || ''
  const lastInitial = (person['last name'] || '').charAt(0)
  const age = calculateAge(person['birthday'])
  const ageStr = age === '' ? '' : ` (${age})`
  const lastStr = lastInitial ? ` ${lastInitial}` : ''
  return `${first}${lastStr}${ageStr}`.trim()
}

