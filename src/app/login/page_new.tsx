import GoogleAuth from '@/components/auth/GoogleAuth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <GoogleAuth />
      </div>
    </div>
  );
}
