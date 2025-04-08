import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import {
  QuestionsGroupControlRenderer,
  QuestionsGroupControlTester,
} from './QuestionGroupControl';
import {
  GroupSelectorControlRenderer,
  GroupSelectorControlTester,
} from './GroupSelectorControl';
import {
  TextControlWithMentionRenderer,
  TextControlWithMentionTester,
} from './TextControlWithMention';
import {
  DynamicControlWithOtherAndMentionRenderer,
  DynamicControlWithOtherAndMentionTester,
} from './DynamicControlWithOtherAndMention';

export const questionExtraRenderers: JsonFormsRendererRegistryEntry[] = [
  {
    tester: QuestionsGroupControlTester,
    renderer: QuestionsGroupControlRenderer,
  },
  {
    tester: GroupSelectorControlTester,
    renderer: GroupSelectorControlRenderer,
  },
  {
    tester: TextControlWithMentionTester,
    renderer: TextControlWithMentionRenderer,
  },
  {
    tester: DynamicControlWithOtherAndMentionTester,
    renderer: DynamicControlWithOtherAndMentionRenderer,
  },
];
