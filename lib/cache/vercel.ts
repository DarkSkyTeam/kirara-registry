import { revalidateTag } from "next/cache"
import { Plugin } from "../types"
import { CacheBackend } from "./types"
import { readPlugins } from "../fileSystem"
import { fetchPyPIInfo } from "../pypi"

export class VercelDataCache implements CacheBackend {
    async get(name: string): Promise<Plugin | null> {
        const plugins = await readPlugins()
        const plugin = plugins.find(p => p.name === name)
        if (!plugin) return null

        try {
            const pypiInfo = await fetchPyPIInfo(plugin)
            return { ...plugin, pypiInfo }
        } catch (error) {
            console.error(`Error fetching PyPI info for ${name}:`, error)
            return plugin
        }
    }

    async set(name: string, plugin: Plugin): Promise<void> {
        // 在 Vercel Data Cache 中，我们不需要手动设置缓存
        // 缓存会通过 fetch 请求自动处理
        return
    }

    async getAll(): Promise<Plugin[]> {
        const plugins = await readPlugins()
        const pluginsWithPyPIInfo = await Promise.all(
            plugins.map(async (plugin: Plugin) => {
                try {
                    const pypiInfo = await fetchPyPIInfo(plugin)
                    return { ...plugin, pypiInfo }
                } catch (error) {
                    console.error(`Error fetching PyPI info for ${plugin.name}:`, error)
                    return plugin
                }
            })
        )
        return pluginsWithPyPIInfo
    }

    async revalidate(name?: string): Promise<void> {
        if (name) {
            await revalidateTag(`plugins:${name}`)
        } else {
            await revalidateTag("plugins")
        }
    }
} 