
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

  // Set the country name from the country code (for the holidays plugin)
  moment.modifyHolidays.set(countryName);

  let calendarItems = [];

    // Declare variables to use in loop
  let currentMonth, currentYear, firstMonthOfYear, months, startDateCopy, 
    endDateCopy, singleMonth, calendarItem;

  // Loop through each year in the range to fill the array with calendar items
  for (let i = 0; i <= years; i++) {

    currentYear = startYear + i;
    firstMonthOfYear = 1;
    months = 12;

    if (i === 0) { // If on the first year
      firstMonthOfYear = startMonth;
      months = (years < 1) ? ((endMonth - startMonth) + 1) : (13 - startMonth);
    } else if (i === years) { // If on the last year
      months = endMonth;
    }

    for (let j = 0; j < months; j++) { // Loop through each month
      currentMonth = firstMonthOfYear + j;
      startDateCopy = (j === 0 && i === 0) ? startDate : false;
      endDateCopy = (j === months - 1 && i === years) ? endDate : false;
      singleMonth = (months <= 1) ? true : false;
      calendarItem = new CalendarItem(currentMonth, currentYear, 
        startDateCopy, endDateCopy, singleMonth);
      calendarItems.push(calendarItem);
    }

  }

  // createCalendarView(calendarItems);
  console.log(calendarItems);

}

// Create the calendar view and its elements
function createCalendarView(calendarItems) {

}

// Object constructor for each calendar item given the month and year
// startDate equals false if the month is not the first in the range,
// otherwise it's set to its value (same for endDate)
// singleMonth equals true if the range selected by the user spans only 1 month  
function CalendarItem(month, year, startDate, endDate, singleMonth) {

  this.month = month;
  this.year = year;
  this.monthName = moment(month, "MM").format("MMMM");
  this.firstDayOfWeek = Number(moment([year, month - 1]).format("d"));
  this.firstDayInMonth = 1;
  this.lastDayInMonth = moment([year, month - 1]).daysInMonth();
  this.weeksInMonth = getWeekNums(moment([year, month - 1]));

  let startDay = (startDate) ? Number(startDate.format("D")) : false;
  let endDay = (endDate) ? Number(endDate.format("D")) : false;

  if (startDate) {
    this.firstDayInMonth = startDay;
    this.firstDayOfWeek = Number(startDate.format("d"));

    if (!(singleMonth)) {
      let weeks = Math.floor((this.lastDayInMonth - startDay
        + this.firstDayOfWeek) / 7) + 1;
      this.weeksInMonth = weeks;
    }
  }

  if (endDate) {
    this.lastDayInMonth = endDay;
    let startingDay = (singleMonth) ? startDay : 1;
    let weeks = Math.floor(((endDay - startingDay)
      + this.firstDayOfWeek) / 7) + 1
    this.weeksInMonth = weeks;
  }

}

// Get the number of weeks in a month with moment.js library
function getWeekNums(month) {
  let monthCopy = moment(month), first, last;
  first = monthCopy.startOf("month").week();
  last = monthCopy.endOf("month").week();
  if (first > last) last = 52 + last;
  return last - first + 1;
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