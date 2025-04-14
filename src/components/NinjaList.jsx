import React, { useEffect, useState } from 'react'
import {
  criarNinja,
  listarNinjas,
  deletarNinjaPorId
} from '../services/ninjaService'

const NinjaList = () => {
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [rank, setRank] = useState('')
  const [ninjas, setNinjas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [deleteMode, setDeleteMode] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    carregarNinjas()
  }, [])

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        deleteMode &&
        !event.target.closest('table') &&
        !event.target.closest('.header-container') &&
        !event.target.closest('.button-container') &&
        !event.target.closest('.fixed') // Adicionado para ignorar elementos fixos
      ) {
        setSelectedIds([])
        setDeleteMode(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [deleteMode, showDeleteConfirm])

  const carregarNinjas = async () => {
    try {
      const response = await listarNinjas()
      setNinjas(response.data)
      setLoading(false)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const novoNinja = { nome, idade: parseInt(idade), rank }
      await criarNinja(novoNinja)
      await carregarNinjas()
      setShowModal(false)
      setNome('')
      setIdade('')
      setRank('')
    } catch (err) {
      console.error('Erro ao criar ninja:', err)
      alert('Erro ao cadastrar ninja.')
    }
  }

  const handleRowClick = id => {
    if (!deleteMode) return
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleDeletar = async () => {
    try {
      await Promise.all(selectedIds.map(id => deletarNinjaPorId(id)))
      setSelectedIds([])
      setDeleteMode(false)
      setShowDeleteConfirm(false)
      await carregarNinjas()
    } catch (err) {
      console.error('Erro ao deletar ninja:', err)
      alert('Erro ao remover os itens selecionados.')
    }
  }

  if (loading) return <p className="text-center mt-4">Carregando...</p>
  if (error)
    return (
      <p className="text-center mt-4 text-red-500">Erro ao carregar ninjas.</p>
    )

  return (
    <div className="px-6 relative">
      <div
        className="flex justify-between items-center pb-10 pt-8 px-4 header-container"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-left">
          Histórico de movimentações
        </h2>

        <div className="flex gap-4 button-container">
          <button
            className="rounded-full font-bold bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
            onClick={() => setShowModal(true)}
          >
            Cadastrar Despesa
          </button>

          <button
            className="rounded-full font-bold bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-colors"
            onClick={() => {
              if (deleteMode) {
                setDeleteMode(false)
                setSelectedIds([])
              } else {
                setDeleteMode(true)
              }
            }}
          >
            {deleteMode
              ? `Cancelar Seleção (${selectedIds.length})`
              : 'Remover Despesa'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" onClick={e => e.stopPropagation()}>
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
              <tr
                key={ninja.id}
                onClick={() => handleRowClick(ninja.id)}
                className={`border-b cursor-pointer ${
                  deleteMode && selectedIds.includes(ninja.id)
                    ? 'border-2 border-red-500 bg-red-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 border">{ninja.id}</td>
                <td className="px-6 py-4 border">{ninja.nome}</td>
                <td className="px-6 py-4 border">{ninja.idade}</td>
                <td className="px-6 py-4 border">{ninja.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-center">
              Confirmar remoção de {selectedIds.length} item(s)?
            </h3>
            <ul className="text-sm mb-4 list-disc list-inside text-left max-h-40 overflow-y-auto">
              {ninjas
                .filter(n => selectedIds.includes(n.id))
                .map(n => (
                  <li key={n.id} className="py-1">
                    {n.nome} (ID: {n.id})
                  </li>
                ))}
            </ul>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeletar}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">Cadastrar Ninja</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Nome</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-black"
                  placeholder="Digite o nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Idade</label>
                <input
                  type="number"
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-black"
                  placeholder="Digite a idade"
                  value={idade}
                  onChange={e => setIdade(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Rank</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-black"
                  placeholder="Digite o rank"
                  value={rank}
                  onChange={e => setRank(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteMode && selectedIds.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <span>🗑️ Confirmar ({selectedIds.length})</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default NinjaList
