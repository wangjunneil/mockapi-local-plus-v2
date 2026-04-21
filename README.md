# mockapi-local-plus-v2

本地轻量级 Mock API 配置管理平台，基于 Express 实现，使用 JSON 文件存储数据，提供中文 Web 界面进行项目与资源管理。

## 功能特性

- **项目管理**：创建、配置、删除项目，支持多段 API 前缀（如 `api/v1`）
- **资源管理**：动态配置字段名称与类型（`id` / `string` / `number` / `boolean` / `object` / `array`）
- **数据编辑**：内置 CodeMirror JSON 编辑器，支持格式化与实时验证
- **RESTful API**：完整的增删改查，支持分页、排序、全文搜索、字段过滤
- **嵌套资源**：支持父子资源关系自动过滤
- **主题切换**：Cyber Green / Cyber Red / Light 三套主题
- **多语言**：中文 / 英文界面切换

## 技术栈

- [Express](https://expressjs.com/) — Web 框架
- [EJS](https://ejs.co/) — 服务端模板引擎
- CodeMirror 5 — JSON 编辑器（CDN）
- CSS Variables — 主题系统
- 原生 JSON 文件存储 — 无需数据库

## 快速开始

要求：Node.js 18+

```bash
npm install
npm start
```

访问管理界面：

```
http://localhost:9901/projects
```

## 项目结构

```
.
├── server.js              # 主服务入口
├── views/                 # EJS 模板
│   ├── layout.ejs
│   ├── projects.ejs
│   ├── project-detail.ejs
│   ├── resource-form.ejs
│   ├── resource-data.ejs
│   └── resource-docs.ejs
├── public/
│   ├── style.css          # 统一样式与主题
│   └── i18n.js            # 客户端多语言
├── data/projects/         # 数据存储目录
│   └── {projectId}/
│       ├── project.json   # 项目元信息
│       ├── resources.json # 资源定义
│       └── db.json        # 实际数据
├── package.json
└── README.md
```

## 管理界面路由

| 页面 | 路径 |
|------|------|
| 项目列表 | `/projects` |
| 项目详情 | `/projects/:id` |
| 新增资源 | `/projects/:id/resources/new` |
| 编辑资源字段 | `/projects/:id/resources/:name/edit` |
| 编辑数据 | `/projects/:id/resources/:name/data` |
| 接口文档 | `/projects/:id/resources/:name/docs` |

## Mock API

基础路径：`/config/:projectId/:apiPrefix/:resource`

### 基础操作

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/config/:projectId/:apiPrefix/:resource` | 列表 |
| GET | `/config/:projectId/:apiPrefix/:resource/:id` | 详情 |
| POST | `/config/:projectId/:apiPrefix/:resource` | 新增 |
| PUT | `/config/:projectId/:apiPrefix/:resource/:id` | 整条更新 |
| PATCH | `/config/:projectId/:apiPrefix/:resource/:id` | 部分更新 |
| DELETE | `/config/:projectId/:apiPrefix/:resource/:id` | 删除 |

### 嵌套资源

```
GET  /config/:projectId/:apiPrefix/:parent/:parentId/:resource
POST /config/:projectId/:apiPrefix/:parent/:parentId/:resource
```

### 查询参数

| 参数 | 示例 | 说明 |
|------|------|------|
| `q` | `?q=关键词` | 全文搜索 |
| `page` + `limit` | `?page=1&limit=10` | 分页 |
| `sortBy` + `order` | `?sortBy=id&order=desc` | 排序 |
| 字段名 | `?name=Test` | 精确过滤 |

### 使用示例

```bash
# 获取列表
curl -s http://localhost:9901/config/t6wiejykcvc0/api/v2/users

# 获取详情
curl -s http://localhost:9901/config/t6wiejykcvc0/api/v2/users/1

# 新增
curl -s -X POST http://localhost:9901/config/t6wiejykcvc0/api/v2/users \
  -H "Content-Type: application/json" \
  -d '{"name":"NewUser","age":25}'

# 部分更新
curl -s -X PATCH http://localhost:9901/config/t6wiejykcvc0/api/v2/users/3 \
  -H "Content-Type: application/json" \
  -d '{"age":99}'

# 删除
curl -s -X DELETE http://localhost:9901/config/t6wiejykcvc0/api/v2/users/3
```

## 使用流程

1. 在 **项目列表** 页面新建项目，设置 API 前缀
2. 进入 **项目详情** 页面，点击「新增资源」
3. 在 **字段配置** 页面定义字段名称和类型（首行 `id` 字段自动锁定）
4. 在 **数据编辑** 页面手动维护 JSON 数据数组
5. 在 **接口文档** 页面查看请求地址与 `curl` 示例

## 注意事项

- 项目创建后，**名称不可修改**
- 删除项目/字段需要二次确认，且会同步删除对应数据
- 数据变更实时持久化到 JSON 文件
- 启动时若 `data/projects/` 为空，会自动创建示例项目
