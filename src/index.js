const { program } = require('commander')
const scanPages = require('./utils/scanPages')
const writeSitemap = require('./utils/writeSitemap')

program
    .command('create <source> [destination]')
    .option('-s, --source', 'the URL path to serve as base for your sitemap')
    .option('-d, --destination', 'the destination to store the generated sitemap at')
    .action(async (source, destination) => {
        console.log(`Scanning pages for ${source}`)
        const scanStart = Date.now()
        const pages = await scanPages(source)
        const scanEnd = Date.now()
        console.log(`creating sitemap file in ${destination}`)
        const writeStart = Date.now()
        await writeSitemap(pages, destination)
        const writeEnd = Date.now()
        console.log(`created sitemap at: ${destination}/sitemap.txt`)
        console.log(`Scan took ${(scanEnd - scanStart) / 1000}s`)
        console.log(`Sitemap was created in ${(writeEnd - writeStart) / 1000}s`)
    })
program.parse(process.argv)
