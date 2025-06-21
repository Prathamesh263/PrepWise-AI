"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    await setSessionCookie(idToken);
    
    return {
      success: true,
      message: "Successfully signed in."
    };
  } catch (error: any) {
    console.error("Error during sign in:", error);

    return {
      success: false,
      message: error.message || "Failed to log into account. Please try again.",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  try {
    const cookieStore = await cookies();
    
    // Verify the ID token first
    await auth.verifyIdToken(idToken);
    
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000,
    });
    
    // Verify the session cookie was created
    await auth.verifySessionCookie(sessionCookie);

    if(!sessionCookie){
      console.log('Session cookie is not created');
    }
    
    cookieStore.set('session', sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      // domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : 'localhost'
    });
  } catch (error) {
    console.error('Error setting session cookie:', error);
    throw error;
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}


// // ---------- 🔹 8. Get Interviews by User ----------
// export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
//   if (!userId) return null;

//   try {
//     const snapshot = await db
//       .collection("interviews")
//       .where("userId", "==", userId)
//       .orderBy("createdAt", "desc")
//       .get();

//     return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Interview[];
//   } catch (err) {
//     console.error("getInterviewsByUserId Error:", err);
//     return null;
//   }
// }

// // ---------- 🔹 9. Get Latest Interviews excluding current user ----------
// export async function getLatestInterview({ userId, limit = 20 }: { userId: string; limit?: number }): Promise<Interview[] | null> {
//   if (!userId) return null;

//   try {
//     const snapshot = await db
//       .collection("interviews")
//       .orderBy("createdAt", "desc")
//       .where("finalized", "==", true)
//       .where("userId", "!=", userId)
//       .limit(limit)
//       .get();

//     return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Interview[];
//   } catch (err) {
//     console.error("getLatestInterviews Error:", err);
//     return null;
//   }
// }
