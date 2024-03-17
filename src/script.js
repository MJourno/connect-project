import { formatDate } from "./utils";
// Constants
const NOTIFICATIONS_PER_PAGE = 5;
const MAX_TYPED_CHARACTERS = 100;
// Global variables
let currentNotifications = [];
let currentPage = 0;
let currentTab = "all";
// UI visibility toggling functions
function toggleElementVisibility(element, show) {
  element.classList.toggle("hidden", !show);
  element.classList.toggle("visible", show);
}
function toggleModalVisibility(show) {
  const addNotificationModal = document.querySelector(
    ".add-notification-modal"
  );
  toggleElementVisibility(addNotificationModal, show);
}
function toggleOverlayVisibility(show) {
  const modalOverlay = document.querySelector(".modal-overlay");
  toggleElementVisibility(modalOverlay, show);
}
// Event listeners
document.addEventListener("DOMContentLoaded", setupEventListeners);
document.getElementById("show-more").addEventListener("click", () => {
  currentPage++;
  loadMoreNotifications();
});
document
  .getElementById("unread-tab")
  .addEventListener("click", () => updateAndLoadNotifications("unread"));
document
  .getElementById("all-tab")
  .addEventListener("click", () => updateAndLoadNotifications("all"));
document.getElementById("mark-all-read").addEventListener("click", () => {
  markAllNotificationsAsRead();
  updateAllNotificationsOnServer();
  window.unreadNotificationsCount = 0;
  updateNotificationCounter();
});

// Functions
function setupEventListeners() {
  const unreadNotificationsCount = window.unreadNotificationsCount;
  console.log(
    "Unread notifications count in client-side:",
    unreadNotificationsCount
  ); // Add this line
  // document.getElementById("notification-counter").textContent =
  //   unreadNotificationsCount;
  const notificationInput = document.getElementById("notification-input");
  const formCounter = document.getElementById("form-counter");
  const form = document.getElementById("add-notification-form");
  const submitButton = document.getElementById("add-notification-submit");

  const titleInput = form.querySelector('input[name="title"]');
  const contentInput = form.querySelector('textarea[name="content"]');
  const titleError = document.getElementById("title-error");
  const contentError = document.getElementById("content-error");

  const openSidebarButton = document.getElementById("openSidebar");
  const closeSidebarButton = document.querySelector(".sidebar-close");
  const closeModalButton = document.querySelector(".add-notification-close");
  const openAddNotificationModal = document.getElementById("openAddModal");
  const sidebar = document.querySelector(".sidebar");

  //add new notification
  notificationInput.addEventListener("input", function () {
    const maxLength = 100;
    if (notificationInput.value.length > maxLength) {
      notificationInput.value = notificationInput.value.slice(0, maxLength);
    }
    formCounter.textContent = `${notificationInput.value.length}/${maxLength}`;
  });

  function checkInputFields() {
    const titleEmpty = titleInput.value.trim() === "";
    const contentEmpty = contentInput.value.trim() === "";

    titleError.style.display = titleEmpty ? "block" : "none";
    contentError.style.display = contentEmpty ? "block" : "none";

    submitButton.disabled = titleEmpty || contentEmpty;
  }

  titleInput.addEventListener("input", checkInputFields);
  contentInput.addEventListener("input", checkInputFields);

  checkInputFields();

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    const title = titleInput.value;
    const content = contentInput.value;

    fetch("/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        toggleModalVisibility(false);
        toggleOverlayVisibility(false);
        currentNotifications.unshift(data);
        console.log("Notification added successfully");
        window.unreadNotificationsCount++;
        updateNotificationCounter();

        form.reset();
        formCounter.textContent = `0/${MAX_TYPED_CHARACTERS}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  console.log("before Opening sidebar", openSidebarButton);

  openSidebarButton.addEventListener("click", () => {
    console.log("Opening sidebar");
    sidebar.classList.remove("hidden");
    currentTab = "all";
    toggleOverlayVisibility(true);
    updateAndLoadNotifications("all");
    // fetchFirstFiveNotifications();
  });

  closeSidebarButton.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    toggleOverlayVisibility(false);
  });

  closeModalButton.addEventListener("click", () => {
    toggleModalVisibility(false);
    toggleOverlayVisibility(false);
  });

  openAddNotificationModal.addEventListener("click", () => {
    toggleModalVisibility(true);
    toggleOverlayVisibility(true);
  });

  loadMoreNotifications();
}
function updateNotificationCounter() {
  console.log("updating notification counter");
  // window.unreadNotificationsCount = currentNotifications.filter(
  //   (notification) => !notification.read
  // ).length;
  document.querySelector("#openSidebar .navbar-item-badge").textContent =
    window.unreadNotificationsCount;
}

function updateAndLoadNotifications(newTab) {
  console.log("selected new tab", newTab);

  const sidebarFooter = document.querySelector(".sidebar-footer");
  const tabs = document.querySelectorAll(".sidebar-tab");

  tabs.forEach((tab) => tab.classList.remove("selected"));

  // Add the 'selected' class to the currently selected tab
  const selectedTab = document.getElementById(newTab + "-tab");
  if (selectedTab) {
    selectedTab.classList.add("selected");
  }
  if (newTab === "unread") {
    sidebarFooter.classList.remove("hidden");
  } else {
    sidebarFooter.classList.add("hidden");
  }

  currentPage = 0;
  currentNotifications = [];
  currentTab = newTab;
  loadMoreNotifications();
}

function createNotificationCard(notification) {
  const notificationCard = document.createElement("div");
  notificationCard.classList.add("notification-card");
  notificationCard.dataset.read = notification.read;

  const formattedDate = formatDate(notification.date);
  const statusIcon = notification.read
    ? "fa-solid fa-circle"
    : "fa-solid fa-circle";
  const statusColor = notification.read ? "#959595" : "#0d7dff";

  notificationCard.innerHTML = `
    <div class="notification-title-container">
      <p>
        <button class="notification-status">
          <i class="${statusIcon}" style="color: ${statusColor};"></i>
        </button>
      </p>
      <h3 class="notification-title">${notification.title}</h3>
    </div>
    <p class="notification-content">${notification.content}</p>
    <p class="notification-date">${formattedDate}</p>
 `;

  const statusButton = notificationCard.querySelector(".notification-status");
  statusButton.addEventListener("click", () => {
    toggleNotificationReadStatus(notification, statusButton);
    updateNotificationCounter();
  });

  return notificationCard;
}

function toggleNotificationReadStatus(notification, statusButton) {
  // Toggle
  notification.read = !notification.read;
  // Update UI
  const newStatusIcon = notification.read
    ? "fa-solid fa-circle"
    : "fa-solid fa-circle";
  if (notification.read) {
    window.unreadNotificationsCount--;
  } else {
    window.unreadNotificationsCount++;
  }
  const newStatusColor = notification.read ? "#959595" : "#0d7dff";
  statusButton.innerHTML = `<i class="${newStatusIcon}" style="color: ${newStatusColor};"></i>`;

  updateNotificationOnServer(notification);
}

function updateNotificationOnServer(notification) {
  fetch("/update-notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: notification.id,
      read: notification.read,
    }),
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.error("Error updating notification:", error);
    });
}

function renderNotifications() {
  const notificationContainer = document.getElementById("notification-list");
  notificationContainer.innerHTML = "";

  // Check if there are any notifications to display
  if (currentNotifications.length === 0) {
    // Display a message indicating that there are no notifications
    notificationContainer.innerHTML = `
      <div class="sidebar-message">
        <i class="fa-regular fa-bell sidebar-message-bell" style="color: #292929;"></i>
        <h3 class="sidebar-message-title">לא נמצאו התראות</h3>
        <p class="sidebar-message-text">אין התראות חדשות במערכת</p>
      </div>
    `;
  } else {
    // Render the notifications as before
    currentNotifications.forEach((notification) => {
      const notificationCard = createNotificationCard(notification);
      notificationContainer.appendChild(notificationCard);
    });
  }
}
function loadMoreNotifications() {
  if (currentPage === 0) {
    currentNotifications = []; // Clear the current notifications array if it's the first fetch
  }
  fetch(
    `/api/notifications?page=${currentPage}&size=${NOTIFICATIONS_PER_PAGE}&tab=${currentTab}`
  )
    .then((response) => response.json())
    .then((notifications) => {
      currentNotifications = currentNotifications.concat(notifications);
      if (notifications.length < NOTIFICATIONS_PER_PAGE) {
        document.getElementById("show-more").style.display = "none";
      } else {
        document.getElementById("show-more").style.display = "block";
      }

      renderNotifications();
    });
}
function markAllNotificationsAsRead() {
  currentNotifications.forEach((notification) => {
    notification.read = true;
  });
  // Update the UI to reflect the changes
  renderNotifications();
}

function updateAllNotificationsOnServer() {
  fetch("/update-all-notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      read: true,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("All notifications updated:", data);
      renderNotifications();
    })
    .catch((error) => {
      console.error("Error updating all notifications:", error);
    });
}

// Data fetching functions
function fetchFirstFiveNotifications() {
  currentNotifications = [];
  fetch("/api/notifications?page=0&size=5&tab=all")
    .then((response) => response.json())
    .then((notifications) => {
      currentNotifications = notifications;
      renderNotifications();
    })
    .catch((error) => console.error("Error fetching notifications:", error));
}
// Initialization
let isInitialized = false; // Add this flag outside of the initialize function

// Initialization
function initialize() {
  if (!isInitialized) {
    // Check if it's already initialized
    fetchFirstFiveNotifications();
    console.log("App initialized!");
    // Set the default tab as selected
    const defaultTab = document.getElementById("all-tab");
    if (defaultTab) {
      defaultTab.classList.add("selected");
    }
    isInitialized = true; // Set the flag to true after initialization
  }
}

// Call the initialization function
initialize();
