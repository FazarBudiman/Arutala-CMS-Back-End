import { supabase } from '@api/db/storage'
const {bucket_name} = process.env

export const uploadToStorage = async (file: File, folderName: string) => {
  const filePath = `${folderName}/${crypto.randomUUID()}-${file.name}`

  // 1. Upload file
  const { error: uploadError } = await supabase.storage
    .from(bucket_name!)
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  // 2. Get public URL
  const { data } = supabase.storage
    .from(`${bucket_name}`)
    .getPublicUrl(filePath)

  return data.publicUrl
}
