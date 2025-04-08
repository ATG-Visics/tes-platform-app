import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import {
  AlternateEmail as AlternateEmailIcon,
  AttachFile as AttachFileIcon,
  AttachMoney as AttachMoneyIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Send as SendIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { LogFile } from '../LogFile/LogFile';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormTheme } from '@tes/ui/form';
import { Mention, MentionsInput } from 'react-mentions';
import * as colors from '@tes/ui/colors';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';

interface IProps {
  logMessages: Array<{
    id: string;
    author: {
      id: number;
      username: string;
      getFullName: string;
    };
    surveyMoment: string;
    message: string | null;
    file: { file: string; url: string; mimetype: string; name: string } | null;
    createdAt: string;
    mentions?: {
      subjects?: { id: string; title: string }[];
      samples?: { id: string; title: string }[];
    };
  }>;
  attachmentOnClick: (file: File) => void;
  onFormSubmit: (e: FormEvent) => void;
  setData: Dispatch<
    SetStateAction<
      Partial<{
        author: string | number;
        surveyMoment: {
          project: string;
          startDate: string;
        };
        message: string;
      }>
    >
  >;
  clearInput: boolean;
  setClearInput: Dispatch<SetStateAction<boolean>>;
  atMentionData: { id: string; display: string }[];
  hashtagMentionData: { id: string; display: string }[];
  onClickDownload: () => void;
  updatedLogMessage: string;
  handleUpdate: Dispatch<SetStateAction<string>>;
  submitUpdatedMessage: ({
    e,
    messageId,
  }: {
    e: FormEvent;
    messageId: string;
  }) => void;
  updateState: boolean;
  setUpdateState: Dispatch<SetStateAction<boolean>>;
}

export type LogCardProps = IProps;

export function LogCard(props: IProps) {
  const isClient = useSelector(selectIsClient);
  const {
    logMessages,
    onFormSubmit,
    attachmentOnClick,
    setData,
    clearInput,
    setClearInput,
    atMentionData,
    hashtagMentionData,
    onClickDownload,
    updatedLogMessage,
    handleUpdate,
    submitUpdatedMessage,
    updateState,
    setUpdateState,
  } = props;
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setClearInput(false);

    setData((prevState) => ({ ...prevState, message: inputValue }));
  }, [inputValue, setClearInput, setData]);

  useEffect(() => {
    if (!clearInput) {
      return;
    }

    setInputValue('');
  }, [clearInput, setInputValue]);

  const element = document.getElementById('scrollToHere');

  useEffect(() => {
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
  }, [element]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    });
  };
  useEffect(scrollToBottom, [logMessages]);

  const atMentionDisplayTransformHandler = useCallback(
    (id: string, display: string) => {
      const atMention = atMentionData.find((item) => item.id === id);
      return `@${atMention?.display || display}`;
    },
    [atMentionData],
  );

  const hashtagMentionDisplayTransformHandler = useCallback(
    (id: string, display: string) => {
      const hashtagMention = hashtagMentionData.find((item) => item.id === id);
      return `#${hashtagMention?.display || display}`;
    },
    [hashtagMentionData],
  );

  const dollarMentionDisplayTransformHandler = useCallback(
    (id: string, display: string) => {
      const dollarMention = hashtagMentionData.find((item) => item.id === id);
      return `$${dollarMention?.display || display}`;
    },
    [hashtagMentionData],
  );

  return (
    <Card
      sx={{
        height: 'auto',
        width: '100%',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant={'h6'}
          sx={{ flexGrow: 1, color: colors.accent1['700'] }}
        >
          Daily log
        </Typography>
        {!isClient && (
          <Button onClick={onClickDownload} variant="contained">
            DownLoad PDF
          </Button>
        )}
      </Box>
      <Accordion
        sx={{
          boxShadow: 'none',
          mb: 0,
          '.Mui-expanded': {
            mb: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="daily-log-info"
          id="daily-log-info"
          sx={{
            '&.Mui-expanded': { minHeight: '45px' },
            '& .MuiAccordionSummary-content.Mui-expanded': {
              my: 0,
            },
          }}
        >
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            Daily log information{' '}
            <InfoIcon sx={{ ml: 2, color: 'lightgray' }} />
          </Typography>
          <Divider variant="fullWidth" />
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Divider variant="fullWidth" />
          <List dense sx={{ py: 0 }}>
            <ListItem>
              <ListItemIcon>
                <AlternateEmailIcon />
              </ListItemIcon>
              <ListItemText primary="Tag a Person or an Area." />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <ListItemIcon>
                <TagIcon />
              </ListItemIcon>
              <ListItemText primary="Tag a Sample or ALL Samples" />
            </ListItem>
            <Divider variant="middle" />
            <ListItem>
              <ListItemIcon>
                <AttachMoneyIcon />
              </ListItemIcon>
              <ListItemText primary="Checked a Sample or ALL Samples" />
            </ListItem>
            <Divider variant="middle" />
          </List>
        </AccordionDetails>
      </Accordion>
      <Divider />
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          maxHeight: '380px',
          overflow: 'auto',
        }}
      >
        {logMessages.length > 0 ? (
          logMessages.map((message, index) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                  width: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    sx={{ height: '16px', width: '16px', fontSize: '0.75rem' }}
                  >
                    {Array.from(message.author.username)[0]}
                  </Avatar>

                  <Typography variant={'caption'} sx={{ lineHeight: 1.5 }}>
                    {message.author.getFullName}
                  </Typography>
                </Box>
                <Typography
                  variant={'caption'}
                  sx={{ lineHeight: 1.5, color: `#c2c1c1` }}
                >
                  {dayjs(message.createdAt).format('DD MMM, H:mm')}
                </Typography>
              </Box>
              <Box
                sx={{
                  mb: 1,
                  backgroundColor: '#659190',
                  borderBottomLeftRadius: '15px',
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px',
                  maxWidth: '75%',
                  ...(message.file
                    ? {
                        p: 1,
                      }
                    : {
                        p: 2,
                      }),
                  wordBreak: 'break-word',
                }}
                id={index === logMessages.length - 1 ? 'scrollToHere' : ''}
              >
                {message.file ? (
                  <LogFile file={message.file} />
                ) : (
                  <>
                    {updateState ? (
                      <form
                        onSubmit={(e) =>
                          submitUpdatedMessage({ e, messageId: message.id })
                        }
                      >
                        <Box sx={{ color: '#fff' }}>
                          <TextField
                            sx={{
                              color: '#fff',
                              ':hover': {
                                color: '#fff',
                              },
                              '.MuiInputBase-root': {
                                color: '#fff',
                              },
                              '.MuiInputBase-root:hover': {
                                color: '#fff',
                              },
                              '.MuiInputBase-root:before': {
                                borderBottomColor: '#fff',
                              },
                              '.MuiInput-root:hover:not(.Mui-disabled):before':
                                {
                                  borderBottomColor: '#fff',
                                },
                              '.MuiInputBase-root:after': {
                                borderBottomColor: '#fff',
                              },
                            }}
                            variant="standard"
                            multiline
                            value={updatedLogMessage}
                            onChange={(event) =>
                              handleUpdate(event.target.value)
                            }
                          />
                          <IconButton
                            size="small"
                            sx={{ color: '#fff' }}
                            type="submit"
                          >
                            <SendIcon />
                          </IconButton>
                        </Box>
                      </form>
                    ) : (
                      <Typography
                        variant={'body2'}
                        sx={{ color: '#fff', fontSize: '1rem' }}
                      >
                        {message.message}
                        <IconButton
                          sx={{ color: '#fff' }}
                          onClick={() => {
                            setUpdateState(true);
                            handleUpdate(message.message as string);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Box>
          ))
        ) : (
          <Typography sx={{ color: 'rgba(0, 0, 0, 0.5)' }}>
            Nothing here, write something to start the log…
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Divider />
      {!isClient && (
        <form onSubmit={onFormSubmit}>
          <FormTheme>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',

                '& .mentionInput': {
                  width: '100%',
                  maxWidth: 'calc(100% - 129px)',

                  '.mentionInput__input': {
                    padding: 2,
                    border: 'none',
                    height: 54,
                  },

                  '.mentionInput__suggestions': {
                    '.mentionInput__suggestions__list': {
                      backgroundColor: '#fff',
                      color: colors.accent1['700'],
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '4px',
                      fontSize: 14,
                      display: 'block',
                    },
                    '.mentionInput__suggestions__item': {
                      padding: '5px 15px',
                      borderBottom: '1px solid rgba(0,0,0,0.15)',
                      '&:hover, &:focus': {
                        backgroundColor: colors.accent2['400'],
                        color: '#fff',
                        fontWeight: 700,
                      },
                    },
                    '.mentionInput__suggestions__item--focused': {
                      backgroundColor: colors.accent2['400'],
                      color: '#fff',
                      fontWeight: 700,
                    },
                  },

                  '.mentionInput__highlighter': {
                    boxSizing: 'border-box',
                    padding: 2,
                  },
                },
              }}
            >
              <MentionsInput
                value={inputValue}
                placeholder={'Type a message…'}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    onFormSubmit(event);
                  }
                }}
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
                <Mention
                  trigger="$"
                  data={hashtagMentionData}
                  markup="$[__id__]"
                  displayTransform={dollarMentionDisplayTransformHandler}
                  appendSpaceOnAdd
                />
              </MentionsInput>

              <Divider orientation="vertical" flexItem />
              <Box sx={{ mx: 1, display: 'flex', gap: 1 }}>
                <Button
                  component="label"
                  startIcon={<AttachFileIcon />}
                  fullWidth={false}
                  sx={{ width: 'fit-content', zIndex: 1 }}
                  size="large"
                >
                  <input
                    type="file"
                    hidden
                    onChange={({ target: { files } }) =>
                      attachmentOnClick(files?.[0] as File)
                    }
                  />
                </Button>
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </FormTheme>
        </form>
      )}
    </Card>
  );
}
