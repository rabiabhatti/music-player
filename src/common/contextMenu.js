// @flow

export default async function contextMenu(e: MouseEvent, element: HTMLElement): Promise<Object> {
  const clickX = e.clientX
  const clickY = e.clientY
  const screenW = window.innerWidth
  const screenH = window.innerHeight

  const eltW = element.offsetWidth
  const eltH = element.offsetHeight

  const right = screenW - clickX > eltW
  const left = !right
  const top = screenH - clickY > eltH
  const bottom = !top

  let elementLeft
  let elementTop

  if (right) {
    elementLeft = `${clickX}px`
  }

  if (left) {
    elementLeft = `${clickX - eltW}px`
  }

  if (top) {
    elementTop = `${clickY - 5}px`
  }

  if (bottom) {
    elementTop = `${clickY - eltH - 15}px`
  }
  return { elementLeft, elementTop }
}
