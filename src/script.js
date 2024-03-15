import { formatDate } from "./utils";

const NOTIFICATIONS_PER_PAGE = 5;
let currentNotifications = [];
let currentPage = 0;
let currentTab = "all";

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
document.getElementById("show-more").addEventListener("click", () => {
  currentPage++;
  loadMoreNotifications();
});

document.addEventListener("DOMContentLoaded", function () {
  const openSidebarButton = document.getElementById("openSidebar");
  const closeSidebarButton = document.querySelector(".sidebar-close");
  const closeModalButton = document.querySelector(".add-notification-close");
  const openAddNotificationModal = document.getElementById("openAddModal");
  const sidebar = document.querySelector(".sidebar");

  openSidebarButton.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    toggleOverlayVisibility(true);
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
});

document
  .getElementById("unread-tab")
  .addEventListener("click", () => updateAndLoadNotifications("unread"));
document
  .getElementById("all-tab")
  .addEventListener("click", () => updateAndLoadNotifications("all"));

function updateAndLoadNotifications(newTab) {
  currentPage = 0;
  currentNotifications = [];
  currentTab = newTab;
  loadMoreNotifications();
}

function filterNotifications(event) {
  const notifications = document.querySelectorAll(".notification-card");
  const tabId = event.target.id;

  notifications.forEach((notification) => {
    const isRead = notification.dataset.read === "true";
    notification.style.display =
      tabId === "unread-tab" && isRead ? "none" : "block";
  });
}

function renderNotifications() {
  const notificationContainer = document.getElementById("notification-list");
  notificationContainer.innerHTML = "";

  currentNotifications.forEach((notification) => {
    const notificationCard = document.createElement("div");
    notificationCard.classList.add("notification-card");
    notificationCard.dataset.read = notification.read;
    const formattedDate = formatDate(notification.date);

    // const dateParts = notification.date.split(" ");
    // const time = dateParts[1];
    // const date = dateParts[0].split("/").slice(0, 2).join(".");
    // const formattedDate = `${time} | ${date}`;

    notificationCard.innerHTML = `
      <div class="notification-title-container">
        <p>${notification.read ? "Read" : "Unread"}</p>
        <h3 class="notification-title">${notification.title}</h3>
      </div>
      <p class="notification-content">${notification.content}</p>
      <p class="notification-date">${formattedDate}</p>
    `;
    notificationContainer.appendChild(notificationCard);
  });
}

function loadMoreNotifications() {
  fetch(
    `/api/notifications?page=${currentPage}&size=${NOTIFICATIONS_PER_PAGE}&tab=${currentTab}`
  )
    .then((response) => response.json())
    .then((notifications) => {
      currentNotifications = currentNotifications.concat(notifications);
      renderNotifications();
    });
}
