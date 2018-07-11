
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
        createCalendarItems(startDate, nofDays, countryCode);
      }
    }

  });
}

// Create an array of CalendarItem objects for each month in the selected date
function createCalendarItems(startDate, nofDays, countryCode) {

  // Create moment.js objects from the selected range
  startDate = moment(startDate);
  let endDate = moment(startDate.clone().add(nofDays - 1, "days"));
  let startYear = Number(startDate.format("YYYY"));
  let endYear = Number(endDate.format("YYYY"));
  let startMonth = Number(startDate.format("M"));
  let endMonth = Number(endDate.format("M"));
  let years = endYear - startYear;
  countryName = getCountryName(countryCode.toUpperCase());

  // Set the country name from country code for the holidays plugin
  moment.modifyHolidays.set(countryName);

  console.log(startDate);
  console.log(endDate);
  console.log(startYear);
  console.log(endYear);
  console.log(startMonth);
  console.log(endMonth);
  console.log(years);
  console.log(countryName);
}

// List of countries supported by the moment.js holidays plugin
let countries = {
  "AR" : "Argentina",
  "CA" : "Canada",
  "HR" : "Croatia",
  "DK" : "Denmark",
  "FI" : "Finland",
  "DE" : "Germany",
  "IN" : "India",
  "US" : "United States"
};

// Returns the country name from a given code. If not in list, default is US.
function getCountryName(countryCode) {
    if (countries.hasOwnProperty(countryCode)) {
    return countries[countryCode];
  } else {
    return countries["US"];
  }
}