let currentDate = new Date();

function formatDate(date) {
  return date.toDateString();
}

function changeDay(offset) {
  currentDate.setDate(currentDate.getDate() + offset);
  generateTable();
}

function generateTable() {
  document.getElementById("currentDate").innerText = formatDate(currentDate);

  const bookingBody = document.getElementById("bookingBody");
  bookingBody.innerHTML = "";

  let startHour = 10;
  let endHour = 24;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min of [0, 30]) {
      let time = `${hour.toString().padStart(2, "0")}:${min === 0 ? "00" : "30"}`;

      let row = document.createElement("tr");

      let timeCell = document.createElement("td");
      timeCell.innerText = time;
      row.appendChild(timeCell);

      for (let court = 1; court <= 2; court++) {
        let cell = document.createElement("td");
        cell.classList.add("slot");
        cell.innerText = "Available";
        cell.onclick = () => selectSlot(cell, time, court);
        row.appendChild(cell);
      }

      bookingBody.appendChild(row);
    }
  }
}

let selectedSlots = [];

function selectSlot(cell, time, court) {

  if (cell.classList.contains("taken")) return;

  cell.classList.toggle("selected");

  if (cell.classList.contains("selected")) {
    selectedSlots.push({ time, court });
  } else {
    selectedSlots = selectedSlots.filter(
      s => !(s.time === time && s.court === court)
    );
  }

  if (selectedSlots.length === 2) {
    sendToWhatsApp();
  }

  if (selectedSlots.length === 1) {
    alert("Minimum booking is 1 hour (2 slots). Please select another slot.");
  }
}

function sendToWhatsApp() {

  let dateText = formatDate(currentDate);

  let message = `Hello Padelin! I'd like to reserve:\nDate: ${dateText}\nCourt: ${selectedSlots[0].court}\nTime: ${selectedSlots[0].time} - ${selectedSlots[1].time}`;

  let phone = "96171884882";

  let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

  selectedSlots = [];
}

generateTable();
