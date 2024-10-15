import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { X } from 'lucide-react'
import { generateClientDropzoneAccept } from 'uploadthing/client'
import { useUploadThing } from '@/utils/uploadthing'

interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ value, onChange, maxFiles = 5 }) => {
  const [isUploading, setIsUploading] = useState(false)
  const { startUpload } = useUploadThing("imageUploader")

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    const filesToUpload = acceptedFiles.slice(0, maxFiles - value.length)
    const uploadedFiles = await startUpload(filesToUpload)
    setIsUploading(false)
    if (uploadedFiles) {
      const newUrls = uploadedFiles.map(file => file.url)
      onChange([...value, ...newUrls].slice(0, maxFiles))
    }
  }, [value, onChange, startUpload, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/jpeg', 'image/png', 'image/gif']),
    maxFiles: maxFiles - value.length,
    disabled: isUploading || value.length >= maxFiles,
    multiple: true, // Explicitly allow multiple file selection
  })

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : isUploading ? (
          <p>Uploading...</p>
        ) : value.length >= maxFiles ? (
          <p>Maximum number of images reached</p>
        ) : (
          <p>Drag 'n' drop some images here, or click to select images</p>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative">
            <Image
              src={url}
              alt={`Uploaded image ${index + 1}`}
              width={100}
              height={100}
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}