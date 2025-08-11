// @ts-nocheck
import d3 from "../../d3.js"
import {appendTemplate, CardBodyOutline, CardBodyAddNewRel, CardBody} from "./Card.templates.js"
import cardElements, {appendElement} from "./Card.elements.js"
import setupCardSvgDefs from "./Card.defs.js"
import {plusIcon} from "./Card.icons.js"


export function CardSvg(props) {
  props = setupProps(props);
  setupCardSvgDefs(props.svg, props.card_dim)

  return function (d) {
    const gender_class =
      d.data.data.isLiving === false
        ? 'card-deceased'
        : d.data.data.gender === 'M'
        ? 'card-male'
        : d.data.data.gender === 'F'
        ? 'card-female'
        : 'card-genderless'
    const card_dim = props.card_dim

    const card = d3.create('svg:g').attr('class', `card ${gender_class}`).attr('transform', `translate(${[-card_dim.w / 2, -card_dim.h / 2]})`)
    card.append('g').attr('class', 'card-inner').attr('clip-path', 'url(#card_clip)')

    this.innerHTML = ''
    this.appendChild(card.node())

    card.on("click", function (e) {
      e.stopPropagation();
      props.onCardClick.call(this, e, d)
    })

    if (d.data._new_rel_data) {
      appendTemplate(CardBodyOutline({d,card_dim,is_new:d.data.to_add}).template, card.node(), true)
      appendTemplate(CardBodyAddNewRel({d,card_dim,label: d.data._new_rel_data.label}).template, this.querySelector('.card-inner'), true)
      d3.select(this.querySelector('.card-inner'))
      .append('g')
      .attr('class', 'card-edit-icon')
      .attr('fill', 'currentColor')
      .attr('transform', `translate(${card_dim.img_x-1},${card_dim.img_y+2})scale(${card_dim.img_h/22})`)
      .html(plusIcon())
    } else {
      appendTemplate(CardBodyOutline({d,card_dim,is_new:d.data.to_add}).template, card.node(), true)
      appendTemplate(CardBody({d,card_dim,card_display: props.card_display}).template, this.querySelector('.card-inner'))

      if (props.img) appendElement(cardElements.cardImage(d, props), this.querySelector('.card'))
      if (props.mini_tree) appendElement(cardElements.miniTree(d, props), this.querySelector('.card'), true)
      if (props.link_break) appendElement(cardElements.lineBreak(d, props), this.querySelector('.card'))
    }

    if (props.onCardUpdate) props.onCardUpdate.call(this, d)
  }

  function setupProps(props) {
    const default_props = {
      img: true,
      mini_tree: true,
      link_break: false,
      card_dim: {w:140,h:180,text_x:70,text_y:110,img_w:80,img_h:80,img_x:30,img_y:10}
    }
    if (!props) props = {}
    for (const k in default_props) {
      if (typeof props[k] === 'undefined') props[k] = default_props[k]
    }
    return props
  }
}