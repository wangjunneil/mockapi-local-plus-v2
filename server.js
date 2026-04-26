const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 9901;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const PROJECTS_DIR = path.join(DATA_DIR, "projects");

app.set("view engine", "ejs");
app.set("views", path.join(ROOT, "views"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser("secret"));
app.use("/public", express.static(path.join(ROOT, "public")));

function loadAuth() {
  return safeReadJson(path.join(DATA_DIR, "auth.json"), { users: {} });
}

function checkAuth(username, password) {
  const auth = loadAuth();
  return auth.users && auth.users[username] === password;
}

function requireAuth(req, res, next) {
  const sessionUser = req.cookies && req.cookies.session;
  if (sessionUser) {
    const auth = loadAuth();
    if (auth.users && auth.users[sessionUser]) {
      req.sessionUser = sessionUser;
      return next();
    }
  }
  res.redirect("/login");
}

function getUserDataDir(username) {
  return path.join(DATA_DIR, "projects", username);
}

function getLocale(req) {
  const cookieLocale = req.cookies && req.cookies.locale;
  const queryLocale = req.query.locale;
  const headerLocale = req.get('Accept-Language');
  if (queryLocale) return queryLocale;
  if (cookieLocale) return cookieLocale;
  if (headerLocale) {
    if (headerLocale.startsWith('zh')) return 'zh';
    if (headerLocale.startsWith('en')) return 'en';
  }
  return 'zh';
}

function renderWithLocale(req, res, view, data) {
  const locale = getLocale(req);
  const t = (key) => {
    const translations = {
      zh: { projects: "项目", resources: "资源", project_list: "项目列表", project_desc: "每个项目都有独立的 API 地址、资源配置和数据。", new_project: "新建项目", create_project: "创建项目", project_name: "项目名称", api_prefix: "API 前缀", api_prefix_hint: "支持多段前缀，例如 api/v1最终地址会是 /config/项目ID/api/v1/资源名。", prefix: "前缀", updated: "更新��", res: "资源", add_resource: "新增资源", project_settings: "项目设置", save: "保存", delete_project: "删除项目", api_base: "API 基础地址", manage_resources: "管理资源、字段和数据。所有更改立即生效。", rows: "条", parent: "父资源", fields: "字段", data: "数据", fields_btn: "字段", api: "接口", delete: "删除", no_resources: "暂无资源，点击上方按钮新增。", new_resource: "新增资源", edit_resource: "编辑资源", resource_name: "资源名称", label: "中文名称", parent_resource: "父资源", none: "无", parent_hint: "设置父资源后，可用嵌套接口，例如 /users/1/tasks。", field_config: "字段配置", field_name: "字段名", field_type: "类型", add_field: "添加字段", auto_id: "系统会自动保留 id 字段。", create: "创建", back: "返回", format: "格式化", data_editor: "数据编辑", data_hint: "直接编辑 JSON 数组，保存后立即生效。", save_data: "保存数据", docs: "接口文档", sample: "示例", sample_hint: "根据字段配置生成的最小示例。", endpoint: "接口地址", restful_api: "RESTful 接口", method: "方法", endpoint_col: "地址", desc: "说明", list: "列表", detail: "详情", create_new: "新增", update_full: "整条更新", patch: "部分更新", delete_record: "删除", examples: "请求示例", list_example: "列表", create_example: "新增", patch_example: "部分更新", query: "查询参数", search: "全文搜索", page: "分页", sort: "排序", filter: "精确过滤", nested: "嵌套资源", not_set: "未设置", name_field: "名称", api_prefix_field: "API 前缀", save_button: "保存", save_success: "数据保存成功", ok: "确定", delete_confirm: "确认删除项目？", resource_data: "数据", resource_fields: "字段", resource_api: "接口", delete_resource_confirm: "确认删除资源？", delete_field_confirm: "确认删除字段「{field}」？", delete_field_title: "确认删除字段", edit: "编辑", api_docs: "接口说明", api_list: "列表", api_detail: "详情", api_create: "新增", api_update: "整条更新", api_patch: "部分更新", api_delete: "删除", api_examples: "示例", api_query: "查询", api_nested: "嵌套", brand_title: "BOS配置中心", brand_sub: "本地配置中心", copyright: "© BOS Cloud", delete_confirm2: "确定删除整个项目？此操作不可恢复！", kvs: "KV配置", kv_list: "KV列表", add_kv: "新增KV", no_kvs: "暂无KV，点击上方按钮新增。", new_kv: "新增KV", edit_kv: "编辑KV", kv_name: "Key名称", kv_desc: "描述", key_field: "Key", value_field: "值", kv_data: "编辑值", kv_fields: "字段", kv_value: "值", kv_delete_confirm: "确认删除KV？", kv_value_editor: "值编辑", kv_value_hint: "编辑KV的值，保存后立即生效。", kvs: "K&V", kv_list: "KV列表", add_kv: "新增 K&V", no_kvs: "暂无K&V，点击上方按钮新增。", new_kv: "新增 K&V", edit_kv: "编辑 K&V", kv_name: "KEY", kv_desc: "描述", key_field: "KEY", value_field: "值", kv_data: "编辑值", kv_fields: "字段", kv_value: "值", kv_delete_confirm: "确认删除K&V？", login_title: "登录", username: "用户名", password: "密码", login: "登录", logout: "登出", username_placeholder: "用户名", password_placeholder: "密码" },
      en: { projects: "Projects", resources: "Resources", project_list: "Projects", project_desc: "Each project has independent API endpoint and resources.", new_project: "New Project", create_project: "Create Project", project_name: "Name", api_prefix: "API Prefix", api_prefix_hint: "Support multi-segment prefix. Final path: /config/:id/:prefix/:resource", prefix: "PREFIX", updated: "UPDATED", res: "RES", add_resource: "Add Resource", project_settings: "Settings", save: "Save", delete_project: "Delete Project", api_base: "API Base", manage_resources: "Manage resources, fields and data. All changes take effect immediately.", rows: "ROWS", parent: "PARENT", fields: "FIELDS", data: "DATA", fields_btn: "FIELDS", api: "API", delete: "DEL", no_resources: "No resources yet. Click ADD RESOURCE to create one.", new_resource: "NEW RESOURCE", edit_resource: "EDIT RESOURCE", resource_name: "Resource Name", label: "Label", parent_resource: "Parent Resource", none: "None", parent_hint: "Set parent for nested API: /users/1/tasks", field_config: "FIELD CONFIG", field_name: "Name", field_type: "Type", add_field: "ADD FIELD", auto_id: "System auto-adds id field.", create: "CREATE", back: "BACK", format: "FORMAT", data_editor: "DATA EDITOR", data_hint: "Edit JSON array directly. Changes take effect immediately.", save_data: "SAVE", docs: "DOCS", sample: "SAMPLE", sample_hint: "Generated from field config.", endpoint: "ENDPOINT", restful_api: "RESTful API", method: "Method", endpoint_col: "Endpoint", desc: "Desc", list: "List", detail: "Detail", create_new: "Create", update_full: "Update", patch: "Patch", delete_record: "Delete", examples: "EXAMPLES", list_example: "List", create_example: "Create", patch_example: "Patch", query: "QUERY", search: "Search", page: "Page", sort: "Sort", filter: "Filter", nested: "NESTED", not_set: "Not set", name_field: "Name", api_prefix_field: "API Prefix", save_button: "Save", save_success: "Data saved successfully", ok: "OK", delete_confirm: "Delete this project?", kvs: "KV Config", kv_list: "KV List", add_kv: "Add KV", no_kvs: "No KV yet. Click ADD KV to create one.", new_kv: "NEW KV", edit_kv: "EDIT KV", kv_name: "Key Name", kv_desc: "Description", key_field: "Key", value_field: "Value", kv_data: "Edit Value", kv_fields: "Fields", kv_value: "Value", kv_delete_confirm: "Delete this KV?", kvs: "K&V", kv_list: "KV List", add_kv: "Add K&V", no_kvs: "No K&V yet. Click ADD K&V to create one.", new_kv: "ADD K&V", edit_kv: "EDIT K&V", kv_name: "KEY", kv_desc: "Description", key_field: "KEY", value_field: "Value", kv_data: "Edit Value", kv_fields: "Fields", kv_value: "Value", kv_value_editor: "VALUE EDITOR", kv_value_hint: "Edit KV value. Changes take effect immediately.", resource_data: "DATA", resource_fields: "FIELDS", resource_api: "API", delete_resource_confirm: "Delete this resource?", delete_field_confirm: "Delete field \"{field}\"?", delete_field_title: "Confirm Delete Field", edit: "EDIT", api_docs: "API Docs", api_list: "List", api_detail: "Detail", api_create: "Create", api_update: "Update", api_patch: "Patch", api_delete: "Delete", api_examples: "Examples", api_query: "Query", api_nested: "Nested" }
    };
    return translations[locale]?.[key] || key;
  };
  res.render(view, { ...data, locale, t, currentLocale: locale });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir(DATA_DIR);
ensureDir(PROJECTS_DIR);

function nowIso() {
  return new Date().toISOString();
}

function safeReadJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

function userProjectDir(user, projectId) {
  return path.join(DATA_DIR, "projects", user, projectId);
}
function userProjectsDir(user) {
  return path.join(DATA_DIR, "projects", user);
}
function projectMetaFile(projectId, user) {
  return path.join(userProjectDir(user, projectId), "project.json");
}
function projectDbFile(projectId, user) {
  return path.join(userProjectDir(user, projectId), "db.json");
}
function projectResourcesFile(projectId, user) {
  return path.join(userProjectDir(user, projectId), "resources.json");
}

function uid() {
  return Math.random().toString(36).slice(2, 14);
}

function sanitizePrefix(prefix = "") {
  return String(prefix).trim().replace(/^\/+|\/+$/g, "");
}
function normalizeResourceName(name = "") {
  return String(name).trim().replace(/\s+/g, "_");
}

function loadProject(projectId, user) {
  if (!user) return null;
  const userDir = userProjectsDir(user);
  if (!fs.existsSync(userDir)) return null;
  const meta = safeReadJson(path.join(userDir, projectId, "project.json"), null);
  if (!meta) return null;
  return {
    ...meta,
    resources: safeReadJson(path.join(userDir, projectId, "resources.json"), []),
    db: safeReadJson(path.join(userDir, projectId, "db.json"), {}),
    kvs: safeReadJson(path.join(userDir, projectId, "kvs.json"), [])
  };
}
function saveProject(project, user) {
  const dir = userProjectDir(user, project.id);
  ensureDir(dir);
  const { resources, db, kvs, ...meta } = project;
  writeJson(path.join(dir, "project.json"), { ...meta, user });
  writeJson(path.join(dir, "resources.json"), resources || []);
  writeJson(path.join(dir, "db.json"), db || {});
  writeJson(path.join(dir, "kvs.json"), kvs || []);
}
function loadProjects(user) {
  if (!user) return [];
  ensureDir(userProjectsDir(user));
  const userDir = userProjectsDir(user);
  if (!fs.existsSync(userDir)) return [];
  const ids = fs.readdirSync(userDir).filter(name => {
    try { return fs.statSync(path.join(userDir, name)).isDirectory(); }
    catch { return false; }
  });
  return ids.map(id => loadProject(id, user)).filter(Boolean).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
function createProject(user, name, apiPrefix) {
  const project = {
    id: uid(),
    name: String(name || "未命名项目").trim() || "未命名项目",
    apiPrefix: sanitizePrefix(apiPrefix),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    resources: [],
    db: {}
  };
  saveProject(project, user);
  return project;
}
function deleteProject(projectId, user) {
  const dir = user ? userProjectDir(user, projectId) : projectDir(projectId);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}
function inferTypeFromValue(v) {
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "number") return "number";
  if (typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "email";
  return "string";
}
function inferFieldsFromRecords(records) {
  const map = new Map();
  records.slice(0, 20).forEach(rec => {
    Object.entries(rec).forEach(([k, v]) => {
      if (k === "id") return;
      if (!map.has(k)) map.set(k, inferTypeFromValue(v));
    });
  });
  const arr = [{ name: "id", type: "id" }];
  for (const [name, type] of map.entries()) arr.push({ name, type });
  return arr;
}
function getResourceMeta(project, resourceName) {
  const resource = (project.resources || []).find(r => r.name === resourceName);
  const rows = Array.isArray(project.db[resourceName]) ? project.db[resourceName] : [];
  if (!resource && !rows.length) return null;
  return {
    name: resourceName,
    label: resource?.label || resourceName,
    parentResource: resource?.parentResource || "",
    fields: resource?.fields?.length ? resource.fields : inferFieldsFromRecords(rows),
    count: rows.length
  };
}
function listProjectResources(project) {
  const names = new Set(Object.keys(project.db || {}).filter(k => Array.isArray(project.db[k])));
  (project.resources || []).forEach(r => names.add(r.name));
  return [...names].map(name => getResourceMeta(project, name)).filter(Boolean);
}
function ensureResource(project, resourceMeta, user) {
  if (!Array.isArray(project.db[resourceMeta.name])) project.db[resourceMeta.name] = [];
  const idx = (project.resources || []).findIndex(r => r.name === resourceMeta.name);
  if (idx === -1) project.resources.push(resourceMeta);
  else project.resources[idx] = resourceMeta;
  project.updatedAt = nowIso();
  saveProject(project, user);
}
function updateResource(project, originalName, resourceMeta) {
  const idx = (project.resources || []).findIndex(r => r.name === originalName);
  if (idx === -1) project.resources.push(resourceMeta);
  else project.resources[idx] = resourceMeta;

  if (originalName !== resourceMeta.name) {
    project.db[resourceMeta.name] = Array.isArray(project.db[originalName]) ? project.db[originalName] : [];
    delete project.db[originalName];
  }
  if (!Array.isArray(project.db[resourceMeta.name])) project.db[resourceMeta.name] = [];

  const newFieldNames = new Set(resourceMeta.fields.map(f => f.name));
  const fieldDefaults = {
    string: "",
    number: 0,
    boolean: false,
    email: "",
    object: {},
    array: []
  };
  (project.db[resourceMeta.name] || []).forEach(record => {
    Object.keys(record).forEach(key => {
      if (key !== 'id' && !newFieldNames.has(key)) delete record[key];
    });
    resourceMeta.fields.forEach(f => {
      if (!(f.name in record)) record[f.name] = fieldDefaults[f.type] !== undefined ? fieldDefaults[f.type] : "";
    });
  });

  project.updatedAt = nowIso();
}
function removeResource(project, resourceName, user) {
  project.resources = (project.resources || []).filter(r => r.name !== resourceName);
  delete project.db[resourceName];
  project.updatedAt = nowIso();
  saveProject(project, user);
}

function getKv(project, keyName) {
  return (project.kvs || []).find(kv => kv.name === keyName);
}

function ensureKv(project, kvMeta, user) {
  const idx = (project.kvs || []).findIndex(kv => kv.name === kvMeta.name);
  if (idx === -1) project.kvs.push(kvMeta);
  else project.kvs[idx] = kvMeta;
  project.updatedAt = nowIso();
  saveProject(project, user);
}

function updateKv(project, originalName, kvMeta, user) {
  const idx = (project.kvs || []).findIndex(kv => kv.name === originalName);
  if (idx === -1) project.kvs.push(kvMeta);
  else project.kvs[idx] = kvMeta;

  if (originalName !== kvMeta.name) {
    const oldKv = (project.kvs || []).find(kv => kv.name === originalName);
    if (oldKv && oldKv.value) kvMeta.value = oldKv.value;
  }

  project.updatedAt = nowIso();
  saveProject(project, user);
}

function removeKv(project, keyName, user) {
  project.kvs = (project.kvs || []).filter(kv => kv.name !== keyName);
  project.updatedAt = nowIso();
  saveProject(project, user);
}
function parseSchema(body) {
  const names = Array.isArray(body.fieldName) ? body.fieldName : [body.fieldName];
  const types = Array.isArray(body.fieldType) ? body.fieldType : [body.fieldType];
  const fields = [];
  for (let i = 0; i < names.length; i += 1) {
    const name = String(names[i] || "").trim();
    if (!name) continue;
    fields.push({ name, type: String(types[i] || "string").trim() || "string" });
  }
  if (!fields.find(f => f.name === "id")) fields.unshift({ name: "id", type: "id" });
  return fields;
}
function nextId(records) {
  const nums = records.map(r => Number(r.id)).filter(v => !Number.isNaN(v));
  return String((nums.length ? Math.max(...nums) : 0) + 1);
}
function castByType(value, type) {
  if (value === undefined) return undefined;
  const text = typeof value === "string" ? value.trim() : value;
  if (type === "boolean") {
    if (text === true || text === "true" || text === "1" || text === 1) return true;
    if (text === false || text === "false" || text === "0" || text === 0) return false;
    return Boolean(text);
  }
  if (type === "number") {
    const n = Number(text);
    return Number.isNaN(n) ? null : n;
  }
  return text;
}
function parseRecordBody(body, fields, mode = "partial") {
  const fieldMap = new Map(fields.map(f => [f.name, f.type]));
  const result = {};
  for (const [name, type] of fieldMap.entries()) {
    if (name === "id") continue;
    if (body[name] === undefined) {
      if (mode === "full") result[name] = type === "boolean" ? false : "";
      continue;
    }
    result[name] = castByType(body[name], type);
  }
  Object.keys(body).forEach(key => {
    if (key === "id") return;
    if (!fieldMap.has(key)) result[key] = typeof body[key] === "string" ? body[key].trim() : body[key];
  });
  return result;
}
function filterSortPage(records, query) {
  let items = [...records];
  const reserved = new Set(["page", "limit", "sortBy", "order", "q"]);
  if (query.q) {
    const keyword = String(query.q).toLowerCase();
    items = items.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(keyword)));
  }
  Object.entries(query).forEach(([k, v]) => {
    if (reserved.has(k)) return;
    if (v === undefined || v === null || v === "") return;
    items = items.filter(item => String(item[k]) === decodeURIComponent(String(v)));
  });
  if (query.sortBy) {
    const key = String(query.sortBy);
    const order = String(query.order || "asc").toLowerCase();
    items.sort((a, b) => {
      const av = a[key], bv = b[key];
      if (av === bv) return 0;
      if (av === undefined) return 1;
      if (bv === undefined) return -1;
      return av > bv ? 1 : -1;
    });
    if (order === "desc") items.reverse();
  }
  const total = items.length;
  const page = Number(query.page || 0);
  const limit = Number(query.limit || 0);
  if (page > 0 && limit > 0) {
    items = items.slice((page - 1) * limit, page * limit);
  }
  return { items, total };
}
function basePath(project) {
  return `/config/${project.id}${project.apiPrefix ? "/" + project.apiPrefix : ""}`;
}
function baseUrl(req, project) {
  return `${req.protocol}://${req.get("host")}${basePath(project)}`;
}
function apiExamples(req, project, resource) {
  const base = baseUrl(req, project);
  const sample = {};
  (resource.fields || []).forEach(f => {
    if (f.name === "id") return;
    if (f.type === "boolean") sample[f.name] = false;
  });
  return {
    listUrl: `${base}/${resource.name}`,
    getJs: `fetch('${base}/${resource.name}')`,
    postJs: `fetch('${base}/${resource.name}', {\n  method: 'POST',\n  headers: { 'content-type': 'application/json' },\n  body: JSON.stringify(${JSON.stringify(makeSample(resource.fields), null, 2)})\n})`
  };
}
function makeSample(fields) {
  const result = {};
  (fields || []).forEach(f => {
    if (f.name === "id") return;
    if (f.type === "boolean") result[f.name] = false;
    else if (f.type === "number") result[f.name] = 0;
    else if (f.type === "email") result[f.name] = "demo@example.com";
    else if (f.type === "object") result[f.name] = {};
    else result[f.name] = "";
  });
  return result;
}
function findProjectByApi(projectId) {
  if (!fs.existsSync(PROJECTS_DIR)) return null;
  const users = fs.readdirSync(PROJECTS_DIR).filter(name => {
    try { return fs.statSync(path.join(PROJECTS_DIR, name)).isDirectory(); }
    catch { return false; }
  });
  for (const user of users) {
    const project = loadProject(projectId, user);
    if (project) return { project, user };
  }
  return null;
}
function stripPrefix(restPath, apiPrefix) {
  const rest = String(restPath || "").replace(/^\/+|\/+$/g, "");
  const prefix = sanitizePrefix(apiPrefix);
  if (!prefix) return { ok: true, remainder: rest };
  if (rest === prefix) return { ok: true, remainder: "" };
  if (rest.startsWith(prefix + "/")) return { ok: true, remainder: rest.slice(prefix.length + 1) };
  return { ok: false, remainder: rest };
}
function parseApiRouteFromParams(projectId, restPath, req) {
  if (!projectId) return null;
  const found = findProjectByApi(projectId);
  if (!found) return { error: { status: 404, body: { message: "项目不存在" } } };
  const { project, user } = found;
  const stripped = stripPrefix(restPath, project.apiPrefix);
  if (!stripped.ok) return { error: { status: 404, body: { message: "API 前缀不存在" } } };
  const segments = stripped.remainder ? stripped.remainder.split("/").filter(Boolean) : [];
  return { project, user, segments };
}

function parseApiRoute(req) {
  const pathValue = req.path;
  const match = pathValue.match(/^\/mock\/([^/]+)(?:\/(.*))?$/);
  if (!match) return null;
  const projectId = match[1];
  const restPath = match[2] || "";
  return parseApiRouteFromParams(projectId, restPath, req);
}
function sendApiIndex(req, res, project) {
  const resources = listProjectResources(project).map(r => ({
    name: r.name,
    label: r.label,
    count: r.count,
    list: `${baseUrl(req, project)}/${r.name}`,
    detail: `${baseUrl(req, project)}/${r.name}/{id}`
  }));
  return res.json({
    project: { id: project.id, name: project.name, apiPrefix: project.apiPrefix },
    baseUrl: baseUrl(req, project),
    resources
  });
}

function seedDemo(user) {
  if (user && loadProjects(user).length) return;
  const project = createProject(user || "demo", "待办示例项目", "api/v1");
  project.resources = [
    {
      name: "users",
      label: "用户",
      parentResource: "",
      fields: [
        { name: "id", type: "id" },
        { name: "name", type: "string" },
        { name: "email", type: "email" }
      ]
    },
    {
      name: "tasks",
      label: "任务",
      parentResource: "users",
      fields: [
        { name: "id", type: "id" },
        { name: "title", type: "string" },
        { name: "completed", type: "boolean" },
        { name: "userId", type: "number" }
      ]
    }
  ];
  project.db = {
    users: [
      { id: "1", name: "张三", email: "zhangsan@example.com" },
      { id: "2", name: "李四", email: "lisi@example.com" }
    ],
    tasks: [
      { id: "1", title: "检查接口返回", completed: false, userId: 1 },
      { id: "2", title: "完善页面样式", completed: true, userId: 2 }
    ]
  };
  project.updatedAt = nowIso();
  saveProject(project, user || "demo");
}
seedDemo("wangjun");

app.get("/login", (req, res) => {
  if (req.cookies && req.cookies.session) {
    return res.redirect("/projects");
  }
  renderWithLocale(req, res, "login", {});
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !/^[a-zA-Z]+$/.test(username)) {
    return res.redirect("/login");
  }
  if (checkAuth(username, password)) {
    res.cookie("session", username, { maxAge: 86400000, httpOnly: true });
    return res.redirect("/projects");
  }
  res.redirect("/login");
});
app.get("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});

app.get("/", requireAuth, (req, res) => res.redirect("/projects"));

app.get("/projects", requireAuth, (req, res) => {
  renderWithLocale(req, res, "projects", { projects: loadProjects(req.sessionUser) });
});
app.post("/projects", requireAuth, (req, res) => {
  const project = createProject(req.sessionUser, req.body.name, req.body.apiPrefix);
  res.redirect(`/projects/${project.id}`);
});

app.get("/projects/:projectId", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  renderWithLocale(req, res, "project-detail", {
    project,
    resources: listProjectResources(project),
    kvs: project.kvs || [],
    apiBase: baseUrl(req, project)
  });
});
app.post("/projects/:projectId/save", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  project.name = String(req.body.name || project.name).trim() || project.name;
  project.apiPrefix = sanitizePrefix(req.body.apiPrefix);
  project.updatedAt = nowIso();
  saveProject(project, req.sessionUser);
  res.redirect(`/projects/${project.id}`);
});
app.post("/projects/:projectId/delete", requireAuth, (req, res) => {
  deleteProject(req.params.projectId, req.sessionUser);
  res.redirect("/projects");
});

app.get("/projects/:projectId/resources/new", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  renderWithLocale(req, res, "resource-form", {
    project,
    mode: "create",
    resources: listProjectResources(project),
    resource: {
      name: "",
      label: "",
      parentResource: "",
      fields: [
        { name: "id", type: "id" },
        { name: "name", type: "string" }
      ]
    }
  });
});
app.post("/projects/:projectId/resources", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  const name = normalizeResourceName(req.body.name);
  if (!name) return res.status(400).send("资源名称不能为空");
  const meta = {
    name,
    label: String(req.body.label || name).trim() || name,
    parentResource: String(req.body.parentResource || "").trim(),
    fields: parseSchema(req.body)
  };
  ensureResource(project, meta, req.sessionUser);
  res.redirect(`/projects/${project.id}`);
});
app.get("/projects/:projectId/resources/:resourceName/edit", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  const resource = getResourceMeta(project, req.params.resourceName);
  if (!resource) return res.status(404).send("资源不存在");
  renderWithLocale(req, res, "resource-form", {
    project,
    mode: "edit",
    resources: listProjectResources(project),
    resource
  });
});
app.post("/projects/:projectId/resources/:resourceName/save", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  const originalName = req.params.resourceName;
  const meta = {
    name: normalizeResourceName(req.body.name || originalName),
    label: String(req.body.label || req.body.name || originalName).trim() || originalName,
    parentResource: String(req.body.parentResource || "").trim(),
    fields: parseSchema(req.body)
  };
  updateResource(project, originalName, meta);
  saveProject(project, req.sessionUser);
  res.redirect(`/projects/${project.id}`);
});
app.post("/projects/:projectId/resources/:resourceName/delete", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  removeResource(project, req.params.resourceName, req.sessionUser);
  res.redirect(`/projects/${project.id}`);
});

app.get("/projects/:projectId/resources/:resourceName/data", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  const resource = getResourceMeta(project, req.params.resourceName);
  if (!resource) return res.status(404).send("资源不存在");
  renderWithLocale(req, res, "resource-data", {
    project,
    resource,
    apiBase: baseUrl(req, project),
    jsonText: JSON.stringify(project.db[resource.name] || [], null, 2),
    sample: JSON.stringify(makeSample(resource.fields), null, 2)
  });
});
app.post("/projects/:projectId/resources/:resourceName/data/save", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  const resource = getResourceMeta(project, req.params.resourceName);
  if (!resource) return res.status(404).send("资源不存在");
  const isAjax = req.xhr || req.get('X-Requested-With') === 'XMLHttpRequest' || req.headers.accept && req.headers.accept.indexOf('json') > -1;
  let parsed;
  try {
    let jsonText = req.body.jsonText || "[]";
    if (typeof jsonText !== 'string') jsonText = "[]";
    parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) throw new Error("必须是数组");
  } catch (e) {
    if (isAjax) return res.status(400).json({ error: 'Invalid JSON format: ' + e.message });
    return res.redirect(`/projects/${project.id}/resources/${req.params.resourceName}/data?error=invalid_json`);
  }
  const fieldNames = new Set(resource.fields.map(f => f.name));
  for (let i = 0; i < parsed.length; i++) {
    const record = parsed[i];
    const recordKeys = Object.keys(record);
    const missingFields = [];
    fieldNames.forEach(fn => {
      if (fn !== 'id' && !(fn in record)) missingFields.push(fn);
    });
    if (missingFields.length > 0) {
      const msg = '第 ' + (i + 1) + ' 条记录缺少字段: ' + missingFields.join(', ');
      if (isAjax) return res.status(400).json({ error: msg });
      return res.redirect(`/projects/${project.id}/resources/${req.params.resourceName}/data?error=${encodeURIComponent(msg)}`);
    }
    const extraFields = recordKeys.filter(k => k !== 'id' && !fieldNames.has(k));
    if (extraFields.length > 0) {
      const msg = '第 ' + (i + 1) + ' 条记录有多余字段: ' + extraFields.join(', ');
      if (isAjax) return res.status(400).json({ error: msg });
      return res.redirect(`/projects/${project.id}/resources/${req.params.resourceName}/data?error=${encodeURIComponent(msg)}`);
    }
  }
  project.db[req.params.resourceName] = parsed;
  project.updatedAt = nowIso();
  saveProject(project, req.sessionUser);
  if (isAjax) return res.json({ success: true });
  res.redirect(`/projects/${project.id}/resources/${req.params.resourceName}/data`);
});
app.get("/projects/:projectId/resources/:resourceName/docs", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  const resource = getResourceMeta(project, req.params.resourceName);
  if (!resource) return res.status(404).send("资源不存在");
  renderWithLocale(req, res, "resource-docs", {
    project,
    resource,
    apiBase: baseUrl(req, project),
    sample: JSON.stringify(makeSample(resource.fields), null, 2)
  });
});

app.get("/projects/:projectId/kvs/new", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  renderWithLocale(req, res, "kv-form", {
    project,
    mode: "create",
    apiBase: baseUrl(req, project),
    kv: {
      name: "",
      desc: "",
      fields: [
        { name: "value", type: "string" }
      ],
      value: { value: "" }
    }
  });
});

app.post("/projects/:projectId/kvs", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).send("Key名称不能为空");
  const existingKv = (project.kvs || []).find(kv => kv.name === name);
  if (existingKv) return res.status(400).send("Key已存在");
  const valueType = String(req.body.valueType || "string").trim();
  const validTypes = ['string', 'boolean', 'object'];
  if (!validTypes.includes(valueType)) {
    return res.status(400).send("无效的类型");
  }
  const rawValue = req.body.value;
  let parsedValue;
  if (valueType === "boolean") {
    parsedValue = rawValue === true || rawValue === "true" || rawValue === "1";
  } else if (valueType === "object") {
    try { parsedValue = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue; }
    catch { parsedValue = {}; }
  } else {
    parsedValue = String(rawValue || "");
  }
  const kvMeta = {
    name,
    desc: String(req.body.desc || "").trim(),
    fields: [{ name: "value", type: valueType }],
    value: { value: parsedValue }
  };
  ensureKv(project, kvMeta, req.sessionUser);
  res.redirect(`/projects/${project.id}`);
});

app.get("/projects/:projectId/kvs/:keyName/edit", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  const kv = getKv(project, req.params.keyName);
  if (!kv) return res.status(404).send("KV不存在");
  renderWithLocale(req, res, "kv-form", {
    project,
    mode: "edit",
    apiBase: baseUrl(req, project),
    kv
  });
});

app.post("/projects/:projectId/kvs/:keyName/save", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  const originalName = req.params.keyName;
  const newName = String(req.body.name || originalName).trim();
  if (!newName) return res.status(400).send("Key名称不能为空");
  if (originalName !== newName) {
    const existingKv = (project.kvs || []).find(kv => kv.name === newName);
    if (existingKv) return res.status(400).send("Key已存在");
  }
  const valueType = String(req.body.valueType || "string").trim();
  const validTypes = ['string', 'boolean', 'object'];
  if (!validTypes.includes(valueType)) {
    return res.status(400).send("无效的类型");
  }
  const rawValue = req.body.value;
  let parsedValue;
  if (valueType === "boolean") {
    parsedValue = rawValue === true || rawValue === "true" || rawValue === "1";
  } else if (valueType === "object") {
    try { parsedValue = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue; }
    catch { parsedValue = {}; }
  } else {
    parsedValue = String(rawValue || "");
  }
  const kvMeta = {
    name: newName,
    desc: String(req.body.desc || "").trim(),
    fields: [{ name: "value", type: valueType }],
    value: { value: parsedValue }
  };
  updateKv(project, originalName, kvMeta, req.sessionUser);
  res.redirect(`/projects/${project.id}`);
});

app.post("/projects/:projectId/kvs/:keyName/delete", requireAuth, (req, res) => {
  const project = loadProject(req.params.projectId, req.sessionUser);
  if (!project) return res.status(404).send("项目不存在");
  removeKv(project, req.params.keyName, req.sessionUser);
  res.redirect(`/projects/${project.id}`);
});

/* API: support multi-segment prefix like api/v1 */
app.all('/config/:projectId/*', (req, res) => {
  const projectId = req.params.projectId;
  const restPath = req.params[0] || "";
  const parsed = parseApiRouteFromParams(projectId, restPath, req);
  if (!parsed) return res.status(404).json({ message: "路由不存在" });
  if (parsed.error) return res.status(parsed.error.status).json(parsed.error.body);
  const { project, user, segments } = parsed;

  res.set('Content-Type', 'application/json');

  if (segments.length === 0) return sendApiIndex(req, res, project);

  if (segments[0] === "kv") {
    if (segments.length === 1) {
      if (req.method === "GET") {
        const list = (project.kvs || []).map(kv => ({
          key: kv.name,
          desc: kv.desc,
          fields: kv.fields,
          value: kv.value
        }));
        return res.json(list);
      }
      if (req.method === "POST") {
        const { key, desc, type, value } = req.body;
        if (!key) return res.status(400).json({ message: "key不能为空" });
        const rawValue = value;
        let inferType = type || "string";
        if (!type && rawValue !== undefined) {
          if (typeof rawValue === "boolean") inferType = "boolean";
          else if (typeof rawValue === "number") inferType = "number";
          else if (Array.isArray(rawValue)) inferType = "array";
          else if (typeof rawValue === "object" && rawValue !== null) inferType = "object";
        }
        const existingKv = (project.kvs || []).find(kv => kv.name === key);
        if (existingKv) {
          existingKv.value = { value: rawValue };
          if (desc) existingKv.desc = desc;
          existingKv.fields = [{ name: "value", type: inferType }];
        } else {
          const newKv = {
            name: key,
            desc: desc || "",
            fields: [{ name: "value", type: inferType }],
            value: { value: rawValue }
          };
          project.kvs = project.kvs || [];
          project.kvs.push(newKv);
        }
        project.updatedAt = nowIso();
        saveProject(project, user);
        return res.status(201).json({ success: true, key });
      }
      return res.status(405).json({ message: "不支持的请求方法" });
    }

    if (segments.length === 2) {
      const keyName = segments[1];
      const kv = (project.kvs || []).find(kv => kv.name === keyName);
      if (!kv) return res.status(404).json({ message: "Key不存在" });

      if (req.method === "GET") {
        const type = kv.fields?.[0]?.type || 'string';
        return res.json({ type, value: kv.value?.value });
      }
      if (req.method === "PUT") {
        const newValue = req.body && req.body.value;
        if (newValue !== undefined) {
          kv.value = { value: newValue };
        }
        project.updatedAt = nowIso();
        saveProject(project, user);
        return res.json({ success: true });
      }
      if (req.method === "DELETE") {
        project.kvs = (project.kvs || []).filter(kv => kv.name !== keyName);
        project.updatedAt = nowIso();
        saveProject(project, user);
        return res.json({ success: true, deleted: keyName });
      }
      return res.status(405).json({ message: "不支持的请求方法" });
    }

    return res.status(404).json({ message: "路由不存在" });
  }

  if (segments.length === 1) {
    const resource = getResourceMeta(project, segments[0]);
    if (!resource) return res.status(404).json({ message: "资源不存在" });
    if (req.method === "GET") {
      const { items, total } = filterSortPage(project.db[resource.name] || [], req.query);
      res.set("X-Total-Count", String(total));
      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      return res.json(items);
    }
    if (req.method === "POST") {
      const item = { id: nextId(project.db[resource.name] || []), ...parseRecordBody(req.body, resource.fields, "partial") };
      project.db[resource.name].push(item);
      project.updatedAt = nowIso();
      saveProject(project, user);
      return res.status(201).json(item);
    }
    return res.status(405).json({ message: "不支持的请求方法" });
  }

  if (segments.length === 2) {
    const resource = getResourceMeta(project, segments[0]);
    if (!resource) return res.status(404).json({ message: "资源不存在" });
    const rows = project.db[resource.name] || [];
    const idx = rows.findIndex(r => String(r.id) === String(segments[1]));
    if (idx === -1) return res.status(404).json({ message: "记录不存在" });
    if (req.method === "GET") return res.json(rows[idx]);
    if (req.method === "PUT") {
      const updated = { id: String(segments[1]), ...parseRecordBody(req.body, resource.fields, "full") };
      rows[idx] = updated;
      project.updatedAt = nowIso();
      saveProject(project, user);
      return res.json(updated);
    }
    if (req.method === "PATCH") {
      const updated = { ...rows[idx], ...parseRecordBody(req.body, resource.fields, "partial"), id: rows[idx].id };
      rows[idx] = updated;
      project.updatedAt = nowIso();
      saveProject(project, user);
      return res.json(updated);
    }
    if (req.method === "DELETE") {
      const [removed] = rows.splice(idx, 1);
      project.updatedAt = nowIso();
      saveProject(project, user);
      return res.json(removed);
    }
    return res.status(405).json({ message: "不支持的请求方法" });
  }

  if (segments.length === 3) {
    const [parentResourceName, parentId, resourceName] = segments;
    const resource = getResourceMeta(project, resourceName);
    if (!resource) return res.status(404).json({ message: "资源不存在" });
    const foreignKey = `${parentResourceName.replace(/s$/, "")}Id`;
    const scoped = (project.db[resource.name] || []).filter(item => String(item[foreignKey]) === String(parentId));
    if (req.method === "GET") {
      const { items, total } = filterSortPage(scoped, req.query);
      res.set("X-Total-Count", String(total));
      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      return res.json(items);
    }
    if (req.method === "POST") {
      const item = {
        id: nextId(project.db[resource.name] || []),
        ...parseRecordBody(req.body, resource.fields, "partial"),
        [foreignKey]: Number.isNaN(Number(parentId)) ? String(parentId) : Number(parentId)
      };
      project.db[resource.name].push(item);
      project.updatedAt = nowIso();
      saveProject(project, user);
      return res.status(201).json(item);
    }
    return res.status(405).json({ message: "不支持的请求方法" });
  }

  return res.status(404).json({ message: "路由不存在" });
});

app.listen(PORT, () => {
  console.log(`Mock 平台已启动: http://localhost:${PORT}`);
});
