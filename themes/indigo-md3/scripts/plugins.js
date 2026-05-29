const { version, name } = require('../package.json')
const lodash = require('lodash')

hexo.extend.filter.register('template_locals', locals => {
    locals._ = lodash
    return locals
})

hexo.extend.helper.register('theme_version', () => version)

const schemes = {
    indigo: {
        light: {
            primary: '#4F52B2',
            on_primary: '#FFFFFF',
            primary_container: '#E2DFFF',
            on_primary_container: '#0B0067',
            secondary: '#5B5D72',
            on_secondary: '#FFFFFF',
            secondary_container: '#E0E1F9',
            on_secondary_container: '#171A2C'
        },
        dark: {
            primary: '#BEC2FF',
            on_primary: '#1B1F83',
            primary_container: '#363999',
            on_primary_container: '#E2DFFF',
            secondary: '#C4C5DD',
            on_secondary: '#2D2F42',
            secondary_container: '#434559',
            on_secondary_container: '#E0E1F9'
        }
    },
    emerald: {
        light: {
            primary: '#006C47',
            on_primary: '#FFFFFF',
            primary_container: '#8DF8C1',
            on_primary_container: '#002112',
            secondary: '#4D6356',
            on_secondary: '#FFFFFF',
            secondary_container: '#CFE9D7',
            on_secondary_container: '#0A1F15'
        },
        dark: {
            primary: '#71DBA6',
            on_primary: '#003822',
            primary_container: '#005234',
            on_primary_container: '#8DF8C1',
            secondary: '#B3CCBC',
            on_secondary: '#1F3529',
            secondary_container: '#354B3E',
            on_secondary_container: '#CFE9D7'
        }
    },
    terracotta: {
        light: {
            primary: '#B32A14',
            on_primary: '#FFFFFF',
            primary_container: '#FFDAD4',
            on_primary_container: '#410001',
            secondary: '#775651',
            on_secondary: '#FFFFFF',
            secondary_container: '#FFDAD5',
            on_secondary_container: '#2C1512'
        },
        dark: {
            primary: '#FFB4A7',
            on_primary: '#680000',
            primary_container: '#901100',
            on_primary_container: '#FFDAD4',
            secondary: '#E7BDB6',
            on_secondary: '#442925',
            secondary_container: '#5D3F3B',
            on_secondary_container: '#FFDAD5'
        }
    },
    amber: {
        light: {
            primary: '#7E5700',
            on_primary: '#FFFFFF',
            primary_container: '#FFDEA2',
            on_primary_container: '#281900',
            secondary: '#6C5D40',
            on_secondary: '#FFFFFF',
            secondary_container: '#F5E0BB',
            on_secondary_container: '#241A05'
        },
        dark: {
            primary: '#FCBB47',
            on_primary: '#432C00',
            primary_container: '#604100',
            on_primary_container: '#FFDEA2',
            secondary: '#D8C4A0',
            on_secondary: '#3B2F17',
            secondary_container: '#53462B',
            on_secondary_container: '#F5E0BB'
        }
    },
    ocean: {
        light: {
            primary: '#006399',
            on_primary: '#FFFFFF',
            primary_container: '#CDE5FF',
            on_primary_container: '#001D32',
            secondary: '#51606F',
            on_secondary: '#FFFFFF',
            secondary_container: '#D5E4F6',
            on_secondary_container: '#0E1D2A'
        },
        dark: {
            primary: '#93CCFF',
            on_primary: '#003353',
            primary_container: '#004B75',
            on_primary_container: '#CDE5FF',
            secondary: '#B9C8DA',
            on_secondary: '#233240',
            secondary_container: '#394857',
            on_secondary_container: '#D5E4F6'
        }
    },
    rose: {
        light: {
            primary: '#9B4061',
            on_primary: '#FFFFFF',
            primary_container: '#FFD9E2',
            on_primary_container: '#3E001E',
            secondary: '#745660',
            on_secondary: '#FFFFFF',
            secondary_container: '#FFD9E4',
            on_secondary_container: '#2B151D'
        },
        dark: {
            primary: '#FFB1C7',
            on_primary: '#5F1133',
            primary_container: '#7D2949',
            on_primary_container: '#FFD9E2',
            secondary: '#E2BDC8',
            on_secondary: '#422932',
            secondary_container: '#5B3F49',
            on_secondary_container: '#FFD9E4'
        }
    }
}

hexo.extend.helper.register('theme_colors', () => {
    const config = hexo.theme.config.theme_color || {}
    const schemeName = config.scheme || 'indigo'
    let schemeColors = schemes[schemeName]
    
    if (schemeName === 'custom' && config.custom) {
        schemeColors = {
            light: {
                primary: config.custom.light.primary,
                on_primary: config.custom.light.on_primary,
                primary_container: config.custom.light.primary_container,
                on_primary_container: config.custom.light.on_primary_container,
                secondary: config.custom.light.secondary || config.custom.light.primary,
                on_secondary: config.custom.light.on_secondary || config.custom.light.on_primary,
                secondary_container: config.custom.light.secondary_container || config.custom.light.primary_container,
                on_secondary_container: config.custom.light.on_secondary_container || config.custom.light.on_primary_container
            },
            dark: {
                primary: config.custom.dark.primary,
                on_primary: config.custom.dark.on_primary,
                primary_container: config.custom.dark.primary_container,
                on_primary_container: config.custom.dark.on_primary_container,
                secondary: config.custom.dark.secondary || config.custom.dark.primary,
                on_secondary: config.custom.dark.on_secondary || config.custom.dark.on_primary,
                secondary_container: config.custom.dark.secondary_container || config.custom.dark.primary_container,
                on_secondary_container: config.custom.dark.on_secondary_container || config.custom.dark.on_primary_container
            }
        }
    }
    
    if (!schemeColors) {
        schemeColors = schemes.indigo
    }
    
    return schemeColors
})

const source = (path, cache, ext) => {
    if (cache) {
        if (hexo.theme.config.cdn) {
            const minFile = `${path}${ext === '.js' ? '.min' : ''}${ext}`
            return `//unpkg.com/${name}@latest${minFile}`
        }
        return `${path}${ext}?v=${version}`
    } else {
        return path + ext
    }
}
hexo.extend.helper.register('theme_js', (path, cache) => source(path, cache, '.js'))
hexo.extend.helper.register('theme_css', (path, cache) => source(path, cache, '.css'))

function renderImage(src, alt = '', title = '') {
    return `<figure class="image-bubble">
                <div class="img-lightbox">
                    <div class="overlay"></div>
                    <img src="${src}" alt="${alt}" title="${title}">
                </div>
                <figcaption class="image-caption">${title || alt}</figcaption>
            </figure>`
}

hexo.extend.tag.register('image', ([src, alt = '', title = '']) => {
    return hexo.theme.config.lightbox !== false ? renderImage(src, alt, title) : `<img src="${src}" alt="${alt}" title="${title}">`
})

hexo.extend.filter.register('before_post_render', data => {
    if (hexo.theme.config.lightbox !== false) {
        data.content = data.content.replace(/<escape>.*\!\[(.*)\]\((.+)\).*<\/escape>|([^`]\s*|^)\!\[(.*)\]\((.+)\)([^`]|$)/gm, match => {
            // Ignore images in code blocks
            if (/<escape>[\s\S]*<\/escape>|.?\s{3,}/.test(match)) {
                return match
            }

            return match.replace(/\!\[(.*)\]\((.+)\)/, (img, alt, src) => {
                const attrs = src.split(' ')
                const title = (attrs[1] && attrs[1].replace(/\"|\'/g, '')) || ''
                return `{% image ${attrs[0]} '${alt}' '${title}' %}`
            })
        })
    }
    return data
})
