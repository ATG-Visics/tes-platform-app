import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

type CleanupFn = () => void;

export type ItemEntry = { itemId: string; element: HTMLElement };

export type ListContextValue = {
  getListLength: () => number;
  registerItem: (entry: ItemEntry) => CleanupFn;
  reorderItem: (args: {
    startIndex: number;
    indexOfTarget: number;
    closestEdgeOfTarget: null;
  }) => void;
  instanceId: symbol;
};

export const ListContext = createContext<ListContextValue | null>(null);

export function useListContext() {
  const listContext = useContext(ListContext);
  invariant(listContext !== null);
  return listContext;
}

export function getItemRegistry() {
  const registry = new Map<string, HTMLElement>();

  function register({ itemId, element }: ItemEntry) {
    registry.set(itemId, element);

    return function unregister() {
      registry.delete(itemId);
    };
  }

  function getElement(itemId: string): HTMLElement | null {
    return registry.get(itemId) ?? null;
  }

  return { register, getElement };
}

export const itemKey = Symbol('item');
export type ItemData<T> = {
  [itemKey]: true;
  item: T;
  index: number;
  instanceId: symbol;
};

export function isItemData<T>(
  data: Record<string | symbol, unknown>,
): data is ItemData<T> {
  return data[itemKey] === true;
}

export function getItemData<T>({
  item,
  index,
  instanceId,
}: {
  item: T;
  index: number;
  instanceId: symbol;
}): ItemData<T> {
  return {
    [itemKey]: true,
    item,
    index,
    instanceId,
  };
}
