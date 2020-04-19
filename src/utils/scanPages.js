require('es6-promise').polyfill();
require('isomorphic-fetch')

const hrefRegex = new RegExp(/<a\s+(?:[^>]*?\s+)?href=([\"'])(.*?)\1/gm)
const relativeUrlRegex = new RegExp(/^\/.*/)
const baseUrlRegex = new RegExp(/^((\w+:)?\/\/[^\/]+\/?).*$/)

const scanPages = async (basePath, hops = 3) => {
    const baseUrl = basePath.replace(baseUrlRegex,'$1')
    const results = await scanPagesInternal(basePath, { maxHops: hops, baseUrl  })
    const pages = Array.from(results.values())
    return pages
}

const scanPagesInternal = async (path, options, results = new Set(), hops = 0) => {
    const localUrl = options.baseUrl
    if (!localUrl) return results
    const maxHops = options.maxHops || 3

    if (hops > maxHops) return results
    
    const response = await fetch(path)
    const text = await response.text()
    let regexResults = hrefRegex.exec(text)

    if (!regexResults) {
        return results
    }

    while (regexResults) {
        const url = regexResults[2]
        const isRelative = relativeUrlRegex.test(url)
        const absUrl = isRelative ? `${localUrl}${url}` : url
        if (!results.has(absUrl)) {
            results.add(absUrl)
            const baseUrl = url.replace(baseUrlRegex,'$1')
            const internal = isRelative || baseUrl.includes(localUrl)
            if (internal) {
                await scanPagesInternal(absUrl, options, results, hops + 1)
            }
        }
        regexResults = hrefRegex.exec(text)
    }
    return results
}

module.exports = scanPages