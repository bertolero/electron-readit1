const {autoUpdater} = require('electron-updater');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = "debug";

module.exports = () => {
    autoUpdater.checkForUpdates();
}
