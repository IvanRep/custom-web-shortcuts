const selectionButton = document.getElementById("selection");

selectionButton.onclick = selectionMode;

function selectionMode() {
  chrome.commands.getAll((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { commands: command },
        function (response) {
          if (response && response.save) {
            localStorage.setItem(
              response.save.hotkey + ":" + response.save.url,
              JSON.stringify(response.save)
            );
            console.log(response.save.hotkey + ":" + response.save.url);
          }
          // window.close();
        }
      );
    });
  });
}
