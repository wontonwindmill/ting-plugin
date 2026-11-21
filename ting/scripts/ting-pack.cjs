#!/usr/bin/env node
// The pack client: a pack's folder kept in step with the Ting pack service, with no git. It needs nothing but
// Node (18 or later), so it ships on its own in the Claude Code plugin to people who don't have our code. A pack's
// folder holds the pack (pack.json), the world's kit (kit/: what to read to write for it) and, in .ting/, the
// service, the pack's code, the version last in step, and the last check and script.
//
//   ting-pack worlds                         the settings a world can be made over
//   ting-pack kit <world> [folder] [--map <m>]   the setting's kit into a folder, to plan before there's a world
//                                            (--map: on another of the setting's maps, `city`)
//   ting-pack new <id> --world <w> [--map <m>] [--title <t>] [--by <name>] [--invite <code>] [folder]   a world of
//                                            your own over that setting, from its own Day 0 (--map city: on the
//                                            Chinese setting's city): its code
//   (Ting's own, with TING_ADMIN_KEY: `kit --story` and `new --after <quest>`, scenes laid into a town's own story.)
//   ting-pack open <id or key> [folder]      a world into a folder: by its id (connected: login), or by its key (here if
//                                            it's empty, else ./<id>)
//   ting-pack check [folder]                 check what's here and script it (.ting/script.md), saving nothing
//   ting-pack push [folder]                  save a new version, checked; refused if there's a newer one to pull
//   ting-pack pull [folder] [--force]        take the latest version (--force: even over changes here, kept aside)
//   ting-pack status [folder]                changed here? newer there? and its last check
//   ting-pack submit [folder]                send the latest saved version for review; Ting publishes it once approved
//   ting-pack publish [folder] [--original]  (Ting's key, TING_ADMIN_KEY) publish the version sent for review
//   ting-pack link [folder]                  a short code to type into the app, to play your drafts on your phone
//   ting-pack play [folder]                  the latest saved version in Ting Studio, playing beside it in a browser
//   ting-pack upload [folder] [--invite c]   put a pack that's only here on the service: prints its code
//   ting-pack code [folder]                  the code, to open the pack somewhere else
//   ting-pack login [--wait]                 connect Claude Code to your Ting account: a code to allow in the Studio;
//                                            --wait waits for you to allow it. Then worlds open by their id, no key
//   ting-pack logout                         disconnect it here
//   ting-pack studio [folder] [--wait <s>]   wait for what the Studio asks (up to 9 minutes; run again to keep waiting):
//                                            in a world's folder, of that world; anywhere else, connected, of any of
//                                            yours (each opened into a folder of its own). Then say what to do
//   ting-pack progress <pct> <what's happening>   how the request is going, shown in the Studio as it happens
//   ting-pack done <what was done> [--failed]     the request is done (or couldn't be)
//   add --json for one JSON object; the service is TING_SERVER (https://studio.tinglanguage.com) unless the folder says
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const crypto = require('node:crypto')

const DEFAULT_SERVER = process.env.TING_SERVER ?? 'https://studio.tinglanguage.com'
const syncFile = folder => path.join(folder, '.ting', 'sync.json')
const packFile = folder => path.join(folder, 'pack.json')
const hash = text => crypto.createHash('sha256').update(text).digest('hex')
/** The pack as it's written to a folder: what the hash in sync.json is of. */
const asText = pack => JSON.stringify(pack, null, 2) + '\n'

/**
 * Claude Code connected to a Ting account (`login`): a token for the account, by service, kept in the person's own
 * folder (~/.ting/account.json, or TING_HOME's), never in a world's folder.
 */
const accountFile = () => path.join(process.env.TING_HOME ?? path.join(os.homedir(), '.ting'), 'account.json')
const readAccount = () => { try { return JSON.parse(fs.readFileSync(accountFile(), 'utf8')) } catch { return {} } }
function writeAccount(data) {
  fs.mkdirSync(path.dirname(accountFile()), { recursive: true })
  fs.writeFileSync(accountFile(), JSON.stringify(data, null, 2) + '\n', { mode: 0o600 })
}
const tokenFor = server => readAccount()[server.replace(/\/$/, '')]?.token
/** What opens a world from here: its key, if the folder has one, else the account Claude Code is connected to. */
function authOf(sync) {
  const auth = sync.code ?? tokenFor(sync.server)
  if (!auth) throw new Problem('This world was opened with your Ting account, and Claude Code isn\'t connected to it here: run login')
  return auth
}

/** An error a person can act on, from the service or from here. */
class Problem extends Error {
  constructor(message, extra = {}) { super(message); Object.assign(this, extra) }
}

async function call(server, method, route, { code, body, headers = {} } = {}) {
  let res
  try {
    res = await fetch(new URL(route, server), {
      method,
      headers: { ...(code ? { Authorization: `Bearer ${code}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Problem(`Couldn't reach the Ting pack service at ${server}. Check your connection, and try again.`)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Problem(data.error ?? `The service said ${res.status}`, { status: res.status, ...data })
  return data
}

function readSync(folder) {
  if (!fs.existsSync(syncFile(folder))) throw new Problem(`${folder} isn't a pack on the service yet: open one into it, or start one with new`)
  return JSON.parse(fs.readFileSync(syncFile(folder), 'utf8'))
}
function writeSync(folder, sync) {
  fs.mkdirSync(path.dirname(syncFile(folder)), { recursive: true })
  fs.writeFileSync(syncFile(folder), JSON.stringify(sync, null, 2) + '\n')
}
function readPack(folder) {
  if (!fs.existsSync(packFile(folder))) throw new Problem(`There's no pack.json in ${folder}`)
  const text = fs.readFileSync(packFile(folder), 'utf8')
  try { return { text, pack: JSON.parse(text) } } catch (e) { throw new Problem(`${packFile(folder)} isn't valid JSON: ${e.message}`) }
}
/** Writes the service's version into the folder and notes it as the one in step. */
function take(folder, sync, pack, version) {
  const text = asText(pack)
  fs.mkdirSync(folder, { recursive: true })
  fs.writeFileSync(packFile(folder), text)
  writeSync(folder, { ...sync, version, hash: hash(text) })
}
const changedHere = (folder, sync) => !fs.existsSync(packFile(folder)) || hash(fs.readFileSync(packFile(folder), 'utf8')) !== sync.hash
/** Where a new pack goes when no folder is named: here, if here is empty (or holds only the kit), or else a folder named for it. */
const folderFor = (folder, id) => folder ?? (fs.readdirSync('.').some(f => !f.startsWith('.') && f !== 'kit') ? id : '.')
/** Ting's key, for Ting's own work (packs laid into its towns' own stories): TING_ADMIN_KEY. */
const tingHeaders = () => (process.env.TING_ADMIN_KEY ? { 'X-Ting-Admin': process.env.TING_ADMIN_KEY } : {})
/**
 * The setting's kit, for a world of your own (`own`), written into the folder's kit/ (replacing what was there: it's
 * the service's, not yours). Not `own`: the kit for writing into a town's own story, which is Ting's only.
 */
async function writeKit(server, world, folder, own = false, map) {
  const { files } = await call(server, 'GET', `/api/worlds/${encodeURIComponent(world)}/kit${own ? `?for=world${map ? `&map=${encodeURIComponent(map)}` : ''}` : ''}`, { headers: own ? {} : tingHeaders() })
  const dir = path.join(folder, 'kit')
  fs.rmSync(dir, { recursive: true, force: true })
  for (const [name, text] of Object.entries(files)) {
    const file = path.resolve(dir, name)
    if (!file.startsWith(path.resolve(dir) + path.sep)) continue
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, text)
  }
  return Object.keys(files).length
}
/** The request being worked on, from the Studio (`studio` keeps it). */
const requestFile = folder => path.join(folder, '.ting', 'request.json')
/** Waiting for any of an account's worlds: which world's folder the request being worked on is in. */
const currentFile = folder => path.join(folder, '.ting', 'current.json')
const workingIn = folder => (!fs.existsSync(requestFile(folder)) && fs.existsSync(currentFile(folder)) ? path.join(folder, JSON.parse(fs.readFileSync(currentFile(folder), 'utf8')).folder) : folder)

/** A world opened by its id, with the account Claude Code is connected to, into a folder (its id's, here, unless named). */
async function openWith(server, id, folder, { kit = true } = {}) {
  const token = tokenFor(server)
  if (!token) throw new Problem('Claude Code isn\'t connected to your Ting account yet: run login (or open the world by its key)')
  folder = folder ?? id
  const sync = { server, id }
  if (fs.existsSync(syncFile(folder))) {
    const was = readSync(folder)
    if (was.id !== id) throw new Problem(`${folder} holds ${was.id}, not ${id}`)
    if (changedHere(folder, was)) throw new Problem(`${folder} has changes that aren't on the service: push them, or pull --force`)
    Object.assign(sync, was)
  }
  const info = await call(server, 'GET', `/api/packs/${id}`, { code: token })
  if (!info.mine) throw new Problem(`${id} isn't one of your worlds`)
  const pack = await call(server, 'GET', `/packs/${id}/pack.json?v=${info.latest}`, { code: token })
  take(folder, sync, pack, info.latest)
  const files = kit && !fs.existsSync(path.join(folder, 'kit')) ? await writeKit(server, pack.world, folder, pack.kind === 'world', pack.map) : 0
  return { ok: true, id, folder, version: info.latest, title: pack.title, world: pack.world, kit: files,
    say: `Opened ${pack.title} (${id}, version ${info.latest}) into ${folder}${files ? `, with its kit` : ''}` }
}

/** Waits for what's asked of any of the account's worlds, and opens that world here (in a folder of its own). */
async function studioForAccount(folder, { wait = 540 } = {}) {
  const server = DEFAULT_SERVER.replace(/\/$/, ''), token = tokenFor(server)
  if (!token) throw new Problem(`This isn't a world's folder, and Claude Code isn't connected to your Ting account yet: run login first (or open a world by its key, and run studio in its folder)`)
  const until = Date.now() + wait * 1000
  let request = null
  while (!request && Date.now() < until) {
    const left = Math.max(1, Math.ceil((until - Date.now()) / 1000))
    ;({ request } = await call(server, 'GET', `/api/requests/next?wait=${Math.min(50, left)}`, { code: token }))
  }
  if (!request) return { ok: true, waiting: true, say: 'Nothing asked in the Studio yet. Run studio again to keep waiting.' }
  const where = path.join(folder, request.pack)
  const opened = await openWith(server, request.pack, where)
  fs.writeFileSync(requestFile(where), JSON.stringify(request, null, 2) + '\n')
  fs.mkdirSync(path.join(folder, '.ting'), { recursive: true })
  fs.writeFileSync(currentFile(folder), JSON.stringify({ folder: request.pack }) + '\n')
  return { ok: true, request, folder: where, version: opened.version, say: [`The Studio asks, for ${opened.title} (request ${request.id}, version ${opened.version}, in ${where}): ${ASKS[request.kind](request)}`,
    `Work in ${where}. Say how it's going: progress <0-100> <what you're doing>. Save versions as you go (push ${where}). When it's done: done <one line on what you did>.`].join('\n') }
}
function readRequest(folder) {
  if (!fs.existsSync(requestFile(folder))) throw new Problem('There\'s no request being worked on here: run studio to wait for one')
  return JSON.parse(fs.readFileSync(requestFile(folder), 'utf8'))
}
/** What each kind of request asks, in a line. */
const ASKS = {
  build: () => 'build the storyboard: write the scenes its panels describe (`storyboard` in pack.json), and say which scene each panel became.',
  propose: r => `propose a storyboard: fill in its days and panels from its description${r.note ? ` (and: "${r.note}")` : ''}, writing no scenes.`,
  panel: r => `do panel ${r.panel} again: "${r.note}".`,
  ask: r => `"${r.note}"`,
}

/** A check, in short, for people. */
const said = check => (check.ok ? 'Ready to play.' : `Not ready: ${check.problems.length} problem${check.problems.length === 1 ? '' : 's'}`)
const listed = check => [said(check), ...check.problems.map(p => `  ✗ ${p}`), ...(check.notes ?? []).map(n => `  · ${n}`),
  ...(check.guessing ?? []).map(g => `  ${g.ok ? '·' : '✗'} ${g.quest}: ${g.reached === false ? "can't be reached" : `guessing at random does well ${g.topPercent}% of the time (under 20%)`}`)].join('\n')

const commands = {
  async worlds({ server = DEFAULT_SERVER } = {}) {
    const worlds = await call(server, 'GET', '/api/worlds')
    return { ok: true, worlds, say: worlds.map(w => [`${w.id}: ${w.name}, ${w.language}`, ...(w.maps ?? []).map(m => `  --map ${m.id}: ${m.setting}`)].join('\n')).join('\n') }
  },

  async kit(world, folder = '.', { server = DEFAULT_SERVER, own = true, map } = {}) {
    if (!world) {
      const sync = readSync(folder)
      const { pack } = readPack(folder)
      world = pack.world
      own = pack.kind === 'world'
      map = pack.map
      server = sync.server
    }
    const n = await writeKit(server, world, folder, own, map)
    return { ok: true, world, files: n, say: `Wrote the kit for ${world} into ${path.join(folder, 'kit')} (${n} files; start with kit/README.md)` }
  },

  async new(id, { world, after, by, invite, own, map, title, folder, server = DEFAULT_SERVER } = {}) {
    // A world of your own, always (`--own`, the default); a pack laid into a town's own story (`--after`) is Ting's only.
    own = own ?? !after
    if (!id || !world) throw new Problem('Usage: new <id> --world <world> [--map city] [--title <title>] [--invite <code>] [--by <name, as credited>] [folder]')
    if (!own && !process.env.TING_ADMIN_KEY) throw new Problem("Ting's towns' own stories are Ting's to add to: make a world of your own over one of its settings instead (leave out --after).")
    folder = folderFor(folder, id)
    if (fs.existsSync(packFile(folder))) throw new Problem(`${folder} already has a pack.json: start the new pack in another folder`)
    // (Connected to a Ting account: the world is that account's.)
    const made = await call(server, 'POST', '/api/packs/new', { code: tokenFor(server), body: own ? { id, world, kind: 'world', map, title, by, invite } : { id, world, after, by, invite }, headers: own ? {} : tingHeaders() })
    const pack = await call(server, 'GET', `/packs/${made.id}/pack.json?v=${made.version}`, { code: made.key })
    take(folder, { server, id: made.id, code: made.key }, pack, made.version)
    const files = await writeKit(server, world, folder, own, map)
    return { ok: true, id: made.id, code: made.key, folder, version: made.version, kit: files,
      say: `Started ${made.id} in ${folder}, with the kit for ${world} in ${path.join(folder, 'kit')}.\nIts code is ${made.key}: it opens your world anywhere, and anyone with it can change it, so keep it to yourself.` }
  },

  async upload(folder, { server = DEFAULT_SERVER, invite } = {}) {
    if (fs.existsSync(syncFile(folder))) throw new Problem(`${folder} is already on the service: push to save a new version`)
    const { pack, text } = readPack(folder)
    const made = await call(server, 'POST', '/api/packs', { body: { pack, invite } })
    writeSync(folder, { server, id: made.id, code: made.key, version: made.version, hash: hash(text) })
    return { ok: true, id: made.id, code: made.key, version: made.version, check: made.check,
      say: `Uploaded ${made.id} as version ${made.version}. ${said(made.check)}\nIts code is ${made.key}: anyone with it can change the pack, so keep it to yourself.` }
  },

  async open(code, folder, { server = DEFAULT_SERVER, kit = true } = {}) {
    if (!code) throw new Problem('Open which world? Give its id (connected to your Ting account: login), or its key (ting-XXXX-…)')
    // (A world's id, with the account Claude Code is connected to; or its key.)
    if (!code.startsWith('ting-')) return openWith(server, code, folder, { kit })
    const { id } = await call(server, 'GET', '/api/open', { code })
    folder = folderFor(folder, id)
    if (fs.existsSync(syncFile(folder))) {
      const sync = readSync(folder)
      if (sync.id !== id) throw new Problem(`${folder} holds ${sync.id}, not ${id}: open it into another folder`)
      if (changedHere(folder, sync)) throw new Problem(`${folder} has changes that aren't on the service: push them, or pull --force`)
    } else if (fs.existsSync(packFile(folder))) throw new Problem(`${folder} already has a pack.json: open it into another folder`)
    const info = await call(server, 'GET', `/api/packs/${id}`, { code })
    const pack = await call(server, 'GET', `/packs/${id}/pack.json?v=${info.latest}`, { code })
    take(folder, { server, id, code }, pack, info.latest)
    const files = kit ? await writeKit(server, pack.world, folder, pack.kind === 'world', pack.map) : 0
    return { ok: true, id, folder, version: info.latest, title: pack.title, world: pack.world, kit: files,
      say: `Opened ${pack.title} (${id}, version ${info.latest}) into ${folder}${files ? `, with the kit for ${pack.world} in ${path.join(folder, 'kit')}` : ''}` }
  },

  /** What's here, checked and scripted by the service, without saving a version. */
  async check(folder) {
    const sync = readSync(folder)
    const { pack } = readPack(folder)
    const tried = await call(sync.server, 'POST', `/api/packs/${sync.id}/check`, { code: authOf(sync), body: { pack } })
    fs.mkdirSync(path.join(folder, '.ting'), { recursive: true })
    fs.writeFileSync(path.join(folder, '.ting', 'script.md'), tried.script)
    fs.writeFileSync(path.join(folder, '.ting', 'check.json'), JSON.stringify(tried.check, null, 2) + '\n')
    return { ok: tried.check.ok, check: tried.check, script: path.join(folder, '.ting', 'script.md'),
      say: `${listed(tried.check)}\nThe pack as it plays: ${path.join(folder, '.ting', 'script.md')}` }
  },

  async status(folder) {
    const sync = readSync(folder)
    const info = await call(sync.server, 'GET', `/api/packs/${sync.id}`, { code: authOf(sync) })
    const check = await call(sync.server, 'GET', `/api/packs/${sync.id}/check?v=${info.latest}`, { code: authOf(sync) })
    const here = changedHere(folder, sync), there = info.latest > sync.version
    return { ok: true, id: sync.id, version: sync.version, latest: info.latest, submitted: info.submitted ?? null, published: info.published, changedHere: here, newerThere: there, check, recording: info.recording ?? null,
      say: [`${sync.id}: version ${sync.version} here, ${info.latest} on the service${info.submitted ? `, ${info.submitted} sent for review` : ''}${info.published ? `, ${info.published} published` : ''}.`,
        here ? 'Changed here since then: push to save it.' : 'Nothing changed here.',
        there ? 'There is a newer version on the service: pull it.' : '',
        info.recording ? `Recording version ${info.recording.version}: ${info.recording.state}${info.recording.summary ? ` (${info.recording.summary})` : ''}` : '',
        `Latest version's check: ${said(check)}`, ...check.problems.map(p => `  ✗ ${p}`)].filter(Boolean).join('\n') }
  },

  async pull(folder, { force = false } = {}) {
    const sync = readSync(folder)
    const info = await call(sync.server, 'GET', `/api/packs/${sync.id}`, { code: authOf(sync) })
    let kept
    if (changedHere(folder, sync)) {
      if (!force) throw new Problem(`${folder} has changes that aren't on the service: push them first, or pull --force (which keeps yours as pack.mine.json)`)
      kept = path.join(folder, 'pack.mine.json')
      fs.copyFileSync(packFile(folder), kept)
    }
    if (info.latest === sync.version && !kept) return { ok: true, version: sync.version, say: `Already in step (version ${sync.version})` }
    const pack = await call(sync.server, 'GET', `/packs/${sync.id}/pack.json?v=${info.latest}`, { code: authOf(sync) })
    take(folder, sync, pack, info.latest)
    return { ok: true, version: info.latest, kept, say: `Pulled version ${info.latest}${kept ? `; your changes are in ${kept}` : ''}` }
  },

  async push(folder) {
    const sync = readSync(folder)
    const { pack, text } = readPack(folder)
    if (!changedHere(folder, sync)) return { ok: true, version: sync.version, unchanged: true, say: `Nothing to push: version ${sync.version} is what's here` }
    const saved = await call(sync.server, 'PUT', `/api/packs/${sync.id}`, { code: authOf(sync), body: { pack, base: sync.version } })
    writeSync(folder, { ...sync, version: saved.version, hash: hash(text) })
    return { ok: saved.check.ok, version: saved.version, check: saved.check, say: `Saved version ${saved.version}. ${listed(saved.check)}` }
  },

  /** Sends the latest saved version for review: Ting publishes it once it's approved (and records its lines). */
  async submit(folder) {
    const sync = readSync(folder)
    if (changedHere(folder, sync)) throw new Problem("There are changes here that aren't saved yet: push them first")
    const done = await call(sync.server, 'POST', `/api/packs/${sync.id}/submit`, { code: authOf(sync) })
    return { ok: true, ...done, say: `Version ${done.submitted} is sent for review. Once it's approved it's published, and its lines are recorded. You can keep writing meanwhile: what's sent stays as it is.` }
  },

  /**
   * Publishes the version sent for review (or `version`): Ting's key only (TING_ADMIN_KEY). `original`: as one of
   * Ting's own chapters, which every app pulls in.
   */
  async publish(folder, { original = false, version } = {}) {
    const sync = readSync(folder)
    const admin = process.env.TING_ADMIN_KEY
    if (!admin) throw new Problem("Publishing is Ting's: submit it for review instead")
    const done = await call(sync.server, 'POST', `/api/packs/${sync.id}/publish`, { body: { original, version }, headers: { 'X-Ting-Admin': admin } })
    return { ok: true, ...done, say: `Published version ${done.published}. Recording its lines: ${done.recording?.state ?? 'not started'} (status shows when it's done)` }
  },

  /** A short code to type into the app (Stories by others, signed in): then this pack's drafts show on that phone. */
  async link(folder) {
    const sync = readSync(folder)
    const { link, minutes } = await call(sync.server, 'POST', `/api/packs/${sync.id}/link`, { code: authOf(sync) })
    return { ok: true, link, minutes,
      say: `${link}\nOn your phone, in Ting: Quests, then Stories by others, then "Link a pack". Type ${link} (it lasts ${minutes} minutes). Then every version you save shows there, to play before you publish.` }
  },

  /** The pack's latest saved version in Ting Studio: its quests laid into its town's story, playing in a phone beside them. */
  async play(folder) {
    const sync = readSync(folder)
    const site = sync.server.replace(/\/$/, '')
    // (Its code goes after the #: the browser keeps it for this pack and never sends it; drafts are their makers'.)
    const url = `${site}/studio/${sync.id}#code=${sync.code}`
    return { ok: true, url, game: `${site}/play/${sync.id}`,
      say: `${url}\nYour latest saved version in Ting Studio, playing beside it (Chrome, Edge or Safari 26). Changes here show once they're saved; reload to see them.` }
  },

  /**
   * Waits for what the Studio asks of this world (`wait` seconds at most), then takes its latest version and says
   * what to do. The request is kept in .ting/request.json until it's done.
   */
  async studio(folder, { wait = 540 } = {}) {
    // Not in a world's folder: wait for any of the account's worlds, each opened into a folder here as it's asked about.
    if (!fs.existsSync(syncFile(folder))) return studioForAccount(folder, { wait })
    const sync = readSync(folder)
    if (changedHere(folder, sync)) throw new Problem("There are changes here that aren't saved yet: push them (or pull --force), then wait again")
    const until = Date.now() + wait * 1000
    let request = null
    while (!request && Date.now() < until) {
      const left = Math.max(1, Math.ceil((until - Date.now()) / 1000))
      ;({ request } = await call(sync.server, 'GET', `/api/packs/${sync.id}/requests/next?wait=${Math.min(50, left)}`, { code: authOf(sync) }))
    }
    if (!request) return { ok: true, waiting: true, say: 'Nothing asked in the Studio yet. Run studio again to keep waiting.' }
    const info = await call(sync.server, 'GET', `/api/packs/${sync.id}`, { code: authOf(sync) })
    if (info.latest !== sync.version) take(folder, sync, await call(sync.server, 'GET', `/packs/${sync.id}/pack.json?v=${info.latest}`, { code: authOf(sync) }), info.latest)
    fs.writeFileSync(requestFile(folder), JSON.stringify(request, null, 2) + '\n')
    return { ok: true, request, version: info.latest, say: [`The Studio asks (request ${request.id}, on version ${info.latest}): ${ASKS[request.kind](request)}`,
      'Say how it\'s going as you work: progress <0-100> <what you\'re doing>. Save versions as you go (push). When it\'s done: done <one line on what you did>.'].join('\n') }
  },

  /** How the request is going (`pct`, 0 to 100, and a line on what's happening): the Studio shows it. */
  async progress(pct, text, folder = '.') {
    folder = workingIn(folder)
    const sync = readSync(folder), request = readRequest(folder)
    await call(sync.server, 'POST', `/api/requests/${request.id}/progress`, { code: authOf(sync), body: { pct: Number(pct), text } })
    return { ok: true, say: `${pct}%: ${text}` }
  },

  /** The request is done (or `failed`), with a line on what was done. */
  async done(summary, folder = '.', { failed = false } = {}) {
    const root = folder
    folder = workingIn(folder)
    const sync = readSync(folder), request = readRequest(folder)
    if (changedHere(folder, sync)) throw new Problem("There are changes here that aren't saved yet: push them first, so the Studio has them")
    await call(sync.server, 'POST', `/api/requests/${request.id}/done`, { code: authOf(sync), body: failed ? { ok: false, error: summary } : { ok: true, summary } })
    fs.rmSync(requestFile(folder))
    fs.rmSync(currentFile(root), { force: true })
    return { ok: true, say: `Told the Studio: ${failed ? 'it stopped' : 'done'}${summary ? ` (${summary})` : ''}. Run studio to wait for the next request.` }
  },

  /**
   * Connects Claude Code to the person's Ting account: a code to enter in the Studio, signed in. With `wait`, waits
   * (up to 9 minutes) for them to allow it, then keeps the account's token on this computer.
   */
  async login({ server = DEFAULT_SERVER, wait = false } = {}) {
    server = server.replace(/\/$/, '')
    const all = readAccount(), here = all[server] ?? {}
    if (here.token && !wait) return { ok: true, connected: true, say: `Claude Code is connected to your Ting account on ${server}. (logout to disconnect it here)` }
    if (!wait || !here.pending) {
      const started = await call(server, 'POST', '/api/connect', { body: { name: `Claude Code on ${os.hostname().split('.')[0]}` } })
      writeAccount({ ...all, [server]: { ...here, pending: { device: started.device, code: started.code, expires: Date.now() + started.minutes * 60e3 } } })
      if (!wait) return { ok: true, code: started.code, url: `${server}/connect?code=${started.code}`,
        say: `To connect Claude Code to your Ting account, open ${server}/connect?code=${started.code} (signed in), check the code is ${started.code}, and allow it. Then run: login --wait` }
    }
    const pending = readAccount()[server].pending
    const until = Math.min(pending.expires, Date.now() + 540e3)
    while (Date.now() < until) {
      const r = await call(server, 'GET', `/api/connect/poll?device=${pending.device}`)
      if (r.status === 'allowed') {
        const now = readAccount()
        writeAccount({ ...now, [server]: { token: r.token, account: r.account, name: r.name } })
        return { ok: true, connected: true, say: `Connected: Claude Code works on your Ting worlds now, and waits for what you ask in the Studio (studio).` }
      }
      await new Promise(done => setTimeout(done, 3000))
    }
    return { ok: false, say: `It wasn't allowed yet. Open ${server}/connect?code=${pending.code} and allow it, then run login --wait again (or login for a new code).` }
  },

  /** Disconnects Claude Code here (to disconnect it everywhere, use the Studio: your work, Claude Code). */
  async logout({ server = DEFAULT_SERVER } = {}) {
    server = server.replace(/\/$/, '')
    const { [server]: gone, ...rest } = readAccount()
    writeAccount(rest)
    return { ok: true, say: gone ? `Disconnected here. (The Studio still lists it until you disconnect it there.)` : 'It wasn\'t connected here.' }
  },

  async code(folder) {
    const sync = readSync(folder)
    if (!sync.code) throw new Problem('This world was opened with your Ting account: it has no key here (the Studio can make one, in its Settings)')
    return { ok: true, code: sync.code, say: sync.code }
  },
}

module.exports = { commands, Problem }

if (require.main === module) {
  const args = process.argv.slice(2)
  const json = args.includes('--json'), force = args.includes('--force')
  const opt = name => { const i = args.indexOf(name); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v }
  // (A world of your own, and a setting's kit, unless Ting asks for its own story's: `--after`, `--story`. `--own` is the default.)
  const wait = opt('--wait'), folderOpt = opt('--folder')
  const world = opt('--world'), after = opt('--after'), by = opt('--by'), invite = opt('--invite'), title = opt('--title'), map = opt('--map'), story = args.includes('--story')
  const [verb, ...rest] = args.filter(a => !a.startsWith('--'))
  const run = {
    worlds: () => commands.worlds(),
    kit: () => commands.kit(rest[0], rest[1] ?? '.', { own: !story, map }),
    new: () => commands.new(rest[0], { world, after, by, invite, map, title, folder: rest[1] }),
    upload: () => commands.upload(rest[0] ?? '.', { invite }),
    submit: () => commands.submit(rest[0] ?? '.'),
    open: () => commands.open(rest[0], rest[1]),
    check: () => commands.check(rest[0] ?? '.'),
    status: () => commands.status(rest[0] ?? '.'),
    pull: () => commands.pull(rest[0] ?? '.', { force }),
    push: () => commands.push(rest[0] ?? '.'),
    publish: () => commands.publish(rest[0] ?? '.', { original: args.includes('--original') }),
    link: () => commands.link(rest[0] ?? '.'),
    play: () => commands.play(rest[0] ?? '.'),
    code: () => commands.code(rest[0] ?? '.'),
    studio: () => commands.studio(rest[0] ?? '.', { wait: wait ? Number(wait) : undefined }),
    // (`--wait` on its own: `opt` above takes it as studio's `--wait <seconds>`, so it's read from the command line.)
    login: () => commands.login({ wait: process.argv.includes('--wait') }),
    logout: () => commands.logout(),
    progress: () => commands.progress(rest[0], rest.slice(1).join(' '), folderOpt ?? '.'),
    done: () => commands.done(rest.join(' '), folderOpt ?? '.', { failed: args.includes('--failed') }),
  }[verb]
  if (!run) {
    const lines = fs.readFileSync(__filename, 'utf8').split('\n').slice(1)
    console.log(lines.slice(0, lines.findIndex(l => !l.startsWith('//'))).map(l => l.slice(3)).join('\n'))
    process.exitCode = verb ? 1 : 0
  } else {
    run().then(
      r => { const { say, ...data } = r; console.log(json ? JSON.stringify(data, null, 2) : say); process.exitCode = r.ok ? 0 : 1 },
      e => { console.log(json ? JSON.stringify({ ok: false, error: e.message, problems: e.problems }) : `${e.message}${e.problems ? `\n${e.problems.map(p => `  ✗ ${p}`).join('\n')}` : ''}`); process.exitCode = 1 },
    )
  }
}
