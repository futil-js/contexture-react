import _ from 'lodash/fp'

let { min, max } = Math

export let moveX = by => rect => ({
  left: rect.left + by,
  right: rect.right + by,
  top: rect.top,
  bottom: rect.bottom,
})

export let moveY = by => rect => ({
  left: rect.left,
  right: rect.right,
  top: rect.top + by,
  bottom: rect.bottom + by,
})

export let width = rect => max(0, rect.right - rect.left)

export let height = rect => max(0, rect.bottom - rect.top)

export let middleX = rect => (rect.right + rect.left) / 2

export let middleY = rect => (rect.bottom + rect.top) / 2

export let area = rect => width(rect) * height(rect)

export let intersection = (box1, box2) => {
  let rect = {
    top: max(box2.top, box1.top),
    right: min(box2.right, box1.right),
    bottom: min(box2.bottom, box1.bottom),
    left: max(box2.left, box1.left),
  }
  return !width(rect) || !height(rect) ? null : rect
}
