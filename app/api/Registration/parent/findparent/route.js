import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { options } from "@app/api/auth/[...nextauth]/options";
import { prisma } from '/lib/prisma';


export async function GET(req, res) {
  console.log("running")
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const session = await getServerSession(req,
    {
      ...res,
      getHeader: (name) => res.headers?.get(name),
      setHeader: (name, value) => res.headers?.set(name, value),
    }, options)
  
  try {
  
  
  
  if (!session || !session.accessToken) {
    return Response.error("unaothorized")// json({ error: 'Unauthorised' }, { status: 401 }); res.status(401).send(response.text);
  }
  const accountId = session.accountId
  console.log(accountId)
    // Find the account using the access token
    const account = await prisma.account.findFirst({
      where: {
        providerAccountId: accountId,
      },
      include: {
        user: true, // Include the associated user
      },
    });
    
    if (!account || !account.user) {
      // Handle the case where the account or user is not found
      console.log("user not found")
      return Response.error()  // json({ error: 'User not found for the given access token.' }, { status: 404 }) 
    }
  
    // Now, find the parent associated with the user
    const parent = await prisma.parent.findUnique({
      where: {
        user_id: account.user.id, // Assuming the email field in Parent model is used to store user ID
      },
    });
    console.log(parent)
    if (!parent) {
      console.log("parent not found!!")
      return Response.json(false) //json({ error: 'Parent not found for the associated user.' }, { status: 404 })
    }

    token.parent_email = parent.email;
    console.log("token_parent----------------:", token.parent_email)
    return  Response.json(parent)
  } catch (error) {
    console.log(error)
    return  Response.error() //json({ error: 'internal server error' }, { status: 500 });
  }
  
}


