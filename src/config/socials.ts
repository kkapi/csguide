export interface SocialLink {
  name: string
  url: string
  icon: string
  width: number
}

const base = import.meta.env.BASE_URL

export const socialLinks: SocialLink[] = [
  { name: 'FACEIT',     url: 'https://www.faceit.com',                icon: `${base}icons/faceit.svg`,     width: 90 },
  { name: 'Cybershoke', url: 'https://cybershoke.net',                icon: `${base}icons/cybershoke.svg`, width: 60 },
  { name: 'HLTV',       url: 'https://www.hltv.org',                  icon: `${base}icons/hltv.png`,       width: 70 },
  { name: 'CS.Money',   url: 'https://cs.money',                      icon: `${base}icons/csmoney.png`,    width: 100 },
  { name: 'Steam',      url: 'https://store.steampowered.com/', icon: `${base}icons/steam.png`,     width: 80 },
]
