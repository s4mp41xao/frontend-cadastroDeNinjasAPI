import React, { useState } from 'react'
import { cadastrarNinja } from '../services/ninjaService'
import { useNavigate } from 'react-router-dom'

const CadastrarNinja = () => {
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [rank, setRank] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await cadastrarNinja({ nome, idade, rank })
      navigate('/cadastros') // volta para a lista após cadastrar
    } catch (error) {
      console.error('Erro ao cadastrar ninja:', error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Cadastrar Ninja</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Idade
          </label>
          <input
            type="number"
            value={idade}
            onChange={e => setIdade(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Rank
          </label>
          <input
            type="text"
            value={rank}
            onChange={e => setRank(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Cadastrarss
        </button>
      </form>
    </div>
  )
}

export default CadastrarNinja
