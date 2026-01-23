import { Icon } from '@iconify/react'
import { Toaster } from '@/app/components/ui/sonner'

const AppToaster = () => {
  return (
    <Toaster
      visibleToasts={2}
      expand={false}
      offset='16px'
      closeButton
      icons={{
        success: <Icon icon='ooui:success' />,
        info: <Icon icon='material-symbols:info' />,
        warning: <Icon icon='typcn:warning' />,
        error: <Icon icon='ix:error-filled' />,
      }}
    />
  )
}

export default AppToaster
