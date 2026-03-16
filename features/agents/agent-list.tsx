'use client'

import { ProfileEntity } from "@/domain/entities/profile.entity"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { removeAgentAction } from "@/application/actions/agent.actions"
import { Spinner } from "@/components/ui/spinner"
import { useTransition } from "react"
import { IconDotsVertical } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"

interface AgentListProps {
  agents: ProfileEntity[],
  realEstateId: string
}
export const AgentList = ({ agents, realEstateId }: AgentListProps) => {
  const { t } = useTranslation()
  const [isPending, startTransition] = useTransition()

  const handleRemove = ((agent_id: string) => {
    const formData = new FormData()
    formData.append('real_estate_id', realEstateId)
    formData.append('agent_id', agent_id)
    handleSignOut(formData)
  })

  const handleSignOut = (form: FormData) => {
    startTransition(async () => {
      try {
        await removeAgentAction(form)
      } catch (err) {
        console.error("Sign out failed:", err)
      }
    })
  }

  return (
    <>
      {agents.map((agent, index) => (
        <div
          key={index}
          className="w-full flex items-center gap-2 rounded-xl px-2 py-3 mt-2 text-left text-sm hover:bg-accent transition-all"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={agent.avatar_url || ""} alt={agent.full_name || "User"} />
            <AvatarFallback className="rounded-lg">{agent.full_name?.substring(0, 2).toUpperCase() || "CN"}</AvatarFallback>
          </Avatar>
          <div className="flex text-left text-sm leading-tight justify-between w-full">
            <span className="truncate font-medium capitalize">{agent.full_name || "User"}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconDotsVertical className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent onClick={() => handleRemove(agent.id)}>
                <DropdownMenuItem>
                  {isPending ? <Spinner /> : t('words:delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </>
  )
}
