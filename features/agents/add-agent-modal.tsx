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
  realEstateId: string
}

export function AddAgentModal({ realEstateId }: AddAgentModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-104">
        <AddAgentForm realEstateId={realEstateId} />
      </DialogContent>
    </Dialog>
  )
}
