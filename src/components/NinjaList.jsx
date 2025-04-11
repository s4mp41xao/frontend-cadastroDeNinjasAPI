import React, { useEffect, useState } from 'react'
import { listarNinjas } from '../services/ninjaService'

const NinjaList = () => {
  const [ninjas, setNinjas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)

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
    <div className="p-6 relative">
      <div className="flex justify-between items-center py-10 px-4">
        <h2 className="text-3xl font-bold text-left">
          Histórico de movimentações
        </h2>

        <button
          className="rounded-full font-bold bg-black text-white px-6 py-2"
          onClick={() => setShowModal(true)}
        >
          Cadastrar Despesa
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)} // clicando fora fecha
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            onClick={e => e.stopPropagation()} // impede de fechar ao clicar dentro
          >
            <h3 className="text-2xl font-bold mb-4">Cadastrar Ninja</h3>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Nome</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Digite o nome"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Idade</label>
                <input
                  type="number"
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Digite a idade"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Rank</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Digite o rank"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-black text-white"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela de dados */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center border-collapse">
          <thead className="bg-gray-200 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-6 py-3 border">ID</th>
              <th className="px-6 py-3 border">Nome</th>
              <th className="px-6 py-3 border">Idade</th>
              <th className="px-6 py-3 border">Rank</th>
            </tr>
          </thead>
          <tbody>
            {ninjas.map(ninja => (
              <tr key={ninja.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 border">{ninja.id}</td>
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
