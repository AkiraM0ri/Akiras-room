// bibliotecas
const { app, BrowserWindow } = require('electron')
const path = require('path')

// rendeniza a janela externa
function createWindow () {
  const win = new BrowserWindow({
    // frame: false,
    fullscreen: true,
    // width: 1980,
    // height: 1080,
  })

  // arquivo a ser rendenizado
  win.loadFile('./game_src/canva.html')
  win.maximize()
}

app.whenReady().then(() => {
  createWindow()
})

