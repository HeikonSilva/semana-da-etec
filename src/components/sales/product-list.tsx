import { Button } from '@/components/ui/button'
import type { Product } from '@/data'

export function ProductList({
  products,
  onAdd,
}: {
  products: Product[]
  onAdd: (product: Product) => void
}) {
  return (
    <div className="space-y-2">
      {products.map((product) => (
        <div
          className="flex items-center justify-between border-b pb-2"
          key={product.id}
        >
          <div>
            <span className="font-medium">{product.name}</span> — R${' '}
            {product.price.toFixed(2)}
          </div>
          <Button onClick={() => onAdd(product)} size="sm" variant="default">
            Adicionar ao Carrinho
          </Button>
        </div>
      ))}
    </div>
  )
}
