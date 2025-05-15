'use client'

import { useEffect, useState } from 'react'

interface Usuario {
  id: number
  nome: string
  email: string
}

interface FormData {
  nome: string
  email: string
}

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({ nome: '', email: '' })
  const [editandoId, setEditandoId] = useState<number | null>(null)

  const carregarUsuarios = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/usuarios')
      if (!response.ok) throw new Error('Erro ao carregar usuários')
      const data = await response.json()
      setUsuarios(data.usuarios || [])
      setErro(null)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editandoId 
        ? `/api/usuarios/${editandoId}`
        : '/api/usuarios'
      
      const method = editandoId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Erro ao salvar usuário')
      
      await carregarUsuarios()
      setFormData({ nome: '', email: '' })
      setEditandoId(null)
      setErro(null)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return
    
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erro ao deletar usuário')
      
      await carregarUsuarios()
      setErro(null)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  const handleEdit = (usuario: Usuario) => {
    setFormData({ nome: usuario.nome, email: usuario.email })
    setEditandoId(usuario.id)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Gerenciamento de Usuários</h1>
        
        {erro && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-sm border-2 border-gray-300">
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2">
              Nome:
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="shadow appearance-none border-2 rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2">
              Email:
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="shadow appearance-none border-2 rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-2 border-blue-700 focus:outline-none focus:shadow-outline"
          >
            {editandoId ? 'Atualizar' : 'Criar'} Usuário
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setFormData({ nome: '', email: '' })
                setEditandoId(null)
              }}
              className="ml-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border-2 border-gray-700 focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          )}
        </form>

        {loading ? (
          <p className="text-black">Carregando...</p>
        ) : (
          <div className="grid gap-4">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className="bg-white border-2 border-gray-300 p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-black">{usuario.nome}</h3>
                  <p className="text-gray-700">{usuario.email}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded border-2 border-yellow-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded border-2 border-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
