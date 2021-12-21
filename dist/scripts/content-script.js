/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/content-script.tsx":
/*!************************************!*\
  !*** ./scripts/content-script.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var ts_pattern__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ts-pattern */ \"../node_modules/ts-pattern/lib/index.js\");\n\nfunction main() {\n  let currentPage = window.location.href;\n  (0,ts_pattern__WEBPACK_IMPORTED_MODULE_0__.match)(currentPage).when((url) => /.+\\/pulls(\\?.*)?/.test(url), () => {\n    let issuesNode = document.querySelectorAll('div[aria-label=\"Issues\"]');\n    let issues = Array.from(issuesNode[0].children[0].children);\n    issues.filter((issue) => issue.getElementsByClassName(\"color-fg-danger\").length > 0).forEach((issue) => issue.style.backgroundColor = \"lightcoral\");\n  }).otherwise(() => null);\n  setTimeout(() => main(), 333);\n}\ndocument.onreadystatechange = function() {\n  if (document.readyState === \"complete\") {\n    main();\n  }\n};\n\n\n//# sourceURL=webpack:///./scripts/content-script.tsx?");

/***/ }),

/***/ "../node_modules/ts-pattern/lib/guards.js":
/*!************************************************!*\
  !*** ../node_modules/ts-pattern/lib/guards.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.instanceOf = exports.select = exports.not = exports.when = void 0;\nconst symbols = __webpack_require__(/*! ./symbols */ \"../node_modules/ts-pattern/lib/symbols.js\");\nconst when = (predicate) => ({\n    [symbols.PatternKind]: symbols.Guard,\n    [symbols.Guard]: predicate,\n});\nexports.when = when;\nconst not = (pattern) => ({\n    [symbols.PatternKind]: symbols.Not,\n    [symbols.Not]: pattern,\n});\nexports.not = not;\nfunction select(key) {\n    return key === undefined\n        ? {\n            [symbols.PatternKind]: symbols.Select,\n            [symbols.Select]: symbols.AnonymousSelectKey,\n        }\n        : {\n            [symbols.PatternKind]: symbols.Select,\n            [symbols.Select]: key,\n        };\n}\nexports.select = select;\nfunction isInstanceOf(classConstructor) {\n    return (val) => val instanceof classConstructor;\n}\nconst instanceOf = (classConstructor) => (0, exports.when)(isInstanceOf(classConstructor));\nexports.instanceOf = instanceOf;\n\n\n//# sourceURL=webpack:///../node_modules/ts-pattern/lib/guards.js?");

/***/ }),

/***/ "../node_modules/ts-pattern/lib/index.js":
/*!***********************************************!*\
  !*** ../node_modules/ts-pattern/lib/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.isMatching = exports.match = exports.instanceOf = exports.select = exports.not = exports.when = exports.__ = void 0;\nconst symbols = __webpack_require__(/*! ./symbols */ \"../node_modules/ts-pattern/lib/symbols.js\");\nconst guards_1 = __webpack_require__(/*! ./guards */ \"../node_modules/ts-pattern/lib/guards.js\");\nObject.defineProperty(exports, \"when\", ({ enumerable: true, get: function () { return guards_1.when; } }));\nObject.defineProperty(exports, \"not\", ({ enumerable: true, get: function () { return guards_1.not; } }));\nObject.defineProperty(exports, \"select\", ({ enumerable: true, get: function () { return guards_1.select; } }));\nObject.defineProperty(exports, \"instanceOf\", ({ enumerable: true, get: function () { return guards_1.instanceOf; } }));\nconst wildcards_1 = __webpack_require__(/*! ./wildcards */ \"../node_modules/ts-pattern/lib/wildcards.js\");\nObject.defineProperty(exports, \"__\", ({ enumerable: true, get: function () { return wildcards_1.__; } }));\n/**\n * #### match\n *\n * Entry point to create a pattern matching expression.\n *\n * It returns a `Match` builder, on which you can chain\n * several `.with(pattern, handler)` clauses.\n */\nconst match = (value) => builder(value, []);\nexports.match = match;\n/**\n * ### builder\n * This is the implementation of our pattern matching, using the\n * builder pattern.\n */\nconst builder = (value, cases) => {\n    const run = () => {\n        const entry = cases.find(({ test }) => test(value));\n        if (!entry) {\n            let displayedValue;\n            try {\n                displayedValue = JSON.stringify(value);\n            }\n            catch (e) {\n                displayedValue = value;\n            }\n            throw new Error(`Pattern matching error: no pattern matches value ${displayedValue}`);\n        }\n        return entry.handler(entry.select(value), value);\n    };\n    return {\n        with(...args) {\n            const handler = args[args.length - 1];\n            const patterns = [];\n            const predicates = [];\n            for (let i = 0; i < args.length - 1; i++) {\n                const arg = args[i];\n                if (typeof arg === 'function') {\n                    predicates.push(arg);\n                }\n                else {\n                    patterns.push(arg);\n                }\n            }\n            let selected = {};\n            const doesMatch = (value) => Boolean(patterns.some((pattern) => matchPattern(pattern, value, (key, value) => {\n                selected[key] = value;\n            })) && predicates.every((predicate) => predicate(value)));\n            return builder(value, cases.concat([\n                {\n                    test: doesMatch,\n                    handler,\n                    select: (value) => Object.keys(selected).length\n                        ? symbols.AnonymousSelectKey in selected\n                            ? selected[symbols.AnonymousSelectKey]\n                            : selected\n                        : value,\n                },\n            ]));\n        },\n        when: (predicate, handler) => builder(value, cases.concat([\n            {\n                test: predicate,\n                handler,\n                select: (value) => value,\n            },\n        ])),\n        otherwise: (handler) => builder(value, cases.concat([\n            {\n                test: () => true,\n                handler,\n                select: (value) => value,\n            },\n        ])).run(),\n        exhaustive: () => run(),\n        run,\n    };\n};\nconst isObject = (value) => Boolean(value && typeof value === 'object');\nconst isGuardPattern = (x) => {\n    const pattern = x;\n    return pattern && pattern[symbols.PatternKind] === symbols.Guard;\n};\nconst isNotPattern = (x) => {\n    const pattern = x;\n    return pattern && pattern[symbols.PatternKind] === symbols.Not;\n};\nconst isSelectPattern = (x) => {\n    const pattern = x;\n    return pattern && pattern[symbols.PatternKind] === symbols.Select;\n};\n// tells us if the value matches a given pattern.\nconst matchPattern = (pattern, value, select) => {\n    if (isObject(pattern)) {\n        if (isGuardPattern(pattern))\n            return Boolean(pattern[symbols.Guard](value));\n        if (isSelectPattern(pattern)) {\n            select(pattern[symbols.Select], value);\n            return true;\n        }\n        if (isNotPattern(pattern))\n            return !matchPattern(pattern[symbols.Not], value, select);\n        if (!isObject(value))\n            return false;\n        if (Array.isArray(pattern)) {\n            if (!Array.isArray(value))\n                return false;\n            // List pattern\n            if (pattern.length === 1) {\n                const selected = {};\n                const listSelect = (key, value) => {\n                    selected[key] = (selected[key] || []).concat([value]);\n                };\n                const doesMatch = value.every((v) => matchPattern(pattern[0], v, listSelect));\n                if (doesMatch) {\n                    Object.keys(selected).forEach((key) => select(key, selected[key]));\n                }\n                return doesMatch;\n            }\n            // Tuple pattern\n            return pattern.length === value.length\n                ? pattern.every((subPattern, i) => matchPattern(subPattern, value[i], select))\n                : false;\n        }\n        if (pattern instanceof Map) {\n            if (!(value instanceof Map))\n                return false;\n            return [...pattern.keys()].every((key) => matchPattern(pattern.get(key), value.get(key), select));\n        }\n        if (pattern instanceof Set) {\n            if (!(value instanceof Set))\n                return false;\n            if (pattern.size === 0)\n                return value.size === 0;\n            if (pattern.size === 1) {\n                const [subPattern] = [...pattern.values()];\n                return Object.values(wildcards_1.__).includes(subPattern)\n                    ? matchPattern([subPattern], [...value.values()], select)\n                    : value.has(subPattern);\n            }\n            return [...pattern.values()].every((subPattern) => value.has(subPattern));\n        }\n        return Object.keys(pattern).every((k) => k in value &&\n            matchPattern(\n            // @ts-ignore\n            pattern[k], \n            // @ts-ignore\n            value[k], select));\n    }\n    return value === pattern;\n};\nfunction isMatching(...args) {\n    if (args.length === 1) {\n        const [pattern] = args;\n        return (value) => matchPattern(pattern, value, () => { });\n    }\n    if (args.length === 2) {\n        const [pattern, value] = args;\n        return matchPattern(pattern, value, () => { });\n    }\n    throw new Error(`isMatching wasn't given enough arguments: expected 1 or 2, received ${args.length}.`);\n}\nexports.isMatching = isMatching;\n\n\n//# sourceURL=webpack:///../node_modules/ts-pattern/lib/index.js?");

/***/ }),

/***/ "../node_modules/ts-pattern/lib/symbols.js":
/*!*************************************************!*\
  !*** ../node_modules/ts-pattern/lib/symbols.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n/**\n * Symbols used internally within ts-pattern to construct and discriminate\n * Guard, Not, and Select, and AnonymousSelect patterns\n *\n * Symbols have the advantage of not appearing in auto-complete suggestions in\n * user defined patterns, and eliminate the admittedly unlikely risk of property\n * overlap between ts-pattern internals and user defined patterns.\n *\n * These symbols have to be visible to tsc for type inference to work, but\n * users should not import them\n * @module\n * @private\n * @internal\n */\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.AnonymousSelectKey = exports.Select = exports.Not = exports.Guard = exports.PatternKind = void 0;\n/** @internal This symbol should only be used by ts-pattern's internals. */\nexports.PatternKind = Symbol('@ts-pattern/pattern-kind');\n/** @internal This symbol should only be used by ts-pattern's internals. */\nexports.Guard = Symbol('@ts-pattern/guard');\n/** @internal This symbol should only be used by ts-pattern's internals. */\nexports.Not = Symbol('@ts-pattern/not');\n/** @internal This symbol should only be used by ts-pattern's internals. */\nexports.Select = Symbol('@ts-pattern/select');\nexports.AnonymousSelectKey = '@ts-pattern/__anonymous-select-key';\n\n\n//# sourceURL=webpack:///../node_modules/ts-pattern/lib/symbols.js?");

/***/ }),

/***/ "../node_modules/ts-pattern/lib/wildcards.js":
/*!***************************************************!*\
  !*** ../node_modules/ts-pattern/lib/wildcards.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.__ = void 0;\nconst guards_1 = __webpack_require__(/*! ./guards */ \"../node_modules/ts-pattern/lib/guards.js\");\nfunction isUnknown(x) {\n    return true;\n}\nfunction isNumber(x) {\n    return typeof x === 'number';\n}\nfunction numberIsNaN(x) {\n    return Number.isNaN(x);\n}\nfunction isString(x) {\n    return typeof x === 'string';\n}\nfunction isBoolean(x) {\n    return typeof x === 'boolean';\n}\nfunction isNullish(x) {\n    return x === null || x === undefined;\n}\nconst unknownGuard = (0, guards_1.when)(isUnknown);\nconst stringGuard = (0, guards_1.when)(isString);\nconst numberGuard = (0, guards_1.when)(isNumber);\nconst NaNGuard = (0, guards_1.when)(numberIsNaN);\nconst booleanGuard = (0, guards_1.when)(isBoolean);\nconst nullishGuard = (0, guards_1.when)(isNullish);\n/**\n * ### Catch All wildcard\n * `__` is wildcard pattern, matching **any value**.\n *\n * `__.string` is wildcard pattern matching any **string**.\n *\n * `__.number` is wildcard pattern matching any **number**.\n *\n * `__.NaN` is wildcard pattern matching **NaN**\n *\n * `__.boolean` is wildcard pattern matching any **boolean**.\n *\n * `__.nullish` is wildcard pattern matching **null** or **undefined**.\n * @example\n *  match(value)\n *   .with(__, () => 'will always match')\n *   .with(__.string, () => 'will match on strings only')\n *   .with(__.number, () => 'will match on numbers only')\n *   .with(__.NaN, () => 'will match on NaN')\n *   .with(__.boolean, () => 'will match on booleans only')\n *   .with(__.nullish, () => 'will match on null or undefined only')\n */\nexports.__ = Object.assign(unknownGuard, {\n    string: stringGuard,\n    number: numberGuard,\n    NaN: NaNGuard,\n    boolean: booleanGuard,\n    nullish: nullishGuard,\n});\n\n\n//# sourceURL=webpack:///../node_modules/ts-pattern/lib/wildcards.js?");

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./scripts/content-script.tsx");
/******/ 	
/******/ })()
;