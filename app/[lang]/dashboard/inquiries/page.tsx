import { inquiryModule } from "@/application/modules/inquiry.module"
import InquiryTable from "@/features/inquiries/inquiry-table"
import { inquirySourceLabels, inquiryStatusLabels } from "@/domain/entities/inquiry.entity"

interface PageProps {
  params: { lang: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function InquiriesPage({ params, searchParams }: PageProps) {
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined
  const source = typeof searchParams.source === 'string' ? searchParams.source : undefined
  const start_date = typeof searchParams.start_date === 'string' ? searchParams.start_date : undefined
  const end_date = typeof searchParams.end_date === 'string' ? searchParams.end_date : undefined

  const filters: any = {}
  if (status) filters.status = status
  if (source) filters.source = source
  if (start_date) filters.start_date = start_date
  if (end_date) filters.end_date = end_date

  const { inquiryService } = await inquiryModule()
  const inquiries = inquiryService.all(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Consultas</h1>
        <p className="text-muted-foreground">Gestiona las consultas recibidas de tus propiedades.</p>
      </div>

      <form method="get" className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="text-sm font-medium">Estado</label>
          <select name="status" id="status" defaultValue={status} className="border border-input bg-background px-3 py-2 rounded-md text-sm">
            <option value="">Todos</option>
            {Object.entries(inquiryStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="source" className="text-sm font-medium">Fuente</label>
          <select name="source" id="source" defaultValue={source} className="border border-input bg-background px-3 py-2 rounded-md text-sm">
            <option value="">Todas</option>
            {Object.entries(inquirySourceLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="start_date" className="text-sm font-medium">Desde</label>
          <input type="date" name="start_date" id="start_date" defaultValue={start_date} className="border border-input bg-background px-3 py-2 rounded-md text-sm" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="end_date" className="text-sm font-medium">Hasta</label>
          <input type="date" name="end_date" id="end_date" defaultValue={end_date} className="border border-input bg-background px-3 py-2 rounded-md text-sm" />
        </div>

        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">Filtrar</button>
        { (status || source || start_date || end_date) && (
          <a href={`/${params.lang}/dashboard/inquiries`} className="px-4 py-2 border rounded-md text-sm font-medium">Limpiar</a>
        )}
      </form>

      <InquiryTable inquiries={inquiries} />
    </div>
  )
}
