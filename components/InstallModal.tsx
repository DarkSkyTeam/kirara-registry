"use client"

import { useState } from "react"
import { Plugin } from "@/lib/fileSystem"
import { Button } from "@/components/ui/button"

interface InstallModalProps {
  plugin: Plugin
  onClose: () => void
}

export function InstallModal({ plugin, onClose }: InstallModalProps) {
  const [isCopied1, setIsCopied1] = useState(false)
  const [isCopied2, setIsCopied2] = useState(false)

  const handleCopyToClipboard = async (text: string, setIsCopied: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // 复制成功后显示2秒
    } catch (err) {
      console.error("Failed to copy text: ", err)
      setIsCopied(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-center items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">安装 {plugin.name}</h3>
          </div>
          <div className="px-7 py-3">
            <p className="text-sm text-gray-500 text-left">
              您可以通过以下两种方式安装此插件:
            </p>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 text-left">
                1. 通过 WebUI 插件管理安装:
              </p>
              <p className="text-sm text-gray-500 mt-1 text-left">
                在 WebUI 界面中，进入 "插件管理" 页面，点击 "安装插件"，然后输入以下插件名称进行安装:
              </p>
              <div className="mt-2 flex items-center justify-between bg-gray-100 rounded-md p-2">
                <code className="text-sm text-gray-900">{plugin.pypiPackage}</code>
                <Button
                  onClick={() => handleCopyToClipboard(plugin.pypiPackage, setIsCopied1)}
                  variant="outline"
                  size="sm"
                >
                  {isCopied1 ? "已复制" : "复制"}
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 text-left">
                2. 通过 pip 安装:
              </p>
              <p className="text-sm text-gray-500 mt-1 text-left">
                您也可以使用 pip 包管理器来安装此插件。请在命令行中执行以下命令:
              </p>
              <div className="mt-2 flex items-center justify-between bg-gray-100 rounded-md p-2">
                <code className="text-sm text-gray-900">pip install {plugin.pypiPackage}</code>
                <Button
                  onClick={() => handleCopyToClipboard(`pip install ${plugin.pypiPackage}`, setIsCopied2)}
                  variant="outline"
                  size="sm"
                >
                  {isCopied2 ? "已复制" : "复制"}
                </Button>
              </div>
            </div>
          </div>
          <div className="items-center px-4 py-3 flex justify-center">
            <Button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300">
              关闭
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 