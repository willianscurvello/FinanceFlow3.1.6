import React, { useEffect, useState } from 'react';
import { BarChart, DollarSign, Users, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Importar o cliente Supabase

export function DashboardPage() {
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [activeEmployees, setActiveEmployees] = useState<number>(0);
  const [topSpenders, setTopSpenders] = useState<any[]>([]); // Estado para armazenar os top spenders
  const [expenseTrends, setExpenseTrends] = useState<any[]>([]); // Estado para armazenar as tendências de despesas

  useEffect(() => {
    fetchTotalExpenses();
    fetchActiveEmployees();
    fetchTopSpenders(); // Chamar a função para buscar os top spenders
    fetchExpenseTrends(); // Chamar a função para buscar as tendências de despesas
  }, []);

  const fetchTotalExpenses = async () => {
    const { data, error } = await supabase.from('expenses').select('amount');
    if (error) {
      console.error('Error fetching expenses:', error);
    } else {
      const total = data.reduce((acc: number, expense: { amount: number }) => acc + expense.amount, 0);
      setTotalExpenses(total);
    }
  };

  const fetchActiveEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) {
      console.error('Error fetching employees:', error);
    } else {
      setActiveEmployees(data.length); // Contar o número de empregados
    }
  };

  const fetchTopSpenders = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('employee_id, amount')
      .order('amount', { ascending: false }); // Ordenar despesas do maior para o menor

    if (error) {
      console.error('Error fetching top spenders:', error);
    } else {
      const spendersMap: { [key: string]: number } = {};
      data.forEach((expense: { employee_id: string; amount: number }) => {
        spendersMap[expense.employee_id] = (spendersMap[expense.employee_id] || 0) + expense.amount;
      });

      const topSpendersArray = await Promise.all(
        Object.entries(spendersMap).map(async ([employee_id, totalSpent]) => {
          const { data: employeeData } = await supabase
            .from('employees')
            .select('name')
            .eq('id', employee_id)
            .single();
          return { employeeName: employeeData?.name || 'Desconhecido', totalSpent };
        })
      );

      topSpendersArray.sort((a, b) => b.totalSpent - a.totalSpent); // Ordenar do maior para o menor
      setTopSpenders(topSpendersArray.slice(0, 5)); // Pegar os 5 maiores
    }
  };

  const fetchExpenseTrends = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('category, amount');

    if (error) {
      console.error('Error fetching expense trends:', error);
    } else {
      const trendsMap: { [key: string]: number } = {};
      data.forEach((expense: { category: string; amount: number }) => {
        trendsMap[expense.category] = (trendsMap[expense.category] || 0) + expense.amount;
      });

      const trendsArray = Object.entries(trendsMap)
        .map(([category, totalSpent]) => ({ category, totalSpent }))
        .sort((a, b) => b.totalSpent - a.totalSpent) // Ordenar do maior para o menor
        .slice(0, 5); // Pegar os 5 maiores

      setExpenseTrends(trendsArray);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex gap-4">
          <select className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <select className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option>All Companies</option>
            <option>Company A</option>
            <option>Company B</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} // Formatação com separador de milhar
          change="+12.5%"
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Active Employees"
          value={activeEmployees.toString()} // Exibir o número de empregados
          change="+3.2%"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Companies"
          value="12"
          change="0%"
          icon={Building2}
          trend="neutral"
        />
        <MetricCard
          title="Pending Approvals"
          value="23"
          change="-5.1%"
          icon={BarChart}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Spenders
          </h2>
          <div className="space-y-4">
            {topSpenders.map(spender => (
              <div key={spender.employeeName} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-900 dark:text-white">{spender.employeeName}</span>
                <span className="font-semibold text-gray-900 dark:text-white">${spender.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expense Trends
          </h2>
          <div className="space-y-4">
            {expenseTrends.map(trend => (
              <div key={trend.category} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-900 dark:text-white">{trend.category}</span>
                <span className="font-semibold text-gray-900 dark:text-white">${trend.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
}) {
  const trendColor = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  }[trend];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
          <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </div>
      </div>
      <p className={`mt-4 text-sm ${trendColor}`}>{change} from last period</p>
    </div>
  );
}
