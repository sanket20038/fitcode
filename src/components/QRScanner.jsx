import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      <div className="p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">QR Scanner</h1>
        <p className="text-xl mb-4">This is the QR Scanner page!</p>
        <button 
          onClick={() => navigate('/client/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QRScanner;

