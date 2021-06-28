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
import { promises as fs } from 'fs';

let win: BrowserWindow | null = null;

const template: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        click: openFolder
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

async function openFolder() {
  const fileChannel = 'file-content';
  try {
    const data = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    const { filePaths } = data;
    console.log(`filePath`, filePaths[0]);
    const files = await fs.readdir(filePaths[0]);
    const promises = files.map((file: string) => {
      const fileType = file.split('.').pop()?.toLowerCase();
      if (fileType === 'json' || fileType === 'geojson') {
        console.log('(geo)json found');
        return fs.readFile(`${filePaths[0]}${path.sep}${file}`);
      }
    });

    const mapData = await Promise.all(promises);
    console.log(`MAIN: ${fileChannel}: `);
    console.dir(
      mapData.map((data) => (data ? JSON.parse(data.toString()) : null))
    );
    win?.webContents.send(
      fileChannel,
      mapData
        .map((data) => (data ? JSON.parse(data.toString()) : null))
        .filter((data) => !!data)
    );
  } catch (error) {
    console.error(error);
  }
}
