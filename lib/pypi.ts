import { Plugin, PyPIInfo } from "./types"


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
    bugTrackerUrl: data.info.project_urls['Bug Tracker'],
    documentUrl: data.info.project_urls['Documentation'],
  }
}

