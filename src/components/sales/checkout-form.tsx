import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v3'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const checkoutSchema = z.object({
  name: z.string().min(2, { message: 'Nome é obrigatório' }),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export function CheckoutForm({
  onSubmit,
}: {
  onSubmit: (values: CheckoutFormValues) => void
}) {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>Nome</Label>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <Button type="submit">Finalizar Compra</Button>
        </div>
      </form>
    </Form>
  )
}
