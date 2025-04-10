"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Admin credentials - in a real app these would be stored securely in a database
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123',
};

// Set cookie expiration to 7 days
const COOKIE_EXPIRATION = 7 * 24 * 60 * 60; // 7 days in seconds

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Simulate a small delay to represent server processing
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    // In a real app, you would generate a secure token based on user credentials
    // and possibly store session information in a database
    const token = "admin-secure-token-" + Date.now();
    
    // Set the authentication cookie
    cookies().set({
      name: "adminAuthToken",
      value: token,
      httpOnly: true, // This prevents JavaScript from reading the cookie
      secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
      maxAge: COOKIE_EXPIRATION,
      path: "/", // Make cookie available across the site
    });
    
    // Redirect to admin dashboard
    redirect("/admin/dashboard");
  }
  
  // If we reach here, authentication failed
  return { error: "Invalid email or password" };
}

export async function logoutAdmin() {
  // Delete the authentication cookie
  cookies().delete("adminAuthToken");
  
  // Redirect to login page
  redirect("/admin/login");
}

export async function isAdminLoggedIn() {
  return !!cookies().get("adminAuthToken");
} 