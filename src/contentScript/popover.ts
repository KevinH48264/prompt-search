import { reloadPopover } from "./addPromptSearchListener";

export const getPopover = (textbox : HTMLTextAreaElement, promptText : string) => {
  // Popover element

  const popover = document.createElement("div");
  popover.style.width = textbox.style.width;
  popover.style.height = "auto";
  popover.style.zIndex = "10";
  popover.style.backgroundColor = "rgb(32,33,35)";
  popover.style.opacity = "75%";

  popover.style.fontFamily = "sans-serif";
  popover.style.color = "rgb(210, 214, 218)";

  popover.style.display = "flex";
  popover.style.alignItems = "center";
  popover.style.justifyContent = "center";
  popover.style.flexDirection = "column-reverse"
  // popover.style.overflow = "hidden";

  // Add toggles to menu
  const toggleBox = document.createElement("div");
  toggleBox.style.display = "flex"
  toggleBox.style.width = "100%"
  toggleBox.style.height = "50px";
  toggleBox.style.padding = "10px"
  toggleBox.style.opacity = "75%"
  toggleBox.style.backgroundColor = "rgb(32,33,35)";
  toggleBox.style.alignItems = "center"

  chrome.storage.local.get('showDisplay', function(result) {
    const toggleShowDisplay = document.createElement("button")
    toggleShowDisplay.style.borderRadius = "1rem";
    toggleShowDisplay.style.paddingLeft = "10px";
    toggleShowDisplay.style.paddingRight = "10px";
    toggleShowDisplay.style.height = "25px";
    toggleShowDisplay.style.marginRight = "10px"

    // show showDisplay value based on chrome storage
    if ('showDisplay' in result) {
      toggleShowDisplay.value = result.showDisplay
    } else {
      toggleShowDisplay.value = "on"
      chrome.storage.local.set({showDisplay: "on"})
    }
    
    if(toggleShowDisplay.value=="on"){
      toggleShowDisplay.style.backgroundColor = "black";
      toggleShowDisplay.style.color = "white";
    } else if(toggleShowDisplay.value=="off"){
      toggleShowDisplay.style.backgroundColor = "white";
      toggleShowDisplay.style.color = "black";
    }
    toggleShowDisplay.innerHTML = "show display: " + toggleShowDisplay.value;

    toggleShowDisplay.onclick = function() {
      if(toggleShowDisplay.value=="on"){
        toggleShowDisplay.value="off";
        toggleShowDisplay.style.backgroundColor = "white";
        toggleShowDisplay.style.color = "black";
      } else if(toggleShowDisplay.value=="off"){
        toggleShowDisplay.value="on";
        toggleShowDisplay.style.backgroundColor = "black";
        toggleShowDisplay.style.color = "white";
      }
      chrome.storage.local.set({showDisplay: toggleShowDisplay.value})
      toggleShowDisplay.innerHTML = "show display: " + toggleShowDisplay.value;
    }

    toggleBox.appendChild(toggleShowDisplay)
  })

  chrome.storage.local.get('sharePrompts', function(result) {
    const toggleSharePrompts = document.createElement("button")
    toggleSharePrompts.style.borderRadius = "1rem";
    toggleSharePrompts.style.paddingLeft = "10px";
    toggleSharePrompts.style.paddingRight = "10px";
    toggleSharePrompts.style.height = "25px";
    toggleSharePrompts.style.marginRight = "10px"

    // show showDisplay value based on chrome storage
    var sharePromptsVal = "on"
    if ('sharePrompts' in result && (result.sharePrompts == 'on' || result.sharePrompts == 'off')) {
      sharePromptsVal = result.sharePrompts as string
      console.log("there was in chrome local storage: ", result.sharePrompts)
    } else {
      sharePromptsVal = "on"
      chrome.storage.local.set({sharePrompts: sharePromptsVal})
      console.log('nope')
    }
    console.log("sharePromptsVal: ", sharePromptsVal)
    
    if (sharePromptsVal=="on"){
      toggleSharePrompts.style.backgroundColor = "black";
      toggleSharePrompts.style.color = "white";
    } else if (sharePromptsVal=="off"){
      toggleSharePrompts.style.backgroundColor = "white";
      toggleSharePrompts.style.color = "black";
    }
    toggleSharePrompts.innerHTML = "save & share prompts: " + sharePromptsVal;
    console.log("value: ", sharePromptsVal)
    toggleSharePrompts.value = sharePromptsVal;

    toggleSharePrompts.onclick = function() {
      console.log("clicked! ", toggleSharePrompts.value)
      if(toggleSharePrompts.value=="on"){
        toggleSharePrompts.value="off";
        toggleSharePrompts.style.backgroundColor = "white";
        toggleSharePrompts.style.color = "black";
        chrome.storage.local.set({ sharePrompts: "off"})
      } else if(toggleSharePrompts.value=="off"){
        toggleSharePrompts.value="on";
        toggleSharePrompts.style.backgroundColor = "black";
        toggleSharePrompts.style.color = "white";
        chrome.storage.local.set({ sharePrompts: "on"})
      }
      toggleSharePrompts.innerHTML = "save & share prompts: " + toggleSharePrompts.value;
    }

    toggleBox.appendChild(toggleSharePrompts)
  })

  chrome.storage.local.get('shareResponses', function(result) {
    const toggleShareResponses = document.createElement("button")
    toggleShareResponses.style.borderRadius = "1rem";
    toggleShareResponses.style.paddingLeft = "10px";
    toggleShareResponses.style.paddingRight = "10px";
    toggleShareResponses.style.height = "25px";
    toggleShareResponses.style.marginRight = "10px"

    // show showDisplay value based on chrome storage
    if ('shareResponses' in result && result.shareResponses != 'undefined') {
      toggleShareResponses.value = result.shareResponses
    } else {
      toggleShareResponses.value = "on"
      chrome.storage.local.set({shareResponses: "on"})
    }
    
    if(toggleShareResponses.value=="on"){
      toggleShareResponses.style.backgroundColor = "black";
      toggleShareResponses.style.color = "white";
    } else if(toggleShareResponses.value=="off"){
      toggleShareResponses.style.backgroundColor = "white";
      toggleShareResponses.style.color = "black";
    }
    toggleShareResponses.innerHTML = "save & share results: " + toggleShareResponses.value;

    toggleShareResponses.onclick = function() {
      if(toggleShareResponses.value=="on"){
        toggleShareResponses.value="off";
        toggleShareResponses.style.backgroundColor = "white";
        toggleShareResponses.style.color = "black";
      } else if(toggleShareResponses.value=="off"){
        toggleShareResponses.value="on";
        toggleShareResponses.style.backgroundColor = "black";
        toggleShareResponses.style.color = "white";
      }
      chrome.storage.local.set({shareResponses: toggleShareResponses.value})
      toggleShareResponses.innerHTML = "save & share results: " + toggleShareResponses.value;
    }

    toggleBox.appendChild(toggleShareResponses)
  })
  
  
  popover.appendChild(toggleBox)

  // load in the suggestions
  chrome.storage.local.get('prompts', function(result) {
    var promptDict: { [key: string]: {
      answer: string,
      usageCount: number,
      lastUsed: Date
    }} = {};

    if (result.prompts) {
      promptDict = JSON.parse(result.prompts)
    }


    var promptMatchList: any[] = []
    var promptTextList = promptText.split(' ')
    var add = true;
    
    // sort, returns oldest --> newest
    var sortedPromptList = Object.entries(promptDict).sort((a, b) => {
      return  a[1]['lastUsed'].valueOf() - b[1]['lastUsed'].valueOf()
    })

    // return top N results
    var returnTopN = 8
    var counter = 0
    for (var [key, value] of sortedPromptList.reverse()) {
      add = true
      for (const word of promptTextList) {
        if (word && word != " ") {
          var wordIdx = key.indexOf(word)
          if (wordIdx != -1) {
            // add bold
            key = key.substring(0, wordIdx)+ "<b>"+ key.substring(wordIdx, wordIdx + word.length) + "</b>" + key.substring(wordIdx + word.length);
          } else {
            add = false
            break
          }
        }
      }
      if (add) {
        promptMatchList.push([key, value])
        counter += 1
      }

      if (counter >= returnTopN) {
        break
      }
    }

    // add prompts to popover
    for (const [prompt, val] of promptMatchList) {
      if (textbox.value != prompt.replaceAll("<b>", "").replaceAll("</b>", "")) {
        const suggestionBox = document.createElement("div");
        suggestionBox.style.display = "flex"
        suggestionBox.style.width = "100%"
        suggestionBox.style.padding = "10px"
        suggestionBox.style.opacity = "75%"
        suggestionBox.style.backgroundColor = "rgb(32,33,35)";
        suggestionBox.style.alignItems = "center"

        const iconDiv = document.createElement("div");
        iconDiv.style.marginRight = "10px"

        const textWrapperDiv = document.createElement("div");

        const textDiv = document.createElement("div");
        textDiv.style.color = "white";
        textDiv.style.fontFamily = "sans-serif";
        textDiv.style.overflowX = "hidden";
        textDiv.style.overflowY = "scroll";
        textDiv.style.maxHeight = "25px";

        const answerDiv = document.createElement("div");
        answerDiv.style.fontFamily = "sans-serif";
        answerDiv.style.overflow = "hidden";
        answerDiv.style.marginLeft = "15px";
        answerDiv.style.overflowX = "hidden";
        answerDiv.style.overflowY = "scroll";
        answerDiv.style.maxHeight = "25px";
        answerDiv.innerHTML = val.answer;

        textDiv.innerHTML = prompt
        iconDiv.innerHTML = "🕓"

        suggestionBox.onmouseover = function() {
          suggestionBox.style.cursor = "pointer"
          suggestionBox.style.opacity = "100%"
          textDiv.style.maxHeight = "125px";
          answerDiv.style.maxHeight = "125px";
        }
        suggestionBox.onmouseleave = function() {
          suggestionBox.style.backgroundColor = "rgb(32,33,35)";
          suggestionBox.style.opacity = "75%"
          textDiv.style.maxHeight = "25px";
          answerDiv.style.maxHeight = "25px";
        }

        suggestionBox.onclick = async function() {
          var newText = prompt.replaceAll("<b>", "").replaceAll("</b>", "")
          textbox.value = newText
          reloadPopover(textbox, newText)
          suggestionBox.remove()
        }

        textWrapperDiv.appendChild(textDiv)
        textWrapperDiv.appendChild(answerDiv)
        suggestionBox.appendChild(iconDiv)
        suggestionBox.appendChild(textWrapperDiv)
        popover.appendChild(suggestionBox)
      }
    }
  })

  popover.id = "popover";
  
  return popover;
};