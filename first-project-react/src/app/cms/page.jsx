// app/page.jsx
import { redirect } from "next/navigation";

export default function HomePage() {
  // Langsung melempar user ke halaman cms books
  redirect("/cms/books");

  // Kode di bawah ini tidak akan pernah dieksekusi
  return null;
}
