import * as yup from 'yup'

export const imageFileSchema = yup
    .mixed<File>()
    .test('fileSize', 'El archivo debe ser menor a 5MB', (value) => {
        return value && value.size <= 5 * 1024 * 1024
    })
    .test('fileType', 'Solo se permiten imágenes (JPG, PNG, WEBP)', (value) => {
        return value && ['image/jpeg', 'image/png', 'image/webp'].includes(value.type)
    })