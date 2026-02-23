import { EllipsisVerticalIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { RealEstateAgentEntity } from '@/domain/entities/real-estate-agent.entity'


type Props = {
    agents: RealEstateAgentEntity[],
    className?: string
}

export const RealEstateAgentsCard = ({ agents, className }: Props) => {
    return (
        <Card className={className}>
            <CardHeader className='flex items-center justify-between'>
                <span className='text-lg font-semibold'>Agentes vinculados</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='text-muted-foreground size-6 rounded-full'>
                            <EllipsisVerticalIcon />
                            <span className='sr-only'>Invitar agente</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>Invitar agente</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className='flex flex-1 flex-col gap-4'>
                <div className='flex flex-1 flex-col justify-start gap-4'>
                    {agents.map((agent, index) => (
                        <div key={index} className='flex items-center justify-between gap-2.5'>
                            <div className='flex items-center justify-between gap-2.5'>
                                <Avatar className='size-11 rounded-sm'>
                                    <AvatarFallback className='bg-primary/10 shrink-0 rounded-sm'>
                                        <img
                                            src={agent.profile?.avatar_url as string && ''}
                                            alt={agent.profile?.full_name as string && ''}
                                            className='size-6'
                                        />
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-medium'>{agent.profile.full_name}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
