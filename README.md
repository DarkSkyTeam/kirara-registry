# Kirara Agent Framework Plugin Registry

这是 Kirara Agent Framework 的官方插件注册表系统。该系统负责维护社区生态提供的插件列表，并提供接口用于安装和查询插件信息。

## 功能特点

- 基于 Next.js 和 Vercel 的 Serverless 架构
- 插件信息自动同步 PyPI 包信息
- 支持插件搜索和分页浏览
- 提供 Web UI 和 API 接口
- 支持插件版本自动更新检测
- 基于 Vercel Data Cache 的高性能缓存系统

## 如何提交插件

1. Fork 本仓库
2. 在 `registry` 目录下创建一个新的 JSON 文件，文件名格式建议为 `{作者}/{插件名}.json`
3. JSON 文件格式如下：

```json
{
  "name": "插件名称",
  "description": "插件描述",
  "author": "作者名称",
  "pypiPackage": "pypi包名"
}
```

4. 提交 Pull Request
5. 等待审核通过
6. 审核通过后会自动部署到 Vercel，插件将出现在插件市场中

## API 接口文档

### 搜索插件

```
GET /api/v1/search
```

参数：
- `query`: 搜索关键词（可选）
- `page`: 页码，默认为 1
- `pageSize`: 每页数量，默认为 10

返回示例：
```json
{
  "plugins": [
    {
      "name": "插件名称",
      "description": "插件描述",
      "author": "作者名称",
      "pypiPackage": "pypi包名",
      "pypiInfo": {
        "version": "0.1.0",
        "description": "PyPI 描述",
        "author": "PyPI 作者",
        "homePage": "项目主页"
      }
    }
  ],
  "totalCount": 100,
  "totalPages": 10,
  "page": 1,
  "pageSize": 10
}
```

### 获取插件详情

```
GET /api/v1/info/{插件名称}
```

返回示例：
```json
{
  "name": "插件名称",
  "description": "插件描述",
  "author": "作者名称",
  "pypiPackage": "pypi包名",
  "pypiInfo": {
    "version": "0.1.0",
    "description": "PyPI 描述",
    "author": "PyPI 作者",
    "homePage": "项目主页"
  }
}
```

## 本地开发

1. 克隆仓库
```bash
git clone https://github.com/DarkSkyTeam/kirara-registry
cd plugin-registry
```

2. 安装依赖
```bash
npm install
```

3. 创建环境变量文件
```bash
cp .env.example .env.local
```

4. 修改 `.env.local` 文件，设置必要的环境变量：
```bash
# API Key for admin operations
API_KEY=your_api_key_here
```

5. 启动开发服务器
```bash
npm run dev
```

6. 访问 http://localhost:3000

## 部署

本项目推荐使用 Vercel 进行部署。在部署时需要注意以下几点：

1. 在 Vercel 项目设置中配置以下环境变量：
   - `API_KEY`: 管理员操作的 API 密钥

2. 点击下方按钮一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDarkSkyTeam%2Fkirara-registry)

## 技术栈

- Next.js - React 框架
- TypeScript - 类型安全的 JavaScript
- Tailwind CSS - 样式框架
- Vercel - 部署平台
- Vercel Data Cache - 内置缓存系统

## License

MIT License

## Credits

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

