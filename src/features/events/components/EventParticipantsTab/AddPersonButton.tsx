import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, IconButton, Popover } from '@mui/material';
import { EmojiPeople, People } from '@mui/icons-material';
import { useRef, useState } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from '../../l10n/messageIds';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import ZUIFutures from 'zui/ZUIFutures';
import { Msg, useMessages } from 'core/i18n';

interface AddPersonButtonProps {
  model: EventDataModel;
}

const AddPersonButton = ({ model }: AddPersonButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const messages = useMessages(messageIds);

  const handleSelectedPerson = (personId: number) => {
    model.addParticipant(personId);
  };

  const selectInputRef = useRef<HTMLInputElement>();

  return (
    <>
      <IconButton
        onClick={(ev) => {
          setAnchorEl(ev.target as Element);
        }}
        sx={{ fontSize: '1rem' }}
      >
        <PersonAddIcon sx={{ mr: 1 }} />
        <Msg id={messageIds.addPerson.addButton} />
      </IconButton>

      <Popover
        elevation={1}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={() => setAnchorEl(null)}
        open={!!anchorEl}
        PaperProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '40vh',
            width: '40vh',
            maxWidth: '400px',
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <Box mt={1} p={2}>
          <ZUIFutures
            futures={{
              participants: model.getParticipants(),
              respondents: model.getRespondents(),
            }}
          >
            {({ data: { participants, respondents } }) => {
              console.log(participants);
              console.log(respondents);

              const settingStatus = (personId: number) => {
                if (
                  participants.some(
                    (participant) => participant.id === personId
                  )
                ) {
                  return (
                    <Box
                      sx={{
                        color: '#A8A8A8',
                        fontSize: '0.9rem',
                        display: 'flex',
                      }}
                    >
                      <People sx={{ fontSize: '1.3rem', mr: 1 }} />
                      <Msg id={messageIds.addPerson.status.booked} />
                    </Box>
                  );
                }
                if (
                  respondents.some((respondent) => respondent.id === personId)
                ) {
                  return (
                    <Box
                      sx={{
                        color: '#A8A8A8',
                        fontSize: '0.9rem',
                        display: 'flex',
                      }}
                    >
                      <EmojiPeople sx={{ fontSize: '1.3rem', mr: 1 }} />
                      <Msg id={messageIds.addPerson.status.signedUp} />
                    </Box>
                  );
                }
                return '';
              };

              return (
                <>
                  <ZUIPersonSelect
                    getOptionExtraLabel={(option) => {
                      return settingStatus(option.id);
                    }}
                    inputRef={selectInputRef}
                    name="person"
                    onChange={(person) => {
                      handleSelectedPerson(person.id);
                    }}
                    placeholder={messages.addPerson.addPlaceholder()}
                    selectedPerson={null}
                    variant="outlined"
                  />
                </>
              );
            }}
          </ZUIFutures>
        </Box>
      </Popover>
    </>
  );
};

export default AddPersonButton;

//   <Box sx={{ color: '#A8A8A8', fontSize: '0.9rem', display: 'flex' }}>
//     <DoDisturb sx={{ fontSize: '1.3rem', mr: 1 }} />
//     <Msg id={messageIds.addPerson.status.signedUp} />
//   </Box>
