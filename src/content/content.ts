console.log("Message from the content");

import ElementController from "./ElementsController";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const elementController = new ElementController();
  elementController.init();
});
