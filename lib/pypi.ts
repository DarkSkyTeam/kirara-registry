import { Plugin } from "./types"
interface PyPIInfo {
  version: string
  description: string
  author: string
  homePage: string
}

export async function fetchPyPIInfo(plugin: Plugin): Promise<PyPIInfo> {
  const response = await fetch(`https://pypi.org/pypi/${plugin.pypiPackage}/json`, {
    next: {
      revalidate: 60 * 60 * 24, // 24 hours
      tags: [`plugins:${plugin.name}`, 'plugins'],
    },
  })
  const data = await response.json()

  return {
    version: data.info.version,
    description: data.info.summary,
    author: data.info.author,
    homePage: data.info.home_page,
  }
}

