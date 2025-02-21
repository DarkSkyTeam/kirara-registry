import type { NextApiRequest, NextApiResponse } from "next"
import { refreshAllCaches } from "../../../lib/cache"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This should be protected with an API key or other authentication mechanism in production
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { authorization } = req.headers
  const API_KEY = process.env.API_KEY

  if (authorization !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    await refreshAllCaches()
    res.status(200).json({ message: "PyPI information refreshed successfully" })
  } catch (error) {
    console.error("Failed to refresh PyPI information:", error)
    res.status(500).json({ error: "Failed to refresh PyPI information" })
  }
}

