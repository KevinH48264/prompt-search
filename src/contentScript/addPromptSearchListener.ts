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
      } else {
        promptText = ""
      }

      reloadPopover(item, promptText)
    }

    // TODO: how to figure out when something is clicked
    // save prompt in local storage
    var button = document.getElementsByClassName('flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]')
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
} 

// save prompt
export const savePrompt = (promptText : string) => {
  chrome.storage.local.get('prompts', function(result) {
    var promptDict: { [key: string]: {
      answer: string,
      usageCount: number,
      lastUsed: Date
    }} = {};
    if (result.prompts) {
      promptDict = JSON.parse(result.prompts)
    }

    var observer = new MutationObserver(function(mutations) {
      // for tracking promptDiv and answerDiv
      var promptDiv: HTMLElement;
      var answerDiv: HTMLElement;

      mutations.forEach(function(mutation) {
        var addedMutation = mutation.target as HTMLElement

        // send button is live which means the record button has finished
        if (addedMutation.className == 'absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent') {
            console.log('!!!!!!!!!!!className changed finished?');

            try {
              var promptDivText = promptDiv.childNodes[0].childNodes[1].childNodes[0].textContent
              var answerDivText = answerDiv.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement
              
              if ((promptDivText == promptText) && promptDivText && promptDict[promptText] && promptDict[promptText]["answer"] == "Unavailable"
                && answerDivText) {
                console.log("WE'LL ADD THE ANSWER")

                // code to add the answer
                promptDict[promptText as string] = {
                  answer: answerDivText.innerHTML,
                  usageCount: 1,
                  lastUsed: new Date()
                }
                chrome.storage.local.set({prompts: JSON.stringify(promptDict)})
                console.log("end prompts: ", promptDict)
              }
            } catch {
              console.log("something like a div didn't have enough nodes or something")
            }
        }
        if (mutation.type === "childList") {
          for (var i = 0; i < mutation.addedNodes.length; i++) {
            var addedNode = mutation.addedNodes[i] as HTMLElement;
            if (addedNode.nodeName === "DIV" && addedNode.className.includes('w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800')) {
              promptDiv = addedNode;
              console.log("THIS IS THE PROMPT DIV: ", promptDiv)
            } else if (addedNode.nodeName === "DIV" && addedNode.className.includes('w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg')) {
              answerDiv = addedNode;
              console.log("THIS IS THE ANSWER DIV: ", answerDiv)
            }
          }
        }
      });
    });
    var config = {
      childList: true,
      subtree: true
    };
    
    observer.observe(document.body, config);


    // default addition to local storage
    promptDict[promptText as string] = {
      answer: "<p>Unavailable<p>",
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
  console.log("RELOADING POPOVER")
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