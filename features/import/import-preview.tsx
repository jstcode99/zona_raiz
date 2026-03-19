import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/app/components/ui/data-table"

interface ImportPreviewProps {
  data: {
    headers: string[]
    rows: any[][]
  }
  onConfirm: (data: Record<string, unknown>[]) => void
  onCancel: () => void
  editable?: boolean
}

export function ImportPreview({ 
  data, 
  onConfirm, 
  onCancel, 
  editable = false 
}: ImportPreviewProps) {
  const [editedData, setEditedData] = useState<any[][]>(data.rows)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleCellChange = (rowIndex: number, colIndex: number, value: any) => {
    setEditedData(prev => {
      const newData = [...prev]
      if (!newData[rowIndex]) newData[rowIndex] = []
      newData[rowIndex][colIndex] = value
      return newData
    })
  }

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      // Convert rows to objects using headers
      const result: Record<string, unknown>[] = editedData.map(row => {
        const obj: Record<string, unknown> = {}
        data.headers.forEach((header, index) => {
          obj[header] = row[index] !== undefined && row[index] !== null ? row[index] : ''
        })
        return obj
      })
      
      onConfirm(result)
    } catch (error) {
      console.error('Error confirming import:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  const columns = data.headers.map((header, index) => ({
    accessorKey: `col${index}`,
    header: header,
    cell: ({ row }: { row: { original: any[] } }) => {
      const value = row.original[index]
      return (
        <div
          contentEditable={editable}
          onBlur={(e) => {
            if (editable) {
              handleCellChange(row.index, index, e.currentTarget.textContent)
            }
          }}
          className={editable ? "border border-gray-300 rounded p-1" : ""}
        >
          {value !== null && value !== undefined ? value : ''}
        </div>
      )
    },
  }))

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={editedData.map((row, index) => ({ 
            original: row,
            index 
          }))}
          pagination={true}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          variant="outline"
          onClick={onCancel}
          disabled={isConfirming}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={isConfirming || editedData.length === 0}
          className={isConfirming ? "opacity-70" : ""}
        >
          {isConfirming ? 'Confirmando...' : 'Confirmar importación'}
        </Button>
      </div>
    </div>
  )
}