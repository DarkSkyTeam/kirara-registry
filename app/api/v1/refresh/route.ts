import { NextRequest, NextResponse } from "next/server"
import { refreshCache } from "@/lib/cache"

const API_KEY = process.env.API_KEY

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "未提供认证信息" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]
  if (token !== API_KEY) {
    return NextResponse.json({ message: "无效的 API 密钥" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const pluginName = searchParams.get("name")

  try {
    await refreshCache(pluginName || undefined)
    return NextResponse.json({
      message: pluginName
        ? `${pluginName} 的缓存已刷新`
        : "所有缓存已刷新"
    })
  } catch (error) {
    console.error("Refresh cache error:", error)
    return NextResponse.json(
      { message: "刷新缓存时发生错误" },
      { status: 500 }
    )
  }
} 