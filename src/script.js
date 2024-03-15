import { formatDate } from "./utils";

const NOTIFICATIONS_PER_PAGE = 5;
const MAX_TYPED_CHARACTERS = 100;
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

        form.reset();
        formCounter.textContent = `0/${MAX_TYPED_CHARACTERS}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  function fetchFirstFiveNotifications() {
    fetch("/api/notifications?page=0&size=5&tab=all")
      .then((response) => response.json())
      .then((notifications) => {
        currentNotifications = notifications; // Update the current notifications array
        renderNotifications(); // Re-render the notifications list with the fetched notifications
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }

  openSidebarButton.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    toggleOverlayVisibility(true);
    fetchFirstFiveNotifications(); // Call the fetch function when opening the sidebar
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

function renderNotifications() {
  const notificationContainer = document.getElementById("notification-list");
  notificationContainer.innerHTML = "";

  currentNotifications.forEach((notification) => {
    const notificationCard = document.createElement("div");
    notificationCard.classList.add("notification-card");
    notificationCard.dataset.read = notification.read;
    const formattedDate = formatDate(notification.date);

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

let notificationsByTab = {
  all: [],
  unread: [],
};
function loadMoreNotifications() {
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
