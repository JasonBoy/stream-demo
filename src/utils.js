export async function* getAsyncIterableFor(readableStream) {
  const reader = readableStream.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) return
      yield value
    }
  } finally {
    reader.releaseLock()
  }
}

export function* getSyncIterableFor(obj) {
  const keys = Object.keys(obj)
  let i = 0
  while (i < keys.length) {
    yield obj[keys[i]]
    i++
  }
}
