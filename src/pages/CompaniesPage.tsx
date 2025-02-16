import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase'; // Importar o cliente Supabase
import { Plus, Edit, Trash } from 'lucide-react'; // Importar o ícone Edit

interface Company {
  id: string; // UUID gerado pelo Supabase
  name: string;
  cnpj: string;
  address: string; // Campo de endereço
  user_id: string; // Adicionar o campo user_id
}

export function CompaniesPage() {
  const { user } = useAuth();
  const [newCompany, setNewCompany] = useState<Company>({
    id: '',
    name: '',
    cnpj: '',
    address: '',
    user_id: user?.id || '', // Inicializar com o user_id do usuário autenticado
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]); // Estado para armazenar as empresas

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user?.id); // Filtrar empresas pelo user_id

    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanies(data);
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se os campos estão preenchidos
    if (!newCompany.name || !newCompany.cnpj || !newCompany.address) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (newCompany.id) {
      // Se estamos editando uma empresa existente
      const { error } = await supabase
        .from('companies')
        .update({ 
          name: newCompany.name,
          cnpj: newCompany.cnpj,
          address: newCompany.address, // Atualizar o campo de endereço
        })
        .match({ id: newCompany.id }); // Encontrar a empresa pelo ID

      if (error) {
        console.error('Error updating company:', error);
        alert('Erro ao atualizar empresa: ' + error.message); // Exibir mensagem de erro
      } else {
        setIsPopupOpen(false); // Fechar a popup após editar
        fetchCompanies(); // Atualizar a lista de empresas
      }
    } else {
      // Se estamos adicionando uma nova empresa
      const { error } = await supabase
        .from('companies')
        .insert([{ 
          name: newCompany.name,
          cnpj: newCompany.cnpj,
          address: newCompany.address, // Enviar o campo de endereço
          user_id: user?.id, // Associar a empresa ao user_id do usuário autenticado
        }]);

      if (error) {
        console.error('Error adding company:', error);
        alert('Erro ao adicionar empresa: ' + error.message); // Exibir mensagem de erro
      } else {
        setNewCompany({
          id: '',
          name: '',
          cnpj: '',
          address: '', // Resetar o campo de endereço
          user_id: user?.id || '', // Resetar o user_id
        });
        setIsPopupOpen(false); // Fechar a popup após adicionar
        fetchCompanies(); // Atualizar a lista de empresas
      }
    }
  };

  const handleEditCompany = (id: string) => {
    // Implement edit functionality
    const companyToEdit = companies.find(company => company.id === id);
    if (companyToEdit) {
      setNewCompany(companyToEdit);
      setIsPopupOpen(true);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .match({ id });

    if (error) {
      console.error('Error deleting company:', error);
    } else {
      setCompanies(companies.filter(company => company.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cadastro de Empresas</h1>
        <button
          onClick={() => {
            setNewCompany({
              id: '',
              name: '',
              cnpj: '',
              address: '',
              user_id: user?.id || '',
            });
            setIsPopupOpen(true);
          }}
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
                  {newCompany.id ? 'Atualizar Empresa' : 'Adicionar Empresa'}
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

      {/* Listagem de Empresas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lista de Empresas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CNPJ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {companies.map(company => (
                <tr key={company.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{company.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.cnpj}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleEditCompany(company.id)} className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-4">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteCompany(company.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
