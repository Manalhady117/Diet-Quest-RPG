import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { PetProvider } from './context/PetContext.jsx';
import { GameProvider } from './context/GameContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import AppNavigator from './navigation/AppNavigator.jsx';
export { sounds } from './utils/soundEffects.js';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <UserProvider>
          <PetProvider>
            <GameProvider>
              <AppNavigator />
            </GameProvider>
          </PetProvider>
        </UserProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
