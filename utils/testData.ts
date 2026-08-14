export function generateEmployeeId(): string {
  // Generate a short 3-digit random suffix and prepend EMP.
  const suffix = Math.floor(Math.random() * 900 + 100).toString();
  return `EMP${suffix}`;
}