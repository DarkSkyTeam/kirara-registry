"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

import type { Plugin } from '@/lib/fileSystem'
import { InstallModal } from "./InstallModal"

interface PluginListProps {
  plugins: Plugin[]
  isAdmin?: boolean
  onRefreshCache?: (pluginName?: string) => void
  isLoading?: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between plugin-card animate-pulse">
      <div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <div className="h-9 bg-gray-200 rounded w-20"></div>
        <div className="h-9 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )
}

export function PluginList({ plugins, isAdmin = false, onRefreshCache, isLoading = false }: PluginListProps) {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)

  const showInstallModal = (plugin: Plugin) => {
    setSelectedPlugin(plugin)
    setIsInstallModalOpen(true)
  }

  const closeInstallModal = () => {
    setIsInstallModalOpen(false)
    setSelectedPlugin(null)
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <Button onClick={() => onRefreshCache?.()} className="mb-4">
          刷新所有缓存
        </Button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          plugins.map((plugin) => (
            <div key={plugin.name} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between plugin-card">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{plugin.name}</h2>
                <p className="text-gray-600">{plugin.description}</p>
                <p className="text-sm text-gray-500">作者: {plugin.author}</p>
                <p className="text-sm text-gray-500">PyPI 包名: {plugin.pypiPackage}</p>
                <p className="text-sm text-gray-500">最新版本: {plugin.pypiInfo?.version ?? 'Unknown'}</p>
              </div>
              <div className="flex justify-end mt-4">
                {plugin.pypiInfo?.homePage && (
                  <Button variant="outline" onClick={() => window.open(plugin.pypiInfo?.homePage, '_blank')} className="mr-2">
                    项目主页
                  </Button>
                )}
                <Button onClick={() => showInstallModal(plugin)} className="mr-2">安装</Button>
                {isAdmin && <Button onClick={() => onRefreshCache?.(plugin.name)}>刷新缓存</Button>}
              </div>
            </div>
          ))
        )}
      </div>
      {/* 安装 Modal */}
      {isInstallModalOpen && selectedPlugin && (
        <InstallModal plugin={selectedPlugin} onClose={closeInstallModal} />
      )}
    </div>
  )
}

