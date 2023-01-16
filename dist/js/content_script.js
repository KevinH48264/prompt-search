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
        // sort, returns oldest --> newest
        var sortedPromptList = Object.entries(promptDict).sort((a, b) => {
            return a[1]['lastUsed'].valueOf() - b[1]['lastUsed'].valueOf();
        });
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
            if (counter > 7) {
                break;
            }
        }
        // add prompts to popover
        for (const [prompt, val] of promptMatchList.reverse()) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCOzs7Ozs7O1VDbElsQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtDQUFrQyxtQkFBTyxDQUFDLCtGQUF5QztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudFNjcmlwdC9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lci50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9jb250ZW50U2NyaXB0L3BvcG92ZXIudHMiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvLi9zcmMvY29udGVudF9zY3JpcHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVsb2FkUG9wb3ZlciA9IGV4cG9ydHMuaGlkZVBvcG92ZXIgPSBleHBvcnRzLnNob3dQb3BvdmVyID0gZXhwb3J0cy5jaGVja0ZpbmlzaEFuc3dlcmluZyA9IGV4cG9ydHMuc2F2ZVByb21wdCA9IGV4cG9ydHMuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSB2b2lkIDA7XG5jb25zdCBwb3BvdmVyXzEgPSByZXF1aXJlKFwiLi9wb3BvdmVyXCIpO1xuLy8ganVzdCBmb3IgY29uc3RhbnRseSBjaGVja2luZyB3aGF0J3MgdGhlIGxhdGVzdCBhbnN3ZXIgZGl2XG52YXIgbGF0ZXN0QW5zd2VyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbnZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm11dGF0aW9uOiBcIiwgbXV0YXRpb24pXG4gICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiKSB7XG4gICAgICAgICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGFkZGVkTm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXcgbm9kZTogXCIsIGFkZGVkTm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGFkZGVkTm9kZS5jbGFzc05hbWUgPT0gJ3ctZnVsbCBib3JkZXItYiBib3JkZXItYmxhY2svMTAgZGFyazpib3JkZXItZ3JheS05MDAvNTAgdGV4dC1ncmF5LTgwMCBkYXJrOnRleHQtZ3JheS0xMDAgZ3JvdXAgYmctZ3JheS01MCBkYXJrOmJnLVsjNDQ0NjU0XScpIHtcbiAgICAgICAgICAgICAgICAgICAgbGF0ZXN0QW5zd2VyRGl2ID0gYWRkZWROb2RlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVQREFURSBsYXRlc3QgYW5zd2VyIGRpdjogXCIsIGxhdGVzdEFuc3dlckRpdik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgO1xufSk7XG52YXIgY29uZmlnID0ge1xuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6IHRydWUsXG59O1xuY29uc3QgYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJTdGFydGluZyBDU1MgUmVsb2FkIEVkaXRzIVwiKTtcbiAgICB2YXIgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgLy8gVE9ETzogZml4IHNvIHRoYXQgaXQgYXV0b21hdGljYWxseSBwb3BzIHVwIHdoZW4geW91IG5hdmlnYXRlIHRvIGEgcGFnZVxuICAgIC8vIFByb2JsZW06IGV2ZW4gaWYgVVJMIGNoYW5nZXMsIHRoZSB0ZXh0YXJlYSBkb2Vzbid0IGFsd2F5cyBjaGFuZ2UgaW1tZWRpYXRlbHlcbiAgICAvLyBDdXJyZW50IHNjZW5hcmlvLCB1c2VyIGhhcyB0byBjbGljayBvciBzdGFydCB0eXBpbmdcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBpdGVtID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0YXJlYWJveCA9IGl0ZW07XG4gICAgICAgICAgICBpZiAodGV4dGFyZWFib3gudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gdGV4dGFyZWFib3gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9tcHRUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICgwLCBleHBvcnRzLnJlbG9hZFBvcG92ZXIpKGl0ZW0sIHByb21wdFRleHQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IGhvdyB0byBmaWd1cmUgb3V0IHdoZW4gc29tZXRoaW5nIGlzIGNsaWNrZWRcbiAgICAgICAgLy8gc2F2ZSBwcm9tcHQgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgICAvLyB2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZmxleCBmbGV4LWNvbCB3LWZ1bGwgcHktMiBmbGV4LWdyb3cgbWQ6cHktMyBtZDpwbC00IHJlbGF0aXZlIGJvcmRlciBib3JkZXItYmxhY2svMTAgYmctd2hpdGUgZGFyazpib3JkZXItZ3JheS05MDAvNTAgZGFyazp0ZXh0LXdoaXRlIGRhcms6YmctZ3JheS03MDAgcm91bmRlZC1tZCBzaGFkb3ctWzBfMF8xMHB4X3JnYmEoMCwwLDAsMC4xMCldIGRhcms6c2hhZG93LVswXzBfMTVweF9yZ2JhKDAsMCwwLDAuMTApXScpXG4gICAgICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhYnNvbHV0ZSBwLTEgcm91bmRlZC1tZCB0ZXh0LWdyYXktNTAwIGJvdHRvbS0xLjUgcmlnaHQtMSBtZDpib3R0b20tMi41IG1kOnJpZ2h0LTIgaG92ZXI6YmctZ3JheS0xMDAgZGFyazpob3Zlcjp0ZXh0LWdyYXktNDAwIGRhcms6aG92ZXI6YmctZ3JheS05MDAgZGlzYWJsZWQ6aG92ZXI6YmctdHJhbnNwYXJlbnQgZGFyazpkaXNhYmxlZDpob3ZlcjpiZy10cmFuc3BhcmVudCcpO1xuICAgICAgICBpZiAoYnV0dG9uWzBdLmNvbnRhaW5zKGl0ZW0pIHx8IGJ1dHRvblswXSA9PSBpdGVtKSB7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5zYXZlUHJvbXB0KShwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIHByb21wdFRleHQgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfSkpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBpdGVtID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIHNhdmUgdG8gbG9jYWwgY2hyb21lIHN0b3JhZ2VcbiAgICAgICAgICAgIHZhciB0ZXh0YXJlYWJveCA9IGl0ZW07XG4gICAgICAgICAgICBpZiAodGV4dGFyZWFib3gudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5ICE9IFwiQmFja3NwYWNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlICsgZXZlbnQua2V5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0VGV4dCA9IHRleHRhcmVhYm94LnZhbHVlLnN1YnN0cmluZygwLCB0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBvbmx5IHJlbG9hZCBpZiB5b3UndmUgdHlwZWQgYXQgbGVhc3Qgb25lIHdvcmQ/XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5ID09IFwiIFwiKSB7XG4gICAgICAgICAgICAgICAgKDAsIGV4cG9ydHMucmVsb2FkUG9wb3ZlcikoaXRlbSwgcHJvbXB0VGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB5b3UgaGl0IGJhY2tzcGFjZSBvbiBhIHNwYWNlIC8gZGVsZXRlIGEgd29yZCBvciB5b3UgY2xlYXJlZCBldmVyeXRoaW5nIG91dFxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIkJhY2tzcGFjZVwiICYmICh0ZXh0YXJlYWJveC52YWx1ZVt0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggLSAxXSA9PSBcIiBcIiB8fCB0ZXh0YXJlYWJveC52YWx1ZS5sZW5ndGggPT0gMSkpIHtcbiAgICAgICAgICAgICAgICAoMCwgZXhwb3J0cy5yZWxvYWRQb3BvdmVyKShpdGVtLCBwcm9tcHRUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzYXZlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgaWYgKGV2ZW50LmtleSA9PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICgwLCBleHBvcnRzLnNhdmVQcm9tcHQpKHByb21wdFRleHQpO1xuICAgICAgICAgICAgcHJvbXB0VGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAoMCwgZXhwb3J0cy5oaWRlUG9wb3ZlcikoKTtcbiAgICAgICAgfVxuICAgIH0pKTtcbn07XG5leHBvcnRzLmFkZFByb21wdFNlYXJjaExpc3RlbmVyID0gYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXI7XG4vLyBzYXZlIHByb21wdFxuY29uc3Qgc2F2ZVByb21wdCA9IChwcm9tcHRUZXh0KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICBjb25zb2xlLmxvZyhcInNhdmluZyBwcm9tcHQhXCIpO1xuICAgIC8vIE1heWJlIGNyZWF0ZSBhbiBhZGQgdG8gc3RvcmFnZSBhbmQgaGF2ZSBpdCBhdCB0aGUgZW5kIG9mIGNoZWNrRmluaXNoQW5zd2VyaW5nKCk/XG4gICAgLy8gcmV0cmlldmluZyBmcm9tIGxvY2FsIHN0b3JhZ2UsIGNhbiBhbHNvIGp1c3Qgc3RvcmUgYXMgYSB2YXJpYWJsZSBoZXJlIGlmIHdlIHNlcmlvdXNseSBjYW5ub3Qgd2FpdFxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgncHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgdmFyIHByb21wdERpY3Q7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRpbmcgdG8gbGlzdGVuIGZvciB3aGVuIGl0J3MgZG9uZVwiKTtcbiAgICAgICAgaWYgKHJlc3VsdC5wcm9tcHRzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIndhcyBhYmxlIHRvIGZpbmQgcmVzdWx0LnByb21wdHNcIik7XG4gICAgICAgICAgICBwcm9tcHREaWN0ID0gSlNPTi5wYXJzZShyZXN1bHQucHJvbXB0cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIndhcyBOT1QgYWJsZSB0byBmaW5kIHJlc3VsdC5wcm9tcHRzXCIpO1xuICAgICAgICAgICAgcHJvbXB0RGljdCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhcnRpbmcgdG8gbGlzdGVuIGZvciB3aGVuIGl0J3MgZG9uZSB1c2luZyB0aGlzIHByb21wdERpY3RcIiwgcHJvbXB0RGljdCk7XG4gICAgICAgICgwLCBleHBvcnRzLmNoZWNrRmluaXNoQW5zd2VyaW5nKShwcm9tcHREaWN0LCBwcm9tcHRUZXh0KTtcbiAgICB9KTtcbiAgICAoMCwgZXhwb3J0cy5oaWRlUG9wb3ZlcikoKTtcbn0pO1xuZXhwb3J0cy5zYXZlUHJvbXB0ID0gc2F2ZVByb21wdDtcbmNvbnN0IGNoZWNrRmluaXNoQW5zd2VyaW5nID0gKHByb21wdERpY3QsIHByb21wdFRleHQpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcInN0YXJ0aW5nIGNoZWNrRmluaXNoaW5nQW5zd2VyaW5nIHNlY3Rpb25cIik7XG4gICAgLy8gZm9yIHRyYWNraW5nIHdoZW4gdGhlIGJ1dHRvbiBhcHBlYXJzLCBzaWduaWZ5aW5nIGl0IGlzIGRvbmUgYW5zd2VyaW5nXG4gICAgdmFyIG9ic2VydmVyQnV0dG9uID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucykge1xuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGVkTm9kZSA9IG11dGF0aW9uLmFkZGVkTm9kZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChhZGRlZE5vZGUudGFnTmFtZSA9PT0gXCJzdmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhdGVzdEFuc3dlckRpdiB1cG9uIGNvbXB1dGluZ1wiLCBsYXRlc3RBbnN3ZXJEaXYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRlbXBvcmFyeSBiZWNhdXNlIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG9ubHkgZWxlbWVudCB0aGF0IHVwZGF0ZXMgcHJvcGVybHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcEFuc3dlckRpdlRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnX19uZXh0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBNYWluID0gdGVtcEFuc3dlckRpdlRleHQuY2hpbGROb2Rlc1sxXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcERpdkNvbGxlY3Rpb24gPSB0ZW1wTWFpbi5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF0uY2hpbGROb2Rlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF0ZXN0QW5zd2VyRGl2VGVtcENvbGxlY3Rpb24gPSB0ZW1wRGl2Q29sbGVjdGlvbi5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXRlc3RBbnN3ZXJEaXZUZW1wID0gbGF0ZXN0QW5zd2VyRGl2VGVtcENvbGxlY3Rpb25bdGVtcERpdkNvbGxlY3Rpb24uY2hpbGROb2Rlcy5sZW5ndGggLSAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VyRGl2VGV4dCA9IGxhdGVzdEFuc3dlckRpdlRlbXAgPT09IG51bGwgfHwgbGF0ZXN0QW5zd2VyRGl2VGVtcCA9PT0gdm9pZCAwID8gdm9pZCAwIDogbGF0ZXN0QW5zd2VyRGl2VGVtcC5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMV0uY2hpbGROb2Rlc1swXS5jaGlsZE5vZGVzWzBdLmNoaWxkTm9kZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29kZSB0byBhZGQgdGhlIGFuc3dlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdERpY3RbcHJvbXB0VGV4dF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyRGl2VGV4dC5pbm5lckhUTUwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzYWdlQ291bnQ6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RVc2VkOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBwcm9tcHRzOiBKU09OLnN0cmluZ2lmeShwcm9tcHREaWN0KSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFkZGVkIGN1c3RvbSBwcm9tcHQsIHVwZGF0ZWQgZGljdDogXCIsIHByb21wdERpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzb21ldGhpbmcgbGlrZSBhIGRpdiBkaWRuJ3QgaGF2ZSBlbm91Z2ggbm9kZXMgb3Igc29tZXRoaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21wdERpY3RbcHJvbXB0VGV4dF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcjogXCI8cD5VbmF2YWlsYWJsZTxwPlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2FnZUNvdW50OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VXNlZDogbmV3IERhdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgcHJvbXB0czogSlNPTi5zdHJpbmdpZnkocHJvbXB0RGljdCkgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgIH0pO1xuICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgIH07XG4gICAgdmFyIHRleHRib3hFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZsZXggZmxleC1jb2wgdy1mdWxsIHB5LTIgZmxleC1ncm93IG1kOnB5LTMgbWQ6cGwtNCByZWxhdGl2ZSBib3JkZXIgYm9yZGVyLWJsYWNrLzEwIGJnLXdoaXRlIGRhcms6Ym9yZGVyLWdyYXktOTAwLzUwIGRhcms6dGV4dC13aGl0ZSBkYXJrOmJnLWdyYXktNzAwIHJvdW5kZWQtbWQgc2hhZG93LVswXzBfMTBweF9yZ2JhKDAsMCwwLDAuMTApXSBkYXJrOnNoYWRvdy1bMF8wXzE1cHhfcmdiYSgwLDAsMCwwLjEwKV0nKVswXTtcbiAgICBvYnNlcnZlckJ1dHRvbi5vYnNlcnZlKHRleHRib3hFbCwgY29uZmlnKTtcbn07XG5leHBvcnRzLmNoZWNrRmluaXNoQW5zd2VyaW5nID0gY2hlY2tGaW5pc2hBbnN3ZXJpbmc7XG4vLyBzaG93IHBvcG92ZXJcbmNvbnN0IHNob3dQb3BvdmVyID0gKCkgPT4ge1xuICAgIHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdmVyXCIpO1xuICAgIGlmIChwKSB7XG4gICAgICAgIHAuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICBwLnN0eWxlLmhlaWdodCA9IFwiYXV0b1wiO1xuICAgIH1cbn07XG5leHBvcnRzLnNob3dQb3BvdmVyID0gc2hvd1BvcG92ZXI7XG4vLyBoaWRlIHBvcG92ZXJcbmNvbnN0IGhpZGVQb3BvdmVyID0gKCkgPT4ge1xuICAgIHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdmVyXCIpO1xuICAgIC8vIFRPRE86IHB1dCBiYWNrIGFmdGVyIGRlYnVnZ2luZ1xuICAgIC8vIGlmIChwKSB7XG4gICAgLy8gICBwLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIC8vICAgcC5zdHlsZS5oZWlnaHQgPSBcIjBweFwiXG4gICAgLy8gfVxufTtcbmV4cG9ydHMuaGlkZVBvcG92ZXIgPSBoaWRlUG9wb3Zlcjtcbi8vIG1haW4gY29kZSB0byBzaG93IHBvcHVwXG5jb25zdCByZWxvYWRQb3BvdmVyID0gKHRleHRib3gsIHByb21wdFRleHQpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgLy8gY29uc29sZS5sb2coXCJSRUxPQURJTkcgUE9QT1ZFUlwiKVxuICAgIHZhciBwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3BvdmVyXCIpO1xuICAgIGlmIChwKSB7XG4gICAgICAgIHAucmVtb3ZlKCk7XG4gICAgfVxuICAgIHAgPSAoMCwgcG9wb3Zlcl8xLmdldFBvcG92ZXIpKHRleHRib3gsIHByb21wdFRleHQpO1xuICAgIHZhciB0ZXh0Ym94V3JhcHBlciA9IChfYSA9IHRleHRib3gucGFyZW50RWxlbWVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBhcmVudEVsZW1lbnQ7XG4gICAgdmFyIHRleHRib3hNaWRXcmFwcGVyID0gdGV4dGJveC5wYXJlbnRFbGVtZW50O1xuICAgIHRleHRib3hXcmFwcGVyID09PSBudWxsIHx8IHRleHRib3hXcmFwcGVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0ZXh0Ym94V3JhcHBlci5pbnNlcnRCZWZvcmUocCwgdGV4dGJveE1pZFdyYXBwZXIpO1xuICAgIHAuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0ZXh0Ym94KSB7XG4gICAgICAgICgwLCBleHBvcnRzLnNob3dQb3BvdmVyKSgpO1xuICAgIH1cbiAgICAvLyB0ZXh0Ym94IGlzIGN1cnJlbnRseSBiZWluZyBjaGFuZ2VkXG4gICAgaWYgKHRleHRib3guYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICB0ZXh0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxuICAgIC8vIHRleHRib3ggaGFzIGJlZW4gY2xpY2tlZCBiYWNrIHRvXG4gICAgdGV4dGJveC5vbmZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAoMCwgZXhwb3J0cy5zaG93UG9wb3ZlcikoKTtcbiAgICB9O1xuICAgIC8vIHRleHRib3ggaXMgY2xpY2tlZCBhd2F5LCBkaXNtaXNzIHBvcG92ZXJcbiAgICB0ZXh0Ym94Lm9uYmx1ciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKDAsIGV4cG9ydHMuaGlkZVBvcG92ZXIpKCk7XG4gICAgfTtcbn07XG5leHBvcnRzLnJlbG9hZFBvcG92ZXIgPSByZWxvYWRQb3BvdmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0UG9wb3ZlciA9IHZvaWQgMDtcbmNvbnN0IGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEgPSByZXF1aXJlKFwiLi9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lclwiKTtcbmNvbnN0IGdldFBvcG92ZXIgPSAodGV4dGJveCwgcHJvbXB0VGV4dCkgPT4ge1xuICAgIC8vIFBvcG92ZXIgZWxlbWVudFxuICAgIGNvbnN0IHBvcG92ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHBvcG92ZXIuc3R5bGUud2lkdGggPSB0ZXh0Ym94LnN0eWxlLndpZHRoO1xuICAgIHBvcG92ZXIuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgcG9wb3Zlci5zdHlsZS56SW5kZXggPSBcIjEwXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICBwb3BvdmVyLnN0eWxlLm9wYWNpdHkgPSBcIjc1JVwiO1xuICAgIHBvcG92ZXIuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgIHBvcG92ZXIuc3R5bGUuY29sb3IgPSBcInJnYigyMTAsIDIxNCwgMjE4KVwiO1xuICAgIHBvcG92ZXIuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgIHBvcG92ZXIuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5qdXN0aWZ5Q29udGVudCA9IFwiY2VudGVyXCI7XG4gICAgcG9wb3Zlci5zdHlsZS5mbGV4RGlyZWN0aW9uID0gXCJjb2x1bW5cIjtcbiAgICAvLyBwb3BvdmVyLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAvLyBsb2FkIGluIHRoZSBzdWdnZXN0aW9uc1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgncHJvbXB0cycsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgdmFyIHByb21wdERpY3QgPSB7fTtcbiAgICAgICAgaWYgKHJlc3VsdC5wcm9tcHRzKSB7XG4gICAgICAgICAgICBwcm9tcHREaWN0ID0gSlNPTi5wYXJzZShyZXN1bHQucHJvbXB0cyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJJTiBHRVRQT1BPVkVSLCBUSElTIElTIFBST01QVERJQ1Q6IFwiLCBwcm9tcHREaWN0KVxuICAgICAgICB2YXIgcHJvbXB0TWF0Y2hMaXN0ID0gW107XG4gICAgICAgIHZhciBwcm9tcHRUZXh0TGlzdCA9IHByb21wdFRleHQuc3BsaXQoJyAnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcm9tcHRUZXh0TGlzdFwiLCBwcm9tcHRUZXh0TGlzdClcbiAgICAgICAgdmFyIGFkZCA9IHRydWU7XG4gICAgICAgIC8vIGdldCBwcm9tcHRNYXRjaExpc3Qgd2hpY2ggaXMgYWxsIHRoZSBwcm9tcHRzIHRoYXQgc2hvdWxkIGJlIHByZXNlbnRlZFxuICAgICAgICAvLyBUT0RPOiBzb3J0IHByb21wdERpY3QgYmFzZWQgb24gaG93IHJlY2VudCB0aGUgZW50cnkgd2FzXG4gICAgICAgIC8vIFRPRE86IHN0b3AgYWRkaW5nIG9uY2UgeW91IGhhdmUgOFxuICAgICAgICAvLyBzb3J0LCByZXR1cm5zIG9sZGVzdCAtLT4gbmV3ZXN0XG4gICAgICAgIHZhciBzb3J0ZWRQcm9tcHRMaXN0ID0gT2JqZWN0LmVudHJpZXMocHJvbXB0RGljdCkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFbMV1bJ2xhc3RVc2VkJ10udmFsdWVPZigpIC0gYlsxXVsnbGFzdFVzZWQnXS52YWx1ZU9mKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIGZvciAodmFyIFtrZXksIHZhbHVlXSBvZiBzb3J0ZWRQcm9tcHRMaXN0LnJldmVyc2UoKSkge1xuICAgICAgICAgICAgYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd29yZCBvZiBwcm9tcHRUZXh0TGlzdCkge1xuICAgICAgICAgICAgICAgIGlmICh3b3JkICYmIHdvcmQgIT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmRJZHggPSBrZXkuaW5kZXhPZih3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdvcmRJZHggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBib2xkXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBrZXkuc3Vic3RyaW5nKDAsIHdvcmRJZHgpICsgXCI8Yj5cIiArIGtleS5zdWJzdHJpbmcod29yZElkeCwgd29yZElkeCArIHdvcmQubGVuZ3RoKSArIFwiPC9iPlwiICsga2V5LnN1YnN0cmluZyh3b3JkSWR4ICsgd29yZC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgICAgICBwcm9tcHRNYXRjaExpc3QucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudGVyID4gNykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGFkZCBwcm9tcHRzIHRvIHBvcG92ZXJcbiAgICAgICAgZm9yIChjb25zdCBbcHJvbXB0LCB2YWxdIG9mIHByb21wdE1hdGNoTGlzdC5yZXZlcnNlKCkpIHtcbiAgICAgICAgICAgIGlmICh0ZXh0Ym94LnZhbHVlICE9IHByb21wdC5yZXBsYWNlQWxsKFwiPGI+XCIsIFwiXCIpLnJlcGxhY2VBbGwoXCI8L2I+XCIsIFwiXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbkJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUucGFkZGluZyA9IFwiMTBweFwiO1xuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25Cb3guc3R5bGUub3BhY2l0eSA9IFwiNzUlXCI7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGljb25EaXYuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0V3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcInNhbnMtc2VyaWZcIjtcbiAgICAgICAgICAgICAgICB0ZXh0RGl2LnN0eWxlLm92ZXJmbG93WCA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5vdmVyZmxvd1kgPSBcInNjcm9sbFwiO1xuICAgICAgICAgICAgICAgIHRleHREaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICAgICAgY29uc3QgYW5zd2VyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUuZm9udEZhbWlseSA9IFwic2Fucy1zZXJpZlwiO1xuICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1hcmdpbkxlZnQgPSBcIjE1cHhcIjtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3dYID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUub3ZlcmZsb3dZID0gXCJzY3JvbGxcIjtcbiAgICAgICAgICAgICAgICBhbnN3ZXJEaXYuc3R5bGUubWF4SGVpZ2h0ID0gXCIyNXB4XCI7XG4gICAgICAgICAgICAgICAgYW5zd2VyRGl2LmlubmVySFRNTCA9IHZhbC5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgdGV4dERpdi5pbm5lckhUTUwgPSBwcm9tcHQ7XG4gICAgICAgICAgICAgICAgaWNvbkRpdi5pbm5lckhUTUwgPSBcIvCflZNcIjtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9ubW91c2VvdmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnN0eWxlLm9wYWNpdHkgPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjEyNXB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlckRpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjEyNXB4XCI7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94Lm9ubW91c2VsZWF2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYigzMiwzMywzNSlcIjtcbiAgICAgICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5zdHlsZS5vcGFjaXR5ID0gXCI3NSVcIjtcbiAgICAgICAgICAgICAgICAgICAgdGV4dERpdi5zdHlsZS5tYXhIZWlnaHQgPSBcIjI1cHhcIjtcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyRGl2LnN0eWxlLm1heEhlaWdodCA9IFwiMjVweFwiO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1RleHQgPSBwcm9tcHQucmVwbGFjZUFsbChcIjxiPlwiLCBcIlwiKS5yZXBsYWNlQWxsKFwiPC9iPlwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRib3gudmFsdWUgPSBuZXdUZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEucmVsb2FkUG9wb3ZlcikodGV4dGJveCwgbmV3VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRleHRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKHRleHREaXYpO1xuICAgICAgICAgICAgICAgIHRleHRXcmFwcGVyRGl2LmFwcGVuZENoaWxkKGFuc3dlckRpdik7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkJveC5hcHBlbmRDaGlsZChpY29uRGl2KTtcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uQm94LmFwcGVuZENoaWxkKHRleHRXcmFwcGVyRGl2KTtcbiAgICAgICAgICAgICAgICBwb3BvdmVyLmFwcGVuZENoaWxkKHN1Z2dlc3Rpb25Cb3gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcG9wb3Zlci5pZCA9IFwicG9wb3ZlclwiO1xuICAgIHJldHVybiBwb3BvdmVyO1xufTtcbmV4cG9ydHMuZ2V0UG9wb3ZlciA9IGdldFBvcG92ZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhZGRQcm9tcHRTZWFyY2hMaXN0ZW5lcl8xID0gcmVxdWlyZShcIi4vY29udGVudFNjcmlwdC9hZGRQcm9tcHRTZWFyY2hMaXN0ZW5lclwiKTtcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbiAocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgIHN3aXRjaCAocmVxdWVzdC5hY3Rpb24pIHtcbiAgICAgICAgY2FzZSBcIndlYnNpdGUgbG9hZGVkXCI6XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImNoZWNrIHdhcyBjYWxsZWQhXCIpO1xuICAgICAgICAgICAgKDAsIGFkZFByb21wdFNlYXJjaExpc3RlbmVyXzEuYWRkUHJvbXB0U2VhcmNoTGlzdGVuZXIpKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgc2VuZFJlc3BvbnNlKHsgcmVzdWx0OiBcInN1Y2Nlc3NcIiB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9