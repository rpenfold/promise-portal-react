/**
 * Generates a simple unique identifier. Result is not cryptographically
 * unique, but is good enough for mitigating collisions for internal portal
 * IDs.
 * @returns {string} unique ID
 */
export default function generateSimpleUniqueId(): string {
  return `${Date.now()}:${Math.random().toString().substr(2)}`;
}
