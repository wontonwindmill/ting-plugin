#!/usr/bin/env node
// The pack client: a pack's folder kept in step with the Ting pack service, with no git. It needs nothing but
// Node (18 or later), so it ships on its own in the Claude Code plugin to people who don't have our code. A pack's
// folder holds the pack (pack.json), the world's kit (kit/: what to read to write for it) and, in .ting/, the
// service, the pack's code, the version last in step, and the last check and script.
//
//   ting-pack worlds                         the worlds a pack can be written for
//   ting-pack kit <world> [folder]           the world's kit into a folder, to plan before there's a pack
//   ting-pack new <id> --world <w> --after <quest> [--by <name>] [--invite <code>] [folder]   a new pack: its code
//   ting-pack open <code> [folder]           the pack a code opens, into a folder (here if it's empty, else ./<id>)
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
//   add --json for one JSON object; the service is TING_SERVER (https://studio.tinglanguage.com) unless the folder says
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

const DEFAULT_SERVER = process.env.TING_SERVER ?? 'https://studio.tinglanguage.com'
const syncFile = folder => path.join(folder, '.ting', 'sync.json')
const packFile = folder => path.join(folder, 'pack.json')
const hash = text => crypto.createHash('sha256').update(text).digest('hex')
/** The pack as it's written to a folder: what the hash in sync.json is of. */
const asText = pack => JSON.stringify(pack, null, 2) + '\n'

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
/** The world's kit, written into the folder's kit/ (replacing what was there: it's the service's, not yours). */
async function writeKit(server, world, folder) {
  const { files } = await call(server, 'GET', `/api/worlds/${encodeURIComponent(world)}/kit`)
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
/** A check, in short, for people. */
const said = check => (check.ok ? 'Ready to play.' : `Not ready: ${check.problems.length} problem${check.problems.length === 1 ? '' : 's'}`)
const listed = check => [said(check), ...check.problems.map(p => `  ✗ ${p}`), ...(check.notes ?? []).map(n => `  · ${n}`),
  ...(check.guessing ?? []).map(g => `  ${g.ok ? '·' : '✗'} ${g.quest}: ${g.reached === false ? "can't be reached" : `guessing at random does well ${g.topPercent}% of the time (under 20%)`}`)].join('\n')

const commands = {
  async worlds({ server = DEFAULT_SERVER } = {}) {
    const worlds = await call(server, 'GET', '/api/worlds')
    return { ok: true, worlds, say: worlds.map(w => `${w.id}: ${w.name}, ${w.language}`).join('\n') }
  },

  async kit(world, folder = '.', { server = DEFAULT_SERVER } = {}) {
    if (!world) {
      const sync = readSync(folder)
      world = readPack(folder).pack.world
      server = sync.server
    }
    const n = await writeKit(server, world, folder)
    return { ok: true, world, files: n, say: `Wrote the kit for ${world} into ${path.join(folder, 'kit')} (${n} files; start with kit/README.md)` }
  },

  async new(id, { world, after, by, invite, folder, server = DEFAULT_SERVER } = {}) {
    if (!id || !world || !after) throw new Problem('Usage: new <id> --world <world> --after <quest id> [--invite <code>] [--by <name, as credited>] [folder]')
    folder = folderFor(folder, id)
    if (fs.existsSync(packFile(folder))) throw new Problem(`${folder} already has a pack.json: start the new pack in another folder`)
    const made = await call(server, 'POST', '/api/packs/new', { body: { id, world, after, by, invite } })
    const pack = await call(server, 'GET', `/packs/${made.id}/pack.json?v=${made.version}`)
    take(folder, { server, id: made.id, code: made.key }, pack, made.version)
    const files = await writeKit(server, world, folder)
    return { ok: true, id: made.id, code: made.key, folder, version: made.version, kit: files,
      say: `Started ${made.id} in ${folder}, with the kit for ${world} in ${path.join(folder, 'kit')}.\nIts code is ${made.key}: it opens the pack anywhere, and anyone with it can change it, so keep it to yourself.` }
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
    if (!code) throw new Problem('Open which pack? Give its code (ting-XXXX-…)')
    const { id } = await call(server, 'GET', '/api/open', { code })
    folder = folderFor(folder, id)
    if (fs.existsSync(syncFile(folder))) {
      const sync = readSync(folder)
      if (sync.id !== id) throw new Problem(`${folder} holds ${sync.id}, not ${id}: open it into another folder`)
      if (changedHere(folder, sync)) throw new Problem(`${folder} has changes that aren't on the service: push them, or pull --force`)
    } else if (fs.existsSync(packFile(folder))) throw new Problem(`${folder} already has a pack.json: open it into another folder`)
    const info = await call(server, 'GET', `/api/packs/${id}`)
    const pack = await call(server, 'GET', `/packs/${id}/pack.json?v=${info.latest}`)
    take(folder, { server, id, code }, pack, info.latest)
    const files = kit ? await writeKit(server, pack.world, folder) : 0
    return { ok: true, id, folder, version: info.latest, title: pack.title, world: pack.world, kit: files,
      say: `Opened ${pack.title} (${id}, version ${info.latest}) into ${folder}${files ? `, with the kit for ${pack.world} in ${path.join(folder, 'kit')}` : ''}` }
  },

  /** What's here, checked and scripted by the service, without saving a version. */
  async check(folder) {
    const sync = readSync(folder)
    const { pack } = readPack(folder)
    const tried = await call(sync.server, 'POST', `/api/packs/${sync.id}/check`, { code: sync.code, body: { pack } })
    fs.mkdirSync(path.join(folder, '.ting'), { recursive: true })
    fs.writeFileSync(path.join(folder, '.ting', 'script.md'), tried.script)
    fs.writeFileSync(path.join(folder, '.ting', 'check.json'), JSON.stringify(tried.check, null, 2) + '\n')
    return { ok: tried.check.ok, check: tried.check, script: path.join(folder, '.ting', 'script.md'),
      say: `${listed(tried.check)}\nThe pack as it plays: ${path.join(folder, '.ting', 'script.md')}` }
  },

  async status(folder) {
    const sync = readSync(folder)
    const info = await call(sync.server, 'GET', `/api/packs/${sync.id}`)
    const check = await call(sync.server, 'GET', `/api/packs/${sync.id}/check?v=${info.latest}`)
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
    const info = await call(sync.server, 'GET', `/api/packs/${sync.id}`)
    let kept
    if (changedHere(folder, sync)) {
      if (!force) throw new Problem(`${folder} has changes that aren't on the service: push them first, or pull --force (which keeps yours as pack.mine.json)`)
      kept = path.join(folder, 'pack.mine.json')
      fs.copyFileSync(packFile(folder), kept)
    }
    if (info.latest === sync.version && !kept) return { ok: true, version: sync.version, say: `Already in step (version ${sync.version})` }
    const pack = await call(sync.server, 'GET', `/packs/${sync.id}/pack.json?v=${info.latest}`)
    take(folder, sync, pack, info.latest)
    return { ok: true, version: info.latest, kept, say: `Pulled version ${info.latest}${kept ? `; your changes are in ${kept}` : ''}` }
  },

  async push(folder) {
    const sync = readSync(folder)
    const { pack, text } = readPack(folder)
    if (!changedHere(folder, sync)) return { ok: true, version: sync.version, unchanged: true, say: `Nothing to push: version ${sync.version} is what's here` }
    const saved = await call(sync.server, 'PUT', `/api/packs/${sync.id}`, { code: sync.code, body: { pack, base: sync.version } })
    writeSync(folder, { ...sync, version: saved.version, hash: hash(text) })
    return { ok: saved.check.ok, version: saved.version, check: saved.check, say: `Saved version ${saved.version}. ${listed(saved.check)}` }
  },

  /** Sends the latest saved version for review: Ting publishes it once it's approved (and records its lines). */
  async submit(folder) {
    const sync = readSync(folder)
    if (changedHere(folder, sync)) throw new Problem("There are changes here that aren't saved yet: push them first")
    const done = await call(sync.server, 'POST', `/api/packs/${sync.id}/submit`, { code: sync.code })
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
    const { link, minutes } = await call(sync.server, 'POST', `/api/packs/${sync.id}/link`, { code: sync.code })
    return { ok: true, link, minutes,
      say: `${link}\nOn your phone, in Ting: Quests, then Stories by others, then "Link a pack". Type ${link} (it lasts ${minutes} minutes). Then every version you save shows there, to play before you publish.` }
  },

  /** The pack's latest saved version in Ting Studio: its quests laid into its town's story, playing in a phone beside them. */
  async play(folder) {
    const sync = readSync(folder)
    const site = sync.server.replace(/\/$/, '')
    const url = `${site}/studio/${sync.id}`
    return { ok: true, url, game: `${site}/play/${sync.id}`,
      say: `${url}\nYour latest saved version in Ting Studio, playing beside it (Chrome, Edge or Safari 26). Changes here show once they're saved; reload to see them.` }
  },

  async code(folder) {
    const sync = readSync(folder)
    return { ok: true, code: sync.code, say: sync.code }
  },
}

module.exports = { commands, Problem }

if (require.main === module) {
  const args = process.argv.slice(2)
  const json = args.includes('--json'), force = args.includes('--force')
  const opt = name => { const i = args.indexOf(name); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v }
  const world = opt('--world'), after = opt('--after'), by = opt('--by'), invite = opt('--invite')
  const [verb, ...rest] = args.filter(a => !a.startsWith('--'))
  const run = {
    worlds: () => commands.worlds(),
    kit: () => commands.kit(rest[0], rest[1] ?? '.'),
    new: () => commands.new(rest[0], { world, after, by, invite, folder: rest[1] }),
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
