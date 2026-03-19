'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

const COLORS: Record<string, string> = {
  draft: '#6b7280',
  active: '#10b981',
  paused: '#f59e0b',
  archived: '#ef4444',
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador' },
  { value: 'active', label: 'Activo' },
  { value: 'paused', label: 'Pausado' },
  { value: 'archived', label: 'Archivado' },
]

const MONTHS = ['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export interface ListingsByStatusData {
  [month: string]: {
    draft: number
    active: number
    paused: number
    archived: number
  }
}

interface ListingsByStatusChartProps extends React.ComponentProps<"div"> {
  data: ListingsByStatusData
  onMonthsChange?: (months: string[]) => void
}

export function ListingsByStatusChart({ data, onMonthsChange, ...props }: ListingsByStatusChartProps) {
  const { t } = useTranslation("dashboard")

  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const chartData = useMemo(() => {
    if (selectedMonths.length === 0) {
      return MONTHS.map(month => ({
        name: month,
        ...data[month]
      }))
    }
    return selectedMonths.map(month => ({
      name: month,
      ...data[month]
    }))
  }, [data, selectedMonths])

  const toggleMonth = (month: string) => {
    const newValues = selectedMonths.includes(month)
      ? selectedMonths.filter(m => m !== month)
      : [...selectedMonths, month]
    setSelectedMonths(newValues)
    onMonthsChange?.(newValues)
  }

  const totalByStatus = useMemo(() => {
    const totals = { draft: 0, active: 0, paused: 0, archived: 0 }
    chartData.forEach(d => {
      totals.draft += d.draft || 0
      totals.active += d.active || 0
      totals.paused += d.paused || 0
      totals.archived += d.archived || 0
    })
    return totals
  }, [chartData])

  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle className="text-base">{t('sections:listings_by_status')}</CardTitle>
        <CardDescription>{t('sections:listings_by_status_description')}</CardDescription>
      </CardHeader>
      <CardContent className="mt-0 space-y-4 lg:min-h-94">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between text-xs h-8"
            >
              {selectedMonths.length === 0
                ? t('actions:all_months')
                : `${selectedMonths.length} ${t('words:months')} ${t('words:selected')}`}
              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder={t('words:search')} className="h-8" />
              <CommandList>
                <CommandEmpty>{t('exeptions:not_found_months')}</CommandEmpty>
                <CommandGroup>
                  {MONTHS.map((month) => (
                    <CommandItem
                      key={month}
                      value={month}
                      onSelect={() => toggleMonth(month)}
                      className="text-xs"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          selectedMonths.includes(month)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {month}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ fontSize: 12 }}
                  formatter={(value: number, name: string) => [value, STATUS_OPTIONS.find(s => s.value === name)?.label || name]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="draft" name="draft" fill={COLORS.draft} stackId="status" />
                <Bar dataKey="active" name="active" fill={COLORS.active} stackId="status" />
                <Bar dataKey="paused" name="paused" fill={COLORS.paused} stackId="status" />
                <Bar dataKey="archived" name="archived" fill={COLORS.archived} stackId="status" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-muted-foreground text-xs">
            {t('exceptions:not_found_data')}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          {STATUS_OPTIONS.map(status => (
            <div key={status.value} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[status.value] }} />
                {status.label}
              </span>
              <span className="font-medium">{totalByStatus[status.value as keyof typeof totalByStatus]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
