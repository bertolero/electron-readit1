const {dialog} = require('electron');
const {autoUpdater} = require('electron-updater');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = "debug";

autoUpdater.autoDownload = false;

module.exports = () => {
    autoUpdater.checkForUpdates().catch();

    autoUpdater.on('update-available', () => {

        dialog.showMessageBox(null, {
            type: 'info',
            title: 'Update available',
            message: 'A new version of Readit is available. Do you want to update now??',
            buttons: ['Update', 'No']
        }).then(userAction => {
            if (userAction.response === 0) {
                autoUpdater.downloadUpdate().catch();
            }
        });
    });

    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox(null, {
            type: 'info',
            title: 'Update ready',
            message: 'Install and restart now?',
            buttons: ['Yes', 'Later']
        }).then(userAction => {
            if (userAction.response === 0) {
                autoUpdater.quitAndInstall(false, true);
            }
        })
    });
}
