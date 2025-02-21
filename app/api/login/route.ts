import { NextRequest, NextResponse } from "next/server"
import { setTimeout } from "timers/promises"

const API_KEY = process.env.API_KEY
const MAX_ATTEMPTS = 3
const LOCK_TIME = 10 * 60 * 1000 // 10 minutes in milliseconds

interface LoginAttempt {
  count: number
  lastAttempt: number
}

const loginAttempts = new Map<string, LoginAttempt>()

export async function POST(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const data = await request.json()
  const { apiKey } = data

  if (typeof ip !== "string") {
    return NextResponse.json({ message: "无效的 IP 地址" }, { status: 400 })
  }

  const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }

  // Check if the IP is locked
  if (attempt.count >= MAX_ATTEMPTS && Date.now() - attempt.lastAttempt < LOCK_TIME) {
    const remainingTime = Math.ceil((LOCK_TIME - (Date.now() - attempt.lastAttempt)) / 60000)
    return NextResponse.json(
      { message: `登录尝试次数过多，请在 ${remainingTime} 分钟后重试。` },
      { status: 429 }
    )
  }

  // Reset attempt count if lock time has passed
  if (Date.now() - attempt.lastAttempt >= LOCK_TIME) {
    attempt.count = 0
  }

  // Delay response by 5-10 seconds
  await setTimeout(Math.floor(Math.random() * 5000) + 5000)

  if (apiKey === API_KEY) {
    loginAttempts.delete(ip) // Reset attempts on successful login
    return NextResponse.json({ message: "登录成功" }, { status: 200 })
  } else {
    attempt.count += 1
    attempt.lastAttempt = Date.now()
    loginAttempts.set(ip, attempt)

    if (attempt.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { message: "登录尝试次数过多，请在 10 分钟后重试。" },
        { status: 429 }
      )
    } else {
      return NextResponse.json({ message: "无效的 API 密钥" }, { status: 401 })
    }
  }
} 