import ReactDOM from 'react-dom/client';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { initEditor } from './hooks/useEditor';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🏁 DOMContentLoaded: Initializing editor...');
        initEditor();
    });
} else {
    console.log('⚡ Document ready: Initializing editor...');
    initEditor();
}

try {
    console.log('⚛️ Attempting to mount React app...');
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found');

    ReactDOM.createRoot(rootElement).render(
        <QueryClientProvider client={queryClient}>
            <InternetIdentityProvider>
                <App />
            </InternetIdentityProvider>
        </QueryClientProvider>
    );
    console.log('✅ React app mounted successfully');
} catch (error) {
    console.error('🔥 Fatal error mounting React app:', error);
    document.getElementById('root')!.innerHTML = `<div style="color: red; padding: 20px;">
        <h1>Fatal Error</h1>
        <pre>${error instanceof Error ? error.message : String(error)}</pre>
    </div>`;
}
