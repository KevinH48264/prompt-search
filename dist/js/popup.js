/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup.tsx":
/*!***********************!*\
  !*** ./src/popup.tsx ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __webpack_require__(/*! @chakra-ui/react */ "./node_modules/@chakra-ui/react/dist/index.js");
const react_2 = __importDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
const react_dom_1 = __importDefault(__webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js"));
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
const react_color_1 = __webpack_require__(/*! react-color */ "./node_modules/react-color/es/index.js");
const changeBackground = (style) => {
    chrome.storage.local.set({ color: '' });
    chrome.storage.local.set({ key: style });
    (0, utils_1.sendMessageInCurrentTab)({
        action: "checkReload",
        command: "append",
    }, function (response) {
    });
    setTimeout(() => { }, 1000 * 20);
};
const openFeedback = () => {
    chrome.tabs.create({ url: "https://tinyurl.com/stylegpt-feedback" });
};
const handleColorChange = (color, event) => {
    console.log('event', event);
    chrome.storage.local.get(['key', 'color'], function (result) {
        if (result.color != color.hex && event._reactName == "onClick") {
            (0, utils_1.sendMessageInCurrentTab)({
                action: "checkReload",
                command: "append",
            }, function (response) {
            });
            setTimeout(() => { }, 1000 * 20);
            chrome.storage.local.set({ key: '' });
            chrome.storage.local.set({ color: color.hex });
        }
    });
};
const Popup = ({}) => {
    chrome.storage.local.get(['key'], function (result) {
        if (!result.key) {
            chrome.storage.local.set({ key: "" });
        }
    });
    return react_2.default.createElement(react_1.Box, { style: { display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", borderRadius: ".375rem" }, bg: "#343540" },
        react_2.default.createElement("h3", { style: { width: '100%', color: "white", display: 'flex', justifyContent: 'center', textAlign: 'center' } }, "Welcome to Style ChatGPT"),
        react_2.default.createElement("p", { style: { margin: '10px', width: '90%', color: "white", display: 'inline', justifyContent: 'center', textAlign: 'center' } },
            "Customize your ChatGPT theme background by clicking on one of the buttons below. This is in beta so options are currently limited, but more will be coming if there is demand. So if you have any requests or feedback, please leave feedback at ",
            react_2.default.createElement("a", { style: { color: "lightblue" }, onClick: () => { openFeedback(); }, href: "https://tinyurl.com/stylegpt-feedback" }, "tinyurl.com/stylegpt-feedback"),
            ". Enjoy!"),
        react_2.default.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', overflow: "auto" } },
            react_2.default.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px' } },
                react_2.default.createElement(react_1.Button, { onClick: () => changeBackground('cute'), style: { width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px' } }, "Cute"),
                react_2.default.createElement("img", { style: { width: "150px" }, src: "https://drive.google.com/uc?export=view&id=1e-S6Ro4GgwWTlwOzFbPWpNaOKiHQtT6e" })),
            react_2.default.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px' } },
                react_2.default.createElement(react_1.Button, { onClick: () => changeBackground('nature'), style: { width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px' } }, "Nature"),
                react_2.default.createElement("img", { style: { width: "150px" }, src: "https://drive.google.com/uc?export=view&id=1QPUgRukNszhrTd7BB0MZxkDI3cvM3r9W" })),
            react_2.default.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px' } },
                react_2.default.createElement(react_1.Button, { onClick: () => changeBackground('cool'), style: { width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px' } }, "Cool"),
                react_2.default.createElement("img", { style: { width: "150px" }, src: "https://drive.google.com/uc?export=view&id=14n6-YtJ8-LO9EMRLhbAc9UbNBaqgpZJF" }))),
        react_2.default.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', overflow: "auto" } },
            react_2.default.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px' } },
                react_2.default.createElement(react_1.Button, { onClick: () => changeBackground('pretty'), style: { width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px' } }, "Pretty"),
                react_2.default.createElement("img", { style: { width: "150px" }, src: "https://drive.google.com/uc?export=view&id=1fly1ssPsJ9sL5yWA__tYRSCCWs4WWDZF" })),
            react_2.default.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px' } },
                react_2.default.createElement(react_1.Button, { onClick: () => changeBackground(''), style: { width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px' } }, "Default"),
                react_2.default.createElement("img", { style: { width: "150px", height: "150px", border: "1px solid black" }, src: "https://drive.google.com/uc?export=view&id=1yaPXcYMvUqd8kEWheZr6qnNd_Avv2_PU" }))),
        react_2.default.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', overflow: "auto" } },
            react_2.default.createElement("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: '10px' } },
                react_2.default.createElement(react_1.Button, { onClick: () => changeBackground('default'), style: { width: "80%", height: "35px", borderRadius: ".375rem", backgroundColor: "#202123", fontWeight: "bold", color: "white", margin: '10px' } }, "Custom Color"),
                react_2.default.createElement(react_color_1.SwatchesPicker, { onChange: (color, event) => handleColorChange(color, event) }))));
};
exports["default"] = Popup;
react_dom_1.default.render(react_2.default.createElement(react_2.default.StrictMode, null,
    react_2.default.createElement(Popup, null)), document.getElementById("root"));


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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"popup": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkchrome_extension_typescript_starter"] = self["webpackChunkchrome_extension_typescript_starter"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/popup.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQTs7Ozs7V0NoREE7Ozs7O1VFQUE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyLy4vc3JjL3BvcHVwLnRzeCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9jcmVhdGUgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2hyb21lLWV4dGVuc2lvbi10eXBlc2NyaXB0LXN0YXJ0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24tdHlwZXNjcmlwdC1zdGFydGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jaHJvbWUtZXh0ZW5zaW9uLXR5cGVzY3JpcHQtc3RhcnRlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCByZWFjdF8xID0gcmVxdWlyZShcIkBjaGFrcmEtdWkvcmVhY3RcIik7XG5jb25zdCByZWFjdF8yID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJyZWFjdFwiKSk7XG5jb25zdCByZWFjdF9kb21fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicmVhY3QtZG9tXCIpKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmNvbnN0IHJlYWN0X2NvbG9yXzEgPSByZXF1aXJlKFwicmVhY3QtY29sb3JcIik7XG5jb25zdCBjaGFuZ2VCYWNrZ3JvdW5kID0gKHN0eWxlKSA9PiB7XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgY29sb3I6ICcnIH0pO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IGtleTogc3R5bGUgfSk7XG4gICAgKDAsIHV0aWxzXzEuc2VuZE1lc3NhZ2VJbkN1cnJlbnRUYWIpKHtcbiAgICAgICAgYWN0aW9uOiBcImNoZWNrUmVsb2FkXCIsXG4gICAgICAgIGNvbW1hbmQ6IFwiYXBwZW5kXCIsXG4gICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgfSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7IH0sIDEwMDAgKiAyMCk7XG59O1xuY29uc3Qgb3BlbkZlZWRiYWNrID0gKCkgPT4ge1xuICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogXCJodHRwczovL3Rpbnl1cmwuY29tL3N0eWxlZ3B0LWZlZWRiYWNrXCIgfSk7XG59O1xuY29uc3QgaGFuZGxlQ29sb3JDaGFuZ2UgPSAoY29sb3IsIGV2ZW50KSA9PiB7XG4gICAgY29uc29sZS5sb2coJ2V2ZW50JywgZXZlbnQpO1xuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ2tleScsICdjb2xvciddLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuY29sb3IgIT0gY29sb3IuaGV4ICYmIGV2ZW50Ll9yZWFjdE5hbWUgPT0gXCJvbkNsaWNrXCIpIHtcbiAgICAgICAgICAgICgwLCB1dGlsc18xLnNlbmRNZXNzYWdlSW5DdXJyZW50VGFiKSh7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiBcImNoZWNrUmVsb2FkXCIsXG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJhcHBlbmRcIixcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgfSwgMTAwMCAqIDIwKTtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IGtleTogJycgfSk7XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBjb2xvcjogY29sb3IuaGV4IH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuY29uc3QgUG9wdXAgPSAoe30pID0+IHtcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydrZXknXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAoIXJlc3VsdC5rZXkpIHtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IGtleTogXCJcIiB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZWFjdF8yLmRlZmF1bHQuY3JlYXRlRWxlbWVudChyZWFjdF8xLkJveCwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIiwgYm9yZGVyUmFkaXVzOiBcIi4zNzVyZW1cIiB9LCBiZzogXCIjMzQzNTQwXCIgfSxcbiAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCB7IHN0eWxlOiB7IHdpZHRoOiAnMTAwJScsIGNvbG9yOiBcIndoaXRlXCIsIGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCB0ZXh0QWxpZ246ICdjZW50ZXInIH0gfSwgXCJXZWxjb21lIHRvIFN0eWxlIENoYXRHUFRcIiksXG4gICAgICAgIHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwicFwiLCB7IHN0eWxlOiB7IG1hcmdpbjogJzEwcHgnLCB3aWR0aDogJzkwJScsIGNvbG9yOiBcIndoaXRlXCIsIGRpc3BsYXk6ICdpbmxpbmUnLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIHRleHRBbGlnbjogJ2NlbnRlcicgfSB9LFxuICAgICAgICAgICAgXCJDdXN0b21pemUgeW91ciBDaGF0R1BUIHRoZW1lIGJhY2tncm91bmQgYnkgY2xpY2tpbmcgb24gb25lIG9mIHRoZSBidXR0b25zIGJlbG93LiBUaGlzIGlzIGluIGJldGEgc28gb3B0aW9ucyBhcmUgY3VycmVudGx5IGxpbWl0ZWQsIGJ1dCBtb3JlIHdpbGwgYmUgY29taW5nIGlmIHRoZXJlIGlzIGRlbWFuZC4gU28gaWYgeW91IGhhdmUgYW55IHJlcXVlc3RzIG9yIGZlZWRiYWNrLCBwbGVhc2UgbGVhdmUgZmVlZGJhY2sgYXQgXCIsXG4gICAgICAgICAgICByZWFjdF8yLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImFcIiwgeyBzdHlsZTogeyBjb2xvcjogXCJsaWdodGJsdWVcIiB9LCBvbkNsaWNrOiAoKSA9PiB7IG9wZW5GZWVkYmFjaygpOyB9LCBocmVmOiBcImh0dHBzOi8vdGlueXVybC5jb20vc3R5bGVncHQtZmVlZGJhY2tcIiB9LCBcInRpbnl1cmwuY29tL3N0eWxlZ3B0LWZlZWRiYWNrXCIpLFxuICAgICAgICAgICAgXCIuIEVuam95IVwiKSxcbiAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGZsZXhEaXJlY3Rpb246ICdyb3cnLCBvdmVyZmxvdzogXCJhdXRvXCIgfSB9LFxuICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBtYXJnaW46ICcxMHB4JyB9IH0sXG4gICAgICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQocmVhY3RfMS5CdXR0b24sIHsgb25DbGljazogKCkgPT4gY2hhbmdlQmFja2dyb3VuZCgnY3V0ZScpLCBzdHlsZTogeyB3aWR0aDogXCI4MCVcIiwgaGVpZ2h0OiBcIjM1cHhcIiwgYm9yZGVyUmFkaXVzOiBcIi4zNzVyZW1cIiwgYmFja2dyb3VuZENvbG9yOiBcIiMyMDIxMjNcIiwgZm9udFdlaWdodDogXCJib2xkXCIsIGNvbG9yOiBcIndoaXRlXCIsIG1hcmdpbjogJzEwcHgnIH0gfSwgXCJDdXRlXCIpLFxuICAgICAgICAgICAgICAgIHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3R5bGU6IHsgd2lkdGg6IFwiMTUwcHhcIiB9LCBzcmM6IFwiaHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL3VjP2V4cG9ydD12aWV3JmlkPTFlLVM2Um80R2d3V1Rsd096RmJQV3BOYU9LaUhRdFQ2ZVwiIH0pKSxcbiAgICAgICAgICAgIHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgbWFyZ2luOiAnMTBweCcgfSB9LFxuICAgICAgICAgICAgICAgIHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KHJlYWN0XzEuQnV0dG9uLCB7IG9uQ2xpY2s6ICgpID0+IGNoYW5nZUJhY2tncm91bmQoJ25hdHVyZScpLCBzdHlsZTogeyB3aWR0aDogXCI4MCVcIiwgaGVpZ2h0OiBcIjM1cHhcIiwgYm9yZGVyUmFkaXVzOiBcIi4zNzVyZW1cIiwgYmFja2dyb3VuZENvbG9yOiBcIiMyMDIxMjNcIiwgZm9udFdlaWdodDogXCJib2xkXCIsIGNvbG9yOiBcIndoaXRlXCIsIG1hcmdpbjogJzEwcHgnIH0gfSwgXCJOYXR1cmVcIiksXG4gICAgICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzdHlsZTogeyB3aWR0aDogXCIxNTBweFwiIH0sIHNyYzogXCJodHRwczovL2RyaXZlLmdvb2dsZS5jb20vdWM/ZXhwb3J0PXZpZXcmaWQ9MVFQVWdSdWtOc3poclRkN0JCME1aeGtESTNjdk0zcjlXXCIgfSkpLFxuICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBtYXJnaW46ICcxMHB4JyB9IH0sXG4gICAgICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQocmVhY3RfMS5CdXR0b24sIHsgb25DbGljazogKCkgPT4gY2hhbmdlQmFja2dyb3VuZCgnY29vbCcpLCBzdHlsZTogeyB3aWR0aDogXCI4MCVcIiwgaGVpZ2h0OiBcIjM1cHhcIiwgYm9yZGVyUmFkaXVzOiBcIi4zNzVyZW1cIiwgYmFja2dyb3VuZENvbG9yOiBcIiMyMDIxMjNcIiwgZm9udFdlaWdodDogXCJib2xkXCIsIGNvbG9yOiBcIndoaXRlXCIsIG1hcmdpbjogJzEwcHgnIH0gfSwgXCJDb29sXCIpLFxuICAgICAgICAgICAgICAgIHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3R5bGU6IHsgd2lkdGg6IFwiMTUwcHhcIiB9LCBzcmM6IFwiaHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL3VjP2V4cG9ydD12aWV3JmlkPTE0bjYtWXRKOC1MTzlFTVJMaGJBYzlVYk5CYXFncFpKRlwiIH0pKSksXG4gICAgICAgIHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBmbGV4RGlyZWN0aW9uOiAncm93Jywgb3ZlcmZsb3c6IFwiYXV0b1wiIH0gfSxcbiAgICAgICAgICAgIHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgbWFyZ2luOiAnMTBweCcgfSB9LFxuICAgICAgICAgICAgICAgIHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KHJlYWN0XzEuQnV0dG9uLCB7IG9uQ2xpY2s6ICgpID0+IGNoYW5nZUJhY2tncm91bmQoJ3ByZXR0eScpLCBzdHlsZTogeyB3aWR0aDogXCI4MCVcIiwgaGVpZ2h0OiBcIjM1cHhcIiwgYm9yZGVyUmFkaXVzOiBcIi4zNzVyZW1cIiwgYmFja2dyb3VuZENvbG9yOiBcIiMyMDIxMjNcIiwgZm9udFdlaWdodDogXCJib2xkXCIsIGNvbG9yOiBcIndoaXRlXCIsIG1hcmdpbjogJzEwcHgnIH0gfSwgXCJQcmV0dHlcIiksXG4gICAgICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzdHlsZTogeyB3aWR0aDogXCIxNTBweFwiIH0sIHNyYzogXCJodHRwczovL2RyaXZlLmdvb2dsZS5jb20vdWM/ZXhwb3J0PXZpZXcmaWQ9MWZseTFzc1BzSjlzTDV5V0FfX3RZUlNDQ1dzNFdXRFpGXCIgfSkpLFxuICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBtYXJnaW46ICcxMHB4JyB9IH0sXG4gICAgICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQocmVhY3RfMS5CdXR0b24sIHsgb25DbGljazogKCkgPT4gY2hhbmdlQmFja2dyb3VuZCgnJyksIHN0eWxlOiB7IHdpZHRoOiBcIjgwJVwiLCBoZWlnaHQ6IFwiMzVweFwiLCBib3JkZXJSYWRpdXM6IFwiLjM3NXJlbVwiLCBiYWNrZ3JvdW5kQ29sb3I6IFwiIzIwMjEyM1wiLCBmb250V2VpZ2h0OiBcImJvbGRcIiwgY29sb3I6IFwid2hpdGVcIiwgbWFyZ2luOiAnMTBweCcgfSB9LCBcIkRlZmF1bHRcIiksXG4gICAgICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzdHlsZTogeyB3aWR0aDogXCIxNTBweFwiLCBoZWlnaHQ6IFwiMTUwcHhcIiwgYm9yZGVyOiBcIjFweCBzb2xpZCBibGFja1wiIH0sIHNyYzogXCJodHRwczovL2RyaXZlLmdvb2dsZS5jb20vdWM/ZXhwb3J0PXZpZXcmaWQ9MXlhUFhjWU12VXFkOGtFV2hlWnI2cW5OZF9BdnYyX1BVXCIgfSkpKSxcbiAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGZsZXhEaXJlY3Rpb246ICdyb3cnLCBvdmVyZmxvdzogXCJhdXRvXCIgfSB9LFxuICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBtYXJnaW46ICcxMHB4JyB9IH0sXG4gICAgICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQocmVhY3RfMS5CdXR0b24sIHsgb25DbGljazogKCkgPT4gY2hhbmdlQmFja2dyb3VuZCgnZGVmYXVsdCcpLCBzdHlsZTogeyB3aWR0aDogXCI4MCVcIiwgaGVpZ2h0OiBcIjM1cHhcIiwgYm9yZGVyUmFkaXVzOiBcIi4zNzVyZW1cIiwgYmFja2dyb3VuZENvbG9yOiBcIiMyMDIxMjNcIiwgZm9udFdlaWdodDogXCJib2xkXCIsIGNvbG9yOiBcIndoaXRlXCIsIG1hcmdpbjogJzEwcHgnIH0gfSwgXCJDdXN0b20gQ29sb3JcIiksXG4gICAgICAgICAgICAgICAgcmVhY3RfMi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQocmVhY3RfY29sb3JfMS5Td2F0Y2hlc1BpY2tlciwgeyBvbkNoYW5nZTogKGNvbG9yLCBldmVudCkgPT4gaGFuZGxlQ29sb3JDaGFuZ2UoY29sb3IsIGV2ZW50KSB9KSkpKTtcbn07XG5leHBvcnRzLmRlZmF1bHQgPSBQb3B1cDtcbnJlYWN0X2RvbV8xLmRlZmF1bHQucmVuZGVyKHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KHJlYWN0XzIuZGVmYXVsdC5TdHJpY3RNb2RlLCBudWxsLFxuICAgIHJlYWN0XzIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFBvcHVwLCBudWxsKSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWNpbWFsVG9Db2xvciA9IGV4cG9ydHMuc2VuZE1lc3NhZ2VJbkN1cnJlbnRUYWIgPSBleHBvcnRzLmdldEN1cnJlbnRUYWIgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZXRDdXJyZW50VGFiKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IHsgYWN0aXZlOiB0cnVlLCBsYXN0Rm9jdXNlZFdpbmRvdzogdHJ1ZSB9O1xuICAgICAgICBjb25zdCBbdGFiXSA9IHlpZWxkIGNocm9tZS50YWJzLnF1ZXJ5KHF1ZXJ5T3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0YWI7XG4gICAgfSk7XG59XG5leHBvcnRzLmdldEN1cnJlbnRUYWIgPSBnZXRDdXJyZW50VGFiO1xuZnVuY3Rpb24gc2VuZE1lc3NhZ2VJbkN1cnJlbnRUYWIobWVzc2FnZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zdCB0YWIgPSB5aWVsZCBnZXRDdXJyZW50VGFiKCk7XG4gICAgICAgIGlmICghdGFiLmlkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICByZXR1cm4gc2VuZE1lc3NhZ2VJblRhYih0YWIuaWQsIG1lc3NhZ2UsIGNhbGxiYWNrKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuc2VuZE1lc3NhZ2VJbkN1cnJlbnRUYWIgPSBzZW5kTWVzc2FnZUluQ3VycmVudFRhYjtcbmZ1bmN0aW9uIHNlbmRNZXNzYWdlSW5UYWIodGFiSWQsIG1lc3NhZ2UsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIG1lc3NhZ2UsIGNhbGxiYWNrKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGRlY2ltYWxUb0NvbG9yKGRlY2ltYWwpIHtcbiAgICBjb25zdCByZWQgPSBNYXRoLnJvdW5kKDI1NSAqICgxIC0gZGVjaW1hbCkpO1xuICAgIGNvbnN0IGdyZWVuID0gTWF0aC5yb3VuZCgyNTUgKiBkZWNpbWFsKTtcbiAgICByZXR1cm4gYHJnYigke3JlZH0sICR7Z3JlZW59LCAwKWA7XG59XG5leHBvcnRzLmRlY2ltYWxUb0NvbG9yID0gZGVjaW1hbFRvQ29sb3I7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCJ2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgPyAob2JqKSA9PiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikpIDogKG9iaikgPT4gKG9iai5fX3Byb3RvX18pO1xudmFyIGxlYWZQcm90b3R5cGVzO1xuLy8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4vLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbi8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuLy8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4vLyBtb2RlICYgMTY6IHJldHVybiB2YWx1ZSB3aGVuIGl0J3MgUHJvbWlzZS1saWtlXG4vLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuXHRpZihtb2RlICYgMSkgdmFsdWUgPSB0aGlzKHZhbHVlKTtcblx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcblx0aWYodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSkge1xuXHRcdGlmKChtb2RlICYgNCkgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuXHRcdGlmKChtb2RlICYgMTYpICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nKSByZXR1cm4gdmFsdWU7XG5cdH1cblx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcblx0dmFyIGRlZiA9IHt9O1xuXHRsZWFmUHJvdG90eXBlcyA9IGxlYWZQcm90b3R5cGVzIHx8IFtudWxsLCBnZXRQcm90byh7fSksIGdldFByb3RvKFtdKSwgZ2V0UHJvdG8oZ2V0UHJvdG8pXTtcblx0Zm9yKHZhciBjdXJyZW50ID0gbW9kZSAmIDIgJiYgdmFsdWU7IHR5cGVvZiBjdXJyZW50ID09ICdvYmplY3QnICYmICF+bGVhZlByb3RvdHlwZXMuaW5kZXhPZihjdXJyZW50KTsgY3VycmVudCA9IGdldFByb3RvKGN1cnJlbnQpKSB7XG5cdFx0T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY3VycmVudCkuZm9yRWFjaCgoa2V5KSA9PiAoZGVmW2tleV0gPSAoKSA9PiAodmFsdWVba2V5XSkpKTtcblx0fVxuXHRkZWZbJ2RlZmF1bHQnXSA9ICgpID0+ICh2YWx1ZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChucywgZGVmKTtcblx0cmV0dXJuIG5zO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwicG9wdXBcIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2hyb21lX2V4dGVuc2lvbl90eXBlc2NyaXB0X3N0YXJ0ZXJcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2hyb21lX2V4dGVuc2lvbl90eXBlc2NyaXB0X3N0YXJ0ZXJcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9yXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3BvcHVwLnRzeFwiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9