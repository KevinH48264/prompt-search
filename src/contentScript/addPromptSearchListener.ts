import { getPopover } from "./popover";

export const addPromptSearchListener = () => {
  console.log("Starting CSS Reload Edits!")
  var promptText = ""

  // TODO: fix so that it automatically pops up when you navigate to a page
  // Problem: even if URL changes, the textarea doesn't always change immediately
  // Current scenario, user has to click or start typing
  document.addEventListener('click', async (event) => {
    
    var item = event.target as HTMLElement
    console.log("item: ", item)
    if (item instanceof HTMLTextAreaElement) {
      var textareabox = item as HTMLTextAreaElement
      if (textareabox.value) {
        promptText = textareabox.value as string;
      }

      reloadPopover(item, promptText)
    }

    // TODO: how to figure out when something is clicked
    // save prompt in local storage
    var button = document.getElementsByClassName('absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent')
    if (item == button[0]) {
      savePrompt(promptText)
    }
  });

  document.addEventListener("keydown", async (event) => {
    var item = event.target as HTMLElement    
    if (item instanceof HTMLTextAreaElement) {
      // save to local chrome storage
      var textareabox = item as HTMLTextAreaElement
      if (textareabox.value) {
        promptText = textareabox.value + event.key as string;
      }

      // only reload if you've typed at least one word?
      if (event.key == " ") {
        reloadPopover(item, promptText)
      }
    }

    // save in local storage
    if (event.key == "Enter") {
      savePrompt(promptText)
    }
  });
} 

// save prompt
export const savePrompt = (promptText : string) => {
  chrome.storage.local.get('prompts', function(result) {
    var promptDict: { [key: string]: object } = {};
    if (result.prompts) {
      promptDict = JSON.parse(result.prompts)
    }
    promptDict[promptText as string] = {
      answer: "Not shared",
      usageCount: 1,
      lastUsed: new Date()
    }
    chrome.storage.local.set({prompts: JSON.stringify(promptDict)})
    console.log("end prompts: ", promptDict)
  });

  hidePopover()
}

// show popover
export const showPopover = () => {
  var p = document.getElementById("popover");
  if (p) {
    p.style.visibility = "visible";
    p.style.height = "auto"
  }
}

// hide popover
export const hidePopover = () => {
  var p = document.getElementById("popover");

  // TODO: put back after debugging
  // if (p) {
  //   p.style.visibility = "hidden";
  //   p.style.height = "0px"
  // }
}

// main code to show popup
export const reloadPopover = (textbox : HTMLTextAreaElement, promptText : string) => {
  // console.log("RELOADING popover")
  var p = document.getElementById("popover");
  if (p) {
    p.remove()
  }

  p = getPopover(textbox, promptText);

  var textboxWrapper = textbox.parentElement?.parentElement
  var textboxMidWrapper = textbox.parentElement
  textboxWrapper?.insertBefore(p, textboxMidWrapper);
  p.style.visibility = "visible";

  if (document.activeElement === textbox) {
    showPopover()
  }

  // textbox is currently being changed
  if (textbox.addEventListener) {
    textbox.addEventListener('input', function() {
    }, false);
  }

  // textbox has been clicked back to
  textbox.onfocus = function() {
    showPopover()
  };

  // textbox is clicked away, dismiss popover
  textbox.onblur = function() {
    hidePopover()
  };
}