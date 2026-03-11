import { readFileSync } from 'fs'

const files = ['articles','evening-talks','podcasts','news','ryb-essays','dinner-reviews','book-reviews']
for (const f of files) {
  const data = JSON.parse(readFileSync(`src/data/${f}.json`, 'utf8'))
  const untagged = data.filter(d => !d.topics || d.topics.length === 0)
  if (untagged.length) {
    console.log(`--- ${f} (${untagged.length} untagged) ---`)
    for (const u of untagged.slice(0, 4)) {
      console.log(`  ${(u.title || '').slice(0,90)}`)
    }
    if (untagged.length > 4) console.log(`  ... and ${untagged.length - 4} more`)
  }
}
