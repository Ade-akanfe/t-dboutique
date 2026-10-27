'use client';

import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ProductProvider>
          {children}
          <ScrollToTop />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid #D4AF37',
              },
              success: {
                iconTheme: {
                  primary: '#D4AF37',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ProductProvider>
      </AuthProvider>
    </Provider>
  );
}
