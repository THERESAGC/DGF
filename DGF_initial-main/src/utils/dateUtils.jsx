const formatDate = (dateString) => {
  if (!dateString) return "No Date";  // If there's no date, return "No Date"
  
  const date = new Date(dateString);  // Convert the string to a Date object

  // Function to get the suffix for the day (st, nd, rd, th)
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Special case for 11th-20th
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  // Get the day with suffix (31st, 1st, etc.)
  const dayWithSuffix = date.getDate() + getDaySuffix(date.getDate());

  // Format the date as "31st Jan 2025"
  return `${dayWithSuffix} ${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
};

export default formatDate;
