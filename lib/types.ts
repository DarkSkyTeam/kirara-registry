export interface PyPIInfo {
  version: string
  description: string
  author: string
  homePage: string
  bugTrackUrl: string
  documentUrl: string
}

export interface Plugin {
  name: string
  description: string
  author: string
  pypiPackage: string
  pypiInfo?: PyPIInfo // 可选字段
}