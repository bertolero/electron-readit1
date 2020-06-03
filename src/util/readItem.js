const {BrowserWindow} = require('electron');

let offscreenWindow;

module.exports = (url, callBack) => {

    console.debug(url);

    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    });

    offscreenWindow.loadURL(url);

    offscreenWindow.webContents.on('did-finish-load', e => {

        const title = offscreenWindow.getTitle();

        console.debug(title);

        offscreenWindow.webContents.capturePage().then(
            image => {
                const screenShot = image.toDataURL();

                callBack({title, screenShot, url});

                offscreenWindow.close();
                offscreenWindow = null;
            })
    });
};
