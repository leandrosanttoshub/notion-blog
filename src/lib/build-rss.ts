// src/lib/build-rss.ts
// Stub compatível para evitar erro de build na Vercel.
// Se quiser gerar RSS depois, substitua este arquivo pela implementação real.

export async function buildRSS() : Promise<void> {
  // noop em produção / build
  return Promise.resolve()
}

// default export opcional
export default buildRSS
