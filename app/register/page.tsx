import { handleSignUp } from "@/app/actions";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h1>
        
        <form action={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              name="name" 
              type="text" 
              placeholder="John Doe"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              name="email" 
              type="email" 
              placeholder="john@example.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
}