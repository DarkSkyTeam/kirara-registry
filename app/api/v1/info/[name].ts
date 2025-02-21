import type { NextApiRequest, NextApiResponse } from "next"
import { getCachedPlugin, refreshCache } from "../../../../lib/cache"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query

  if (typeof name !== "string") {
    return res.status(400).json({ error: "Invalid plugin name" })
  }

  let plugin = await getCachedPlugin(name)

  if (!plugin) {
    try {
      await refreshCache(name)
      plugin = await getCachedPlugin(name)
      
      if (!plugin) {
        return res.status(404).json({ error: "Plugin not found" })
      }
    } catch (error) {
      console.error("Failed to get plugin info:", error)
      return res.status(404).json({ error: "Plugin not found" })
    }
  }

  res.status(200).json(plugin)
}

