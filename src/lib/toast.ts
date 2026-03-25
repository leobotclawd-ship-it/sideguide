export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  if (typeof window !== 'undefined' && (window as any).showToast) {
    (window as any).showToast(message, type)
  }
}
