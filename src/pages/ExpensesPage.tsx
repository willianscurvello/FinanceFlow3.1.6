import React, { useState, useEffect } from 'react';
    import { Plus, Edit, Trash } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { supabase } from '../lib/supabase'; // Importar o cliente Supabase

    interface Expense {
      id: number;
      description: string;
      category: string;
      employee_id: string; // Alterado para employee_id
      card_last_four: string; // Alterado para card_last_four
      date: string;
      amount: number;
      receipt_link: string;
      consolidated: boolean;
      employeeName: string; // Adicionado para armazenar o nome do empregado
    }

    interface Company {
      id: string;
      name: string;
    }

    interface Employee {
      id: string;
      name: string;
      cardlastfour: string; // Adicionado para armazenar os últimos 4 dígitos do cartão
    }

    export function ExpensesPage() {
      const { user } = useAuth();
      const [expenses, setExpenses] = useState<Expense[]>([]);
      const [newExpense, setNewExpense] = useState<Expense>({
        id: 0,
        description: '',
        category: '',
        employee_id: '', // Alterado para employee_id
        card_last_four: '', // Alterado para card_last_four
        date: '',
        amount: 0,
        receipt_link: '',
        consolidated: false,
        employeeName: '', // Adicionado para armazenar o nome do empregado
      });
      const [isPopupOpen, setIsPopupOpen] = useState(false);
      const [companies, setCompanies] = useState<Company[]>([]);
      const [employees, setEmployees] = useState<Employee[]>([]);
      const [selectedCompany, setSelectedCompany] = useState<string>('');

      useEffect(() => {
        fetchExpenses();
        fetchCompanies();
      }, []);

      const fetchExpenses = async () => {
        const { data, error } = await supabase.from('expenses').select('*');
        if (error) {
          console.error('Error fetching expenses:', error);
        } else {
          // Obter os nomes dos empregados
          const expensesWithNames = await Promise.all(data.map(async (expense: Expense) => {
            const { data: employeeData } = await supabase
              .from('employees')
              .select('name')
              .eq('id', expense.employee_id)
              .single();
            return { ...expense, employeeName: employeeData?.name || 'Desconhecido' };
          }));
          setExpenses(expensesWithNames);
        }
      };

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

      const fetchEmployees = async (companyId: string) => {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('company_id', companyId); // Filtrar empregados pela empresa selecionada

        if (error) {
          console.error('Error fetching employees:', error);
        } else {
          setEmployees(data);
        }
      };

      const handleAddOrUpdateExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Verificar se os campos estão preenchidos
        if (!newExpense.description || !newExpense.category || !newExpense.employee_id || !newExpense.card_last_four || !newExpense.date || newExpense.amount <= 0) {
          alert('Por favor, preencha todos os campos corretamente.');
          return;
        }

        if (newExpense.id) {
          // Se estamos editando uma despesa existente
          const { error } = await supabase
            .from('expenses')
            .update({ 
              description: newExpense.description,
              category: newExpense.category,
              employee_id: newExpense.employee_id,
              card_last_four: newExpense.card_last_four,
              date: newExpense.date,
              amount: newExpense.amount,
              receipt_link: newExpense.receipt_link,
              consolidated: newExpense.consolidated,
            })
            .match({ id: newExpense.id }); // Encontrar a despesa pelo ID

          if (error) {
            console.error('Error updating expense:', error);
            alert('Erro ao atualizar gasto: ' + error.message); // Exibir mensagem de erro
          } else {
            setIsPopupOpen(false); // Fechar a popup após editar
            fetchExpenses(); // Atualizar a lista de despesas
          }
        } else {
          // Se estamos adicionando uma nova despesa
          const { data, error } = await supabase
            .from('expenses')
            .insert([{ 
              description: newExpense.description,
              category: newExpense.category,
              employee_id: newExpense.employee_id,
              card_last_four: newExpense.card_last_four,
              date: newExpense.date,
              amount: newExpense.amount,
              receipt_link: newExpense.receipt_link,
              consolidated: newExpense.consolidated,
            }]);

          if (error) {
            console.error('Error adding expense:', error);
            alert('Erro ao adicionar gasto: ' + error.message); // Exibir mensagem de erro
          } else {
            // Obter o nome do empregado após a inserção
            const employeeData = await supabase
              .from('employees')
              .select('name')
              .eq('id', newExpense.employee_id)
              .single();

            setExpenses([...expenses, { ...newExpense, id: expenses.length + 1, employeeName: employeeData.data?.name || 'Desconhecido' }]);
            setNewExpense({
              id: 0,
              description: '',
              category: '',
              employee_id: '', // Alterado para employee_id
              card_last_four: '', // Alterado para card_last_four
              date: '',
              amount: 0,
              receipt_link: '',
              consolidated: false,
              employeeName: '', // Adicionado para armazenar o nome do empregado
            });
            setIsPopupOpen(false); // Fechar a popup após adicionar
          }
        }
      };

      const handleEditExpense = (id: number) => {
        const expenseToEdit = expenses.find(expense => expense.id === id);
        if (expenseToEdit) {
          setNewExpense(expenseToEdit);
          setIsPopupOpen(true);
        }
      };

      const handleDeleteExpense = async (id: number) => {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .match({ id });

        if (error) {
          console.error('Error deleting expense:', error);
        } else {
          setExpenses(expenses.filter(expense => expense.id !== id));
        }
      };

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gastos</h1>
            <button
              onClick={() => {
                setNewExpense({
                  id: 0,
                  description: '',
                  category: '',
                  employee_id: '',
                  card_last_four: '',
                  date: '',
                  amount: 0,
                  receipt_link: '',
                  consolidated: false,
                  employeeName: '',
                });
                setIsPopupOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Gasto
            </button>
          </div>

          {/* Popup para Adicionar/Editar Gasto */}
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">{newExpense.id ? 'Editar Gasto' : 'Adicionar Gasto'}</h2>
                <form onSubmit={handleAddOrUpdateExpense} className="space-y-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empresa</label>
                    <select
                      id="company"
                      value={selectedCompany}
                      onChange={(e) => {
                        setSelectedCompany(e.target.value);
                        fetchEmployees(e.target.value); // Carregar empregados da empresa selecionada
                      }}
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
                    <label htmlFor="employee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empregado</label>
                    <select
                      id="employee"
                      value={newExpense.employee_id} // Alterado para employee_id
                      onChange={(e) => {
                        const selectedEmployee = employees.find(emp => emp.id === e.target.value);
                        setNewExpense({ ...newExpense, employee_id: e.target.value, card_last_four: selectedEmployee?.cardlastfour || '' });
                      }}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    >
                      <option value="">Selecione um empregado</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição do Gasto</label>
                    <input
                      type="text"
                      id="description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria do Gasto</label>
                    <input
                      type="text"
                      id="category"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="card_last_four" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Últimos 4 dígitos do Cartão</label>
                    <span
                      id="card_last_four"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 p-2"
                    >
                      {newExpense.card_last_four}
                    </span>
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data e Hora</label>
                    <input
                      type="datetime-local"
                      id="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor do Gasto</label>
                    <input
                      type="number"
                      id="amount"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="receiptLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Link do Comprovante</label>
                    <input
                      type="url"
                      id="receiptLink"
                      value={newExpense.receipt_link}
                      onChange={(e) => setNewExpense({ ...newExpense, receipt_link: e.target.value })}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {newExpense.id ? 'Atualizar Gasto' : 'Adicionar Gasto'}
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

          {/* Listagem de Gastos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lista de Gastos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Empregado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cartão</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comprovante</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {expenses.map(expense => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.employeeName}</td> {/* Exibir o nome do empregado */}
                      <td className="px-6 py-4 whitespace-nowrap">{expense.card_last_four}</td> {/* Exibir os últimos 4 dígitos do cartão */}
                      <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={expense.receipt_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => handleEditExpense(expense.id)} className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-4">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
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
