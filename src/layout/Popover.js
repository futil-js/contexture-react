import F from 'futil-js'
import _ from 'lodash/fp'
import React, { useRef, useEffect, useState, Children } from 'react'
import { createPortal } from 'react-dom'
import { Observer } from 'mobx-react'
import OutsideClickHandler from 'react-outside-click-handler'
import {
  moveX,
  moveY,
  middleX,
  middleY,
  area,
  intersection,
  fromObject,
} from '../utils/rectangle'
import { addEventListener, setNodeStyles } from '../utils/dom'

let { min, max, floor } = Math

let getPopoverTopleft = ({ windowRect, anchorRect, popoverRect, position }) => {
  /*
   * These rectangles represent the places we can render a popover, relative to
   * its anchor element. They are positioned by applying translation functions:
   * - The first two translations move a rectangle so that one of its boundaries
   *   coincides with one of the boundaries of the anchor element.
   * - The next two move a rectangle such that its visible area is maximized,
   *   prioritizing the visibility of its topleft area.
   *
   * NOTE: The -1 in one of the translation functions is a hack to avoid text
   * wrapping from making the popover content overflow into the anchor element.
   */
  let positioned = F.mapIndexed(
    (translate, position) => ({ position, rectangle: translate(popoverRect) }),
    {
      top: _.flow(
        pop => moveY(anchorRect.top - pop.bottom)(pop),
        pop => moveX(middleX(anchorRect) - middleX(pop))(pop),
        pop => moveX(min(0, windowRect.right - pop.right - 1))(pop),
        pop => moveX(max(0, windowRect.left - pop.left))(pop)
      ),
      right: _.flow(
        pop => moveX(anchorRect.right - pop.left)(pop),
        pop => moveY(middleY(anchorRect) - middleY(pop))(pop),
        pop => moveY(min(0, windowRect.bottom - pop.bottom))(pop),
        pop => moveY(max(0, windowRect.top - pop.top))(pop)
      ),
      bottom: _.flow(
        pop => moveY(anchorRect.bottom - pop.top)(pop),
        pop => moveX(middleX(anchorRect) - middleX(pop))(pop),
        pop => moveX(min(0, windowRect.right - pop.right - 1))(pop),
        pop => moveX(max(0, windowRect.left - pop.left))(pop)
      ),
      left: _.flow(
        pop => moveX(anchorRect.left - pop.right)(pop),
        pop => moveY(middleY(anchorRect) - middleY(pop))(pop),
        pop => moveY(min(0, windowRect.bottom - pop.bottom))(pop),
        pop => moveY(max(0, windowRect.top - pop.top))(pop)
      ),
    }
  )

  // A bounding rectangle is one determined by the anchor element and the
  // viewport borders.
  let boundingRect = position =>
    _.set(
      { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[position],
      anchorRect[position],
      windowRect
    )

  // These heuristics will be used to choose among the possible popovers that
  // can be rendered. The order matters: earlier functions have higher weight
  // than latter ones.
  let heuristics = [
    // Prefer the popover with the largest visible area
    popover =>
      F.flurry(intersection, area, floor)(
        popover.rectangle,
        boundingRect(popover.position)
      ),
    // Prefer the popover in the requested position
    popover => popover.position === position,
    // Prefer the popover where its bounding rectangle has the largest area
    popover => floor(area(boundingRect(popover.position))),
  ]

  return _.pick(
    ['top', 'left'],
    _.last(_.sortBy(heuristics, positioned)).rectangle
  )
}

let AnchoredPopover = ({
  children,
  style,
  anchorParentRef,
  position = 'bottom',
}) => {
  let popoverRef = useRef(null)

  let reposition = () => {
    // We've got to account for window scroll offset as well, otherwise the
    // absolute positioning of the popover gets thrown off
    let scrollTranslate = _.flow(
      moveX(window.scrollX),
      moveY(window.scrollY)
    )

    // getBoundingClientRect doesn't include margins in its calculation
    let addMargins = (node, rect) => {
      let styles = window.getComputedStyle(node)
      return {
        top: rect.top - parseInt(styles['margin-top']),
        right: rect.right + parseInt(styles['margin-right']),
        bottom: rect.bottom + parseInt(styles['margin-bottom']),
        left: rect.left - parseInt(styles['margin-left']),
      }
    }

    setNodeStyles(
      getPopoverTopleft({
        position,
        windowRect: scrollTranslate({
          top: 0,
          left: 0,
          bottom: window.innerHeight,
          right: window.innerWidth,
        }),
        anchorRect: scrollTranslate(
          fromObject(
            anchorParentRef.current.firstElementChild.getBoundingClientRect()
          )
        ),
        popoverRect: addMargins(
          popoverRef.current,
          fromObject(popoverRef.current.getBoundingClientRect())
        ),
      }),
      popoverRef.current
    )
  }

  useEffect(() => {
    reposition()
    setNodeStyles({ visibility: 'visible' }, popoverRef.current)
    return addEventListener('resize', _.debounce(200, reposition), window)
  })

  return (
    <div
      ref={popoverRef}
      className="popover"
      style={{
        position: 'absolute',
        visibility: 'hidden',
        boxSizing: 'border-box',
        zIndex: 100,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

let SimplePopover = ({ children, style }) => (
  <div
    style={{
      position: 'relative',
    }}
  >
    <div
      className="popover"
      style={{
        position: 'absolute',
        zIndex: 100,
        border: '1px solid #ebebeb',
        ...style,
      }}
    >
      {children}
    </div>
  </div>
)

let stateLens = ([value, setValue]) => ({ get: () => value, set: setValue })

let Popover = ({ isOpen, anchor, position, ...props }) => {
  if (!isOpen && !anchor)
    throw new Error(
      'Cannot have an uncontrolled popover with no anchor element'
    )

  let anchorParentRef = useRef(null)

  // Support controlled state with isOpen
  let open = isOpen || stateLens(useState(false))
  let MaybeObserver = isOpen ? Observer : ({ children }) => children()

  // Support anchoring
  let Anchor = anchor && (
    <span ref={anchorParentRef} onClick={isOpen ? _.noop : F.on(open)}>
      {Children.only(anchor)}
    </span>
  )
  let Anchored =
    anchor &&
    createPortal(
      <AnchoredPopover {...{ anchorParentRef, position }} {...props} />,
      document.body
    )

  return (
    <MaybeObserver>
      {() => (
        <>
          {Anchor}
          {F.view(open) && (
            <OutsideClickHandler onOutsideClick={F.off(open)}>
              {Anchored || <SimplePopover {...props} />}
            </OutsideClickHandler>
          )}
        </>
      )}
    </MaybeObserver>
  )
}
Popover.displayName = 'Popover'

export default Popover
