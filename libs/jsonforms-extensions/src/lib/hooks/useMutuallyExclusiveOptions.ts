import { useCallback } from 'react';

interface UseMutuallyExclusiveOptionsProps {
  oneOfList: Array<{ title: string; const: string }>;
  mutuallyExclusiveOptions: string[];
  data: string[] | undefined;
  handleChange: (path: string, value: string[]) => void;
}

export const useMutuallyExclusiveOptions = ({
  oneOfList,
  mutuallyExclusiveOptions,
  data,
  handleChange,
}: UseMutuallyExclusiveOptionsProps) => {
  const isMutuallyExclusive = useCallback(
    (value: string) => {
      const option = oneOfList.find((item) => item.const === value);
      return option
        ? mutuallyExclusiveOptions.includes(option.title.toLowerCase())
        : false;
    },
    [oneOfList, mutuallyExclusiveOptions],
  );

  const getFinalValue = useCallback(
    (newValue: string[], oldValue: string[]) => {
      if (!newValue) {
        return oldValue;
      }
      const newSelections = newValue.filter((v) => !oldValue.includes(v));

      if (newSelections.length === 1) {
        const [selectedValue] = newSelections;
        if (isMutuallyExclusive(selectedValue)) {
          return [selectedValue];
        }
        return [
          ...oldValue.filter((value) => !isMutuallyExclusive(value)),
          selectedValue,
        ];
      }

      return newSelections.length === 0
        ? newValue
        : newValue.filter((value) => !isMutuallyExclusive(value));
    },
    [isMutuallyExclusive],
  );

  const handleMutuallyExclusiveChange = useCallback(
    (path: string, newValue: string[]) => {
      const oldValue = data || [];
      const finalValue = getFinalValue(newValue, oldValue);

      if (JSON.stringify(data) !== JSON.stringify(finalValue)) {
        handleChange(path, finalValue);
      }
    },
    [data, handleChange, getFinalValue],
  );

  return {
    handleMutuallyExclusiveChange,
    isMutuallyExclusive,
  };
};
