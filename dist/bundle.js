/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);\n\nvar NOTIFICATIONS_PER_PAGE = 5;\nvar MAX_TYPED_CHARACTERS = 100;\nvar currentNotifications = [];\nvar currentPage = 0;\nvar currentTab = \"all\";\nfunction toggleElementVisibility(element, show) {\n  element.classList.toggle(\"hidden\", !show);\n  element.classList.toggle(\"visible\", show);\n}\nfunction toggleModalVisibility(show) {\n  var addNotificationModal = document.querySelector(\".add-notification-modal\");\n  toggleElementVisibility(addNotificationModal, show);\n}\nfunction toggleOverlayVisibility(show) {\n  var modalOverlay = document.querySelector(\".modal-overlay\");\n  toggleElementVisibility(modalOverlay, show);\n}\ndocument.getElementById(\"show-more\").addEventListener(\"click\", function () {\n  currentPage++;\n  loadMoreNotifications();\n});\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  var notificationInput = document.getElementById(\"notification-input\");\n  var formCounter = document.getElementById(\"form-counter\");\n  var form = document.getElementById(\"add-notification-form\");\n  var submitButton = document.getElementById(\"add-notification-submit\");\n  var titleInput = form.querySelector('input[name=\"title\"]');\n  var contentInput = form.querySelector('textarea[name=\"content\"]');\n  var titleError = document.getElementById(\"title-error\");\n  var contentError = document.getElementById(\"content-error\");\n  var openSidebarButton = document.getElementById(\"openSidebar\");\n  var closeSidebarButton = document.querySelector(\".sidebar-close\");\n  var closeModalButton = document.querySelector(\".add-notification-close\");\n  var openAddNotificationModal = document.getElementById(\"openAddModal\");\n  var sidebar = document.querySelector(\".sidebar\");\n  notificationInput.addEventListener(\"input\", function () {\n    var maxLength = 100;\n    if (notificationInput.value.length > maxLength) {\n      notificationInput.value = notificationInput.value.slice(0, maxLength);\n    }\n    formCounter.textContent = \"\".concat(notificationInput.value.length, \"/\").concat(maxLength);\n  });\n  function checkInputFields() {\n    var titleEmpty = titleInput.value.trim() === \"\";\n    var contentEmpty = contentInput.value.trim() === \"\";\n    titleError.style.display = titleEmpty ? \"block\" : \"none\";\n    contentError.style.display = contentEmpty ? \"block\" : \"none\";\n    submitButton.disabled = titleEmpty || contentEmpty;\n  }\n  titleInput.addEventListener(\"input\", checkInputFields);\n  contentInput.addEventListener(\"input\", checkInputFields);\n  checkInputFields();\n  submitButton.addEventListener(\"click\", function (event) {\n    event.preventDefault();\n    var title = titleInput.value;\n    var content = contentInput.value;\n    fetch(\"/notifications\", {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      body: JSON.stringify({\n        title: title,\n        content: content\n      })\n    }).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      console.log(\"Success:\", data);\n      toggleModalVisibility(false);\n      toggleOverlayVisibility(false);\n      form.reset();\n      formCounter.textContent = \"0/\".concat(MAX_TYPED_CHARACTERS);\n    })[\"catch\"](function (error) {\n      console.error(\"Error:\", error);\n    });\n  });\n  function fetchFirstFiveNotifications() {\n    fetch(\"/api/notifications?page=0&size=5&tab=all\").then(function (response) {\n      return response.json();\n    }).then(function (notifications) {\n      currentNotifications = notifications; // Update the current notifications array\n      renderNotifications(); // Re-render the notifications list with the fetched notifications\n    })[\"catch\"](function (error) {\n      return console.error(\"Error fetching notifications:\", error);\n    });\n  }\n  openSidebarButton.addEventListener(\"click\", function () {\n    sidebar.classList.remove(\"hidden\");\n    toggleOverlayVisibility(true);\n    fetchFirstFiveNotifications(); // Call the fetch function when opening the sidebar\n  });\n  closeSidebarButton.addEventListener(\"click\", function () {\n    sidebar.classList.add(\"hidden\");\n    toggleOverlayVisibility(false);\n  });\n  closeModalButton.addEventListener(\"click\", function () {\n    toggleModalVisibility(false);\n    toggleOverlayVisibility(false);\n  });\n  openAddNotificationModal.addEventListener(\"click\", function () {\n    toggleModalVisibility(true);\n    toggleOverlayVisibility(true);\n  });\n  loadMoreNotifications();\n});\ndocument.getElementById(\"unread-tab\").addEventListener(\"click\", function () {\n  return updateAndLoadNotifications(\"unread\");\n});\ndocument.getElementById(\"all-tab\").addEventListener(\"click\", function () {\n  return updateAndLoadNotifications(\"all\");\n});\nfunction updateAndLoadNotifications(newTab) {\n  currentPage = 0;\n  currentNotifications = [];\n  currentTab = newTab;\n  loadMoreNotifications();\n}\nfunction renderNotifications() {\n  var notificationContainer = document.getElementById(\"notification-list\");\n  notificationContainer.innerHTML = \"\";\n  currentNotifications.forEach(function (notification) {\n    var notificationCard = document.createElement(\"div\");\n    notificationCard.classList.add(\"notification-card\");\n    notificationCard.dataset.read = notification.read;\n    var formattedDate = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.formatDate)(notification.date);\n    notificationCard.innerHTML = \"\\n      <div class=\\\"notification-title-container\\\">\\n        <p>\".concat(notification.read ? \"Read\" : \"Unread\", \"</p>\\n        <h3 class=\\\"notification-title\\\">\").concat(notification.title, \"</h3>\\n      </div>\\n      <p class=\\\"notification-content\\\">\").concat(notification.content, \"</p>\\n      <p class=\\\"notification-date\\\">\").concat(formattedDate, \"</p>\\n    \");\n    notificationContainer.appendChild(notificationCard);\n  });\n}\nvar notificationsByTab = {\n  all: [],\n  unread: []\n};\nfunction loadMoreNotifications() {\n  fetch(\"/api/notifications?page=\".concat(currentPage, \"&size=\").concat(NOTIFICATIONS_PER_PAGE, \"&tab=\").concat(currentTab)).then(function (response) {\n    return response.json();\n  }).then(function (notifications) {\n    currentNotifications = currentNotifications.concat(notifications);\n    if (notifications.length < NOTIFICATIONS_PER_PAGE) {\n      document.getElementById(\"show-more\").style.display = \"none\";\n    } else {\n      document.getElementById(\"show-more\").style.display = \"block\";\n    }\n    renderNotifications();\n  });\n}\n\n//# sourceURL=webpack://connect-project/./src/script.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((module) => {

eval("function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\nfunction formatDate(dateString) {\n  var _dateString$split = dateString.split(\" \"),\n    _dateString$split2 = _slicedToArray(_dateString$split, 2),\n    datePart = _dateString$split2[0],\n    timePart = _dateString$split2[1];\n  var _datePart$split = datePart.split(\"/\"),\n    _datePart$split2 = _slicedToArray(_datePart$split, 3),\n    day = _datePart$split2[0],\n    month = _datePart$split2[1],\n    year = _datePart$split2[2];\n  var _timePart$split = timePart.split(\":\"),\n    _timePart$split2 = _slicedToArray(_timePart$split, 2),\n    hours = _timePart$split2[0],\n    minutes = _timePart$split2[1];\n  var date = new Date(year, month - 1, day, hours, minutes);\n  var hoursFormatted = date.getHours().toString().padStart(2, \"0\");\n  var minutesFormatted = date.getMinutes().toString().padStart(2, \"0\");\n  var dayFormatted = date.getDate().toString().padStart(2, \"0\");\n  var monthFormatted = (date.getMonth() + 1).toString().padStart(2, \"0\");\n  return \"\".concat(hoursFormatted, \":\").concat(minutesFormatted, \" | \").concat(dayFormatted, \".\").concat(monthFormatted);\n}\nmodule.exports = {\n  formatDate: formatDate\n};\n\n//# sourceURL=webpack://connect-project/./src/utils.js?");

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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/script.js");
/******/ 	
/******/ })()
;