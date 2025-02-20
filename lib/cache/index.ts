import { Plugin } from "../types"
import { createCacheBackend } from "./factory"

const cache = createCacheBackend()

const memoryCache = new Map<string, Plugin>()
/**
 * 构建缓存
 */
export async function buildCache(): Promise<void> {
    const plugins = await cache.getAll()
    for (const plugin of plugins) {
        memoryCache.set(plugin.name, plugin)
    }
    console.log(`Loaded ${memoryCache.size} plugins into memory cache.`)
}

/**
 * 获取缓存的插件信息
 */
export async function getCachedPlugin(name: string): Promise<Plugin | null> {
    return await cache.get(name)
}

/**
 * 刷新单个插件的缓存
 */
export async function refreshCache(name: string): Promise<void> {
    await cache.revalidate(name)
}

/**
 * 刷新所有插件的缓存
 */
export async function refreshAllCaches(): Promise<void> {
    await cache.revalidate()
}

/**
 * 搜索插件
 */
export async function searchPlugins(query: string, page: number, pageSize: number): Promise<{
    plugins: Plugin[]
    totalCount: number
    totalPages: number
    page: number
    pageSize: number
}> {
    const plugins = await cache.getAll()

    // 如果 query 为空，直接使用所有插件；否则进行过滤
    const filteredPlugins = query
        ? plugins.filter(
            (plugin: Plugin) =>
                plugin.name.toLowerCase().includes(query.toLowerCase()) ||
                plugin.description.toLowerCase().includes(query.toLowerCase()),
        )
        : plugins

    // 分页处理
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedPlugins = filteredPlugins.slice(startIndex, endIndex)

    return {
        plugins: paginatedPlugins,
        totalCount: filteredPlugins.length,
        totalPages: Math.ceil(filteredPlugins.length / pageSize),
        page,
        pageSize,
    }
} 