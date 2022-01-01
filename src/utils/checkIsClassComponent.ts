export default function checkIsClassComponent(component: unknown): boolean {
  return typeof component === "function"
    && !!component.prototype?.isReactComponent;
}