import { getServerSession } from "next-auth";
import {options} from "@app/api/auth/[...nextauth]/options";
import prisma from '/lib/prisma';
import { register } from "@app/api/Registration/register/register";
import { User } from '@app/api/Registration/authenticate/authenticate'


export async function POST(req, res) {
  console.log("running")
  const data = await req.json()
  const { id, email, signedIn, ...childDetails } = data;
  const user = await User(req, res)
  if ( signedIn ) {
  if (user === "user not found") {
    // Handle the case where the user is not found
    return Response.error("user not found");
  }

  if (user === "unauthorized") {
    // Handle the case where the user is unauthorized
    return Response.error("unaothorized");
  } 
  }
  try {

    // Now, update parent associated with the user
    console.log('child id:', id)
    console.log("changes: ", childDetails)
    let student;

if (id) {
  // If `id` exists, it's an existing student, so update the record.
  student = await prisma.student.update({
    where: { id },
    data: childDetails,
  });
} else {
  // If `id` is not provided, it's a new student, so create a new record.
  student = await prisma.student.create({
    data: {
      ...childDetails,
      parent: {
        connect: { email }, // Connecting parent using the email
      },
    },
  });
}
    console.log(student)
    if (!student) {
      return Response.error() //json({ error: 'Parent not found for the associated user.' }, { status: 404 })
    }
    
    let application = await register(email, student.id);
    console.log(application)

    return  Response.json({...student, reg_id: application.id})
  } catch (error) {
    console.log(error)
    return  Response.error() //json({ error: 'internal server error' }, { status: 500 });
  }
  
}