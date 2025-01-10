import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace('/SignInScreen'); 
    }, 100); 
  }, []);

  return null; 
}

