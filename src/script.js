const NOTIFICATIONS_PER_PAGE = 5;
let currentNotifications = [];
let currentPage = 0;
let currentTab = "all";
document.addEventListener("DOMContentLoaded", function () {
  const openSidebarButton = document.getElementById("openSidebar");
  const closeSidebarButton = document.querySelector(".sidebar-close");
  const closeModalButton = document.querySelector(".add-notification-close");
  const openAddNotificationModal = document.getElementById("openAddModal");
  const modalOverlay = document.querySelector(".modal-overlay");
  const sidebar = document.querySelector(".sidebar");
  const addNotificationModal = document.querySelector(
    ".add-notification-modal"
  );

  openSidebarButton.addEventListener("click", function () {
    sidebar.classList.remove("hidden");
    modalOverlay.classList.remove("hidden"); // Show the overlay
    modalOverlay.classList.add("visible");
  });

  closeSidebarButton.addEventListener("click", function () {
    sidebar.classList.add("hidden");
    modalOverlay.classList.add("hidden"); // Hide the overlay
    modalOverlay.classList.remove("visible");
  });

  closeModalButton.addEventListener("click", function () {
    addNotificationModal.classList.add("hidden");
    modalOverlay.classList.add("hidden"); // Hide the overlay
    modalOverlay.classList.remove("visible"); // Ensure the overlay is not marked as visible
  });

  openAddNotificationModal.addEventListener("click", function () {
    addNotificationModal.classList.remove("hidden"); // Ensure this line is correctly removing the 'hidden' class
    modalOverlay.classList.remove("hidden"); // Show the overlay
    modalOverlay.classList.add("visible"); // Ensure the overlay is marked as visible
  });
  loadMoreNotifications();
});

document
  .getElementById("unread-tab")
  .addEventListener("click", filterNotifications);
document
  .getElementById("all-tab")
  .addEventListener("click", filterNotifications);

function filterNotifications(event) {
  const notifications = document.querySelectorAll(".notification-card");
  const tabId = event.target.id;

  notifications.forEach((notification) => {
    const isRead = notification.dataset.read === "true";
    if (tabId === "unread-tab" && isRead) {
      notification.style.display = "none";
    } else if (tabId === "all-tab") {
      notification.style.display = "block";
    } else {
      notification.style.display = "block";
    }
  });
}

function renderNotifications() {
  const notificationContainer = document.getElementById("notification-list");
  notificationContainer.innerHTML = "";

  currentNotifications.forEach((notification) => {
    const notificationCard = document.createElement("div");
    notificationCard.classList.add("notification-card");
    notificationCard.dataset.read = notification.read;

    const dateParts = notification.date.split(" ");
    const time = dateParts[1];
    const date = dateParts[0].split("/").slice(0, 2).join(".");
    const formattedDate = `${time} | ${date}`;

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
      // currentPage++;
    });
}
function updateNotificationsTab(newTab) {
  currentPage = 0;
  currentNotifications = [];
  currentTab = newTab;
}

// Add event listener for the "Show More" button
document.getElementById("show-more").addEventListener("click", () => {
  currentPage++;
  loadMoreNotifications();
});

// Update the currentTab variable when a tab is clicked
document.getElementById("unread-tab").addEventListener("click", () => {
  updateNotificationsTab("unread");
  loadMoreNotifications();
});
document.getElementById("all-tab").addEventListener("click", () => {
  updateNotificationsTab("all");
  loadMoreNotifications();
});

// Load initial notifications
