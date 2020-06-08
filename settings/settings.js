const { remote, ipcRenderer } = require('electron')
const Store = require('electron-store')
const settingsStore = new Store({name: 'Settings'})
const qiniuConfigArr = ['#savedFileLocation', '#accessKey', '#secretKey', '#bucketName']
const $ = (selector) => {
  const result = document.querySelectorAll(selector)
  return result.length > 1 ? result : result[0]
}

document.addEventListener('DOMContentLoaded', () => {
  // let savedLocation = settingsStore.get('savedFileLocation')
  // let accessKey = settingsStore.get('accessKey')
  // let secretKey = settingsStore.get('secretKey')
  // let bucketName = settingsStore.get('bucketName')
  // if (savedLocation) {
  //   $('#savedFileLocation').value = savedLocation
  // }
  // if (accessKey) {
  //   $('#accessKey').value = accessKey
  // }
  // if (secretKey) {
  //   $('#secretKey').value = secretKey
  // }
  // if (bucketName) {
  //   $('#bucketName').value = bucketName
  // }
  qiniuConfigArr.forEach(selector => {
    const savedValue = settingsStore.get(selector.substr(1))
    if (savedValue) {
      $(selector).value = savedValue
    }
  })

  $('#select-new-location').addEventListener('click', () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: '选择文件的存储路径'
    }, (path) => {
      if (Array.isArray(path)) {
        $('#savedFileLocation').value = path[0]
      }
    })
  })
  $('#settings-form').addEventListener('submit', (e) => {
    e.preventDefault()
    qiniuConfigArr.forEach(selector => {
      if ($(selector)) {
        let { id, value } = $(selector)
        settingsStore.set(id, value ? value : '')
      }
    })
    // 保存之后发送请求到main
    ipcRenderer.send('config-is-saved')
    remote.getCurrentWindow().close()
  })
  $('.nav-tabs').addEventListener('click', (e) => {
    e.preventDefault()
    $('.nav-link').forEach(element => {
      element.classList.remove('active')
    })
    e.target.classList.add('active')
    $('.config-area').forEach(element => {
      element.style.display = 'none'
    })
    $(e.target.dataset.tab).style.display = 'block'
  })
})