import { useEffect } from 'react'

/**
 * PageMeta — sets per-page OG/Twitter meta tags via DOM manipulation.
 * Each page imports this with its own title, description, and path.
 * OBS: page-specific meta. DER: standard Open Graph protocol.
 */
interface PageMetaProps {
  title: string
  description: string
  path: string
  image?: string
}

export function PageMeta({ title, description, path, image }: PageMetaProps) {
  const siteName = 'Arif Fazil'
  const baseUrl = 'https://arif-fazil.com'
  // F2: the per-page derivation used to build `/og-<path>.svg` — no such files exist, so every
  // sub-page share card resolved to 404. Fall back to the one asset that is actually published.
  // Social crawlers do not render SVG either, so the fallback is the PNG (1200x630).
  const ogImage = image || `${baseUrl}/og-identity.png`
  const fullTitle = path === '/' ? title : `${title} — ${siteName}`

  useEffect(() => {
    document.title = fullTitle

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`) as HTMLMetaElement
      if (!el) {
        el = document.createElement('meta')
        if (property.startsWith('og:')) {
          el.setAttribute('property', property)
        } else {
          el.setAttribute('name', property)
        }
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('og:title', fullTitle)
    setMeta('og:description', description)
    setMeta('og:url', `${baseUrl}${path}`)
    setMeta('og:image', ogImage)
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    // Set canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `${baseUrl}${path}`)
  }, [fullTitle, description, path, ogImage])

  return null
}

export default PageMeta
