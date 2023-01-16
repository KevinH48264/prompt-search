export const getPopover = (textbox : HTMLTextAreaElement, promptText : string) => {
  // Popover element

  const popover = document.createElement("div");
  popover.style.width = textbox.style.width;
  popover.style.height = "auto";
  popover.style.zIndex = "10";
  popover.style.backgroundColor = "transparent";

  popover.style.fontFamily = "sans-serif";
  popover.style.color = "rgb(210, 214, 218)";

  popover.style.display = "flex";
  popover.style.alignItems = "center";
  popover.style.justifyContent = "center";
  popover.style.flexDirection = "column-reverse"
  // popover.style.overflow = "hidden";


  // load in the suggestions
  chrome.storage.local.get('prompts', function(result) {
    var promptDict: { [key: string]: object } = {};
    if (result.prompts) {
      promptDict = JSON.parse(result.prompts)
    }

    console.log("IN GETPOPOVER, THIS IS PROMPTDICT: ", promptDict)

    var promptMatchList: any[] = []
    var promptTextList = promptText.split(' ')
    console.log("promptTextList", promptTextList)
    var add = true;

    // get promptMatchList which is all the prompts that should be presented
    for (var [key, value] of Object.entries(promptDict)) {
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
      }
    }

    // add prompts to popover
    for (const [prompt, val] of promptMatchList) {
      const suggestionBox = document.createElement("div");
      suggestionBox.style.display = "flex"
      suggestionBox.style.width = "100%"
      suggestionBox.style.padding = "10px"
      suggestionBox.style.opacity = "75%"
      suggestionBox.style.backgroundColor = "rgb(32,33,35)";

      suggestionBox.onmouseover = function() {
        suggestionBox.style.cursor = "pointer"
        suggestionBox.style.opacity = "100%"
      }
      suggestionBox.onmouseleave = function() {
        suggestionBox.style.backgroundColor = "rgb(32,33,35)";
        suggestionBox.style.opacity = "75%"
      }

      suggestionBox.onclick = async function() {
        var newText = prompt.replaceAll("<b>", "").replaceAll("</b>", "")
        textbox.value = newText
      }

      const iconDiv = document.createElement("div");
      iconDiv.style.marginRight = "10px"

      const textDiv = document.createElement("div");

      textDiv.innerHTML = prompt
      iconDiv.innerHTML = "🕓"

      suggestionBox.appendChild(iconDiv)
      suggestionBox.appendChild(textDiv)
      popover.appendChild(suggestionBox)
    }

  })

  popover.id = "popover";
  
  return popover;
};