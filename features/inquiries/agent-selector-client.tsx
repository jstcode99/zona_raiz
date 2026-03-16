"use client"

import { useEffect, useState } from "react"
import { ProfileEntity } from "@/domain/entities/profile.entity"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { assignInquiryAction } from "@/application/actions/inquiry.actions"

interface AgentSelectorClientProps {
  realEstateId: string
  inquiryId: string
  children: React.ReactNode
}

export function AgentSelectorClient({ realEstateId, inquiryId, children }: AgentSelectorClientProps) {
  const { t } = useTranslation()
  const [agents, setAgents] = useState<ProfileEntity[]>([])
  const [loading, setLoading] = useState(true)

  const assignMutation = useServerMutation({
    action: assignInquiryAction,
    onSuccess: () => {
      toast.success(t("words.assigned") || "Asignado")
    },
    onError: (error) => {
      toast.error(error.message || (t("words.error") as string) || "Error")
    },
  })

  useEffect(() => {
    fetch(`/api/agents?real_estate_id=${realEstateId}`)
      .then(res => res.json())
      .then(data => {
        setAgents(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [realEstateId])

  const handleSelect = (agentId: string) => {
    const data = new FormData()
    data.append("id", inquiryId)
    data.append("assigned_to", agentId)
    assignMutation.action(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Seleccionar Agente</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center h-72">
            <p>Cargando agentes...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="flex items-center justify-center h-72">
            <p className="text-muted-foreground">No hay agentes disponibles</p>
          </div>
        ) : (
          <ScrollArea className="h-72 w-full rounded-md border p-0">
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => handleSelect(agent.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={agent.avatar_url || ""} alt={agent.full_name || "Agent"} />
                    <AvatarFallback>{agent.full_name?.substring(0, 2).toUpperCase() || "AG"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{agent.full_name || "Agente sin nombre"}</p>
                    <p className="text-sm text-muted-foreground truncate">{agent.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
