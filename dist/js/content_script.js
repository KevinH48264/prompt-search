/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/contentScript/addPromptSearchListener.ts":
/*!******************************************************!*\
  !*** ./src/contentScript/addPromptSearchListener.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.editPromptText = exports.reloadPopover = exports.hidePopover = exports.showPopover = exports.checkFinishAnswering = exports.savePrompt = exports.addPromptSearchListener = void 0;
const popover_1 = __webpack_require__(/*! ./popover */ "./src/contentScript/popover.ts");
// import { getPopoverAnywhere } from "./popoverAnywhere";
// just for constantly checking what's the latest answer div
var latestAnswerDiv = document.createElement("div");
var promptText = "";
const addPromptSearchListener = () => {
    console.log("Starting CSS Reload Edits!");
    // TODO: fix so that it automatically pops up when you navigate to a page
    // Problem: even if URL changes, the textarea doesn't always change immediately
    // Current scenario, user has to click or start typing
    document.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
        var item = event.target;
        if (item instanceof HTMLTextAreaElement) {
            var textareabox = item;
            if (textareabox.value) {
                promptText = textareabox.value;
            }
            else {
                promptText = "";
            }
            (0, exports.reloadPopover)(item, promptText);
        }
        // TODO: how to figure out when something is clicked
        // save prompt in local storage
        // var button = document.getElementsByClassName('flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]')
        var button = document.getElementsByClassName('absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent');
        if (button[0].contains(item) || button[0] == item) {
            (0, exports.savePrompt)(promptText);
            promptText = "";
        }
    }));
    document.addEventListener("keydown", (event) => __awaiter(void 0, void 0, void 0, function* () {
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
        var item = event.target;
        if (item instanceof HTMLTextAreaElement) {
            // save to local chrome storage
            var textareabox = item;
            if (textareabox.value) {
                if (event.key != "Backspace") {
                    promptText = textareabox.value + event.key;
                }
                else {
                    promptText = textareabox.value.substring(0, textareabox.value.length - 1);
                }
            }
            // only reload if you've typed at least one word?
            if (event.key == " ") {
                (0, exports.reloadPopover)(item, promptText);
            }
            // if you hit backspace on a space / delete a word or you cleared everything out
            if (event.key == "Backspace" && (textareabox.value[textareabox.value.length - 1] == " " || textareabox.value.length == 1)) {
                (0, exports.reloadPopover)(item, promptText);
            }
        }
        // save in local storage
        if (event.key == "Enter") {
            (0, exports.savePrompt)(promptText);
            promptText = "";
            (0, exports.hidePopover)();
        }
    }));
};
exports.addPromptSearchListener = addPromptSearchListener;
// save prompt
const savePrompt = (promptText) => __awaiter(void 0, void 0, void 0, function* () {
    // sharePrompts temporarily means save prompts and results locally
    chrome.storage.local.get('sharePrompts', function (result) {
        if (result.sharePrompts == "on") {
            // Maybe create an add to storage and have it at the end of checkFinishAnswering()?
            // retrieving from local storage, can also just store as a variable here if we seriously cannot wait
            chrome.storage.local.get('prompts', function (result) {
                var promptDict;
                if (result.prompts) {
                    promptDict = JSON.parse(result.prompts);
                }
                else {
                    promptDict = {};
                }
                (0, exports.checkFinishAnswering)(promptDict, promptText);
            });
        }
    });
    (0, exports.hidePopover)();
});
exports.savePrompt = savePrompt;
const checkFinishAnswering = (promptDict, promptText) => {
    // for tracking when the button appears, signifying it is done answering
    var observerButton = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode = mutation.addedNodes[i];
                    if (addedNode.tagName === "svg") {
                        try {
                            // temporary because this seems to be the only element that updates properly
                            var tempAnswerDivText = document.getElementById('__next');
                            var tempMain = tempAnswerDivText.childNodes[1].childNodes[0].childNodes[0].childNodes[0];
                            var tempDivCollection = tempMain.childNodes[0].childNodes[0].childNodes[0];
                            var latestAnswerDivTempCollection = tempDivCollection.childNodes;
                            var latestAnswerDivTemp = latestAnswerDivTempCollection[tempDivCollection.childNodes.length - 2];
                            var answerDivText = latestAnswerDivTemp === null || latestAnswerDivTemp === void 0 ? void 0 : latestAnswerDivTemp.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0];
                            // code to add the answer
                            promptDict[promptText.trim()] = {
                                answer: answerDivText.innerHTML,
                                usageCount: 1,
                                lastUsed: (new Date()).valueOf()
                            };
                            chrome.storage.local.set({ prompts: JSON.stringify(promptDict) });
                            console.log("added this prompt: ", promptText);
                            console.log("updated Prompt Dict: ", promptDict);
                        }
                        catch (_a) {
                            promptDict[promptText] = {
                                answer: "<p>Unavailable<p>",
                                usageCount: 1,
                                lastUsed: (new Date()).valueOf()
                            };
                            chrome.storage.local.set({ prompts: JSON.stringify(promptDict) });
                        }
                    }
                }
            }
        }
        ;
    });
    var config = {
        childList: true,
        subtree: true
    };
    var textboxEl = document.getElementsByClassName('flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]')[0];
    observerButton.observe(textboxEl, config);
};
exports.checkFinishAnswering = checkFinishAnswering;
// show popover
const showPopover = () => {
    var p = document.getElementById("popover");
    if (p) {
        p.style.visibility = "visible";
        p.style.height = "auto";
    }
};
exports.showPopover = showPopover;
// hide popover
const hidePopover = () => {
    var p = document.getElementById("popover");
    // TODO: put back after debugging
    // setTimeout(function(){
    //   if (p) {
    //     p.style.visibility = "hidden";
    //     p.style.height = "0px"
    //   }
    // }, 100);
};
exports.hidePopover = hidePopover;
// main code to show popup
const reloadPopover = (textbox, promptText) => {
    var _a;
    var p = document.getElementById("popover");
    if (p) {
        p.remove();
    }
    p = (0, popover_1.getPopover)(textbox, promptText);
    var textboxWrapper = (_a = textbox.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    var textboxMidWrapper = textbox.parentElement;
    textboxWrapper === null || textboxWrapper === void 0 ? void 0 : textboxWrapper.insertBefore(p, textboxMidWrapper);
    p.style.visibility = "visible";
    if (document.activeElement === textbox) {
        (0, exports.showPopover)();
    }
    // textbox is currently being changed
    if (textbox.addEventListener) {
        textbox.addEventListener('input', function () {
        }, false);
    }
    // textbox has been clicked back to
    textbox.onfocus = function () {
        (0, exports.showPopover)();
    };
    // textbox is clicked away, dismiss popover
    textbox.onblur = function () {
        (0, exports.hidePopover)();
    };
};
exports.reloadPopover = reloadPopover;
const editPromptText = (edit) => {
    promptText = edit;
};
exports.editPromptText = editPromptText;


/***/ }),

/***/ "./src/contentScript/popover.ts":
/*!**************************************!*\
  !*** ./src/contentScript/popover.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addPromptList = exports.getPopover = void 0;
const addPromptSearchListener_1 = __webpack_require__(/*! ./addPromptSearchListener */ "./src/contentScript/addPromptSearchListener.ts");
const getPopover = (textbox, promptText) => {
    // Popover element
    const popover = document.createElement("div");
    popover.style.width = textbox.style.width;
    popover.style.height = "auto";
    popover.style.zIndex = "10";
    popover.style.backgroundColor = "rgb(32,33,35)";
    popover.style.opacity = "75%";
    popover.style.borderRadius = ".375rem";
    popover.style.fontFamily = "sans-serif";
    popover.style.color = "rgb(210, 214, 218)";
    popover.style.display = "flex";
    popover.style.alignItems = "center";
    popover.style.justifyContent = "center";
    popover.style.flexDirection = "column-reverse";
    // popover.style.overflow = "hidden";
    // Add toggles to menu
    const toggleBox = document.createElement("div");
    toggleBox.style.display = "flex";
    toggleBox.style.width = "100%";
    toggleBox.style.height = "50px";
    toggleBox.style.padding = "10px";
    toggleBox.style.opacity = "75%";
    toggleBox.style.backgroundColor = "rgb(32,33,35)";
    toggleBox.style.alignItems = "center";
    toggleBox.style.borderRadius = ".375rem";
    chrome.storage.local.get('showDisplay', function (result) {
        const toggleShowDisplay = document.createElement("div");
        toggleShowDisplay.style.borderRadius = "1rem";
        toggleShowDisplay.style.paddingLeft = "10px";
        toggleShowDisplay.style.paddingRight = "10px";
        toggleShowDisplay.style.height = "auto";
        toggleShowDisplay.style.marginRight = "10px";
        toggleShowDisplay.className = "temp";
        // show showDisplay value based on chrome storage
        var showDisplayVal = "on";
        if ('showDisplay' in result) {
            showDisplayVal = result.showDisplay;
        }
        else {
            showDisplayVal = "on";
            chrome.storage.local.set({ showDisplay: "on" });
        }
        if (showDisplayVal == "on") {
            toggleShowDisplay.style.backgroundColor = "black";
            toggleShowDisplay.style.color = "white";
        }
        else if (showDisplayVal == "off") {
            toggleShowDisplay.style.backgroundColor = "white";
            toggleShowDisplay.style.color = "black";
        }
        toggleShowDisplay.innerHTML = "show display: " + showDisplayVal;
        toggleShowDisplay.onclick = function () {
            chrome.storage.local.get('showDisplay', function (result) {
                var showDisplayVal = result.showDisplay;
                if (showDisplayVal == "on") {
                    showDisplayVal = "off";
                    toggleShowDisplay.style.backgroundColor = "white";
                    toggleShowDisplay.style.color = "black";
                }
                else if (showDisplayVal == "off") {
                    showDisplayVal = "on";
                    toggleShowDisplay.style.backgroundColor = "black";
                    toggleShowDisplay.style.color = "white";
                }
                chrome.storage.local.set({ showDisplay: showDisplayVal });
                toggleShowDisplay.innerHTML = "show display: " + showDisplayVal;
                (0, addPromptSearchListener_1.reloadPopover)(textbox, promptText);
            });
        };
        toggleShowDisplay.onmouseover = function () {
            toggleShowDisplay.style.cursor = "pointer";
        };
        toggleBox.appendChild(toggleShowDisplay);
    });
    chrome.storage.local.get('sharePrompts', function (result) {
        const toggleSharePrompts = document.createElement("div");
        toggleSharePrompts.style.borderRadius = "1rem";
        toggleSharePrompts.style.paddingLeft = "10px";
        toggleSharePrompts.style.paddingRight = "10px";
        toggleSharePrompts.style.height = "auto";
        toggleSharePrompts.style.marginRight = "10px";
        // show showDisplay value based on chrome storage
        var sharePromptsVal = "on";
        if ('sharePrompts' in result && (result.sharePrompts == 'on' || result.sharePrompts == 'off')) {
            sharePromptsVal = result.sharePrompts;
        }
        else {
            sharePromptsVal = "on";
            chrome.storage.local.set({ sharePrompts: sharePromptsVal });
        }
        if (sharePromptsVal == "on") {
            toggleSharePrompts.style.backgroundColor = "black";
            toggleSharePrompts.style.color = "white";
        }
        else if (sharePromptsVal == "off") {
            toggleSharePrompts.style.backgroundColor = "white";
            toggleSharePrompts.style.color = "black";
        }
        toggleSharePrompts.innerHTML = "save prompts & results: " + sharePromptsVal;
        toggleSharePrompts.onclick = function () {
            chrome.storage.local.get('sharePrompts', function (result) {
                var toggleSharePromptsVal = result.sharePrompts;
                if (toggleSharePromptsVal == "on") {
                    toggleSharePromptsVal = "off";
                    toggleSharePrompts.style.backgroundColor = "white";
                    toggleSharePrompts.style.color = "black";
                    chrome.storage.local.set({ sharePrompts: "off" });
                }
                else if (toggleSharePromptsVal == "off") {
                    toggleSharePromptsVal = "on";
                    toggleSharePrompts.style.backgroundColor = "black";
                    toggleSharePrompts.style.color = "white";
                    chrome.storage.local.set({ sharePrompts: "on" });
                }
                toggleSharePrompts.innerHTML = "save prompts & results: " + toggleSharePromptsVal;
            });
        };
        toggleSharePrompts.onmouseover = function () {
            toggleSharePrompts.style.cursor = "pointer";
        };
        toggleBox.appendChild(toggleSharePrompts);
    });
    chrome.storage.local.get('shareResponses', function (result) {
        const toggleShareResponses = document.createElement("div");
        toggleShareResponses.style.borderRadius = "1rem";
        toggleShareResponses.style.paddingLeft = "10px";
        toggleShareResponses.style.paddingRight = "10px";
        toggleShareResponses.style.height = "auto";
        toggleShareResponses.style.marginRight = "10px";
        // show showDisplay value based on chrome storage
        var shareResponsesVal = "on";
        if ('shareResponses' in result && result.shareResponses != 'undefined') {
            shareResponsesVal = result.shareResponses;
        }
        else {
            shareResponsesVal = "on";
            chrome.storage.local.set({ shareResponses: "on" });
        }
        if (shareResponsesVal == "on") {
            toggleShareResponses.style.backgroundColor = "black";
            toggleShareResponses.style.color = "white";
        }
        else if (shareResponsesVal == "off") {
            toggleShareResponses.style.backgroundColor = "white";
            toggleShareResponses.style.color = "black";
        }
        toggleShareResponses.innerHTML = "share prompts & results: " + shareResponsesVal;
        toggleShareResponses.onclick = function () {
            chrome.storage.local.get('shareResponses', function (result) {
                var shareResponsesVal = result.shareResponses;
                if (shareResponsesVal == "on") {
                    shareResponsesVal = "off";
                    toggleShareResponses.style.backgroundColor = "white";
                    toggleShareResponses.style.color = "black";
                }
                else if (shareResponsesVal == "off") {
                    shareResponsesVal = "on";
                    toggleShareResponses.style.backgroundColor = "black";
                    toggleShareResponses.style.color = "white";
                }
                chrome.storage.local.set({ shareResponses: shareResponsesVal });
                toggleShareResponses.innerHTML = "share prompts & results: " + shareResponsesVal;
            });
        };
        toggleShareResponses.onmouseover = function () {
            toggleShareResponses.style.cursor = "pointer";
        };
        toggleBox.appendChild(toggleShareResponses);
    });
    popover.appendChild(toggleBox);
    // load in the suggestions
    chrome.storage.local.get(['prompts', 'showDisplay'], function (result) {
        if ('showDisplay' in result && result.showDisplay == "on") {
            var promptDict = {};
            if (result.prompts) {
                promptDict = JSON.parse(result.prompts);
            }
            var promptMatchList = [];
            var promptTextList = promptText.split(' ');
            var add = true;
            // sort, returns oldest --> newest
            var sortedPromptList = Object.entries(promptDict).sort((a, b) => {
                return a[1]['lastUsed'] - b[1]['lastUsed'];
            });
            console.log("sorted prompt list: ", sortedPromptList);
            // return top N results
            var returnTopN = 8;
            var counter = 0;
            for (var [key, value] of sortedPromptList.reverse()) {
                add = true;
                for (const word of promptTextList) {
                    if (word && word != " ") {
                        var wordIdx = key.indexOf(word);
                        if (wordIdx != -1) {
                            // add bold
                            key = key.substring(0, wordIdx) + "<b>" + key.substring(wordIdx, wordIdx + word.length) + "</b>" + key.substring(wordIdx + word.length);
                        }
                        else {
                            add = false;
                            break;
                        }
                    }
                }
                if (add) {
                    promptMatchList.push([key, value]);
                    counter += 1;
                }
                if (counter >= returnTopN) {
                    break;
                }
            }
            // if counter is < returnTopN, return returnTopN - counter from DB
            // get a list based on words, and just keep on adjusting that list?
            console.log("promptMatchlist: ", promptMatchList);
            // var additionalPromptsNeeded = returnTopN - counter
            var additionalPromptsNeeded = 2;
            console.log("looking for: ", additionalPromptsNeeded);
            // var searchQuery = promptText
            var searchQuery = "Spain capital";
            if (additionalPromptsNeeded > 0) {
                fetch(`http://localhost:9090/instance/getFiltered?search=${searchQuery}&limit=${additionalPromptsNeeded}`)
                    .then((res) => res.json())
                    .then((DBprompts) => {
                    console.log("DBPrompts: ", DBprompts);
                    // split res accordingly
                    for (const DBprompt of DBprompts.instance) {
                        var additionalDBprompt = [
                            DBprompt.prompt, {
                                "answer": DBprompt.answer,
                                "usageCount": DBprompt.usageCount,
                            }
                        ];
                        promptMatchList.push(additionalDBprompt);
                    }
                    // add DBprompts to promptMatchlist
                    console.log("HERE IS THE UPDATED PROMPT MATCH LIST: ", promptMatchList);
                    // add combined DB and local prompts to popover
                    (0, exports.addPromptList)(textbox, promptMatchList, popover);
                }).catch(() => {
                    console.error('Error: we currently cannot access the shared database');
                    (0, exports.addPromptList)(textbox, promptMatchList, popover);
                });
            }
            else {
                // no need for DB
                (0, exports.addPromptList)(textbox, promptMatchList, popover);
            }
        }
        else {
            let suggestionBoxElements = document.querySelectorAll("#suggestionBox");
            suggestionBoxElements.forEach((el) => {
                el.remove();
            });
        }
    });
    popover.id = "popover";
    return popover;
};
exports.getPopover = getPopover;
const addPromptList = (textbox, promptMatchList, popover) => {
    for (const [prompt, val] of promptMatchList) {
        if (textbox.value != prompt.replaceAll("<b>", "").replaceAll("</b>", "")) {
            const suggestionBox = document.createElement("div");
            suggestionBox.id = "suggestionBox";
            suggestionBox.style.display = "flex";
            suggestionBox.style.width = "100%";
            suggestionBox.style.padding = "10px";
            suggestionBox.style.opacity = "75%";
            suggestionBox.style.backgroundColor = "rgb(32,33,35)";
            suggestionBox.style.alignItems = "center";
            suggestionBox.style.borderRadius = ".375rem";
            const iconDiv = document.createElement("div");
            iconDiv.style.marginRight = "10px";
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
            textDiv.innerHTML = prompt;
            if ("lastUsed" in val) {
                // from local
                iconDiv.innerHTML = "🕓";
            }
            else {
                // from DB
                iconDiv.innerHTML = "🔍";
            }
            suggestionBox.onmouseover = function () {
                suggestionBox.style.cursor = "pointer";
                suggestionBox.style.opacity = "100%";
                textDiv.style.maxHeight = "125px";
                answerDiv.style.maxHeight = "125px";
            };
            suggestionBox.onmouseleave = function () {
                suggestionBox.style.backgroundColor = "rgb(32,33,35)";
                suggestionBox.style.opacity = "75%";
                textDiv.style.maxHeight = "25px";
                answerDiv.style.maxHeight = "25px";
            };
            suggestionBox.onclick = function () {
                return __awaiter(this, void 0, void 0, function* () {
                    var newText = prompt.replaceAll("<b>", "").replaceAll("</b>", "");
                    textbox.value = newText;
                    (0, addPromptSearchListener_1.editPromptText)(newText);
                    (0, addPromptSearchListener_1.reloadPopover)(textbox, newText);
                    suggestionBox.remove();
                });
            };
            textWrapperDiv.appendChild(textDiv);
            textWrapperDiv.appendChild(answerDiv);
            suggestionBox.appendChild(iconDiv);
            suggestionBox.appendChild(textWrapperDiv);
            if (!("lastUsed" in val)) {
                // add usage count
                const usageDiv = document.createElement("div");
                usageDiv.style.marginLeft = "10px";
                usageDiv.innerHTML = "★ " + val.usageCount;
                suggestionBox.appendChild(usageDiv);
            }
            popover.appendChild(suggestionBox);
        }
    }
};
exports.addPromptList = addPromptList;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*******************************!*\
  !*** ./src/content_script.ts ***!
  \*******************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const addPromptSearchListener_1 = __webpack_require__(/*! ./contentScript/addPromptSearchListener */ "./src/contentScript/addPromptSearchListener.ts");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log("check was called!");
    switch (request.action) {
        case "website loaded":
            // console.log("check was called!");
            (0, addPromptSearchListener_1.addPromptSearchListener)();
            break;
    }
    sendResponse({ result: "success" });
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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M1ZyQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtDQUFrQyxtQkFBTyxDQUFDLCtGQUF5QztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudFNjcmlwdC9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L3BvcG92ZXIudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudF9zY3JpcHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZWRpdFByb21wdFRleHQgPSBleHBvcnRzLnJlbG9hZFBvcG92ZXIgPSBleHBvcnRzLmhpZGVQb3BvdmVyID0gZXhwb3J0cy5zaG93UG9wb3ZlciA9IGV4cG9ydHMuY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSBleHBvcnRzLnNhdmVQcm9tcHQgPSBleHBvcnRzLmFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gdm9pZCAwO1xuY29uc3QgcG9wb3Zlcl8xID0gcmVxdWlyZShcIi4vcG9wb3ZlclwiKTtcbi8vIGltcG9ydCB7IGdldFBvcG92ZXJBbnl3aGVyZSB9IGZyb20gXCIuL3BvcG92ZXJBbnl3aGVyZVwiO1xuLy8ganVzdCBmb3IgY29uc3RhbnRseSBjaGVja2luZyB3aGF0J3MgdGhlIGxhdGVzdCBhbnN3ZXIgZGl2XG52YXIgbGF0ZXN0QW5zd2VyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbnZhciBwcm9tcHRUZXh0ID0gXCJcIjtcbmNvbnN0IGFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiU3RhcnRpbmcgQ1NTIFJlbG9hZCBFZGl0cyFcIik7XG4gICAgLy8gVE9ETzogZml4IHNvIHRoYXQgaXQgYXV0b21hdGljYWxseSBwb3BzIHVwIHdoZW4geW91IG5hdmlnYXRlIHRvIGEgcGFnZVxuICAgIC8vIFByb2JsZW06IGV2ZW4gaWYgVVJMIGNoYW5nZXMsIHRoZSB0ZXh0YXJlYSBkb2Vzbid0IGFsd2F5cyBjaGFuZ2UgaW1tZWRpYXRlbHlcbiAgICAvLyBDdXJyZW50IHNjZW5hcmlvLCB1c2VyIGhhcyB0byBjbGljayBvciBzdGFydCB0eXBpbmdcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBpdGVtID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0YXJlYWJveCA9IGl0ZW07XG4gICAgICAgICAgICBpZiAodGV4dGFyZWFib3gudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gdGV4dGFyZWFib3gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICgwLCBleHBvcnRzLnJlbG9hZFBvcG92ZXIpKGl0ZW0sIHByb21wdFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IGhvdyB0byBmaWd1cmUgb3V0IHdoZW4gc29tZXRoaW5nIGlzIGNsaWNrZWRcbiAgICAgICAgLy8gc2F2ZSBwcm9tcHQgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgICAvLyB2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZmxleCBmbGV4LWNvbCB3LWZ1bGwgcHktMiBmbGV4LWdyb3cgbWQ6cHktMyBtZDpwbC00IHJlbGF0aXZlIGJvcmRlciBib3JkZXItYmxhY2svMTAgYmctd2hpdGUgZGFyazpib3JkZXItZ3JheS05MDAvNTAgZGFyazp0ZXh0LXdoaXRlIGRhcms6YmctZ3JheS03MDAgcm91bmRlZC1tZCBzaGFkb3ctWzBfMF8xMHB4X3JnYmEoMCwwLDAsMC4xMCldIGRhcms6c2hhZG93LVswXzBfMTVweF9yZ2JhKDAsMCwwLDAuMTApXScpXG4gICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhYnNvbHV0ZSBwLTEgcm91bmRlZC1tZCB0ZXh0LWdyYXktNTAwIGJvdHRvbS0xLjUgcmlnaHQtMSBtZDpib3R0b20tMi41IG1kOnJpZ2h0LTIgaG92ZXI6YmctZ3JheS0xMDAgZGFyazpob3Zlcjp0ZXh0LWdyYXktNDAwIGRhcms6aG92ZXI6YmctZ3JheS05MDAgZGlzYWJsZWQ6aG92ZXI6YmctdHJhbnNwYXJlbnQgZGFyazpkaXNhYmxlZDpob3ZlcjpiZy10cmFuc3BhcmVudCcpO1xuICAgICAgICBpZiAoYnV0dG9uWzBdLmNvbnRhaW5zKGl0ZW0pIHx8IGJ1dHRvblswXSA9PSBpdGVtKSB7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5zYXZlUHJvbXB0KShwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfSkpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vIGp1c3QgbWVzc2luZyB3aXRoIGlmIGl0IHdvcmtzIG9uIGFueSBwbGFjZVxuICAgICAgICAvLyB2YXIgdGFyZ2V0RWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgLy8gdmFyIHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50Py5wYXJlbnROb2RlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRFbGVtZW50KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGFyZW50RWxlbWVudCk7XG4gICAgICAgIC8vIGlmIChwYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIC8vICAgZ2V0UG9wb3ZlckFueXdoZXJlKHRhcmdldEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHByb21wdFRleHQsIHRhcmdldEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpXG4gICAgICAgIC8vICAgLy8gTEFURVI6IG5lZWQgdG8gYWRkIGF0dHJpYnV0ZXMsIHJlbW92ZSBwb3B1cHMgYXMgdGhleSBjb21lIGFsb25nIGxpa2UgcmVsb2FkIHBvcHVwXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gbWVzc2luZyBhcm91bmQgZW5kc1xuICAgICAgICB2YXIgaXRlbSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBzYXZlIHRvIGxvY2FsIGNocm9tZSBzdG9yYWdlXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFib3ggPSBpdGVtO1xuICAgICAgICAgICAgaWYgKHRleHRhcmVhYm94LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSAhPSBcIkJhY2tzcGFjZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZSArIGV2ZW50LmtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZS5zdWJzdHJpbmcoMCwgdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gb25seSByZWxvYWQgaWYgeW91J3ZlIHR5cGVkIGF0IGxlYXN0IG9uZSB3b3JkP1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIiBcIikge1xuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLnJlbG9hZFBvcG92ZXIpKGl0ZW0sIHByb21wdFRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgeW91IGhpdCBiYWNrc3BhY2Ugb24gYSBzcGFjZSAvIGRlbGV0ZSBhIHdvcmQgb3IgeW91IGNsZWFyZWQgZXZlcnl0aGluZyBvdXRcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJCYWNrc3BhY2VcIiAmJiAodGV4dGFyZWFib3gudmFsdWVbdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoIC0gMV0gPT0gXCIgXCIgfHwgdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoID09IDEpKSB7XG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2F2ZSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5zYXZlUHJvbXB0KShwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICAgICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XG4gICAgICAgIH1cbiAgICB9KSk7XG59O1xuZXhwb3J0cy5hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lciA9IGFkZFByb21wdFNlYXJjaExpc3RlbmVyO1xuLy8gc2F2ZSBwcm9tcHRcbmNvbnN0IHNhdmVQcm9tcHQgPSAocHJvbXB0VGV4dCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgLy8gc2hhcmVQcm9tcHRzIHRlbXBvcmFyaWx5IG1lYW5zIHNhdmUgcHJvbXB0cyBhbmQgcmVzdWx0cyBsb2NhbGx5XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVByb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc2hhcmVQcm9tcHRzID09IFwib25cIikge1xuICAgICAgICAgICAgLy8gTWF5YmUgY3JlYXRlIGFuIGFkZCB0byBzdG9yYWdlIGFuZCBoYXZlIGl0IGF0IHRoZSBlbmQgb2YgY2hlY2tGaW5pc2hBbnN3ZXJpbmcoKT9cbiAgICAgICAgICAgIC8vIHJldHJpZXZpbmcgZnJvbSBsb2NhbCBzdG9yYWdlLCBjYW4gYWxzbyBqdXN0IHN0b3JlIGFzIGEgdmFyaWFibGUgaGVyZSBpZiB3ZSBzZXJpb3VzbHkgY2Fubm90IHdhaXRcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgncHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbXB0RGljdDtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnByb21wdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0RGljdCA9IEpTT04ucGFyc2UocmVzdWx0LnByb21wdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0RGljdCA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZykocHJvbXB0RGljdCwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xufSk7XG5leHBvcnRzLnNhdmVQcm9tcHQgPSBzYXZlUHJvbXB0O1xuY29uc3QgY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSAocHJvbXB0RGljdCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIC8vIGZvciB0cmFja2luZyB3aGVuIHRoZSBidXR0b24gYXBwZWFycywgc2lnbmlmeWluZyBpdCBpcyBkb25lIGFuc3dlcmluZ1xuICAgIHZhciBvYnNlcnZlckJ1dHRvbiA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGRlZE5vZGUgPSBtdXRhdGlvbi5hZGRlZE5vZGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWRkZWROb2RlLnRhZ05hbWUgPT09IFwic3ZnXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGVtcG9yYXJ5IGJlY2F1c2UgdGhpcyBzZWVtcyB0byBiZSB0aGUgb25seSBlbGVtZW50IHRoYXQgdXBkYXRlcyBwcm9wZXJseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wQW5zd2VyRGl2VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdfX25leHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcE1haW4gPSB0ZW1wQW5zd2VyRGl2VGV4dC5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wRGl2Q29sbGVjdGlvbiA9IHRlbXBNYWluLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXRlc3RBbnN3ZXJEaXZUZW1wQ29sbGVjdGlvbiA9IHRlbXBEaXZDb2xsZWN0aW9uLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhdGVzdEFuc3dlckRpdlRlbXAgPSBsYXRlc3RBbnN3ZXJEaXZUZW1wQ29sbGVjdGlvblt0ZW1wRGl2Q29sbGVjdGlvbi5jaGlsZE5vZGVzLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJEaXZUZXh0ID0gbGF0ZXN0QW5zd2VyRGl2VGVtcCA9PT0gbnVsbCB8fCBsYXRlc3RBbnN3ZXJEaXZUZW1wID09PSB2b2lkIDAgPyB2b2lkIDAgOiBsYXRlc3RBbnN3ZXJEaXZUZW1wLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2RlIHRvIGFkZCB0aGUgYW5zd2VyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0RGljdFtwcm9tcHRUZXh0LnRyaW0oKV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyRGl2VGV4dC5pbm5lckhUTUwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzYWdlQ291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVc2VkOiAobmV3IERhdGUoKSkudmFsdWVPZigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwcm9tcHRzOiBKU09OLnN0cmluZ2lmeShwcm9tcHREaWN0KSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkZGVkIHRoaXMgcHJvbXB0OiBcIiwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGVkIFByb21wdCBEaWN0OiBcIiwgcHJvbXB0RGljdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0W3Byb21wdFRleHRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IFwiPHA+VW5hdmFpbGFibGU8cD5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNhZ2VDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVzZWQ6IChuZXcgRGF0ZSgpKS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHByb21wdHM6IEpTT04uc3RyaW5naWZ5KHByb21wdERpY3QpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9KTtcbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IHRydWVcbiAgICB9O1xuICAgIHZhciB0ZXh0Ym94RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIHctZnVsbCBweS0yIGZsZXgtZ3JvdyBtZDpweS0zIG1kOnBsLTQgcmVsYXRpdmUgYm9yZGVyIGJvcmRlci1ibGFjay8xMCBiZy13aGl0ZSBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCBkYXJrOnRleHQtd2hpdGUgZGFyazpiZy1ncmF5LTcwMCByb3VuZGVkLW1kIHNoYWRvdy1bMF8wXzEwcHhfcmdiYSgwLDAsMCwwLjEwKV0gZGFyazpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMCwwLDAsMC4xMCldJylbMF07XG4gICAgb2JzZXJ2ZXJCdXR0b24ub2JzZXJ2ZSh0ZXh0Ym94RWwsIGNvbmZpZyk7XG59O1xuZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGNoZWNrRmluaXNoQW5zd2VyaW5nO1xuLy8gc2hvdyBwb3BvdmVyXG5jb25zdCBzaG93UG9wb3ZlciA9ICgpID0+IHtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICBpZiAocCkge1xuICAgICAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgcC5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICB9XG59O1xuZXhwb3J0cy5zaG93UG9wb3ZlciA9IHNob3dQb3BvdmVyO1xuLy8gaGlkZSBwb3BvdmVyXG5jb25zdCBoaWRlUG9wb3ZlciA9ICgpID0+IHtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICAvLyBUT0RPOiBwdXQgYmFjayBhZnRlciBkZWJ1Z2dpbmdcbiAgICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgLy8gICBpZiAocCkge1xuICAgIC8vICAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIC8vICAgICBwLnN0eWxlLmhlaWdodCA9IFwiMHB4XCJcbiAgICAvLyAgIH1cbiAgICAvLyB9LCAxMDApO1xufTtcbmV4cG9ydHMuaGlkZVBvcG92ZXIgPSBoaWRlUG9wb3Zlcjtcbi8vIG1haW4gY29kZSB0byBzaG93IHBvcHVwXG5jb25zdCByZWxvYWRQb3BvdmVyID0gKHRleHRib3gsIHByb21wdFRleHQpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcG92ZXJcIik7XG4gICAgaWYgKHApIHtcbiAgICAgICAgcC5yZW1vdmUoKTtcbiAgICB9XG4gICAgcCA9ICgwLCBwb3BvdmVyXzEuZ2V0UG9wb3ZlcikodGV4dGJveCwgcHJvbXB0VGV4dCk7XG4gICAgdmFyIHRleHRib3hXcmFwcGVyID0gKF9hID0gdGV4dGJveC5wYXJlbnRFbGVtZW50KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGFyZW50RWxlbWVudDtcbiAgICB2YXIgdGV4dGJveE1pZFdyYXBwZXIgPSB0ZXh0Ym94LnBhcmVudEVsZW1lbnQ7XG4gICAgdGV4dGJveFdyYXBwZXIgPT09IG51bGwgfHwgdGV4dGJveFdyYXBwZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRleHRib3hXcmFwcGVyLmluc2VydEJlZm9yZShwLCB0ZXh0Ym94TWlkV3JhcHBlcik7XG4gICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRleHRib3gpIHtcbiAgICAgICAgKDAsIGV4cG9ydHMuc2hvd1BvcG92ZXIpKCk7XG4gICAgfVxuICAgIC8vIHRleHRib3ggaXMgY3VycmVudGx5IGJlaW5nIGNoYW5nZWRcbiAgICBpZiAodGV4dGJveC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIHRleHRib3guYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG4gICAgLy8gdGV4dGJveCBoYXMgYmVlbiBjbGlja2VkIGJhY2sgdG9cbiAgICB0ZXh0Ym94Lm9uZm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICgwLCBleHBvcnRzLnNob3dQb3BvdmVyKSgpO1xuICAgIH07XG4gICAgLy8gdGV4dGJveCBpcyBjbGlja2VkIGF3YXksIGRpc21pc3MgcG9wb3ZlclxuICAgIHRleHRib3gub25ibHVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAoMCwgZXhwb3J0cy5oaWRlUG9wb3ZlcikoKTtcbiAgICB9O1xufTtcbmV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IHJlbG9hZFBvcG92ZXI7XG5jb25zdCBlZGl0UHJvbXB0VGV4dCA9IChlZGl0KSA9PiB7XG4gICAgcHJvbXB0VGV4dCA9IGVkaXQ7XG59O1xuZXhwb3J0cy5lZGl0UHJvbXB0VGV4dCA9IGVkaXRQcm9tcHRUZXh0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkUHJvbXB0TGlzdCA9IGV4cG9ydHMuZ2V0UG9wb3ZlciA9IHZvaWQgMDtcbmNvbnN0IGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEgPSByZXF1aXJlKFwiLi9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lclwiKTtcbmNvbnN0IGdldFBvcG92ZXIgPSAodGV4dGJveCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIC8vIFBvcG92ZXIgZWxlbWVudFxuICAgIGNvbnN0IHBvcG92ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHBvcG92ZXIuc3R5bGUud2lkdGggPSB0ZXh0Ym94LnN0eWxlLndpZHRoO1xuICAgIHBvcG92ZXIuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgcG9wb3Zlci5zdHlsZS56SW5kZXggPSBcIjEwXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICBwb3BvdmVyLnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xuICAgIHBvcG92ZXIuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIuMzc1cmVtXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5jb2xvciA9IFwicmdiKDIxMCwgMjE0LCAyMTgpXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgcG9wb3Zlci5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSBcImNvbHVtbi1yZXZlcnNlXCI7XG4gICAgLy8gcG9wb3Zlci5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgLy8gQWRkIHRvZ2dsZXMgdG8gbWVudVxuICAgIGNvbnN0IHRvZ2dsZUJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUuaGVpZ2h0ID0gXCI1MHB4XCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLnBhZGRpbmcgPSBcIjEwcHhcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIuMzc1cmVtXCI7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaG93RGlzcGxheScsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlU2hvd0Rpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjFyZW1cIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5jbGFzc05hbWUgPSBcInRlbXBcIjtcbiAgICAgICAgLy8gc2hvdyBzaG93RGlzcGxheSB2YWx1ZSBiYXNlZCBvbiBjaHJvbWUgc3RvcmFnZVxuICAgICAgICB2YXIgc2hvd0Rpc3BsYXlWYWwgPSBcIm9uXCI7XG4gICAgICAgIGlmICgnc2hvd0Rpc3BsYXknIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgc2hvd0Rpc3BsYXlWYWwgPSByZXN1bHQuc2hvd0Rpc3BsYXk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IFwib25cIjtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNob3dEaXNwbGF5OiBcIm9uXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNob3dEaXNwbGF5VmFsID09IFwib25cIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJzaG93IGRpc3BsYXk6IFwiICsgc2hvd0Rpc3BsYXlWYWw7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3Nob3dEaXNwbGF5JywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciBzaG93RGlzcGxheVZhbCA9IHJlc3VsdC5zaG93RGlzcGxheTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gXCJvZmZcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IFwib25cIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hvd0Rpc3BsYXk6IHNob3dEaXNwbGF5VmFsIH0pO1xuICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LmlubmVySFRNTCA9IFwic2hvdyBkaXNwbGF5OiBcIiArIHNob3dEaXNwbGF5VmFsO1xuICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLnJlbG9hZFBvcG92ZXIpKHRleHRib3gsIHByb21wdFRleHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5Lm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZUJveC5hcHBlbmRDaGlsZCh0b2dnbGVTaG93RGlzcGxheSk7XG4gICAgfSk7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVByb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZVNoYXJlUHJvbXB0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjFyZW1cIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgLy8gc2hvdyBzaG93RGlzcGxheSB2YWx1ZSBiYXNlZCBvbiBjaHJvbWUgc3RvcmFnZVxuICAgICAgICB2YXIgc2hhcmVQcm9tcHRzVmFsID0gXCJvblwiO1xuICAgICAgICBpZiAoJ3NoYXJlUHJvbXB0cycgaW4gcmVzdWx0ICYmIChyZXN1bHQuc2hhcmVQcm9tcHRzID09ICdvbicgfHwgcmVzdWx0LnNoYXJlUHJvbXB0cyA9PSAnb2ZmJykpIHtcbiAgICAgICAgICAgIHNoYXJlUHJvbXB0c1ZhbCA9IHJlc3VsdC5zaGFyZVByb21wdHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzaGFyZVByb21wdHNWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVByb21wdHM6IHNoYXJlUHJvbXB0c1ZhbCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hhcmVQcm9tcHRzVmFsID09IFwib25cIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzaGFyZVByb21wdHNWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgfVxuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuaW5uZXJIVE1MID0gXCJzYXZlIHByb21wdHMgJiByZXN1bHRzOiBcIiArIHNoYXJlUHJvbXB0c1ZhbDtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsID0gcmVzdWx0LnNoYXJlUHJvbXB0cztcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlU2hhcmVQcm9tcHRzVmFsID09IFwib25cIikge1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHNWYWwgPSBcIm9mZlwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUHJvbXB0czogXCJvZmZcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG9nZ2xlU2hhcmVQcm9tcHRzVmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsID0gXCJvblwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUHJvbXB0czogXCJvblwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuaW5uZXJIVE1MID0gXCJzYXZlIHByb21wdHMgJiByZXN1bHRzOiBcIiArIHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZUJveC5hcHBlbmRDaGlsZCh0b2dnbGVTaGFyZVByb21wdHMpO1xuICAgIH0pO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVSZXNwb25zZXMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZVNoYXJlUmVzcG9uc2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxcmVtXCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgLy8gc2hvdyBzaG93RGlzcGxheSB2YWx1ZSBiYXNlZCBvbiBjaHJvbWUgc3RvcmFnZVxuICAgICAgICB2YXIgc2hhcmVSZXNwb25zZXNWYWwgPSBcIm9uXCI7XG4gICAgICAgIGlmICgnc2hhcmVSZXNwb25zZXMnIGluIHJlc3VsdCAmJiByZXN1bHQuc2hhcmVSZXNwb25zZXMgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gcmVzdWx0LnNoYXJlUmVzcG9uc2VzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2hhcmVSZXNwb25zZXNWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVJlc3BvbnNlczogXCJvblwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNoYXJlUmVzcG9uc2VzVmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLmlubmVySFRNTCA9IFwic2hhcmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVSZXNwb25zZXNWYWw7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUmVzcG9uc2VzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciBzaGFyZVJlc3BvbnNlc1ZhbCA9IHJlc3VsdC5zaGFyZVJlc3BvbnNlcztcbiAgICAgICAgICAgICAgICBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gXCJvZmZcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgICAgICAgICBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib25cIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVSZXNwb25zZXM6IHNoYXJlUmVzcG9uc2VzVmFsIH0pO1xuICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLmlubmVySFRNTCA9IFwic2hhcmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVSZXNwb25zZXNWYWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNoYXJlUmVzcG9uc2VzKTtcbiAgICB9KTtcbiAgICBwb3BvdmVyLmFwcGVuZENoaWxkKHRvZ2dsZUJveCk7XG4gICAgLy8gbG9hZCBpbiB0aGUgc3VnZ2VzdGlvbnNcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydwcm9tcHRzJywgJ3Nob3dEaXNwbGF5J10sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKCdzaG93RGlzcGxheScgaW4gcmVzdWx0ICYmIHJlc3VsdC5zaG93RGlzcGxheSA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIHZhciBwcm9tcHREaWN0ID0ge307XG4gICAgICAgICAgICBpZiAocmVzdWx0LnByb21wdHMpIHtcbiAgICAgICAgICAgICAgICBwcm9tcHREaWN0ID0gSlNPTi5wYXJzZShyZXN1bHQucHJvbXB0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJvbXB0TWF0Y2hMaXN0ID0gW107XG4gICAgICAgICAgICB2YXIgcHJvbXB0VGV4dExpc3QgPSBwcm9tcHRUZXh0LnNwbGl0KCcgJyk7XG4gICAgICAgICAgICB2YXIgYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHNvcnQsIHJldHVybnMgb2xkZXN0IC0tPiBuZXdlc3RcbiAgICAgICAgICAgIHZhciBzb3J0ZWRQcm9tcHRMaXN0ID0gT2JqZWN0LmVudHJpZXMocHJvbXB0RGljdCkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhWzFdWydsYXN0VXNlZCddIC0gYlsxXVsnbGFzdFVzZWQnXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzb3J0ZWQgcHJvbXB0IGxpc3Q6IFwiLCBzb3J0ZWRQcm9tcHRMaXN0KTtcbiAgICAgICAgICAgIC8vIHJldHVybiB0b3AgTiByZXN1bHRzXG4gICAgICAgICAgICB2YXIgcmV0dXJuVG9wTiA9IDg7XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBba2V5LCB2YWx1ZV0gb2Ygc29ydGVkUHJvbXB0TGlzdC5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgICAgICBhZGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBwcm9tcHRUZXh0TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAod29yZCAmJiB3b3JkICE9IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd29yZElkeCA9IGtleS5pbmRleE9mKHdvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRJZHggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYm9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGtleS5zdWJzdHJpbmcoMCwgd29yZElkeCkgKyBcIjxiPlwiICsga2V5LnN1YnN0cmluZyh3b3JkSWR4LCB3b3JkSWR4ICsgd29yZC5sZW5ndGgpICsgXCI8L2I+XCIgKyBrZXkuc3Vic3RyaW5nKHdvcmRJZHggKyB3b3JkLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdE1hdGNoTGlzdC5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXIgPj0gcmV0dXJuVG9wTikge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBjb3VudGVyIGlzIDwgcmV0dXJuVG9wTiwgcmV0dXJuIHJldHVyblRvcE4gLSBjb3VudGVyIGZyb20gREJcbiAgICAgICAgICAgIC8vIGdldCBhIGxpc3QgYmFzZWQgb24gd29yZHMsIGFuZCBqdXN0IGtlZXAgb24gYWRqdXN0aW5nIHRoYXQgbGlzdD9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHJvbXB0TWF0Y2hsaXN0OiBcIiwgcHJvbXB0TWF0Y2hMaXN0KTtcbiAgICAgICAgICAgIC8vIHZhciBhZGRpdGlvbmFsUHJvbXB0c05lZWRlZCA9IHJldHVyblRvcE4gLSBjb3VudGVyXG4gICAgICAgICAgICB2YXIgYWRkaXRpb25hbFByb21wdHNOZWVkZWQgPSAyO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb29raW5nIGZvcjogXCIsIGFkZGl0aW9uYWxQcm9tcHRzTmVlZGVkKTtcbiAgICAgICAgICAgIC8vIHZhciBzZWFyY2hRdWVyeSA9IHByb21wdFRleHRcbiAgICAgICAgICAgIHZhciBzZWFyY2hRdWVyeSA9IFwiU3BhaW4gY2FwaXRhbFwiO1xuICAgICAgICAgICAgaWYgKGFkZGl0aW9uYWxQcm9tcHRzTmVlZGVkID4gMCkge1xuICAgICAgICAgICAgICAgIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjkwOTAvaW5zdGFuY2UvZ2V0RmlsdGVyZWQ/c2VhcmNoPSR7c2VhcmNoUXVlcnl9JmxpbWl0PSR7YWRkaXRpb25hbFByb21wdHNOZWVkZWR9YClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKERCcHJvbXB0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRCUHJvbXB0czogXCIsIERCcHJvbXB0cyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNwbGl0IHJlcyBhY2NvcmRpbmdseVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IERCcHJvbXB0IG9mIERCcHJvbXB0cy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxEQnByb21wdCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQnByb21wdC5wcm9tcHQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnN3ZXJcIjogREJwcm9tcHQuYW5zd2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVzYWdlQ291bnRcIjogREJwcm9tcHQudXNhZ2VDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0TWF0Y2hMaXN0LnB1c2goYWRkaXRpb25hbERCcHJvbXB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgREJwcm9tcHRzIHRvIHByb21wdE1hdGNobGlzdFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhFUkUgSVMgVEhFIFVQREFURUQgUFJPTVBUIE1BVENIIExJU1Q6IFwiLCBwcm9tcHRNYXRjaExpc3QpO1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY29tYmluZWQgREIgYW5kIGxvY2FsIHByb21wdHMgdG8gcG9wb3ZlclxuICAgICAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5hZGRQcm9tcHRMaXN0KSh0ZXh0Ym94LCBwcm9tcHRNYXRjaExpc3QsIHBvcG92ZXIpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IHdlIGN1cnJlbnRseSBjYW5ub3QgYWNjZXNzIHRoZSBzaGFyZWQgZGF0YWJhc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0TGlzdCkodGV4dGJveCwgcHJvbXB0TWF0Y2hMaXN0LCBwb3BvdmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vIG5lZWQgZm9yIERCXG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0TGlzdCkodGV4dGJveCwgcHJvbXB0TWF0Y2hMaXN0LCBwb3BvdmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzdWdnZXN0aW9uQm94RWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3N1Z2dlc3Rpb25Cb3hcIik7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94RWxlbWVudHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcG9wb3Zlci5pZCA9IFwicG9wb3ZlclwiO1xuICAgIHJldHVybiBwb3BvdmVyO1xufTtcbmV4cG9ydHMuZ2V0UG9wb3ZlciA9IGdldFBvcG92ZXI7XG5jb25zdCBhZGRQcm9tcHRMaXN0ID0gKHRleHRib3gsIHByb21wdE1hdGNoTGlzdCwgcG9wb3ZlcikgPT4ge1xuICAgIGZvciAoY29uc3QgW3Byb21wdCwgdmFsXSBvZiBwcm9tcHRNYXRjaExpc3QpIHtcbiAgICAgICAgaWYgKHRleHRib3gudmFsdWUgIT0gcHJvbXB0LnJlcGxhY2VBbGwoXCI8Yj5cIiwgXCJcIikucmVwbGFjZUFsbChcIjwvYj5cIiwgXCJcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25Cb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5pZCA9IFwic3VnZ2VzdGlvbkJveFwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLnBhZGRpbmcgPSBcIjEwcHhcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIuMzc1cmVtXCI7XG4gICAgICAgICAgICBjb25zdCBpY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGljb25EaXYuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgICAgIGNvbnN0IHRleHRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGNvbnN0IHRleHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5vdmVyZmxvd1kgPSBcInNjcm9sbFwiO1xuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgIGNvbnN0IGFuc3dlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIxNXB4XCI7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3dYID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5vdmVyZmxvd1kgPSBcInNjcm9sbFwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LmlubmVySFRNTCA9IHZhbC5hbnN3ZXI7XG4gICAgICAgICAgICB0ZXh0RGl2LmlubmVySFRNTCA9IHByb21wdDtcbiAgICAgICAgICAgIGlmIChcImxhc3RVc2VkXCIgaW4gdmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gZnJvbSBsb2NhbFxuICAgICAgICAgICAgICAgIGljb25EaXYuaW5uZXJIVE1MID0gXCLwn5WTXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBmcm9tIERCXG4gICAgICAgICAgICAgICAgaWNvbkRpdi5pbm5lckhUTUwgPSBcIvCflI1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMTI1cHhcIjtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIxMjVweFwiO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gub25tb3VzZWxlYXZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICAgICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1RleHQgPSBwcm9tcHQucmVwbGFjZUFsbChcIjxiPlwiLCBcIlwiKS5yZXBsYWNlQWxsKFwiPC9iPlwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dGJveC52YWx1ZSA9IG5ld1RleHQ7XG4gICAgICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLmVkaXRQcm9tcHRUZXh0KShuZXdUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEucmVsb2FkUG9wb3ZlcikodGV4dGJveCwgbmV3VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGV4dFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGV4dERpdik7XG4gICAgICAgICAgICB0ZXh0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChhbnN3ZXJEaXYpO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZChpY29uRGl2KTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guYXBwZW5kQ2hpbGQodGV4dFdyYXBwZXJEaXYpO1xuICAgICAgICAgICAgaWYgKCEoXCJsYXN0VXNlZFwiIGluIHZhbCkpIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgdXNhZ2UgY291bnRcbiAgICAgICAgICAgICAgICBjb25zdCB1c2FnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgdXNhZ2VEaXYuc3R5bGUubWFyZ2luTGVmdCA9IFwiMTBweFwiO1xuICAgICAgICAgICAgICAgIHVzYWdlRGl2LmlubmVySFRNTCA9IFwi4piFIFwiICsgdmFsLnVzYWdlQ291bnQ7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZCh1c2FnZURpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb3BvdmVyLmFwcGVuZENoaWxkKHN1Z2dlc3Rpb25Cb3gpO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydHMuYWRkUHJvbXB0TGlzdCA9IGFkZFByb21wdExpc3Q7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vY29udGVudFNjcmlwdC9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lclwiKTtcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgIHN3aXRjaCAocmVxdWVzdC5hY3Rpb24pIHtcbiAgICAgICAgY2FzZSBcIndlYnNpdGUgbG9hZGVkXCI6XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIpKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlKHsgcmVzdWx0OiBcInN1Y2Nlc3NcIiB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9