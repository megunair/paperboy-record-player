// Jest setup file
// Mock browser APIs and global objects that aren't available in Jest's JSDOM

// Create mocks for window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock for ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverMock;

// Mock for requestAnimationFrame
window.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
  return 0;
};

// Mock for cancelAnimationFrame
window.cancelAnimationFrame = () => {};

// Mock for local storage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: key => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock for session storage
const sessionStorageMock = (function() {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: key => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock for window.scrollTo
window.scrollTo = jest.fn();

// Mock for Element.scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock for navigator.mediaDevices.getUserMedia
if (!navigator.mediaDevices) {
  navigator.mediaDevices = {};
}
navigator.mediaDevices.getUserMedia = jest.fn(() => Promise.resolve({}));

// Mock for MutationObserver
global.MutationObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  disconnect() {}
  observe() {}
};
