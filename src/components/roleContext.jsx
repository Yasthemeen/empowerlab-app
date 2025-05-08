import { createContext, useContext } from 'react';

export const RoleContext = createContext({
  userRole: 'client',
  setUserRole: () => {},
});
export function useRole() {
  return useContext(RoleContext);
}
