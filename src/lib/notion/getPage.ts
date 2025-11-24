// src/lib/notion/getPage.ts
import { notion } from './notion-client'

export async function getPage(id: string) {
  // carrega o recordMap completo da página
  const recordMap = await notion.getPage(id)
  return recordMap
}

export default getPage
