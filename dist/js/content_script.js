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
exports.reloadPopover = exports.hidePopover = exports.showPopover = exports.checkFinishAnswering = exports.savePrompt = exports.addPromptSearchListener = void 0;
const popover_1 = __webpack_require__(/*! ./popover */ "./src/contentScript/popover.ts");
// just for constantly checking what's the latest answer div
var latestAnswerDiv = document.createElement("div");
var observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
        // console.log("mutation: ", mutation)
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach(node => {
                var addedNode = node;
                console.log("new node: ", addedNode);
                if (addedNode.className == 'w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]') {
                    latestAnswerDiv = addedNode;
                    console.log("UPDATE latest answer div: ", latestAnswerDiv);
                }
            });
        }
    }
    ;
});
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
            console.log("saving prompt!");
            // Maybe create an add to storage and have it at the end of checkFinishAnswering()?
            // retrieving from local storage, can also just store as a variable here if we seriously cannot wait
            chrome.storage.local.get('prompts', function (result) {
                var promptDict;
                console.log("starting to listen for when it's done");
                if (result.prompts) {
                    console.log("was able to find result.prompts");
                    promptDict = JSON.parse(result.prompts);
                }
                else {
                    console.log("was NOT able to find result.prompts");
                    promptDict = {};
                }
                console.log("starting to listen for when it's done using this promptDict", promptDict);
                (0, exports.checkFinishAnswering)(promptDict, promptText);
            });
        }
        else {
            console.log("not saving prompts!");
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
                            console.log("latestAnswerDiv upon computing", latestAnswerDiv);
                            // temporary because this seems to be the only element that updates properly
                            var tempAnswerDivText = document.getElementById('__next');
                            var tempMain = tempAnswerDivText.childNodes[1].childNodes[0].childNodes[0].childNodes[0];
                            var tempDivCollection = tempMain.childNodes[0].childNodes[0].childNodes[0];
                            var latestAnswerDivTempCollection = tempDivCollection.childNodes;
                            var latestAnswerDivTemp = latestAnswerDivTempCollection[tempDivCollection.childNodes.length - 2];
                            var answerDivText = latestAnswerDivTemp === null || latestAnswerDivTemp === void 0 ? void 0 : latestAnswerDivTemp.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0];
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
                            promptDict[promptText] = {
                                answer: "<p>Unavailable<p>",
                                usageCount: 1,
                                lastUsed: new Date()
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
    console.log("getting popover");
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
        toggleShowDisplay.style.height = "25px";
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
                (0, exports.getPopover)(textbox, promptText);
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
        toggleSharePrompts.style.height = "25px";
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
                console.log("clicked! ", toggleSharePromptsVal);
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
        toggleShareResponses.style.height = "25px";
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
        console.log("RESULTS HERE: ", result);
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
                return a[1]['lastUsed'].valueOf() - b[1]['lastUsed'].valueOf();
            });
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
            // add prompts to popover
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
                    iconDiv.innerHTML = "🕓";
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
                            (0, addPromptSearchListener_1.reloadPopover)(textbox, newText);
                            suggestionBox.remove();
                        });
                    };
                    textWrapperDiv.appendChild(textDiv);
                    textWrapperDiv.appendChild(answerDiv);
                    suggestionBox.appendChild(iconDiv);
                    suggestionBox.appendChild(textWrapperDiv);
                    popover.appendChild(suggestionBox);
                }
            }
        }
        else {
            console.log("SHOW DISPLAY WAS OFF!");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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L2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvbnRlbnRTY3JpcHQvYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudFNjcmlwdC9wb3BvdmVyLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvbnRlbnRfc2NyaXB0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlbG9hZFBvcG92ZXIgPSBleHBvcnRzLmhpZGVQb3BvdmVyID0gZXhwb3J0cy5zaG93UG9wb3ZlciA9IGV4cG9ydHMuY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSBleHBvcnRzLnNhdmVQcm9tcHQgPSBleHBvcnRzLmFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gdm9pZCAwO1xuY29uc3QgcG9wb3Zlcl8xID0gcmVxdWlyZShcIi4vcG9wb3ZlclwiKTtcbi8vIGp1c3QgZm9yIGNvbnN0YW50bHkgY2hlY2tpbmcgd2hhdCdzIHRoZSBsYXRlc3QgYW5zd2VyIGRpdlxudmFyIGxhdGVzdEFuc3dlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG52YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJtdXRhdGlvbjogXCIsIG11dGF0aW9uKVxuICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJjaGlsZExpc3RcIikge1xuICAgICAgICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBhZGRlZE5vZGUgPSBub2RlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3IG5vZGU6IFwiLCBhZGRlZE5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChhZGRlZE5vZGUuY2xhc3NOYW1lID09ICd3LWZ1bGwgYm9yZGVyLWIgYm9yZGVyLWJsYWNrLzEwIGRhcms6Ym9yZGVyLWdyYXktOTAwLzUwIHRleHQtZ3JheS04MDAgZGFyazp0ZXh0LWdyYXktMTAwIGdyb3VwIGJnLWdyYXktNTAgZGFyazpiZy1bIzQ0NDY1NF0nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhdGVzdEFuc3dlckRpdiA9IGFkZGVkTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVUERBVEUgbGF0ZXN0IGFuc3dlciBkaXY6IFwiLCBsYXRlc3RBbnN3ZXJEaXYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIDtcbn0pO1xudmFyIGNvbmZpZyA9IHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxufTtcbmNvbnN0IGFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiU3RhcnRpbmcgQ1NTIFJlbG9hZCBFZGl0cyFcIik7XG4gICAgdmFyIHByb21wdFRleHQgPSBcIlwiO1xuICAgIC8vIFRPRE86IGZpeCBzbyB0aGF0IGl0IGF1dG9tYXRpY2FsbHkgcG9wcyB1cCB3aGVuIHlvdSBuYXZpZ2F0ZSB0byBhIHBhZ2VcbiAgICAvLyBQcm9ibGVtOiBldmVuIGlmIFVSTCBjaGFuZ2VzLCB0aGUgdGV4dGFyZWEgZG9lc24ndCBhbHdheXMgY2hhbmdlIGltbWVkaWF0ZWx5XG4gICAgLy8gQ3VycmVudCBzY2VuYXJpbywgdXNlciBoYXMgdG8gY2xpY2sgb3Igc3RhcnQgdHlwaW5nXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgaXRlbSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFib3ggPSBpdGVtO1xuICAgICAgICAgICAgaWYgKHRleHRhcmVhYm94LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiBob3cgdG8gZmlndXJlIG91dCB3aGVuIHNvbWV0aGluZyBpcyBjbGlja2VkXG4gICAgICAgIC8vIHNhdmUgcHJvbXB0IGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgLy8gdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZsZXggZmxleC1jb2wgdy1mdWxsIHB5LTIgZmxleC1ncm93IG1kOnB5LTMgbWQ6cGwtNCByZWxhdGl2ZSBib3JkZXIgYm9yZGVyLWJsYWNrLzEwIGJnLXdoaXRlIGRhcms6Ym9yZGVyLWdyYXktOTAwLzUwIGRhcms6dGV4dC13aGl0ZSBkYXJrOmJnLWdyYXktNzAwIHJvdW5kZWQtbWQgc2hhZG93LVswXzBfMTBweF9yZ2JhKDAsMCwwLDAuMTApXSBkYXJrOnNoYWRvdy1bMF8wXzE1cHhfcmdiYSgwLDAsMCwwLjEwKV0nKVxuICAgICAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWJzb2x1dGUgcC0xIHJvdW5kZWQtbWQgdGV4dC1ncmF5LTUwMCBib3R0b20tMS41IHJpZ2h0LTEgbWQ6Ym90dG9tLTIuNSBtZDpyaWdodC0yIGhvdmVyOmJnLWdyYXktMTAwIGRhcms6aG92ZXI6dGV4dC1ncmF5LTQwMCBkYXJrOmhvdmVyOmJnLWdyYXktOTAwIGRpc2FibGVkOmhvdmVyOmJnLXRyYW5zcGFyZW50IGRhcms6ZGlzYWJsZWQ6aG92ZXI6YmctdHJhbnNwYXJlbnQnKTtcbiAgICAgICAgaWYgKGJ1dHRvblswXS5jb250YWlucyhpdGVtKSB8fCBidXR0b25bMF0gPT0gaXRlbSkge1xuICAgICAgICAgICAgKDAsIGV4cG9ydHMuc2F2ZVByb21wdCkocHJvbXB0VGV4dCk7XG4gICAgICAgICAgICBwcm9tcHRUZXh0ID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH0pKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgaXRlbSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBzYXZlIHRvIGxvY2FsIGNocm9tZSBzdG9yYWdlXG4gICAgICAgICAgICB2YXIgdGV4dGFyZWFib3ggPSBpdGVtO1xuICAgICAgICAgICAgaWYgKHRleHRhcmVhYm94LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSAhPSBcIkJhY2tzcGFjZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZSArIGV2ZW50LmtleTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZS5zdWJzdHJpbmcoMCwgdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gb25seSByZWxvYWQgaWYgeW91J3ZlIHR5cGVkIGF0IGxlYXN0IG9uZSB3b3JkP1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIiBcIikge1xuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLnJlbG9hZFBvcG92ZXIpKGl0ZW0sIHByb21wdFRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgeW91IGhpdCBiYWNrc3BhY2Ugb24gYSBzcGFjZSAvIGRlbGV0ZSBhIHdvcmQgb3IgeW91IGNsZWFyZWQgZXZlcnl0aGluZyBvdXRcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJCYWNrc3BhY2VcIiAmJiAodGV4dGFyZWFib3gudmFsdWVbdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoIC0gMV0gPT0gXCIgXCIgfHwgdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoID09IDEpKSB7XG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2F2ZSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5zYXZlUHJvbXB0KShwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICAgICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XG4gICAgICAgIH1cbiAgICB9KSk7XG59O1xuZXhwb3J0cy5hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lciA9IGFkZFByb21wdFNlYXJjaExpc3RlbmVyO1xuLy8gc2F2ZSBwcm9tcHRcbmNvbnN0IHNhdmVQcm9tcHQgPSAocHJvbXB0VGV4dCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgLy8gc2hhcmVQcm9tcHRzIHRlbXBvcmFyaWx5IG1lYW5zIHNhdmUgcHJvbXB0cyBhbmQgcmVzdWx0cyBsb2NhbGx5XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVByb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc2hhcmVQcm9tcHRzID09IFwib25cIikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYXZpbmcgcHJvbXB0IVwiKTtcbiAgICAgICAgICAgIC8vIE1heWJlIGNyZWF0ZSBhbiBhZGQgdG8gc3RvcmFnZSBhbmQgaGF2ZSBpdCBhdCB0aGUgZW5kIG9mIGNoZWNrRmluaXNoQW5zd2VyaW5nKCk/XG4gICAgICAgICAgICAvLyByZXRyaWV2aW5nIGZyb20gbG9jYWwgc3RvcmFnZSwgY2FuIGFsc28ganVzdCBzdG9yZSBhcyBhIHZhcmlhYmxlIGhlcmUgaWYgd2Ugc2VyaW91c2x5IGNhbm5vdCB3YWl0XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3Byb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb21wdERpY3Q7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydGluZyB0byBsaXN0ZW4gZm9yIHdoZW4gaXQncyBkb25lXCIpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucHJvbXB0cykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIndhcyBhYmxlIHRvIGZpbmQgcmVzdWx0LnByb21wdHNcIik7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdERpY3QgPSBKU09OLnBhcnNlKHJlc3VsdC5wcm9tcHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2FzIE5PVCBhYmxlIHRvIGZpbmQgcmVzdWx0LnByb21wdHNcIik7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdERpY3QgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdGFydGluZyB0byBsaXN0ZW4gZm9yIHdoZW4gaXQncyBkb25lIHVzaW5nIHRoaXMgcHJvbXB0RGljdFwiLCBwcm9tcHREaWN0KTtcbiAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZykocHJvbXB0RGljdCwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IHNhdmluZyBwcm9tcHRzIVwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xufSk7XG5leHBvcnRzLnNhdmVQcm9tcHQgPSBzYXZlUHJvbXB0O1xuY29uc3QgY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSAocHJvbXB0RGljdCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIC8vIGZvciB0cmFja2luZyB3aGVuIHRoZSBidXR0b24gYXBwZWFycywgc2lnbmlmeWluZyBpdCBpcyBkb25lIGFuc3dlcmluZ1xuICAgIHZhciBvYnNlcnZlckJ1dHRvbiA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGRlZE5vZGUgPSBtdXRhdGlvbi5hZGRlZE5vZGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWRkZWROb2RlLnRhZ05hbWUgPT09IFwic3ZnXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXRlc3RBbnN3ZXJEaXYgdXBvbiBjb21wdXRpbmdcIiwgbGF0ZXN0QW5zd2VyRGl2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcnkgYmVjYXVzZSB0aGlzIHNlZW1zIHRvIGJlIHRoZSBvbmx5IGVsZW1lbnQgdGhhdCB1cGRhdGVzIHByb3Blcmx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBBbnN3ZXJEaXZUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ19fbmV4dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wTWFpbiA9IHRlbXBBbnN3ZXJEaXZUZXh0LmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBEaXZDb2xsZWN0aW9uID0gdGVtcE1haW4uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhdGVzdEFuc3dlckRpdlRlbXBDb2xsZWN0aW9uID0gdGVtcERpdkNvbGxlY3Rpb24uY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF0ZXN0QW5zd2VyRGl2VGVtcCA9IGxhdGVzdEFuc3dlckRpdlRlbXBDb2xsZWN0aW9uW3RlbXBEaXZDb2xsZWN0aW9uLmNoaWxkTm9kZXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFuc3dlckRpdlRleHQgPSBsYXRlc3RBbnN3ZXJEaXZUZW1wID09PSBudWxsIHx8IGxhdGVzdEFuc3dlckRpdlRlbXAgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGxhdGVzdEFuc3dlckRpdlRlbXAuY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvZGUgdG8gYWRkIHRoZSBhbnN3ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0W3Byb21wdFRleHRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlckRpdlRleHQuaW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2FnZUNvdW50OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VXNlZDogbmV3IERhdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcHJvbXB0czogSlNPTi5zdHJpbmdpZnkocHJvbXB0RGljdCkgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhZGRlZCBjdXN0b20gcHJvbXB0LCB1cGRhdGVkIGRpY3Q6IFwiLCBwcm9tcHREaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChfYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic29tZXRoaW5nIGxpa2UgYSBkaXYgZGlkbid0IGhhdmUgZW5vdWdoIG5vZGVzIG9yIHNvbWV0aGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0W3Byb21wdFRleHRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IFwiPHA+VW5hdmFpbGFibGU8cD5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNhZ2VDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVzZWQ6IG5ldyBEYXRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHByb21wdHM6IEpTT04uc3RyaW5naWZ5KHByb21wdERpY3QpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9KTtcbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IHRydWVcbiAgICB9O1xuICAgIHZhciB0ZXh0Ym94RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIHctZnVsbCBweS0yIGZsZXgtZ3JvdyBtZDpweS0zIG1kOnBsLTQgcmVsYXRpdmUgYm9yZGVyIGJvcmRlci1ibGFjay8xMCBiZy13aGl0ZSBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCBkYXJrOnRleHQtd2hpdGUgZGFyazpiZy1ncmF5LTcwMCByb3VuZGVkLW1kIHNoYWRvdy1bMF8wXzEwcHhfcmdiYSgwLDAsMCwwLjEwKV0gZGFyazpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMCwwLDAsMC4xMCldJylbMF07XG4gICAgb2JzZXJ2ZXJCdXR0b24ub2JzZXJ2ZSh0ZXh0Ym94RWwsIGNvbmZpZyk7XG59O1xuZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGNoZWNrRmluaXNoQW5zd2VyaW5nO1xuLy8gc2hvdyBwb3BvdmVyXG5jb25zdCBzaG93UG9wb3ZlciA9ICgpID0+IHtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICBpZiAocCkge1xuICAgICAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgcC5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICB9XG59O1xuZXhwb3J0cy5zaG93UG9wb3ZlciA9IHNob3dQb3BvdmVyO1xuLy8gaGlkZSBwb3BvdmVyXG5jb25zdCBoaWRlUG9wb3ZlciA9ICgpID0+IHtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICAvLyBUT0RPOiBwdXQgYmFjayBhZnRlciBkZWJ1Z2dpbmdcbiAgICAvLyBpZiAocCkge1xuICAgIC8vICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAvLyAgIHAuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIlxuICAgIC8vIH1cbn07XG5leHBvcnRzLmhpZGVQb3BvdmVyID0gaGlkZVBvcG92ZXI7XG4vLyBtYWluIGNvZGUgdG8gc2hvdyBwb3B1cFxuY29uc3QgcmVsb2FkUG9wb3ZlciA9ICh0ZXh0Ym94LCBwcm9tcHRUZXh0KSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiUkVMT0FESU5HIFBPUE9WRVJcIilcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICBpZiAocCkge1xuICAgICAgICBwLnJlbW92ZSgpO1xuICAgIH1cbiAgICBwID0gKDAsIHBvcG92ZXJfMS5nZXRQb3BvdmVyKSh0ZXh0Ym94LCBwcm9tcHRUZXh0KTtcbiAgICB2YXIgdGV4dGJveFdyYXBwZXIgPSAoX2EgPSB0ZXh0Ym94LnBhcmVudEVsZW1lbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYXJlbnRFbGVtZW50O1xuICAgIHZhciB0ZXh0Ym94TWlkV3JhcHBlciA9IHRleHRib3gucGFyZW50RWxlbWVudDtcbiAgICB0ZXh0Ym94V3JhcHBlciA9PT0gbnVsbCB8fCB0ZXh0Ym94V3JhcHBlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGV4dGJveFdyYXBwZXIuaW5zZXJ0QmVmb3JlKHAsIHRleHRib3hNaWRXcmFwcGVyKTtcbiAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGV4dGJveCkge1xuICAgICAgICAoMCwgZXhwb3J0cy5zaG93UG9wb3ZlcikoKTtcbiAgICB9XG4gICAgLy8gdGV4dGJveCBpcyBjdXJyZW50bHkgYmVpbmcgY2hhbmdlZFxuICAgIGlmICh0ZXh0Ym94LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgdGV4dGJveC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbiAgICAvLyB0ZXh0Ym94IGhhcyBiZWVuIGNsaWNrZWQgYmFjayB0b1xuICAgIHRleHRib3gub25mb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKDAsIGV4cG9ydHMuc2hvd1BvcG92ZXIpKCk7XG4gICAgfTtcbiAgICAvLyB0ZXh0Ym94IGlzIGNsaWNrZWQgYXdheSwgZGlzbWlzcyBwb3BvdmVyXG4gICAgdGV4dGJveC5vbmJsdXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xuICAgIH07XG59O1xuZXhwb3J0cy5yZWxvYWRQb3BvdmVyID0gcmVsb2FkUG9wb3ZlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldFBvcG92ZXIgPSB2b2lkIDA7XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJcIik7XG5jb25zdCBnZXRQb3BvdmVyID0gKHRleHRib3gsIHByb21wdFRleHQpID0+IHtcbiAgICAvLyBQb3BvdmVyIGVsZW1lbnRcbiAgICBjb25zb2xlLmxvZyhcImdldHRpbmcgcG9wb3ZlclwiKTtcbiAgICBjb25zdCBwb3BvdmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwb3BvdmVyLnN0eWxlLndpZHRoID0gdGV4dGJveC5zdHlsZS53aWR0aDtcbiAgICBwb3BvdmVyLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgIHBvcG92ZXIuc3R5bGUuekluZGV4ID0gXCIxMFwiO1xuICAgIHBvcG92ZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiLjM3NXJlbVwiO1xuICAgIHBvcG92ZXIuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgIHBvcG92ZXIuc3R5bGUuY29sb3IgPSBcInJnYigyMTAsIDIxNCwgMjE4KVwiO1xuICAgIHBvcG92ZXIuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIHBvcG92ZXIuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiY2VudGVyXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5mbGV4RGlyZWN0aW9uID0gXCJjb2x1bW4tcmV2ZXJzZVwiO1xuICAgIC8vIHBvcG92ZXIuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgIC8vIEFkZCB0b2dnbGVzIHRvIG1lbnVcbiAgICBjb25zdCB0b2dnbGVCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmhlaWdodCA9IFwiNTBweFwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5wYWRkaW5nID0gXCIxMHB4XCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiLjM3NXJlbVwiO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hvd0Rpc3BsYXknLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZVNob3dEaXNwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxcmVtXCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5oZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuY2xhc3NOYW1lID0gXCJ0ZW1wXCI7XG4gICAgICAgIC8vIHNob3cgc2hvd0Rpc3BsYXkgdmFsdWUgYmFzZWQgb24gY2hyb21lIHN0b3JhZ2VcbiAgICAgICAgdmFyIHNob3dEaXNwbGF5VmFsID0gXCJvblwiO1xuICAgICAgICBpZiAoJ3Nob3dEaXNwbGF5JyBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gcmVzdWx0LnNob3dEaXNwbGF5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2hvd0Rpc3BsYXlWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaG93RGlzcGxheTogXCJvblwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93RGlzcGxheVZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNob3dEaXNwbGF5VmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LmlubmVySFRNTCA9IFwic2hvdyBkaXNwbGF5OiBcIiArIHNob3dEaXNwbGF5VmFsO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaG93RGlzcGxheScsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2hvd0Rpc3BsYXlWYWwgPSByZXN1bHQuc2hvd0Rpc3BsYXk7XG4gICAgICAgICAgICAgICAgaWYgKHNob3dEaXNwbGF5VmFsID09IFwib25cIikge1xuICAgICAgICAgICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IFwib2ZmXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNob3dEaXNwbGF5VmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0Rpc3BsYXlWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNob3dEaXNwbGF5OiBzaG93RGlzcGxheVZhbCB9KTtcbiAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5pbm5lckhUTUwgPSBcInNob3cgZGlzcGxheTogXCIgKyBzaG93RGlzcGxheVZhbDtcbiAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5nZXRQb3BvdmVyKSh0ZXh0Ym94LCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVCb3guYXBwZW5kQ2hpbGQodG9nZ2xlU2hvd0Rpc3BsYXkpO1xuICAgIH0pO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVQcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBjb25zdCB0b2dnbGVTaGFyZVByb21wdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxcmVtXCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5oZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIC8vIHNob3cgc2hvd0Rpc3BsYXkgdmFsdWUgYmFzZWQgb24gY2hyb21lIHN0b3JhZ2VcbiAgICAgICAgdmFyIHNoYXJlUHJvbXB0c1ZhbCA9IFwib25cIjtcbiAgICAgICAgaWYgKCdzaGFyZVByb21wdHMnIGluIHJlc3VsdCAmJiAocmVzdWx0LnNoYXJlUHJvbXB0cyA9PSAnb24nIHx8IHJlc3VsdC5zaGFyZVByb21wdHMgPT0gJ29mZicpKSB7XG4gICAgICAgICAgICBzaGFyZVByb21wdHNWYWwgPSByZXN1bHQuc2hhcmVQcm9tcHRzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2hhcmVQcm9tcHRzVmFsID0gXCJvblwiO1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVQcm9tcHRzOiBzaGFyZVByb21wdHNWYWwgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNoYXJlUHJvbXB0c1ZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2hhcmVQcm9tcHRzVmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLmlubmVySFRNTCA9IFwic2F2ZSBwcm9tcHRzICYgcmVzdWx0czogXCIgKyBzaGFyZVByb21wdHNWYWw7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVByb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbCA9IHJlc3VsdC5zaGFyZVByb21wdHM7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjbGlja2VkISBcIiwgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsKTtcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlU2hhcmVQcm9tcHRzVmFsID09IFwib25cIikge1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHNWYWwgPSBcIm9mZlwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUHJvbXB0czogXCJvZmZcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG9nZ2xlU2hhcmVQcm9tcHRzVmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsID0gXCJvblwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUHJvbXB0czogXCJvblwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuaW5uZXJIVE1MID0gXCJzYXZlIHByb21wdHMgJiByZXN1bHRzOiBcIiArIHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZUJveC5hcHBlbmRDaGlsZCh0b2dnbGVTaGFyZVByb21wdHMpO1xuICAgIH0pO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVSZXNwb25zZXMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZVNoYXJlUmVzcG9uc2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxcmVtXCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5oZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgLy8gc2hvdyBzaG93RGlzcGxheSB2YWx1ZSBiYXNlZCBvbiBjaHJvbWUgc3RvcmFnZVxuICAgICAgICB2YXIgc2hhcmVSZXNwb25zZXNWYWwgPSBcIm9uXCI7XG4gICAgICAgIGlmICgnc2hhcmVSZXNwb25zZXMnIGluIHJlc3VsdCAmJiByZXN1bHQuc2hhcmVSZXNwb25zZXMgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gcmVzdWx0LnNoYXJlUmVzcG9uc2VzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2hhcmVSZXNwb25zZXNWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVJlc3BvbnNlczogXCJvblwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNoYXJlUmVzcG9uc2VzVmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLmlubmVySFRNTCA9IFwic2hhcmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVSZXNwb25zZXNWYWw7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUmVzcG9uc2VzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciBzaGFyZVJlc3BvbnNlc1ZhbCA9IHJlc3VsdC5zaGFyZVJlc3BvbnNlcztcbiAgICAgICAgICAgICAgICBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gXCJvZmZcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgICAgICAgICBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib25cIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVSZXNwb25zZXM6IHNoYXJlUmVzcG9uc2VzVmFsIH0pO1xuICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLmlubmVySFRNTCA9IFwic2hhcmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVSZXNwb25zZXNWYWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNoYXJlUmVzcG9uc2VzKTtcbiAgICB9KTtcbiAgICBwb3BvdmVyLmFwcGVuZENoaWxkKHRvZ2dsZUJveCk7XG4gICAgLy8gbG9hZCBpbiB0aGUgc3VnZ2VzdGlvbnNcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydwcm9tcHRzJywgJ3Nob3dEaXNwbGF5J10sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSRVNVTFRTIEhFUkU6IFwiLCByZXN1bHQpO1xuICAgICAgICBpZiAoJ3Nob3dEaXNwbGF5JyBpbiByZXN1bHQgJiYgcmVzdWx0LnNob3dEaXNwbGF5ID09IFwib25cIikge1xuICAgICAgICAgICAgdmFyIHByb21wdERpY3QgPSB7fTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQucHJvbXB0cykge1xuICAgICAgICAgICAgICAgIHByb21wdERpY3QgPSBKU09OLnBhcnNlKHJlc3VsdC5wcm9tcHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9tcHRNYXRjaExpc3QgPSBbXTtcbiAgICAgICAgICAgIHZhciBwcm9tcHRUZXh0TGlzdCA9IHByb21wdFRleHQuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIHZhciBhZGQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gc29ydCwgcmV0dXJucyBvbGRlc3QgLS0+IG5ld2VzdFxuICAgICAgICAgICAgdmFyIHNvcnRlZFByb21wdExpc3QgPSBPYmplY3QuZW50cmllcyhwcm9tcHREaWN0KS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFbMV1bJ2xhc3RVc2VkJ10udmFsdWVPZigpIC0gYlsxXVsnbGFzdFVzZWQnXS52YWx1ZU9mKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJldHVybiB0b3AgTiByZXN1bHRzXG4gICAgICAgICAgICB2YXIgcmV0dXJuVG9wTiA9IDg7XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBba2V5LCB2YWx1ZV0gb2Ygc29ydGVkUHJvbXB0TGlzdC5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgICAgICBhZGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBwcm9tcHRUZXh0TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAod29yZCAmJiB3b3JkICE9IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd29yZElkeCA9IGtleS5pbmRleE9mKHdvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRJZHggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYm9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGtleS5zdWJzdHJpbmcoMCwgd29yZElkeCkgKyBcIjxiPlwiICsga2V5LnN1YnN0cmluZyh3b3JkSWR4LCB3b3JkSWR4ICsgd29yZC5sZW5ndGgpICsgXCI8L2I+XCIgKyBrZXkuc3Vic3RyaW5nKHdvcmRJZHggKyB3b3JkLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdE1hdGNoTGlzdC5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXIgPj0gcmV0dXJuVG9wTikge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBhZGQgcHJvbXB0cyB0byBwb3BvdmVyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtwcm9tcHQsIHZhbF0gb2YgcHJvbXB0TWF0Y2hMaXN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRleHRib3gudmFsdWUgIT0gcHJvbXB0LnJlcGxhY2VBbGwoXCI8Yj5cIiwgXCJcIikucmVwbGFjZUFsbChcIjwvYj5cIiwgXCJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guaWQgPSBcInN1Z2dlc3Rpb25Cb3hcIjtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5wYWRkaW5nID0gXCIxMHB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIuMzc1cmVtXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgICAgICBpY29uRGl2LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHRXcmFwcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5zd2VyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1hcmdpbkxlZnQgPSBcIjE1cHhcIjtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5vdmVyZmxvd1kgPSBcInNjcm9sbFwiO1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlckRpdi5pbm5lckhUTUwgPSB2YWwuYW5zd2VyO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0RGl2LmlubmVySFRNTCA9IHByb21wdDtcbiAgICAgICAgICAgICAgICAgICAgaWNvbkRpdi5pbm5lckhUTUwgPSBcIvCflZNcIjtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIxMjVweFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMTI1cHhcIjtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbm1vdXNlbGVhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1RleHQgPSBwcm9tcHQucmVwbGFjZUFsbChcIjxiPlwiLCBcIlwiKS5yZXBsYWNlQWxsKFwiPC9iPlwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Ym94LnZhbHVlID0gbmV3VGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoMCwgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMS5yZWxvYWRQb3BvdmVyKSh0ZXh0Ym94LCBuZXdUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRleHRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKHRleHREaXYpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChhbnN3ZXJEaXYpO1xuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LmFwcGVuZENoaWxkKGljb25EaXYpO1xuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LmFwcGVuZENoaWxkKHRleHRXcmFwcGVyRGl2KTtcbiAgICAgICAgICAgICAgICAgICAgcG9wb3Zlci5hcHBlbmRDaGlsZChzdWdnZXN0aW9uQm94KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNIT1cgRElTUExBWSBXQVMgT0ZGIVwiKTtcbiAgICAgICAgICAgIGxldCBzdWdnZXN0aW9uQm94RWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3N1Z2dlc3Rpb25Cb3hcIik7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94RWxlbWVudHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcG9wb3Zlci5pZCA9IFwicG9wb3ZlclwiO1xuICAgIHJldHVybiBwb3BvdmVyO1xufTtcbmV4cG9ydHMuZ2V0UG9wb3ZlciA9IGdldFBvcG92ZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vY29udGVudFNjcmlwdC9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lclwiKTtcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgIHN3aXRjaCAocmVxdWVzdC5hY3Rpb24pIHtcbiAgICAgICAgY2FzZSBcIndlYnNpdGUgbG9hZGVkXCI6XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIpKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlKHsgcmVzdWx0OiBcInN1Y2Nlc3NcIiB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9