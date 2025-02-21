"use client"

import AdminPage from "../../components/AdminPage"
import { Suspense } from "react"

export default function Admin() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPage />
    </Suspense>
  )
}

