let { DateTime } = require('luxon')
let fs = require('fs')
let nano = require('nanoid')

let json = fs.readFileSync('./old-logs.json')
let logs = JSON.parse(json)
for (let log of logs) {
  let iso_opts = {
    suppressMilliseconds: true,
    suppressSeconds: true,
  }
  log.id = nano(8)
  let start = parseInt(log.start, 16) * 1000
  log.start = DateTime.fromMillis(start).set({ millisecond: 0 }).toISO(iso_opts)
  if (log.end) {
    let end = parseInt(log.end, 16) * 1000
    log.end = DateTime.fromMillis(end).set({ millisecond: 0 }).toISO(iso_opts)
  } else {
    log.end = null
  }
}
fs.writeFileSync('./logs.json', JSON.stringify(logs))