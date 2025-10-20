import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Cart } from '@/components/sales/cart'
import { CheckoutForm } from '@/components/sales/checkout-form'
import { ProductList } from '@/components/sales/product-list'
import type { Product } from '@/data'
import { addSale, getProducts } from '@/data'

export const Route = createFileRoute('/sales')({
  component: SalesPage,
})

function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Product[]>([])
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  function handleAddToCart(product: Product) {
    if (!cart.find((p) => p.id === product.id)) {
      setCart((prev) => [...prev, product])
    }
  }

  function handleRemoveFromCart(id: number) {
    setCart((prev) => prev.filter((p) => p.id !== id))
  }

  async function handleCheckout() {
    // Record sales for each product in cart
    for (const product of cart) {
      await addSale(product.id, 1)
    }
    setCheckoutSuccess(true)
    setCart([])
    setTimeout(() => setCheckoutSuccess(false), 400)
    // Optionally, refresh products to update stock
    getProducts().then(setProducts)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
      <div
        className="grid w-full max-w-2xl grid-cols-1 gap-8 md:grid-cols-2"
        style={{ minHeight: '70vh' }}
      >
        <div className="flex h-full flex-col">
          <h2 className="mb-2 font-semibold text-lg">Produtos</h2>
          <div className="max-h-[40vh] flex-1 overflow-y-auto pr-2">
            <ProductList onAdd={handleAddToCart} products={products} />
          </div>
        </div>
        <div className="flex h-full flex-col">
          <h2 className="mb-2 font-semibold text-lg">Carrinho</h2>
          <div className="flex h-full flex-col">
            <div className="mb-2 text-muted-foreground text-sm">
              {cart.length === 0
                ? 'Nenhum produto adicionado.'
                : `${cart.length} produto${cart.length > 1 ? 's' : ''} no carrinho`}
            </div>
            <div className="max-h-[30vh] flex-1 overflow-y-auto pr-2">
              <Cart cart={cart} onRemove={handleRemoveFromCart} />
            </div>
            <div className="mt-6">
              <h2 className="mb-2 font-semibold text-lg">
                Dados para pagamento
              </h2>
              <CheckoutForm onSubmit={handleCheckout} />
              {checkoutSuccess && (
                <div className="mt-4 text-green-600">
                  Compra realizada com sucesso!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
