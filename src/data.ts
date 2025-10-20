export type Product = {
  id: number
  name: string
  price: number
  stock: number
}

// Sale: productId, quantity
export type Sale = {
  productId: number
  quantity: number
  date: string // ISO string
}

const products: Product[] = [
  { id: 1, name: 'Produto A', price: 10.0, stock: 100 },
  { id: 2, name: 'Produto B', price: 20.0, stock: 200 },
  { id: 3, name: 'Produto C', price: 30.0, stock: 300 },
  { id: 4, name: 'Produto D', price: 40.0, stock: 150 },
  { id: 5, name: 'Produto E', price: 50.0, stock: 120 },
  { id: 6, name: 'Produto F', price: 60.0, stock: 80 },
  { id: 7, name: 'Produto G', price: 70.0, stock: 60 },
  { id: 8, name: 'Produto H', price: 80.0, stock: 90 },
  { id: 9, name: 'Produto I', price: 90.0, stock: 110 },
  { id: 10, name: 'Produto J', price: 100.0, stock: 130 },
  { id: 11, name: 'Produto K', price: 110.0, stock: 140 },
  { id: 12, name: 'Produto L', price: 120.0, stock: 170 },
  { id: 13, name: 'Produto M', price: 130.0, stock: 160 },
  { id: 14, name: 'Produto N', price: 140.0, stock: 180 },
  { id: 15, name: 'Produto O', price: 150.0, stock: 190 },
  { id: 16, name: 'Produto P', price: 160.0, stock: 210 },
  { id: 17, name: 'Produto Q', price: 170.0, stock: 220 },
  { id: 18, name: 'Produto R', price: 180.0, stock: 230 },
]

const sales: Sale[] = []

// Product CRUD
export function getProducts(): Promise<Product[]> {
  return Promise.resolve([...products])
}

export function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const newProduct = { id: products.length + 1, ...product }
  products.push(newProduct)
  return Promise.resolve(newProduct)
}

export function editProduct(
  id: number,
  updated: Omit<Product, 'id'>
): Promise<Product | null> {
  const idx = products.findIndex((p) => p.id === id)
  if (idx !== -1) {
    products[idx] = { id, ...updated }
    return Promise.resolve(products[idx])
  }
  return Promise.resolve(null)
}

export function deleteProduct(id: number): Promise<boolean> {
  const idx = products.findIndex((p) => p.id === id)
  if (idx !== -1) {
    products.splice(idx, 1)
    return Promise.resolve(true)
  }
  return Promise.resolve(false)
}

// Sales CRUD
export function getSales(): Promise<Sale[]> {
  return Promise.resolve([...sales])
}

export function addSale(productId: number, quantity: number): Promise<Sale> {
  const sale: Sale = { productId, quantity, date: new Date().toISOString() }
  sales.push(sale)
  // Update product stock
  const product = products.find((p) => p.id === productId)
  if (product) {
    product.stock = Math.max(0, product.stock - quantity)
  }
  return Promise.resolve(sale)
}

export function getProductSalesReport(): Promise<
  Array<{ name: string; vendas: number; estoque: number; restante: number }>
> {
  // Aggregate sales per product
  const report = products.map((product) => {
    const vendas = sales
      .filter((s) => s.productId === product.id)
      .reduce((acc, s) => acc + s.quantity, 0)
    return {
      name: product.name,
      vendas,
      estoque: product.stock + vendas,
      restante: product.stock,
    }
  })
  return Promise.resolve(report)
}

export function getSalesReport(): Promise<
  Array<{ name: string; vendas: number }>
> {
  // Aggregate sales per product
  const report = products.map((product) => {
    const vendas = sales
      .filter((s) => s.productId === product.id)
      .reduce((acc, s) => acc + s.quantity, 0)
    return {
      name: product.name,
      vendas,
    }
  })
  return Promise.resolve(report)
}
