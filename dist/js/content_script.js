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
var textareabox = document.createElement("textarea");
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
            fetch(`http://localhost:9090/instance/getPrompt?prompt=${promptText}`).then((res) => res.json())
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
                    fetch(`http://localhost:9090/instance/update/${res.instance._id}`, optionsUpdate).then((res) => res.json())
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
                    fetch(`http://localhost:9090/instance/create`, optionsCreate).then((res) => res.json())
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
                    fetch(`http://localhost:9090/instance/getPrompt?prompt=${newText}`).then((res) => res.json())
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
                            fetch(`http://localhost:9090/instance/update/${res.instance._id}`, optionsUpdate).then((res) => res.json())
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RSxRQUFRO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0EsMkVBQTJFLGlCQUFpQjtBQUM1RjtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7Ozs7Ozs7VUMvV3JCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0NBQWtDLG1CQUFPLENBQUMsK0ZBQXlDO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L2FkZFByb21wdFNlYXJjaExpc3RlbmVyLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvbnRlbnRTY3JpcHQvcG9wb3Zlci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50X3NjcmlwdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRQcm9tcHRUb0RCID0gZXhwb3J0cy5lZGl0UHJvbXB0VGV4dCA9IGV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IGV4cG9ydHMuaGlkZVBvcG92ZXIgPSBleHBvcnRzLnNob3dQb3BvdmVyID0gZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGV4cG9ydHMuc2F2ZVByb21wdCA9IGV4cG9ydHMuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSB2b2lkIDA7XG5jb25zdCBwb3BvdmVyXzEgPSByZXF1aXJlKFwiLi9wb3BvdmVyXCIpO1xuLy8gaW1wb3J0IHsgZ2V0UG9wb3ZlckFueXdoZXJlIH0gZnJvbSBcIi4vcG9wb3ZlckFueXdoZXJlXCI7XG4vLyBqdXN0IGZvciBjb25zdGFudGx5IGNoZWNraW5nIHdoYXQncyB0aGUgbGF0ZXN0IGFuc3dlciBkaXZcbnZhciBsYXRlc3RBbnN3ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xudmFyIHByb21wdFRleHQgPSBcIlwiO1xudmFyIHRleHRhcmVhYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJTdGFydGluZyBDU1MgUmVsb2FkIEVkaXRzIVwiKTtcbiAgICAvLyBUT0RPOiBmaXggc28gdGhhdCBpdCBhdXRvbWF0aWNhbGx5IHBvcHMgdXAgd2hlbiB5b3UgbmF2aWdhdGUgdG8gYSBwYWdlXG4gICAgLy8gUHJvYmxlbTogZXZlbiBpZiBVUkwgY2hhbmdlcywgdGhlIHRleHRhcmVhIGRvZXNuJ3QgYWx3YXlzIGNoYW5nZSBpbW1lZGlhdGVseVxuICAgIC8vIEN1cnJlbnQgc2NlbmFyaW8sIHVzZXIgaGFzIHRvIGNsaWNrIG9yIHN0YXJ0IHR5cGluZ1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICAgICAgdGV4dGFyZWFib3ggPSBpdGVtO1xuICAgICAgICAgICAgaWYgKHRleHRhcmVhYm94LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIHRleHQtc20gaC1mdWxsIGRhcms6YmctZ3JheS04MDAnKVswXTtcbiAgICAgICAgaWYgKGJvZHkuY29udGFpbnMoaXRlbSkpIHtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IGhvdyB0byBmaWd1cmUgb3V0IHdoZW4gc29tZXRoaW5nIGlzIGNsaWNrZWRcbiAgICAgICAgLy8gc2F2ZSBwcm9tcHQgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgICAvLyB2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZmxleCBmbGV4LWNvbCB3LWZ1bGwgcHktMiBmbGV4LWdyb3cgbWQ6cHktMyBtZDpwbC00IHJlbGF0aXZlIGJvcmRlciBib3JkZXItYmxhY2svMTAgYmctd2hpdGUgZGFyazpib3JkZXItZ3JheS05MDAvNTAgZGFyazp0ZXh0LXdoaXRlIGRhcms6YmctZ3JheS03MDAgcm91bmRlZC1tZCBzaGFkb3ctWzBfMF8xMHB4X3JnYmEoMCwwLDAsMC4xMCldIGRhcms6c2hhZG93LVswXzBfMTVweF9yZ2JhKDAsMCwwLDAuMTApXScpXG4gICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhYnNvbHV0ZSBwLTEgcm91bmRlZC1tZCB0ZXh0LWdyYXktNTAwIGJvdHRvbS0xLjUgcmlnaHQtMSBtZDpib3R0b20tMi41IG1kOnJpZ2h0LTIgaG92ZXI6YmctZ3JheS0xMDAgZGFyazpob3Zlcjp0ZXh0LWdyYXktNDAwIGRhcms6aG92ZXI6YmctZ3JheS05MDAgZGlzYWJsZWQ6aG92ZXI6YmctdHJhbnNwYXJlbnQgZGFyazpkaXNhYmxlZDpob3ZlcjpiZy10cmFuc3BhcmVudCcpO1xuICAgICAgICBpZiAoYnV0dG9uWzBdLmNvbnRhaW5zKGl0ZW0pIHx8IGJ1dHRvblswXSA9PSBpdGVtKSB7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5zYXZlUHJvbXB0KShwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfSkpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vIGp1c3QgbWVzc2luZyB3aXRoIGlmIGl0IHdvcmtzIG9uIGFueSBwbGFjZVxuICAgICAgICAvLyB2YXIgdGFyZ2V0RWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgLy8gdmFyIHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50Py5wYXJlbnROb2RlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRFbGVtZW50KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGFyZW50RWxlbWVudCk7XG4gICAgICAgIC8vIGlmIChwYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIC8vICAgZ2V0UG9wb3ZlckFueXdoZXJlKHRhcmdldEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQsIHByb21wdFRleHQsIHRhcmdldEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpXG4gICAgICAgIC8vICAgLy8gTEFURVI6IG5lZWQgdG8gYWRkIGF0dHJpYnV0ZXMsIHJlbW92ZSBwb3B1cHMgYXMgdGhleSBjb21lIGFsb25nIGxpa2UgcmVsb2FkIHBvcHVwXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gbWVzc2luZyBhcm91bmQgZW5kc1xuICAgICAgICB2YXIgaXRlbSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBzYXZlIHRvIGxvY2FsIGNocm9tZSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgdGV4dGFyZWFib3ggPSBpdGVtO1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0YXJlYWJveC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5ICE9IFwiQmFja3NwYWNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZS5zdWJzdHJpbmcoMCwgdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gb25seSByZWxvYWQgaWYgeW91J3ZlIHR5cGVkIGF0IGxlYXN0IG9uZSB3b3JkP1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIHlvdSBoaXQgYmFja3NwYWNlIG9uIGEgc3BhY2UgLyBkZWxldGUgYSB3b3JkIG9yIHlvdSBjbGVhcmVkIGV2ZXJ5dGhpbmcgb3V0XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIkJhY2tzcGFjZVwiICYmICh0ZXh0YXJlYWJveC52YWx1ZVt0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggLSAxXSA9PSBcIiBcIiB8fCB0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggPT0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2F2ZSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLnNhdmVQcm9tcHQpKHByb21wdFRleHQpO1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDApO1xuICAgIH0pKTtcbn07XG5leHBvcnRzLmFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXI7XG4vLyBzYXZlIHByb21wdFxuY29uc3Qgc2F2ZVByb21wdCA9IChwcm9tcHRUZXh0KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAvLyBzaGFyZVByb21wdHMgdGVtcG9yYXJpbHkgbWVhbnMgc2F2ZSBwcm9tcHRzIGFuZCByZXN1bHRzIGxvY2FsbHlcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zaGFyZVByb21wdHMgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICBpZiAodGV4dGFyZWFib3gudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gdGV4dGFyZWFib3gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNYXliZSBjcmVhdGUgYW4gYWRkIHRvIHN0b3JhZ2UgYW5kIGhhdmUgaXQgYXQgdGhlIGVuZCBvZiBjaGVja0ZpbmlzaEFuc3dlcmluZygpP1xuICAgICAgICAgICAgLy8gcmV0cmlldmluZyBmcm9tIGxvY2FsIHN0b3JhZ2UsIGNhbiBhbHNvIGp1c3Qgc3RvcmUgYXMgYSB2YXJpYWJsZSBoZXJlIGlmIHdlIHNlcmlvdXNseSBjYW5ub3Qgd2FpdFxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdwcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciBwcm9tcHREaWN0O1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucHJvbXB0cykge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0ID0gSlNPTi5wYXJzZShyZXN1bHQucHJvbXB0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0ID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmNoZWNrRmluaXNoQW5zd2VyaW5nKShwcm9tcHREaWN0LCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XG59KTtcbmV4cG9ydHMuc2F2ZVByb21wdCA9IHNhdmVQcm9tcHQ7XG5jb25zdCBjaGVja0ZpbmlzaEFuc3dlcmluZyA9IChwcm9tcHREaWN0LCBwcm9tcHRUZXh0KSA9PiB7XG4gICAgLy8gZm9yIHRyYWNraW5nIHdoZW4gdGhlIGJ1dHRvbiBhcHBlYXJzLCBzaWduaWZ5aW5nIGl0IGlzIGRvbmUgYW5zd2VyaW5nXG4gICAgdmFyIG9ic2VydmVyQnV0dG9uID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGVkTm9kZSA9IG11dGF0aW9uLmFkZGVkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChhZGRlZE5vZGUudGFnTmFtZSA9PT0gXCJzdmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZW1wb3JhcnkgYmVjYXVzZSB0aGlzIHNlZW1zIHRvIGJlIHRoZSBvbmx5IGVsZW1lbnQgdGhhdCB1cGRhdGVzIHByb3Blcmx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBBbnN3ZXJEaXZUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ19fbmV4dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wTWFpbiA9IHRlbXBBbnN3ZXJEaXZUZXh0LmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBEaXZDb2xsZWN0aW9uID0gdGVtcE1haW4uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhdGVzdEFuc3dlckRpdlRlbXBDb2xsZWN0aW9uID0gdGVtcERpdkNvbGxlY3Rpb24uY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF0ZXN0QW5zd2VyRGl2VGVtcCA9IGxhdGVzdEFuc3dlckRpdlRlbXBDb2xsZWN0aW9uW3RlbXBEaXZDb2xsZWN0aW9uLmNoaWxkTm9kZXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFuc3dlckRpdlRleHQgPSBsYXRlc3RBbnN3ZXJEaXZUZW1wID09PSBudWxsIHx8IGxhdGVzdEFuc3dlckRpdlRlbXAgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGxhdGVzdEFuc3dlckRpdlRlbXAuY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvZGUgdG8gYWRkIHRoZSBhbnN3ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0W3Byb21wdFRleHQudHJpbSgpXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXJEaXZUZXh0LmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNhZ2VDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVzZWQ6IChuZXcgRGF0ZSgpKS52YWx1ZU9mKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHByb21wdHM6IEpTT04uc3RyaW5naWZ5KHByb21wdERpY3QpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLmFkZFByb21wdFRvREIpKHByb21wdFRleHQudHJpbSgpLCBKU09OLnN0cmluZ2lmeShhbnN3ZXJEaXZUZXh0LmlubmVySFRNTCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0RGljdFtwcm9tcHRUZXh0LnRyaW0oKV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcjogXCI8cD5VbmF2YWlsYWJsZTxwPlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2FnZUNvdW50OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VXNlZDogKG5ldyBEYXRlKCkpLnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcHJvbXB0czogSlNPTi5zdHJpbmdpZnkocHJvbXB0RGljdCkgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0VG9EQikocHJvbXB0VGV4dC50cmltKCksIFwiPHA+VW5hdmFpbGFibGU8cD5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgIH0pO1xuICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgIH07XG4gICAgdmFyIHRleHRib3hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZsZXggZmxleC1jb2wgdy1mdWxsIHB5LTIgZmxleC1ncm93IG1kOnB5LTMgbWQ6cGwtNCByZWxhdGl2ZSBib3JkZXIgYm9yZGVyLWJsYWNrLzEwIGJnLXdoaXRlIGRhcms6Ym9yZGVyLWdyYXktOTAwLzUwIGRhcms6dGV4dC13aGl0ZSBkYXJrOmJnLWdyYXktNzAwIHJvdW5kZWQtbWQgc2hhZG93LVswXzBfMTBweF9yZ2JhKDAsMCwwLDAuMTApXSBkYXJrOnNoYWRvdy1bMF8wXzE1cHhfcmdiYSgwLDAsMCwwLjEwKV0nKVswXTtcbiAgICBvYnNlcnZlckJ1dHRvbi5vYnNlcnZlKHRleHRib3hFbCwgY29uZmlnKTtcbn07XG5leHBvcnRzLmNoZWNrRmluaXNoQW5zd2VyaW5nID0gY2hlY2tGaW5pc2hBbnN3ZXJpbmc7XG4vLyBzaG93IHBvcG92ZXJcbmNvbnN0IHNob3dQb3BvdmVyID0gKCkgPT4ge1xuICAgIHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdmVyXCIpO1xuICAgIGlmIChwKSB7XG4gICAgICAgIHAuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICBwLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgIH1cbn07XG5leHBvcnRzLnNob3dQb3BvdmVyID0gc2hvd1BvcG92ZXI7XG4vLyBoaWRlIHBvcG92ZXJcbmNvbnN0IGhpZGVQb3BvdmVyID0gKCkgPT4ge1xuICAgIHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdmVyXCIpO1xuICAgIC8vIFRPRE86IHB1dCBiYWNrIGFmdGVyIGRlYnVnZ2luZ1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAocCkge1xuICAgICAgICAgICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHAuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIjtcbiAgICAgICAgfVxuICAgIH0sIDEwMCk7XG59O1xuZXhwb3J0cy5oaWRlUG9wb3ZlciA9IGhpZGVQb3BvdmVyO1xuLy8gbWFpbiBjb2RlIHRvIHNob3cgcG9wdXBcbmNvbnN0IHJlbG9hZFBvcG92ZXIgPSAodGV4dGJveCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIHZhciBfYTtcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3ZlclwiKTtcbiAgICBpZiAocCkge1xuICAgICAgICBwLnJlbW92ZSgpO1xuICAgIH1cbiAgICBwID0gKDAsIHBvcG92ZXJfMS5nZXRQb3BvdmVyKSh0ZXh0Ym94LCBwcm9tcHRUZXh0KTtcbiAgICB2YXIgdGV4dGJveFdyYXBwZXIgPSAoX2EgPSB0ZXh0Ym94LnBhcmVudEVsZW1lbnQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wYXJlbnRFbGVtZW50O1xuICAgIHZhciB0ZXh0Ym94TWlkV3JhcHBlciA9IHRleHRib3gucGFyZW50RWxlbWVudDtcbiAgICB0ZXh0Ym94V3JhcHBlciA9PT0gbnVsbCB8fCB0ZXh0Ym94V3JhcHBlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGV4dGJveFdyYXBwZXIuaW5zZXJ0QmVmb3JlKHAsIHRleHRib3hNaWRXcmFwcGVyKTtcbiAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGV4dGJveCkge1xuICAgICAgICAoMCwgZXhwb3J0cy5zaG93UG9wb3ZlcikoKTtcbiAgICB9XG4gICAgLy8gdGV4dGJveCBpcyBjdXJyZW50bHkgYmVpbmcgY2hhbmdlZFxuICAgIGlmICh0ZXh0Ym94LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgdGV4dGJveC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbiAgICAvLyB0ZXh0Ym94IGhhcyBiZWVuIGNsaWNrZWQgYmFjayB0b1xuICAgIHRleHRib3gub25mb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKDAsIGV4cG9ydHMuc2hvd1BvcG92ZXIpKCk7XG4gICAgfTtcbn07XG5leHBvcnRzLnJlbG9hZFBvcG92ZXIgPSByZWxvYWRQb3BvdmVyO1xuY29uc3QgZWRpdFByb21wdFRleHQgPSAoZWRpdCkgPT4ge1xuICAgIHByb21wdFRleHQgPSBlZGl0O1xufTtcbmV4cG9ydHMuZWRpdFByb21wdFRleHQgPSBlZGl0UHJvbXB0VGV4dDtcbmNvbnN0IGFkZFByb21wdFRvREIgPSAocHJvbXB0VGV4dCwgYW5zd2VyVGV4dCkgPT4ge1xuICAgIC8vIHNoYXJlUmVzcG9uc2VzIGlzIHRlbXBvcmFyeSBjaHJvbWUgc3RvcmFnZSBmb3Igc2hhcmUgcHJvbXB0cyBhbmQgcmVzdWx0cyBwdWJsaWNseVxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVSZXNwb25zZXMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc2hhcmVSZXNwb25zZXMgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo5MDkwL2luc3RhbmNlL2dldFByb21wdD9wcm9tcHQ9JHtwcm9tcHRUZXh0fWApLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMubWVzc2FnZSAhPSAnbm90IGZvdW5kJykge1xuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtc1VwZGF0ZSA9IHsgcHJvbXB0OiBwcm9tcHRUZXh0LCBhbnN3ZXI6IHJlcy5pbnN0YW5jZS5hbnN3ZXIsIHVzYWdlQ291bnQ6IHJlcy5pbnN0YW5jZS51c2FnZUNvdW50ICsgMSB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc1VwZGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBhcmFtc1VwZGF0ZSksXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjkwOTAvaW5zdGFuY2UvdXBkYXRlLyR7cmVzLmluc3RhbmNlLl9pZH1gLCBvcHRpb25zVXBkYXRlKS50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRCIHVwZGF0ZTogXCIsIHJlcylcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlOiBhZGQgaXQgYXMgYSBuZXcgcHJvbXB0XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXNDcmVhdGUgPSB7IHByb21wdDogcHJvbXB0VGV4dCwgYW5zd2VyOiBhbnN3ZXJUZXh0LCB1c2FnZUNvdW50OiAxIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zQ3JlYXRlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXNDcmVhdGUpLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo5MDkwL2luc3RhbmNlL2NyZWF0ZWAsIG9wdGlvbnNDcmVhdGUpLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiREIgY3JlYXRlOiBcIiwgcmVzKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbmV4cG9ydHMuYWRkUHJvbXB0VG9EQiA9IGFkZFByb21wdFRvREI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRQcm9tcHRMaXN0ID0gZXhwb3J0cy5nZXRQb3BvdmVyID0gdm9pZCAwO1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL2FkZFByb21wdFNlYXJjaExpc3RlbmVyXCIpO1xuY29uc3QgZ2V0UG9wb3ZlciA9ICh0ZXh0Ym94LCBwcm9tcHRUZXh0KSA9PiB7XG4gICAgLy8gUG9wb3ZlciBlbGVtZW50XG4gICAgY29uc3QgcG9wb3ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcG9wb3Zlci5zdHlsZS53aWR0aCA9IHRleHRib3guc3R5bGUud2lkdGg7XG4gICAgcG9wb3Zlci5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICBwb3BvdmVyLnN0eWxlLnpJbmRleCA9IFwiMTBcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgIHBvcG92ZXIuc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIi4zNzVyZW1cIjtcbiAgICBwb3BvdmVyLnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmNvbG9yID0gXCJyZ2IoMjEwLCAyMTQsIDIxOClcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgIHBvcG92ZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgIHBvcG92ZXIuc3R5bGUuZmxleERpcmVjdGlvbiA9IFwiY29sdW1uLXJldmVyc2VcIjtcbiAgICAvLyBwb3BvdmVyLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAvLyBBZGQgdG9nZ2xlcyB0byBtZW51XG4gICAgY29uc3QgdG9nZ2xlQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0b2dnbGVCb3guc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5oZWlnaHQgPSBcIjUwcHhcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUucGFkZGluZyA9IFwiMTBweFwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICB0b2dnbGVCb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgdG9nZ2xlQm94LnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgIHRvZ2dsZUJveC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIi4zNzVyZW1cIjtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3Nob3dEaXNwbGF5JywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBjb25zdCB0b2dnbGVTaG93RGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiMXJlbVwiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LmNsYXNzTmFtZSA9IFwidGVtcFwiO1xuICAgICAgICAvLyBzaG93IHNob3dEaXNwbGF5IHZhbHVlIGJhc2VkIG9uIGNocm9tZSBzdG9yYWdlXG4gICAgICAgIHZhciBzaG93RGlzcGxheVZhbCA9IFwib25cIjtcbiAgICAgICAgaWYgKCdzaG93RGlzcGxheScgaW4gcmVzdWx0KSB7XG4gICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IHJlc3VsdC5zaG93RGlzcGxheTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gXCJvblwiO1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hvd0Rpc3BsYXk6IFwib25cIiB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzaG93RGlzcGxheVZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgfVxuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5pbm5lckhUTUwgPSBcInNob3cgZGlzcGxheTogXCIgKyBzaG93RGlzcGxheVZhbDtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hvd0Rpc3BsYXknLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNob3dEaXNwbGF5VmFsID0gcmVzdWx0LnNob3dEaXNwbGF5O1xuICAgICAgICAgICAgICAgIGlmIChzaG93RGlzcGxheVZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0Rpc3BsYXlWYWwgPSBcIm9mZlwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzaG93RGlzcGxheVZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gXCJvblwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaG93RGlzcGxheTogc2hvd0Rpc3BsYXlWYWwgfSk7XG4gICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJzaG93IGRpc3BsYXk6IFwiICsgc2hvd0Rpc3BsYXlWYWw7XG4gICAgICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEucmVsb2FkUG9wb3ZlcikodGV4dGJveCwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNob3dEaXNwbGF5KTtcbiAgICB9KTtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3NoYXJlUHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlU2hhcmVQcm9tcHRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiMXJlbVwiO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMTBweFwiO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMTBweFwiO1xuICAgICAgICAvLyBzaG93IHNob3dEaXNwbGF5IHZhbHVlIGJhc2VkIG9uIGNocm9tZSBzdG9yYWdlXG4gICAgICAgIHZhciBzaGFyZVByb21wdHNWYWwgPSBcIm9uXCI7XG4gICAgICAgIGlmICgnc2hhcmVQcm9tcHRzJyBpbiByZXN1bHQgJiYgKHJlc3VsdC5zaGFyZVByb21wdHMgPT0gJ29uJyB8fCByZXN1bHQuc2hhcmVQcm9tcHRzID09ICdvZmYnKSkge1xuICAgICAgICAgICAgc2hhcmVQcm9tcHRzVmFsID0gcmVzdWx0LnNoYXJlUHJvbXB0cztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNoYXJlUHJvbXB0c1ZhbCA9IFwib25cIjtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUHJvbXB0czogc2hhcmVQcm9tcHRzVmFsIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaGFyZVByb21wdHNWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNoYXJlUHJvbXB0c1ZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5pbm5lckhUTUwgPSBcInNhdmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVQcm9tcHRzVmFsO1xuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVQcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHZhciB0b2dnbGVTaGFyZVByb21wdHNWYWwgPSByZXN1bHQuc2hhcmVQcm9tcHRzO1xuICAgICAgICAgICAgICAgIGlmICh0b2dnbGVTaGFyZVByb21wdHNWYWwgPT0gXCJvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbCA9IFwib2ZmXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVQcm9tcHRzOiBcIm9mZlwiIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2dnbGVTaGFyZVByb21wdHNWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHNWYWwgPSBcIm9uXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVQcm9tcHRzOiBcIm9uXCIgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5pbm5lckhUTUwgPSBcInNhdmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgfTtcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNoYXJlUHJvbXB0cyk7XG4gICAgfSk7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVJlc3BvbnNlcycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlU2hhcmVSZXNwb25zZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjFyZW1cIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUucGFkZGluZ0xlZnQgPSBcIjEwcHhcIjtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMTBweFwiO1xuICAgICAgICAvLyBzaG93IHNob3dEaXNwbGF5IHZhbHVlIGJhc2VkIG9uIGNocm9tZSBzdG9yYWdlXG4gICAgICAgIHZhciBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib25cIjtcbiAgICAgICAgaWYgKCdzaGFyZVJlc3BvbnNlcycgaW4gcmVzdWx0ICYmIHJlc3VsdC5zaGFyZVJlc3BvbnNlcyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgc2hhcmVSZXNwb25zZXNWYWwgPSByZXN1bHQuc2hhcmVSZXNwb25zZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib25cIjtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUmVzcG9uc2VzOiBcIm9uXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNoYXJlUmVzcG9uc2VzVmFsID09IFwib25cIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvZmZcIikge1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuaW5uZXJIVE1MID0gXCJzaGFyZSBwcm9tcHRzICYgcmVzdWx0czogXCIgKyBzaGFyZVJlc3BvbnNlc1ZhbDtcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVSZXNwb25zZXMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNoYXJlUmVzcG9uc2VzVmFsID0gcmVzdWx0LnNoYXJlUmVzcG9uc2VzO1xuICAgICAgICAgICAgICAgIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVSZXNwb25zZXNWYWwgPSBcIm9mZlwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9mZlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gXCJvblwiO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVJlc3BvbnNlczogc2hhcmVSZXNwb25zZXNWYWwgfSk7XG4gICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuaW5uZXJIVE1MID0gXCJzaGFyZSBwcm9tcHRzICYgcmVzdWx0czogXCIgKyBzaGFyZVJlc3BvbnNlc1ZhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICB9O1xuICAgICAgICB0b2dnbGVCb3guYXBwZW5kQ2hpbGQodG9nZ2xlU2hhcmVSZXNwb25zZXMpO1xuICAgIH0pO1xuICAgIHBvcG92ZXIuYXBwZW5kQ2hpbGQodG9nZ2xlQm94KTtcbiAgICAvLyBsb2FkIGluIHRoZSBzdWdnZXN0aW9uc1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ3Byb21wdHMnLCAnc2hvd0Rpc3BsYXknXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAoJ3Nob3dEaXNwbGF5JyBpbiByZXN1bHQgJiYgcmVzdWx0LnNob3dEaXNwbGF5ID09IFwib25cIikge1xuICAgICAgICAgICAgdmFyIHByb21wdERpY3QgPSB7fTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQucHJvbXB0cykge1xuICAgICAgICAgICAgICAgIHByb21wdERpY3QgPSBKU09OLnBhcnNlKHJlc3VsdC5wcm9tcHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9tcHRNYXRjaExpc3QgPSBbXTtcbiAgICAgICAgICAgIHZhciBwcm9tcHRUZXh0TGlzdCA9IHByb21wdFRleHQuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIHZhciBhZGQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gc29ydCwgcmV0dXJucyBvbGRlc3QgLS0+IG5ld2VzdFxuICAgICAgICAgICAgdmFyIHNvcnRlZFByb21wdExpc3QgPSBPYmplY3QuZW50cmllcyhwcm9tcHREaWN0KS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFbMV1bJ2xhc3RVc2VkJ10gLSBiWzFdWydsYXN0VXNlZCddO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyByZXR1cm4gdG9wIE4gcmVzdWx0c1xuICAgICAgICAgICAgdmFyIHJldHVyblRvcE4gPSA4O1xuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgW2tleSwgdmFsdWVdIG9mIHNvcnRlZFByb21wdExpc3QucmV2ZXJzZSgpKSB7XG4gICAgICAgICAgICAgICAgYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdvcmQgb2YgcHJvbXB0VGV4dExpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmQgJiYgd29yZCAhPSBcIiBcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmRJZHggPSBrZXkuaW5kZXhPZih3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkSWR4ICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGJvbGRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBrZXkuc3Vic3RyaW5nKDAsIHdvcmRJZHgpICsgXCI8Yj5cIiArIGtleS5zdWJzdHJpbmcod29yZElkeCwgd29yZElkeCArIHdvcmQubGVuZ3RoKSArIFwiPC9iPlwiICsga2V5LnN1YnN0cmluZyh3b3JkSWR4ICsgd29yZC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFkZCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHRNYXRjaExpc3QucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgICAgICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjb3VudGVyID49IHJldHVyblRvcE4pIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgY291bnRlciBpcyA8IHJldHVyblRvcE4sIHJldHVybiByZXR1cm5Ub3BOIC0gY291bnRlciBmcm9tIERCXG4gICAgICAgICAgICAvLyBnZXQgYSBsaXN0IGJhc2VkIG9uIHdvcmRzLCBhbmQganVzdCBrZWVwIG9uIGFkanVzdGluZyB0aGF0IGxpc3Q/XG4gICAgICAgICAgICB2YXIgYWRkaXRpb25hbFByb21wdHNOZWVkZWQgPSByZXR1cm5Ub3BOIC0gY291bnRlcjtcbiAgICAgICAgICAgIHZhciBzZWFyY2hRdWVyeSA9IHByb21wdFRleHQ7XG4gICAgICAgICAgICBpZiAoYWRkaXRpb25hbFByb21wdHNOZWVkZWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6OTA5MC9pbnN0YW5jZS9nZXRGaWx0ZXJlZD9zZWFyY2g9JHtzZWFyY2hRdWVyeX0mbGltaXQ9JHthZGRpdGlvbmFsUHJvbXB0c05lZWRlZH1gKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoREJwcm9tcHRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdldHRpbmcgcmVzcG9uc2VzIGZyb20gREJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBEQnByb21wdCBvZiBEQnByb21wdHMuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBEQnByb21wdFRleHQgPSBEQnByb21wdC5wcm9tcHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdvcmQgb2YgcHJvbXB0VGV4dExpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod29yZCAmJiB3b3JkICE9IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3b3JkSWR4ID0gREJwcm9tcHRUZXh0LmluZGV4T2Yod29yZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBib2xkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERCcHJvbXB0VGV4dCA9IERCcHJvbXB0VGV4dC5zdWJzdHJpbmcoMCwgd29yZElkeCkgKyBcIjxiPlwiICsgREJwcm9tcHRUZXh0LnN1YnN0cmluZyh3b3JkSWR4LCB3b3JkSWR4ICsgd29yZC5sZW5ndGgpICsgXCI8L2I+XCIgKyBEQnByb21wdFRleHQuc3Vic3RyaW5nKHdvcmRJZHggKyB3b3JkLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxEQnByb21wdCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQnByb21wdFRleHQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnN3ZXJcIjogSlNPTi5wYXJzZShEQnByb21wdC5hbnN3ZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVzYWdlQ291bnRcIjogREJwcm9tcHQudXNhZ2VDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0TWF0Y2hMaXN0LnB1c2goYWRkaXRpb25hbERCcHJvbXB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgY29tYmluZWQgREIgYW5kIGxvY2FsIHByb21wdHMgdG8gcG9wb3ZlclxuICAgICAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5hZGRQcm9tcHRMaXN0KSh0ZXh0Ym94LCBwcm9tcHRNYXRjaExpc3QsIHBvcG92ZXIpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6IHdlIGN1cnJlbnRseSBjYW5ub3QgYWNjZXNzIHRoZSBzaGFyZWQgZGF0YWJhc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0TGlzdCkodGV4dGJveCwgcHJvbXB0TWF0Y2hMaXN0LCBwb3BvdmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vIG5lZWQgZm9yIERCXG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0TGlzdCkodGV4dGJveCwgcHJvbXB0TWF0Y2hMaXN0LCBwb3BvdmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzdWdnZXN0aW9uQm94RWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiI3N1Z2dlc3Rpb25Cb3hcIik7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94RWxlbWVudHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcG9wb3Zlci5pZCA9IFwicG9wb3ZlclwiO1xuICAgIHJldHVybiBwb3BvdmVyO1xufTtcbmV4cG9ydHMuZ2V0UG9wb3ZlciA9IGdldFBvcG92ZXI7XG5jb25zdCBhZGRQcm9tcHRMaXN0ID0gKHRleHRib3gsIHByb21wdE1hdGNoTGlzdCwgcG9wb3ZlcikgPT4ge1xuICAgIHZhciBwcm9tcHRzVXNlZCA9IFtdO1xuICAgIGZvciAoY29uc3QgW3Byb21wdCwgdmFsXSBvZiBwcm9tcHRNYXRjaExpc3QpIHtcbiAgICAgICAgaWYgKCEocHJvbXB0IGluIHByb21wdHNVc2VkKSAmJiB0ZXh0Ym94LnZhbHVlICE9IHByb21wdC5yZXBsYWNlQWxsKFwiPGI+XCIsIFwiXCIpLnJlcGxhY2VBbGwoXCI8L2I+XCIsIFwiXCIpKSB7XG4gICAgICAgICAgICBjb25zdCBzdWdnZXN0aW9uQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guaWQgPSBcInN1Z2dlc3Rpb25Cb3hcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5wYWRkaW5nID0gXCIxMHB4XCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiLjM3NXJlbVwiO1xuICAgICAgICAgICAgY29uc3QgaWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBpY29uRGl2LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgICAgICBjb25zdCB0ZXh0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBjb25zdCB0ZXh0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUub3ZlcmZsb3dYID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICBjb25zdCBhbnN3ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWFyZ2luTGVmdCA9IFwiMTVweFwiO1xuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgIGFuc3dlckRpdi5pbm5lckhUTUwgPSB2YWwuYW5zd2VyO1xuICAgICAgICAgICAgdGV4dERpdi5pbm5lckhUTUwgPSBwcm9tcHQ7XG4gICAgICAgICAgICBpZiAoXCJsYXN0VXNlZFwiIGluIHZhbCkge1xuICAgICAgICAgICAgICAgIC8vIGZyb20gbG9jYWxcbiAgICAgICAgICAgICAgICBpY29uRGl2LmlubmVySFRNTCA9IFwi8J+Vk1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZnJvbSBEQlxuICAgICAgICAgICAgICAgIGljb25EaXYuaW5uZXJIVE1MID0gXCLwn5SNXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCIxMDAlXCI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjEyNXB4XCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMTI1cHhcIjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdUZXh0ID0gcHJvbXB0LnJlcGxhY2VBbGwoXCI8Yj5cIiwgXCJcIikucmVwbGFjZUFsbChcIjwvYj5cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIHRleHRib3gudmFsdWUgPSBuZXdUZXh0O1xuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6OTA5MC9pbnN0YW5jZS9nZXRQcm9tcHQ/cHJvbXB0PSR7bmV3VGV4dH1gKS50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5tZXNzYWdlICE9ICdub3QgZm91bmQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtc1VwZGF0ZSA9IHsgcHJvbXB0OiBuZXdUZXh0LCBhbnN3ZXI6IHJlcy5pbnN0YW5jZS5hbnN3ZXIsIHVzYWdlQ291bnQ6IHJlcy5pbnN0YW5jZS51c2FnZUNvdW50ICsgMSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zVXBkYXRlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBhcmFtc1VwZGF0ZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDo5MDkwL2luc3RhbmNlL3VwZGF0ZS8ke3Jlcy5pbnN0YW5jZS5faWR9YCwgb3B0aW9uc1VwZGF0ZSkudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAoMCwgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMS5lZGl0UHJvbXB0VGV4dCkobmV3VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLnJlbG9hZFBvcG92ZXIpKHRleHRib3gsIG5ld1RleHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRleHRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKHRleHREaXYpO1xuICAgICAgICAgICAgdGV4dFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoYW5zd2VyRGl2KTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guYXBwZW5kQ2hpbGQoaWNvbkRpdik7XG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LmFwcGVuZENoaWxkKHRleHRXcmFwcGVyRGl2KTtcbiAgICAgICAgICAgIGlmICghKFwibGFzdFVzZWRcIiBpbiB2YWwpKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRkIHVzYWdlIGNvdW50XG4gICAgICAgICAgICAgICAgY29uc3QgdXNhZ2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHVzYWdlRGl2LnN0eWxlLm1hcmdpbkxlZnQgPSBcIjEwcHhcIjtcbiAgICAgICAgICAgICAgICB1c2FnZURpdi5pbm5lckhUTUwgPSBcIuKYhSBcIiArIHZhbC51c2FnZUNvdW50O1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guYXBwZW5kQ2hpbGQodXNhZ2VEaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9wb3Zlci5hcHBlbmRDaGlsZChzdWdnZXN0aW9uQm94KTtcbiAgICAgICAgICAgIHByb21wdHNVc2VkLnB1c2gocHJvbXB0KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLmFkZFByb21wdExpc3QgPSBhZGRQcm9tcHRMaXN0O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL2NvbnRlbnRTY3JpcHQvYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJcIik7XG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJjaGVjayB3YXMgY2FsbGVkIVwiKTtcbiAgICBzd2l0Y2ggKHJlcXVlc3QuYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgXCJ3ZWJzaXRlIGxvYWRlZFwiOlxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjaGVjayB3YXMgY2FsbGVkIVwiKTtcbiAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLmFkZFByb21wdFNlYXJjaExpc3RlbmVyKSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogXCJzdWNjZXNzXCIgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==