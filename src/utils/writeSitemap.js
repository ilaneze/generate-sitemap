const fs = require('fs')
const util = require('util')
const appendFileAsync = util.promisify(fs.appendFile)
const unlinkAsync = util.promisify(fs.unlink)

const writeSitemap = async (pages, destination) => {
    if (fs.existsSync(destination)) {
        console.log(`${destination} already exists; deleting...`)
        await unlinkAsync(destination)
        console.log(`deleted ${destination}`)
    }

    pages.forEach(async (page) => {
        console.log(`writing ${page} to sitemap`)
        await appendFileAsync(`${destination}`, `${page}\n`)
    })
}

module.exports = writeSitemap