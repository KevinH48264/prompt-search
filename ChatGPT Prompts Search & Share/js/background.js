/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/contextMenu.ts":
/*!***************************************!*\
  !*** ./src/background/contextMenu.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.contextMenu = void 0;
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
const contextMenu = () => {
    chrome.tabs.onUpdated.addListener(function (tabId, info) {
        if (info.status === 'complete') {
            console.log("tab was updated", tabId, info);
            (0, utils_1.sendMessageInCurrentTab)({
                action: "website loaded",
                command: "append",
            }, function (response) {
            });
            setTimeout(() => { }, 1000 * 20);
        }
    });
};
exports.contextMenu = contextMenu;


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports) {


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
exports.decimalToColor = exports.sendMessageInCurrentTab = exports.getCurrentTab = void 0;
function getCurrentTab() {
    return __awaiter(this, void 0, void 0, function* () {
        const queryOptions = { active: true, lastFocusedWindow: true };
        const [tab] = yield chrome.tabs.query(queryOptions);
        return tab;
    });
}
exports.getCurrentTab = getCurrentTab;
function sendMessageInCurrentTab(message, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const tab = yield getCurrentTab();
        if (!tab.id)
            return;
        return sendMessageInTab(tab.id, message, callback);
    });
}
exports.sendMessageInCurrentTab = sendMessageInCurrentTab;
function sendMessageInTab(tabId, message, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        chrome.tabs.sendMessage(tabId, message, callback);
    });
}
function decimalToColor(decimal) {
    const red = Math.round(255 * (1 - decimal));
    const green = Math.round(255 * decimal);
    return `rgb(${red}, ${green}, 0)`;
}
exports.decimalToColor = decimalToColor;


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
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const contextMenu_1 = __webpack_require__(/*! ./background/contextMenu */ "./src/background/contextMenu.ts");
function execute() {
    (0, contextMenu_1.contextMenu)();
    setTimeout(execute, 1000 * 20);
}
execute();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsbUJBQW1CO0FBQ25CLGdCQUFnQixtQkFBTyxDQUFDLGdDQUFVO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGFBQWE7QUFDYixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSxtQkFBbUI7Ozs7Ozs7Ozs7O0FDakJOO0FBQ2I7QUFDQSw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxzQkFBc0IsR0FBRywrQkFBK0IsR0FBRyxxQkFBcUI7QUFDaEY7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsSUFBSSxJQUFJLE1BQU07QUFDaEM7QUFDQSxzQkFBc0I7Ozs7Ozs7VUN2Q3RCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsc0JBQXNCLG1CQUFPLENBQUMsaUVBQTBCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9iYWNrZ3JvdW5kL2NvbnRleHRNZW51LnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5jb250ZXh0TWVudSA9IHZvaWQgMDtcclxuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcclxuY29uc3QgY29udGV4dE1lbnUgPSAoKSA9PiB7XHJcbiAgICBjaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHRhYklkLCBpbmZvKSB7XHJcbiAgICAgICAgaWYgKGluZm8uc3RhdHVzID09PSAnY29tcGxldGUnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGFiIHdhcyB1cGRhdGVkXCIsIHRhYklkLCBpbmZvKTtcclxuICAgICAgICAgICAgKDAsIHV0aWxzXzEuc2VuZE1lc3NhZ2VJbkN1cnJlbnRUYWIpKHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogXCJ3ZWJzaXRlIGxvYWRlZFwiLFxyXG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJhcHBlbmRcIixcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgfSwgMTAwMCAqIDIwKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuZXhwb3J0cy5jb250ZXh0TWVudSA9IGNvbnRleHRNZW51O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVjaW1hbFRvQ29sb3IgPSBleHBvcnRzLnNlbmRNZXNzYWdlSW5DdXJyZW50VGFiID0gZXhwb3J0cy5nZXRDdXJyZW50VGFiID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBnZXRDdXJyZW50VGFiKCkge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7IGFjdGl2ZTogdHJ1ZSwgbGFzdEZvY3VzZWRXaW5kb3c6IHRydWUgfTtcclxuICAgICAgICBjb25zdCBbdGFiXSA9IHlpZWxkIGNocm9tZS50YWJzLnF1ZXJ5KHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHRhYjtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMuZ2V0Q3VycmVudFRhYiA9IGdldEN1cnJlbnRUYWI7XHJcbmZ1bmN0aW9uIHNlbmRNZXNzYWdlSW5DdXJyZW50VGFiKG1lc3NhZ2UsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGNvbnN0IHRhYiA9IHlpZWxkIGdldEN1cnJlbnRUYWIoKTtcclxuICAgICAgICBpZiAoIXRhYi5pZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiBzZW5kTWVzc2FnZUluVGFiKHRhYi5pZCwgbWVzc2FnZSwgY2FsbGJhY2spO1xyXG4gICAgfSk7XHJcbn1cclxuZXhwb3J0cy5zZW5kTWVzc2FnZUluQ3VycmVudFRhYiA9IHNlbmRNZXNzYWdlSW5DdXJyZW50VGFiO1xyXG5mdW5jdGlvbiBzZW5kTWVzc2FnZUluVGFiKHRhYklkLCBtZXNzYWdlLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJJZCwgbWVzc2FnZSwgY2FsbGJhY2spO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZGVjaW1hbFRvQ29sb3IoZGVjaW1hbCkge1xyXG4gICAgY29uc3QgcmVkID0gTWF0aC5yb3VuZCgyNTUgKiAoMSAtIGRlY2ltYWwpKTtcclxuICAgIGNvbnN0IGdyZWVuID0gTWF0aC5yb3VuZCgyNTUgKiBkZWNpbWFsKTtcclxuICAgIHJldHVybiBgcmdiKCR7cmVkfSwgJHtncmVlbn0sIDApYDtcclxufVxyXG5leHBvcnRzLmRlY2ltYWxUb0NvbG9yID0gZGVjaW1hbFRvQ29sb3I7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBjb250ZXh0TWVudV8xID0gcmVxdWlyZShcIi4vYmFja2dyb3VuZC9jb250ZXh0TWVudVwiKTtcclxuZnVuY3Rpb24gZXhlY3V0ZSgpIHtcclxuICAgICgwLCBjb250ZXh0TWVudV8xLmNvbnRleHRNZW51KSgpO1xyXG4gICAgc2V0VGltZW91dChleGVjdXRlLCAxMDAwICogMjApO1xyXG59XHJcbmV4ZWN1dGUoKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9