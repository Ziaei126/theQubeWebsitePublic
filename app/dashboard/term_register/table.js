'use client'

import React, { useState, } from 'react';
import { gradeCalculator, gradeCalcString } from '/lib/gradeCalculator';

export default function Table({registrations}) {
    const [students, setStudents] = useState(registrations)

    const handleAgeChange = (selectedValue) => {
        let minAge = 0;
        let maxAge = 9; // Default max
      
        switch (selectedValue) {
          case 'all':
            minAge = 0;
            maxAge = 9;
            break;
          case "Reception":
            minAge = 0;
            maxAge = 0;
            break;
          case "1-3":
            minAge = 1;
            maxAge = 3;
            break;
          case "4-6":
            minAge = 4;
            maxAge = 6;
            break;
          case "1-6":
            minAge = 1;
            maxAge = 6;
            break;
          case "7+":
            minAge = 7;
            maxAge = 9;
            break;
          default:
            minAge = parseInt(selectedValue);
            maxAge = parseInt(selectedValue);
            break;
        }
      
        // Update the students based on the new minAge and maxAge
        setStudents(registrations.filter(({ grade }) => grade >= minAge && grade <= maxAge));
      };

    //console.log('age: ', students[0].grade)

    return (
      <div className="p-6">

       {/* Combined Age Filter Dropdown */}
<div className="mb-4 flex justify-center space-x-4">
  <div>
    <label htmlFor="ageRange" className="mr-2">Select Age Range:</label>
    <select
      name="ageRange"
      id="ageRange"
      onChange={(e) => handleAgeChange(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="all">All</option>
      <option value="0">Reception</option>
      <option value="1-3">Year 1-3</option>
      <option value="4-6">Year 4-6</option>
      <option value="1-6">Year 1-6</option>
      <option value="7+">Year 7+</option>
      {/* Individual Age Options */}
      {[...Array(7)].map((_, i) => (
        <option key={i + 1} value={i + 1}>Year {i + 1}</option>
      ))}
    </select>
  </div>
</div>

        <div className="overflow-x-auto p-4">
  <table className="min-w-full bg-white table-auto">
    <thead>
      <tr>
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">#</th> {/* Replaced ID with index */}
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Child</th>
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Year</th>
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Islamic</th>
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Skill</th>
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Language</th>
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Sport</th>
      </tr>
    </thead>
    <tbody>
      {students.map(({ student, grade, courses }, index) => (
        <tr key={index}>
          {/* Displaying the index + 1 so it starts from 1 instead of 0 */}
          <td className="py-2 px-4 border-b border-gray-200 text-left">
            {index + 1}
          </td>
          <td className="py-2 px-4 border-b border-gray-200 text-left">
            {student.name} {student.lastName}
          </td>
          <td className="py-2 px-4 border-b border-gray-200 text-left">
            {gradeCalcString(grade)}
          </td>
          <td className="py-2 px-4 border-b border-gray-200 text-left">
            {courses.islamic || '-'}
          </td>
          <td className="py-2 px-4 border-b border-gray-200 text-left">
            {courses.skill || '-'}
          </td>
          <td className="py-2 px-4 border-b border-gray-200 text-left">
            {courses.language || '-'}
          </td>
          <td className="py-2 px-4 border-b border-gray-200 text-left">
            {courses.sport || '-'}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>
    );
}


// const studentsWithCourses = data.map(registration => ({
//     student: registration.student,
//     grade: gradeCalculator(registration.student.yearEnteredReception),  // Calculate the student's age
//     courses: {
//       islamic: registration.course_choice.Islamic1,
//       skill: registration.course_choice.Skill1,
//       language: registration.course_choice.language1,
//       sport: registration.course_choice.Sport1,
//     },
//     parent_name: registration.parent.name + " " + registration.parent.lastname
//   }));