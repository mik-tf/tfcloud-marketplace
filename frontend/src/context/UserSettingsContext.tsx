import React, { createContext, useState, useEffect } from 'react';

interface UserSettingsContextValue {
  nodeOperatorMode: boolean;
  setNodeOperatorMode: (value: boolean) => void;
}

export const UserSettingsContext = createContext<UserSettingsContextValue>({
  nodeOperatorMode: false,
  setNodeOperatorMode: () => {},
});

export const UserSettingsProvider: React.FC = ({ children }) => {
  const [nodeOperatorMode, setNodeOperatorMode] = useState<boolean>(() => {
    return localStorage.getItem('nodeOperatorMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('nodeOperatorMode', nodeOperatorMode.toString());
  }, [nodeOperatorMode]);

  return (
    <UserSettingsContext.Provider value={{ nodeOperatorMode, setNodeOperatorMode }}>
      {children}
    </UserSettingsContext.Provider>
  );
};
