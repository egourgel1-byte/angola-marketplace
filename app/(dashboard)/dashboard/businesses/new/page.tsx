'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBusinessPage() {

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  })

  const handleChange = (e:any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e:any) => {

    e.preventDefault()

    setLoading(true)

    try {

      const res = await fetch('/api/businesses', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({

          name: form.name,
          description: form.description,
          category: form.category,
          location: form.address,
          city: form.city,
          country: 'Angola',
          phone: form.phone,
          email: form.email,
          website: form.website,
          whatsapp: form.phone

        })

      })

      const data = await res.json()

      if(res.ok){

        alert('✅ Empresa criada com sucesso')

        router.push('/dashboard')

      }

      else{

        alert(data.message || 'Erro ao criar empresa')

      }

    }

    catch(error){

      alert('Erro de conexão')

    }

    setLoading(false)

  }

  return (

    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow">

      <h1 className="text-2xl font-bold mb-6">

        Criar nova empresa

      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">


        <input
          name="name"
          placeholder="Nome da empresa"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />


        <textarea
          name="description"
          placeholder="Descrição da empresa"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />


        <input
          name="category"
          placeholder="Categoria (ex: Restaurante)"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />


        <input
          name="city"
          placeholder="Cidade"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />


        <input
          name="address"
          placeholder="Morada completa"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />


        <input
          name="phone"
          placeholder="Telefone"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />


        <input
          name="email"
          placeholder="Email comercial"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />


        <input
          name="website"
          placeholder="Website (opcional)"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />


        <button

          type="submit"

          className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700"

        >

          {loading ? 'Criando...' : 'Criar Empresa'}

        </button>


      </form>

    </div>

  )

}