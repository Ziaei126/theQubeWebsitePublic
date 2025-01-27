'use client'

import React, { useState } from 'react';
import { gradeCalculator, gradeCalcString } from '/lib/gradeCalculator';

export default function Table({ registrations }) {
  const [students, setStudents] = useState(registrations.sort((a, b) => {
  if (a.student.name.toLowerCase() < b.student.name.toLowerCase()) {
    return -1;
  }
  if (a.student.name.toLowerCase() > b.student.name.toLowerCase()) {
    return 1;
  }
  return 0;
}));
  const [selectedCourseGlobal, setSelectedCourse] = useState('all');
  const [minAgeGlobal, setMinAge] = useState(0);
  const [maxAgeGlobal, setMaxAge] = useState(9);

  const allCourses = [
    ...new Set([
      ...registrations.map(({ courses }) => courses.islamic).filter(Boolean),
      ...registrations.map(({ courses }) => courses.skill).filter(Boolean),
      ...registrations.map(({ courses }) => courses.language).filter(Boolean),
      ...registrations.map(({ courses }) => courses.sport).filter(Boolean),
    ]),
  ];

  const handleAgeChange = (selectedValue) => {
    let minAge = 0;
    let maxAge = 9;

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
    setMinAge(minAge)
    setMaxAge(maxAge)
    let selectedCourse = selectedCourseGlobal
    setStudents(
      registrations.filter(({ grade, courses }) => {
        const ageMatch = grade >= minAge && grade <= maxAge;
        const courseMatch = selectedCourse === 'all' ||
          courses.islamic === selectedCourse ||
          courses.skill === selectedCourse ||
          courses.language === selectedCourse ||
          courses.sport === selectedCourse;

        return ageMatch && courseMatch;
      }).sort((a, b) => {
  if (a.student.name.toLowerCase() < b.student.name.toLowerCase()) {
    return -1;
  }
  if (a.student.name.toLowerCase() > b.student.name.toLowerCase()) {
    return 1;
  }
  return 0;
})
    );
  };

  const handleCourseChange = (selectedCourse) => {
      let minAge = minAgeGlobal;
      let maxAge = maxAgeGlobal;
      setSelectedCourse(selectedCourse);
    setStudents(
      registrations.filter(({ grade, courses }) => {
        const ageMatch = grade >= minAge && grade <= maxAge;
        const courseMatch = selectedCourse === 'all' ||
          courses.islamic === selectedCourse ||
          courses.skill === selectedCourse ||
          courses.language === selectedCourse ||
          courses.sport === selectedCourse;

        return ageMatch && courseMatch;
      }).sort((a, b) => {
  if (a.student.name.toLowerCase() < b.student.name.toLowerCase()) {
    return -1;
  }
  if (a.student.name.toLowerCase() > b.student.name.toLowerCase()) {
    return 1;
  }
  return 0;
})
    );
  }


  return (
    <div className="">
      <div className="mb-4 flex justify-center md:space-x-4 flex-col md:flex-row space-y-2 md:space-y-0">
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
          </select>
        </div>
        <div>
          <label htmlFor="course" className="mr-2">Select Course:</label>
          <select
            id="course"
            onChange={(e) => handleCourseChange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            {allCourses.map((course, i) => (
              <option key={i} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

        <div className="overflow-x-auto pt-4">
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
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Internal Photo</th>
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">External Photo</th>
        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Medical Notes</th>
      </tr>
    </thead>
    <tbody>
      {students.map(({ student, grade, courses, internal_photo, external_photo, medical }, index) => (
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
          <td className="py-2 px-4 border-b border-gray-200 text-centre">
          {internal_photo ? <span className="text-green-500 text-xl">✓</span> : <span className="text-red-500 text-xl">✘</span>}
          </td>
          <td className="py-2 px-4 border-b border-gray-200 text-centre">
          {external_photo ? <span className="text-green-500 text-xl">✓</span> : <span className="text-red-500 text-xl">✘</span>}
          </td>
          <td className="py-2 px-4 border-b border-gray-200 text-centre">
          {medical}
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
