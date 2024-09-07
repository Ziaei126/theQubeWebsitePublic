export function gradeCalculator(receptionYear) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January, 8 = September, etc.)
  
    // Determine the student's current school year
    let schoolYear = currentYear - receptionYear;
  
    // If before September (August included), subtract 1 year
    if (currentMonth < 8) {
      schoolYear -= 1;
    }

    return schoolYear
  
    
  }

export function gradeCalcString(grade) {

    // Return "Reception" if it's the first year
    if (grade === 0) {
        return "Reception";
      }
    
      return "Year " + grade;

}