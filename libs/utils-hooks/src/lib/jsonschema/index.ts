import { JsonSchema7 } from '@jsonforms/core';
import has from 'lodash.has';
import set from 'lodash.set';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';
import unset from 'lodash.unset';

/**
 * Updates the oneOf value (dynamically), making sure a valid oneOf attribute ends up in the schema.
 *
 * If more than 1 value is present, the key is applied. In any other case, the oneOf validation if removed
 * for it won't work.
 *
 * @param newItemList List of allowed items (const)
 * @param setSchemaState
 * @param path
 */
export function updateOneOfValidator(
  newItemList: { const: string | number }[] | undefined,
  setSchemaState: (
    value: ((prevState: JsonSchema7) => JsonSchema7) | JsonSchema7,
  ) => void,
  path: string[],
) {
  if (!newItemList || newItemList.length < 0) {
    setSchemaState((prevState) => {
      if (has(prevState, path)) {
        unset(prevState, path);
      }
      return prevState;
    });
    return;
  }

  setSchemaState((prevState) => {
    if (!isEqual(get(prevState, path), newItemList)) {
      return {
        ...set(prevState, path, newItemList),
      };
    }
    return prevState;
  });
}
