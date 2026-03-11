"use client"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Spinner } from "@/components/ui/spinner"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { flatten } from "@/lib/utils"
import { addAgentAction } from "@/application/actions/agent.actions"
import { agentToggleFormInput, agentToggleSchema } from "@/application/validation/agent.validation"

interface Props {
  real_estate_id: string
}
export const AddAgentForm = ({
  real_estate_id
}: Props) => {

  const { t } = useTranslation('common')

  const form = useForm<agentToggleFormInput>({
    resolver: yupResolver(agentToggleSchema),
    defaultValues: {
      real_estate_id: real_estate_id,
      profile_id: ''
    },
    mode: "onBlur", // Validación al perder foco
  })

  const { setError, reset, handleSubmit, formState: { isSubmitting } } = form

  const mutation = useServerMutation({
    action: addAgentAction,
    setError,
    onSuccess: () => {
      reset() // Refrescar para actualizar estado de auth
    },
    onError: (error) => {
      console.error("Sign in error:", error)
    }
  })

  // Resetear error cuando el usuario empieza a escribir
  useEffect(() => {
    const subscription = form.watch(() => {
      if (mutation.isError) {
        mutation.reset()
      }
    })
    return () => subscription.unsubscribe()
  }, [form, mutation])

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData()
    const data = flatten(values, "", formData);
    mutation.action(data)
  })

  const searchUsersByEmail = async (email: string) => {
    if (!email || email.length < 2) return []
    const res = await fetch(`/api/search-users?email=${encodeURIComponent(email)}`)
    return await res.json()
  } 

  const isLoading = isSubmitting || mutation.isPending

  return (
    <Form
      form={form}
      className="py-4 px-2"
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-3">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('forms.add-agent.title')}</h1>
          <p className="text-muted-foreground text-balance">
            {t('forms.add-agent.subtitle')}
          </p>
        </div>

        <Form.Autocomplete
          name="profile_id"
          label={t('forms.add-agent.fields.profile_id.label')}
          placeholder={t('forms.add-agent.fields.profile_id.placeholder')}
          onSearch={searchUsersByEmail}
        />

        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Spinner data-icon="inline-start" className="mr-2 h-4 w-4" />}
            {t('forms.add-agent.add')}
          </Button>
        </Field>

      </FieldGroup>
    </Form>
  )
}