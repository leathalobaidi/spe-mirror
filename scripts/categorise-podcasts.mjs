import { readFileSync } from 'fs'

const pods = JSON.parse(readFileSync('src/data/podcasts.json', 'utf8'))
const patterns = {}

pods.forEach(p => {
  let pattern
  if (p.title.startsWith('Interview with')) pattern = 'Interview with [Name]'
  else if (p.title.startsWith('Podcast:')) pattern = 'Podcast: ...'
  else if (p.title.startsWith('Watch ')) pattern = 'Watch [Name] ...'
  else if (p.title.startsWith('Speaker Series:')) pattern = 'Speaker Series: ...'
  else if (p.title.includes('Conference Report') || p.title.includes('conference report')) pattern = 'Conference Report'
  else if (p.title.includes('Annual Dinner') || p.title.includes('annual dinner')) pattern = 'Annual Dinner'
  else if (p.title.includes('OBR')) pattern = 'OBR Briefing'
  else if (p.title.startsWith('Webinar:') || p.title.startsWith('Evening meeting:')) pattern = 'Event recording'
  else if (p.title.startsWith('SPE ')) pattern = 'SPE Event'
  else pattern = 'Other'

  if (!patterns[pattern]) patterns[pattern] = []
  patterns[pattern].push({ title: p.title, slug: p.slug, speakers: p.speakers, date: p.date })
})

Object.entries(patterns).forEach(([pat, items]) => {
  console.log(`\n=== ${pat} (${items.length}) ===`)
  items.forEach(i => console.log(`  ${i.title} | ${(i.speakers || []).join(', ')} | ${i.date}`))
})
