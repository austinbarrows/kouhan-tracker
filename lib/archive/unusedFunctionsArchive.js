/* This file contains any unused functions, code, comments, etc. that aren't
currently in use and would simply make the code confusing to parse, but that
I want to save in case I decide to use their functionality in the future. */

/* 
    Original Source: addcalendaritemcard.js
    Description: Used to get min and max dates for a calendar based on a 
    current day to limit the calendar to a single year. 
    Provides the endpoints of a given year. */
function getMinDate(date) {
  const year = date.getFullYear();
  return new Date(year, 0, 1);
}

function getMaxDate(date) {
  const year = date.getFullYear();
  return new Date(year, 11, 31);
}
