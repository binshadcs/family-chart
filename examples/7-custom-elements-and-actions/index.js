import f3 from '../../src/index.js'

fetch('./data.json').then(r => r.json()).then(data => {
  const chart = f3.createChart('#FamilyChart', data)

  const card = chart.setCard(f3.CardSvg)
  card
    .setCardDim({w:220,h:70,text_x:75,text_y:15,img_w:60,img_h:60,img_x:5,img_y:5})
    .setCardDisplay([d => `${d.data['first name']} ${d.data['last name']}`])
    .setOnCardUpdate(onCardUpdate)

  const editor = chart.editTree().setCardClickOpen(card)

  chart.updateTree({ initial: true })

  function onCardUpdate(d) {
    const g = d3.select(this).select('.card-inner')

    g.append('g')
      .html(customAddBtn(card.card_dim))
      .on('click', () => editor.addRelative(d.data))

    g.append('g')
      .html(customEditBtn(card.card_dim))
      .on('click', () => editor.open(d.data))
  }
})

function customAddBtn(card_dim) {
  return `
    <g class="customAddBtn" style="cursor: pointer">
      <g transform="translate(${card_dim.w-12},${card_dim.h-12})scale(.08)">
        <circle r="100" fill="#fff" />
        <g transform="translate(-50,-45)" stroke="currentColor" stroke-width="20" stroke-linecap="round">
          <line x1="10" x2="90" y1="50" y2="50" />
          <line x1="50" x2="50" y1="10" y2="90" />
        </g>
      </g>
    </g>
  `
}

function customEditBtn(card_dim) {
  return `
    <g class="customEditBtn" style="cursor: pointer">
      <g transform="translate(${card_dim.w-36},${card_dim.h-12})scale(.08)">
        <circle r="100" fill="#fff" />
        <text text-anchor="middle" dominant-baseline="middle" font-size="120" fill="currentColor">✎</text>
      </g>
    </g>
  `
}

