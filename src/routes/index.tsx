import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import type { RowSelectionState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v3'
import { columns } from '@/components/products/columns'
import { DataTable } from '@/components/products/data-table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Product } from '@/data'
import { addProduct, deleteProduct, editProduct, getProducts } from '@/data'

export const Route = createFileRoute('/')({
  component: Index,
})

const addProductFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  price: z.coerce.number().min(0, { message: 'Preço deve ser maior que 0' }),
  stock: z.coerce.number().min(0, { message: 'Estoque deve ser maior que 0' }),
})

function Index() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    getProducts().then((data) => setProducts(data))
  }, [])

  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false)
  const [removeProductDialogOpen, setRemoveProductDialogOpen] = useState(false)
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Get selected product id (fix: keys may be zero-based index, not product id)
  let selectedProduct: Product | undefined
  if (Object.keys(rowSelection).length === 1) {
    // Try to get the selected row index
    const selectedKey = Object.keys(rowSelection)[0]
    // If DataTable uses index as key, get product by index
    const selectedIndex = Number(selectedKey)
    if (!Number.isNaN(selectedIndex) && products[selectedIndex]) {
      selectedProduct = products[selectedIndex]
    }
  }

  // Edit form state
  const editProductForm = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: selectedProduct,
  })

  // When dialog opens, reset form with selected product
  useEffect(() => {
    if (editProductDialogOpen && selectedProduct) {
      editProductForm.reset({
        name: selectedProduct.name,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
      })
    }
  }, [editProductDialogOpen, selectedProduct, editProductForm.reset])

  function handleEditProduct(values: z.infer<typeof addProductFormSchema>) {
    if (!selectedProduct) {
      return
    }
    // Call editProduct and update state
    editProduct(selectedProduct.id, values).then((updated) => {
      if (updated) {
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        )
      }
    })
    editProductForm.reset()
    setEditProductDialogOpen(false)
  }

  function handleRemoveProduct() {
    if (!selectedProduct) {
      return
    }
    deleteProduct(selectedProduct.id).then((success) => {
      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
        setRowSelection({})
      }
    })
    setRemoveProductDialogOpen(false)
  }

  const addProductForm = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
  })

  function handleAddProduct(values: z.infer<typeof addProductFormSchema>) {
    addProduct(values).then((newProduct) => {
      setProducts((prev) => [...prev, newProduct])
    })
    addProductForm.reset()
    setAddProductDialogOpen(false)
  }

  // Only enable edit/remove when exactly one row is selected
  const isSingleRowSelected = Object.keys(rowSelection).length === 1

  return (
    <div className="flex w-full flex-col">
      <DataTable
        columns={columns}
        data={products}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
      />
      <div className="mt-2 flex w-full flex-row-reverse justify-between gap-2">
        <div className="space-x-2">
          <Dialog
            onOpenChange={setEditProductDialogOpen}
            open={editProductDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                disabled={!isSingleRowSelected || editProductDialogOpen}
                size={'sm'}
                variant={'default'}
              >
                Editar Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Produto</DialogTitle>
                <DialogDescription>
                  Altere os dados do produto selecionado
                </DialogDescription>
              </DialogHeader>
              {selectedProduct ? (
                <Form {...editProductForm}>
                  <form
                    className="space-y-4"
                    onSubmit={editProductForm.handleSubmit(handleEditProduct)}
                  >
                    <FormField
                      control={editProductForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Nome</Label>
                          <FormControl>
                            <Input placeholder="Nome do produto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editProductForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Preço</Label>
                          <FormControl>
                            <Input
                              placeholder="Preço do produto"
                              {...field}
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editProductForm.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Estoque</Label>
                          <FormControl>
                            <Input
                              placeholder="Quantidade em estoque"
                              {...field}
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button type="submit">Salvar Alterações</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Nenhum produto selecionado.
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Dialog
            onOpenChange={setRemoveProductDialogOpen}
            open={removeProductDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                disabled={!isSingleRowSelected || removeProductDialogOpen}
                size={'sm'}
                variant={'destructive'}
              >
                Remover Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remover Produto</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja remover o produto selecionado?
                </DialogDescription>
              </DialogHeader>
              {selectedProduct ? (
                <div className="space-y-2">
                  <div>
                    Produto: <strong>{selectedProduct.name}</strong>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleRemoveProduct} variant="destructive">
                      Remover
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Nenhum produto selecionado.
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <Dialog
          onOpenChange={setAddProductDialogOpen}
          open={addProductDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              disabled={addProductDialogOpen}
              size={'sm'}
              variant={'default'}
            >
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Produto</DialogTitle>
              <DialogDescription>
                Formulário de adição de produto
              </DialogDescription>
            </DialogHeader>
            <Form {...addProductForm}>
              <form
                className="space-y-4"
                onSubmit={addProductForm.handleSubmit(handleAddProduct)}
              >
                <FormField
                  control={addProductForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Nome</Label>
                      <FormControl>
                        <Input placeholder="Nome do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addProductForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Preço</Label>
                      <FormControl>
                        <Input
                          placeholder="Preço do produto"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addProductForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Estoque</Label>
                      <FormControl>
                        <Input
                          placeholder="Quantidade em estoque"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Adicionar Produto</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
