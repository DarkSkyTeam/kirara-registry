import fs from "fs/promises"
import path from "path"
import { createHash } from "crypto"
import { type Plugin } from "./types"
const REGISTRY_DIR = path.join(process.cwd(), "registry")
const CACHE_DIR = path.join(process.cwd(), ".cache")

/**
 * 计算字符串的 sha1 哈希值
 */
function getSha1Hash(input: string): string {
  return createHash("sha1").update(input).digest("hex")
}

/**
 * 递归读取目录下的所有文件
 */
export async function readDirRecursively(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name)
      return dirent.isDirectory() ? readDirRecursively(res) : res
    }),
  )
  return Array.prototype.concat(...files)
}

/**
 * 读取 JSON 文件并解析为 Plugin 对象
 */
export async function readJsonFile(filePath: string): Promise<Plugin | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8")
    const plugin = JSON.parse(content) as Plugin
    if (!plugin.name || !plugin.description || !plugin.author || !plugin.pypiPackage) {
      console.warn(`Invalid plugin file: ${filePath}`)
      return null
    }
    return plugin
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return null
  }
}

/**
 * 读取所有插件
 */
export async function readPlugins(): Promise<Plugin[]> {
  const pluginFiles = await readDirRecursively(REGISTRY_DIR)
  const plugins: Plugin[] = []

  for (const file of pluginFiles) {
    if (file.endsWith(".json")) {
      const plugin = await readJsonFile(file)
      if (plugin) {
        plugins.push(plugin)
      }
    }
  }

  return plugins
}

/**
 * 将插件信息写入缓存
 */
export async function writeCache(plugin: Plugin): Promise<void> {
  const hash = getSha1Hash(plugin.name)
  const subDir = hash.slice(0, 2)
  const filePath = path.join(CACHE_DIR, subDir, `${hash}.json`)

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(plugin, null, 2))
}

/**
 * 从缓存中读取插件信息
 */
export async function readCache(name: string): Promise<Plugin | null> {
  const hash = getSha1Hash(name)
  const subDir = hash.slice(0, 2)
  const filePath = path.join(CACHE_DIR, subDir, `${hash}.json`)

  try {
    const content = await fs.readFile(filePath, "utf-8")
    return JSON.parse(content) as Plugin
  } catch (error) {
    return null
  }
}