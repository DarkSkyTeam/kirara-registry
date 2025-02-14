"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

interface Plugin {
  name: string
  description: string
  author: string
  pypiPackage: string
}

interface UsePluginsResult {
  plugins: Plugin[]
  currentPage: number
  totalPages: number
  searchTerm: string
  setSearchTerm: (term: string) => void
  handleSearch: (term: string, page: number) => Promise<void>
  handlePageChange: (newPage: number) => void
  refreshCache: (pluginName?: string) => Promise<boolean>
}

interface UsePluginsOptions {
  initialSearchTerm?: string
  isAdmin?: boolean
  onAlert: (title: string, message: string) => void
}

export function usePlugins({ initialSearchTerm = "", isAdmin = false, onAlert }: UsePluginsOptions): UsePluginsResult {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const pageSize = 10

  const searchParams = useSearchParams()
  const query = searchParams?.get("query") ?? ""
  const pageFromURL = searchParams?.get("page") ?? "1"

  useEffect(() => {
    const initialPage = Number(pageFromURL)
    setCurrentPage(initialPage)
    setSearchTerm(query)
    handleSearch(query, initialPage)
  }, [query, pageFromURL])

  const handleSearch = async (term: string, page: number = 1) => {
    const endpoint = `/api/v1/search?query=${term}&page=${page}&pageSize=${pageSize}`
    const response = await fetch(endpoint)
    const data = await response.json()
    setPlugins(data.plugins)
    setTotalPages(data.totalPages)
    setCurrentPage(page)
  }

  const handlePageChange = (newPage: number) => {
    handleSearch(searchTerm, newPage)
  }

  const refreshCache = async (pluginName?: string): Promise<boolean> => {
    const apiKey = localStorage.getItem("apiKey")
    const url = pluginName ? `/api/v1/refresh?name=${pluginName}` : "/api/v1/refresh"

    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (response.ok) {
      onAlert(
        "缓存已刷新",
        pluginName ? `${pluginName} 的缓存已刷新` : "所有缓存已刷新"
      )
      await handleSearch(searchTerm, currentPage)
      return true
    } else {
      onAlert("刷新缓存失败", "无法刷新缓存，请检查 API 密钥和网络连接。")
      return false
    }
  }

  return {
    plugins,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    handleSearch,
    handlePageChange,
    refreshCache,
  }
} 