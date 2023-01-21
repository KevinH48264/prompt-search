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
exports.URL = "https://prompts-backend.herokuapp.com";
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
    var p = document.getElementById("popover-prompt-search");
    if (p) {
        p.style.visibility = "visible";
        p.style.height = "auto";
    }
};
exports.showPopover = showPopover;
// hide popover
const hidePopover = () => {
    var p = document.getElementById("popover-prompt-search");
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
    var p = document.getElementById("popover-prompt-search");
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
                    console.log('DBprompts', DBprompts);
                    // getting responses from DB
                    for (const DBprompt of DBprompts.instance) {
                        var DBpromptText = DBprompt.prompt;
                        console.log("DBprompt", DBprompt, DBpromptText);
                        for (const word of promptTextList) {
                            console.log("word", word);
                            if (word && word != " ") {
                                var wordIdx = DBpromptText.indexOf(word);
                                // add bold
                                DBpromptText = DBpromptText.substring(0, wordIdx) + "<b>" + DBpromptText.substring(wordIdx, wordIdx + word.length) + "</b>" + DBpromptText.substring(wordIdx + word.length);
                            }
                        }
                        console.log("out of for loop", DBprompt.answer);
                        console.log("JSON.parse(DBprompt.answer)", JSON.parse(DBprompt.answer));
                        console.log("DBprompt.usageCount", DBprompt.usageCount);
                        var additionalDBprompt = [
                            DBpromptText, {
                                "answer": JSON.parse(DBprompt.answer),
                                "usageCount": DBprompt.usageCount,
                            }
                        ];
                        console.log("here");
                        promptMatchList.push(additionalDBprompt);
                    }
                    console.log("end");
                    // add combined DB and local prompts to popover
                    (0, exports.addPromptList)(textbox, promptMatchList, popover);
                }).catch(() => {
                    console.error('Error: we currently cannot access the shared database here');
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
    popover.id = "popover-prompt-search";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cyI6WyJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudFNjcmlwdC9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L3BvcG92ZXIudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudF9zY3JpcHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmFkZFByb21wdFRvREIgPSBleHBvcnRzLmVkaXRQcm9tcHRUZXh0ID0gZXhwb3J0cy5yZWxvYWRQb3BvdmVyID0gZXhwb3J0cy5oaWRlUG9wb3ZlciA9IGV4cG9ydHMuc2hvd1BvcG92ZXIgPSBleHBvcnRzLmNoZWNrRmluaXNoQW5zd2VyaW5nID0gZXhwb3J0cy5zYXZlUHJvbXB0ID0gZXhwb3J0cy5hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lciA9IGV4cG9ydHMuVVJMID0gdm9pZCAwO1xyXG5jb25zdCBwb3BvdmVyXzEgPSByZXF1aXJlKFwiLi9wb3BvdmVyXCIpO1xyXG4vLyBpbXBvcnQgeyBnZXRQb3BvdmVyQW55d2hlcmUgfSBmcm9tIFwiLi9wb3BvdmVyQW55d2hlcmVcIjtcclxuLy8ganVzdCBmb3IgY29uc3RhbnRseSBjaGVja2luZyB3aGF0J3MgdGhlIGxhdGVzdCBhbnN3ZXIgZGl2XHJcbnZhciBsYXRlc3RBbnN3ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG52YXIgcHJvbXB0VGV4dCA9IFwiXCI7XHJcbnZhciB0ZXh0YXJlYWJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcclxuZXhwb3J0cy5VUkwgPSBcImh0dHBzOi8vcHJvbXB0cy1iYWNrZW5kLmhlcm9rdWFwcC5jb21cIjtcclxuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nIENTUyBSZWxvYWQgRWRpdHMhXCIpO1xyXG4gICAgLy8gVE9ETzogZml4IHNvIHRoYXQgaXQgYXV0b21hdGljYWxseSBwb3BzIHVwIHdoZW4geW91IG5hdmlnYXRlIHRvIGEgcGFnZVxyXG4gICAgLy8gUHJvYmxlbTogZXZlbiBpZiBVUkwgY2hhbmdlcywgdGhlIHRleHRhcmVhIGRvZXNuJ3QgYWx3YXlzIGNoYW5nZSBpbW1lZGlhdGVseVxyXG4gICAgLy8gQ3VycmVudCBzY2VuYXJpbywgdXNlciBoYXMgdG8gY2xpY2sgb3Igc3RhcnQgdHlwaW5nXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRleHRhcmVhYm94ID0gaXRlbTtcclxuICAgICAgICAgICAgaWYgKHRleHRhcmVhYm94LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gdGV4dGFyZWFib3gudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciB0ZXh0LXNtIGgtZnVsbCBkYXJrOmJnLWdyYXktODAwJylbMF07XHJcbiAgICAgICAgaWYgKGJvZHkuY29udGFpbnMoaXRlbSkpIHtcclxuICAgICAgICAgICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFRPRE86IGhvdyB0byBmaWd1cmUgb3V0IHdoZW4gc29tZXRoaW5nIGlzIGNsaWNrZWRcclxuICAgICAgICAvLyBzYXZlIHByb21wdCBpbiBsb2NhbCBzdG9yYWdlXHJcbiAgICAgICAgLy8gdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZsZXggZmxleC1jb2wgdy1mdWxsIHB5LTIgZmxleC1ncm93IG1kOnB5LTMgbWQ6cGwtNCByZWxhdGl2ZSBib3JkZXIgYm9yZGVyLWJsYWNrLzEwIGJnLXdoaXRlIGRhcms6Ym9yZGVyLWdyYXktOTAwLzUwIGRhcms6dGV4dC13aGl0ZSBkYXJrOmJnLWdyYXktNzAwIHJvdW5kZWQtbWQgc2hhZG93LVswXzBfMTBweF9yZ2JhKDAsMCwwLDAuMTApXSBkYXJrOnNoYWRvdy1bMF8wXzE1cHhfcmdiYSgwLDAsMCwwLjEwKV0nKVxyXG4gICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhYnNvbHV0ZSBwLTEgcm91bmRlZC1tZCB0ZXh0LWdyYXktNTAwIGJvdHRvbS0xLjUgcmlnaHQtMSBtZDpib3R0b20tMi41IG1kOnJpZ2h0LTIgaG92ZXI6YmctZ3JheS0xMDAgZGFyazpob3Zlcjp0ZXh0LWdyYXktNDAwIGRhcms6aG92ZXI6YmctZ3JheS05MDAgZGlzYWJsZWQ6aG92ZXI6YmctdHJhbnNwYXJlbnQgZGFyazpkaXNhYmxlZDpob3ZlcjpiZy10cmFuc3BhcmVudCcpO1xyXG4gICAgICAgIGlmIChidXR0b25bMF0uY29udGFpbnMoaXRlbSkgfHwgYnV0dG9uWzBdID09IGl0ZW0pIHtcclxuICAgICAgICAgICAgKDAsIGV4cG9ydHMuc2F2ZVByb21wdCkocHJvbXB0VGV4dCk7XHJcbiAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH0pKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgLy8ganVzdCBtZXNzaW5nIHdpdGggaWYgaXQgd29ya3Mgb24gYW55IHBsYWNlXHJcbiAgICAgICAgLy8gdmFyIHRhcmdldEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgLy8gdmFyIHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50Py5wYXJlbnROb2RlO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldEVsZW1lbnQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBhcmVudEVsZW1lbnQpO1xyXG4gICAgICAgIC8vIGlmIChwYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgLy8gICBnZXRQb3BvdmVyQW55d2hlcmUodGFyZ2V0RWxlbWVudCBhcyBIVE1MRWxlbWVudCwgcHJvbXB0VGV4dCwgdGFyZ2V0RWxlbWVudCBhcyBIVE1MRWxlbWVudClcclxuICAgICAgICAvLyAgIC8vIExBVEVSOiBuZWVkIHRvIGFkZCBhdHRyaWJ1dGVzLCByZW1vdmUgcG9wdXBzIGFzIHRoZXkgY29tZSBhbG9uZyBsaWtlIHJlbG9hZCBwb3B1cFxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBtZXNzaW5nIGFyb3VuZCBlbmRzXHJcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSB0byBsb2NhbCBjaHJvbWUgc3RvcmFnZVxyXG4gICAgICAgICAgICAgICAgdGV4dGFyZWFib3ggPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRleHRhcmVhYm94LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSAhPSBcIkJhY2tzcGFjZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZS5zdWJzdHJpbmcoMCwgdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gb25seSByZWxvYWQgaWYgeW91J3ZlIHR5cGVkIGF0IGxlYXN0IG9uZSB3b3JkP1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIiBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLnJlbG9hZFBvcG92ZXIpKGl0ZW0sIHByb21wdFRleHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gaWYgeW91IGhpdCBiYWNrc3BhY2Ugb24gYSBzcGFjZSAvIGRlbGV0ZSBhIHdvcmQgb3IgeW91IGNsZWFyZWQgZXZlcnl0aGluZyBvdXRcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJCYWNrc3BhY2VcIiAmJiAodGV4dGFyZWFib3gudmFsdWVbdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoIC0gMV0gPT0gXCIgXCIgfHwgdGV4dGFyZWFib3gudmFsdWUubGVuZ3RoID09IDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gc2F2ZSBpbiBsb2NhbCBzdG9yYWdlXHJcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCJFbnRlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5zYXZlUHJvbXB0KShwcm9tcHRUZXh0KTtcclxuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgfSkpO1xyXG59O1xyXG5leHBvcnRzLmFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXI7XHJcbi8vIHNhdmUgcHJvbXB0XHJcbmNvbnN0IHNhdmVQcm9tcHQgPSAocHJvbXB0VGV4dCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAvLyBzaGFyZVByb21wdHMgdGVtcG9yYXJpbHkgbWVhbnMgc2F2ZSBwcm9tcHRzIGFuZCByZXN1bHRzIGxvY2FsbHlcclxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVQcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHQuc2hhcmVQcm9tcHRzID09IFwib25cIikge1xyXG4gICAgICAgICAgICBpZiAodGV4dGFyZWFib3gudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBNYXliZSBjcmVhdGUgYW4gYWRkIHRvIHN0b3JhZ2UgYW5kIGhhdmUgaXQgYXQgdGhlIGVuZCBvZiBjaGVja0ZpbmlzaEFuc3dlcmluZygpP1xyXG4gICAgICAgICAgICAvLyByZXRyaWV2aW5nIGZyb20gbG9jYWwgc3RvcmFnZSwgY2FuIGFsc28ganVzdCBzdG9yZSBhcyBhIHZhcmlhYmxlIGhlcmUgaWYgd2Ugc2VyaW91c2x5IGNhbm5vdCB3YWl0XHJcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgncHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9tcHREaWN0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5wcm9tcHRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0RGljdCA9IEpTT04ucGFyc2UocmVzdWx0LnByb21wdHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0RGljdCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuY2hlY2tGaW5pc2hBbnN3ZXJpbmcpKHByb21wdERpY3QsIHByb21wdFRleHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xyXG59KTtcclxuZXhwb3J0cy5zYXZlUHJvbXB0ID0gc2F2ZVByb21wdDtcclxuY29uc3QgY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSAocHJvbXB0RGljdCwgcHJvbXB0VGV4dCkgPT4ge1xyXG4gICAgLy8gZm9yIHRyYWNraW5nIHdoZW4gdGhlIGJ1dHRvbiBhcHBlYXJzLCBzaWduaWZ5aW5nIGl0IGlzIGRvbmUgYW5zd2VyaW5nXHJcbiAgICB2YXIgb2JzZXJ2ZXJCdXR0b24gPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGRlZE5vZGUgPSBtdXRhdGlvbi5hZGRlZE5vZGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhZGRlZE5vZGUudGFnTmFtZSA9PT0gXCJzdmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGVtcG9yYXJ5IGJlY2F1c2UgdGhpcyBzZWVtcyB0byBiZSB0aGUgb25seSBlbGVtZW50IHRoYXQgdXBkYXRlcyBwcm9wZXJseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBBbnN3ZXJEaXZUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ19fbmV4dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBNYWluID0gdGVtcEFuc3dlckRpdlRleHQuY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wRGl2Q29sbGVjdGlvbiA9IHRlbXBNYWluLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhdGVzdEFuc3dlckRpdlRlbXBDb2xsZWN0aW9uID0gdGVtcERpdkNvbGxlY3Rpb24uY2hpbGROb2RlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXRlc3RBbnN3ZXJEaXZUZW1wID0gbGF0ZXN0QW5zd2VyRGl2VGVtcENvbGxlY3Rpb25bdGVtcERpdkNvbGxlY3Rpb24uY2hpbGROb2Rlcy5sZW5ndGggLSAyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJEaXZUZXh0ID0gbGF0ZXN0QW5zd2VyRGl2VGVtcCA9PT0gbnVsbCB8fCBsYXRlc3RBbnN3ZXJEaXZUZW1wID09PSB2b2lkIDAgPyB2b2lkIDAgOiBsYXRlc3RBbnN3ZXJEaXZUZW1wLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvZGUgdG8gYWRkIHRoZSBhbnN3ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdERpY3RbcHJvbXB0VGV4dC50cmltKCldID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyRGl2VGV4dC5pbm5lckhUTUwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNhZ2VDb3VudDogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VXNlZDogKG5ldyBEYXRlKCkpLnZhbHVlT2YoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHByb21wdHM6IEpTT04uc3RyaW5naWZ5KHByb21wdERpY3QpIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0VG9EQikocHJvbXB0VGV4dC50cmltKCksIEpTT04uc3RyaW5naWZ5KGFuc3dlckRpdlRleHQuaW5uZXJIVE1MKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9tcHREaWN0W3Byb21wdFRleHQudHJpbSgpXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IFwiPHA+VW5hdmFpbGFibGU8cD5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2FnZUNvdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVc2VkOiAobmV3IERhdGUoKSkudmFsdWVPZigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcHJvbXB0czogSlNPTi5zdHJpbmdpZnkocHJvbXB0RGljdCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5hZGRQcm9tcHRUb0RCKShwcm9tcHRUZXh0LnRyaW0oKSwgXCI8cD5VbmF2YWlsYWJsZTxwPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICA7XHJcbiAgICB9KTtcclxuICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgIHN1YnRyZWU6IHRydWVcclxuICAgIH07XHJcbiAgICB2YXIgdGV4dGJveEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZmxleCBmbGV4LWNvbCB3LWZ1bGwgcHktMiBmbGV4LWdyb3cgbWQ6cHktMyBtZDpwbC00IHJlbGF0aXZlIGJvcmRlciBib3JkZXItYmxhY2svMTAgYmctd2hpdGUgZGFyazpib3JkZXItZ3JheS05MDAvNTAgZGFyazp0ZXh0LXdoaXRlIGRhcms6YmctZ3JheS03MDAgcm91bmRlZC1tZCBzaGFkb3ctWzBfMF8xMHB4X3JnYmEoMCwwLDAsMC4xMCldIGRhcms6c2hhZG93LVswXzBfMTVweF9yZ2JhKDAsMCwwLDAuMTApXScpWzBdO1xyXG4gICAgb2JzZXJ2ZXJCdXR0b24ub2JzZXJ2ZSh0ZXh0Ym94RWwsIGNvbmZpZyk7XHJcbn07XHJcbmV4cG9ydHMuY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSBjaGVja0ZpbmlzaEFuc3dlcmluZztcclxuLy8gc2hvdyBwb3BvdmVyXHJcbmNvbnN0IHNob3dQb3BvdmVyID0gKCkgPT4ge1xyXG4gICAgdmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcG92ZXItcHJvbXB0LXNlYXJjaFwiKTtcclxuICAgIGlmIChwKSB7XHJcbiAgICAgICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgcC5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5zaG93UG9wb3ZlciA9IHNob3dQb3BvdmVyO1xyXG4vLyBoaWRlIHBvcG92ZXJcclxuY29uc3QgaGlkZVBvcG92ZXIgPSAoKSA9PiB7XHJcbiAgICB2YXIgcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9wb3Zlci1wcm9tcHQtc2VhcmNoXCIpO1xyXG4gICAgLy8gVE9ETzogcHV0IGJhY2sgYWZ0ZXIgZGVidWdnaW5nXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAocCkge1xyXG4gICAgICAgICAgICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG4gICAgICAgICAgICBwLnN0eWxlLmhlaWdodCA9IFwiMHB4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgMTAwKTtcclxufTtcclxuZXhwb3J0cy5oaWRlUG9wb3ZlciA9IGhpZGVQb3BvdmVyO1xyXG4vLyBtYWluIGNvZGUgdG8gc2hvdyBwb3B1cFxyXG5jb25zdCByZWxvYWRQb3BvdmVyID0gKHRleHRib3gsIHByb21wdFRleHQpID0+IHtcclxuICAgIHZhciBfYTtcclxuICAgIHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdmVyLXByb21wdC1zZWFyY2hcIik7XHJcbiAgICBpZiAocCkge1xyXG4gICAgICAgIHAucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgICBwID0gKDAsIHBvcG92ZXJfMS5nZXRQb3BvdmVyKSh0ZXh0Ym94LCBwcm9tcHRUZXh0KTtcclxuICAgIHZhciB0ZXh0Ym94V3JhcHBlciA9IChfYSA9IHRleHRib3gucGFyZW50RWxlbWVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBhcmVudEVsZW1lbnQ7XHJcbiAgICB2YXIgdGV4dGJveE1pZFdyYXBwZXIgPSB0ZXh0Ym94LnBhcmVudEVsZW1lbnQ7XHJcbiAgICB0ZXh0Ym94V3JhcHBlciA9PT0gbnVsbCB8fCB0ZXh0Ym94V3JhcHBlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGV4dGJveFdyYXBwZXIuaW5zZXJ0QmVmb3JlKHAsIHRleHRib3hNaWRXcmFwcGVyKTtcclxuICAgIHAuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRleHRib3gpIHtcclxuICAgICAgICAoMCwgZXhwb3J0cy5zaG93UG9wb3ZlcikoKTtcclxuICAgIH1cclxuICAgIC8vIHRleHRib3ggaXMgY3VycmVudGx5IGJlaW5nIGNoYW5nZWRcclxuICAgIGlmICh0ZXh0Ym94LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICB0ZXh0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8vIHRleHRib3ggaGFzIGJlZW4gY2xpY2tlZCBiYWNrIHRvXHJcbiAgICB0ZXh0Ym94Lm9uZm9jdXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgKDAsIGV4cG9ydHMuc2hvd1BvcG92ZXIpKCk7XHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnRzLnJlbG9hZFBvcG92ZXIgPSByZWxvYWRQb3BvdmVyO1xyXG5jb25zdCBlZGl0UHJvbXB0VGV4dCA9IChlZGl0KSA9PiB7XHJcbiAgICBwcm9tcHRUZXh0ID0gZWRpdDtcclxufTtcclxuZXhwb3J0cy5lZGl0UHJvbXB0VGV4dCA9IGVkaXRQcm9tcHRUZXh0O1xyXG5jb25zdCBhZGRQcm9tcHRUb0RCID0gKHByb21wdFRleHQsIGFuc3dlclRleHQpID0+IHtcclxuICAgIC8vIHNoYXJlUmVzcG9uc2VzIGlzIHRlbXBvcmFyeSBjaHJvbWUgc3RvcmFnZSBmb3Igc2hhcmUgcHJvbXB0cyBhbmQgcmVzdWx0cyBwdWJsaWNseVxyXG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVJlc3BvbnNlcycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBpZiAocmVzdWx0LnNoYXJlUmVzcG9uc2VzID09IFwib25cIikge1xyXG4gICAgICAgICAgICBmZXRjaChgJHtleHBvcnRzLlVSTH0vaW5zdGFuY2UvZ2V0UHJvbXB0P3Byb21wdD0ke3Byb21wdFRleHR9YCkudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMubWVzc2FnZSAhPSAnbm90IGZvdW5kJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXNVcGRhdGUgPSB7IHByb21wdDogcHJvbXB0VGV4dCwgYW5zd2VyOiByZXMuaW5zdGFuY2UuYW5zd2VyLCB1c2FnZUNvdW50OiByZXMuaW5zdGFuY2UudXNhZ2VDb3VudCArIDEgfTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uc1VwZGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXNVcGRhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2goYCR7ZXhwb3J0cy5VUkx9L2luc3RhbmNlL3VwZGF0ZS8ke3Jlcy5pbnN0YW5jZS5faWR9YCwgb3B0aW9uc1VwZGF0ZSkudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiREIgdXBkYXRlOiBcIiwgcmVzKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxzZTogYWRkIGl0IGFzIGEgbmV3IHByb21wdFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXNDcmVhdGUgPSB7IHByb21wdDogcHJvbXB0VGV4dCwgYW5zd2VyOiBhbnN3ZXJUZXh0LCB1c2FnZUNvdW50OiAxIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbnNDcmVhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXNDcmVhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2goYCR7ZXhwb3J0cy5VUkx9L2luc3RhbmNlL2NyZWF0ZWAsIG9wdGlvbnNDcmVhdGUpLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRCIGNyZWF0ZTogXCIsIHJlcylcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcbmV4cG9ydHMuYWRkUHJvbXB0VG9EQiA9IGFkZFByb21wdFRvREI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5hZGRQcm9tcHRMaXN0ID0gZXhwb3J0cy5nZXRQb3BvdmVyID0gdm9pZCAwO1xyXG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJcIik7XHJcbmNvbnN0IGdldFBvcG92ZXIgPSAodGV4dGJveCwgcHJvbXB0VGV4dCkgPT4ge1xyXG4gICAgLy8gUG9wb3ZlciBlbGVtZW50XHJcbiAgICBjb25zdCBwb3BvdmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHBvcG92ZXIuc3R5bGUud2lkdGggPSB0ZXh0Ym94LnN0eWxlLndpZHRoO1xyXG4gICAgcG9wb3Zlci5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcclxuICAgIHBvcG92ZXIuc3R5bGUuekluZGV4ID0gXCIxMFwiO1xyXG4gICAgcG9wb3Zlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcclxuICAgIHBvcG92ZXIuc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XHJcbiAgICBwb3BvdmVyLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiLjM3NXJlbVwiO1xyXG4gICAgcG9wb3Zlci5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XHJcbiAgICBwb3BvdmVyLnN0eWxlLmNvbG9yID0gXCJyZ2IoMjEwLCAyMTQsIDIxOClcIjtcclxuICAgIHBvcG92ZXIuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgcG9wb3Zlci5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcclxuICAgIHBvcG92ZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xyXG4gICAgcG9wb3Zlci5zdHlsZS5mbGV4RGlyZWN0aW9uID0gXCJjb2x1bW4tcmV2ZXJzZVwiO1xyXG4gICAgLy8gcG9wb3Zlci5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcbiAgICAvLyBBZGQgdG9nZ2xlcyB0byBtZW51XHJcbiAgICBjb25zdCB0b2dnbGVCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdG9nZ2xlQm94LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgIHRvZ2dsZUJveC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgdG9nZ2xlQm94LnN0eWxlLmhlaWdodCA9IFwiNTBweFwiO1xyXG4gICAgdG9nZ2xlQm94LnN0eWxlLnBhZGRpbmcgPSBcIjEwcHhcIjtcclxuICAgIHRvZ2dsZUJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcclxuICAgIHRvZ2dsZUJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcclxuICAgIHRvZ2dsZUJveC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcclxuICAgIHRvZ2dsZUJveC5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIi4zNzVyZW1cIjtcclxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hvd0Rpc3BsYXknLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgY29uc3QgdG9nZ2xlU2hvd0Rpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiMXJlbVwiO1xyXG4gICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XHJcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIxMHB4XCI7XHJcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XHJcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcclxuICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5jbGFzc05hbWUgPSBcInRlbXBcIjtcclxuICAgICAgICAvLyBzaG93IHNob3dEaXNwbGF5IHZhbHVlIGJhc2VkIG9uIGNocm9tZSBzdG9yYWdlXHJcbiAgICAgICAgdmFyIHNob3dEaXNwbGF5VmFsID0gXCJvblwiO1xyXG4gICAgICAgIGlmICgnc2hvd0Rpc3BsYXknIGluIHJlc3VsdCkge1xyXG4gICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IHJlc3VsdC5zaG93RGlzcGxheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gXCJvblwiO1xyXG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaG93RGlzcGxheTogXCJvblwiIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvblwiKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNob3dEaXNwbGF5VmFsID09IFwib2ZmXCIpIHtcclxuICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuaW5uZXJIVE1MID0gXCJzaG93IGRpc3BsYXk6IFwiICsgc2hvd0Rpc3BsYXlWYWw7XHJcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaG93RGlzcGxheScsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzaG93RGlzcGxheVZhbCA9IHJlc3VsdC5zaG93RGlzcGxheTtcclxuICAgICAgICAgICAgICAgIGlmIChzaG93RGlzcGxheVZhbCA9PSBcIm9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93RGlzcGxheVZhbCA9IFwib2ZmXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hvd0Rpc3BsYXlWYWwgPT0gXCJvZmZcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dEaXNwbGF5VmFsID0gXCJvblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaG93RGlzcGxheS5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNob3dEaXNwbGF5OiBzaG93RGlzcGxheVZhbCB9KTtcclxuICAgICAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LmlubmVySFRNTCA9IFwic2hvdyBkaXNwbGF5OiBcIiArIHNob3dEaXNwbGF5VmFsO1xyXG4gICAgICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEucmVsb2FkUG9wb3ZlcikodGV4dGJveCwgcHJvbXB0VGV4dCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdG9nZ2xlU2hvd0Rpc3BsYXkub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNob3dEaXNwbGF5LnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNob3dEaXNwbGF5KTtcclxuICAgIH0pO1xyXG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVByb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgY29uc3QgdG9nZ2xlU2hhcmVQcm9tcHRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCIxcmVtXCI7XHJcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XHJcbiAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiMTBweFwiO1xyXG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcclxuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcclxuICAgICAgICAvLyBzaG93IHNob3dEaXNwbGF5IHZhbHVlIGJhc2VkIG9uIGNocm9tZSBzdG9yYWdlXHJcbiAgICAgICAgdmFyIHNoYXJlUHJvbXB0c1ZhbCA9IFwib25cIjtcclxuICAgICAgICBpZiAoJ3NoYXJlUHJvbXB0cycgaW4gcmVzdWx0ICYmIChyZXN1bHQuc2hhcmVQcm9tcHRzID09ICdvbicgfHwgcmVzdWx0LnNoYXJlUHJvbXB0cyA9PSAnb2ZmJykpIHtcclxuICAgICAgICAgICAgc2hhcmVQcm9tcHRzVmFsID0gcmVzdWx0LnNoYXJlUHJvbXB0cztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNoYXJlUHJvbXB0c1ZhbCA9IFwib25cIjtcclxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVQcm9tcHRzOiBzaGFyZVByb21wdHNWYWwgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzaGFyZVByb21wdHNWYWwgPT0gXCJvblwiKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc2hhcmVQcm9tcHRzVmFsID09IFwib2ZmXCIpIHtcclxuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuaW5uZXJIVE1MID0gXCJzYXZlIHByb21wdHMgJiByZXN1bHRzOiBcIiArIHNoYXJlUHJvbXB0c1ZhbDtcclxuICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVByb21wdHMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsID0gcmVzdWx0LnNoYXJlUHJvbXB0cztcclxuICAgICAgICAgICAgICAgIGlmICh0b2dnbGVTaGFyZVByb21wdHNWYWwgPT0gXCJvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsID0gXCJvZmZcIjtcclxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVByb21wdHM6IFwib2ZmXCIgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2dnbGVTaGFyZVByb21wdHNWYWwgPT0gXCJvZmZcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0c1ZhbCA9IFwib25cIjtcclxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVByb21wdHMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzaGFyZVByb21wdHM6IFwib25cIiB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5pbm5lckhUTUwgPSBcInNhdmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgdG9nZ2xlU2hhcmVQcm9tcHRzVmFsO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRvZ2dsZVNoYXJlUHJvbXB0cy5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdG9nZ2xlU2hhcmVQcm9tcHRzLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNoYXJlUHJvbXB0cyk7XHJcbiAgICB9KTtcclxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc2hhcmVSZXNwb25zZXMnLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgY29uc3QgdG9nZ2xlU2hhcmVSZXNwb25zZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiMXJlbVwiO1xyXG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIxMHB4XCI7XHJcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCIxMHB4XCI7XHJcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XHJcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcclxuICAgICAgICAvLyBzaG93IHNob3dEaXNwbGF5IHZhbHVlIGJhc2VkIG9uIGNocm9tZSBzdG9yYWdlXHJcbiAgICAgICAgdmFyIHNoYXJlUmVzcG9uc2VzVmFsID0gXCJvblwiO1xyXG4gICAgICAgIGlmICgnc2hhcmVSZXNwb25zZXMnIGluIHJlc3VsdCAmJiByZXN1bHQuc2hhcmVSZXNwb25zZXMgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgc2hhcmVSZXNwb25zZXNWYWwgPSByZXN1bHQuc2hhcmVSZXNwb25zZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib25cIjtcclxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2hhcmVSZXNwb25zZXM6IFwib25cIiB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNoYXJlUmVzcG9uc2VzVmFsID09IFwib25cIikge1xyXG4gICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9mZlwiKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuY29sb3IgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLmlubmVySFRNTCA9IFwic2hhcmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVSZXNwb25zZXNWYWw7XHJcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdzaGFyZVJlc3BvbnNlcycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzaGFyZVJlc3BvbnNlc1ZhbCA9IHJlc3VsdC5zaGFyZVJlc3BvbnNlcztcclxuICAgICAgICAgICAgICAgIGlmIChzaGFyZVJlc3BvbnNlc1ZhbCA9PSBcIm9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaGFyZVJlc3BvbnNlc1ZhbCA9IFwib2ZmXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmNvbG9yID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hhcmVSZXNwb25zZXNWYWwgPT0gXCJvZmZcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlUmVzcG9uc2VzVmFsID0gXCJvblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVTaGFyZVJlc3BvbnNlcy5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNoYXJlUmVzcG9uc2VzOiBzaGFyZVJlc3BvbnNlc1ZhbCB9KTtcclxuICAgICAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLmlubmVySFRNTCA9IFwic2hhcmUgcHJvbXB0cyAmIHJlc3VsdHM6IFwiICsgc2hhcmVSZXNwb25zZXNWYWw7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdG9nZ2xlU2hhcmVSZXNwb25zZXMub25tb3VzZW92ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNoYXJlUmVzcG9uc2VzLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdG9nZ2xlQm94LmFwcGVuZENoaWxkKHRvZ2dsZVNoYXJlUmVzcG9uc2VzKTtcclxuICAgIH0pO1xyXG4gICAgcG9wb3Zlci5hcHBlbmRDaGlsZCh0b2dnbGVCb3gpO1xyXG4gICAgLy8gbG9hZCBpbiB0aGUgc3VnZ2VzdGlvbnNcclxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ3Byb21wdHMnLCAnc2hvd0Rpc3BsYXknXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGlmICgnc2hvd0Rpc3BsYXknIGluIHJlc3VsdCAmJiByZXN1bHQuc2hvd0Rpc3BsYXkgPT0gXCJvblwiKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9tcHREaWN0ID0ge307XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQucHJvbXB0cykge1xyXG4gICAgICAgICAgICAgICAgcHJvbXB0RGljdCA9IEpTT04ucGFyc2UocmVzdWx0LnByb21wdHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcm9tcHRNYXRjaExpc3QgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHByb21wdFRleHRMaXN0ID0gcHJvbXB0VGV4dC5zcGxpdCgnICcpO1xyXG4gICAgICAgICAgICB2YXIgYWRkID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy8gc29ydCwgcmV0dXJucyBvbGRlc3QgLS0+IG5ld2VzdFxyXG4gICAgICAgICAgICB2YXIgc29ydGVkUHJvbXB0TGlzdCA9IE9iamVjdC5lbnRyaWVzKHByb21wdERpY3QpLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhWzFdWydsYXN0VXNlZCddIC0gYlsxXVsnbGFzdFVzZWQnXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB0b3AgTiByZXN1bHRzXHJcbiAgICAgICAgICAgIHZhciByZXR1cm5Ub3BOID0gODtcclxuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBba2V5LCB2YWx1ZV0gb2Ygc29ydGVkUHJvbXB0TGlzdC5yZXZlcnNlKCkpIHtcclxuICAgICAgICAgICAgICAgIGFkZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdvcmQgb2YgcHJvbXB0VGV4dExpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAod29yZCAmJiB3b3JkICE9IFwiIFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3b3JkSWR4ID0ga2V5LmluZGV4T2Yod29yZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkSWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgYm9sZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0ga2V5LnN1YnN0cmluZygwLCB3b3JkSWR4KSArIFwiPGI+XCIgKyBrZXkuc3Vic3RyaW5nKHdvcmRJZHgsIHdvcmRJZHggKyB3b3JkLmxlbmd0aCkgKyBcIjwvYj5cIiArIGtleS5zdWJzdHJpbmcod29yZElkeCArIHdvcmQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYWRkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0TWF0Y2hMaXN0LnB1c2goW2tleSwgdmFsdWVdKTtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudGVyICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnRlciA+PSByZXR1cm5Ub3BOKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaWYgY291bnRlciBpcyA8IHJldHVyblRvcE4sIHJldHVybiByZXR1cm5Ub3BOIC0gY291bnRlciBmcm9tIERCXHJcbiAgICAgICAgICAgIC8vIGdldCBhIGxpc3QgYmFzZWQgb24gd29yZHMsIGFuZCBqdXN0IGtlZXAgb24gYWRqdXN0aW5nIHRoYXQgbGlzdD9cclxuICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxQcm9tcHRzTmVlZGVkID0gcmV0dXJuVG9wTiAtIGNvdW50ZXI7XHJcbiAgICAgICAgICAgIHZhciBzZWFyY2hRdWVyeSA9IHByb21wdFRleHQ7XHJcbiAgICAgICAgICAgIGlmIChhZGRpdGlvbmFsUHJvbXB0c05lZWRlZCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZldGNoKGAke2FkZFByb21wdFNlYXJjaExpc3RlbmVyXzEuVVJMfS9pbnN0YW5jZS9nZXRGaWx0ZXJlZD9zZWFyY2g9JHtzZWFyY2hRdWVyeX0mbGltaXQ9JHthZGRpdGlvbmFsUHJvbXB0c05lZWRlZH1gKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKERCcHJvbXB0cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEQnByb21wdHMnLCBEQnByb21wdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldHRpbmcgcmVzcG9uc2VzIGZyb20gREJcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IERCcHJvbXB0IG9mIERCcHJvbXB0cy5pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgREJwcm9tcHRUZXh0ID0gREJwcm9tcHQucHJvbXB0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRCcHJvbXB0XCIsIERCcHJvbXB0LCBEQnByb21wdFRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdvcmQgb2YgcHJvbXB0VGV4dExpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid29yZFwiLCB3b3JkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3b3JkICYmIHdvcmQgIT0gXCIgXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgd29yZElkeCA9IERCcHJvbXB0VGV4dC5pbmRleE9mKHdvcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBib2xkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgREJwcm9tcHRUZXh0ID0gREJwcm9tcHRUZXh0LnN1YnN0cmluZygwLCB3b3JkSWR4KSArIFwiPGI+XCIgKyBEQnByb21wdFRleHQuc3Vic3RyaW5nKHdvcmRJZHgsIHdvcmRJZHggKyB3b3JkLmxlbmd0aCkgKyBcIjwvYj5cIiArIERCcHJvbXB0VGV4dC5zdWJzdHJpbmcod29yZElkeCArIHdvcmQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm91dCBvZiBmb3IgbG9vcFwiLCBEQnByb21wdC5hbnN3ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTT04ucGFyc2UoREJwcm9tcHQuYW5zd2VyKVwiLCBKU09OLnBhcnNlKERCcHJvbXB0LmFuc3dlcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkRCcHJvbXB0LnVzYWdlQ291bnRcIiwgREJwcm9tcHQudXNhZ2VDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRpdGlvbmFsREJwcm9tcHQgPSBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEQnByb21wdFRleHQsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFuc3dlclwiOiBKU09OLnBhcnNlKERCcHJvbXB0LmFuc3dlciksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1c2FnZUNvdW50XCI6IERCcHJvbXB0LnVzYWdlQ291bnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGVyZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0TWF0Y2hMaXN0LnB1c2goYWRkaXRpb25hbERCcHJvbXB0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbmRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGNvbWJpbmVkIERCIGFuZCBsb2NhbCBwcm9tcHRzIHRvIHBvcG92ZXJcclxuICAgICAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5hZGRQcm9tcHRMaXN0KSh0ZXh0Ym94LCBwcm9tcHRNYXRjaExpc3QsIHBvcG92ZXIpO1xyXG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiB3ZSBjdXJyZW50bHkgY2Fubm90IGFjY2VzcyB0aGUgc2hhcmVkIGRhdGFiYXNlIGhlcmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5hZGRQcm9tcHRMaXN0KSh0ZXh0Ym94LCBwcm9tcHRNYXRjaExpc3QsIHBvcG92ZXIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBubyBuZWVkIGZvciBEQlxyXG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMuYWRkUHJvbXB0TGlzdCkodGV4dGJveCwgcHJvbXB0TWF0Y2hMaXN0LCBwb3BvdmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHN1Z2dlc3Rpb25Cb3hFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjc3VnZ2VzdGlvbkJveFwiKTtcclxuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveEVsZW1lbnRzLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBwb3BvdmVyLmlkID0gXCJwb3BvdmVyLXByb21wdC1zZWFyY2hcIjtcclxuICAgIHJldHVybiBwb3BvdmVyO1xyXG59O1xyXG5leHBvcnRzLmdldFBvcG92ZXIgPSBnZXRQb3BvdmVyO1xyXG5jb25zdCBhZGRQcm9tcHRMaXN0ID0gKHRleHRib3gsIHByb21wdE1hdGNoTGlzdCwgcG9wb3ZlcikgPT4ge1xyXG4gICAgdmFyIHByb21wdHNVc2VkID0gW107XHJcbiAgICBmb3IgKGNvbnN0IFtwcm9tcHQsIHZhbF0gb2YgcHJvbXB0TWF0Y2hMaXN0KSB7XHJcbiAgICAgICAgaWYgKCEocHJvbXB0IGluIHByb21wdHNVc2VkKSAmJiB0ZXh0Ym94LnZhbHVlICE9IHByb21wdC5yZXBsYWNlQWxsKFwiPGI+XCIsIFwiXCIpLnJlcGxhY2VBbGwoXCI8L2I+XCIsIFwiXCIpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25Cb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LmlkID0gXCJzdWdnZXN0aW9uQm94XCI7XHJcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUucGFkZGluZyA9IFwiMTBweFwiO1xyXG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xyXG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xyXG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xyXG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiLjM3NXJlbVwiO1xyXG4gICAgICAgICAgICBjb25zdCBpY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgaWNvbkRpdi5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMTBweFwiO1xyXG4gICAgICAgICAgICBjb25zdCB0ZXh0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xyXG4gICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcclxuICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xyXG4gICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm92ZXJmbG93WSA9IFwic2Nyb2xsXCI7XHJcbiAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuc3dlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XHJcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIxNXB4XCI7XHJcbiAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xyXG4gICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcclxuICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xyXG4gICAgICAgICAgICBhbnN3ZXJEaXYuaW5uZXJIVE1MID0gdmFsLmFuc3dlcjtcclxuICAgICAgICAgICAgdGV4dERpdi5pbm5lckhUTUwgPSBwcm9tcHQ7XHJcbiAgICAgICAgICAgIGlmIChcImxhc3RVc2VkXCIgaW4gdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmcm9tIGxvY2FsXHJcbiAgICAgICAgICAgICAgICBpY29uRGl2LmlubmVySFRNTCA9IFwi8J+Vk1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gZnJvbSBEQlxyXG4gICAgICAgICAgICAgICAgaWNvbkRpdi5pbm5lckhUTUwgPSBcIvCflI1cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcclxuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUub3BhY2l0eSA9IFwiMTAwJVwiO1xyXG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjEyNXB4XCI7XHJcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIxMjVweFwiO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XHJcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xyXG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcclxuICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VGV4dCA9IHByb21wdC5yZXBsYWNlQWxsKFwiPGI+XCIsIFwiXCIpLnJlcGxhY2VBbGwoXCI8L2I+XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRib3gudmFsdWUgPSBuZXdUZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2goYCR7YWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMS5VUkx9L2luc3RhbmNlL2dldFByb21wdD9wcm9tcHQ9JHtuZXdUZXh0fWApLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5tZXNzYWdlICE9ICdub3QgZm91bmQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXNVcGRhdGUgPSB7IHByb21wdDogbmV3VGV4dCwgYW5zd2VyOiByZXMuaW5zdGFuY2UuYW5zd2VyLCB1c2FnZUNvdW50OiByZXMuaW5zdGFuY2UudXNhZ2VDb3VudCArIDEgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zVXBkYXRlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXJhbXNVcGRhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoKGAke2FkZFByb21wdFNlYXJjaExpc3RlbmVyXzEuVVJMfS9pbnN0YW5jZS91cGRhdGUvJHtyZXMuaW5zdGFuY2UuX2lkfWAsIG9wdGlvbnNVcGRhdGUpLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLmVkaXRQcm9tcHRUZXh0KShuZXdUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAoMCwgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMS5yZWxvYWRQb3BvdmVyKSh0ZXh0Ym94LCBuZXdUZXh0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0ZXh0V3JhcHBlckRpdi5hcHBlbmRDaGlsZCh0ZXh0RGl2KTtcclxuICAgICAgICAgICAgdGV4dFdyYXBwZXJEaXYuYXBwZW5kQ2hpbGQoYW5zd2VyRGl2KTtcclxuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZChpY29uRGl2KTtcclxuICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZCh0ZXh0V3JhcHBlckRpdik7XHJcbiAgICAgICAgICAgIGlmICghKFwibGFzdFVzZWRcIiBpbiB2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhZGQgdXNhZ2UgY291bnRcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVzYWdlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHVzYWdlRGl2LnN0eWxlLm1hcmdpbkxlZnQgPSBcIjEwcHhcIjtcclxuICAgICAgICAgICAgICAgIHVzYWdlRGl2LmlubmVySFRNTCA9IFwi4piFIFwiICsgdmFsLnVzYWdlQ291bnQ7XHJcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LmFwcGVuZENoaWxkKHVzYWdlRGl2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwb3BvdmVyLmFwcGVuZENoaWxkKHN1Z2dlc3Rpb25Cb3gpO1xyXG4gICAgICAgICAgICBwcm9tcHRzVXNlZC5wdXNoKHByb21wdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLmFkZFByb21wdExpc3QgPSBhZGRQcm9tcHRMaXN0O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL2NvbnRlbnRTY3JpcHQvYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJcIik7XHJcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwiY2hlY2sgd2FzIGNhbGxlZCFcIik7XHJcbiAgICBzd2l0Y2ggKHJlcXVlc3QuYWN0aW9uKSB7XHJcbiAgICAgICAgY2FzZSBcIndlYnNpdGUgbG9hZGVkXCI6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY2hlY2sgd2FzIGNhbGxlZCFcIik7XHJcbiAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLmFkZFByb21wdFNlYXJjaExpc3RlbmVyKSgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogXCJzdWNjZXNzXCIgfSk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=