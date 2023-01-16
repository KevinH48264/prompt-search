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
exports.reloadPopover = exports.hidePopover = exports.showPopover = exports.checkFinishAnswering = exports.savePrompt = exports.restartLatestAnswerDiv = exports.addPromptSearchListener = void 0;
const popover_1 = __webpack_require__(/*! ./popover */ "./src/contentScript/popover.ts");
// just for constantly checking what's the latest answer div
var latestAnswerDiv = document.createElement("div");
var config = {
    childList: true,
    subtree: true,
    attributes: true,
};
const addPromptSearchListener = () => {
    console.log("Starting CSS Reload Edits!");
    var promptText = "";
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
            if (event.key == "Backspace" && textareabox.value[textareabox.value.length - 1] == " ") {
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
    // reload observer too
    // var textboxEl = document.getElementsByClassName('overflow-hidden w-full h-full relative')[0] as Node
    // var textboxEl = document.getElementsByClassName('flex flex-col items-center text-sm h-full dark:bg-gray-800')[0] as Node
    var textboxEl = document.getElementsByClassName('overflow-hidden w-full h-full relative')[0];
    (0, exports.restartLatestAnswerDiv)(textboxEl);
};
exports.addPromptSearchListener = addPromptSearchListener;
const restartLatestAnswerDiv = (checkElement) => {
    console.log("restarting");
    // for tracking the answer
    var observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            console.log("mutation: ", mutation);
            if (mutation.type === "childList") {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode = mutation.addedNodes[i];
                    if (addedNode.className == 'w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]') {
                        latestAnswerDiv = addedNode;
                        console.log("UPDATE latest answer div: ", latestAnswerDiv);
                    }
                }
            }
        }
        ;
    });
    var textboxEl = document.getElementsByClassName('overflow-hidden w-full h-full relative')[0];
    observer.observe(textboxEl, config);
};
exports.restartLatestAnswerDiv = restartLatestAnswerDiv;
// save prompt
const savePrompt = (promptText) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("saving prompt!");
    var promptDict = {};
    (0, exports.checkFinishAnswering)(promptDict, promptText);
    // Maybe create an add to storage and have it at the end of checkFinishAnswering()?
    // retrieving from local storage, can also just store as a variable here if we seriously cannot wait
    chrome.storage.local.get('prompts', function (result) {
        if (result.prompts) {
            promptDict = JSON.parse(result.prompts);
        }
        // default addition to local storage
        promptDict[promptText] = {
            answer: "<p>Unavailable<p>",
            usageCount: 1,
            lastUsed: new Date()
        };
        chrome.storage.local.set({ prompts: JSON.stringify(promptDict) });
        // console.log("end prompts from default add: ", promptDict)
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
                            console.log("latestAnswerDiv upon computing", latestAnswerDiv);
                            var answerDivText = latestAnswerDiv.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0];
                            // code to add the answer
                            promptDict[promptText] = {
                                answer: answerDivText.innerHTML,
                                usageCount: 1,
                                lastUsed: new Date()
                            };
                            chrome.storage.local.set({ prompts: JSON.stringify(promptDict) });
                            console.log("added custom prompt, updated dict: ", promptDict);
                        }
                        catch (_a) {
                            console.log("something like a div didn't have enough nodes or something");
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
    // if (p) {
    //   p.style.visibility = "hidden";
    //   p.style.height = "0px"
    // }
};
exports.hidePopover = hidePopover;
// main code to show popup
const reloadPopover = (textbox, promptText) => {
    var _a;
    // console.log("RELOADING POPOVER")
    var p = document.getElementById("popover");
    if (p) {
        p.remove();
    }
    p = (0, popover_1.getPopover)(textbox, promptText);
    var textboxWrapper = (_a = textbox.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    var textboxMidWrapper = textbox.parentElement;
    textboxWrapper === null || textboxWrapper === void 0 ? void 0 : textboxWrapper.insertBefore(p, textboxMidWrapper);
    p.style.visibility = "visible";
    var textboxEl = textbox.ownerDocument.getElementsByClassName('overflow-hidden w-full h-full relative')[0];
    (0, exports.restartLatestAnswerDiv)(textboxEl);
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
exports.getPopover = void 0;
const addPromptSearchListener_1 = __webpack_require__(/*! ./addPromptSearchListener */ "./src/contentScript/addPromptSearchListener.ts");
const getPopover = (textbox, promptText) => {
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
    popover.style.flexDirection = "column";
    // popover.style.overflow = "hidden";
    // load in the suggestions
    chrome.storage.local.get('prompts', function (result) {
        var promptDict = {};
        if (result.prompts) {
            promptDict = JSON.parse(result.prompts);
        }
        // console.log("IN GETPOPOVER, THIS IS PROMPTDICT: ", promptDict)
        var promptMatchList = [];
        var promptTextList = promptText.split(' ');
        // console.log("promptTextList", promptTextList)
        var add = true;
        // get promptMatchList which is all the prompts that should be presented
        // TODO: sort promptDict based on how recent the entry was
        // TODO: stop adding once you have 8
        // sort
        Object.entries(promptDict).sort((a, b) => {
            return a[1]['lastUsed'].valueOf() - b[1]['lastUsed'].valueOf();
        });
        // stored: [write me an essay about pyramids of giza, ...]
        // search: write me essay
        // 8 prompts that fully match words, sorted by most used
        // x = promptText (search)
        var counter = 0;
        for (var [key, value] of Object.entries(promptDict)) {
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
            if (counter > 7) {
                break;
            }
        }
        // add prompts to popover
        for (const [prompt, val] of promptMatchList) {
            if (textbox.value != prompt.replaceAll("<b>", "").replaceAll("</b>", "")) {
                const suggestionBox = document.createElement("div");
                suggestionBox.style.display = "flex";
                suggestionBox.style.width = "100%";
                suggestionBox.style.padding = "10px";
                suggestionBox.style.opacity = "75%";
                suggestionBox.style.backgroundColor = "rgb(32,33,35)";
                suggestionBox.style.alignItems = "center";
                suggestionBox.onmouseover = function () {
                    suggestionBox.style.cursor = "pointer";
                    suggestionBox.style.opacity = "100%";
                };
                suggestionBox.onmouseleave = function () {
                    suggestionBox.style.backgroundColor = "rgb(32,33,35)";
                    suggestionBox.style.opacity = "75%";
                };
                suggestionBox.onclick = function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        var newText = prompt.replaceAll("<b>", "").replaceAll("</b>", "");
                        textbox.value = newText;
                        (0, addPromptSearchListener_1.reloadPopover)(textbox, newText);
                        suggestionBox.remove();
                    });
                };
                const iconDiv = document.createElement("div");
                iconDiv.style.marginRight = "10px";
                const textWrapperDiv = document.createElement("div");
                const textDiv = document.createElement("div");
                textDiv.style.color = "white";
                textDiv.style.fontFamily = "sans-serif";
                textDiv.style.overflowX = "hidden";
                textDiv.style.overflowY = "scroll";
                textDiv.style.height = "25px";
                const answerDiv = document.createElement("div");
                answerDiv.style.fontFamily = "sans-serif";
                answerDiv.style.overflow = "hidden";
                answerDiv.style.marginLeft = "15px";
                answerDiv.style.overflowX = "hidden";
                answerDiv.style.overflowY = "scroll";
                answerDiv.style.height = "25px";
                answerDiv.innerHTML = val.answer;
                textDiv.innerHTML = prompt;
                iconDiv.innerHTML = "🕓";
                textWrapperDiv.appendChild(textDiv);
                textWrapperDiv.appendChild(answerDiv);
                suggestionBox.appendChild(iconDiv);
                suggestionBox.appendChild(textWrapperDiv);
                popover.appendChild(suggestionBox);
            }
        }
    });
    popover.id = "popover";
    return popover;
};
exports.getPopover = getPopover;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9zY3JpcHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2I7QUFDQSw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxxQkFBcUIsR0FBRyxtQkFBbUIsR0FBRyxtQkFBbUIsR0FBRyw0QkFBNEIsR0FBRyxrQkFBa0IsR0FBRyw4QkFBOEIsR0FBRywrQkFBK0I7QUFDeEwsa0JBQWtCLG1CQUFPLENBQUMsaURBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZ0NBQWdDO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxxQ0FBcUM7QUFDeEU7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Qsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZ0NBQWdDO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQscUNBQXFDO0FBQzVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7Ozs7Ozs7Ozs7QUN2TlI7QUFDYjtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtCQUFrQjtBQUNsQixrQ0FBa0MsbUJBQU8sQ0FBQyxpRkFBMkI7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCOzs7Ozs7O1VDbElsQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtDQUFrQyxtQkFBTyxDQUFDLCtGQUF5QztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudFNjcmlwdC9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L3BvcG92ZXIudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudF9zY3JpcHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IGV4cG9ydHMuaGlkZVBvcG92ZXIgPSBleHBvcnRzLnNob3dQb3BvdmVyID0gZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGV4cG9ydHMuc2F2ZVByb21wdCA9IGV4cG9ydHMucmVzdGFydExhdGVzdEFuc3dlckRpdiA9IGV4cG9ydHMuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSB2b2lkIDA7XG5jb25zdCBwb3BvdmVyXzEgPSByZXF1aXJlKFwiLi9wb3BvdmVyXCIpO1xuLy8ganVzdCBmb3IgY29uc3RhbnRseSBjaGVja2luZyB3aGF0J3MgdGhlIGxhdGVzdCBhbnN3ZXIgZGl2XG52YXIgbGF0ZXN0QW5zd2VyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbnZhciBjb25maWcgPSB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gICAgYXR0cmlidXRlczogdHJ1ZSxcbn07XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nIENTUyBSZWxvYWQgRWRpdHMhXCIpO1xuICAgIHZhciBwcm9tcHRUZXh0ID0gXCJcIjtcbiAgICAvLyBUT0RPOiBmaXggc28gdGhhdCBpdCBhdXRvbWF0aWNhbGx5IHBvcHMgdXAgd2hlbiB5b3UgbmF2aWdhdGUgdG8gYSBwYWdlXG4gICAgLy8gUHJvYmxlbTogZXZlbiBpZiBVUkwgY2hhbmdlcywgdGhlIHRleHRhcmVhIGRvZXNuJ3QgYWx3YXlzIGNoYW5nZSBpbW1lZGlhdGVseVxuICAgIC8vIEN1cnJlbnQgc2NlbmFyaW8sIHVzZXIgaGFzIHRvIGNsaWNrIG9yIHN0YXJ0IHR5cGluZ1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIHRleHRhcmVhYm94ID0gaXRlbTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYWJveC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaG93IHRvIGZpZ3VyZSBvdXQgd2hlbiBzb21ldGhpbmcgaXMgY2xpY2tlZFxuICAgICAgICAvLyBzYXZlIHByb21wdCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgIC8vIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIHctZnVsbCBweS0yIGZsZXgtZ3JvdyBtZDpweS0zIG1kOnBsLTQgcmVsYXRpdmUgYm9yZGVyIGJvcmRlci1ibGFjay8xMCBiZy13aGl0ZSBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCBkYXJrOnRleHQtd2hpdGUgZGFyazpiZy1ncmF5LTcwMCByb3VuZGVkLW1kIHNoYWRvdy1bMF8wXzEwcHhfcmdiYSgwLDAsMCwwLjEwKV0gZGFyazpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMCwwLDAsMC4xMCldJylcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Fic29sdXRlIHAtMSByb3VuZGVkLW1kIHRleHQtZ3JheS01MDAgYm90dG9tLTEuNSByaWdodC0xIG1kOmJvdHRvbS0yLjUgbWQ6cmlnaHQtMiBob3ZlcjpiZy1ncmF5LTEwMCBkYXJrOmhvdmVyOnRleHQtZ3JheS00MDAgZGFyazpob3ZlcjpiZy1ncmF5LTkwMCBkaXNhYmxlZDpob3ZlcjpiZy10cmFuc3BhcmVudCBkYXJrOmRpc2FibGVkOmhvdmVyOmJnLXRyYW5zcGFyZW50Jyk7XG4gICAgICAgIGlmIChidXR0b25bMF0uY29udGFpbnMoaXRlbSkgfHwgYnV0dG9uWzBdID09IGl0ZW0pIHtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnNhdmVQcm9tcHQpKHByb21wdFRleHQpO1xuICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9KSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gc2F2ZSB0byBsb2NhbCBjaHJvbWUgc3RvcmFnZVxuICAgICAgICAgICAgdmFyIHRleHRhcmVhYm94ID0gaXRlbTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYWJveC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkgIT0gXCJCYWNrc3BhY2VcIikge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gdGV4dGFyZWFib3gudmFsdWUgKyBldmVudC5rZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gdGV4dGFyZWFib3gudmFsdWUuc3Vic3RyaW5nKDAsIHRleHRhcmVhYm94LnZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG9ubHkgcmVsb2FkIGlmIHlvdSd2ZSB0eXBlZCBhdCBsZWFzdCBvbmUgd29yZD9cbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJCYWNrc3BhY2VcIiAmJiB0ZXh0YXJlYWJveC52YWx1ZVt0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggLSAxXSA9PSBcIiBcIikge1xuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLnJlbG9hZFBvcG92ZXIpKGl0ZW0sIHByb21wdFRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHNhdmUgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgKDAsIGV4cG9ydHMuc2F2ZVByb21wdCkocHJvbXB0VGV4dCk7XG4gICAgICAgICAgICBwcm9tcHRUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xuICAgICAgICB9XG4gICAgfSkpO1xuICAgIC8vIHJlbG9hZCBvYnNlcnZlciB0b29cbiAgICAvLyB2YXIgdGV4dGJveEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctaGlkZGVuIHctZnVsbCBoLWZ1bGwgcmVsYXRpdmUnKVswXSBhcyBOb2RlXG4gICAgLy8gdmFyIHRleHRib3hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIHRleHQtc20gaC1mdWxsIGRhcms6YmctZ3JheS04MDAnKVswXSBhcyBOb2RlXG4gICAgdmFyIHRleHRib3hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LWhpZGRlbiB3LWZ1bGwgaC1mdWxsIHJlbGF0aXZlJylbMF07XG4gICAgKDAsIGV4cG9ydHMucmVzdGFydExhdGVzdEFuc3dlckRpdikodGV4dGJveEVsKTtcbn07XG5leHBvcnRzLmFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXI7XG5jb25zdCByZXN0YXJ0TGF0ZXN0QW5zd2VyRGl2ID0gKGNoZWNrRWxlbWVudCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwicmVzdGFydGluZ1wiKTtcbiAgICAvLyBmb3IgdHJhY2tpbmcgdGhlIGFuc3dlclxuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibXV0YXRpb246IFwiLCBtdXRhdGlvbik7XG4gICAgICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJjaGlsZExpc3RcIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWRkZWROb2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFkZGVkTm9kZS5jbGFzc05hbWUgPT0gJ3ctZnVsbCBib3JkZXItYiBib3JkZXItYmxhY2svMTAgZGFyazpib3JkZXItZ3JheS05MDAvNTAgdGV4dC1ncmF5LTgwMCBkYXJrOnRleHQtZ3JheS0xMDAgZ3JvdXAgYmctZ3JheS01MCBkYXJrOmJnLVsjNDQ0NjU0XScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdGVzdEFuc3dlckRpdiA9IGFkZGVkTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVVBEQVRFIGxhdGVzdCBhbnN3ZXIgZGl2OiBcIiwgbGF0ZXN0QW5zd2VyRGl2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfSk7XG4gICAgdmFyIHRleHRib3hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LWhpZGRlbiB3LWZ1bGwgaC1mdWxsIHJlbGF0aXZlJylbMF07XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0ZXh0Ym94RWwsIGNvbmZpZyk7XG59O1xuZXhwb3J0cy5yZXN0YXJ0TGF0ZXN0QW5zd2VyRGl2ID0gcmVzdGFydExhdGVzdEFuc3dlckRpdjtcbi8vIHNhdmUgcHJvbXB0XG5jb25zdCBzYXZlUHJvbXB0ID0gKHByb21wdFRleHQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIGNvbnNvbGUubG9nKFwic2F2aW5nIHByb21wdCFcIik7XG4gICAgdmFyIHByb21wdERpY3QgPSB7fTtcbiAgICAoMCwgZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZykocHJvbXB0RGljdCwgcHJvbXB0VGV4dCk7XG4gICAgLy8gTWF5YmUgY3JlYXRlIGFuIGFkZCB0byBzdG9yYWdlIGFuZCBoYXZlIGl0IGF0IHRoZSBlbmQgb2YgY2hlY2tGaW5pc2hBbnN3ZXJpbmcoKT9cbiAgICAvLyByZXRyaWV2aW5nIGZyb20gbG9jYWwgc3RvcmFnZSwgY2FuIGFsc28ganVzdCBzdG9yZSBhcyBhIHZhcmlhYmxlIGhlcmUgaWYgd2Ugc2VyaW91c2x5IGNhbm5vdCB3YWl0XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdwcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnByb21wdHMpIHtcbiAgICAgICAgICAgIHByb21wdERpY3QgPSBKU09OLnBhcnNlKHJlc3VsdC5wcm9tcHRzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkZWZhdWx0IGFkZGl0aW9uIHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgcHJvbXB0RGljdFtwcm9tcHRUZXh0XSA9IHtcbiAgICAgICAgICAgIGFuc3dlcjogXCI8cD5VbmF2YWlsYWJsZTxwPlwiLFxuICAgICAgICAgICAgdXNhZ2VDb3VudDogMSxcbiAgICAgICAgICAgIGxhc3RVc2VkOiBuZXcgRGF0ZSgpXG4gICAgICAgIH07XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHByb21wdHM6IEpTT04uc3RyaW5naWZ5KHByb21wdERpY3QpIH0pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImVuZCBwcm9tcHRzIGZyb20gZGVmYXVsdCBhZGQ6IFwiLCBwcm9tcHREaWN0KVxuICAgIH0pO1xuICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xufSk7XG5leHBvcnRzLnNhdmVQcm9tcHQgPSBzYXZlUHJvbXB0O1xuY29uc3QgY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSAocHJvbXB0RGljdCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIC8vIGZvciB0cmFja2luZyB3aGVuIHRoZSBidXR0b24gYXBwZWFycywgc2lnbmlmeWluZyBpdCBpcyBkb25lIGFuc3dlcmluZ1xuICAgIHZhciBvYnNlcnZlckJ1dHRvbiA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGRlZE5vZGUgPSBtdXRhdGlvbi5hZGRlZE5vZGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWRkZWROb2RlLnRhZ05hbWUgPT09IFwic3ZnXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXRlc3RBbnN3ZXJEaXYgdXBvbiBjb21wdXRpbmdcIiwgbGF0ZXN0QW5zd2VyRGl2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VyRGl2VGV4dCA9IGxhdGVzdEFuc3dlckRpdi5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29kZSB0byBhZGQgdGhlIGFuc3dlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdERpY3RbcHJvbXB0VGV4dF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyRGl2VGV4dC5pbm5lckhUTUwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzYWdlQ291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVc2VkOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwcm9tcHRzOiBKU09OLnN0cmluZ2lmeShwcm9tcHREaWN0KSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkZGVkIGN1c3RvbSBwcm9tcHQsIHVwZGF0ZWQgZGljdDogXCIsIHByb21wdERpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzb21ldGhpbmcgbGlrZSBhIGRpdiBkaWRuJ3QgaGF2ZSBlbm91Z2ggbm9kZXMgb3Igc29tZXRoaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9KTtcbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IHRydWVcbiAgICB9O1xuICAgIHZhciB0ZXh0Ym94RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIHctZnVsbCBweS0yIGZsZXgtZ3JvdyBtZDpweS0zIG1kOnBsLTQgcmVsYXRpdmUgYm9yZGVyIGJvcmRlci1ibGFjay8xMCBiZy13aGl0ZSBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCBkYXJrOnRleHQtd2hpdGUgZGFyazpiZy1ncmF5LTcwMCByb3VuZGVkLW1kIHNoYWRvdy1bMF8wXzEwcHhfcmdiYSgwLDAsMCwwLjEwKV0gZGFyazpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMCwwLDAsMC4xMCldJylbMF07XG4gICAgb2JzZXJ2ZXJCdXR0b24ub2JzZXJ2ZSh0ZXh0Ym94RWwsIGNvbmZpZyk7XG59O1xuZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGNoZWNrRmluaXNoQW5zd2VyaW5nO1xuLy8gc2hvdyBwb3BvdmVyXG5jb25zdCBzaG93UG9wb3ZlciA9ICgpID0+IHtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICBpZiAocCkge1xuICAgICAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgcC5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICB9XG59O1xuZXhwb3J0cy5zaG93UG9wb3ZlciA9IHNob3dQb3BvdmVyO1xuLy8gaGlkZSBwb3BvdmVyXG5jb25zdCBoaWRlUG9wb3ZlciA9ICgpID0+IHtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICAvLyBUT0RPOiBwdXQgYmFjayBhZnRlciBkZWJ1Z2dpbmdcbiAgICAvLyBpZiAocCkge1xuICAgIC8vICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAvLyAgIHAuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIlxuICAgIC8vIH1cbn07XG5leHBvcnRzLmhpZGVQb3BvdmVyID0gaGlkZVBvcG92ZXI7XG4vLyBtYWluIGNvZGUgdG8gc2hvdyBwb3B1cFxuY29uc3QgcmVsb2FkUG9wb3ZlciA9ICh0ZXh0Ym94LCBwcm9tcHRUZXh0KSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiUkVMT0FESU5HIFBPUE9WRVJcIilcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICBpZiAocCkge1xuICAgICAgICBwLnJlbW92ZSgpO1xuICAgIH1cbiAgICBwID0gKDAsIHBvcG92ZXJfMS5nZXRQb3BvdmVyKSh0ZXh0Ym94LCBwcm9tcHRUZXh0KTtcbiAgICB2YXIgdGV4dGJveFdyYXBwZXIgPSAoX2EgPSB0ZXh0Ym94LnBhcmVudEVsZW1lbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYXJlbnRFbGVtZW50O1xuICAgIHZhciB0ZXh0Ym94TWlkV3JhcHBlciA9IHRleHRib3gucGFyZW50RWxlbWVudDtcbiAgICB0ZXh0Ym94V3JhcHBlciA9PT0gbnVsbCB8fCB0ZXh0Ym94V3JhcHBlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGV4dGJveFdyYXBwZXIuaW5zZXJ0QmVmb3JlKHAsIHRleHRib3hNaWRXcmFwcGVyKTtcbiAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICB2YXIgdGV4dGJveEVsID0gdGV4dGJveC5vd25lckRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LWhpZGRlbiB3LWZ1bGwgaC1mdWxsIHJlbGF0aXZlJylbMF07XG4gICAgKDAsIGV4cG9ydHMucmVzdGFydExhdGVzdEFuc3dlckRpdikodGV4dGJveEVsKTtcbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGV4dGJveCkge1xuICAgICAgICAoMCwgZXhwb3J0cy5zaG93UG9wb3ZlcikoKTtcbiAgICB9XG4gICAgLy8gdGV4dGJveCBpcyBjdXJyZW50bHkgYmVpbmcgY2hhbmdlZFxuICAgIGlmICh0ZXh0Ym94LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgdGV4dGJveC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbiAgICAvLyB0ZXh0Ym94IGhhcyBiZWVuIGNsaWNrZWQgYmFjayB0b1xuICAgIHRleHRib3gub25mb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKDAsIGV4cG9ydHMuc2hvd1BvcG92ZXIpKCk7XG4gICAgfTtcbiAgICAvLyB0ZXh0Ym94IGlzIGNsaWNrZWQgYXdheSwgZGlzbWlzcyBwb3BvdmVyXG4gICAgdGV4dGJveC5vbmJsdXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xuICAgIH07XG59O1xuZXhwb3J0cy5yZWxvYWRQb3BvdmVyID0gcmVsb2FkUG9wb3ZlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFBvcG92ZXIgPSB2b2lkIDA7XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJcIik7XG5jb25zdCBnZXRQb3BvdmVyID0gKHRleHRib3gsIHByb21wdFRleHQpID0+IHtcbiAgICAvLyBQb3BvdmVyIGVsZW1lbnRcbiAgICBjb25zdCBwb3BvdmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwb3BvdmVyLnN0eWxlLndpZHRoID0gdGV4dGJveC5zdHlsZS53aWR0aDtcbiAgICBwb3BvdmVyLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgIHBvcG92ZXIuc3R5bGUuekluZGV4ID0gXCIxMFwiO1xuICAgIHBvcG92ZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmNvbG9yID0gXCJyZ2IoMjEwLCAyMTQsIDIxOClcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgIHBvcG92ZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgIHBvcG92ZXIuc3R5bGUuZmxleERpcmVjdGlvbiA9IFwiY29sdW1uXCI7XG4gICAgLy8gcG9wb3Zlci5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgLy8gbG9hZCBpbiB0aGUgc3VnZ2VzdGlvbnNcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3Byb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHZhciBwcm9tcHREaWN0ID0ge307XG4gICAgICAgIGlmIChyZXN1bHQucHJvbXB0cykge1xuICAgICAgICAgICAgcHJvbXB0RGljdCA9IEpTT04ucGFyc2UocmVzdWx0LnByb21wdHMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSU4gR0VUUE9QT1ZFUiwgVEhJUyBJUyBQUk9NUFRESUNUOiBcIiwgcHJvbXB0RGljdClcbiAgICAgICAgdmFyIHByb21wdE1hdGNoTGlzdCA9IFtdO1xuICAgICAgICB2YXIgcHJvbXB0VGV4dExpc3QgPSBwcm9tcHRUZXh0LnNwbGl0KCcgJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicHJvbXB0VGV4dExpc3RcIiwgcHJvbXB0VGV4dExpc3QpXG4gICAgICAgIHZhciBhZGQgPSB0cnVlO1xuICAgICAgICAvLyBnZXQgcHJvbXB0TWF0Y2hMaXN0IHdoaWNoIGlzIGFsbCB0aGUgcHJvbXB0cyB0aGF0IHNob3VsZCBiZSBwcmVzZW50ZWRcbiAgICAgICAgLy8gVE9ETzogc29ydCBwcm9tcHREaWN0IGJhc2VkIG9uIGhvdyByZWNlbnQgdGhlIGVudHJ5IHdhc1xuICAgICAgICAvLyBUT0RPOiBzdG9wIGFkZGluZyBvbmNlIHlvdSBoYXZlIDhcbiAgICAgICAgLy8gc29ydFxuICAgICAgICBPYmplY3QuZW50cmllcyhwcm9tcHREaWN0KS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYVsxXVsnbGFzdFVzZWQnXS52YWx1ZU9mKCkgLSBiWzFdWydsYXN0VXNlZCddLnZhbHVlT2YoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHN0b3JlZDogW3dyaXRlIG1lIGFuIGVzc2F5IGFib3V0IHB5cmFtaWRzIG9mIGdpemEsIC4uLl1cbiAgICAgICAgLy8gc2VhcmNoOiB3cml0ZSBtZSBlc3NheVxuICAgICAgICAvLyA4IHByb21wdHMgdGhhdCBmdWxseSBtYXRjaCB3b3Jkcywgc29ydGVkIGJ5IG1vc3QgdXNlZFxuICAgICAgICAvLyB4ID0gcHJvbXB0VGV4dCAoc2VhcmNoKVxuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIGZvciAodmFyIFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9tcHREaWN0KSkge1xuICAgICAgICAgICAgYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBwcm9tcHRUZXh0TGlzdCkge1xuICAgICAgICAgICAgICAgIGlmICh3b3JkICYmIHdvcmQgIT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmRJZHggPSBrZXkuaW5kZXhPZih3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRJZHggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBib2xkXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBrZXkuc3Vic3RyaW5nKDAsIHdvcmRJZHgpICsgXCI8Yj5cIiArIGtleS5zdWJzdHJpbmcod29yZElkeCwgd29yZElkeCArIHdvcmQubGVuZ3RoKSArIFwiPC9iPlwiICsga2V5LnN1YnN0cmluZyh3b3JkSWR4ICsgd29yZC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgICAgICBwcm9tcHRNYXRjaExpc3QucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudGVyID4gNykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGFkZCBwcm9tcHRzIHRvIHBvcG92ZXJcbiAgICAgICAgZm9yIChjb25zdCBbcHJvbXB0LCB2YWxdIG9mIHByb21wdE1hdGNoTGlzdCkge1xuICAgICAgICAgICAgaWYgKHRleHRib3gudmFsdWUgIT0gcHJvbXB0LnJlcGxhY2VBbGwoXCI8Yj5cIiwgXCJcIikucmVwbGFjZUFsbChcIjwvYj5cIiwgXCJcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWdnZXN0aW9uQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5wYWRkaW5nID0gXCIxMHB4XCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCIxMDAlXCI7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdUZXh0ID0gcHJvbXB0LnJlcGxhY2VBbGwoXCI8Yj5cIiwgXCJcIikucmVwbGFjZUFsbChcIjwvYj5cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Ym94LnZhbHVlID0gbmV3VGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLnJlbG9hZFBvcG92ZXIpKHRleHRib3gsIG5ld1RleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zdCBpY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBpY29uRGl2LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dFdyYXBwZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLmhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuc3dlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIxNXB4XCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93WSA9IFwic2Nyb2xsXCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLmhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgICAgIGFuc3dlckRpdi5pbm5lckhUTUwgPSB2YWwuYW5zd2VyO1xuICAgICAgICAgICAgICAgIHRleHREaXYuaW5uZXJIVE1MID0gcHJvbXB0O1xuICAgICAgICAgICAgICAgIGljb25EaXYuaW5uZXJIVE1MID0gXCLwn5WTXCI7XG4gICAgICAgICAgICAgICAgdGV4dFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGV4dERpdik7XG4gICAgICAgICAgICAgICAgdGV4dFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoYW5zd2VyRGl2KTtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LmFwcGVuZENoaWxkKGljb25EaXYpO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guYXBwZW5kQ2hpbGQodGV4dFdyYXBwZXJEaXYpO1xuICAgICAgICAgICAgICAgIHBvcG92ZXIuYXBwZW5kQ2hpbGQoc3VnZ2VzdGlvbkJveCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBwb3BvdmVyLmlkID0gXCJwb3BvdmVyXCI7XG4gICAgcmV0dXJuIHBvcG92ZXI7XG59O1xuZXhwb3J0cy5nZXRQb3BvdmVyID0gZ2V0UG9wb3ZlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEgPSByZXF1aXJlKFwiLi9jb250ZW50U2NyaXB0L2FkZFByb21wdFNlYXJjaExpc3RlbmVyXCIpO1xuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwiY2hlY2sgd2FzIGNhbGxlZCFcIik7XG4gICAgc3dpdGNoIChyZXF1ZXN0LmFjdGlvbikge1xuICAgICAgICBjYXNlIFwid2Vic2l0ZSBsb2FkZWRcIjpcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2hlY2sgd2FzIGNhbGxlZCFcIik7XG4gICAgICAgICAgICAoMCwgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMS5hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcikoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBzZW5kUmVzcG9uc2UoeyByZXN1bHQ6IFwic3VjY2Vzc1wiIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=