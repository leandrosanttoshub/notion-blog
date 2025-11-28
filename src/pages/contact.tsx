import Header from '../components/header'
import ExtLink from '../components/ext-link'

import sharedStyles from '../styles/shared.module.css'
import contactStyles from '../styles/contact.module.css'

import Twitter from '../components/svgs/twitter'
import Envelope from '../components/svgs/envelope'
import Youtube from '../components/svgs/youtube'
import Telegram from '../components/svgs/telegram'


const contacts = [
  {
    Comp: Twitter,
    alt: 'twitter icon',
    link: 'https://twitter.com/lelosanttos',
  },
  {
 Comp: Youtube,
    alt: 'youtube icon',
    link: 'https://www.youtube.com/@escoladesaberestradicionai4542',
  },
  {
    Comp: Telegram,
    alt: 'telegram icon',
    link: 'https://t.me/clubecarvalho',
  },
  {
    Comp: Envelope,
    alt: 'email icon',
    link: 'mailto:psi.leandrosanttos@gmail.com',
  },
]
  

export default function Contact() {
  return (
    <>
      <Header titlePre="Contact" />
      <div className={sharedStyles.layout}>
        <div className={contactStyles.avatar}>
          <img src="/avatar.png" alt="avatar with letters JJ" height={60} />
        </div>

        <h1 style={{ marginTop: 0 }}>Minhas redes</h1>

        <div className={contactStyles.name}>
          Aproveite principalmente meu Youtube{' '}
        </div>

        <div className={contactStyles.links}>
          {contacts.map(({ Comp, link, alt }) => {
            return (
              <ExtLink key={link} href={link} aria-label={alt}>
                <Comp height={32} />
              </ExtLink>
            )
          })}
        </div>
      </div>
    </>
  )
}
