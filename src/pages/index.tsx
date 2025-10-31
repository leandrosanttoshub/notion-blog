import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import sharedStyles from '../styles/shared.module.css'

export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <img
          src="/LS.png"
          height="85"
          width="250"
          alt="LS"
        />
        <h1>Leandro Santtos</h1>
        <h2>
          um espaço totalmente livre de gatilhos'{' '}
          <ExtLink
            href="https://github.com/vercel/next.js/issues/9524"
            className="dotted"
            style={{ color: 'inherit' }}
          >
          </ExtLink>
        </h2>

        <Features />

        <div className="explanation">
          <p>
           A ideia de criar esse lugar veio do meu contato com o Bardo Thödol, 
           o livro que cura somente em ser recitado e ouvido. 
           Essa imagem me fez pensar: O que precisa haver num texto para que 
           ele cure só porque está sendo lido? 
          </p>

          <p>
              A real é que acho que os psicólogos se perderam. Que espécie de cura
            você pode oferecer se usa as mesmas apelações que adoeceram a todos?
            Não espere nada chamativo aqui. 
          </p>

          <p>
            Sem gatilhos, sem marketing, sem escassez, aqui vou simplesmente 
            compartilhar meu trabalho e minhas ideias. A diferença: Os textos
            marcados como "problemas" sou eu falando com você; os textos
            marcados como "estudos" e "devocionais" sou eu falando comigo mesmo.
            Use esse espaço como bem 
            quiser.
            
            
            
            
          </p>
        </div>
      </div>
    </>
  )
}
