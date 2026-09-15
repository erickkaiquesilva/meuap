import { apiClient } from '@/core/api/client'

export interface PresignPhotoResult {
  uploadUrl: string
  publicUrl: string
  photoId: string
}

/** Presign + PUT (pula PUT quando a API devolve mock-upload local sem R2). */
export async function uploadListingPhoto(
  listingId: string,
  file: File,
  sortOrder = 0,
): Promise<PresignPhotoResult> {
  const { data } = await apiClient.post<PresignPhotoResult>(
    `/api/me/listings/${listingId}/photos/presign`,
    { contentType: file.type, sortOrder },
  )

  if (!data.uploadUrl.includes('mock-upload.local')) {
    const res = await fetch(data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    })
    if (!res.ok) {
      throw new Error('Falha no upload da foto')
    }
  }

  return data
}
