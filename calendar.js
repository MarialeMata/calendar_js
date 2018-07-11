
document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    initializeForm();
  }
};

function initializeForm() {
  let showCalendarButton = document.querySelector("#showCalendarButton");
  document.addEventListener("click", (event) => {

    let startDate = document.querySelector("#startDate").value;
    let nofDays = document.querySelector("#nofDays").value;
    let countryCode = document.querySelector("#countryCode").value;

    if (event.target === showCalendarButton) {
      if (startDate === "" || nofDays === "" || countryCode === "") {
        alert("Please enter all required values.");
      } else if (nofDays < 1) {
        alert("Date can't be empty.")
      } else{
        console.log("Clicked!");
      }
    }

  });
}