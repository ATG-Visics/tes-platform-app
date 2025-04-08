import { Meta, Story } from '@storybook/react';
import { defaultDecorators } from '@tes/storybook';
import { Button, ButtonProps, Box, Typography } from '@mui/material';

export default {
  title: 'Design / Buttons',
  decorators: defaultDecorators,
} as Meta;

const colors: Array<ButtonProps['color']> = [
  'primary',
  'secondary',
  'info',
  'error',
  'success',
  'warning',
];

function ButtonPreview(props: ButtonProps) {
  return (
    <Box>
      <Typography
        component="span"
        variant="caption"
        gutterBottom
        display="block"
      >
        {props.children}
      </Typography>
      <div>
        <Button {...props} />
      </div>
    </Box>
  );
}

const ButtonTemplate: Story<{ variant: ButtonProps['variant'] }> = ({
  variant,
}) => {
  const defaultButtons = colors.map((c) => (
    <ButtonPreview
      key={`${c}-default`}
      color={c}
      variant={variant}
      children={c}
    />
  ));

  const defaultDisabledButtons = colors.map((c) => (
    <ButtonPreview
      key={`${c}-disabled`}
      color={c}
      variant={variant}
      disabled
      children={c}
    />
  ));

  const buttonsSmall = colors.map((c) => (
    <ButtonPreview
      key={`${c}-size-small`}
      color={c}
      variant={variant}
      size="small"
      children={c}
    />
  ));

  const buttonsLarge = colors.map((c) => (
    <ButtonPreview
      key={`${c}-size-large`}
      color={c}
      variant={variant}
      size="large"
      children={c}
    />
  ));

  return (
    <Box display="flex" flexDirection="column" sx={{ gap: 4 }}>
      <div>
        <Typography variant="h6">Size: medium (standaard)</Typography>
        <Box display="flex" sx={{ gap: 2 }}>
          {defaultButtons}
        </Box>
      </div>

      <div>
        <Typography variant="h6">Disabled</Typography>
        <Box display="flex" sx={{ gap: 2 }}>
          {defaultDisabledButtons}
        </Box>
      </div>

      <div>
        <Typography variant="h6">Size: small</Typography>
        <Box display="flex" sx={{ gap: 2 }}>
          {buttonsSmall}
        </Box>
      </div>
      <div>
        <Typography variant="h6">Size: large</Typography>
        <Box display="flex" sx={{ gap: 2 }}>
          {buttonsLarge}
        </Box>
      </div>
    </Box>
  );
};

export const TextButtons = ButtonTemplate.bind({});

export const ContainedButtons = ButtonTemplate.bind({});

ContainedButtons.args = {
  variant: 'contained',
};

export const OutlinedButtons = ButtonTemplate.bind({});

OutlinedButtons.args = {
  variant: 'outlined',
};
