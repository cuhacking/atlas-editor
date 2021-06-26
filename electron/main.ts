import {
  app,
  BrowserWindow,
  dialog,
  Menu,
  MenuItemConstructorOptions
} from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import * as fs from 'fs';
const util = require('util');
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

let win: BrowserWindow | null = null;

const template: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        click: openFile
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      }
    ]
  }
];

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on('closed', () => (win = null));

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(
        __dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron'
      ),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function openFile() {
  const fileChannel = 'file-content';
  dialog
    .showOpenDialog({
      properties: ['openDirectory']
    })
    .then((data) => {
      if (!data) return;
      const { filePaths } = data;
      console.log(`filePath`, filePaths[0]);
      let jsonFiles: any[] = [];

      readDir(filePaths[0]).then((files: any) => {
        files.forEach((file: string) => {
          const fileType = file.split('.').pop()?.toLowerCase();
          if (fileType === 'json' || fileType === 'geojson') {
            console.log('(geo)json found');
            jsonFiles.push(readFile(`${filePaths[0]}${path.sep}${file}`));
          }
        });
        Promise.all(jsonFiles).then((filesData) => {
          console.log(
            `MAIN: ${fileChannel}`,
            filesData.map((data) => data.toString())
          );
          win?.webContents.send(
            fileChannel,
            filesData.map((data) => data.toString())
          );
        });
      });
    });
}
