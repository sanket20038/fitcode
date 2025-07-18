import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Dumbbell, User, Building } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-300 p-6">
      <Card className="w-full max-w-md shadow-xl rounded-lg border border-gray-300">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-700 p-5 rounded-full shadow-lg animate-pulse">
              <Dumbbell className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-extrabold text-gray-900">Login to FitCode</CardTitle>
          <CardDescription className="text-gray-700 mt-2">Choose your login type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 mt-8">
            <Link to="/login/client" className="w-full">
              <button className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                <User className="h-6 w-6" />
                Client Login
              </button>
            </Link>
            <Link to="/login/owner" className="w-full">
              <button className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
                <Building className="h-6 w-6" />
                Gym Owner Login
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
