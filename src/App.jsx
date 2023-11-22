import axios from 'axios';
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons'

function App() {
  const fetchURL = import.meta.env.VITE_REACT_APP_FETCH_URL;
  const uploadURL = import.meta.env.VITE_REACT_APP_UPLOAD_URL;

  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleFileChange = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
    setSuccess(e.target.files[0].name);
  }

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(fetchURL);
      setTransactions(response.data);

    } catch (error) {
      console.error('Erro fetching transactions:', error)
    } finally {
      setIsLoading(false);
      setError(null);
      setSuccess(null);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const uploadFile = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = axios.post(uploadURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setError(null);
      setSuccess(response.data);

    } catch (error) {
      console.error('Error uploading file: ', error)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));

  }


  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Importação de CNAB</h1>

      {/* File upload form */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <label className="text-gray-600">
            <span className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white py-2 px-4 rounded-lg">
              Choose File
            </span>
            <input type="file" className="hidden" onChange={handleFileChange} accept='.txt' />
          </label>
          <button onClick={uploadFile} className='bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg'>Upload File</button>
        </div>
      </div>

      {success && <p className="text-green-500 mt-2"></p>}
      {error && <p className="text-red-500 mt-2"></p>}

      <br />

      <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 py-2 px-4 rounded-lg mb-4"
        onClick={fetchTransactions}
        disabled={isLoading}
      >
        <FontAwesomeIcon icon={faSync} spin={isLoading} className='mr-2' />
        {isLoading ? 'Atualizando...' : 'Atualizar Transação'}
      </button>

      <div className='p-4'>
        <h2 className='text-2xl font-semibold mb-4'>Transações</h2>
        <ul className='bg-white shadow-md rounded-md p-4'>
          {transactions.length === 0 ? (
            <p className='mb-4 text-gray-500 text-center'>Sem transações disponíveis.</p>
          ) : (transactions.map((report, key) => (
            <li key={key} className='mb-4 p-4 border-b border-gray-300 flex flex-col'>
              <div className='flex justify-between items-center mb-2'>
                <div className='text-xl font-semibold'>{report.nomeDaLoja}</div>
                <div className={`text-${parseFloat(report.total) >= 0 ? 'green' : 'red'}-500 font-semibold`}>Total: {formatCurrency(parseFloat(report.total))}</div>
              </div>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Cartões</th>
                    <th className="px-4 py-2">CPF</th>
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Dono da Loja</th>
                    <th className="px-4 py-2">Hora</th>
                    <th className="px-4 py-2">Nome da Loja</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {report.transacoes.map((transacao, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'border-r-gray-100' : ''}>
                      <td className="px-4 py-2">{transacao.cartao}</td>
                      <td className="px-4 py-2">{transacao.cpf}</td>
                      <td className="px-4 py-2">{transacao.data}</td>
                      <td className="px-4 py-2">{transacao.donoDaLoja}</td>
                      <td className="px-4 py-2">{transacao.hora}</td>
                      <td className="px-4 py-2">{transacao.nomeDaLoja}</td>
                      <td className="px-4 py-2">{transacao.tipo}</td>
                      <td className="px-4 py-2">{formatCurrency(transacao.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </li>
          ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default App;