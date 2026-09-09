import { readFile, mkdir, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const statusUrl = 'https://raw.githubusercontent.com/daeuniverse/repo-for-linux/status/README.md'

function packageRows(readme) {
  const table = readme.match(/<!-- BEGIN GENERATED PACKAGE TABLE -->\s*([\s\S]*?)\s*<!-- END GENERATED PACKAGE TABLE -->/)
  if (!table) throw new Error('README package table markers are missing')
  const lines = table[1].trim().split('\n')
  if (lines[0] !== '| Software | Version | Project | License |' || !/^\|(?:\s*---\s*\|){4}$/.test(lines[1])) {
    throw new Error('Unexpected README package table format')
  }
  const rows = lines.slice(2).map(row => row.split('|').slice(1, -1).map(cell => cell.trim()))
  if (!rows.length || rows.some(row => row.length !== 4 || row.some(cell => !cell))) {
    throw new Error('Package table contains missing or malformed rows')
  }
  if (new Set(rows.map(row => row[0])).size !== rows.length) throw new Error('Duplicate package names')
  return rows
}

async function loadStatusReadme(attempts = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(statusUrl, { signal: AbortSignal.timeout(30000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.text()
    } catch (error) {
      // Every documentation build reads the versions from this branch, so a
      // transient network failure must not fail an otherwise valid build.
      if (attempt === attempts) throw new Error(`Cannot load status package versions: ${error.message}`)
      console.warn(`Retrying the status package versions after ${error.message}`)
      await new Promise(resolve => setTimeout(resolve, attempt * 2000))
    }
  }
}

const rows = packageRows(await readFile(new URL('README.md', root), 'utf8'))
if (rows.some(row => row[1] === 'N/A')) {
  let statusReadme
  if (process.env.DOCS_STATUS_README) {
    statusReadme = await readFile(process.env.DOCS_STATUS_README, 'utf8')
  } else {
    statusReadme = await loadStatusReadme()
  }
  const versions = new Map(packageRows(statusReadme).map(([name, version]) => [name, version]))
  for (const row of rows) {
    if (row[1] !== 'N/A') continue
    const version = versions.get(row[0])
    if (!version || version === 'N/A') {
      // The repository build reaches this when a package failed to build this round.
      // Publishing the site with N/A beats holding back the whole deployment.
      if (process.env.DOCS_ALLOW_MISSING_VERSIONS !== 'true') {
        throw new Error(`Missing status version for ${row[0]}`)
      }
      console.warn(`Keeping N/A for ${row[0]}: no version in the repository build or the status table`)
      continue
    }
    row[1] = version
  }
  console.log('Filled missing package versions from the upstream status table')
}

const directory = new URL('docs/.vitepress/generated/', root)
await mkdir(directory, { recursive: true })
await writeFile(new URL('package-rows.md', directory), rows.map(row => `| ${row.join(' | ')} |`).join('\n') + '\n')
// The same rows as an object, so a page can name one version in a sentence
// instead of including the whole table. A package the build could not resolve
// is absent rather than 'N/A', so a consumer renders nothing for it.
const versions = Object.fromEntries(rows.filter(row => row[1] !== 'N/A').map(row => [row[0], row[1]]))
await writeFile(new URL('versions.json', directory), JSON.stringify(versions, null, 2) + '\n')
console.log(`Prepared ${rows.length} package rows shared by all documentation locales`)
