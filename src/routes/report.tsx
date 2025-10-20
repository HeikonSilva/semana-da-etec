import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Product } from '@/data'
import { getProductSalesReport, getProducts, getSales, type Sale } from '@/data'

// Simulated sales data (should be replaced with real sales tracking)
/*
const salesData = [
  { id: 1, sold: 10 },
  { id: 2, sold: 5 },
  { id: 3, sold: 8 },
  { id: 4, sold: 2 },
  { id: 5, sold: 7 },
]
*/

export const Route = createFileRoute('/report')({
  component: ReportPage,
})

/*
function getStockReport(
  products: Product[],
  sales: { id: number; sold: number }[]
) {
  return products.map((product) => {
    const sale = sales.find((s) => s.id === product.id)
    return {
      name: product.name,
      estoque: product.stock,
      vendas: sale ? sale.sold : 0,
      restante: product.stock - (sale ? sale.sold : 0),
    }
  })
}

function getWaterfallData(
  products: Product[],
  sales: { id: number; sold: number }[]
) {
  // Waterfall: estoque inicial -> vendas -> estoque final
  return products.map((product) => {
    const sale = sales.find((s) => s.id === product.id)
    return {
      name: product.name,
      estoque: product.stock,
      vendas: sale ? -sale.sold : 0,
      restante: product.stock - (sale ? sale.sold : 0),
    }
  })
}
*/

function ReportPage() {
  const [_products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  const [_sales, setSales] = useState<Sale[]>([])
  const [stockReport, setStockReport] = useState<any[]>([])
  const [waterfallData, setWaterfallData] = useState<any[]>([])

  useEffect(() => {
    getProducts().then(setProducts)
    getSales().then(setSales)
  }, [])

  useEffect(() => {
    getProductSalesReport().then(setStockReport)
    // Waterfall chart: estoque inicial, vendas (negativo), restante
    getProductSalesReport().then((report) => {
      setWaterfallData(
        report.map((row) => ({
          name: row.name,
          estoque: row.estoque,
          vendas: -row.vendas,
          restante: row.restante,
        }))
      )
    })
  }, [])

  return (
    <div className="flex w-full flex-col items-center justify-center p-2 md:p-4">
      <h1 className="mb-4 font-bold text-2xl">Relatório de Estoque e Vendas</h1>
      <div
        className="w-full max-w-3xl space-y-8 overflow-y-auto"
        style={{ maxHeight: '80vh' }}
      >
        <div>
          <h2 className="mb-2 font-semibold text-lg">
            Gráfico de Cascata (Simulado)
          </h2>
          <div className="w-full min-w-[250px]">
            <ResponsiveContainer height={300} width="100%">
              <BarChart data={waterfallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="estoque" fill="#8884d8" stackId="a" />
                <Bar dataKey="vendas" fill="#ff6961" stackId="a" />
                <Bar dataKey="restante" fill="#82ca9d" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="overflow-x-auto">
          <h2 className="mb-2 font-semibold text-lg">Relatório de Estoque</h2>
          <table className="w-full border-collapse overflow-hidden rounded-md border text-xs md:text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="p-2 text-left">Produto</th>
                <th className="p-2 text-right">Estoque Inicial</th>
                <th className="p-2 text-right">Vendas</th>
                <th className="p-2 text-right">Estoque Restante</th>
              </tr>
            </thead>
            <tbody>
              {stockReport.map((row) => (
                <tr className="border-t" key={row.name}>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2 text-right">{row.estoque}</td>
                  <td className="p-2 text-right">{row.vendas}</td>
                  <td className="p-2 text-right">{row.restante}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <h2 className="mb-2 font-semibold text-lg">Relatório de Vendas</h2>
          <table className="w-full border-collapse overflow-hidden rounded-md border text-xs md:text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="p-2 text-left">Produto</th>
                <th className="p-2 text-right">Vendas</th>
              </tr>
            </thead>
            <tbody>
              {stockReport.map((row) => (
                <tr className="border-t" key={row.name}>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2 text-right">{row.vendas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
