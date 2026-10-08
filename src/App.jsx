import React from 'react';
import { CommandProvider } from './context/CommandContext';
import { AppLayout } from './components/layout/AppLayout';

export function App() {
  return (
    <CommandProvider>
      <AppLayout />
    </CommandProvider>
  );
}

export default App;
