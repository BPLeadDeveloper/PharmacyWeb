import { redirect } from "next/navigation";

export default function LoginPage() {
  // Redirect legacy /login route to home (modal-based auth)
  redirect("/");
}