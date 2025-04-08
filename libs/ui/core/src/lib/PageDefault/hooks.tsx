import React, {
  Dispatch,
  useReducer,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

type State = {
  isOpen: boolean;
  variant: 'persistent' | 'temporary';
};

type Action =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'toggle' }
  | { type: 'changeVariant'; variant: State['variant'] };

export const SidebarContext = createContext<State>({
  isOpen: true,
  variant: 'persistent',
});

const SidebarDispatch = createContext<Dispatch<Action>>((action) => {
  return action;
});

function sidebarReducer(state: State, action: Action) {
  switch (action.type) {
    case 'toggle':
      return { ...state, isOpen: !state.isOpen };
    case 'open':
      return { ...state, isOpen: true };
    case 'close':
      return { ...state, isOpen: false };
    case 'changeVariant':
      return { ...state, variant: action.variant };
    default:
      return state;
  }
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.values.md}px)`,
  );

  const [state, dispatch] = useReducer(sidebarReducer, {
    isOpen: isSmallScreen,
    variant: 'persistent',
  });

  return (
    <SidebarDispatch.Provider value={dispatch}>
      <SidebarContext.Provider value={state}>
        {children}
      </SidebarContext.Provider>
    </SidebarDispatch.Provider>
  );
}

export function useSidebarState() {
  return useContext(SidebarContext);
}

export function useSidebar() {
  const dispatch = useContext(SidebarDispatch);

  return useMemo(
    () => ({
      open() {
        dispatch({ type: 'open' });
      },
      close() {
        dispatch({ type: 'close' });
      },
      toggle() {
        dispatch({ type: 'toggle' });
      },
      changeVariantToPersistent() {
        dispatch({ type: 'changeVariant', variant: 'persistent' });
      },
      changeVariantToTemporary() {
        dispatch({ type: 'changeVariant', variant: 'temporary' });
      },
    }),
    [dispatch],
  );
}
