import '@testing-library/jest-dom/vitest'

// jsdom does not implement IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
