"use client"

import type React from "react"
import Link from "next/link"
import { useAuth } from "../lib/AuthContext"

export function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center text-gray-900 font-semibold">
                Kirara Agent Framework
              </Link>
            </div>
            <div className="flex items-center">
              <Link href="https://github.com/DarkSkyTeam/kirara-registry" className="text-gray-700 hover:text-gray-900 mr-4">
                提交插件
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/admin" className="text-gray-700 hover:text-gray-900 mr-4">
                    管理员
                  </Link>
                  <button onClick={logout} className="text-gray-700 hover:text-gray-900">
                    登出
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="text-center text-gray-500 text-sm">Powered by <Link href="https://github.com/lss233/chatgpt-mirai-qq-bot/" className="text-blue-500 hover:text-blue-700">Kirara Agent Framework</Link></div>
      </footer>
    </div>
  )
}

