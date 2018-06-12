import {detect} from 'detect-browser'
let browser = detect()
export default {
  hasWheelEvent: process.browser ? 'onwheel' in document : null,
  hasMouseWheelEvent: process.browser ? 'onmousewheel' in document : null,
  hasTouch: process.browser ? 'ontouchstart' in document : null,
  hasTouchWin: process.browser ? navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1 : null,
  hasPointer: process.browser ? !!window.navigator.msPointerEnabled : null,
  hasKeyDown: process.browser ? 'onkeydown' in document : null,
  isFirefox: process.browser ? navigator.userAgent.indexOf('Firefox') > -1 : null,
  isSafariMac: process.browser ? browser.name === 'safari' && browser.os === 'Mac OS' : null,
  isChromeAndroid: process.browser ? browser.name === 'chrome' && browser.os === 'Android OS' : null,
  isIOS: process.browser ? browser.os === 'iOS' : null,
  isIpad: process.browser ? /iPad/i.test(navigator.userAgent) || /iPhone OS 3_1_2/i.test(navigator.userAgent) || /iPhone OS 3_2_2/i.test(navigator.userAgent) : null,
  isAndroid: process.browser ? browser.os === 'Android OS' : null,
  isChromeDesktop: process.browser ? browser.name === 'chrome' && browser.os !== 'Android OS' && browser.os !== 'iOS' : null,
  hasWebGL: (() => {
    try {
      var canvas = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
    } catch (e) {
      return false
    }
  })()
}

