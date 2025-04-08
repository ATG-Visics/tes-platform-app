import { Mention, MentionsInput } from 'react-mentions';
import { Box } from '@mui/material';

interface IProps {
  data?: string;
  label?: string;
  inputValue: string;
  setInputValue: (ev: { target: { value: string } }) => void;
  atMentionData: { id: string; display: string }[];
  hashtagMentionData: { id: string; display: string }[];
  atMentionDisplayTransformHandler: (id: string, display: string) => string;
  hashtagMentionDisplayTransformHandler: (
    id: string,
    display: string,
  ) => string;
}

export type MentionInputProps = IProps;

export function MentionInput(props: IProps) {
  const {
    inputValue,
    label,
    setInputValue,
    atMentionData,
    atMentionDisplayTransformHandler,
    hashtagMentionData,
    hashtagMentionDisplayTransformHandler,
  } = props;

  return (
    <>
      <Box
        component="span"
        sx={{
          borderTopRightRadius: '4px',
          borderTopLeftRadius: '4px',
          display: 'block',
          color: 'rgba(0, 0, 0, 0.6)',
          backgroundColor: 'rgb(0 0 0 / 4%)',
          fontWeight: 400,
          lineHeight: '1.4375em',
          letterSpacing: '0.00938em',
          width: 'auto',
          padding: '8px 8px 0px 8px',
          height: 'auto',
          fontSize: '12px',
          pointerEvents: 'none',
          marginTop: 1,
        }}
      >
        {label}
      </Box>
      <MentionsInput
        value={inputValue}
        onChange={(event) => setInputValue(event)}
        className={'mentionInput'}
        forceSuggestionsAboveCursor={true}
      >
        <Mention
          trigger="@"
          data={atMentionData}
          markup="@[__id__]"
          displayTransform={atMentionDisplayTransformHandler}
          appendSpaceOnAdd
        />
        <Mention
          trigger="#"
          data={hashtagMentionData}
          markup="#[__id__]"
          displayTransform={hashtagMentionDisplayTransformHandler}
          appendSpaceOnAdd
        />
      </MentionsInput>
    </>
  );
}
