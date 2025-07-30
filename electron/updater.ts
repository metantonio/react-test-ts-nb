import { autoUpdater, ProgressInfo } from 'electron-updater';
import log from 'electron-log';
import { dialog, app } from 'electron';
import ProgressBar from 'electron-progressbar';

// Configurar el logger de autoUpdater
autoUpdater.logger = log;
let logger = autoUpdater.logger;

// Establecer el nivel de logging


// Habilitar la descarga automática
autoUpdater.autoDownload = false;

// Función para obtener la ruta de la carpeta de Descargas
const getDownloadsPath = (): string => {
  return app.getPath('downloads');
};

// Función principal exportada para verificar y aplicar actualizaciones
export const checkAndApplyUpdates = (mainBackend: () => void): void => {

  // Verificar y notificar actualizaciones
  autoUpdater.checkForUpdatesAndNotify().catch((err: Error) => {
    dialog.showErrorBox('There was an error', `${err} occurred while trying to look for updates`);
    logger.info('There was an error with checking for updates: ' + err);
    mainBackend();
  });

  // Variable para la barra de progreso
  let progressBar: ProgressBar | undefined;

  // Evento cuando hay una actualización disponible
  autoUpdater.on('update-available', () => {
    logger.info('There is an update available');
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new update is available for NBA app. Do you want to download the update',
      buttons: ['Donwload', 'No']
    }).then((res: Electron.MessageBoxReturnValue) => {
      if (res.response === 0) {
        autoUpdater.downloadUpdate();
        progressBar = new ProgressBar({
          indeterminate: false,
          text: 'Preparing data...',
          detail: 'Wait...',
          abortOnError: true,
          closeOnComplete: false,
          browserWindow: {
            alwaysOnTop: true
          }
        });
        progressBar
          .on('completed', function () {
            if (progressBar) {
              progressBar.detail = 'Updates has been downloaded. We are preparing your install.';
            }
          })
          .on('progress', function (value: number) {
            if (progressBar) {
              progressBar.detail = `Value ${value}% out of ${progressBar.getOptions().maxValue}...`;
            }
          });
      } else {
        mainBackend();
      }
    })
    .catch((err: Error) => logger.info('There has been an error downloading the update' + err));
  });

  // Evento para progreso de la descarga
  autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
    if (!progressBar) {
      progressBar = new ProgressBar({
        indeterminate: false,
        text: 'Downloading Update...',
        detail: 'Starting download...',
        abortOnError: true,
        closeOnComplete: false,
        browserWindow: {
          alwaysOnTop: true
        }
      });

      progressBar
        .on('completed', function () {
          if (progressBar) {
            progressBar.detail = 'Update has been downloaded. Preparing to install.';
          }
        })
        .on('progress', function (value: number) {
          if (progressBar) {
            progressBar.detail = `Downloaded ${value.toFixed(2)}%`;
          }
        });
    }

    if (progressBar) {
      progressBar.value = progressObj.percent;
      progressBar.detail = `Downloaded ${progressObj.percent.toFixed(2)}%`;
    }

    // Registrar el progreso (opcional)
    logger.info(`Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`);
  });

  // Evento cuando la descarga está completa
  autoUpdater.on('update-downloaded', () => {
    logger.info('Update downloaded');
    if (progressBar) {
      progressBar.close();
      progressBar = undefined;
    }
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update ready',
        message: 'Update has been downloaded. Do you want to install and restart?',
        buttons: ['Install and Restart', 'Later']
      }).then((res: Electron.MessageBoxReturnValue) => {
        if (res.response === 0) {
            autoUpdater.quitAndInstall(false, true);
        } else {
          mainBackend();
        }
      })
      .catch((err: Error) => logger.info(`Error when showing updater dialog message: ${err}`));
  });

  // Evento para manejar errores durante la actualización
  autoUpdater.on('error', (err: Error) => {
    dialog.showErrorBox(
      'Update Error',
      'An error occurred during the update process: ' + err.message
    );
    logger.error('An error occurred during the update process: ' + err.message);
    if (progressBar) {
      progressBar.close();
      progressBar = undefined;
    }
  });

  // Evento cuando no hay actualizaciones disponibles
  autoUpdater.on('update-not-available', () => {
    logger.info('No update available');
    mainBackend();
  });

  
};
