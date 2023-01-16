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
    (0, exports.hidePopover)();
});
exports.savePrompt = savePrompt;
const checkFinishAnswering = (promptDict, promptText) => {
    console.log("starting checkFinishingAnswering section");
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
        var sortedPromptList = Object.entries(promptDict).sort((a, b) => {
            return b[1]['lastUsed'].valueOf() - a[1]['lastUsed'].valueOf();
        });
        // stored: [write me an essay about pyramids of giza, ...]
        // search: write me essay
        // 8 prompts that fully match words, sorted by most used
        // x = promptText (search)
        var counter = 0;
        for (var [key, value] of sortedPromptList) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7Ozs7Ozs7VUN0SWxCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0NBQWtDLG1CQUFPLENBQUMsK0ZBQXlDO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L2FkZFByb21wdFNlYXJjaExpc3RlbmVyLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2NvbnRlbnRTY3JpcHQvcG9wb3Zlci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50X3NjcmlwdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZWxvYWRQb3BvdmVyID0gZXhwb3J0cy5oaWRlUG9wb3ZlciA9IGV4cG9ydHMuc2hvd1BvcG92ZXIgPSBleHBvcnRzLmNoZWNrRmluaXNoQW5zd2VyaW5nID0gZXhwb3J0cy5zYXZlUHJvbXB0ID0gZXhwb3J0cy5hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lciA9IHZvaWQgMDtcbmNvbnN0IHBvcG92ZXJfMSA9IHJlcXVpcmUoXCIuL3BvcG92ZXJcIik7XG4vLyBqdXN0IGZvciBjb25zdGFudGx5IGNoZWNraW5nIHdoYXQncyB0aGUgbGF0ZXN0IGFuc3dlciBkaXZcbnZhciBsYXRlc3RBbnN3ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xudmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwibXV0YXRpb246IFwiLCBtdXRhdGlvbilcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIpIHtcbiAgICAgICAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgYWRkZWROb2RlID0gbm9kZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ldyBub2RlOiBcIiwgYWRkZWROb2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoYWRkZWROb2RlLmNsYXNzTmFtZSA9PSAndy1mdWxsIGJvcmRlci1iIGJvcmRlci1ibGFjay8xMCBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCB0ZXh0LWdyYXktODAwIGRhcms6dGV4dC1ncmF5LTEwMCBncm91cCBiZy1ncmF5LTUwIGRhcms6YmctWyM0NDQ2NTRdJykge1xuICAgICAgICAgICAgICAgICAgICBsYXRlc3RBbnN3ZXJEaXYgPSBhZGRlZE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVVBEQVRFIGxhdGVzdCBhbnN3ZXIgZGl2OiBcIiwgbGF0ZXN0QW5zd2VyRGl2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICA7XG59KTtcbnZhciBjb25maWcgPSB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gICAgYXR0cmlidXRlczogdHJ1ZSxcbn07XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIlN0YXJ0aW5nIENTUyBSZWxvYWQgRWRpdHMhXCIpO1xuICAgIHZhciBwcm9tcHRUZXh0ID0gXCJcIjtcbiAgICAvLyBUT0RPOiBmaXggc28gdGhhdCBpdCBhdXRvbWF0aWNhbGx5IHBvcHMgdXAgd2hlbiB5b3UgbmF2aWdhdGUgdG8gYSBwYWdlXG4gICAgLy8gUHJvYmxlbTogZXZlbiBpZiBVUkwgY2hhbmdlcywgdGhlIHRleHRhcmVhIGRvZXNuJ3QgYWx3YXlzIGNoYW5nZSBpbW1lZGlhdGVseVxuICAgIC8vIEN1cnJlbnQgc2NlbmFyaW8sIHVzZXIgaGFzIHRvIGNsaWNrIG9yIHN0YXJ0IHR5cGluZ1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIHRleHRhcmVhYm94ID0gaXRlbTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYWJveC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSB0ZXh0YXJlYWJveC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogaG93IHRvIGZpZ3VyZSBvdXQgd2hlbiBzb21ldGhpbmcgaXMgY2xpY2tlZFxuICAgICAgICAvLyBzYXZlIHByb21wdCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICAgIC8vIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmbGV4IGZsZXgtY29sIHctZnVsbCBweS0yIGZsZXgtZ3JvdyBtZDpweS0zIG1kOnBsLTQgcmVsYXRpdmUgYm9yZGVyIGJvcmRlci1ibGFjay8xMCBiZy13aGl0ZSBkYXJrOmJvcmRlci1ncmF5LTkwMC81MCBkYXJrOnRleHQtd2hpdGUgZGFyazpiZy1ncmF5LTcwMCByb3VuZGVkLW1kIHNoYWRvdy1bMF8wXzEwcHhfcmdiYSgwLDAsMCwwLjEwKV0gZGFyazpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMCwwLDAsMC4xMCldJylcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Fic29sdXRlIHAtMSByb3VuZGVkLW1kIHRleHQtZ3JheS01MDAgYm90dG9tLTEuNSByaWdodC0xIG1kOmJvdHRvbS0yLjUgbWQ6cmlnaHQtMiBob3ZlcjpiZy1ncmF5LTEwMCBkYXJrOmhvdmVyOnRleHQtZ3JheS00MDAgZGFyazpob3ZlcjpiZy1ncmF5LTkwMCBkaXNhYmxlZDpob3ZlcjpiZy10cmFuc3BhcmVudCBkYXJrOmRpc2FibGVkOmhvdmVyOmJnLXRyYW5zcGFyZW50Jyk7XG4gICAgICAgIGlmIChidXR0b25bMF0uY29udGFpbnMoaXRlbSkgfHwgYnV0dG9uWzBdID09IGl0ZW0pIHtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnNhdmVQcm9tcHQpKHByb21wdFRleHQpO1xuICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9KSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gc2F2ZSB0byBsb2NhbCBjaHJvbWUgc3RvcmFnZVxuICAgICAgICAgICAgdmFyIHRleHRhcmVhYm94ID0gaXRlbTtcbiAgICAgICAgICAgIGlmICh0ZXh0YXJlYWJveC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkgIT0gXCJCYWNrc3BhY2VcIikge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gdGV4dGFyZWFib3gudmFsdWUgKyBldmVudC5rZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gdGV4dGFyZWFib3gudmFsdWUuc3Vic3RyaW5nKDAsIHRleHRhcmVhYm94LnZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG9ubHkgcmVsb2FkIGlmIHlvdSd2ZSB0eXBlZCBhdCBsZWFzdCBvbmUgd29yZD9cbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIHlvdSBoaXQgYmFja3NwYWNlIG9uIGEgc3BhY2UgLyBkZWxldGUgYSB3b3JkIG9yIHlvdSBjbGVhcmVkIGV2ZXJ5dGhpbmcgb3V0XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09IFwiQmFja3NwYWNlXCIgJiYgKHRleHRhcmVhYm94LnZhbHVlW3RleHRhcmVhYm94LnZhbHVlLmxlbmd0aCAtIDFdID09IFwiIFwiIHx8IHRleHRhcmVhYm94LnZhbHVlLmxlbmd0aCA9PSAxKSkge1xuICAgICAgICAgICAgICAgICgwLCBleHBvcnRzLnJlbG9hZFBvcG92ZXIpKGl0ZW0sIHByb21wdFRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHNhdmUgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgICBpZiAoZXZlbnQua2V5ID09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgKDAsIGV4cG9ydHMuc2F2ZVByb21wdCkocHJvbXB0VGV4dCk7XG4gICAgICAgICAgICBwcm9tcHRUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xuICAgICAgICB9XG4gICAgfSkpO1xufTtcbmV4cG9ydHMuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcjtcbi8vIHNhdmUgcHJvbXB0XG5jb25zdCBzYXZlUHJvbXB0ID0gKHByb21wdFRleHQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIGNvbnNvbGUubG9nKFwic2F2aW5nIHByb21wdCFcIik7XG4gICAgLy8gTWF5YmUgY3JlYXRlIGFuIGFkZCB0byBzdG9yYWdlIGFuZCBoYXZlIGl0IGF0IHRoZSBlbmQgb2YgY2hlY2tGaW5pc2hBbnN3ZXJpbmcoKT9cbiAgICAvLyByZXRyaWV2aW5nIGZyb20gbG9jYWwgc3RvcmFnZSwgY2FuIGFsc28ganVzdCBzdG9yZSBhcyBhIHZhcmlhYmxlIGhlcmUgaWYgd2Ugc2VyaW91c2x5IGNhbm5vdCB3YWl0XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdwcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB2YXIgcHJvbXB0RGljdDtcbiAgICAgICAgY29uc29sZS5sb2coXCJzdGFydGluZyB0byBsaXN0ZW4gZm9yIHdoZW4gaXQncyBkb25lXCIpO1xuICAgICAgICBpZiAocmVzdWx0LnByb21wdHMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2FzIGFibGUgdG8gZmluZCByZXN1bHQucHJvbXB0c1wiKTtcbiAgICAgICAgICAgIHByb21wdERpY3QgPSBKU09OLnBhcnNlKHJlc3VsdC5wcm9tcHRzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid2FzIE5PVCBhYmxlIHRvIGZpbmQgcmVzdWx0LnByb21wdHNcIik7XG4gICAgICAgICAgICBwcm9tcHREaWN0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJzdGFydGluZyB0byBsaXN0ZW4gZm9yIHdoZW4gaXQncyBkb25lIHVzaW5nIHRoaXMgcHJvbXB0RGljdFwiLCBwcm9tcHREaWN0KTtcbiAgICAgICAgKDAsIGV4cG9ydHMuY2hlY2tGaW5pc2hBbnN3ZXJpbmcpKHByb21wdERpY3QsIHByb21wdFRleHQpO1xuICAgIH0pO1xuICAgICgwLCBleHBvcnRzLmhpZGVQb3BvdmVyKSgpO1xufSk7XG5leHBvcnRzLnNhdmVQcm9tcHQgPSBzYXZlUHJvbXB0O1xuY29uc3QgY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSAocHJvbXB0RGljdCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwic3RhcnRpbmcgY2hlY2tGaW5pc2hpbmdBbnN3ZXJpbmcgc2VjdGlvblwiKTtcbiAgICAvLyBmb3IgdHJhY2tpbmcgd2hlbiB0aGUgYnV0dG9uIGFwcGVhcnMsIHNpZ25pZnlpbmcgaXQgaXMgZG9uZSBhbnN3ZXJpbmdcbiAgICB2YXIgb2JzZXJ2ZXJCdXR0b24gPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zKSB7XG4gICAgICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJjaGlsZExpc3RcIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWRkZWROb2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFkZGVkTm9kZS50YWdOYW1lID09PSBcInN2Z1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGF0ZXN0QW5zd2VyRGl2IHVwb24gY29tcHV0aW5nXCIsIGxhdGVzdEFuc3dlckRpdik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGVtcG9yYXJ5IGJlY2F1c2UgdGhpcyBzZWVtcyB0byBiZSB0aGUgb25seSBlbGVtZW50IHRoYXQgdXBkYXRlcyBwcm9wZXJseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wQW5zd2VyRGl2VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdfX25leHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcE1haW4gPSB0ZW1wQW5zd2VyRGl2VGV4dC5jaGlsZE5vZGVzWzFdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wRGl2Q29sbGVjdGlvbiA9IHRlbXBNYWluLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXRlc3RBbnN3ZXJEaXZUZW1wQ29sbGVjdGlvbiA9IHRlbXBEaXZDb2xsZWN0aW9uLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhdGVzdEFuc3dlckRpdlRlbXAgPSBsYXRlc3RBbnN3ZXJEaXZUZW1wQ29sbGVjdGlvblt0ZW1wRGl2Q29sbGVjdGlvbi5jaGlsZE5vZGVzLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJEaXZUZXh0ID0gbGF0ZXN0QW5zd2VyRGl2VGVtcCA9PT0gbnVsbCB8fCBsYXRlc3RBbnN3ZXJEaXZUZW1wID09PSB2b2lkIDAgPyB2b2lkIDAgOiBsYXRlc3RBbnN3ZXJEaXZUZW1wLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2RlIHRvIGFkZCB0aGUgYW5zd2VyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0RGljdFtwcm9tcHRUZXh0XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXJEaXZUZXh0LmlubmVySFRNTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNhZ2VDb3VudDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFVzZWQ6IG5ldyBEYXRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHByb21wdHM6IEpTT04uc3RyaW5naWZ5KHByb21wdERpY3QpIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWRkZWQgY3VzdG9tIHByb21wdCwgdXBkYXRlZCBkaWN0OiBcIiwgcHJvbXB0RGljdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoX2EpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNvbWV0aGluZyBsaWtlIGEgZGl2IGRpZG4ndCBoYXZlIGVub3VnaCBub2RlcyBvciBzb21ldGhpbmdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXB0RGljdFtwcm9tcHRUZXh0XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyOiBcIjxwPlVuYXZhaWxhYmxlPHA+XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzYWdlQ291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVc2VkOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwcm9tcHRzOiBKU09OLnN0cmluZ2lmeShwcm9tcHREaWN0KSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgfSk7XG4gICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgfTtcbiAgICB2YXIgdGV4dGJveEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZmxleCBmbGV4LWNvbCB3LWZ1bGwgcHktMiBmbGV4LWdyb3cgbWQ6cHktMyBtZDpwbC00IHJlbGF0aXZlIGJvcmRlciBib3JkZXItYmxhY2svMTAgYmctd2hpdGUgZGFyazpib3JkZXItZ3JheS05MDAvNTAgZGFyazp0ZXh0LXdoaXRlIGRhcms6YmctZ3JheS03MDAgcm91bmRlZC1tZCBzaGFkb3ctWzBfMF8xMHB4X3JnYmEoMCwwLDAsMC4xMCldIGRhcms6c2hhZG93LVswXzBfMTVweF9yZ2JhKDAsMCwwLDAuMTApXScpWzBdO1xuICAgIG9ic2VydmVyQnV0dG9uLm9ic2VydmUodGV4dGJveEVsLCBjb25maWcpO1xufTtcbmV4cG9ydHMuY2hlY2tGaW5pc2hBbnN3ZXJpbmcgPSBjaGVja0ZpbmlzaEFuc3dlcmluZztcbi8vIHNob3cgcG9wb3ZlclxuY29uc3Qgc2hvd1BvcG92ZXIgPSAoKSA9PiB7XG4gICAgdmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcG92ZXJcIik7XG4gICAgaWYgKHApIHtcbiAgICAgICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIHAuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgfVxufTtcbmV4cG9ydHMuc2hvd1BvcG92ZXIgPSBzaG93UG9wb3Zlcjtcbi8vIGhpZGUgcG9wb3ZlclxuY29uc3QgaGlkZVBvcG92ZXIgPSAoKSA9PiB7XG4gICAgdmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcG92ZXJcIik7XG4gICAgLy8gVE9ETzogcHV0IGJhY2sgYWZ0ZXIgZGVidWdnaW5nXG4gICAgLy8gaWYgKHApIHtcbiAgICAvLyAgIHAuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgLy8gICBwLnN0eWxlLmhlaWdodCA9IFwiMHB4XCJcbiAgICAvLyB9XG59O1xuZXhwb3J0cy5oaWRlUG9wb3ZlciA9IGhpZGVQb3BvdmVyO1xuLy8gbWFpbiBjb2RlIHRvIHNob3cgcG9wdXBcbmNvbnN0IHJlbG9hZFBvcG92ZXIgPSAodGV4dGJveCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIHZhciBfYTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIlJFTE9BRElORyBQT1BPVkVSXCIpXG4gICAgdmFyIHAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBvcG92ZXJcIik7XG4gICAgaWYgKHApIHtcbiAgICAgICAgcC5yZW1vdmUoKTtcbiAgICB9XG4gICAgcCA9ICgwLCBwb3BvdmVyXzEuZ2V0UG9wb3ZlcikodGV4dGJveCwgcHJvbXB0VGV4dCk7XG4gICAgdmFyIHRleHRib3hXcmFwcGVyID0gKF9hID0gdGV4dGJveC5wYXJlbnRFbGVtZW50KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGFyZW50RWxlbWVudDtcbiAgICB2YXIgdGV4dGJveE1pZFdyYXBwZXIgPSB0ZXh0Ym94LnBhcmVudEVsZW1lbnQ7XG4gICAgdGV4dGJveFdyYXBwZXIgPT09IG51bGwgfHwgdGV4dGJveFdyYXBwZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRleHRib3hXcmFwcGVyLmluc2VydEJlZm9yZShwLCB0ZXh0Ym94TWlkV3JhcHBlcik7XG4gICAgcC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRleHRib3gpIHtcbiAgICAgICAgKDAsIGV4cG9ydHMuc2hvd1BvcG92ZXIpKCk7XG4gICAgfVxuICAgIC8vIHRleHRib3ggaXMgY3VycmVudGx5IGJlaW5nIGNoYW5nZWRcbiAgICBpZiAodGV4dGJveC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIHRleHRib3guYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG4gICAgLy8gdGV4dGJveCBoYXMgYmVlbiBjbGlja2VkIGJhY2sgdG9cbiAgICB0ZXh0Ym94Lm9uZm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICgwLCBleHBvcnRzLnNob3dQb3BvdmVyKSgpO1xuICAgIH07XG4gICAgLy8gdGV4dGJveCBpcyBjbGlja2VkIGF3YXksIGRpc21pc3MgcG9wb3ZlclxuICAgIHRleHRib3gub25ibHVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAoMCwgZXhwb3J0cy5oaWRlUG9wb3ZlcikoKTtcbiAgICB9O1xufTtcbmV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IHJlbG9hZFBvcG92ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRQb3BvdmVyID0gdm9pZCAwO1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL2FkZFByb21wdFNlYXJjaExpc3RlbmVyXCIpO1xuY29uc3QgZ2V0UG9wb3ZlciA9ICh0ZXh0Ym94LCBwcm9tcHRUZXh0KSA9PiB7XG4gICAgLy8gUG9wb3ZlciBlbGVtZW50XG4gICAgY29uc3QgcG9wb3ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcG9wb3Zlci5zdHlsZS53aWR0aCA9IHRleHRib3guc3R5bGUud2lkdGg7XG4gICAgcG9wb3Zlci5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICBwb3BvdmVyLnN0eWxlLnpJbmRleCA9IFwiMTBcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKDMyLDMzLDM1KVwiO1xuICAgIHBvcG92ZXIuc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5jb2xvciA9IFwicmdiKDIxMCwgMjE0LCAyMTgpXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgcG9wb3Zlci5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcbiAgICBwb3BvdmVyLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSBcImNvbHVtblwiO1xuICAgIC8vIHBvcG92ZXIuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgIC8vIGxvYWQgaW4gdGhlIHN1Z2dlc3Rpb25zXG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdwcm9tcHRzJywgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICB2YXIgcHJvbXB0RGljdCA9IHt9O1xuICAgICAgICBpZiAocmVzdWx0LnByb21wdHMpIHtcbiAgICAgICAgICAgIHByb21wdERpY3QgPSBKU09OLnBhcnNlKHJlc3VsdC5wcm9tcHRzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIklOIEdFVFBPUE9WRVIsIFRISVMgSVMgUFJPTVBURElDVDogXCIsIHByb21wdERpY3QpXG4gICAgICAgIHZhciBwcm9tcHRNYXRjaExpc3QgPSBbXTtcbiAgICAgICAgdmFyIHByb21wdFRleHRMaXN0ID0gcHJvbXB0VGV4dC5zcGxpdCgnICcpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInByb21wdFRleHRMaXN0XCIsIHByb21wdFRleHRMaXN0KVxuICAgICAgICB2YXIgYWRkID0gdHJ1ZTtcbiAgICAgICAgLy8gZ2V0IHByb21wdE1hdGNoTGlzdCB3aGljaCBpcyBhbGwgdGhlIHByb21wdHMgdGhhdCBzaG91bGQgYmUgcHJlc2VudGVkXG4gICAgICAgIC8vIFRPRE86IHNvcnQgcHJvbXB0RGljdCBiYXNlZCBvbiBob3cgcmVjZW50IHRoZSBlbnRyeSB3YXNcbiAgICAgICAgLy8gVE9ETzogc3RvcCBhZGRpbmcgb25jZSB5b3UgaGF2ZSA4XG4gICAgICAgIC8vIHNvcnRcbiAgICAgICAgdmFyIHNvcnRlZFByb21wdExpc3QgPSBPYmplY3QuZW50cmllcyhwcm9tcHREaWN0KS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYlsxXVsnbGFzdFVzZWQnXS52YWx1ZU9mKCkgLSBhWzFdWydsYXN0VXNlZCddLnZhbHVlT2YoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHN0b3JlZDogW3dyaXRlIG1lIGFuIGVzc2F5IGFib3V0IHB5cmFtaWRzIG9mIGdpemEsIC4uLl1cbiAgICAgICAgLy8gc2VhcmNoOiB3cml0ZSBtZSBlc3NheVxuICAgICAgICAvLyA4IHByb21wdHMgdGhhdCBmdWxseSBtYXRjaCB3b3Jkcywgc29ydGVkIGJ5IG1vc3QgdXNlZFxuICAgICAgICAvLyB4ID0gcHJvbXB0VGV4dCAoc2VhcmNoKVxuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIGZvciAodmFyIFtrZXksIHZhbHVlXSBvZiBzb3J0ZWRQcm9tcHRMaXN0KSB7XG4gICAgICAgICAgICBhZGQgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChjb25zdCB3b3JkIG9mIHByb21wdFRleHRMaXN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHdvcmQgJiYgd29yZCAhPSBcIiBcIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgd29yZElkeCA9IGtleS5pbmRleE9mKHdvcmQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAod29yZElkeCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGJvbGRcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGtleS5zdWJzdHJpbmcoMCwgd29yZElkeCkgKyBcIjxiPlwiICsga2V5LnN1YnN0cmluZyh3b3JkSWR4LCB3b3JkSWR4ICsgd29yZC5sZW5ndGgpICsgXCI8L2I+XCIgKyBrZXkuc3Vic3RyaW5nKHdvcmRJZHggKyB3b3JkLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFkZCkge1xuICAgICAgICAgICAgICAgIHByb21wdE1hdGNoTGlzdC5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvdW50ZXIgPiA3KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWRkIHByb21wdHMgdG8gcG9wb3ZlclxuICAgICAgICBmb3IgKGNvbnN0IFtwcm9tcHQsIHZhbF0gb2YgcHJvbXB0TWF0Y2hMaXN0KSB7XG4gICAgICAgICAgICBpZiAodGV4dGJveC52YWx1ZSAhPSBwcm9tcHQucmVwbGFjZUFsbChcIjxiPlwiLCBcIlwiKS5yZXBsYWNlQWxsKFwiPC9iPlwiLCBcIlwiKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25Cb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLnBhZGRpbmcgPSBcIjEwcHhcIjtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBpY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBpY29uRGl2LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dFdyYXBwZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5mb250RmFtaWx5ID0gXCJzYW5zLXNlcmlmXCI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5vdmVyZmxvd1ggPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuc3dlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIxNXB4XCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm92ZXJmbG93WSA9IFwic2Nyb2xsXCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgICAgIGFuc3dlckRpdi5pbm5lckhUTUwgPSB2YWwuYW5zd2VyO1xuICAgICAgICAgICAgICAgIHRleHREaXYuaW5uZXJIVE1MID0gcHJvbXB0O1xuICAgICAgICAgICAgICAgIGljb25EaXYuaW5uZXJIVE1MID0gXCLwn5WTXCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbm1vdXNlb3ZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCIxMDAlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIxMjVweFwiO1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIxMjVweFwiO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbm1vdXNlbGVhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoMzIsMzMsMzUpXCI7XG4gICAgICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3gub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdUZXh0ID0gcHJvbXB0LnJlcGxhY2VBbGwoXCI8Yj5cIiwgXCJcIikucmVwbGFjZUFsbChcIjwvYj5cIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Ym94LnZhbHVlID0gbmV3VGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLnJlbG9hZFBvcG92ZXIpKHRleHRib3gsIG5ld1RleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0ZXh0V3JhcHBlckRpdi5hcHBlbmRDaGlsZCh0ZXh0RGl2KTtcbiAgICAgICAgICAgICAgICB0ZXh0V3JhcHBlckRpdi5hcHBlbmRDaGlsZChhbnN3ZXJEaXYpO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guYXBwZW5kQ2hpbGQoaWNvbkRpdik7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZCh0ZXh0V3JhcHBlckRpdik7XG4gICAgICAgICAgICAgICAgcG9wb3Zlci5hcHBlbmRDaGlsZChzdWdnZXN0aW9uQm94KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHBvcG92ZXIuaWQgPSBcInBvcG92ZXJcIjtcbiAgICByZXR1cm4gcG9wb3Zlcjtcbn07XG5leHBvcnRzLmdldFBvcG92ZXIgPSBnZXRQb3BvdmVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJfMSA9IHJlcXVpcmUoXCIuL2NvbnRlbnRTY3JpcHQvYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXJcIik7XG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgLy8gY29uc29sZS5sb2coXCJjaGVjayB3YXMgY2FsbGVkIVwiKTtcbiAgICBzd2l0Y2ggKHJlcXVlc3QuYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgXCJ3ZWJzaXRlIGxvYWRlZFwiOlxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjaGVjayB3YXMgY2FsbGVkIVwiKTtcbiAgICAgICAgICAgICgwLCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xLmFkZFByb21wdFNlYXJjaExpc3RlbmVyKSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogXCJzdWNjZXNzXCIgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==