import { readFileSync } from 'fs'

const files = ['articles','evening-talks','podcasts','news']
for (const f of files) {
  const data = JSON.parse(readFileSync(`src/data/${f}.json`, 'utf8'))
  const untagged = data.filter(d => !d.topics || d.topics.length === 0)
  if (untagged.length === 0) continue
  console.log(`\n=== ${f} (${untagged.length} untagged) ===`)
  for (const u of untagged.slice(0, 5)) {
    const body = (u.body || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').slice(0, 120)
    console.log(`--- ${(u.title || '').slice(0, 70)}`)
    console.log(`    ${body}`)
  }
}
