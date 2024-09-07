import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';


const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),

  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),

  DOB: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),

  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),

  yearEnteredReception: Yup.mixed()
    .required('School year is required'),

  internalPhotoAllowed: Yup.boolean()
    .required('Required'),
  externalPhotoAllowed: Yup.boolean()
    .required('Required'),
  medicalNotes: Yup.string()
    .max(500, 'Medical notes must not exceed 500 characters'),
});



function ChildDetailsForm({ sucsessfulSubmit, yearGroupChosen, signedIn, email }) {
  const [childSelected, setChildSelected] = useState(false)
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initials, setInitials] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [YearSelected, setYearSelected] = useState(false);

  

  const handleChildSelect = (child) => {
    if (child) {
      // Existing child selected, set initial values with available child data
      setInitials({
        id: child.id || "",
        name: child.name || "",
        lastName: child.lastName || "",
        DOB: child.DOB ? formatDOB(child.DOB) : "", // Format DOB if available
        gender: child.gender || "",
        yearEnteredReception: child.yearEnteredReception ? currentSchoolYear(child.yearEnteredReception) : "",
        internalPhotoAllowed: child.internalPhotoAllowed || false, // Default to false if not provided
        externalPhotoAllowed: child.externalPhotoAllowed || false, // Default to false if not provided
        medicalNotes: child.medicalNotes || "",
      });
      
      setChildSelected(true);
      
    } else {
      // New child option selected, reset initial values
      setInitials({
        id: "",
        name: "",
        lastName: "",
        DOB: "",
        gender: "",
        yearEnteredReception: "",
        internalPhotoAllowed: false,
        externalPhotoAllowed: false,
        medicalNotes: "",
      });
      setChildSelected(true);
      
    }
  }

  const currentSchoolYear = (yearOfEntry) => {
    // Assuming yearOfEntry is a string representing the year, e.g., "2020"
    const yearOfEntryInt = parseInt(yearOfEntry);

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Calculate the difference in years
    const yearsSinceEntry = currentYear - yearOfEntryInt;

    // Check if the student is in reception

    // Otherwise, return the current school year as a string
    return yearsSinceEntry;

  }

  const calculateYearOfEntry = (currentSchoolYear) => {
    // Get the current year
    const currentYear = new Date().getFullYear();

    let yearOfEntryInt = currentYear - currentSchoolYear;

    return yearOfEntryInt;
  }

  const formatDOB = (dob) => {
    // Assuming dob is a Date object or a string in a recognizable date format
    const date = new Date(dob);

    // Format the date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const formatDateForPrisma = (dob) => {
    if (!dob) {
      return ""; // Return an empty string or some default value if dob is falsy
    }

    const date = new Date(dob);
    if (isNaN(date.getTime())) {
      return ""; // Return an empty string or handle invalid date
    }

    return date.toISOString();
  }

  // Function to determine which children fit the selected year group
  const filterChildrenByYearGroup = (child, year) => {
    const schoolYear = currentSchoolYear(child.yearEnteredReception);

    switch (year) {
      case 0:
        return schoolYear === 0;
      case 1:
        return schoolYear >= 1 && schoolYear <= 3;
        case 2:
          return schoolYear >= 4 && schoolYear <= 6;
      case 3:
        return schoolYear >= 7 && schoolYear <= 9;
      default:
        return false;
    }
  };



  useEffect(() => {
    async function fetchChildren() {
      setLoading(true);
      try {
        const response = await fetch('api/Registration/child/findChildren',
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email, signedIn})
          }
        );
        if (!response.ok) {
          console.log(response)
          throw new Error(`Network response was not ok`);
        }
        const data = await response.json();
        console.log("data: ", data)

        setChildren(data);


      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);



      }
    }

    fetchChildren();
    
  }, []);

  const handleSelection = (year) => {
    setSelectedYear(year);
    yearGroupChosen(year);
  
    // Use the passed year directly instead of relying on selectedYear
    const filteredChildren = children.filter((child) => filterChildrenByYearGroup(child, year));
    
    console.log("filtered children: ", filteredChildren);
    console.log("selected year: ", year); // Use year instead of selectedYear
    
    if (filteredChildren.length === 0) {
      handleChildSelect(false);
    }
    
    setYearSelected(true);
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (<>


    {YearSelected || (<div className="w-full max-w-md  p-6">
      <h2 className="text-center text-gray-700 font-medium text-lg mb-4">
        Please choose the school year of your child (for academic year 2024-25)
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSelection(0)}
          className={`py-4 rounded-md font-semibold text-white text-center  bg-red-500 hover:bg-red-600`}
        >
          Reception
        </button>
        <button
          onClick={() => handleSelection(1)}
          className={`py-4 rounded-md font-semibold text-white text-center  bg-red-500 hover:bg-red-600`}
        >
          Year 1-3
        </button>
        <button
          onClick={() => handleSelection(2)}
          className={`py-4 rounded-md font-semibold text-white text-center  bg-red-500 hover:bg-red-600`}
        >
          Year 4-6
        </button>
        <button
          onClick={() => handleSelection(3)}
          className={`py-4 rounded-md font-semibold text-white text-center  bg-red-500 hover:bg-red-600`}
        >
          Year 7-9
        </button>
      </div>
    </div>)}

    {YearSelected && (!childSelected ? (

<div className="flex flex-col justify-center items-center space-y-8 m-5 p-8 bg-white rounded-lg shadow-xl">
<h3 className="text-xl font-semibold text-gray-900 text-center">
  Select a child to auto-fill their details or add a new one:
</h3>

{/* Children Selection */}
<div className="flex flex-wrap justify-center gap-4">
  {children.filter(filterChildrenByYearGroup).map((child) => (
    <button
      key={child.id}
      onClick={() => handleChildSelect(child)}
      className="transition-all bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      {child.name}
    </button>
  ))}
</div>

{/* Add New Child Button */}
<button
  onClick={() => handleChildSelect(false)}
  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
  Add New Child
</button>
</div>
    ) :

      <Formik
        initialValues={initials}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formatedValues = {
            ...values,
            DOB: formatDateForPrisma(values.DOB),
            yearEnteredReception: calculateYearOfEntry(values.yearEnteredReception)
          };
            fetch(`/api/Registration/child/updatechild`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({...formatedValues, email, signedIn}),
            })
              .catch(error => {
                console.log('Error submitting form: ', error)
              })
              .then(response => response.json())
              .then(reg => {
                sucsessfulSubmit({
    
                  paid: false,
                  studentName: reg.name,
                  hasCourseChoice: null,
                  id: reg.reg_id,
                  yearGroup: currentSchoolYear(reg.yearEnteredReception),

                })
              })

          

        }}
      >
        <Form className="space-y-4 max-w-3xl mx-auto">
          <div className="text-lg font-semibold mb-6">Step 2: Child's Details</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-5 rounded-lg bg-white">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
              <Field name="name" type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name="name" component="div" className="text-red-600" />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
              <Field name="lastName" type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name="lastName" component="div" className="text-red-600" />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="DOB" className="block text-sm font-medium text-gray-700">Date of Birth *</label>
              <Field name="DOB" type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name="DOB" component="div" className="text-red-600" />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender *</label>
              <Field name="gender" as="select"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>

              </Field>
              <ErrorMessage name="gender" component="div" className="text-red-600" />
            </div>

            {/* School Year */}
            <div>
              <label htmlFor="schoolYear" className="block text-sm font-medium text-gray-700">School Year *</label>
              <Field name="yearEnteredReception" as="select"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select School Year</option>
                <option value={0}>Reception</option>
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </Field>
              <ErrorMessage name="yearEnteredReception" component="div" className="text-red-600" />
            </div>
            {/* Internal Photo Allowed */}
            <div>
              <label htmlFor="internalPhotoAllowed" className="block text-sm font-medium text-gray-700">
                Internal Photo Allowed
              </label>
              <Field name="internalPhotoAllowed" type="checkbox" />
              <ErrorMessage name="internalPhotoAllowed" component="div" className="text-red-600" />
            </div>

            {/* External Photo Allowed */}
            <div>
              <label htmlFor="externalPhotoAllowed" className="block text-sm font-medium text-gray-700">
                External Photo Allowed
              </label>
              <Field name="externalPhotoAllowed" type="checkbox" />
              <ErrorMessage name="externalPhotoAllowed" component="div" className="text-red-600" />
            </div>

            {/* Medical Notes */}
            <div>
              <label htmlFor="medicalNotes" className="block text-sm font-medium text-gray-700">
                Medical Notes
              </label>
              <Field name="medicalNotes" as="textarea"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <ErrorMessage name="medicalNotes" component="div" className="text-red-600" />
            </div>

          </div>


          <div className="flex justify-end mt-6">
            <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              confirm
            </button>
          </div>
        </Form>
      </Formik>
    )}




  </>)

}


export default ChildDetailsForm;