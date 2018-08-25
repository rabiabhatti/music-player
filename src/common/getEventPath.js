// @flow

export default function getEventPath(event: Event) {
  const paths = []
  let element: Object = event.target
  while (element) {
    paths.push(element)
    element = element.parentNode
  }
  return paths
}
