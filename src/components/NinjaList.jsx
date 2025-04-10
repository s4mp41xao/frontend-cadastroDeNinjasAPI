import React, { useEffect, useState } from 'react'
import { listarNinjas } from '../services/ninjaService' // ajuste o caminho se necessário

const NinjaList = () => {
  const [ninjas, setNinjas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await listarNinjas()
        setNinjas(response.data)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p className="text-center mt-4">Carregando...</p>
  if (error)
    return (
      <p className="text-center mt-4 text-red-500">Erro ao carregar ninjas.</p>
    )

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Lista de Ninjas</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead className="bg-gray-200 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-6 py-3 border">Nome</th>
              <th className="px-6 py-3 border">Idade</th>
              <th className="px-6 py-3 border">Rank</th>
            </tr>
          </thead>
          <tbody>
            {ninjas.map(ninja => (
              <tr key={ninja.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 border">{ninja.nome}</td>
                <td className="px-6 py-4 border">{ninja.idade}</td>
                <td className="px-6 py-4 border">{ninja.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NinjaList
