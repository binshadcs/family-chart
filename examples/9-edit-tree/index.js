import f3 from '../../src/index.js'

fetch('./data.json').then(r => r.json()).then(data => {
  const chart = f3.createChart('#FamilyChart', data)
  const card = chart.setCard(f3.CardSvg)
  chart.editTree().setCardClickOpen(card)
  chart.updateTree({ initial: true })
})
