import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { LoginButton, LogoutButton } from './auth'
import { User } from './user'

export default function Home() {
  redirect("/quote");
}
