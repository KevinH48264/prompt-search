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
exports.addPromptToDB = exports.editPromptText = exports.reloadPopover = exports.hidePopover = exports.showPopover = exports.checkFinishAnswering = exports.savePrompt = exports.addPromptSearchListener = void 0;
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
                            (0, exports.addPromptToDB)(promptText.trim(), JSON.stringify(answerDivText.innerHTML));
                            console.log("added this prompt: ", promptText);
                            console.log("updated Prompt Dict: ", promptDict);
                        }
                        catch (_a) {
                            promptDict[promptText.trim()] = {
                                answer: "<p>Unavailable<p>",
                                usageCount: 1,
                                lastUsed: (new Date()).valueOf()
                            };
                            chrome.storage.local.set({ prompts: JSON.stringify(promptDict) });
                            (0, exports.addPromptToDB)(promptText.trim(), "<p>Unavailable<p>");
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
const addPromptToDB = (promptText, answerText) => {
    // shareResponses is temporary chrome storage for share prompts and results publicly
    chrome.storage.local.get('shareResponses', function (result) {
        if (result.shareResponses == "on") {
            console.log("ADDING PROMPT TO DB!");
            // how to check if this prompt already exists?
            // else: add it as a new prompt
            const params = { prompt: promptText, answer: answerText, usageCount: 1 };
            console.log("PARAMS: ", params);
            console.log("jsonify", JSON.stringify(params));
            console.log("parsed: ", JSON.parse(answerText));
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            };
            fetch(`http://localhost:9090/instance/create`, options).then((res) => res.json())
                .then((res) => {
                console.log("res", res);
            });
        }
    });
};
exports.addPromptToDB = addPromptToDB;


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
                                "answer": JSON.parse(DBprompt.answer),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7Ozs7Ozs7VUNsV3JCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0NBQWtDLG1CQUFPLENBQUMsK0ZBQXlDO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L2FkZFByb21wdFNlYXJjaExpc3RlbmVyLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvbnRlbnRTY3JpcHQvcG9wb3Zlci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50X3NjcmlwdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRQcm9tcHRUb0RCID0gZXhwb3J0cy5lZGl0UHJvbXB0VGV4dCA9IGV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IGV4cG9ydHMuaGlkZVBvcG92ZXIgPSBleHBvcnRzLnNob3dQb3BvdmVyID0gZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGV4cG9ydHMuc2F2ZVByb21wdCA9IGV4cG9ydHMuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSB2b2lkIDA7XG5jb25zdCBwb3BvdmVyXzEgPSByZXF1aXJlKFwiLi9wb3BvdmVyXCIpO1xuLy8gaW1wb3J0IHsgZ2V0UG9wb3ZlckFueXdoZXJlIH0gZnJvbSBcIi4vcG9wb3ZlckFueXdoZXJlXCI7XG4vLyBqdXN0IGZvciBjb25zdGFudGx5IGNoZWNraW5nIHdoYXQncyB0aGUgbGF0ZXN0IGFuc3dlciBkaXZcbnZhciBsYXRlc3RBbnN3ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xudmFyIHByb21wdFRleHQgPSBcIlwiO1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJTdGFydGluZyBDU1MgUmVsb2FkIEVkaXRzIVwiKTtcbiAgICAvLyBUT0RPOiBmaXggc28gdGhhdCBpdCBhdXRvbWF0aWNhbGx5IHBvcHMgdXAgd2hlbiB5b3UgbmF2aWdhdGUgdG8gYSBwYWdlXG4gICAgLy8gUHJvYmxlbTogZXZlbiBpZiBVUkwgY2hhbmdlcywgdGhlIHRleHRhcmVhIGRvZXNuJ3QgYWx3YXlzIGNoYW5nZSBpbW1lZGlhdGVseVxuICAgIC8vIEN1cnJlbnQgc2NlbmFyaW8sIHVzZXIgaGFzIHRvIGNsaWNrIG9yIHN0YXJ0IHR5cGluZ1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIHRleHRhcmVhYm94ID0gaXRlbTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYWJveC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaG93IHRvIGZpZ3VyZSBvdXQgd2hlbiBzb21ldGhpbmcgaXMgY2xpY2tlZFxuICAgICAgICAvLyBzYXZlIHByb21wdCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgIC8vIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIHctZnVsbCBweS0yIGZsZXgtZ3JvdyBtZDpweS0zIG1kOnBsLTQgcmVsYXRpdmUgYm9yZGVyIGJvcmRlci1ibGFjay8xMCBiZy13aGl0ZSBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCBkYXJrOnRleHQtd2hpdGUgZGFyazpiZy1ncmF5LTcwMCByb3VuZGVkLW1kIHNoYWRvdy1bMF8wXzEwcHhfcmdiYSgwLDAsMCwwLjEwKV0gZGFyazpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMCwwLDAsMC4xMCldJylcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Fic29sdXRlIHAtMSByb3VuZGVkLW1kIHRleHQtZ3JheS01MDAgYm90dG9tLTEuNSByaWdodC0xIG1kOmJvdHRvbS0yLjUgbWQ6cmlnaHQtMiBob3ZlcjpiZy1ncmF5LTEwMCBkYXJrOmhvdmVyOnRleHQtZ3JheS00MDAgZGFyazpob3ZlcjpiZy1ncmF5LTkwMCBkaXNhYmxlZDpob3ZlcjpiZy10cmFuc3BhcmVudCBkYXJrOmRpc2FibGVkOmhvdmVyOmJnLXRyYW5zcGFyZW50Jyk7XG4gICAgICAgIGlmIChidXR0b25bMF0uY29udGFpbnMoaXRlbSkgfHwgYnV0dG9uWzBdID09IGl0ZW0pIHtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnNhdmVQcm9tcHQpKHByb21wdFRleHQpO1xuICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9KSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8ganVzdCBtZXNzaW5nIHdpdGggaWYgaXQgd29ya3Mgb24gYW55IHBsYWNlXG4gICAgICAgIC8vIHZhciB0YXJnZXRFbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAvLyB2YXIgcGFyZW50RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ/LnBhcmVudE5vZGU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldEVsZW1lbnQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwYXJlbnRFbGVtZW50KTtcbiAgICAgICAgLy8gaWYgKHBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgLy8gICBnZXRQb3BvdmVyQW55d2hlcmUodGFyZ2V0RWxlbWVudCBhcyBIVE1MRWxlbWVudCwgcHJvbXB0VGV4dCwgdGFyZ2V0RWxlbWVudCBhcyBIVE1MRWxlbWVudClcbiAgICAgICAgLy8gICAvLyBMQVRFUjogbmVlZCB0byBhZGQgYXR0cmlidXRlcywgcmVtb3ZlIHBvcHVwcyBhcyB0aGV5IGNvbWUgYWxvbmcgbGlrZSByZWxvYWQgcG9wdXBcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBtZXNzaW5nIGFyb3VuZCBlbmRzXG4gICAgICAgIHZhciBpdGVtID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIHNhdmUgdG8gbG9jYWwgY2hyb21lIHN0b3JhZ2VcbiAgICAgICAgICAgIHZhciB0ZXh0YXJlYWJveCA9IGl0ZW07XG4gICAgICAgICAgICBpZiAodGV4dGFyZWFib3gudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5ICE9IFwiQmFja3NwYWNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlICsgZXZlbnQua2V5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlLnN1YnN0cmluZygwLCB0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBvbmx5IHJlbG9hZCBpZiB5b3UndmUgdHlwZWQgYXQgbGVhc3Qgb25lIHdvcmQ/XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB5b3UgaGl0IGJhY2tzcGFjZSBvbiBhIHNwYWNlIC8gZGVsZXRlIGEgd29yZCBvciB5b3UgY2xlYXJlZCBldmVyeXRoaW5nIG91dFxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIkJhY2tzcGFjZVwiICYmICh0ZXh0YXJlYWJveC52YWx1ZVt0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggLSAxXSA9PSBcIiBcIiB8fCB0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggPT0gMSkpIHtcbiAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzYXZlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnNhdmVQcm9tcHQpKHByb21wdFRleHQpO1xuICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5oaWRlUG9wb3ZlcikoKTtcbiAgICAgICAgfVxuICAgIH0pKTtcbn07XG5leHBvcnRzLmFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXI7XG4vLyBzYXZlIHByb21wdFxuY29uc3Qgc2F2ZVByb21wdCA9IChwcm9tcHRUZXh0KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAvLyBzaGFyZVByb21wdHMgdGVtcG9yYXJpbHkgbWVhbnMgc2F2ZSBwcm9tcHRzIGFuZCByZXN1bHRzIGxvY2FsbHlcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zaGFyZVByb21wdHMgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICAvLyBNYXliZSBjcmVhdGUgYW4gYWRkIHRvIHN0b3JhZ2UgYW5kIGhhdmUgaXQgYXQgdGhlIGVuZCBvZiBjaGVja0ZpbmlzaEFuc3dlcmluZygpP1xuICAgICAgICAgICAgLy8gcmV0cmlldmluZyBmcm9tIGxvY2FsIHN0b3JhZ2UsIGNhbiBhbHNvIGp1c3Qgc3RvcmUgYXMgYSB2YXJpYWJsZSBoZXJlIGlmIHdlIHNlcmlvdXNseSBjYW5ub3Qgd2FpdFxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdwcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9tcHREaWN0O1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucHJvbXB0cykge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0ID0gSlNPTi5wYXJzZShyZXN1bHQucHJvbXB0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0ID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmNoZWNrRmluaXNoQW5zd2VyaW5nKShwcm9tcHREaWN0LCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XG59KTtcbmV4cG9ydHMuc2F2ZVByb21wdCA9IHNhdmVQcm9tcHQ7XG5jb25zdCBjaGVja0ZpbmlzaEFuc3dlcmluZyA9IChwcm9tcHREaWN0LCBwcm9tcHRUZXh0KSA9PiB7XG4gICAgLy8gZm9yIHRyYWNraW5nIHdoZW4gdGhlIGJ1dHRvbiBhcHBlYXJzLCBzaWduaWZ5aW5nIGl0IGlzIGRvbmUgYW5zd2VyaW5nXG4gICAgdmFyIG9ic2VydmVyQnV0dG9uID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGVkTm9kZSA9IG11dGF0aW9uLmFkZGVkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChhZGRlZE5vZGUudGFnTmFtZSA9PT0gXCJzdmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcnkgYmVjYXVzZSB0aGlzIHNlZW1zIHRvIGJlIHRoZSBvbmx5IGVsZW1lbnQgdGhhdCB1cGRhdGVzIHByb3Blcmx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBBbnN3ZXJEaXZUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ19fbmV4dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wTWFpbiA9IHRlbXBBbnN3ZXJEaXZUZXh0LmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBEaXZDb2xsZWN0aW9uID0gdGVtcE1haW4uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhdGVzdEFuc3dlckRpdlRlbXBDb2xsZWN0aW9uID0gdGVtcERpdkNvbGxlY3Rpb24uY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF0ZXN0QW5zd2VyRGl2VGVtcCA9IGxhdGVzdEFuc3dlckRpdlRlbXBDb2xsZWN0aW9uW3RlbXBEaXZDb2xsZWN0aW9uLmNoaWxkTm9kZXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFuc3dlckRpdlRleHQgPSBsYXRlc3RBbnN3ZXJEaXZUZW1wID09PSBudWxsIHx8IGxhdGVzdEFuc3dlckRpdlRlbXAgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGxhdGVzdEFuc3dlckRpdlRlbXAuY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvZGUgdG8gYWRkIHRoZSBhbnN3ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0W3Byb21wdFRleHQudHJpbSgpXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXJEaXZUZXh0LmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNhZ2VDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVzZWQ6IChuZXcgRGF0ZSgpKS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHByb21wdHM6IEpTT04uc3RyaW5naWZ5KHByb21wdERpY3QpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmFkZFByb21wdFRvREIpKHByb21wdFRleHQudHJpbSgpLCBKU09OLnN0cmluZ2lmeShhbnN3ZXJEaXZUZXh0LmlubmVySFRNTCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRkZWQgdGhpcyBwcm9tcHQ6IFwiLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZWQgUHJvbXB0IERpY3Q6IFwiLCBwcm9tcHREaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChfYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdERpY3RbcHJvbXB0VGV4dC50cmltKCldID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IFwiPHA+VW5hdmFpbGFibGU8cD5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNhZ2VDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVzZWQ6IChuZXcgRGF0ZSgpKS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHByb21wdHM6IEpTT04uc3RyaW5naWZ5KHByb21wdERpY3QpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmFkZFByb21wdFRvREIpKHByb21wdFRleHQudHJpbSgpLCBcIjxwPlVuYXZhaWxhYmxlPHA+XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIDtcbiAgICB9KTtcbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IHRydWVcbiAgICB9O1xuICAgIHZhciB0ZXh0Ym94RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIHctZnVsbCBweS0yIGZsZXgtZ3JvdyBtZDpweS0zIG1kOnBsLTQgcmVsYXRpdmUgYm9yZGVyIGJvcmRlci1ibGFjay8xMCBiZy13aGl0ZSBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCBkYXJrOnRleHQtd2hpdGUgZGFyazpiZy1ncmF5LTcwMCByb3VuZGVkLW1kIHNoYWRvdy1bMF8wXzEwcHhfcmdiYSgwLDAsMCwwLjEwKV0gZGFyazpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMCwwLDAsMC4xMCldJylbMF07XG4gICAgb2JzZXJ2ZXJCdXR0b24ub2JzZXJ2ZSh0ZXh0Ym94RWwsIGNvbmZpZyk7XG59O1xuZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGNoZWNrRmluaXNoQW5zd2VyaW5nO1xuLy8gc2hvdyBwb3BvdmVyXG5jb25zdCBzaG93UG9wb3ZlciA9ICgpID0+IHtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICBpZiAocCkge1xuICAgICAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgcC5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICB9XG59O1xuZXhwb3J0cy5zaG93UG9wb3ZlciA9IHNob3dQb3BvdmVyO1xuLy8gaGlkZSBwb3BvdmVyXG5jb25zdCBoaWRlUG9wb3ZlciA9ICgpID0+IHtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICAvLyBUT0RPOiBwdXQgYmFjayBhZnRlciBkZWJ1Z2dpbmdcbiAgICAvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgLy8gICBpZiAocCkge1xuICAgIC8vICAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIC8vICAgICBwLnN0eWxlLmhlaWdodCA9IFwiMHB4XCJcbiAgICAvLyAgIH1cbiAgICAvLyB9LCAxMDApO1xufTtcbmV4cG9ydHMuaGlkZVBvcG92ZXIgPSBoaWRlUG9wb3Zlcjtcbi8vIG1haW4gY29kZSB0byBzaG93IHBvcHVwXG5jb25zdCByZWxvYWRQb3BvdmVyID0gKHRleHRib3gsIHByb21wdFRleHQpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcG92ZXJcIik7XG4gICAgaWYgKHApIHtcbiAgICAgICAgcC5yZW1vdmUoKTtcbiAgICB9XG4gICAgcCA9ICgwLCBwb3BvdmVyXzEuZ2V0UG9wb3ZlcikodGV4dGJveCwgcHJvbXB0VGV4dCk7XG4gICAgdmFyIHRleHRib3hXcmFwcGVyID0gKF9hID0gdGV4dGJveC5wYXJlbnRFbGVtZW50KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGFyZW50RWxlbWVudDtcbiAgICB2YXIgdGV4dGJveE1pZFdyYXBwZXIgPSB0ZXh0Ym94LnBhcmVudEVsZW1lbnQ7XG4gICAgdGV4dGJveFdyYXBwZXIgPT09IG51bGwgfHwgdGV4dGJveFdyYXBwZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRleHRib3hXcmFwcGVyLmluc2VydEJlZm9yZShwLCB0ZXh0Ym94TWlkV3JhcHBlcik7XG4gICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRleHRib3gpIHtcbiAgICAgICAgKDAsIGV4cG9ydHMuc2hvd1BvcG92ZXIpKCk7XG4gICAgfVxuICAgIC8vIHRleHRib3ggaXMgY3VycmVudGx5IGJlaW5nIGNoYW5nZWRcbiAgICBpZiAodGV4dGJveC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIHRleHRib3guYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG4gICAgLy8gdGV4dGJveCBoYXMgYmVlbiBjbGlja2VkIGJhY2sgdG9cbiAgICB0ZXh0Ym94Lm9uZm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICgwLCBleHBvcnRzLnNob3dQb3BvdmVyKSgpO1xuICAgIH07XG4gICAgLy8gdGV4dGJveCBpcyBjbGlja2VkIGF3YXksIGRpc21pc3MgcG9wb3ZlclxuICAgIHRleHRib3gub25ibHVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAoMCwgZXhwb3J0cy5oaWRlUG9wb3ZlcikoKTtcbiAgICB9O1xufTtcbmV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IHJlbG9hZFBvcG92ZXI7XG5jb25zdCBlZGl0UHJvbXB0VGV4dCA9IChlZGl0KSA9PiB7XG4gICAgcHJvbXB0VGV4dCA9IGVkaXQ7XG59O1xuZXhwb3J0cy5lZGl0UHJvbXB0VGV4dCA9IGVkaXRQcm9tcHRUZXh0O1xuY29uc3QgYWRkUHJvbXB0VG9EQiA9IChwcm9tcHRUZXh0LCBhbnN3ZXJUZXh0KSA9PiB7XG4gICAgLy8gc2hhcmVSZXNwb25zZXMgaXMgdGVtcG9yYXJ5IGNocm9tZSBzdG9yYWdlIGZvciBzaGFyZSBwcm9tcHRzIGFuZCByZXN1bHRzIHB1YmxpY2x5XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVJlc3BvbnNlcycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zaGFyZVJlc3BvbnNlcyA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQURESU5HIFBST01QVCBUTyBEQiFcIik7XG4gICAgICAgICAgICAvLyBob3cgdG8gY2hlY2sgaWYgdGhpcyBwcm9tcHQgYWxyZWFkeSBleGlzdHM/XG4gICAgICAgICAgICAvLyBlbHNlOiBhZGQgaXQgYXMgYSBuZXcgcHJvbXB0XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB7IHByb21wdDogcHJvbXB0VGV4dCwgYW5zd2VyOiBhbnN3ZXJUZXh0LCB1c2FnZUNvdW50OiAxIH07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBBUkFNUzogXCIsIHBhcmFtcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImpzb25pZnlcIiwgSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhcnNlZDogXCIsIEpTT04ucGFyc2UoYW5zd2VyVGV4dCkpO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXMpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjkwOTAvaW5zdGFuY2UvY3JlYXRlYCwgb3B0aW9ucykudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJlc1wiLCByZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5leHBvcnRzLmFkZFByb21wdFRvREIgPSBhZGRQcm9tcHRUb0RCO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkUHJvbXB0TGlzdCA9IGV4cG9ydHMuZ2V0UG9wb3ZlciA9IHZvaWQgMDtcbmNvbnN0IGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEgPSByZXF1aXJlKFwiLi9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lclwiKTtcbmNvbnN0IGdldFBvcG92ZXIgPSAodGV4dGJveCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIC8vIFBvcG92ZXIgZWxlbWVudFxuICAgIGNvbnN0IHBvcG92ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHBvcG92ZXIuc3R5bGUud2lkdGggPSB0ZXh0Ym94LnN0eWxlLndpZHRoO1xuICAgIHBvcG92ZXIuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgcG9wb3Zlci5zdHlsZS56SW5kZXggPSBcIjEwXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICBwb3BvdmVyLnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xuICAgIHBvcG92ZXIuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIuMzc1cmVtXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5jb2xvciA9IFwicmdiKDIxMCwgMjE0LCAyMTgpXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgcG9wb3Zlci5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSBcImNvbHVtbi1yZXZlcnNlXCI7XG4gICAgLy8gcG9wb3Zlci5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgLy8gQWRkIHRvZ2dsZXMgdG8gbWVudVxuICAgIGNvbnN0IHRvZ2dsZUJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUuaGVpZ2h0ID0gXCI1MHB4XCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLnBhZGRpbmcgPSBcIjEwcHhcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIuMzc1cmVtXCI7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaG93RGlzcGxheScsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlU2hvd0Rpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjFyZW1cIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5jbGFzc05hbWUgPSBcInRlbXBcIjtcbiAgICAgICAgLy8gc2hvdyBzaG93RGlzcGxheSB2YWx1ZSBiYXNlZCBvbiBjaHJvbWUgc3RvcmFnZVxuICAgICAgICB2YXIgc2hvd0Rpc3BsYXlWYWwgPSBcIm9uXCI7XG4gICAgICAgIGlmICgnc2hvd0Rpc3BsYXknIGluIHJlc3VsdCkge1xuICAgICAgICAgICAgc2hvd0Rpc3BsYXlWYWwgPSByZXN1bHQuc2hvd0Rpc3BsYXk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IFwib25cIjtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNob3dEaXNwbGF5OiBcIm9uXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNob3dEaXNwbGF5VmFsID09IFwib25cIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJzaG93IGRpc3BsYXk6IFwiICsgc2hvd0Rpc3BsYXlWYWw7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3Nob3dEaXNwbGF5JywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciBzaG93RGlzcGxheVZhbCA9IHJlc3VsdC5zaG93RGlzcGxheTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gXCJvZmZcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IFwib25cIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hvd0Rpc3BsYXk6IHNob3dEaXNwbGF5VmFsIH0pO1xuICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LmlubmVySFRNTCA9IFwic2hvdyBkaXNwbGF5OiBcIiArIHNob3dEaXNwbGF5VmFsO1xuICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLnJlbG9hZFBvcG92ZXIpKHRleHRib3gsIHByb21wdFRleHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5Lm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZUJveC5hcHBlbmRDaGlsZCh0b2dnbGVTaG93RGlzcGxheSk7XG4gICAgfSk7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVByb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZVNoYXJlUHJvbXB0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjFyZW1cIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgLy8gc2hvdyBzaG93RGlzcGxheSB2YWx1ZSBiYXNlZCBvbiBjaHJvbWUgc3RvcmFnZVxuICAgICAgICB2YXIgc2hhcmVQcm9tcHRzVmFsID0gXCJvblwiO1xuICAgICAgICBpZiAoJ3NoYXJlUHJvbXB0cycgaW4gcmVzdWx0ICYmIChyZXN1bHQuc2hhcmVQcm9tcHRzID09ICdvbicgfHwgcmVzdWx0LnNoYXJlUHJvbXB0cyA9PSAnb2ZmJykpIHtcbiAgICAgICAgICAgIHNoYXJlUHJvbXB0c1ZhbCA9IHJlc3VsdC5zaGFyZVByb21wdHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzaGFyZVByb21wdHNWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVByb21wdHM6IHNoYXJlUHJvbXB0c1ZhbCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hhcmVQcm9tcHRzVmFsID09IFwib25cIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzaGFyZVByb21wdHNWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgfVxuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuaW5uZXJIVE1MID0gXCJzYXZlIHByb21wdHMgJiByZXN1bHRzOiBcIiArIHNoYXJlUHJvbXB0c1ZhbDtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsID0gcmVzdWx0LnNoYXJlUHJvbXB0cztcbiAgICAgICAgICAgICAgICBpZiAodG9nZ2xlU2hhcmVQcm9tcHRzVmFsID09IFwib25cIikge1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHNWYWwgPSBcIm9mZlwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUHJvbXB0czogXCJvZmZcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodG9nZ2xlU2hhcmVQcm9tcHRzVmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsID0gXCJvblwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUHJvbXB0czogXCJvblwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuaW5uZXJIVE1MID0gXCJzYXZlIHByb21wdHMgJiByZXN1bHRzOiBcIiArIHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZUJveC5hcHBlbmRDaGlsZCh0b2dnbGVTaGFyZVByb21wdHMpO1xuICAgIH0pO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVSZXNwb25zZXMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZVNoYXJlUmVzcG9uc2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxcmVtXCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgLy8gc2hvdyBzaG93RGlzcGxheSB2YWx1ZSBiYXNlZCBvbiBjaHJvbWUgc3RvcmFnZVxuICAgICAgICB2YXIgc2hhcmVSZXNwb25zZXNWYWwgPSBcIm9uXCI7XG4gICAgICAgIGlmICgnc2hhcmVSZXNwb25zZXMnIGluIHJlc3VsdCAmJiByZXN1bHQuc2hhcmVSZXNwb25zZXMgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gcmVzdWx0LnNoYXJlUmVzcG9uc2VzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2hhcmVSZXNwb25zZXNWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVJlc3BvbnNlczogXCJvblwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNoYXJlUmVzcG9uc2VzVmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLmlubmVySFRNTCA9IFwic2hhcmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVSZXNwb25zZXNWYWw7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUmVzcG9uc2VzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciBzaGFyZVJlc3BvbnNlc1ZhbCA9IHJlc3VsdC5zaGFyZVJlc3BvbnNlcztcbiAgICAgICAgICAgICAgICBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gXCJvZmZcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgICAgICAgICBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib25cIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVSZXNwb25zZXM6IHNoYXJlUmVzcG9uc2VzVmFsIH0pO1xuICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLmlubmVySFRNTCA9IFwic2hhcmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVSZXNwb25zZXNWYWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNoYXJlUmVzcG9uc2VzKTtcbiAgICB9KTtcbiAgICBwb3BvdmVyLmFwcGVuZENoaWxkKHRvZ2dsZUJveCk7XG4gICAgLy8gbG9hZCBpbiB0aGUgc3VnZ2VzdGlvbnNcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydwcm9tcHRzJywgJ3Nob3dEaXNwbGF5J10sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKCdzaG93RGlzcGxheScgaW4gcmVzdWx0ICYmIHJlc3VsdC5zaG93RGlzcGxheSA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIHZhciBwcm9tcHREaWN0ID0ge307XG4gICAgICAgICAgICBpZiAocmVzdWx0LnByb21wdHMpIHtcbiAgICAgICAgICAgICAgICBwcm9tcHREaWN0ID0gSlNPTi5wYXJzZShyZXN1bHQucHJvbXB0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJvbXB0TWF0Y2hMaXN0ID0gW107XG4gICAgICAgICAgICB2YXIgcHJvbXB0VGV4dExpc3QgPSBwcm9tcHRUZXh0LnNwbGl0KCcgJyk7XG4gICAgICAgICAgICB2YXIgYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHNvcnQsIHJldHVybnMgb2xkZXN0IC0tPiBuZXdlc3RcbiAgICAgICAgICAgIHZhciBzb3J0ZWRQcm9tcHRMaXN0ID0gT2JqZWN0LmVudHJpZXMocHJvbXB0RGljdCkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhWzFdWydsYXN0VXNlZCddIC0gYlsxXVsnbGFzdFVzZWQnXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzb3J0ZWQgcHJvbXB0IGxpc3Q6IFwiLCBzb3J0ZWRQcm9tcHRMaXN0KTtcbiAgICAgICAgICAgIC8vIHJldHVybiB0b3AgTiByZXN1bHRzXG4gICAgICAgICAgICB2YXIgcmV0dXJuVG9wTiA9IDg7XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBba2V5LCB2YWx1ZV0gb2Ygc29ydGVkUHJvbXB0TGlzdC5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgICAgICBhZGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBwcm9tcHRUZXh0TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAod29yZCAmJiB3b3JkICE9IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd29yZElkeCA9IGtleS5pbmRleE9mKHdvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRJZHggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYm9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGtleS5zdWJzdHJpbmcoMCwgd29yZElkeCkgKyBcIjxiPlwiICsga2V5LnN1YnN0cmluZyh3b3JkSWR4LCB3b3JkSWR4ICsgd29yZC5sZW5ndGgpICsgXCI8L2I+XCIgKyBrZXkuc3Vic3RyaW5nKHdvcmRJZHggKyB3b3JkLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdE1hdGNoTGlzdC5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXIgPj0gcmV0dXJuVG9wTikge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBjb3VudGVyIGlzIDwgcmV0dXJuVG9wTiwgcmV0dXJuIHJldHVyblRvcE4gLSBjb3VudGVyIGZyb20gREJcbiAgICAgICAgICAgIC8vIGdldCBhIGxpc3QgYmFzZWQgb24gd29yZHMsIGFuZCBqdXN0IGtlZXAgb24gYWRqdXN0aW5nIHRoYXQgbGlzdD9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHJvbXB0TWF0Y2hsaXN0OiBcIiwgcHJvbXB0TWF0Y2hMaXN0KTtcbiAgICAgICAgICAgIHZhciBhZGRpdGlvbmFsUHJvbXB0c05lZWRlZCA9IHJldHVyblRvcE4gLSBjb3VudGVyO1xuICAgICAgICAgICAgLy8gdmFyIGFkZGl0aW9uYWxQcm9tcHRzTmVlZGVkID0gMlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb29raW5nIGZvcjogXCIsIGFkZGl0aW9uYWxQcm9tcHRzTmVlZGVkKTtcbiAgICAgICAgICAgIHZhciBzZWFyY2hRdWVyeSA9IHByb21wdFRleHQ7XG4gICAgICAgICAgICAvLyB2YXIgc2VhcmNoUXVlcnkgPSBcIlNwYWluIGNhcGl0YWxcIlxuICAgICAgICAgICAgaWYgKGFkZGl0aW9uYWxQcm9tcHRzTmVlZGVkID4gMCkge1xuICAgICAgICAgICAgICAgIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjkwOTAvaW5zdGFuY2UvZ2V0RmlsdGVyZWQ/c2VhcmNoPSR7c2VhcmNoUXVlcnl9JmxpbWl0PSR7YWRkaXRpb25hbFByb21wdHNOZWVkZWR9YClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKERCcHJvbXB0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBnZXR0aW5nIHJlc3BvbnNlcyBmcm9tIERCXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgREJwcm9tcHQgb2YgREJwcm9tcHRzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgREJwcm9tcHRUZXh0ID0gREJwcm9tcHQucHJvbXB0O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHByb21wdFRleHRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmQgJiYgd29yZCAhPSBcIiBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd29yZElkeCA9IERCcHJvbXB0VGV4dC5pbmRleE9mKHdvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYm9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQnByb21wdFRleHQgPSBEQnByb21wdFRleHQuc3Vic3RyaW5nKDAsIHdvcmRJZHgpICsgXCI8Yj5cIiArIERCcHJvbXB0VGV4dC5zdWJzdHJpbmcod29yZElkeCwgd29yZElkeCArIHdvcmQubGVuZ3RoKSArIFwiPC9iPlwiICsgREJwcm9tcHRUZXh0LnN1YnN0cmluZyh3b3JkSWR4ICsgd29yZC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRpdGlvbmFsREJwcm9tcHQgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREJwcm9tcHRUZXh0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zd2VyXCI6IEpTT04ucGFyc2UoREJwcm9tcHQuYW5zd2VyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2FnZUNvdW50XCI6IERCcHJvbXB0LnVzYWdlQ291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdE1hdGNoTGlzdC5wdXNoKGFkZGl0aW9uYWxEQnByb21wdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIERCcHJvbXB0cyB0byBwcm9tcHRNYXRjaGxpc3RcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIRVJFIElTIFRIRSBVUERBVEVEIFBST01QVCBNQVRDSCBMSVNUOiBcIiwgcHJvbXB0TWF0Y2hMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGNvbWJpbmVkIERCIGFuZCBsb2NhbCBwcm9tcHRzIHRvIHBvcG92ZXJcbiAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0TGlzdCkodGV4dGJveCwgcHJvbXB0TWF0Y2hMaXN0LCBwb3BvdmVyKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiB3ZSBjdXJyZW50bHkgY2Fubm90IGFjY2VzcyB0aGUgc2hhcmVkIGRhdGFiYXNlJyk7XG4gICAgICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmFkZFByb21wdExpc3QpKHRleHRib3gsIHByb21wdE1hdGNoTGlzdCwgcG9wb3Zlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBubyBuZWVkIGZvciBEQlxuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmFkZFByb21wdExpc3QpKHRleHRib3gsIHByb21wdE1hdGNoTGlzdCwgcG9wb3Zlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgc3VnZ2VzdGlvbkJveEVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNzdWdnZXN0aW9uQm94XCIpO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveEVsZW1lbnRzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgZWwucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHBvcG92ZXIuaWQgPSBcInBvcG92ZXJcIjtcbiAgICByZXR1cm4gcG9wb3Zlcjtcbn07XG5leHBvcnRzLmdldFBvcG92ZXIgPSBnZXRQb3BvdmVyO1xuY29uc3QgYWRkUHJvbXB0TGlzdCA9ICh0ZXh0Ym94LCBwcm9tcHRNYXRjaExpc3QsIHBvcG92ZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IFtwcm9tcHQsIHZhbF0gb2YgcHJvbXB0TWF0Y2hMaXN0KSB7XG4gICAgICAgIGlmICh0ZXh0Ym94LnZhbHVlICE9IHByb21wdC5yZXBsYWNlQWxsKFwiPGI+XCIsIFwiXCIpLnJlcGxhY2VBbGwoXCI8L2I+XCIsIFwiXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBzdWdnZXN0aW9uQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guaWQgPSBcInN1Z2dlc3Rpb25Cb3hcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5wYWRkaW5nID0gXCIxMHB4XCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiLjM3NXJlbVwiO1xuICAgICAgICAgICAgY29uc3QgaWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBpY29uRGl2LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgICAgICBjb25zdCB0ZXh0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXh0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUub3ZlcmZsb3dYID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICBjb25zdCBhbnN3ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWFyZ2luTGVmdCA9IFwiMTVweFwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5pbm5lckhUTUwgPSB2YWwuYW5zd2VyO1xuICAgICAgICAgICAgdGV4dERpdi5pbm5lckhUTUwgPSBwcm9tcHQ7XG4gICAgICAgICAgICBpZiAoXCJsYXN0VXNlZFwiIGluIHZhbCkge1xuICAgICAgICAgICAgICAgIC8vIGZyb20gbG9jYWxcbiAgICAgICAgICAgICAgICBpY29uRGl2LmlubmVySFRNTCA9IFwi8J+Vk1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZnJvbSBEQlxuICAgICAgICAgICAgICAgIGljb25EaXYuaW5uZXJIVE1MID0gXCLwn5SNXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCIxMDAlXCI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjEyNXB4XCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMTI1cHhcIjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdUZXh0ID0gcHJvbXB0LnJlcGxhY2VBbGwoXCI8Yj5cIiwgXCJcIikucmVwbGFjZUFsbChcIjwvYj5cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIHRleHRib3gudmFsdWUgPSBuZXdUZXh0O1xuICAgICAgICAgICAgICAgICAgICAoMCwgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMS5lZGl0UHJvbXB0VGV4dCkobmV3VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLnJlbG9hZFBvcG92ZXIpKHRleHRib3gsIG5ld1RleHQpO1xuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRleHRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKHRleHREaXYpO1xuICAgICAgICAgICAgdGV4dFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoYW5zd2VyRGl2KTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guYXBwZW5kQ2hpbGQoaWNvbkRpdik7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LmFwcGVuZENoaWxkKHRleHRXcmFwcGVyRGl2KTtcbiAgICAgICAgICAgIGlmICghKFwibGFzdFVzZWRcIiBpbiB2YWwpKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRkIHVzYWdlIGNvdW50XG4gICAgICAgICAgICAgICAgY29uc3QgdXNhZ2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHVzYWdlRGl2LnN0eWxlLm1hcmdpbkxlZnQgPSBcIjEwcHhcIjtcbiAgICAgICAgICAgICAgICB1c2FnZURpdi5pbm5lckhUTUwgPSBcIuKYhSBcIiArIHZhbC51c2FnZUNvdW50O1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guYXBwZW5kQ2hpbGQodXNhZ2VEaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9wb3Zlci5hcHBlbmRDaGlsZChzdWdnZXN0aW9uQm94KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLmFkZFByb21wdExpc3QgPSBhZGRQcm9tcHRMaXN0O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL2NvbnRlbnRTY3JpcHQvYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJcIik7XG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJjaGVjayB3YXMgY2FsbGVkIVwiKTtcbiAgICBzd2l0Y2ggKHJlcXVlc3QuYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgXCJ3ZWJzaXRlIGxvYWRlZFwiOlxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjaGVjayB3YXMgY2FsbGVkIVwiKTtcbiAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLmFkZFByb21wdFNlYXJjaExpc3RlbmVyKSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogXCJzdWNjZXNzXCIgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==