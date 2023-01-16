import { getPopover } from "./popover";

// just for constantly checking what's the latest answer div
var latestAnswerDiv: HTMLElement = document.createElement("div");
var observer: MutationObserver = new MutationObserver(function(mutations) {
  for (const mutation of mutations) {
    // console.log("mutation: ", mutation)
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(node => {
        var addedNode = node as HTMLElement;
        console.log("new node: ", addedNode)
        if (addedNode.className == 'w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]') {
            latestAnswerDiv = addedNode;
            console.log("UPDATE latest answer div: ", latestAnswerDiv)
        }
      });
    }
  };
});

var config = {
  childList: true,
  subtree: true,
  attributes: true,
};

export const addPromptSearchListener = () => {
  console.log("Starting CSS Reload Edits!")
  var promptText = ""

  // TODO: fix so that it automatically pops up when you navigate to a page
  // Problem: even if URL changes, the textarea doesn't always change immediately
  // Current scenario, user has to click or start typing

  document.addEventListener('click', async (event) => {
    
    var item = event.target as HTMLElement
    if (item instanceof HTMLTextAreaElement) {
      var textareabox = item as HTMLTextAreaElement
      if (textareabox.value) {
        promptText = textareabox.value as string;
      } else {
        promptText = ""
      }

      reloadPopover(item, promptText)
    }

    // TODO: how to figure out when something is clicked
    // save prompt in local storage
    // var button = document.getElementsByClassName('flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]')
    var button = document.getElementsByClassName('absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent')
    if (button[0].contains(item) || button[0] == item) {
      savePrompt(promptText)
      promptText = ""
    }
  });

  document.addEventListener("keydown", async (event) => {
    var item = event.target as HTMLElement    
    if (item instanceof HTMLTextAreaElement) {
      // save to local chrome storage
      var textareabox = item as HTMLTextAreaElement
      if (textareabox.value) {
        if (event.key != "Backspace") {
          promptText = textareabox.value + event.key as string;
        } else {
          promptText = textareabox.value.substring(0, textareabox.value.length - 1) as string;
        }
      }

      // only reload if you've typed at least one word?
      if (event.key == " ") {
        reloadPopover(item, promptText)
      }
      if (event.key == "Backspace" && textareabox.value[textareabox.value.length - 1] == " ") {
        reloadPopover(item, promptText)
      }
    }

    // save in local storage
    if (event.key == "Enter") {
      savePrompt(promptText)
      promptText = ""
      hidePopover()
    }
  });

  // reload observer too
  var textboxEl = document.getElementsByClassName('flex flex-col items-center text-sm h-full dark:bg-gray-800')[0] as Node
  // var textboxEl = document.getElementsByClassName('flex flex-col items-center text-sm h-full dark:bg-gray-800')[0] as Node
  // var textboxEl = document.getElementsByClassName('overflow-hidden w-full h-full relative')[0] as Node
  restartLatestAnswerDiv(textboxEl as HTMLElement)
} 

export const restartLatestAnswerDiv = (checkElement : HTMLElement) => {
  console.log("restarting")
  // for tracking the answer

  var temp = document.getElementById('__next') as HTMLElement
  // at minimum, validate that document is wrong. VALIDATED THAT DOCUMENT IS INDEED NOT UPDATING
  // validate: what mutations does it catch when you flip?
  console.log("RESTART TEMP: ", temp.childNodes)

  observer.observe(temp, config);
}

// save prompt
export const savePrompt = async (promptText : string) => {
  console.log("saving prompt!")

  var promptDict: { [key: string]: {
    answer: string,
    usageCount: number,
    lastUsed: Date
  }} = {};

  checkFinishAnswering(promptDict, promptText)

  // Maybe create an add to storage and have it at the end of checkFinishAnswering()?
  // retrieving from local storage, can also just store as a variable here if we seriously cannot wait
  chrome.storage.local.get('prompts', function(result) {
    if (result.prompts) {
      promptDict = JSON.parse(result.prompts)
    }

    // default addition to local storage
    promptDict[promptText as string] = {
      answer: "<p>Unavailable<p>",
      usageCount: 1,
      lastUsed: new Date()
    }

    chrome.storage.local.set({prompts: JSON.stringify(promptDict)})
    // console.log("end prompts from default add: ", promptDict)
  });

  hidePopover()
}

export const checkFinishAnswering = (promptDict : {[key: string]: {
    answer: string,
    usageCount: number,
    lastUsed: Date
  }}, promptText: string) => {
  // for tracking when the button appears, signifying it is done answering
  var observerButton = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          var addedNode = mutation.addedNodes[i] as HTMLElement;
          if (addedNode.tagName === "svg") {
            try {
              console.log("latestAnswerDiv upon computing", latestAnswerDiv)

              // temporary because this seems to be the only element that updates properly
              var tempAnswerDivText = document.getElementById('__next') as HTMLElement
              console.log(tempAnswerDivText)
              var tempMain = tempAnswerDivText.childNodes[1].childNodes[0].childNodes[0].childNodes[0]
              console.log(tempMain)
              var tempDivCollection = tempMain.childNodes[0].childNodes[0].childNodes[0]
              console.log(tempDivCollection)
              var latestAnswerDivTempCollection = tempDivCollection.childNodes
              console.log(latestAnswerDivTempCollection)
              var latestAnswerDivTemp = latestAnswerDivTempCollection[tempDivCollection.childNodes.length - 2]
              var answerDivText = latestAnswerDivTemp?.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement
              // code to add the answer
              promptDict[promptText as string] = {
                answer: answerDivText.innerHTML,
                usageCount: 1,
                lastUsed: new Date()
              }
              chrome.storage.local.set({prompts: JSON.stringify(promptDict)})
              console.log("added custom prompt, updated dict: ", promptDict)
            } catch {
              console.log("something like a div didn't have enough nodes or something")
            }
          }
        }
      }
    };
  });
  var config = {
    childList: true,
    subtree: true
  };
  var textboxEl = document.getElementsByClassName('flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]')[0] as Node
  observerButton.observe(textboxEl, config);
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
  // console.log("RELOADING POPOVER")
  var p = document.getElementById("popover");
  if (p) {
    p.remove()
  }

  p = getPopover(textbox, promptText);

  var textboxWrapper = textbox.parentElement?.parentElement
  var textboxMidWrapper = textbox.parentElement
  textboxWrapper?.insertBefore(p, textboxMidWrapper);
  p.style.visibility = "visible";

  var textboxEl = textbox.ownerDocument.getElementsByClassName('flex flex-col items-center text-sm h-full dark:bg-gray-800')[0] as Node
  restartLatestAnswerDiv(textboxEl as HTMLElement)

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