import { UploadStatus } from "./upload-state.enums"

export interface UploadState {
  status: UploadStatus
  progress: number
  files: File[]
  error?: string
}