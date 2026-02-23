function toggleDropdown(e) {
  e.preventDefault();
  const menu = e.target.nextElementSibling;
  menu.classList.toggle("show");
}

document.addEventListener("click", function(e) {
  const dropdown = document.querySelector(".dropdown");
  if (!dropdown) return;

  if (!dropdown.contains(e.target)) {
    const menu = dropdown.querySelector(".dropdown-menu");
    if (menu) menu.classList.remove("show");
  }
});
