chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const body = document.getElementsByTagName("body")[0];
  const head = document.getElementsByTagName("head")[0];
  const buttons = document.querySelectorAll("button, input, a");
  const abortListener = new AbortController();
  const dialog = document.createElement("dialog");

  body.onclick = function (event) {
    event.preventDefault();
  };

  head.innerHTML += `
        <style>
            body, button, input, a {
                cursor: crosshair !important;
            }

        </style>
        `;

  buttons.forEach((btn) => {
    btn.addEventListener("mouseover", selectTarget, {
      signal: abortListener.signal,
      capture: true,
    });
    btn.addEventListener("mouseout", removeTarget, {
      signal: abortListener.signal,
      capture: true,
    });
    btn.addEventListener("mousedown", clickTarget, {
      signal: abortListener.signal,
      capture: true,
    });
  });

  sendResponse();

  function openTargetWindow(event) {
    console.log(request.commands);
    let hotkeys = "";
    let usedPath = "";
    let target = event.currentTarget;
    request.commands.forEach((command, index) => {
      if (command.name === "_execute_action") return;

      hotkeys += `<option ${index === 1 ? "selected" : ""} 
      value="${command.name}" >${
        command.shortcut ? command.shortcut : command.name
      }</option>`;
    });
    window.location.href.split("/").forEach((pathSection, index, array) => {
      if (pathSection !== "" && index !== 0) {
        let path = array.slice(0, index + 1).join("/");
        usedPath += `<option ${
          index === 0 ? "selected" : ""
        } value="${path}">${path}</option>`;
      }
    });
    dialog.innerHTML = `
      <select id="hotkey">
        ${hotkeys}
      </select>
      <select id="usedPath">
        ${usedPath}
      </select>
      <input id="cancel_selection" type="button" value="Quitar modo selección" />
      <input id="select_button" type="button" value="Cancelar"/>
      <input id="assign_hotkey" type="button" value="Asignar Hotkey" />
    `;

    //style
    head.lastElementChild.remove();
    dialog.style.top = event.clientY + "px";
    dialog.style.left = event.clientX + "px";
    dialog.style.backgroundColor = "#fff";

    document.body.append(dialog);

    const hotkeySelect = dialog.querySelector("select#hotkey");
    const usedPathSelect = dialog.querySelector("select#usedPath");

    dialog
      .querySelector("#cancel_selection")
      .addEventListener("click", removeSelectionMode);

    dialog.querySelector("#select_button").addEventListener("click", () => {
      dialog.close();
      dialog.remove();
      head.innerHTML += `
        <style>
            body, button, input, a {
                cursor: crosshair !important;
            }

        </style>
        `;
    });
    dialog.querySelector("#assign_hotkey").addEventListener("click", () => {
      saveTarget(target, hotkeySelect.value, usedPathSelect.value);
    });
    dialog.showModal();
  }

  function saveTarget(target, hotkey, url) {
    let save = {
      hotkey: hotkey,
      url: url,
    };
    if (target.id) {
      save.targetId = target.id;
      save.searchMethod = "id";
    } else {
      save.targetId = {
        tag: target.tagName,
        text: target.textContent,
        parent: target.parentElement.tagName,
      };
      save.searchMethod = "tag";
    }
    console.log(save);
    // sendResponse(save);
    localStorage.setItem(save.hotkey + ":" + save.url, JSON.stringify(save));
    console.log(save.hotkey + ":" + save.url);
    removeSelectionMode();
  }

  function selectTarget(event) {
    event.currentTarget.style.outline = "solid 3px red";
  }

  function removeTarget(event) {
    event.currentTarget.style.outline = "none";
  }

  function clickTarget(event) {
    event.stopPropagation();
    event.currentTarget.style.outline = "solid 3px green";
    openTargetWindow(event);
    console.log(event.currentTarget);
    console.log(window.location.href);
  }

  function removeSelectionMode() {
    abortListener.abort();

    head.lastElementChild.remove();
    dialog.close();
    dialog.remove();
  }
});
