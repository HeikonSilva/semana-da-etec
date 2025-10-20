import { Button } from '@/components/ui/button'
import type { Product } from '@/data'

export function Cart({
  cart,
  onRemove,
}: {
  cart: Product[]
  onRemove: (id: number) => void
}) {
  if (cart.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        Seu carrinho está vazio.
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {cart.map((item) => (
        <div
          className="flex items-center justify-between border-b pb-2"
          key={item.id}
        >
          <div>
            <span className="font-medium">{item.name}</span> — R${' '}
            {item.price.toFixed(2)}
          </div>
          <Button onClick={() => onRemove(item.id)} size="sm" variant="outline">
            Remover
          </Button>
        </div>
      ))}
    </div>
  )
}
