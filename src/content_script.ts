import { addPromptSearchListener } from "./contentScript/addPromptSearchListener";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log("check was called!");

  switch (request.action) {
    case "website loaded":
      // console.log("check was called!");
      addPromptSearchListener();
      break;
  }

  sendResponse({ result: "success" });
});
