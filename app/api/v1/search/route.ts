import { searchPlugins } from "@/lib/cache"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")

  try {
    const { plugins, totalPages } = await searchPlugins(query, page, pageSize)
    return NextResponse.json({ plugins, totalPages })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { message: "搜索时发生错误" },
      { status: 500 }
    )
  }
} 