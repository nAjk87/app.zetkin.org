import messageIds from 'features/organizations/l10n/messageIds';
import NextLink from 'next/link';
import OrganizationsDataModel from '../models/OrganizationsDataModel';
import { useMessages } from 'core/i18n';
import { ZetkinOrganization } from 'utils/types/zetkin';

import ZUIFuture from 'zui/ZUIFuture';
import ZUIList from 'zui/ZUIList';
import { Box, Link, Typography } from '@mui/material';

interface UserOrganizationsProps {
  model: OrganizationsDataModel;
}

const OrganizationsList = ({ model }: UserOrganizationsProps) => {
  const messages = useMessages(messageIds);
  return (
    <ZUIFuture future={model.getData()}>
      {(data) => {
        return (
          <Box style={{ margin: '30px' }}>
            <Typography variant="h3">{messages.page.title()}</Typography>
            {data.map((org: ZetkinOrganization) => {
              return (
                <Box key={org.id} style={{ marginTop: '15px' }}>
                  <ZUIList>
                    <NextLink href={`/organize/${org.id}/campaigns/`} passHref>
                      <Link underline="hover">{org.title}</Link>
                    </NextLink>
                  </ZUIList>
                </Box>
              );
            })}
          </Box>
        );
      }}
    </ZUIFuture>
  );
};

export default OrganizationsList;
