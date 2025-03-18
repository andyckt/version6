import { redirect } from 'next/navigation';

export default function AccountPage() {
  // Redirect to the dynamic user profile page
  redirect('/account/travelenthusiast');
} 