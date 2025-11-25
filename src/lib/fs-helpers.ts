// src/lib/fs-helpers.ts
// Compat layer: usa fs no modo development (node), e stubs seguros em produção/build.
// Isso permite que o OLD_getBlogIndex continue a funcionar sem quebrar o build na Vercel.

const IS_DEV = process.env.NODE_ENV === 'development'

if (IS_DEV) {
  // Em desenvolvimento, usar o fs real para que caches/arquivos locais funcionem.
  // tslint:disable-next-line:no-var-requires
  const fs = require('fs')
  const { promisify } = require('util')
  export const readFile = promisify(fs.readFile)
  export const writeFile = promisify(fs.writeFile)
} else {
  // Em build/produção na Vercel, não executamos IO no servidor build-time.
  // Retornamos stubs simples que fazem o OLD_getBlogIndex seguir o fluxo normal
  // (i.e., quando o cache não existe, o código vai buscar os dados remotos).
  export const readFile = async (_path: string, _enc: string = 'utf8'): Promise<string> => {
    return '{}'
  }

  export const writeFile = async (_path: string, _data: string, _enc: string = 'utf8'): Promise<void> => {
    // noop
    return Promise.resolve()
  }
}
