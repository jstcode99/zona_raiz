import LogoSvg from '@/assets/svg/logo'
import { cn } from '@/lib/utils'
import i18next from 'i18next'

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoSvg className='size-8.5' />
      <span className='text-xl font-semibold'>{i18next.t('app.name')}</span>
    </div>
  )
}

export default Logo
