import { getFilesFromPath } from 'web3.storage'

async function getFiles(path: string) : Promise<File[]> {
  const files = await getFilesFromPath(path)
  // TODO: remove this before production
  console.log(`read ${files.length} file(s) from ${path}`)
  return files
}

export { getFiles }