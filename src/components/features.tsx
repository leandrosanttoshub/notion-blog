import Psicologia from './icons/Psicologia'
import VidaEspiritual from './icons/VidaEspiritual'
import Simbolismo from './icons/Simbolismo'
import Escolastica from './icons/Escolastica'
import FilosofiaIndiana from './icons/FilosofiaIndiana'
import Alquimia from './icons/Alquimia'
import Astrologia from './icons/Astrologia'
import Cristianismo from './icons/Cristianismo'

const features = [
  { text: 'Psicologia Tradicional', icon: Psicologia },
  { text: 'Escolástica', icon: Escolastica },
  { text: 'Simbolismo', icon: Simbolismo },
  { text: 'Astrologia', icon: Astrologia },

  { text: 'Vida Espiritual', icon: VidaEspiritual },
  { text: 'Filosofia Indiana', icon: FilosofiaIndiana },
  { text: 'Alquimia', icon: Alquimia },
  { text: 'Cristianismo', icon: Cristianismo },
];

const Features = () => (
  <div className="features">
    {features.map(({ text, icon: Icon }) => (
      <div className="feature" key={text} tabIndex={0}>
        {Icon && <Icon />}
        <h4>{text}</h4>
      </div>
    ))}
  </div>
)

export default Features
