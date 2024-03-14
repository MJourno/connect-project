const NOTIFICATIONS_PER_PAGE = 10;
document.addEventListener("DOMContentLoaded", function () {
  const openSidebarButton = document.getElementById("openSidebar");
  const closeSidebarButton = document.querySelector(".sidebar-close");
  const sidebar = document.querySelector(".sidebar");

  openSidebarButton.addEventListener("click", function () {
    sidebar.classList.remove("hidden");
  });

  closeSidebarButton.addEventListener("click", function () {
    sidebar.classList.add("hidden");
  });
  const allTab = document.getElementById("all-tab");
  const event = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  allTab.dispatchEvent(event);
});

document
  .getElementById("unread-tab")
  .addEventListener("click", filterNotifications);
document
  .getElementById("all-tab")
  .addEventListener("click", filterNotifications);

function filterNotifications(event) {
  console.log("Filtering notifications for tab:", event.target.id);

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

function renderNotifications(notifications) {
  const notificationContainer = document.getElementById("notification-list");
  notificationContainer.innerHTML = "";

  notifications.forEach((notification) => {
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

let currentPage = 0;
let currentTab = "all";

function loadMoreNotifications(tab) {
  fetch(
    `/notifications?page=${currentPage}&size=${NOTIFICATIONS_PER_PAGE}&tab=${tab}`
  )
    .then((response) => response.json())
    .then((notifications) => {
      renderNotifications(notifications);
      currentPage++;
    });
}

document.getElementById("unread-tab").addEventListener("click", () => {
  currentTab = "unread";
});
document.getElementById("all-tab").addEventListener("click", () => {
  currentTab = "all";
});
