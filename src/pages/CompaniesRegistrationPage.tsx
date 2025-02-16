import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase'; // Importar o cliente Supabase
import { Plus } from 'lucide-react';

interface Company {
  name: string;
  cnpj: string;
  address: string; // Campo de endereço
}

export function CompaniesPage() {
  const { user } = useAuth();
  const [newCompany, setNewCompany] = useState<Company>({
    name: '',
    cnpj: '',
    address: '', // Inicializar o campo de endereço
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]); // Estado para armazenar as empresas

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se os campos estão preenchidos
    if (!newCompany.name || !newCompany.cnpj || !newCompany.address) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([{ 
        name: newCompany.name,
        cnpj: newCompany.cnpj,
        address: newCompany.address, // Enviar o campo de endereço
      }])
      .select(); // Adicionar .select() para retornar os dados inseridos

    if (error) {
      console.error('Error adding company:', error);
      alert('Erro ao adicionar empresa: ' + error.message); // Exibir mensagem de erro
    } else if (data && data.length > 0) {
      setCompanies([...companies, ...data]); // Atualizar a lista de empresas com os dados retornados
      setNewCompany({
        name: '',
        cnpj: '',
        address: '', // Resetar o campo de endereço
      });
      setIsPopupOpen(false); // Fechar a popup após adicionar
    } else {
      alert('Erro ao adicionar empresa: Nenhum dado retornado.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cadastro de Empresas</h1>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Empresa
        </button>
      </div>

      {/* Popup para Adicionar Empresa */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Adicionar Empresa</h2>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa</label>
                <input
                  type="text"
                  id="name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CNPJ</label>
                <input
                  type="text"
                  id="cnpj"
                  value={newCompany.cnpj}
                  onChange={(e) => setNewCompany({ ...newCompany, cnpj: e.target.value })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço</label>
                <input
                  type="text"
                  id="address"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Adicionar Empresa
                </button>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
