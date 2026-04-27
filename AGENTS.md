# mockapi-local-plus-v2

本地 Mock API 配置管理平台，基于 Express 实现，底层使用 JSON 文件存储数据，提供中文 Web 界面进行配置。

## 启动

```bash
npm install
npm start
# 访问 http://localhost:9901/projects
```

## 页面概览

| 页面 | 路径 | 说明 |
|------|------|------|
| 项目列表 | `/projects` | 创建、删除项目 |
| 项目详情 | `/projects/:id` | 管理资源、设置 |
| 字段配置 | `/projects/:id/resources/:name/edit` | 配置字段及类型 |
| 数据编辑 | `/projects/:id/resources/:name/data` | 编辑JSON数据 |
| 接口文档 | `/projects/:id/resources/:name/docs` | 查看API文档 |

## API 测试

```bash
# 基础路径 /config/:projectId/:apiPrefix/:resource

# 1. GET 列表
curl -s http://localhost:9901/config/t6wiejykcvc0/api/v2/users

# 2. GET 详情
curl -s http://localhost:9901/config/t6wiejykcvc0/api/v2/users/1

# 3. POST 新增
curl -s -X POST http://localhost:9901/config/t6wiejykcvc0/api/v2/users \
  -H "Content-Type: application/json" \
  -d '{"name":"NewUser","age":25}'

# 4. PUT 整条更新
curl -s -X PUT http://localhost:9901/config/t6wiejykcvc0/api/v2/users/3 \
  -H "Content-Type: application/json" \
  -d '{"name":"UpdatedUser","age":30}'

# 5. PATCH 部分更新
curl -s -X PATCH http://localhost:9901/config/t6wiejykcvc0/api/v2/users/3 \
  -H "Content-Type: application/json" \
  -d '{"age":99}'

# 6. DELETE 删除
curl -s -X DELETE http://localhost:9901/config/t6wiejykcvc0/api/v2/users/3

# 7. ?q= 全文搜索
curl -s "http://localhost:9901/config/t6wiejykcvc0/api/v2/users?q=Test"

# 8. ?page=1&limit=1 分页
curl -s -D - "http://localhost:9901/config/t6wiejykcvc0/api/v2/users?page=1&limit=1" -o /dev/null

# 9. ?sortBy=age&order=desc 排序
curl -s "http://localhost:9901/config/t6wiejykcvc0/api/v2/users?sortBy=age&order=desc"

# 10. ?name=Test 精确过滤
curl -s "http://localhost:9901/config/t6wiejykcvc0/api/v2/users?name=Test"
```

## 技术栈

- **Express** - Web 框架
- **EJS** - 模板引擎（服务端渲染）
- **原生 JSON 文件存储** - 无数据库，每个项目一个目录
- **CodeMirror 5** - JSON 编辑器（CDN 引入）
- **CSS Variables** - 主题系统

## 项目结构

```
.
├── server.js          # 主服务入口，包含所有路由和业务逻辑
├── views/           # EJS 模板
│   ├── layout.ejs     # 布局模板
│   ├── projects.ejs   # 项目列表页
│   ├── project-detail.ejs  # 项目详情页
│   ├── resource-form.ejs    # 资源编辑表单
│   ├── resource-data.ejs    # 数据编辑页
│   └── resource-docs.ejs    # 接口文档页
├── public/
│   ├── style.css     # 统一样式
│   └── i18n.js      # 客户端多语言
└── data/projects/   # 数据存储目录
    └── {projectId}/
        ├── project.json    # 项目元信息
        ├── resources.json # 资源定义
        └── db.json         # 实际数据
```

## 主题系统

支持三套主题，通过 CSS Variables 实现：

| 主题 | 名称 | 强调色 |
|------|------|--------|
| Cyber Green |  Hacker绿 | `#00ff41` |
| Cyber Red |  Hacker红 | `#ff3333` |
| Light | 亮色 | `#008800` |

主题切换按钮位于右上角 (G/R/L)，保存在 localStorage。

## 多语言支持

### 服务端翻译 (server.js)

通过 `renderWithLocale` 函数和 `t()` 助手：

```javascript
function renderWithLocale(req, res, view, data) {
  const locale = getLocale(req);  // 从 cookie/query/header 检测
  const t = (key) => translations[locale][key] || key;
  res.render(view, { ...data, locale, t, currentLocale: locale });
}
```

### 客户端翻译 (i18n.js)

```javascript
const i18n = {
  zh: { key: "中文翻译" },
  en: { key: "English translation" }
};

function setLocale(locale) {
  localStorage.setItem('locale', locale);
  applyTranslations();
}
```

### 翻译 key 列表

| key | 中文 | 英文 |
|-----|------|------|
| brand_title | BOS配置中心 | BOS CONFIG CENTER |
| brand_sub | 本地配置中心 | Local Config Center |
| project_list | 项目列表 | Projects |
| new_project | 新建项目 | New Project |
| project_settings | 项目设置 | Settings |
| add_resource | 新增资源 | Add Resource |
| delete_project | 删除项目 | Delete Project |
| delete_confirm | 确认删除项目？ | Delete this project? |
| delete_confirm2 | 确定删除整个项目？此操作不可恢复！ | Are you sure? This cannot be undone! |
| field_config | 字段配置 | FIELD CONFIG |
| data_editor | 数据编辑 | DATA EDITOR |
| restful_api | RESTful 接口 | RESTful API |
| ... | ... | ... |

## 核心功能

### 1. 项目管理
- 创建项目（支持 API 前缀如 `api/v1`）
- 项目名称只读（不可修改）
- 删除项目需要二次确认 Modal

### 2. 资源管理
- 创建/编辑资源，配置字段
- 字段动态增删（ADD FIELD 按钮 / × 删除按钮）
- 字段类型：`id`, `string`, `number`, `boolean`, `object`, `array`
- ID字段为系统保留，第一行自动锁定，不可修改、删除
- 新字段自动添加到已有数据（空值）

### 3. 数据编辑
- 使用 CodeMirror 5（Material Dark 主题）
- AJAX 保存，验证失败弹窗提示
- 内置 JSON 格式化按钮
- 保存成功后跳转回项目页

### 4. 字段验证
- 保存时检查必填字段
- 检查多余字段
- 验证失败保留编辑器内容

### 4. API 端点
- 复制按钮（📋 图标）
- 支持多段 API 前缀（如 `api/v1`）

## 路由规则

### 管理界面
| 路径 | 说明 |
|------|------|
| `/projects` | 项目列表 |
| `/projects/:id` | 项目详情 |
| `/projects/:id/resources/new` | 新增资源 |
| `/projects/:id/resources/:name/edit` | 编辑资源 |
| `/projects/:id/resources/:name/data` | 编辑数据 |
| `/projects/:id/resources/:name/docs` | 接口文档 |

### Mock API (现使用 /config 路径)
```
GET    /config/:projectId/:apiPrefix/:resource           # 列表
GET    /config/:projectId/:apiPrefix/:resource/:id        # 详情
POST   /config/:projectId/:apiPrefix/:resource        # 新增
PUT    /config/:projectId/:apiPrefix/:resource/:id  # 整条更新
PATCH  /config/:projectId/:apiPrefix/:resource/:id  # 部分更新
DELETE /config/:projectId/:apiPrefix/:resource/:id  # 删除
GET    /config/:projectId/:apiPrefix/:parent/:parentId/:resource  # 嵌套资源
```

### 查询参数
- `?q=关键词` - 全文搜索（已 decodeURIComponent）
- `?page=1&limit=10` - 分页
- `?sortBy=id&order=desc` - 排序
- `?字段名=值` - 精确过滤

### 响应头
所有 API 响应自动添加：
```
Content-Type: application/json; charset=utf-8
X-Total-Count: (分页时返回)
```

## 关键函数 (server.js)

| 函数 | 用途 |
|------|------|
| `getLocale(req)` | 检测请求语言 |
| `renderWithLocale(req, res, view, data)` | 带翻译渲染 |
| `parseApiRouteFromParams(projectId, restPath, req)` | 解析 API 路由 |
| `updateResource(project, originalName, resourceMeta)` | 更新资源并同步数据 |
| `filterSortPage(records, query)` | 过滤、排序、分页 |
| `loadProject(projectId)` | 加载项目(含resources和db) |
| `saveProject(project)` | 保存项目到JSON文件 |
| `parseSchema(body)` | 解析字段配置 |
| `castByType(value, type)` | 类型转换 |
| `makeSample(fields)` | 生成示例数据 |
| `baseUrl(req, project)` | 生成API基础URL |
| `loadProjects()` | 加载所有项目列表 |
| `createProject(name, apiPrefix)` | 创建新项目 |
| `deleteProject(projectId)` | 删除项目 |
| `getResourceMeta(project, resourceName)` | 获取资源定义 |
| `removeResource(project, resourceName)` | 删除资源 |
| `nextId(records)` | 生成下一个ID |
| `castByType(value, type)` | 类型转换 |
| `parseRecordBody(body, fields, mode)` | 解析请求体 |
| `apiExamples(req, project, resource)` | 生成API示例 |

## 数据存储格式

**project.json**:
```json
{
  "id": "t6wiejykcvc0",
  "name": "项目名",
  "apiPrefix": "api/v1",
  "createdAt": "ISO时间",
  "updatedAt": "ISO时间"
}
```

**resources.json**:
```json
[
  {
    "name": "users",
    "label": "用户",
    "parentResource": "",
    "fields": [
      { "name": "id", "type": "id" },
      { "name": "name", "type": "string" },
      { "name": "age", "type": "number" }
    ]
  }
]
```

**db.json**:
```json
{
  "users": [
    { "id": "1", "name": "张三", "email": "a@b.com" }
  ]
}
```

## UI 组件

### Modal 对话框
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  min-width: 320px;
}
```

### Copy 按钮
- 使用 emoji 📋 图标
- 点击后显示 ✓ 反馈

### Dropdown 下拉框
- 使用 `.select-wrap` 包裹自定义样式
- `::after` 伪元素实现下拉箭头
- 字段类型下拉框与字段名保持统一字体样式

### 删除确认 Modal
- 标题 + 消息内容 + 取消/确认按钮
- 点击遮罩层可关闭
- 确认后执行回调函数

## 数据验证

保存数据时自动验证字段：
- 缺少必填字段 → 弹出错误提示
- 多余字段 → 弹出错误提示
- 无效 JSON → 弹出错误提示
验证失败不跳转页面，保留编辑器内容

## 页面布局

- 固定宽度：1000px（响应式小于1040px时自适应）
- 页面底部版权：© BOS Cloud
- 所有页面使用统一的 grid-2--wide 两栏布局

## 注意事项

1. 启动时如果 `data/projects/` 为空，会自动创建示例项目
2. 数据变更实时保存到 JSON 文件
3. API 前缀支持多段（如 `api/v1`），通过 `stripPrefix()` 处理
4. 字段类型自动转换：`boolean`、`number` 会进行类型转换
5. 嵌套资源自动根据父资源 ID 过滤
6. 项目名称不可修改（readonly）
7. 删除操作需要二次确认（Modal）
8. 删除字段需要确认，删除后对应数据字段也会被删除
9. ID字段为系统保留，第一行锁定不可删除

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
