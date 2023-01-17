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
exports.addPromptToDB = exports.editPromptText = exports.reloadPopover = exports.hidePopover = exports.showPopover = exports.checkFinishAnswering = exports.savePrompt = exports.addPromptSearchListener = exports.URL = void 0;
const popover_1 = __webpack_require__(/*! ./popover */ "./src/contentScript/popover.ts");
// import { getPopoverAnywhere } from "./popoverAnywhere";
// just for constantly checking what's the latest answer div
var latestAnswerDiv = document.createElement("div");
var promptText = "";
var textareabox = document.createElement("textarea");
exports.URL = "https://auto-gpt.herokuapp.com";
const addPromptSearchListener = () => {
    console.log("Starting CSS Reload Edits!");
    // TODO: fix so that it automatically pops up when you navigate to a page
    // Problem: even if URL changes, the textarea doesn't always change immediately
    // Current scenario, user has to click or start typing
    document.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
        var item = event.target;
        if (item instanceof HTMLTextAreaElement) {
            textareabox = item;
            if (textareabox.value) {
                promptText = textareabox.value;
            }
            else {
                promptText = "";
            }
            (0, exports.reloadPopover)(item, promptText);
        }
        var body = document.getElementsByClassName('flex flex-col items-center text-sm h-full dark:bg-gray-800')[0];
        if (body.contains(item)) {
            (0, exports.hidePopover)();
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
        setTimeout(function () {
            if (item instanceof HTMLTextAreaElement) {
                // save to local chrome storage
                textareabox = item;
                if (textareabox.value) {
                    if (event.key != "Backspace") {
                        promptText = textareabox.value;
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
        }, 100);
    }));
};
exports.addPromptSearchListener = addPromptSearchListener;
// save prompt
const savePrompt = (promptText) => __awaiter(void 0, void 0, void 0, function* () {
    // sharePrompts temporarily means save prompts and results locally
    chrome.storage.local.get('sharePrompts', function (result) {
        if (result.sharePrompts == "on") {
            if (textareabox.value) {
                promptText = textareabox.value;
            }
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
    setTimeout(function () {
        if (p) {
            p.style.visibility = "hidden";
            p.style.height = "0px";
        }
    }, 100);
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
            fetch(`${exports.URL}/instance/getPrompt?prompt=${promptText}`).then((res) => res.json())
                .then((res) => {
                if (res && res.message != 'not found') {
                    // update
                    var paramsUpdate = { prompt: promptText, answer: res.instance.answer, usageCount: res.instance.usageCount + 1 };
                    var optionsUpdate = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(paramsUpdate),
                    };
                    fetch(`${exports.URL}/instance/update/${res.instance._id}`, optionsUpdate).then((res) => res.json())
                        .then((res) => {
                        // console.log("DB update: ", res)
                    });
                }
                else {
                    // else: add it as a new prompt
                    var paramsCreate = { prompt: promptText, answer: answerText, usageCount: 1 };
                    var optionsCreate = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(paramsCreate),
                    };
                    fetch(`${exports.URL}/instance/create`, optionsCreate).then((res) => res.json())
                        .then((res) => {
                        // console.log("DB create: ", res)
                    });
                }
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
            var additionalPromptsNeeded = returnTopN - counter;
            var searchQuery = promptText;
            if (additionalPromptsNeeded > 0) {
                fetch(`${addPromptSearchListener_1.URL}/instance/getFiltered?search=${searchQuery}&limit=${additionalPromptsNeeded}`)
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
    var promptsUsed = [];
    for (const [prompt, val] of promptMatchList) {
        if (!(prompt in promptsUsed) && textbox.value != prompt.replaceAll("<b>", "").replaceAll("</b>", "")) {
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
                    suggestionBox.remove();
                    // update
                    fetch(`${addPromptSearchListener_1.URL}/instance/getPrompt?prompt=${newText}`).then((res) => res.json())
                        .then((res) => {
                        if (res && res.message != 'not found') {
                            // update
                            var paramsUpdate = { prompt: newText, answer: res.instance.answer, usageCount: res.instance.usageCount + 1 };
                            var optionsUpdate = {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(paramsUpdate),
                            };
                            fetch(`${addPromptSearchListener_1.URL}/instance/update/${res.instance._id}`, optionsUpdate).then((res) => res.json())
                                .then((res) => {
                            });
                        }
                    });
                    (0, addPromptSearchListener_1.editPromptText)(newText);
                    (0, addPromptSearchListener_1.reloadPopover)(textbox, newText);
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
            promptsUsed.push(prompt);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L2FkZFByb21wdFNlYXJjaExpc3RlbmVyLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvbnRlbnRTY3JpcHQvcG9wb3Zlci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50X3NjcmlwdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRQcm9tcHRUb0RCID0gZXhwb3J0cy5lZGl0UHJvbXB0VGV4dCA9IGV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IGV4cG9ydHMuaGlkZVBvcG92ZXIgPSBleHBvcnRzLnNob3dQb3BvdmVyID0gZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGV4cG9ydHMuc2F2ZVByb21wdCA9IGV4cG9ydHMuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSBleHBvcnRzLlVSTCA9IHZvaWQgMDtcbmNvbnN0IHBvcG92ZXJfMSA9IHJlcXVpcmUoXCIuL3BvcG92ZXJcIik7XG4vLyBpbXBvcnQgeyBnZXRQb3BvdmVyQW55d2hlcmUgfSBmcm9tIFwiLi9wb3BvdmVyQW55d2hlcmVcIjtcbi8vIGp1c3QgZm9yIGNvbnN0YW50bHkgY2hlY2tpbmcgd2hhdCdzIHRoZSBsYXRlc3QgYW5zd2VyIGRpdlxudmFyIGxhdGVzdEFuc3dlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG52YXIgcHJvbXB0VGV4dCA9IFwiXCI7XG52YXIgdGV4dGFyZWFib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG5leHBvcnRzLlVSTCA9IFwiaHR0cHM6Ly9hdXRvLWdwdC5oZXJva3VhcHAuY29tXCI7XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nIENTUyBSZWxvYWQgRWRpdHMhXCIpO1xuICAgIC8vIFRPRE86IGZpeCBzbyB0aGF0IGl0IGF1dG9tYXRpY2FsbHkgcG9wcyB1cCB3aGVuIHlvdSBuYXZpZ2F0ZSB0byBhIHBhZ2VcbiAgICAvLyBQcm9ibGVtOiBldmVuIGlmIFVSTCBjaGFuZ2VzLCB0aGUgdGV4dGFyZWEgZG9lc24ndCBhbHdheXMgY2hhbmdlIGltbWVkaWF0ZWx5XG4gICAgLy8gQ3VycmVudCBzY2VuYXJpbywgdXNlciBoYXMgdG8gY2xpY2sgb3Igc3RhcnQgdHlwaW5nXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgaXRlbSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XG4gICAgICAgICAgICB0ZXh0YXJlYWJveCA9IGl0ZW07XG4gICAgICAgICAgICBpZiAodGV4dGFyZWFib3gudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gdGV4dGFyZWFib3gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICgwLCBleHBvcnRzLnJlbG9hZFBvcG92ZXIpKGl0ZW0sIHByb21wdFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgdGV4dC1zbSBoLWZ1bGwgZGFyazpiZy1ncmF5LTgwMCcpWzBdO1xuICAgICAgICBpZiAoYm9keS5jb250YWlucyhpdGVtKSkge1xuICAgICAgICAgICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaG93IHRvIGZpZ3VyZSBvdXQgd2hlbiBzb21ldGhpbmcgaXMgY2xpY2tlZFxuICAgICAgICAvLyBzYXZlIHByb21wdCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgIC8vIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIHctZnVsbCBweS0yIGZsZXgtZ3JvdyBtZDpweS0zIG1kOnBsLTQgcmVsYXRpdmUgYm9yZGVyIGJvcmRlci1ibGFjay8xMCBiZy13aGl0ZSBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCBkYXJrOnRleHQtd2hpdGUgZGFyazpiZy1ncmF5LTcwMCByb3VuZGVkLW1kIHNoYWRvdy1bMF8wXzEwcHhfcmdiYSgwLDAsMCwwLjEwKV0gZGFyazpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMCwwLDAsMC4xMCldJylcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Fic29sdXRlIHAtMSByb3VuZGVkLW1kIHRleHQtZ3JheS01MDAgYm90dG9tLTEuNSByaWdodC0xIG1kOmJvdHRvbS0yLjUgbWQ6cmlnaHQtMiBob3ZlcjpiZy1ncmF5LTEwMCBkYXJrOmhvdmVyOnRleHQtZ3JheS00MDAgZGFyazpob3ZlcjpiZy1ncmF5LTkwMCBkaXNhYmxlZDpob3ZlcjpiZy10cmFuc3BhcmVudCBkYXJrOmRpc2FibGVkOmhvdmVyOmJnLXRyYW5zcGFyZW50Jyk7XG4gICAgICAgIGlmIChidXR0b25bMF0uY29udGFpbnMoaXRlbSkgfHwgYnV0dG9uWzBdID09IGl0ZW0pIHtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnNhdmVQcm9tcHQpKHByb21wdFRleHQpO1xuICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9KSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8ganVzdCBtZXNzaW5nIHdpdGggaWYgaXQgd29ya3Mgb24gYW55IHBsYWNlXG4gICAgICAgIC8vIHZhciB0YXJnZXRFbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAvLyB2YXIgcGFyZW50RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ/LnBhcmVudE5vZGU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldEVsZW1lbnQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwYXJlbnRFbGVtZW50KTtcbiAgICAgICAgLy8gaWYgKHBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgLy8gICBnZXRQb3BvdmVyQW55d2hlcmUodGFyZ2V0RWxlbWVudCBhcyBIVE1MRWxlbWVudCwgcHJvbXB0VGV4dCwgdGFyZ2V0RWxlbWVudCBhcyBIVE1MRWxlbWVudClcbiAgICAgICAgLy8gICAvLyBMQVRFUjogbmVlZCB0byBhZGQgYXR0cmlidXRlcywgcmVtb3ZlIHBvcHVwcyBhcyB0aGV5IGNvbWUgYWxvbmcgbGlrZSByZWxvYWQgcG9wdXBcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBtZXNzaW5nIGFyb3VuZCBlbmRzXG4gICAgICAgIHZhciBpdGVtID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIC8vIHNhdmUgdG8gbG9jYWwgY2hyb21lIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICB0ZXh0YXJlYWJveCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgaWYgKHRleHRhcmVhYm94LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkgIT0gXCJCYWNrc3BhY2VcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlLnN1YnN0cmluZygwLCB0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBvbmx5IHJlbG9hZCBpZiB5b3UndmUgdHlwZWQgYXQgbGVhc3Qgb25lIHdvcmQ/XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIiBcIikge1xuICAgICAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgeW91IGhpdCBiYWNrc3BhY2Ugb24gYSBzcGFjZSAvIGRlbGV0ZSBhIHdvcmQgb3IgeW91IGNsZWFyZWQgZXZlcnl0aGluZyBvdXRcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09IFwiQmFja3NwYWNlXCIgJiYgKHRleHRhcmVhYm94LnZhbHVlW3RleHRhcmVhYm94LnZhbHVlLmxlbmd0aCAtIDFdID09IFwiIFwiIHx8IHRleHRhcmVhYm94LnZhbHVlLmxlbmd0aCA9PSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzYXZlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuc2F2ZVByb21wdCkocHJvbXB0VGV4dCk7XG4gICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG4gICAgfSkpO1xufTtcbmV4cG9ydHMuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcjtcbi8vIHNhdmUgcHJvbXB0XG5jb25zdCBzYXZlUHJvbXB0ID0gKHByb21wdFRleHQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIC8vIHNoYXJlUHJvbXB0cyB0ZW1wb3JhcmlseSBtZWFucyBzYXZlIHByb21wdHMgYW5kIHJlc3VsdHMgbG9jYWxseVxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVQcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnNoYXJlUHJvbXB0cyA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYWJveC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1heWJlIGNyZWF0ZSBhbiBhZGQgdG8gc3RvcmFnZSBhbmQgaGF2ZSBpdCBhdCB0aGUgZW5kIG9mIGNoZWNrRmluaXNoQW5zd2VyaW5nKCk/XG4gICAgICAgICAgICAvLyByZXRyaWV2aW5nIGZyb20gbG9jYWwgc3RvcmFnZSwgY2FuIGFsc28ganVzdCBzdG9yZSBhcyBhIHZhcmlhYmxlIGhlcmUgaWYgd2Ugc2VyaW91c2x5IGNhbm5vdCB3YWl0XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3Byb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb21wdERpY3Q7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5wcm9tcHRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdERpY3QgPSBKU09OLnBhcnNlKHJlc3VsdC5wcm9tcHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdERpY3QgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuY2hlY2tGaW5pc2hBbnN3ZXJpbmcpKHByb21wdERpY3QsIHByb21wdFRleHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAoMCwgZXhwb3J0cy5oaWRlUG9wb3ZlcikoKTtcbn0pO1xuZXhwb3J0cy5zYXZlUHJvbXB0ID0gc2F2ZVByb21wdDtcbmNvbnN0IGNoZWNrRmluaXNoQW5zd2VyaW5nID0gKHByb21wdERpY3QsIHByb21wdFRleHQpID0+IHtcbiAgICAvLyBmb3IgdHJhY2tpbmcgd2hlbiB0aGUgYnV0dG9uIGFwcGVhcnMsIHNpZ25pZnlpbmcgaXQgaXMgZG9uZSBhbnN3ZXJpbmdcbiAgICB2YXIgb2JzZXJ2ZXJCdXR0b24gPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zKSB7XG4gICAgICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJjaGlsZExpc3RcIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWRkZWROb2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFkZGVkTm9kZS50YWdOYW1lID09PSBcInN2Z1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlbXBvcmFyeSBiZWNhdXNlIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG9ubHkgZWxlbWVudCB0aGF0IHVwZGF0ZXMgcHJvcGVybHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcEFuc3dlckRpdlRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnX19uZXh0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBNYWluID0gdGVtcEFuc3dlckRpdlRleHQuY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcERpdkNvbGxlY3Rpb24gPSB0ZW1wTWFpbi5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF0ZXN0QW5zd2VyRGl2VGVtcENvbGxlY3Rpb24gPSB0ZW1wRGl2Q29sbGVjdGlvbi5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXRlc3RBbnN3ZXJEaXZUZW1wID0gbGF0ZXN0QW5zd2VyRGl2VGVtcENvbGxlY3Rpb25bdGVtcERpdkNvbGxlY3Rpb24uY2hpbGROb2Rlcy5sZW5ndGggLSAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VyRGl2VGV4dCA9IGxhdGVzdEFuc3dlckRpdlRlbXAgPT09IG51bGwgfHwgbGF0ZXN0QW5zd2VyRGl2VGVtcCA9PT0gdm9pZCAwID8gdm9pZCAwIDogbGF0ZXN0QW5zd2VyRGl2VGVtcC5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29kZSB0byBhZGQgdGhlIGFuc3dlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdERpY3RbcHJvbXB0VGV4dC50cmltKCldID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlckRpdlRleHQuaW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2FnZUNvdW50OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VXNlZDogKG5ldyBEYXRlKCkpLnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcHJvbXB0czogSlNPTi5zdHJpbmdpZnkocHJvbXB0RGljdCkgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0VG9EQikocHJvbXB0VGV4dC50cmltKCksIEpTT04uc3RyaW5naWZ5KGFuc3dlckRpdlRleHQuaW5uZXJIVE1MKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0W3Byb21wdFRleHQudHJpbSgpXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBcIjxwPlVuYXZhaWxhYmxlPHA+XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzYWdlQ291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVc2VkOiAobmV3IERhdGUoKSkudmFsdWVPZigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwcm9tcHRzOiBKU09OLnN0cmluZ2lmeShwcm9tcHREaWN0KSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5hZGRQcm9tcHRUb0RCKShwcm9tcHRUZXh0LnRyaW0oKSwgXCI8cD5VbmF2YWlsYWJsZTxwPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfSk7XG4gICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgfTtcbiAgICB2YXIgdGV4dGJveEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZmxleCBmbGV4LWNvbCB3LWZ1bGwgcHktMiBmbGV4LWdyb3cgbWQ6cHktMyBtZDpwbC00IHJlbGF0aXZlIGJvcmRlciBib3JkZXItYmxhY2svMTAgYmctd2hpdGUgZGFyazpib3JkZXItZ3JheS05MDAvNTAgZGFyazp0ZXh0LXdoaXRlIGRhcms6YmctZ3JheS03MDAgcm91bmRlZC1tZCBzaGFkb3ctWzBfMF8xMHB4X3JnYmEoMCwwLDAsMC4xMCldIGRhcms6c2hhZG93LVswXzBfMTVweF9yZ2JhKDAsMCwwLDAuMTApXScpWzBdO1xuICAgIG9ic2VydmVyQnV0dG9uLm9ic2VydmUodGV4dGJveEVsLCBjb25maWcpO1xufTtcbmV4cG9ydHMuY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSBjaGVja0ZpbmlzaEFuc3dlcmluZztcbi8vIHNob3cgcG9wb3ZlclxuY29uc3Qgc2hvd1BvcG92ZXIgPSAoKSA9PiB7XG4gICAgdmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcG92ZXJcIik7XG4gICAgaWYgKHApIHtcbiAgICAgICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIHAuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgfVxufTtcbmV4cG9ydHMuc2hvd1BvcG92ZXIgPSBzaG93UG9wb3Zlcjtcbi8vIGhpZGUgcG9wb3ZlclxuY29uc3QgaGlkZVBvcG92ZXIgPSAoKSA9PiB7XG4gICAgdmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcG92ZXJcIik7XG4gICAgLy8gVE9ETzogcHV0IGJhY2sgYWZ0ZXIgZGVidWdnaW5nXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChwKSB7XG4gICAgICAgICAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgcC5zdHlsZS5oZWlnaHQgPSBcIjBweFwiO1xuICAgICAgICB9XG4gICAgfSwgMTAwKTtcbn07XG5leHBvcnRzLmhpZGVQb3BvdmVyID0gaGlkZVBvcG92ZXI7XG4vLyBtYWluIGNvZGUgdG8gc2hvdyBwb3B1cFxuY29uc3QgcmVsb2FkUG9wb3ZlciA9ICh0ZXh0Ym94LCBwcm9tcHRUZXh0KSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdmVyXCIpO1xuICAgIGlmIChwKSB7XG4gICAgICAgIHAucmVtb3ZlKCk7XG4gICAgfVxuICAgIHAgPSAoMCwgcG9wb3Zlcl8xLmdldFBvcG92ZXIpKHRleHRib3gsIHByb21wdFRleHQpO1xuICAgIHZhciB0ZXh0Ym94V3JhcHBlciA9IChfYSA9IHRleHRib3gucGFyZW50RWxlbWVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBhcmVudEVsZW1lbnQ7XG4gICAgdmFyIHRleHRib3hNaWRXcmFwcGVyID0gdGV4dGJveC5wYXJlbnRFbGVtZW50O1xuICAgIHRleHRib3hXcmFwcGVyID09PSBudWxsIHx8IHRleHRib3hXcmFwcGVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0ZXh0Ym94V3JhcHBlci5pbnNlcnRCZWZvcmUocCwgdGV4dGJveE1pZFdyYXBwZXIpO1xuICAgIHAuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0ZXh0Ym94KSB7XG4gICAgICAgICgwLCBleHBvcnRzLnNob3dQb3BvdmVyKSgpO1xuICAgIH1cbiAgICAvLyB0ZXh0Ym94IGlzIGN1cnJlbnRseSBiZWluZyBjaGFuZ2VkXG4gICAgaWYgKHRleHRib3guYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICB0ZXh0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxuICAgIC8vIHRleHRib3ggaGFzIGJlZW4gY2xpY2tlZCBiYWNrIHRvXG4gICAgdGV4dGJveC5vbmZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAoMCwgZXhwb3J0cy5zaG93UG9wb3ZlcikoKTtcbiAgICB9O1xufTtcbmV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IHJlbG9hZFBvcG92ZXI7XG5jb25zdCBlZGl0UHJvbXB0VGV4dCA9IChlZGl0KSA9PiB7XG4gICAgcHJvbXB0VGV4dCA9IGVkaXQ7XG59O1xuZXhwb3J0cy5lZGl0UHJvbXB0VGV4dCA9IGVkaXRQcm9tcHRUZXh0O1xuY29uc3QgYWRkUHJvbXB0VG9EQiA9IChwcm9tcHRUZXh0LCBhbnN3ZXJUZXh0KSA9PiB7XG4gICAgLy8gc2hhcmVSZXNwb25zZXMgaXMgdGVtcG9yYXJ5IGNocm9tZSBzdG9yYWdlIGZvciBzaGFyZSBwcm9tcHRzIGFuZCByZXN1bHRzIHB1YmxpY2x5XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVJlc3BvbnNlcycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zaGFyZVJlc3BvbnNlcyA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIGZldGNoKGAke2V4cG9ydHMuVVJMfS9pbnN0YW5jZS9nZXRQcm9tcHQ/cHJvbXB0PSR7cHJvbXB0VGV4dH1gKS50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgcmVzLm1lc3NhZ2UgIT0gJ25vdCBmb3VuZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXNVcGRhdGUgPSB7IHByb21wdDogcHJvbXB0VGV4dCwgYW5zd2VyOiByZXMuaW5zdGFuY2UuYW5zd2VyLCB1c2FnZUNvdW50OiByZXMuaW5zdGFuY2UudXNhZ2VDb3VudCArIDEgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNVcGRhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXNVcGRhdGUpLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBmZXRjaChgJHtleHBvcnRzLlVSTH0vaW5zdGFuY2UvdXBkYXRlLyR7cmVzLmluc3RhbmNlLl9pZH1gLCBvcHRpb25zVXBkYXRlKS50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRCIHVwZGF0ZTogXCIsIHJlcylcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlOiBhZGQgaXQgYXMgYSBuZXcgcHJvbXB0XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXNDcmVhdGUgPSB7IHByb21wdDogcHJvbXB0VGV4dCwgYW5zd2VyOiBhbnN3ZXJUZXh0LCB1c2FnZUNvdW50OiAxIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zQ3JlYXRlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXNDcmVhdGUpLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBmZXRjaChgJHtleHBvcnRzLlVSTH0vaW5zdGFuY2UvY3JlYXRlYCwgb3B0aW9uc0NyZWF0ZSkudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJEQiBjcmVhdGU6IFwiLCByZXMpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuZXhwb3J0cy5hZGRQcm9tcHRUb0RCID0gYWRkUHJvbXB0VG9EQjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZFByb21wdExpc3QgPSBleHBvcnRzLmdldFBvcG92ZXIgPSB2b2lkIDA7XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJcIik7XG5jb25zdCBnZXRQb3BvdmVyID0gKHRleHRib3gsIHByb21wdFRleHQpID0+IHtcbiAgICAvLyBQb3BvdmVyIGVsZW1lbnRcbiAgICBjb25zdCBwb3BvdmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwb3BvdmVyLnN0eWxlLndpZHRoID0gdGV4dGJveC5zdHlsZS53aWR0aDtcbiAgICBwb3BvdmVyLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgIHBvcG92ZXIuc3R5bGUuekluZGV4ID0gXCIxMFwiO1xuICAgIHBvcG92ZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiLjM3NXJlbVwiO1xuICAgIHBvcG92ZXIuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgIHBvcG92ZXIuc3R5bGUuY29sb3IgPSBcInJnYigyMTAsIDIxNCwgMjE4KVwiO1xuICAgIHBvcG92ZXIuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIHBvcG92ZXIuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiY2VudGVyXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5mbGV4RGlyZWN0aW9uID0gXCJjb2x1bW4tcmV2ZXJzZVwiO1xuICAgIC8vIHBvcG92ZXIuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgIC8vIEFkZCB0b2dnbGVzIHRvIG1lbnVcbiAgICBjb25zdCB0b2dnbGVCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmhlaWdodCA9IFwiNTBweFwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5wYWRkaW5nID0gXCIxMHB4XCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiLjM3NXJlbVwiO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hvd0Rpc3BsYXknLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZVNob3dEaXNwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxcmVtXCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuY2xhc3NOYW1lID0gXCJ0ZW1wXCI7XG4gICAgICAgIC8vIHNob3cgc2hvd0Rpc3BsYXkgdmFsdWUgYmFzZWQgb24gY2hyb21lIHN0b3JhZ2VcbiAgICAgICAgdmFyIHNob3dEaXNwbGF5VmFsID0gXCJvblwiO1xuICAgICAgICBpZiAoJ3Nob3dEaXNwbGF5JyBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gcmVzdWx0LnNob3dEaXNwbGF5O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2hvd0Rpc3BsYXlWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaG93RGlzcGxheTogXCJvblwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93RGlzcGxheVZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNob3dEaXNwbGF5VmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LmlubmVySFRNTCA9IFwic2hvdyBkaXNwbGF5OiBcIiArIHNob3dEaXNwbGF5VmFsO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaG93RGlzcGxheScsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2hvd0Rpc3BsYXlWYWwgPSByZXN1bHQuc2hvd0Rpc3BsYXk7XG4gICAgICAgICAgICAgICAgaWYgKHNob3dEaXNwbGF5VmFsID09IFwib25cIikge1xuICAgICAgICAgICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IFwib2ZmXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNob3dEaXNwbGF5VmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0Rpc3BsYXlWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNob3dEaXNwbGF5OiBzaG93RGlzcGxheVZhbCB9KTtcbiAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5pbm5lckhUTUwgPSBcInNob3cgZGlzcGxheTogXCIgKyBzaG93RGlzcGxheVZhbDtcbiAgICAgICAgICAgICAgICAoMCwgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMS5yZWxvYWRQb3BvdmVyKSh0ZXh0Ym94LCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVCb3guYXBwZW5kQ2hpbGQodG9nZ2xlU2hvd0Rpc3BsYXkpO1xuICAgIH0pO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVQcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBjb25zdCB0b2dnbGVTaGFyZVByb21wdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxcmVtXCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIC8vIHNob3cgc2hvd0Rpc3BsYXkgdmFsdWUgYmFzZWQgb24gY2hyb21lIHN0b3JhZ2VcbiAgICAgICAgdmFyIHNoYXJlUHJvbXB0c1ZhbCA9IFwib25cIjtcbiAgICAgICAgaWYgKCdzaGFyZVByb21wdHMnIGluIHJlc3VsdCAmJiAocmVzdWx0LnNoYXJlUHJvbXB0cyA9PSAnb24nIHx8IHJlc3VsdC5zaGFyZVByb21wdHMgPT0gJ29mZicpKSB7XG4gICAgICAgICAgICBzaGFyZVByb21wdHNWYWwgPSByZXN1bHQuc2hhcmVQcm9tcHRzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2hhcmVQcm9tcHRzVmFsID0gXCJvblwiO1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVQcm9tcHRzOiBzaGFyZVByb21wdHNWYWwgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNoYXJlUHJvbXB0c1ZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2hhcmVQcm9tcHRzVmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLmlubmVySFRNTCA9IFwic2F2ZSBwcm9tcHRzICYgcmVzdWx0czogXCIgKyBzaGFyZVByb21wdHNWYWw7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVByb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbCA9IHJlc3VsdC5zaGFyZVByb21wdHM7XG4gICAgICAgICAgICAgICAgaWYgKHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsID0gXCJvZmZcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVByb21wdHM6IFwib2ZmXCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbCA9IFwib25cIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVByb21wdHM6IFwib25cIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLmlubmVySFRNTCA9IFwic2F2ZSBwcm9tcHRzICYgcmVzdWx0czogXCIgKyB0b2dnbGVTaGFyZVByb21wdHNWYWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVCb3guYXBwZW5kQ2hpbGQodG9nZ2xlU2hhcmVQcm9tcHRzKTtcbiAgICB9KTtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUmVzcG9uc2VzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBjb25zdCB0b2dnbGVTaGFyZVJlc3BvbnNlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiMXJlbVwiO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIC8vIHNob3cgc2hvd0Rpc3BsYXkgdmFsdWUgYmFzZWQgb24gY2hyb21lIHN0b3JhZ2VcbiAgICAgICAgdmFyIHNoYXJlUmVzcG9uc2VzVmFsID0gXCJvblwiO1xuICAgICAgICBpZiAoJ3NoYXJlUmVzcG9uc2VzJyBpbiByZXN1bHQgJiYgcmVzdWx0LnNoYXJlUmVzcG9uc2VzICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBzaGFyZVJlc3BvbnNlc1ZhbCA9IHJlc3VsdC5zaGFyZVJlc3BvbnNlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gXCJvblwiO1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVSZXNwb25zZXM6IFwib25cIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgfVxuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5pbm5lckhUTUwgPSBcInNoYXJlIHByb21wdHMgJiByZXN1bHRzOiBcIiArIHNoYXJlUmVzcG9uc2VzVmFsO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVJlc3BvbnNlcycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2hhcmVSZXNwb25zZXNWYWwgPSByZXN1bHQuc2hhcmVSZXNwb25zZXM7XG4gICAgICAgICAgICAgICAgaWYgKHNoYXJlUmVzcG9uc2VzVmFsID09IFwib25cIikge1xuICAgICAgICAgICAgICAgICAgICBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib2ZmXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNoYXJlUmVzcG9uc2VzVmFsID09IFwib2ZmXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVSZXNwb25zZXNWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUmVzcG9uc2VzOiBzaGFyZVJlc3BvbnNlc1ZhbCB9KTtcbiAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5pbm5lckhUTUwgPSBcInNoYXJlIHByb21wdHMgJiByZXN1bHRzOiBcIiArIHNoYXJlUmVzcG9uc2VzVmFsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZUJveC5hcHBlbmRDaGlsZCh0b2dnbGVTaGFyZVJlc3BvbnNlcyk7XG4gICAgfSk7XG4gICAgcG9wb3Zlci5hcHBlbmRDaGlsZCh0b2dnbGVCb3gpO1xuICAgIC8vIGxvYWQgaW4gdGhlIHN1Z2dlc3Rpb25zXG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFsncHJvbXB0cycsICdzaG93RGlzcGxheSddLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmICgnc2hvd0Rpc3BsYXknIGluIHJlc3VsdCAmJiByZXN1bHQuc2hvd0Rpc3BsYXkgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICB2YXIgcHJvbXB0RGljdCA9IHt9O1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5wcm9tcHRzKSB7XG4gICAgICAgICAgICAgICAgcHJvbXB0RGljdCA9IEpTT04ucGFyc2UocmVzdWx0LnByb21wdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHByb21wdE1hdGNoTGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIHByb21wdFRleHRMaXN0ID0gcHJvbXB0VGV4dC5zcGxpdCgnICcpO1xuICAgICAgICAgICAgdmFyIGFkZCA9IHRydWU7XG4gICAgICAgICAgICAvLyBzb3J0LCByZXR1cm5zIG9sZGVzdCAtLT4gbmV3ZXN0XG4gICAgICAgICAgICB2YXIgc29ydGVkUHJvbXB0TGlzdCA9IE9iamVjdC5lbnRyaWVzKHByb21wdERpY3QpLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVsxXVsnbGFzdFVzZWQnXSAtIGJbMV1bJ2xhc3RVc2VkJ107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIHJldHVybiB0b3AgTiByZXN1bHRzXG4gICAgICAgICAgICB2YXIgcmV0dXJuVG9wTiA9IDg7XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBba2V5LCB2YWx1ZV0gb2Ygc29ydGVkUHJvbXB0TGlzdC5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgICAgICBhZGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBwcm9tcHRUZXh0TGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAod29yZCAmJiB3b3JkICE9IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgd29yZElkeCA9IGtleS5pbmRleE9mKHdvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRJZHggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYm9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGtleS5zdWJzdHJpbmcoMCwgd29yZElkeCkgKyBcIjxiPlwiICsga2V5LnN1YnN0cmluZyh3b3JkSWR4LCB3b3JkSWR4ICsgd29yZC5sZW5ndGgpICsgXCI8L2I+XCIgKyBrZXkuc3Vic3RyaW5nKHdvcmRJZHggKyB3b3JkLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21wdE1hdGNoTGlzdC5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ZXIgPj0gcmV0dXJuVG9wTikge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBjb3VudGVyIGlzIDwgcmV0dXJuVG9wTiwgcmV0dXJuIHJldHVyblRvcE4gLSBjb3VudGVyIGZyb20gREJcbiAgICAgICAgICAgIC8vIGdldCBhIGxpc3QgYmFzZWQgb24gd29yZHMsIGFuZCBqdXN0IGtlZXAgb24gYWRqdXN0aW5nIHRoYXQgbGlzdD9cbiAgICAgICAgICAgIHZhciBhZGRpdGlvbmFsUHJvbXB0c05lZWRlZCA9IHJldHVyblRvcE4gLSBjb3VudGVyO1xuICAgICAgICAgICAgdmFyIHNlYXJjaFF1ZXJ5ID0gcHJvbXB0VGV4dDtcbiAgICAgICAgICAgIGlmIChhZGRpdGlvbmFsUHJvbXB0c05lZWRlZCA+IDApIHtcbiAgICAgICAgICAgICAgICBmZXRjaChgJHthZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLlVSTH0vaW5zdGFuY2UvZ2V0RmlsdGVyZWQ/c2VhcmNoPSR7c2VhcmNoUXVlcnl9JmxpbWl0PSR7YWRkaXRpb25hbFByb21wdHNOZWVkZWR9YClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKERCcHJvbXB0cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBnZXR0aW5nIHJlc3BvbnNlcyBmcm9tIERCXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgREJwcm9tcHQgb2YgREJwcm9tcHRzLmluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgREJwcm9tcHRUZXh0ID0gREJwcm9tcHQucHJvbXB0O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHByb21wdFRleHRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmQgJiYgd29yZCAhPSBcIiBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd29yZElkeCA9IERCcHJvbXB0VGV4dC5pbmRleE9mKHdvcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYm9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQnByb21wdFRleHQgPSBEQnByb21wdFRleHQuc3Vic3RyaW5nKDAsIHdvcmRJZHgpICsgXCI8Yj5cIiArIERCcHJvbXB0VGV4dC5zdWJzdHJpbmcod29yZElkeCwgd29yZElkeCArIHdvcmQubGVuZ3RoKSArIFwiPC9iPlwiICsgREJwcm9tcHRUZXh0LnN1YnN0cmluZyh3b3JkSWR4ICsgd29yZC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRpdGlvbmFsREJwcm9tcHQgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgREJwcm9tcHRUZXh0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zd2VyXCI6IEpTT04ucGFyc2UoREJwcm9tcHQuYW5zd2VyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2FnZUNvdW50XCI6IERCcHJvbXB0LnVzYWdlQ291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdE1hdGNoTGlzdC5wdXNoKGFkZGl0aW9uYWxEQnByb21wdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGNvbWJpbmVkIERCIGFuZCBsb2NhbCBwcm9tcHRzIHRvIHBvcG92ZXJcbiAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0TGlzdCkodGV4dGJveCwgcHJvbXB0TWF0Y2hMaXN0LCBwb3BvdmVyKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiB3ZSBjdXJyZW50bHkgY2Fubm90IGFjY2VzcyB0aGUgc2hhcmVkIGRhdGFiYXNlJyk7XG4gICAgICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmFkZFByb21wdExpc3QpKHRleHRib3gsIHByb21wdE1hdGNoTGlzdCwgcG9wb3Zlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBubyBuZWVkIGZvciBEQlxuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmFkZFByb21wdExpc3QpKHRleHRib3gsIHByb21wdE1hdGNoTGlzdCwgcG9wb3Zlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgc3VnZ2VzdGlvbkJveEVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNzdWdnZXN0aW9uQm94XCIpO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveEVsZW1lbnRzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICAgICAgZWwucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHBvcG92ZXIuaWQgPSBcInBvcG92ZXJcIjtcbiAgICByZXR1cm4gcG9wb3Zlcjtcbn07XG5leHBvcnRzLmdldFBvcG92ZXIgPSBnZXRQb3BvdmVyO1xuY29uc3QgYWRkUHJvbXB0TGlzdCA9ICh0ZXh0Ym94LCBwcm9tcHRNYXRjaExpc3QsIHBvcG92ZXIpID0+IHtcbiAgICB2YXIgcHJvbXB0c1VzZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtwcm9tcHQsIHZhbF0gb2YgcHJvbXB0TWF0Y2hMaXN0KSB7XG4gICAgICAgIGlmICghKHByb21wdCBpbiBwcm9tcHRzVXNlZCkgJiYgdGV4dGJveC52YWx1ZSAhPSBwcm9tcHQucmVwbGFjZUFsbChcIjxiPlwiLCBcIlwiKS5yZXBsYWNlQWxsKFwiPC9iPlwiLCBcIlwiKSkge1xuICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LmlkID0gXCJzdWdnZXN0aW9uQm94XCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUucGFkZGluZyA9IFwiMTBweFwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIi4zNzVyZW1cIjtcbiAgICAgICAgICAgIGNvbnN0IGljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgaWNvbkRpdi5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMTBweFwiO1xuICAgICAgICAgICAgY29uc3QgdGV4dFdyYXBwZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgY29uc3QgdGV4dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XG4gICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm92ZXJmbG93WSA9IFwic2Nyb2xsXCI7XG4gICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgY29uc3QgYW5zd2VyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1hcmdpbkxlZnQgPSBcIjE1cHhcIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93WSA9IFwic2Nyb2xsXCI7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuaW5uZXJIVE1MID0gdmFsLmFuc3dlcjtcbiAgICAgICAgICAgIHRleHREaXYuaW5uZXJIVE1MID0gcHJvbXB0O1xuICAgICAgICAgICAgaWYgKFwibGFzdFVzZWRcIiBpbiB2YWwpIHtcbiAgICAgICAgICAgICAgICAvLyBmcm9tIGxvY2FsXG4gICAgICAgICAgICAgICAgaWNvbkRpdi5pbm5lckhUTUwgPSBcIvCflZNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGZyb20gREJcbiAgICAgICAgICAgICAgICBpY29uRGl2LmlubmVySFRNTCA9IFwi8J+UjVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUub3BhY2l0eSA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIxMjVweFwiO1xuICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjEyNXB4XCI7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbm1vdXNlbGVhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xuICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VGV4dCA9IHByb21wdC5yZXBsYWNlQWxsKFwiPGI+XCIsIFwiXCIpLnJlcGxhY2VBbGwoXCI8L2I+XCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0Ym94LnZhbHVlID0gbmV3VGV4dDtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgIGZldGNoKGAke2FkZFByb21wdFNlYXJjaExpc3RlbmVyXzEuVVJMfS9pbnN0YW5jZS9nZXRQcm9tcHQ/cHJvbXB0PSR7bmV3VGV4dH1gKS50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5tZXNzYWdlICE9ICdub3QgZm91bmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtc1VwZGF0ZSA9IHsgcHJvbXB0OiBuZXdUZXh0LCBhbnN3ZXI6IHJlcy5pbnN0YW5jZS5hbnN3ZXIsIHVzYWdlQ291bnQ6IHJlcy5pbnN0YW5jZS51c2FnZUNvdW50ICsgMSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zVXBkYXRlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBhcmFtc1VwZGF0ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZXRjaChgJHthZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLlVSTH0vaW5zdGFuY2UvdXBkYXRlLyR7cmVzLmluc3RhbmNlLl9pZH1gLCBvcHRpb25zVXBkYXRlKS50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLmVkaXRQcm9tcHRUZXh0KShuZXdUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEucmVsb2FkUG9wb3ZlcikodGV4dGJveCwgbmV3VGV4dCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGV4dFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGV4dERpdik7XG4gICAgICAgICAgICB0ZXh0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChhbnN3ZXJEaXYpO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZChpY29uRGl2KTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guYXBwZW5kQ2hpbGQodGV4dFdyYXBwZXJEaXYpO1xuICAgICAgICAgICAgaWYgKCEoXCJsYXN0VXNlZFwiIGluIHZhbCkpIHtcbiAgICAgICAgICAgICAgICAvLyBhZGQgdXNhZ2UgY291bnRcbiAgICAgICAgICAgICAgICBjb25zdCB1c2FnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgdXNhZ2VEaXYuc3R5bGUubWFyZ2luTGVmdCA9IFwiMTBweFwiO1xuICAgICAgICAgICAgICAgIHVzYWdlRGl2LmlubmVySFRNTCA9IFwi4piFIFwiICsgdmFsLnVzYWdlQ291bnQ7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZCh1c2FnZURpdik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb3BvdmVyLmFwcGVuZENoaWxkKHN1Z2dlc3Rpb25Cb3gpO1xuICAgICAgICAgICAgcHJvbXB0c1VzZWQucHVzaChwcm9tcHQpO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydHMuYWRkUHJvbXB0TGlzdCA9IGFkZFByb21wdExpc3Q7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vY29udGVudFNjcmlwdC9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lclwiKTtcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgIHN3aXRjaCAocmVxdWVzdC5hY3Rpb24pIHtcbiAgICAgICAgY2FzZSBcIndlYnNpdGUgbG9hZGVkXCI6XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIpKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlKHsgcmVzdWx0OiBcInN1Y2Nlc3NcIiB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9