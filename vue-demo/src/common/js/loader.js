export function loadScript(url) {
  function request() {
    return new Promise((resolve, reject) => {
      let sc = document.createElement('script')
      sc.type = 'text/javascript'
      sc.async = 'async'

      sc.onload = sc.onreadystatechange = function () {
        if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
          resolve()
          sc.onload = sc.onreadystatechange = null
        }
      }

      sc.onerror = function () {
        reject(new Error(`load ${url} error`))
        sc.onerror = null
      }

      sc.src = url
      document.getElementsByTagName('head')[0].appendChild(sc)
    })
  }

  function timeout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`load ${url} timeout`))
      }, 5000)
    })
  }

  return Promise.race([request(), timeout()])
}

export function loadExternal(url, namespace, name) {
  if (typeof window[namespace] !== 'object') {
    window[namespace] = {}
  }
  function load() {
    return new Promise((resolve, reject) => {
      if (window[namespace][name]) {
        resolve(window[namespace][name])
      } else {
        let sc = document.createElement('script')
        sc.type = 'text/javascript'
        sc.async = 'async'

        sc.onload = sc.onreadystatechange = function () {
          if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
            resolve(window[namespace][name])
            sc.onload = sc.onreadystatechange = null
          }
        }

        sc.onerror = function () {
          reject(new Error(`load external ${url} error`))
          sc.onerror = null
        }

        sc.src = url
        document.getElementsByTagName('head')[0].appendChild(sc)
      }
    })
  }

  function timeout() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`load external ${url} timeout`))
      }, 5000)
    })
  }

  return Promise.race([load(), timeout()])
}

export function preImgLoader(image, timeout) {
  function request() {
    return new Promise((resolve, reject) => {
      /* eslint-disable no-new */
      let img = new window.Image()

      img.onload = function () {
        resolve()
        img.onload = null
      }

      img.onerror = function () {
        reject(new Error(`load ${image} error`))
        img.onerror = null
      }

      img.src = image
    })
  }

  function timeOut() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`load external ${image} timeout`))
      }, timeout)
    })
  }

  return Promise.race([request(), timeOut()])
}
