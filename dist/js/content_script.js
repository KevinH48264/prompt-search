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
            var additionalPromptsNeeded = returnTopN - counter;
            // var additionalPromptsNeeded = 2
            console.log("looking for: ", additionalPromptsNeeded);
            var searchQuery = promptText;
            // var searchQuery = "Spain capital"
            if (additionalPromptsNeeded > 0) {
                fetch(`http://localhost:9090/instance/getFiltered?search=${searchQuery}&limit=${additionalPromptsNeeded}`)
                    .then((res) => res.json())
                    .then((DBprompts) => {
                    // getting responses from DB
                    for (const DBprompt of DBprompts.instance) {
                        var DBpromptText = DBprompt.prompt;
                        for (const word of promptTextList) {
                            if (word && word != " ") {
                                var wordIdx = DBpromptText.indexOf(word);
                                // add bold
                                DBpromptText = DBpromptText.substring(0, wordIdx) + "<b>" + DBpromptText.substring(wordIdx, wordIdx + word.length) + "</b>" + DBpromptText.substring(wordIdx + word.length);
                            }
                        }
                        var additionalDBprompt = [
                            DBpromptText, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7Ozs7Ozs7VUNsV3JCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0NBQWtDLG1CQUFPLENBQUMsK0ZBQXlDO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L2FkZFByb21wdFNlYXJjaExpc3RlbmVyLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvbnRlbnRTY3JpcHQvcG9wb3Zlci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50X3NjcmlwdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5lZGl0UHJvbXB0VGV4dCA9IGV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IGV4cG9ydHMuaGlkZVBvcG92ZXIgPSBleHBvcnRzLnNob3dQb3BvdmVyID0gZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGV4cG9ydHMuc2F2ZVByb21wdCA9IGV4cG9ydHMuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSB2b2lkIDA7XG5jb25zdCBwb3BvdmVyXzEgPSByZXF1aXJlKFwiLi9wb3BvdmVyXCIpO1xuLy8gaW1wb3J0IHsgZ2V0UG9wb3ZlckFueXdoZXJlIH0gZnJvbSBcIi4vcG9wb3ZlckFueXdoZXJlXCI7XG4vLyBqdXN0IGZvciBjb25zdGFudGx5IGNoZWNraW5nIHdoYXQncyB0aGUgbGF0ZXN0IGFuc3dlciBkaXZcbnZhciBsYXRlc3RBbnN3ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xudmFyIHByb21wdFRleHQgPSBcIlwiO1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJTdGFydGluZyBDU1MgUmVsb2FkIEVkaXRzIVwiKTtcbiAgICAvLyBUT0RPOiBmaXggc28gdGhhdCBpdCBhdXRvbWF0aWNhbGx5IHBvcHMgdXAgd2hlbiB5b3UgbmF2aWdhdGUgdG8gYSBwYWdlXG4gICAgLy8gUHJvYmxlbTogZXZlbiBpZiBVUkwgY2hhbmdlcywgdGhlIHRleHRhcmVhIGRvZXNuJ3QgYWx3YXlzIGNoYW5nZSBpbW1lZGlhdGVseVxuICAgIC8vIEN1cnJlbnQgc2NlbmFyaW8sIHVzZXIgaGFzIHRvIGNsaWNrIG9yIHN0YXJ0IHR5cGluZ1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIHRleHRhcmVhYm94ID0gaXRlbTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYWJveC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaG93IHRvIGZpZ3VyZSBvdXQgd2hlbiBzb21ldGhpbmcgaXMgY2xpY2tlZFxuICAgICAgICAvLyBzYXZlIHByb21wdCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgIC8vIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIHctZnVsbCBweS0yIGZsZXgtZ3JvdyBtZDpweS0zIG1kOnBsLTQgcmVsYXRpdmUgYm9yZGVyIGJvcmRlci1ibGFjay8xMCBiZy13aGl0ZSBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCBkYXJrOnRleHQtd2hpdGUgZGFyazpiZy1ncmF5LTcwMCByb3VuZGVkLW1kIHNoYWRvdy1bMF8wXzEwcHhfcmdiYSgwLDAsMCwwLjEwKV0gZGFyazpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMCwwLDAsMC4xMCldJylcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Fic29sdXRlIHAtMSByb3VuZGVkLW1kIHRleHQtZ3JheS01MDAgYm90dG9tLTEuNSByaWdodC0xIG1kOmJvdHRvbS0yLjUgbWQ6cmlnaHQtMiBob3ZlcjpiZy1ncmF5LTEwMCBkYXJrOmhvdmVyOnRleHQtZ3JheS00MDAgZGFyazpob3ZlcjpiZy1ncmF5LTkwMCBkaXNhYmxlZDpob3ZlcjpiZy10cmFuc3BhcmVudCBkYXJrOmRpc2FibGVkOmhvdmVyOmJnLXRyYW5zcGFyZW50Jyk7XG4gICAgICAgIGlmIChidXR0b25bMF0uY29udGFpbnMoaXRlbSkgfHwgYnV0dG9uWzBdID09IGl0ZW0pIHtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnNhdmVQcm9tcHQpKHByb21wdFRleHQpO1xuICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9KSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8ganVzdCBtZXNzaW5nIHdpdGggaWYgaXQgd29ya3Mgb24gYW55IHBsYWNlXG4gICAgICAgIC8vIHZhciB0YXJnZXRFbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAvLyB2YXIgcGFyZW50RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ/LnBhcmVudE5vZGU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldEVsZW1lbnQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwYXJlbnRFbGVtZW50KTtcbiAgICAgICAgLy8gaWYgKHBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgLy8gICBnZXRQb3BvdmVyQW55d2hlcmUodGFyZ2V0RWxlbWVudCBhcyBIVE1MRWxlbWVudCwgcHJvbXB0VGV4dCwgdGFyZ2V0RWxlbWVudCBhcyBIVE1MRWxlbWVudClcbiAgICAgICAgLy8gICAvLyBMQVRFUjogbmVlZCB0byBhZGQgYXR0cmlidXRlcywgcmVtb3ZlIHBvcHVwcyBhcyB0aGV5IGNvbWUgYWxvbmcgbGlrZSByZWxvYWQgcG9wdXBcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBtZXNzaW5nIGFyb3VuZCBlbmRzXG4gICAgICAgIHZhciBpdGVtID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIHNhdmUgdG8gbG9jYWwgY2hyb21lIHN0b3JhZ2VcbiAgICAgICAgICAgIHZhciB0ZXh0YXJlYWJveCA9IGl0ZW07XG4gICAgICAgICAgICBpZiAodGV4dGFyZWFib3gudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5ICE9IFwiQmFja3NwYWNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlICsgZXZlbnQua2V5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlLnN1YnN0cmluZygwLCB0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBvbmx5IHJlbG9hZCBpZiB5b3UndmUgdHlwZWQgYXQgbGVhc3Qgb25lIHdvcmQ/XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB5b3UgaGl0IGJhY2tzcGFjZSBvbiBhIHNwYWNlIC8gZGVsZXRlIGEgd29yZCBvciB5b3UgY2xlYXJlZCBldmVyeXRoaW5nIG91dFxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIkJhY2tzcGFjZVwiICYmICh0ZXh0YXJlYWJveC52YWx1ZVt0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggLSAxXSA9PSBcIiBcIiB8fCB0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggPT0gMSkpIHtcbiAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzYXZlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnNhdmVQcm9tcHQpKHByb21wdFRleHQpO1xuICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5oaWRlUG9wb3ZlcikoKTtcbiAgICAgICAgfVxuICAgIH0pKTtcbn07XG5leHBvcnRzLmFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXI7XG4vLyBzYXZlIHByb21wdFxuY29uc3Qgc2F2ZVByb21wdCA9IChwcm9tcHRUZXh0KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAvLyBzaGFyZVByb21wdHMgdGVtcG9yYXJpbHkgbWVhbnMgc2F2ZSBwcm9tcHRzIGFuZCByZXN1bHRzIGxvY2FsbHlcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zaGFyZVByb21wdHMgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICAvLyBNYXliZSBjcmVhdGUgYW4gYWRkIHRvIHN0b3JhZ2UgYW5kIGhhdmUgaXQgYXQgdGhlIGVuZCBvZiBjaGVja0ZpbmlzaEFuc3dlcmluZygpP1xuICAgICAgICAgICAgLy8gcmV0cmlldmluZyBmcm9tIGxvY2FsIHN0b3JhZ2UsIGNhbiBhbHNvIGp1c3Qgc3RvcmUgYXMgYSB2YXJpYWJsZSBoZXJlIGlmIHdlIHNlcmlvdXNseSBjYW5ub3Qgd2FpdFxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdwcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9tcHREaWN0O1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucHJvbXB0cykge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0ID0gSlNPTi5wYXJzZShyZXN1bHQucHJvbXB0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0ID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmNoZWNrRmluaXNoQW5zd2VyaW5nKShwcm9tcHREaWN0LCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XG59KTtcbmV4cG9ydHMuc2F2ZVByb21wdCA9IHNhdmVQcm9tcHQ7XG5jb25zdCBjaGVja0ZpbmlzaEFuc3dlcmluZyA9IChwcm9tcHREaWN0LCBwcm9tcHRUZXh0KSA9PiB7XG4gICAgLy8gZm9yIHRyYWNraW5nIHdoZW4gdGhlIGJ1dHRvbiBhcHBlYXJzLCBzaWduaWZ5aW5nIGl0IGlzIGRvbmUgYW5zd2VyaW5nXG4gICAgdmFyIG9ic2VydmVyQnV0dG9uID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGVkTm9kZSA9IG11dGF0aW9uLmFkZGVkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChhZGRlZE5vZGUudGFnTmFtZSA9PT0gXCJzdmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcnkgYmVjYXVzZSB0aGlzIHNlZW1zIHRvIGJlIHRoZSBvbmx5IGVsZW1lbnQgdGhhdCB1cGRhdGVzIHByb3Blcmx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBBbnN3ZXJEaXZUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ19fbmV4dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wTWFpbiA9IHRlbXBBbnN3ZXJEaXZUZXh0LmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBEaXZDb2xsZWN0aW9uID0gdGVtcE1haW4uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhdGVzdEFuc3dlckRpdlRlbXBDb2xsZWN0aW9uID0gdGVtcERpdkNvbGxlY3Rpb24uY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF0ZXN0QW5zd2VyRGl2VGVtcCA9IGxhdGVzdEFuc3dlckRpdlRlbXBDb2xsZWN0aW9uW3RlbXBEaXZDb2xsZWN0aW9uLmNoaWxkTm9kZXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFuc3dlckRpdlRleHQgPSBsYXRlc3RBbnN3ZXJEaXZUZW1wID09PSBudWxsIHx8IGxhdGVzdEFuc3dlckRpdlRlbXAgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGxhdGVzdEFuc3dlckRpdlRlbXAuY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvZGUgdG8gYWRkIHRoZSBhbnN3ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0W3Byb21wdFRleHQudHJpbSgpXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXJEaXZUZXh0LmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNhZ2VDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVzZWQ6IChuZXcgRGF0ZSgpKS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHByb21wdHM6IEpTT04uc3RyaW5naWZ5KHByb21wdERpY3QpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRkZWQgdGhpcyBwcm9tcHQ6IFwiLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZWQgUHJvbXB0IERpY3Q6IFwiLCBwcm9tcHREaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChfYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdERpY3RbcHJvbXB0VGV4dF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcjogXCI8cD5VbmF2YWlsYWJsZTxwPlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2FnZUNvdW50OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VXNlZDogKG5ldyBEYXRlKCkpLnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcHJvbXB0czogSlNPTi5zdHJpbmdpZnkocHJvbXB0RGljdCkgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgIH0pO1xuICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgIH07XG4gICAgdmFyIHRleHRib3hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZsZXggZmxleC1jb2wgdy1mdWxsIHB5LTIgZmxleC1ncm93IG1kOnB5LTMgbWQ6cGwtNCByZWxhdGl2ZSBib3JkZXIgYm9yZGVyLWJsYWNrLzEwIGJnLXdoaXRlIGRhcms6Ym9yZGVyLWdyYXktOTAwLzUwIGRhcms6dGV4dC13aGl0ZSBkYXJrOmJnLWdyYXktNzAwIHJvdW5kZWQtbWQgc2hhZG93LVswXzBfMTBweF9yZ2JhKDAsMCwwLDAuMTApXSBkYXJrOnNoYWRvdy1bMF8wXzE1cHhfcmdiYSgwLDAsMCwwLjEwKV0nKVswXTtcbiAgICBvYnNlcnZlckJ1dHRvbi5vYnNlcnZlKHRleHRib3hFbCwgY29uZmlnKTtcbn07XG5leHBvcnRzLmNoZWNrRmluaXNoQW5zd2VyaW5nID0gY2hlY2tGaW5pc2hBbnN3ZXJpbmc7XG4vLyBzaG93IHBvcG92ZXJcbmNvbnN0IHNob3dQb3BvdmVyID0gKCkgPT4ge1xuICAgIHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdmVyXCIpO1xuICAgIGlmIChwKSB7XG4gICAgICAgIHAuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICBwLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgIH1cbn07XG5leHBvcnRzLnNob3dQb3BvdmVyID0gc2hvd1BvcG92ZXI7XG4vLyBoaWRlIHBvcG92ZXJcbmNvbnN0IGhpZGVQb3BvdmVyID0gKCkgPT4ge1xuICAgIHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdmVyXCIpO1xuICAgIC8vIFRPRE86IHB1dCBiYWNrIGFmdGVyIGRlYnVnZ2luZ1xuICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAvLyAgIGlmIChwKSB7XG4gICAgLy8gICAgIHAuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgLy8gICAgIHAuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIlxuICAgIC8vICAgfVxuICAgIC8vIH0sIDEwMCk7XG59O1xuZXhwb3J0cy5oaWRlUG9wb3ZlciA9IGhpZGVQb3BvdmVyO1xuLy8gbWFpbiBjb2RlIHRvIHNob3cgcG9wdXBcbmNvbnN0IHJlbG9hZFBvcG92ZXIgPSAodGV4dGJveCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIHZhciBfYTtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICBpZiAocCkge1xuICAgICAgICBwLnJlbW92ZSgpO1xuICAgIH1cbiAgICBwID0gKDAsIHBvcG92ZXJfMS5nZXRQb3BvdmVyKSh0ZXh0Ym94LCBwcm9tcHRUZXh0KTtcbiAgICB2YXIgdGV4dGJveFdyYXBwZXIgPSAoX2EgPSB0ZXh0Ym94LnBhcmVudEVsZW1lbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYXJlbnRFbGVtZW50O1xuICAgIHZhciB0ZXh0Ym94TWlkV3JhcHBlciA9IHRleHRib3gucGFyZW50RWxlbWVudDtcbiAgICB0ZXh0Ym94V3JhcHBlciA9PT0gbnVsbCB8fCB0ZXh0Ym94V3JhcHBlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGV4dGJveFdyYXBwZXIuaW5zZXJ0QmVmb3JlKHAsIHRleHRib3hNaWRXcmFwcGVyKTtcbiAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGV4dGJveCkge1xuICAgICAgICAoMCwgZXhwb3J0cy5zaG93UG9wb3ZlcikoKTtcbiAgICB9XG4gICAgLy8gdGV4dGJveCBpcyBjdXJyZW50bHkgYmVpbmcgY2hhbmdlZFxuICAgIGlmICh0ZXh0Ym94LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgdGV4dGJveC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbiAgICAvLyB0ZXh0Ym94IGhhcyBiZWVuIGNsaWNrZWQgYmFjayB0b1xuICAgIHRleHRib3gub25mb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKDAsIGV4cG9ydHMuc2hvd1BvcG92ZXIpKCk7XG4gICAgfTtcbiAgICAvLyB0ZXh0Ym94IGlzIGNsaWNrZWQgYXdheSwgZGlzbWlzcyBwb3BvdmVyXG4gICAgdGV4dGJveC5vbmJsdXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xuICAgIH07XG59O1xuZXhwb3J0cy5yZWxvYWRQb3BvdmVyID0gcmVsb2FkUG9wb3ZlcjtcbmNvbnN0IGVkaXRQcm9tcHRUZXh0ID0gKGVkaXQpID0+IHtcbiAgICBwcm9tcHRUZXh0ID0gZWRpdDtcbn07XG5leHBvcnRzLmVkaXRQcm9tcHRUZXh0ID0gZWRpdFByb21wdFRleHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRQcm9tcHRMaXN0ID0gZXhwb3J0cy5nZXRQb3BvdmVyID0gdm9pZCAwO1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL2FkZFByb21wdFNlYXJjaExpc3RlbmVyXCIpO1xuY29uc3QgZ2V0UG9wb3ZlciA9ICh0ZXh0Ym94LCBwcm9tcHRUZXh0KSA9PiB7XG4gICAgLy8gUG9wb3ZlciBlbGVtZW50XG4gICAgY29uc3QgcG9wb3ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcG9wb3Zlci5zdHlsZS53aWR0aCA9IHRleHRib3guc3R5bGUud2lkdGg7XG4gICAgcG9wb3Zlci5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICBwb3BvdmVyLnN0eWxlLnpJbmRleCA9IFwiMTBcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgIHBvcG92ZXIuc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIi4zNzVyZW1cIjtcbiAgICBwb3BvdmVyLnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmNvbG9yID0gXCJyZ2IoMjEwLCAyMTQsIDIxOClcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgIHBvcG92ZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgIHBvcG92ZXIuc3R5bGUuZmxleERpcmVjdGlvbiA9IFwiY29sdW1uLXJldmVyc2VcIjtcbiAgICAvLyBwb3BvdmVyLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAvLyBBZGQgdG9nZ2xlcyB0byBtZW51XG4gICAgY29uc3QgdG9nZ2xlQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0b2dnbGVCb3guc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5oZWlnaHQgPSBcIjUwcHhcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUucGFkZGluZyA9IFwiMTBweFwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIi4zNzVyZW1cIjtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3Nob3dEaXNwbGF5JywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBjb25zdCB0b2dnbGVTaG93RGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiMXJlbVwiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LmNsYXNzTmFtZSA9IFwidGVtcFwiO1xuICAgICAgICAvLyBzaG93IHNob3dEaXNwbGF5IHZhbHVlIGJhc2VkIG9uIGNocm9tZSBzdG9yYWdlXG4gICAgICAgIHZhciBzaG93RGlzcGxheVZhbCA9IFwib25cIjtcbiAgICAgICAgaWYgKCdzaG93RGlzcGxheScgaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IHJlc3VsdC5zaG93RGlzcGxheTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gXCJvblwiO1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hvd0Rpc3BsYXk6IFwib25cIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzaG93RGlzcGxheVZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgfVxuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5pbm5lckhUTUwgPSBcInNob3cgZGlzcGxheTogXCIgKyBzaG93RGlzcGxheVZhbDtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hvd0Rpc3BsYXknLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNob3dEaXNwbGF5VmFsID0gcmVzdWx0LnNob3dEaXNwbGF5O1xuICAgICAgICAgICAgICAgIGlmIChzaG93RGlzcGxheVZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0Rpc3BsYXlWYWwgPSBcIm9mZlwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzaG93RGlzcGxheVZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gXCJvblwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaG93RGlzcGxheTogc2hvd0Rpc3BsYXlWYWwgfSk7XG4gICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJzaG93IGRpc3BsYXk6IFwiICsgc2hvd0Rpc3BsYXlWYWw7XG4gICAgICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEucmVsb2FkUG9wb3ZlcikodGV4dGJveCwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNob3dEaXNwbGF5KTtcbiAgICB9KTtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlU2hhcmVQcm9tcHRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiMXJlbVwiO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMTBweFwiO1xuICAgICAgICAvLyBzaG93IHNob3dEaXNwbGF5IHZhbHVlIGJhc2VkIG9uIGNocm9tZSBzdG9yYWdlXG4gICAgICAgIHZhciBzaGFyZVByb21wdHNWYWwgPSBcIm9uXCI7XG4gICAgICAgIGlmICgnc2hhcmVQcm9tcHRzJyBpbiByZXN1bHQgJiYgKHJlc3VsdC5zaGFyZVByb21wdHMgPT0gJ29uJyB8fCByZXN1bHQuc2hhcmVQcm9tcHRzID09ICdvZmYnKSkge1xuICAgICAgICAgICAgc2hhcmVQcm9tcHRzVmFsID0gcmVzdWx0LnNoYXJlUHJvbXB0cztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNoYXJlUHJvbXB0c1ZhbCA9IFwib25cIjtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUHJvbXB0czogc2hhcmVQcm9tcHRzVmFsIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGFyZVByb21wdHNWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNoYXJlUHJvbXB0c1ZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5pbm5lckhUTUwgPSBcInNhdmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVQcm9tcHRzVmFsO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVQcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVTaGFyZVByb21wdHNWYWwgPSByZXN1bHQuc2hhcmVQcm9tcHRzO1xuICAgICAgICAgICAgICAgIGlmICh0b2dnbGVTaGFyZVByb21wdHNWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbCA9IFwib2ZmXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVQcm9tcHRzOiBcIm9mZlwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2dnbGVTaGFyZVByb21wdHNWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHNWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVQcm9tcHRzOiBcIm9uXCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5pbm5lckhUTUwgPSBcInNhdmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNoYXJlUHJvbXB0cyk7XG4gICAgfSk7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVJlc3BvbnNlcycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlU2hhcmVSZXNwb25zZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjFyZW1cIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMTBweFwiO1xuICAgICAgICAvLyBzaG93IHNob3dEaXNwbGF5IHZhbHVlIGJhc2VkIG9uIGNocm9tZSBzdG9yYWdlXG4gICAgICAgIHZhciBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib25cIjtcbiAgICAgICAgaWYgKCdzaGFyZVJlc3BvbnNlcycgaW4gcmVzdWx0ICYmIHJlc3VsdC5zaGFyZVJlc3BvbnNlcyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hhcmVSZXNwb25zZXNWYWwgPSByZXN1bHQuc2hhcmVSZXNwb25zZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib25cIjtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUmVzcG9uc2VzOiBcIm9uXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNoYXJlUmVzcG9uc2VzVmFsID09IFwib25cIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuaW5uZXJIVE1MID0gXCJzaGFyZSBwcm9tcHRzICYgcmVzdWx0czogXCIgKyBzaGFyZVJlc3BvbnNlc1ZhbDtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVSZXNwb25zZXMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNoYXJlUmVzcG9uc2VzVmFsID0gcmVzdWx0LnNoYXJlUmVzcG9uc2VzO1xuICAgICAgICAgICAgICAgIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVSZXNwb25zZXNWYWwgPSBcIm9mZlwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gXCJvblwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVJlc3BvbnNlczogc2hhcmVSZXNwb25zZXNWYWwgfSk7XG4gICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuaW5uZXJIVE1MID0gXCJzaGFyZSBwcm9tcHRzICYgcmVzdWx0czogXCIgKyBzaGFyZVJlc3BvbnNlc1ZhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVCb3guYXBwZW5kQ2hpbGQodG9nZ2xlU2hhcmVSZXNwb25zZXMpO1xuICAgIH0pO1xuICAgIHBvcG92ZXIuYXBwZW5kQ2hpbGQodG9nZ2xlQm94KTtcbiAgICAvLyBsb2FkIGluIHRoZSBzdWdnZXN0aW9uc1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ3Byb21wdHMnLCAnc2hvd0Rpc3BsYXknXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAoJ3Nob3dEaXNwbGF5JyBpbiByZXN1bHQgJiYgcmVzdWx0LnNob3dEaXNwbGF5ID09IFwib25cIikge1xuICAgICAgICAgICAgdmFyIHByb21wdERpY3QgPSB7fTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQucHJvbXB0cykge1xuICAgICAgICAgICAgICAgIHByb21wdERpY3QgPSBKU09OLnBhcnNlKHJlc3VsdC5wcm9tcHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9tcHRNYXRjaExpc3QgPSBbXTtcbiAgICAgICAgICAgIHZhciBwcm9tcHRUZXh0TGlzdCA9IHByb21wdFRleHQuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIHZhciBhZGQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gc29ydCwgcmV0dXJucyBvbGRlc3QgLS0+IG5ld2VzdFxuICAgICAgICAgICAgdmFyIHNvcnRlZFByb21wdExpc3QgPSBPYmplY3QuZW50cmllcyhwcm9tcHREaWN0KS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFbMV1bJ2xhc3RVc2VkJ10gLSBiWzFdWydsYXN0VXNlZCddO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNvcnRlZCBwcm9tcHQgbGlzdDogXCIsIHNvcnRlZFByb21wdExpc3QpO1xuICAgICAgICAgICAgLy8gcmV0dXJuIHRvcCBOIHJlc3VsdHNcbiAgICAgICAgICAgIHZhciByZXR1cm5Ub3BOID0gODtcbiAgICAgICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIFtrZXksIHZhbHVlXSBvZiBzb3J0ZWRQcm9tcHRMaXN0LnJldmVyc2UoKSkge1xuICAgICAgICAgICAgICAgIGFkZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHByb21wdFRleHRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3b3JkICYmIHdvcmQgIT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3b3JkSWR4ID0ga2V5LmluZGV4T2Yod29yZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZElkeCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBib2xkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0ga2V5LnN1YnN0cmluZygwLCB3b3JkSWR4KSArIFwiPGI+XCIgKyBrZXkuc3Vic3RyaW5nKHdvcmRJZHgsIHdvcmRJZHggKyB3b3JkLmxlbmd0aCkgKyBcIjwvYj5cIiArIGtleS5zdWJzdHJpbmcod29yZElkeCArIHdvcmQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0TWF0Y2hMaXN0LnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgICAgICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY291bnRlciA+PSByZXR1cm5Ub3BOKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGNvdW50ZXIgaXMgPCByZXR1cm5Ub3BOLCByZXR1cm4gcmV0dXJuVG9wTiAtIGNvdW50ZXIgZnJvbSBEQlxuICAgICAgICAgICAgLy8gZ2V0IGEgbGlzdCBiYXNlZCBvbiB3b3JkcywgYW5kIGp1c3Qga2VlcCBvbiBhZGp1c3RpbmcgdGhhdCBsaXN0P1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcm9tcHRNYXRjaGxpc3Q6IFwiLCBwcm9tcHRNYXRjaExpc3QpO1xuICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxQcm9tcHRzTmVlZGVkID0gcmV0dXJuVG9wTiAtIGNvdW50ZXI7XG4gICAgICAgICAgICAvLyB2YXIgYWRkaXRpb25hbFByb21wdHNOZWVkZWQgPSAyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxvb2tpbmcgZm9yOiBcIiwgYWRkaXRpb25hbFByb21wdHNOZWVkZWQpO1xuICAgICAgICAgICAgdmFyIHNlYXJjaFF1ZXJ5ID0gcHJvbXB0VGV4dDtcbiAgICAgICAgICAgIC8vIHZhciBzZWFyY2hRdWVyeSA9IFwiU3BhaW4gY2FwaXRhbFwiXG4gICAgICAgICAgICBpZiAoYWRkaXRpb25hbFByb21wdHNOZWVkZWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6OTA5MC9pbnN0YW5jZS9nZXRGaWx0ZXJlZD9zZWFyY2g9JHtzZWFyY2hRdWVyeX0mbGltaXQ9JHthZGRpdGlvbmFsUHJvbXB0c05lZWRlZH1gKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoREJwcm9tcHRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdldHRpbmcgcmVzcG9uc2VzIGZyb20gREJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBEQnByb21wdCBvZiBEQnByb21wdHMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBEQnByb21wdFRleHQgPSBEQnByb21wdC5wcm9tcHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdvcmQgb2YgcHJvbXB0VGV4dExpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZCAmJiB3b3JkICE9IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3b3JkSWR4ID0gREJwcm9tcHRUZXh0LmluZGV4T2Yod29yZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBib2xkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERCcHJvbXB0VGV4dCA9IERCcHJvbXB0VGV4dC5zdWJzdHJpbmcoMCwgd29yZElkeCkgKyBcIjxiPlwiICsgREJwcm9tcHRUZXh0LnN1YnN0cmluZyh3b3JkSWR4LCB3b3JkSWR4ICsgd29yZC5sZW5ndGgpICsgXCI8L2I+XCIgKyBEQnByb21wdFRleHQuc3Vic3RyaW5nKHdvcmRJZHggKyB3b3JkLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxEQnByb21wdCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQnByb21wdFRleHQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnN3ZXJcIjogREJwcm9tcHQuYW5zd2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVzYWdlQ291bnRcIjogREJwcm9tcHQudXNhZ2VDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0TWF0Y2hMaXN0LnB1c2goYWRkaXRpb25hbERCcHJvbXB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgREJwcm9tcHRzIHRvIHByb21wdE1hdGNobGlzdFxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkhFUkUgSVMgVEhFIFVQREFURUQgUFJPTVBUIE1BVENIIExJU1Q6IFwiLCBwcm9tcHRNYXRjaExpc3QpO1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY29tYmluZWQgREIgYW5kIGxvY2FsIHByb21wdHMgdG8gcG9wb3ZlclxuICAgICAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5hZGRQcm9tcHRMaXN0KSh0ZXh0Ym94LCBwcm9tcHRNYXRjaExpc3QsIHBvcG92ZXIpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IHdlIGN1cnJlbnRseSBjYW5ub3QgYWNjZXNzIHRoZSBzaGFyZWQgZGF0YWJhc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0TGlzdCkodGV4dGJveCwgcHJvbXB0TWF0Y2hMaXN0LCBwb3BvdmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vIG5lZWQgZm9yIERCXG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0TGlzdCkodGV4dGJveCwgcHJvbXB0TWF0Y2hMaXN0LCBwb3BvdmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzdWdnZXN0aW9uQm94RWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3N1Z2dlc3Rpb25Cb3hcIik7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94RWxlbWVudHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcG9wb3Zlci5pZCA9IFwicG9wb3ZlclwiO1xuICAgIHJldHVybiBwb3BvdmVyO1xufTtcbmV4cG9ydHMuZ2V0UG9wb3ZlciA9IGdldFBvcG92ZXI7XG5jb25zdCBhZGRQcm9tcHRMaXN0ID0gKHRleHRib3gsIHByb21wdE1hdGNoTGlzdCwgcG9wb3ZlcikgPT4ge1xuICAgIGZvciAoY29uc3QgW3Byb21wdCwgdmFsXSBvZiBwcm9tcHRNYXRjaExpc3QpIHtcbiAgICAgICAgaWYgKHRleHRib3gudmFsdWUgIT0gcHJvbXB0LnJlcGxhY2VBbGwoXCI8Yj5cIiwgXCJcIikucmVwbGFjZUFsbChcIjwvYj5cIiwgXCJcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25Cb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5pZCA9IFwic3VnZ2VzdGlvbkJveFwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLnBhZGRpbmcgPSBcIjEwcHhcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIuMzc1cmVtXCI7XG4gICAgICAgICAgICBjb25zdCBpY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGljb25EaXYuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgICAgIGNvbnN0IHRleHRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGNvbnN0IHRleHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5vdmVyZmxvd1kgPSBcInNjcm9sbFwiO1xuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgIGNvbnN0IGFuc3dlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIxNXB4XCI7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3dYID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5vdmVyZmxvd1kgPSBcInNjcm9sbFwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LmlubmVySFRNTCA9IHZhbC5hbnN3ZXI7XG4gICAgICAgICAgICB0ZXh0RGl2LmlubmVySFRNTCA9IHByb21wdDtcbiAgICAgICAgICAgIGlmIChcImxhc3RVc2VkXCIgaW4gdmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gZnJvbSBsb2NhbFxuICAgICAgICAgICAgICAgIGljb25EaXYuaW5uZXJIVE1MID0gXCLwn5WTXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBmcm9tIERCXG4gICAgICAgICAgICAgICAgaWNvbkRpdi5pbm5lckhUTUwgPSBcIvCflI1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMTI1cHhcIjtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIxMjVweFwiO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gub25tb3VzZWxlYXZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICAgICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1RleHQgPSBwcm9tcHQucmVwbGFjZUFsbChcIjxiPlwiLCBcIlwiKS5yZXBsYWNlQWxsKFwiPC9iPlwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dGJveC52YWx1ZSA9IG5ld1RleHQ7XG4gICAgICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLmVkaXRQcm9tcHRUZXh0KShuZXdUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEucmVsb2FkUG9wb3ZlcikodGV4dGJveCwgbmV3VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGV4dFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGV4dERpdik7XG4gICAgICAgICAgICB0ZXh0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChhbnN3ZXJEaXYpO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZChpY29uRGl2KTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guYXBwZW5kQ2hpbGQodGV4dFdyYXBwZXJEaXYpO1xuICAgICAgICAgICAgaWYgKCEoXCJsYXN0VXNlZFwiIGluIHZhbCkpIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgdXNhZ2UgY291bnRcbiAgICAgICAgICAgICAgICBjb25zdCB1c2FnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgdXNhZ2VEaXYuc3R5bGUubWFyZ2luTGVmdCA9IFwiMTBweFwiO1xuICAgICAgICAgICAgICAgIHVzYWdlRGl2LmlubmVySFRNTCA9IFwi4piFIFwiICsgdmFsLnVzYWdlQ291bnQ7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZCh1c2FnZURpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb3BvdmVyLmFwcGVuZENoaWxkKHN1Z2dlc3Rpb25Cb3gpO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydHMuYWRkUHJvbXB0TGlzdCA9IGFkZFByb21wdExpc3Q7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vY29udGVudFNjcmlwdC9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lclwiKTtcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgIHN3aXRjaCAocmVxdWVzdC5hY3Rpb24pIHtcbiAgICAgICAgY2FzZSBcIndlYnNpdGUgbG9hZGVkXCI6XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIpKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlKHsgcmVzdWx0OiBcInN1Y2Nlc3NcIiB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9