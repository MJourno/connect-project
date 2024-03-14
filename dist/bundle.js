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
/***/ (() => {

eval("var NOTIFICATIONS_PER_PAGE = 5;\nvar currentNotifications = [];\nvar currentPage = 0;\nvar currentTab = \"all\";\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  var openSidebarButton = document.getElementById(\"openSidebar\");\n  var closeSidebarButton = document.querySelector(\".sidebar-close\");\n  var sidebar = document.querySelector(\".sidebar\");\n  openSidebarButton.addEventListener(\"click\", function () {\n    sidebar.classList.remove(\"hidden\");\n  });\n  closeSidebarButton.addEventListener(\"click\", function () {\n    sidebar.classList.add(\"hidden\");\n  });\n  loadMoreNotifications();\n});\ndocument.getElementById(\"unread-tab\").addEventListener(\"click\", filterNotifications);\ndocument.getElementById(\"all-tab\").addEventListener(\"click\", filterNotifications);\nfunction filterNotifications(event) {\n  var notifications = document.querySelectorAll(\".notification-card\");\n  var tabId = event.target.id;\n  notifications.forEach(function (notification) {\n    var isRead = notification.dataset.read === \"true\";\n    if (tabId === \"unread-tab\" && isRead) {\n      notification.style.display = \"none\";\n    } else if (tabId === \"all-tab\") {\n      notification.style.display = \"block\";\n    } else {\n      notification.style.display = \"block\";\n    }\n  });\n}\nfunction renderNotifications() {\n  var notificationContainer = document.getElementById(\"notification-list\");\n  notificationContainer.innerHTML = \"\";\n  currentNotifications.forEach(function (notification) {\n    var notificationCard = document.createElement(\"div\");\n    notificationCard.classList.add(\"notification-card\");\n    notificationCard.dataset.read = notification.read;\n    var dateParts = notification.date.split(\" \");\n    var time = dateParts[1];\n    var date = dateParts[0].split(\"/\").slice(0, 2).join(\".\");\n    var formattedDate = \"\".concat(time, \" | \").concat(date);\n    notificationCard.innerHTML = \"\\n      <div class=\\\"notification-title-container\\\">\\n        <p>\".concat(notification.read ? \"Read\" : \"Unread\", \"</p>\\n        <h3 class=\\\"notification-title\\\">\").concat(notification.title, \"</h3>\\n      </div>\\n      <p class=\\\"notification-content\\\">\").concat(notification.content, \"</p>\\n      <p class=\\\"notification-date\\\">\").concat(formattedDate, \"</p>\\n    \");\n    notificationContainer.appendChild(notificationCard);\n  });\n}\nfunction loadMoreNotifications() {\n  fetch(\"/api/notifications?page=\".concat(currentPage, \"&size=\").concat(NOTIFICATIONS_PER_PAGE, \"&tab=\").concat(currentTab)).then(function (response) {\n    return response.json();\n  }).then(function (notifications) {\n    currentNotifications = currentNotifications.concat(notifications);\n    renderNotifications();\n    // currentPage++;\n  });\n}\nfunction updateNotificationsTab(newTab) {\n  currentPage = 0;\n  currentNotifications = [];\n  currentTab = newTab;\n}\n\n// Add event listener for the \"Show More\" button\ndocument.getElementById(\"show-more\").addEventListener(\"click\", function () {\n  currentPage++;\n  loadMoreNotifications();\n});\n\n// Update the currentTab variable when a tab is clicked\ndocument.getElementById(\"unread-tab\").addEventListener(\"click\", function () {\n  updateNotificationsTab(\"unread\");\n  loadMoreNotifications();\n});\ndocument.getElementById(\"all-tab\").addEventListener(\"click\", function () {\n  updateNotificationsTab(\"all\");\n  loadMoreNotifications();\n});\n\n// Load initial notifications\n\n//# sourceURL=webpack://connect-project/./src/script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/script.js"]();
/******/ 	
/******/ })()
;