"use client"

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
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "react-i18next"
import { use } from "react"
import { agentModule } from "@/application/modules/agent.module"
import { toast } from "sonner"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { assignInquiryAction } from "@/application/actions/inquiry.actions"

interface AgentSelectorProps {
  children: React.ReactNode
  realEstateId: string
  inquiryId: string
  onAssigned?: () => void
}

export function AgentSelector({ children, realEstateId, inquiryId, onAssigned }: AgentSelectorProps) {
  const { t } = useTranslation()

  const assignMutation = useServerMutation({
    action: assignInquiryAction as any,
    onSuccess: () => {
      toast.success(t("words.assigned") || "Asignado")
      onAssigned?.()
    },
    onError: (error) => {
      toast.error(error.message || (t("words.error") as string) || "Error")
    },
  })

  const agentsPromise = agentModule().then(mod => mod.agentService.getCachedListAgents(realEstateId))

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
        <ScrollArea className="h-72 w-full rounded-md border p-4">
          <div className="space-y-2">
            {use(agentsPromise).map((agent: ProfileEntity) => (
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
      </DialogContent>
    </Dialog>
  )
}
