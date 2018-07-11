
document.onreadystatechange = () => {
  if (document.readyState === "complete") initializeForm();
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

  createCalendarView(calendarItems);

}

// Create the calendar view and its elements
function createCalendarView(calendarItems) {

  let calendarContainer = document.querySelector("#calendarContainer");
  calendarContainer.innerHTML = "";

  // Create table, style and append to container
  let calendarElement = document.createElement("table");
  calendarElement.setAttribute("class", "table mt-5");
  document.querySelector("#calendarContainer").appendChild(calendarElement);

  // Create head and body of table and append to table
  let tableHead = document.createElement("thead");
  let tableBody = document.createElement("tbody");
  calendarElement.appendChild(tableHead);
  calendarElement.appendChild(tableBody);

  // Create header row and cells with initials of the days of the week,
  // style and append to head
  let headerRow = document.createElement("tr");
  tableHead.appendChild(headerRow);
  headerRow.setAttribute("class", "table-light");
  let daysOfTheWeek = ["S", "M", "T", "W", "T", "F", "S"];
  for (let i = 0 ; i < daysOfTheWeek.length; i++) {
    let headerCell = document.createElement("th");
    headerRow.appendChild(headerCell);
    headerCell.innerText = daysOfTheWeek[i];
  }

  let beginning, ending, tableRow, dataCell, weekRowsNumber, rowCounter, 
    monthDaysCounter, firstDayOfMonth, weekRow, dayCell;

  // Loop through each item in the calendar array, 
  for (let i = 0; i < calendarItems.length; i++) {

    beginning = calendarItems[i].firstDayOfWeek;
    ending = calendarItems[i].lastDayInMonth;
    weekRowsNumber = calendarItems[i].weeksInMonth;
    rowCounter = 0;
    monthDaysCounter = 0;
    firstDayOfMonth = calendarItems[i].firstDayInMonth;

    // Create each header row for month and year and append to table
    tableRow = document.createElement("tr");
    tableBody.appendChild(tableRow);
    tableRow.setAttribute("class", "table-bordered table-info");
    dataCell = document.createElement("td");
    tableRow.appendChild(dataCell);
    dataCell.setAttribute("colspan", "7");
    dataCell.innerText = calendarItems[i].monthName + " " + calendarItems[i].year;

    for (j = 0; j < weekRowsNumber; j++) { // For each week

      // Create each week row containing cells corresponding to days
      weekRow = document.createElement("tr");
      tableBody.appendChild(weekRow);
      weekRow.setAttribute("class", "table-bordered");

      // Loop 7 times through each week row to create and append "day" cells
      for (k = 0; k < 7; k++) {
        dayCell = document.createElement("td");
        weekRow.appendChild(dayCell);
        dayCell.setAttribute("class", "bg-secondary");

        if (rowCounter >= beginning) {
          monthDaysCounter = firstDayOfMonth++;

          if (monthDaysCounter <= calendarItems[i].lastDayInMonth) {
            dayCell.innerText = monthDaysCounter;
            dayCell.setAttribute("class", "bg-success");
            day = moment([calendarItems[i].year,
              calendarItems[i].month - 1, monthDaysCounter]);
          }
          
        }
        rowCounter++;

      }
    }
    
    // Add empty row as separator between months
    let separatorRow = document.createElement("tr");
    tableBody.appendChild(separatorRow);
    let separatorCell = document.createElement("td");
    separatorRow.appendChild(separatorCell);
    separatorCell.setAttribute("colspan", "7");
  }

}

// Object constructor for each calendar item given the month and year
// startDate equals false if the month is not the first month in the range,
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