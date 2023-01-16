import { sendMessageInCurrentTab } from "../utils";

export const contextMenu = () => {

  chrome.tabs.onUpdated.addListener(function (tabId , info) {
    if (info.status === 'complete') {
      console.log("tab was updated", tabId, info)

      sendMessageInCurrentTab(
        {
          action: "website loaded",
          command: "append",
        },
        function (response) {
        }
      );
      setTimeout(() => {}, 1000 * 20);
    }
  });
};
