import { supabase } from '../lib/supabase'

export const uploadToSupabase = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  
  const { data, error } = await supabase.storage
    .from('trip-images')
    .upload(fileName, file)

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('trip-images')
    .getPublicUrl(fileName)

  return publicUrl
}