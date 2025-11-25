// src/lib/fs-helpers.ts
// Compat layer: funciona em dev e não quebra no build da Vercel.

// Declaramos as funções primeiro (vazias):
let readFileImpl: (path: string, enc?: string) => Promise<string>
let writeFileImpl: (path: string, data: string, enc?: string) => Promise<void>

if (process.env.NODE_ENV === 'development') {
  // Em desenvolvimento local, usar fs real
  const fs = require('fs')
  const { promisify } = require('util')

  readFileImpl = async (path: string, enc: string = 'utf8') => {
    return promisify(fs.readFile)(path, enc)
  }

  writeFileImpl = async (path: string, data: string, enc: string = 'utf8') => {
    return promisify(fs.writeFile)(path, data, enc)
  }
} else {
  // Em produção (Vercel): stubs seguros
  readFileImpl = async (_path: string, _enc: string = 'utf8') => {
    return '{}'
  }

  writeFileImpl = async (_path: string, _data: string, _enc: string = 'utf8') => {
    return Promise.resolve()
  }
}

// Exports top-level (obrigatório no isolatedModules)
export const readFile = readFileImpl
export const writeFile = writeFileImpl
