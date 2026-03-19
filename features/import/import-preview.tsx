import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"

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
  const { t } = useTranslation("import")
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
      const result: Record<string, unknown>[] = editedData.map((row, rowIndex) => {
        const obj: Record<string, unknown> = {}
        data.headers.forEach((header, colIndex) => {
          obj[header] = row[colIndex] !== undefined && row[colIndex] !== null ? row[colIndex] : ''
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

  // Create columns for DataTable
  const columns = data.headers.map((header, colIndex) => ({
    accessorKey: `col${colIndex}`,
    header: header,
  }))

  // Prepare data for DataTable with required id field
  const prepareDataForTable = (data: any[][]) => {
    return data.map((row, rowIndex) => ({
      id: `row-${rowIndex}`,
      ...row.reduce((acc, cell, colIndex) => {
        acc[`col${colIndex}`] = cell
        return acc
      }, {} as Record<string, any>)
    }))
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <DataTable
          columns={columns as any}
          data={prepareDataForTable(editedData)}
          pageSize={25}
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          variant="outline"
          onClick={onCancel}
          disabled={isConfirming}
        >
          {t("actions.cancel")}
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={isConfirming || editedData.length === 0}
          className={isConfirming ? "opacity-70" : ""}
        >
          {isConfirming ? t("actions.confirming") : t("actions.confirm")}
        </Button>
      </div>
    </div>
  )
}