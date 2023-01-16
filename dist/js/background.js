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
    // fetch(`http://localhost:9090/instance/get`)
    //   .then((res) => res.json())
    //     .then((res) => {
    //       console.log("res", res)
    //   });
    var searchWords = "Spain capital";
    fetch(`http://localhost:9090/instance/getFiltered?search=${searchWords}&limit=2`)
        .then((res) => res.json())
        .then((res) => {
        console.log("res", res);
    });
    setTimeout(execute, 1000 * 20);
}
execute();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsbUJBQW1CO0FBQ25CLGdCQUFnQixtQkFBTyxDQUFDLGdDQUFVO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGFBQWE7QUFDYixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSxtQkFBbUI7Ozs7Ozs7Ozs7O0FDakJOO0FBQ2I7QUFDQSw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxzQkFBc0IsR0FBRywrQkFBK0IsR0FBRyxxQkFBcUI7QUFDaEY7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsSUFBSSxJQUFJLE1BQU07QUFDaEM7QUFDQSxzQkFBc0I7Ozs7Ozs7VUN2Q3RCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsc0JBQXNCLG1CQUFPLENBQUMsaUVBQTBCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLCtEQUErRCxZQUFZO0FBQzNFO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy9iYWNrZ3JvdW5kL2NvbnRleHRNZW51LnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNvbnRleHRNZW51ID0gdm9pZCAwO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbmNvbnN0IGNvbnRleHRNZW51ID0gKCkgPT4ge1xuICAgIGNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAodGFiSWQsIGluZm8pIHtcbiAgICAgICAgaWYgKGluZm8uc3RhdHVzID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRhYiB3YXMgdXBkYXRlZFwiLCB0YWJJZCwgaW5mbyk7XG4gICAgICAgICAgICAoMCwgdXRpbHNfMS5zZW5kTWVzc2FnZUluQ3VycmVudFRhYikoe1xuICAgICAgICAgICAgICAgIGFjdGlvbjogXCJ3ZWJzaXRlIGxvYWRlZFwiLFxuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwiYXBwZW5kXCIsXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IH0sIDEwMDAgKiAyMCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5leHBvcnRzLmNvbnRleHRNZW51ID0gY29udGV4dE1lbnU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWNpbWFsVG9Db2xvciA9IGV4cG9ydHMuc2VuZE1lc3NhZ2VJbkN1cnJlbnRUYWIgPSBleHBvcnRzLmdldEN1cnJlbnRUYWIgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZXRDdXJyZW50VGFiKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IHsgYWN0aXZlOiB0cnVlLCBsYXN0Rm9jdXNlZFdpbmRvdzogdHJ1ZSB9O1xuICAgICAgICBjb25zdCBbdGFiXSA9IHlpZWxkIGNocm9tZS50YWJzLnF1ZXJ5KHF1ZXJ5T3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0YWI7XG4gICAgfSk7XG59XG5leHBvcnRzLmdldEN1cnJlbnRUYWIgPSBnZXRDdXJyZW50VGFiO1xuZnVuY3Rpb24gc2VuZE1lc3NhZ2VJbkN1cnJlbnRUYWIobWVzc2FnZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCB0YWIgPSB5aWVsZCBnZXRDdXJyZW50VGFiKCk7XG4gICAgICAgIGlmICghdGFiLmlkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICByZXR1cm4gc2VuZE1lc3NhZ2VJblRhYih0YWIuaWQsIG1lc3NhZ2UsIGNhbGxiYWNrKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuc2VuZE1lc3NhZ2VJbkN1cnJlbnRUYWIgPSBzZW5kTWVzc2FnZUluQ3VycmVudFRhYjtcbmZ1bmN0aW9uIHNlbmRNZXNzYWdlSW5UYWIodGFiSWQsIG1lc3NhZ2UsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIG1lc3NhZ2UsIGNhbGxiYWNrKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGRlY2ltYWxUb0NvbG9yKGRlY2ltYWwpIHtcbiAgICBjb25zdCByZWQgPSBNYXRoLnJvdW5kKDI1NSAqICgxIC0gZGVjaW1hbCkpO1xuICAgIGNvbnN0IGdyZWVuID0gTWF0aC5yb3VuZCgyNTUgKiBkZWNpbWFsKTtcbiAgICByZXR1cm4gYHJnYigke3JlZH0sICR7Z3JlZW59LCAwKWA7XG59XG5leHBvcnRzLmRlY2ltYWxUb0NvbG9yID0gZGVjaW1hbFRvQ29sb3I7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb250ZXh0TWVudV8xID0gcmVxdWlyZShcIi4vYmFja2dyb3VuZC9jb250ZXh0TWVudVwiKTtcbmZ1bmN0aW9uIGV4ZWN1dGUoKSB7XG4gICAgKDAsIGNvbnRleHRNZW51XzEuY29udGV4dE1lbnUpKCk7XG4gICAgLy8gZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6OTA5MC9pbnN0YW5jZS9nZXRgKVxuICAgIC8vICAgLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSlcbiAgICAvLyAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgIC8vICAgICAgIGNvbnNvbGUubG9nKFwicmVzXCIsIHJlcylcbiAgICAvLyAgIH0pO1xuICAgIHZhciBzZWFyY2hXb3JkcyA9IFwiU3BhaW4gY2FwaXRhbFwiO1xuICAgIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjkwOTAvaW5zdGFuY2UvZ2V0RmlsdGVyZWQ/c2VhcmNoPSR7c2VhcmNoV29yZHN9JmxpbWl0PTJgKVxuICAgICAgICAudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzXCIsIHJlcyk7XG4gICAgfSk7XG4gICAgc2V0VGltZW91dChleGVjdXRlLCAxMDAwICogMjApO1xufVxuZXhlY3V0ZSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9