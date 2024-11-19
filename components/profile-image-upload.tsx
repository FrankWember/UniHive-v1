"use client"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { X } from 'lucide-react'
import { generateClientDropzoneAccept } from 'uploadthing/client'
import { useUploadThing } from '@/utils/uploadthing'
import { Button } from '@/components/ui/button'

interface ProfileImageUploadProps {
  value: string | null
  onChange: (url: string) => void
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false)
  const { startUpload } = useUploadThing("imageUploader")

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    const uploadedFiles = await startUpload(acceptedFiles)
    setIsUploading(false)
    if (uploadedFiles && uploadedFiles.length > 0) {
      onChange(uploadedFiles[0].url)
    }
  }, [onChange, startUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/jpeg', 'image/png', 'image/gif']),
    maxFiles: 1,
    disabled: isUploading,
  })

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : isUploading ? (
          <p>Uploading...</p>
        ) : (
          <p>Drag 'n' drop an image here, or click to select an image</p>
        )}
      </div>
      {value && (
        <div className="mt-4 relative inline-block">
          <Image
            src={value}
            alt="Profile image"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <Button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            size="icon"
            variant="destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}