function formatDate(dateString) {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hours, minutes] = timePart.split(":");
  const date = new Date(year, month - 1, day, hours, minutes);
  const hoursFormatted = date.getHours().toString().padStart(2, "0");
  const minutesFormatted = date.getMinutes().toString().padStart(2, "0");
  const dayFormatted = date.getDate().toString().padStart(2, "0");
  const monthFormatted = (date.getMonth() + 1).toString().padStart(2, "0");

  return `${hoursFormatted}:${minutesFormatted} | ${dayFormatted}.${monthFormatted}`;
}

module.exports = { formatDate };
