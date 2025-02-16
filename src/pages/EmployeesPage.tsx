import React, { useState, useEffect } from 'react';
    import { Plus, Edit, Trash } from 'lucide-react';
    import { supabase } from '../lib/supabase'; // Importar o cliente Supabase

    interface Employee {
      id: string; // UUID gerado pelo Supabase
      name: string;
      email: string;
      phone: string;
      company_id: string; // Alterado para company_id
      position: string;
      cardlastfour: string; // Alterado para cardlastfour
    }

    interface Company {
      id: string;
      name: string;
    }

    export function EmployeesPage() {
      const [employees, setEmployees] = useState<Employee[]>([]);
      const [newEmployee, setNewEmployee] = useState<Employee>({
        id: '',
        name: '',
        email: '',
        phone: '',
        company_id: '', // Alterado para company_id
        position: '',
        cardlastfour: '', // Alterado para cardlastfour
      });
      const [isPopupOpen, setIsPopupOpen] = useState(false);
      const [companies, setCompanies] = useState<Company[]>([]);

      useEffect(() => {
        fetchEmployees();
        fetchCompanies();
      }, []);

      const fetchEmployees = async () => {
        const { data, error } = await supabase.from('employees').select('*');
        if (error) {
          console.error('Error fetching employees:', error);
        } else {
          setEmployees(data);
        }
      };

      const fetchCompanies = async () => {
        const { data, error } = await supabase
          .from('companies')
          .select('*');
        if (error) {
          console.error('Error fetching companies:', error);
        } else {
          setCompanies(data);
        }
      };

      const handleAddOrUpdateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Verificar se os campos estão preenchidos
        if (!newEmployee.name || !newEmployee.email || !newEmployee.phone || !newEmployee.company_id || !newEmployee.position || !newEmployee.cardlastfour) {
          alert('Por favor, preencha todos os campos.');
          return;
        }

        if (newEmployee.id) {
          // Se estamos editando uma empresa existente
          const { error } = await supabase
            .from('employees')
            .update({ 
              name: newEmployee.name,
              email: newEmployee.email,
              phone: newEmployee.phone,
              company_id: newEmployee.company_id, // Alterado para company_id
              position: newEmployee.position,
              cardlastfour: newEmployee.cardlastfour, // Alterado para cardlastfour
            })
            .match({ id: newEmployee.id }); // Encontrar a empresa pelo ID

          if (error) {
            console.error('Error updating employee:', error);
            alert('Erro ao atualizar empregado: ' + error.message); // Exibir mensagem de erro
          } else {
            setIsPopupOpen(false); // Fechar a popup após editar
            fetchEmployees(); // Atualizar a lista de empregados
          }
        } else {
          // Se estamos adicionando uma nova empresa
          const { error } = await supabase
            .from('employees')
            .insert([{ 
              name: newEmployee.name,
              email: newEmployee.email,
              phone: newEmployee.phone,
              company_id: newEmployee.company_id, // Alterado para company_id
              position: newEmployee.position,
              cardlastfour: newEmployee.cardlastfour, // Alterado para cardlastfour
            }]);

          if (error) {
            console.error('Error adding employee:', error);
            alert('Erro ao adicionar empregado: ' + error.message); // Exibir mensagem de erro
          } else {
            setEmployees([...employees, { ...newEmployee, id: '' }]); // Atualizar a lista de empregados
            setNewEmployee({
              id: '',
              name: '',
              email: '',
              phone: '',
              company_id: '', // Alterado para company_id
              position: '',
              cardlastfour: '', // Resetar o novo campo
            });
            setIsPopupOpen(false); // Fechar a popup após adicionar
            fetchEmployees(); // Atualizar a lista de empregados
          }
        }
      };

      const handleEditEmployee = (id: string) => {
        const employeeToEdit = employees.find(employee => employee.id === id);
        if (employeeToEdit) {
          setNewEmployee(employeeToEdit);
          setIsPopupOpen(true);
        }
      };

      const handleDeleteEmployee = async (id: string) => {
        const { error } = await supabase
          .from('employees')
          .delete()
          .match({ id });

        if (error) {
          console.error('Error deleting employee:', error);
        } else {
          setEmployees(employees.filter(employee => employee.id !== id));
        }
      };

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Empregados</h1>
            <button
              onClick={() => {
                setNewEmployee({
                  id: '',
                  name: '',
                  email: '',
                  phone: '',
                  company_id: '', // Alterado para company_id
                  position: '',
                  cardlastfour: '', // Resetar o novo campo
                });
                setIsPopupOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Empregado
            </button>
          </div>

          {/* Popup para Adicionar/Editar Empregado */}
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  {newEmployee.id ? 'Editar Empregado' : 'Adicionar Empregado'}
                </h2>
                <form onSubmit={handleAddOrUpdateEmployee} className="space-y-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empresa</label>
                    <select
                      id="company"
                      value={newEmployee.company_id} // Alterado para company_id
                      onChange={(e) => setNewEmployee({ ...newEmployee, company_id: e.target.value })} // Alterado para company_id
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    >
                      <option value="">Selecione uma empresa</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                    <input
                      type="text"
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                    <input
                      type="text"
                      id="phone"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cargo</label>
                    <input
                      type="text"
                      id="position"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cardlastfour" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Últimos 4 dígitos do Cartão</label>
                    <input
                      type="text"
                      id="cardlastfour"
                      value={newEmployee.cardlastfour}
                      onChange={(e) => setNewEmployee({ ...newEmployee, cardlastfour: e.target.value })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {newEmployee.id ? 'Atualizar Empregado' : 'Adicionar Empregado'}
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

          {/* Listagem de Empregados */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lista de Empregados</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cargo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Últimos 4 dígitos do Cartão</th> {/* Novo cabeçalho */}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {employees.map(employee => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{companies.find(company => company.id === employee.company_id)?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.cardlastfour}</td> {/* Novo campo */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => handleEditEmployee(employee.id)} className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-4">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteEmployee(employee.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
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
