// @flow

export default async function contextMenu(e: MouseEvent, element: HTMLElement): Promise<Object> {
  const mousePosition = {}
  const menuPostion = {}
  const menuDimension = {}

  menuDimension.x = element.offsetWidth
  menuDimension.y = element.offsetHeight
  mousePosition.x = e.pageX
  mousePosition.y = e.pageY

  if (mousePosition.x + menuDimension.x > window.innerWidth) {
    menuPostion.x = mousePosition.x - menuDimension.x
  } else {
    menuPostion.x = mousePosition.x
  }

  if (mousePosition.y + menuDimension.y > window.innerHeight) {
    menuPostion.y = mousePosition.y - menuDimension.y
  } else {
    menuPostion.y = mousePosition.y
  }

  return { menuPostion }
}
