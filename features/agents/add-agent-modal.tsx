'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AddAgentForm } from '@/features/agents/add-agent-form'
import { IconPlus } from '@tabler/icons-react'

interface AddAgentModalProps {
  real_estate_id: string
}

export function AddAgentModal({ real_estate_id }: AddAgentModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Agregar agente</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AddAgentForm real_estate_id={real_estate_id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
