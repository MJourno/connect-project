const express = require("express");
const fs = require("fs");
const path = require("path");
const { formatDate } = require("../src/utils");
const router = express.Router();
const NOTIFICATIONS_PER_PAGE = 10;
router.get("/", (req, res) => {
  const dataPath = path.join(__dirname, "..", "src", "data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || NOTIFICATIONS_PER_PAGE;
  const start = page * size;
  const end = start + size;
  const notifications = data.notifications.slice(start, end);
  notifications.forEach((notification) => {
    notification.date = formatDate(notification.date);
  });

  res.render("index", {
    notifications: notifications,
  });
});
// Add this to your mainRoutes.js
router.get("/notifications", (req, res) => {
  const dataPath = path.join(__dirname, "..", "src", "data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || NOTIFICATIONS_PER_PAGE;
  const tab = req.query.tab || "all"; // Default to 'all' tab
  const start = page * size;
  const end = start + size;

  // Filter notifications based on the current tab
  let notifications = data.notifications;
  if (tab === "unread") {
    notifications = notifications.filter((notification) => !notification.read);
  }

  // Slice the notifications array based on the page and size
  const slicedNotifications = notifications.slice(start, end);
  res.json(slicedNotifications); // Send the sliced array as a JSON response
});
// Route to add a new notification
router.post("/notifications", (req, res) => {
  const dataPath = path.join(__dirname, "..", "src", "data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const newNotification = {
    id: data.notifications.length + 1, // Assuming IDs are sequential
    ...req.body,
  };
  data.notifications.push(newNotification);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json(newNotification);
});

module.exports = router;
