export function formatElysiaValidation(error: any): Record<string, string> {
  const fields: Record<string, string> = {}

  if (Array.isArray(error.all)) {
    for (const e of error.all) {
      const field = e.path?.replace('/', '') || 'body'
      fields[field] = e.message
    }
  }

  return fields
}

