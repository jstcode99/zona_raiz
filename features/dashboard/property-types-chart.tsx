'use client'

import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PropertyType } from '@/domain/entities/property.enums'
import { propertyTypeLabels } from '@/domain/entities/property.entity'
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
import { Progress } from '@/components/ui/progress'
import { useTranslation } from 'react-i18next';

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316'
]

const PROPERTY_TYPE_OPTIONS = Object.values(PropertyType).map(type => ({
  value: type,
  label: propertyTypeLabels[type]
}))

export interface PropertyTypeCount {
  type: PropertyType
  count: number
  label: string
}

interface PropertyTypesChartProps extends React.ComponentProps<"div"> {
  data: Record<PropertyType, number>
  onTypesChange?: (types: PropertyType[]) => void
}

export function PropertyTypesChart({ data, onTypesChange, ...props }: PropertyTypesChartProps) {
  const { t } = useTranslation("dashboard")

  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([])
  const [open, setOpen] = useState(false)

  const { chartData, total } = useMemo(() => {
    const filtered = selectedTypes.length > 0
      ? selectedTypes.map(type => ({
        type,
        count: data[type] || 0,
        label: propertyTypeLabels[type]
      })).filter(item => item.count > 0)
      : Object.entries(data)
        .map(([type, count]) => ({
          type: type as PropertyType,
          count,
          label: propertyTypeLabels[type as PropertyType]
        }))
        .filter(item => item.count > 0)

    const totalCount = filtered.reduce((sum, item) => sum + item.count, 0)
    return { chartData: filtered, total: totalCount }
  }, [data, selectedTypes])

  const toggleType = (type: PropertyType) => {
    const newValues = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type]
    setSelectedTypes(newValues)
    onTypesChange?.(newValues)
  }

  return (
    <Card className="w-full" {...props}>
      <CardHeader>
        <CardTitle className="text-base">{t('sections:properties_by_type')}</CardTitle>
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
              {selectedTypes.length === 0
                ? t('actions:select_type')
                : `${selectedTypes.length} ${t('words:types')}(s) ${t('words:selected')}(s)`}
              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder={t('words:search')} className="h-8" />
              <CommandList>
                <CommandEmpty>{t('exeptions:not_found_types')}</CommandEmpty>
                <CommandGroup>
                  {PROPERTY_TYPE_OPTIONS.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => toggleType(option.value)}
                      className="text-xs"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          selectedTypes.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {chartData.length > 0 ? (
          <div className="flex gap-4">
            <div className="h-35 w-35 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, 'Cantidad']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 overflow-auto max-h-35">
              {chartData.map((item) => {
                const percentage = total > 0 ? (item.count / total) * 100 : 0
                return (
                  <div key={item.type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium truncate">{item.label}</span>
                      <span className="text-muted-foreground text-[10px]">{item.count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex h-25 items-center justify-center text-muted-foreground text-xs">
            {t('exceptions:not_found_data')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
