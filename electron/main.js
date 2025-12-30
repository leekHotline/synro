const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const isDev = !app.isPackaged

// 你的 Vercel 部署地址
const PRODUCTION_URL = 'https://synro.vercel.app'

let mainWindow

function createWindow() {
  // 开发环境和打包后的图标路径不同
  const iconPath = isDev 
    ? path.join(__dirname, '../public/big-icon.ico')
    : path.join(process.resourcesPath, 'icon.ico')

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // 设置窗口图标
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadURL(PRODUCTION_URL)
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 自定义菜单（设为 null 可完全隐藏菜单栏）
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        { label: '退出', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '刷新', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { label: '开发者工具', accelerator: 'F12', click: () => mainWindow.webContents.toggleDevTools() },
        { type: 'separator' },
        { label: '全屏', accelerator: 'F11', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) }
      ]
    },
    {
      label: '帮助',
      submenu: [
        { label: '关于 Synro', click: () => { /* 可以打开关于窗口 */ } }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  
  // 如果想完全隐藏菜单栏，取消下面这行注释：
  Menu.setApplicationMenu(null)
}

app.whenReady().then(() => {
  createMenu()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
