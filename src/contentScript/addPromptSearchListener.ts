import { getPopover } from "./popover";
// import { getPopoverAnywhere } from "./popoverAnywhere";

// just for constantly checking what's the latest answer div
var latestAnswerDiv: HTMLElement = document.createElement("div");
var promptText = ""
var textareabox: HTMLTextAreaElement = document.createElement("textarea")
export const URL = "https://auto-gpt.herokuapp.com"

export const addPromptSearchListener = () => {
  console.log("Starting CSS Reload Edits!")

  // TODO: fix so that it automatically pops up when you navigate to a page
  // Problem: even if URL changes, the textarea doesn't always change immediately
  // Current scenario, user has to click or start typing

  document.addEventListener('click', async (event) => {
    var item = event.target as HTMLElement
    if (item instanceof HTMLTextAreaElement) {
      textareabox = item as HTMLTextAreaElement
      if (textareabox.value) {
        promptText = textareabox.value as string;
      } else {
        promptText = ""
      }

      reloadPopover(item, promptText)
    }

    var body = document.getElementsByClassName('flex flex-col items-center text-sm h-full dark:bg-gray-800')[0]
    if (body.contains(item)) {
      hidePopover()
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
    // just messing with if it works on any place
    // var targetElement = event.target as HTMLElement;
    // var parentElement = targetElement?.parentNode;
    // console.log(targetElement);
    // console.log(parentElement);
    // if (parentElement) {
    //   getPopoverAnywhere(targetElement as HTMLElement, promptText, targetElement as HTMLElement)
    //   // LATER: need to add attributes, remove popups as they come along like reload popup
    // }

    // messing around ends

    var item = event.target as HTMLElement    
    setTimeout(function(){      
      if (item instanceof HTMLTextAreaElement) {
        // save to local chrome storage
        textareabox = item as HTMLTextAreaElement
        if (textareabox.value) {
          if (event.key != "Backspace") {
            promptText = textareabox.value as string;
          } else {
            promptText = textareabox.value.substring(0, textareabox.value.length - 1) as string;
          }
        }

        // only reload if you've typed at least one word?
        if (event.key == " ") {
          reloadPopover(item, promptText)
        }
        // if you hit backspace on a space / delete a word or you cleared everything out
        if (event.key == "Backspace" && (textareabox.value[textareabox.value.length - 1] == " " || textareabox.value.length == 1)) {
          reloadPopover(item, promptText)
        }
      }

      // save in local storage
      if (event.key == "Enter") {
        savePrompt(promptText)
        promptText = ""
        hidePopover()
      }
    }, 100)
  });
} 

// save prompt
export const savePrompt = async (promptText : string) => {
  // sharePrompts temporarily means save prompts and results locally
  chrome.storage.local.get('sharePrompts', function(result) { 
    if (result.sharePrompts == "on") {
      if (textareabox.value) {
        promptText = textareabox.value
      }
      
      // Maybe create an add to storage and have it at the end of checkFinishAnswering()?
      // retrieving from local storage, can also just store as a variable here if we seriously cannot wait
      chrome.storage.local.get('prompts', function(result) {
        var promptDict: { [key: string]: {
          answer: string,
          usageCount: number,
          lastUsed: number
        }};

        if (result.prompts) {
          promptDict = JSON.parse(result.prompts)
        } else {
          promptDict = {}
        }
        checkFinishAnswering(promptDict, promptText)  
      });
    }
  })

  hidePopover()
}

export const checkFinishAnswering = (promptDict : {[key: string]: {
    answer: string,
    usageCount: number,
    lastUsed: number
  }}, promptText: string) => {

  
  // for tracking when the button appears, signifying it is done answering
  var observerButton = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          var addedNode = mutation.addedNodes[i] as HTMLElement;
          if (addedNode.tagName === "svg") {
            try {

              // temporary because this seems to be the only element that updates properly
              var tempAnswerDivText = document.getElementById('__next') as HTMLElement
              var tempMain = tempAnswerDivText.childNodes[1].childNodes[0].childNodes[0].childNodes[0]
              var tempDivCollection = tempMain.childNodes[0].childNodes[0].childNodes[0]
              var latestAnswerDivTempCollection = tempDivCollection.childNodes
              var latestAnswerDivTemp = latestAnswerDivTempCollection[tempDivCollection.childNodes.length - 2]
              var answerDivText = latestAnswerDivTemp?.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement
              // code to add the answer
              promptDict[promptText.trim() as string] = {
                answer: answerDivText.innerHTML,
                usageCount: 1,
                lastUsed: (new Date()).valueOf()
              }
              chrome.storage.local.set({prompts: JSON.stringify(promptDict)})
              addPromptToDB(promptText.trim() as string, JSON.stringify(answerDivText.innerHTML))
            } catch {
              promptDict[promptText.trim() as string] = {
                answer: "<p>Unavailable<p>",
                usageCount: 1,
                lastUsed: (new Date()).valueOf()
              }
          
              chrome.storage.local.set({prompts: JSON.stringify(promptDict)})
              addPromptToDB(promptText.trim() as string, "<p>Unavailable<p>")
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
  setTimeout(function(){
    if (p) {
      p.style.visibility = "hidden";
      p.style.height = "0px"
    }
  }, 100);
}

// main code to show popup
export const reloadPopover = (textbox : HTMLTextAreaElement, promptText : string) => {
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
}

export const editPromptText = (edit : string) => {
  promptText = edit
}

export const addPromptToDB = (promptText : string, answerText : string) => {
  // shareResponses is temporary chrome storage for share prompts and results publicly
  chrome.storage.local.get('shareResponses', function(result) { 
    if (result.shareResponses == "on") {
      fetch(`${URL}/instance/getPrompt?prompt=${promptText}`).then((res) => res.json())
      .then((res) => {
        if (res && res.message != 'not found') {
          // update
          var paramsUpdate = {prompt: promptText, answer: res.instance.answer, usageCount: res.instance.usageCount + 1};
          var optionsUpdate = {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paramsUpdate),
          };
          fetch(`${URL}/instance/update/${res.instance._id}`, optionsUpdate).then((res) => res.json())
          .then((res) => {
            // console.log("DB update: ", res)
          });
        } else {
          // else: add it as a new prompt
          var paramsCreate = {prompt: promptText, answer: answerText, usageCount: 1};
          var optionsCreate = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paramsCreate),
          };
          fetch(`${URL}/instance/create`, optionsCreate).then((res) => res.json())
          .then((res) => {
            // console.log("DB create: ", res)
          });
          }
      });

      
    }
  })
}