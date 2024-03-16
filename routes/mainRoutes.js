const express = require("express");
const fs = require("fs");
const path = require("path");
const { formatDate } = require("../src/utils");
const router = express.Router();
const NOTIFICATIONS_PER_PAGE = 5;

function sortNotificationsByDateDescending(a, b) {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA; // Sort in descending order
}

router.get("/", (req, res) => {
  const dataPath = path.join(__dirname, "..", "src", "data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || NOTIFICATIONS_PER_PAGE;
  const start = page * size;
  const end = start + size;

  // Correctly define and sort the notifications array before slicing
  const sortedNotifications = data.notifications.sort(
    sortNotificationsByDateDescending
  );
  const notifications = sortedNotifications.slice(start, end);

  // Format the dates of the notifications
  notifications.forEach((notification) => {
    notification.date = formatDate(notification.date);
  });

  res.render("index", { notifications });
});

router.get("/api/notifications", (req, res) => {
  const dataPath = path.join(__dirname, "..", "src", "data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || NOTIFICATIONS_PER_PAGE;
  const tab = req.query.tab || "all";
  const start = page * size;
  const end = start + size;

  let notifications = data.notifications;
  if (tab === "unread") {
    notifications = notifications.filter((notification) => !notification.read);
  }
  const sortedNotifications = notifications.sort(
    sortNotificationsByDateDescending
  );

  const slicedNotifications = sortedNotifications.slice(start, end);
  res.json(slicedNotifications);
});

router.post("/notifications", (req, res) => {
  console.log("Received POST request:", req.body);
  try {
    const dataPath = path.join(__dirname, "..", "src", "data.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based in JavaScript
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const dateString = `${day}/${month}/${year} ${hours}:${minutes}`;

    const newNotification = {
      id: data.notifications.length + 1,
      title: req.body.title,
      content: req.body.content,
      date: dateString,
      read: false,
    };
    data.notifications.push(newNotification);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json(newNotification);
  } catch (error) {
    console.error("Error processing POST request:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});
router.post("/update-notification", (req, res) => {
  const { id, read } = req.body;

  // Load the current notifications
  const dataPath = path.join(__dirname, "..", "src", "data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  // Find the notification by id and update its read status
  const notification = data.notifications.find((n) => n.id === id);
  if (notification) {
    notification.read = read;

    // Write the updated notifications back to the file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json({ message: "Notification updated successfully" });
  } else {
    res.status(404).json({ message: "Notification not found" });
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "Test route" });
});

module.exports = router;
