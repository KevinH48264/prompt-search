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
  popover.style.flexDirection = "column"
  // popover.style.overflow = "hidden";


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

    // console.log("IN GETPOPOVER, THIS IS PROMPTDICT: ", promptDict)

    var promptMatchList: any[] = []
    var promptTextList = promptText.split(' ')
    // console.log("promptTextList", promptTextList)
    var add = true;

    // get promptMatchList which is all the prompts that should be presented
    // TODO: sort promptDict based on how recent the entry was
    // TODO: stop adding once you have 8
    
    // sort, returns oldest --> newest
    var sortedPromptList = Object.entries(promptDict).sort((a, b) => {
      return  a[1]['lastUsed'].valueOf() - b[1]['lastUsed'].valueOf()
    })

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

      if (counter > 7) {
        break
      }
    }

    // add prompts to popover
    for (const [prompt, val] of promptMatchList.reverse()) {
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