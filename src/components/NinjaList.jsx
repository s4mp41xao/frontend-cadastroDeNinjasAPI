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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [hovering, setHovering] = useState(false) // Novo estado para hover

  useEffect(() => {
    carregarNinjas()
  }, [])

  useEffect(() => {
    const handleClickOutside = event => {
      // Verifica se o clique foi fora da tabela, dos botões ou do cabeçalho
      if (
        deleteMode &&
        !event.target.closest('table') && // Clique fora da tabela
        !event.target.closest('.header-container') && // Clique no cabeçalho
        !event.target.closest('.button-container') // Clique nos botões
      ) {
        setSelectedIds([]) // Limpa os itens selecionados
        setDeleteMode(false) // Cancela o modo de remoção
      }
    }

    // Adiciona o evento de clique no documento
    document.addEventListener('click', handleClickOutside)

    // Remove o evento ao desmontar o componente
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [deleteMode])

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
    if (!deleteMode) return // Só permite selecionar despesas no modo de remoção
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleDeletar = async () => {
    try {
      for (const id of selectedIds) {
        await deletarNinjaPorId(id) // Remove cada despesa pelo ID
      }
      setSelectedIds([]) // Limpa as despesas selecionadas
      setDeleteMode(false) // Sai do modo de remoção
      carregarNinjas() // Atualiza a lista de despesas
    } catch (err) {
      console.error('Erro ao deletar ninja:', err)
    }
  }

  const toggleDeleteMode = () => {
    if (selectedIds.length === 0) {
      setDeleteMode(false) // Cancela a remoção se não houver itens selecionados
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
        onClick={e => e.stopPropagation()} // Impede que o clique no cabeçalho desmarque os itens
      >
        <h2 className="text-3xl font-bold text-left">
          Histórico de movimentações
        </h2>

        <div className="flex gap-4 button-container">
          <button
            className="rounded-full font-bold bg-black text-white px-6 py-2"
            onClick={() => setShowModal(true)}
          >
            Cadastrar Despesa
          </button>

          <button
            className="rounded-full font-bold bg-red-600 text-white px-6 py-2"
            onClick={() => {
              if (deleteMode) {
                // Se já estiver no modo de remoção, cancela a remoção
                setDeleteMode(false)
                setSelectedIds([]) // Limpa as despesas selecionadas
              } else {
                // Ativa o modo de remoção
                setDeleteMode(true)
              }
            }}
            onMouseEnter={() => setHovering(true)} // Ativa o hover
            onMouseLeave={() => setHovering(false)} // Desativa o hover
          >
            {hovering && deleteMode
              ? `Cancelar Remoção? (${selectedIds.length})`
              : deleteMode
              ? `Despesas Selecionadas: (${selectedIds.length})`
              : 'Remover Despesa'}
          </button>
        </div>
      </div>

      <div
        className="overflow-x-auto"
        onClick={e => e.stopPropagation()} // Impede que o clique na tabela desmarque os itens
      >
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
                    ? 'border-2 border-red-500'
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

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
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
                  className="w-full border px-4 py-2 rounded"
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
                  className="w-full border px-4 py-2 rounded"
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
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Digite o rank"
                  value={rank}
                  onChange={e => setRank(e.target.value)}
                  required
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

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowDeleteConfirm(false)
            setDeleteMode(false)
            setSelectedIds([])
          }}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-center">
              Deseja remover as despesas selecionadas?
            </h3>
            <ul className="text-sm mb-4 list-disc list-inside text-left">
              {ninjas
                .filter(n => selectedIds.includes(n.id))
                .map(n => (
                  <li key={n.id}>
                    {n.nome} (ID: {n.id})
                  </li>
                ))}
            </ul>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteMode(false)
                  setSelectedIds([])
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={async () => {
                  await handleDeletar()
                  setShowDeleteConfirm(false)
                  setDeleteMode(false)
                }}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteMode && selectedIds.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded shadow"
            onClick={() => setShowDeleteConfirm(true)}
          >
            {`Confirmar Remoções: (${selectedIds.length})`}
          </button>
        </div>
      )}
    </div>
  )
}

export default NinjaList
