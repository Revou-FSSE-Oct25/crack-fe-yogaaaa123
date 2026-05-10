import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';

interface GoogleLoginRequest {
  idToken: string;
}

interface GoogleLoginResponse {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  needsStore?: boolean;
}

export function useGoogleLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (idToken: string) => {
      return await apiClient.post<GoogleLoginResponse>('/auth/google', {
        idToken,
      } as GoogleLoginRequest);
    },
    onSuccess: (data) => {
      if (data.needsStore) {
        router.push('/create-store');
      } else {
        router.push('/admin/dashboard');
      }
    },
  });
}
