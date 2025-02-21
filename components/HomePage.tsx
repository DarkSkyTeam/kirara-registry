"use client"

import { Layout } from "./Layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PluginList } from "./PluginList"
import { Pagination } from "./Pagination"
import { usePlugins } from "../hooks/usePlugins"
import { useState } from "react"

export default function HomePage() {
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, title: "", message: "" })
  const showAlert = (title: string, message: string) => {
    setAlertInfo({ isOpen: true, title, message })
  }

  const { plugins, currentPage, totalPages, searchTerm, setSearchTerm, handleSearch, handlePageChange, isLoading } = usePlugins({ onAlert: showAlert })

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">插件市场</h1>
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
        <PluginList plugins={plugins} isLoading={isLoading} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </Layout>
  )
}