const { app, BrowserWindow, session } = require("electron/main");
const { autoUpdater } = require("electron-updater");

let win;
function createWindow() {
  const anon = session.fromPartition("temp:anon", { cache: false });

  win = new BrowserWindow({
    webPreferences: {
      session: anon,
      devTools: true
    },
    autoHideMenuBar: true
  });
  win.maximize();
  win.setMenu(null);
  win.loadURL("http://cmspweb.ip.tv");
  win.on("closed", () => {
    win = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  checkForUpdates();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify(); // Verifica atualizações e notifica o usuário automaticamente

  // Eventos de atualização
  autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
      type: "info",
      title: "Atualização disponível",
      message: "Uma nova versão está disponível. Baixando agora...",
    });
  });

  autoUpdater.on("update-not-available", () => {
    dialog.showMessageBox({
      type: "info",
      title: "Nenhuma atualização disponível",
      message: "Você já está usando a versão mais recente.",
    });
  });

  autoUpdater.on("error", (err) => {
    dialog.showErrorBox(
      "Erro ao atualizar",
      err == null ? "erro desconhecido" : (err.stack || err).toString(),
    );
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Atualização pronta",
        message:
          "Uma nova versão foi baixada. Deseja reiniciar para aplicar a atualização?",
        buttons: ["Sim", "Agora", "Depois"],
      })
      .then((result) => {
        if (result.response === 0) autoUpdater.quitAndInstall(); // Reinicia e instala a atualização
      });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
