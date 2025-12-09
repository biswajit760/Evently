'use client'

import { useCallback, Dispatch, SetStateAction } from 'react'
import { useDropzone, type FileWithPath } from 'react-dropzone'
import { generateClientDropzoneAccept } from 'uploadthing/client'
import { convertFileToUrl } from '@/lib/utils'
import { UploadCloud } from "lucide-react"

type FileUploaderProps = {
  onFieldChange: (url: string) => void
  imageUrl: string
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles)
    onFieldChange(convertFileToUrl(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/*']),
  })

  return (
    <div
      {...getRootProps()}
      className={`
        flex items-center justify-center w-full h-64 rounded-lg border-2 border-dashed 
        transition-colors duration-200 ease-in-out cursor-pointer overflow-hidden
        ${isDragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
        }
      `}
    >
      <input {...getInputProps()} />

      {imageUrl ? (
        <div className="relative w-full h-full group">
           <img
            src={imageUrl}
            alt="Upload preview"
            className="w-full h-full object-cover object-center"
          />
          {/* Hover Overlay to show you can change it */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <p className="text-white font-medium text-sm">Click to change image</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <div className="mb-3 p-3 rounded-full bg-indigo-50 text-indigo-600">
             <UploadCloud className="w-6 h-6" />
          </div>
          <p className="mb-1 text-sm text-slate-700 font-medium">
            <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">
            SVG, PNG, JPG (max. 800x400px)
          </p>
        </div>
      )}
    </div>
  )
}