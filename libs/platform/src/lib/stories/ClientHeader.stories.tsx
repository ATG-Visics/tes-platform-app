import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { ClientHeader, ClientHeaderProps } from '../ui';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends ClientHeaderProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Client / Client header',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const ClientHeaderTemplate: Story<IProps> = (args) => {
  return <ClientHeader {...args} />;
};

export const ClientHeaderFilledIn = ClientHeaderTemplate.bind({});

ClientHeaderFilledIn.args = {
  client: 'Access Technology Group',
  street1: 'Heksekamp 7',
  street2: 'Building 40',
  postalCode: '5301 LX',
  city: 'Zaltbommel',
  country: 'The Netherlands',
  contactPerson: 'Remco Coenen',
  telephone: '+31 56 12345678',
  email: 'remco.coenen@accesstechnologygroup.com',
};
