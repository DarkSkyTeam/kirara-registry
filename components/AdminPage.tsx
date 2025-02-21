"use client"

import { useState, useEffect } from "react"
import { Layout } from "./Layout"
import { PluginList } from "./PluginList"
import { Pagination } from "./Pagination"
import { useAuth } from "../lib/AuthContext"
import { useRouter } from "next/navigation"
import { usePlugins } from "../hooks/usePlugins"
import { Alert } from "./Alert"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export default function AdminPage() {
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: "", message: "" })
  const showAlert = (title: string, message: string) => {
    setAlertInfo({ isOpen: true, title, message })
  }
  const { plugins, currentPage, totalPages, searchTerm, setSearchTerm, handleSearch, handlePageChange, refreshCache, isLoading } = usePlugins({ isAdmin: true, onAlert: showAlert })
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">管理员插件列表</h1>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索插件..."
            className="flex-grow"
          />
          <Button onClick={() => handleSearch(searchTerm, 1)}>搜索</Button>
        </div>
        <PluginList plugins={plugins} isAdmin={true} onRefreshCache={refreshCache} isLoading={isLoading} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      <Alert
        isOpen={alertInfo.isOpen}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => setAlertInfo({ ...alertInfo, isOpen: false })}
      />
    </Layout>
  )
}

