/*
Need transpilation
import {app, BrowserWindow} from 'electron';
import windowStateKeeper from 'electron-window-state';
 */
const {app, BrowserWindow, ipcMain} = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const readItem = require('./util/readItem');

ipcMain.on('new-item', (e, itemUrl) => {
    console.debug(e);
    readItem(itemUrl, item => {
        e.sender.send('new-item-success', item)
    });
});

function createWindow() {

    const state = windowStateKeeper({
        defaultWidth: 500,
        defaultHeight: 650
    });

    let mainWindow = new BrowserWindow({
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        minWidth: 350,
        minHeight: 300,
        maxWidth: 650,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(`file://${path.join(__dirname, 'renderer/main.html')}`);

    mainWindow.webContents.openDevTools();

    state.manage(mainWindow);

    mainWindow.on('close', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
