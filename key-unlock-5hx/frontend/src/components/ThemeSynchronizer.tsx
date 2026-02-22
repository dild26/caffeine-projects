import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useGetCurrentTheme } from '../hooks/useAppQueries';

export default function ThemeSynchronizer() {
  const { setTheme } = useTheme();
  const { data: backendTheme, isSuccess } = useGetCurrentTheme();

  useEffect(() => {
    if (isSuccess && backendTheme) {
      setTheme(backendTheme);
    }
  }, [backendTheme, isSuccess, setTheme]);

  return null;
}
