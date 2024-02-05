const selectionButton = document.getElementById("selection");

selectionButton!.onclick = selectionMode;
console.log("popup loaded");
function selectionMode() {
  console.log("selection mode");
  chrome.commands.getAll((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { commands: command },
        function (response) {
          window.close();
        }
      );
    });
  });
}
