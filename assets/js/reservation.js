let currentDate = new Date();
let selectedSlots = [];

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTime(hour, min) {
  let period = hour >= 12 ? "PM" : "AM";
  let formattedHour = hour % 12 || 12;
  return `${formattedHour}:${min === 0 ? "00" : "30"} ${period}`;
}

function changeDay(offset) {
  let newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + offset);

  let today = new Date();
  let maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  if (newDate < today || newDate > maxDate) {
    alert("You can only book within 7 days.");
    return;
  }

  currentDate = newDate;
  generateTable();
}

function generateTable() {
  document.getElementById("currentDate").innerText = formatDate(currentDate);
  const bookingBody = document.getElementById("bookingBody");
  bookingBody.innerHTML = "";
  selectedSlots = [];
  document.getElementById("confirmBtn").disabled = true;

  for (let hour = 10; hour < 24; hour++) {
    for (let min of [0, 30]) {
      let row = document.createElement("tr");

      let timeCell = document.createElement("td");
      timeCell.innerText = formatTime(hour, min);
      row.appendChild(timeCell);

      for (let court = 1; court <= 2; court++) {
        let cell = document.createElement("td");
        cell.classList.add("slot");
        cell.dataset.time = `${hour}:${min}`;
        cell.dataset.court = court;
        cell.innerText = "Available";
        cell.onclick = () => toggleSlot(cell);
        row.appendChild(cell);
      }

      bookingBody.appendChild(row);
    }
  }
}

function toggleSlot(cell) {
  if (cell.classList.contains("taken")) return;

  let court = cell.dataset.court;

  if (selectedSlots.length > 0 && selectedSlots[0].dataset.court !== court) {
    alert("Please select slots from the same court.");
    return;
  }

  cell.classList.toggle("selected");

  if (cell.classList.contains("selected")) {
    selectedSlots.push(cell);
  } else {
    selectedSlots = selectedSlots.filter(s => s !== cell);
  }

  validateSelection();
}

function validateSelection() {
  if (selectedSlots.length < 2) {
    document.getElementById("confirmBtn").disabled = true;
    return;
  }

  let times = selectedSlots
    .map(s => s.dataset.time)
    .sort();

  let valid = true;

  for (let i = 1; i < times.length; i++) {
    let prev = times[i - 1].split(":");
    let curr = times[i].split(":");

    let prevMinutes = parseInt(prev[0]) * 60 + parseInt(prev[1]);
    let currMinutes = parseInt(curr[0]) * 60 + parseInt(curr[1]);

    if (currMinutes - prevMinutes !== 30) {
      valid = false;
      break;
    }
  }

  document.getElementById("confirmBtn").disabled = !valid;
}

function confirmBooking() {
  if (selectedSlots.length < 2) {
    alert("Minimum booking is 1 hour.");
    return;
  }

  let court = selectedSlots[0].dataset.court;
  let times = selectedSlots
    .map(s => s.parentElement.firstChild.innerText)
    .sort();

  let message = `Hello Padelin!\nI would like to reserve:\nDate: ${formatDate(currentDate)}\nCourt: ${court}\nTime: ${times[0]} - ${times[times.length - 1]}`;

  let phone = "96171884882";
  let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

  generateTable();
}

generateTable();
