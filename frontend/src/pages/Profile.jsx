import { Container, Flex, Box, Text, Button, Card, Avatar, Separator } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { PersonIcon, EnvelopeClosedIcon, BadgeIcon } from '@radix-ui/react-icons';

const Profile = () => {
  const { t } = useTranslation();

  // Données factices pour l'exemple
  const user = {
    name: "Mahmoud Saadaoui",
    email: "contact@tamkeen.tn",
    role: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb433?&w=64&h=64&dpr=2&q=70&crop=faces&fit=crop&w=32&h=32"
  };

  return (
    <Container size="2" py="9">
      <Flex direction="column" gap="5">
        <Box>
          <Text size="8" weight="bold">
            {t('profile.title')}
          </Text>
        </Box>

        <Card size="4">
          <Flex direction="column" gap="5" p="2">
            <Flex align="center" gap="4">
              <Avatar 
                size="6" 
                src={user.avatar} 
                fallback="MS" 
                radius="full" 
              />
              <Box>
                <Text size="5" weight="bold" style={{ display: 'block' }}>
                  {user.name}
                </Text>
                <Text size="3" color="gray">
                  {user.role}
                </Text>
              </Box>
            </Flex>

            <Separator size="4" />

            <Flex direction="column" gap="3">
              <Flex align="center" gap="3">
                <PersonIcon width="18" height="18" />
                <Text size="3" weight="medium">{t('profile.name')} :</Text>
                <Text size="3" color="gray">{user.name}</Text>
              </Flex>

              <Flex align="center" gap="3">
                <EnvelopeClosedIcon width="18" height="18" />
                <Text size="3" weight="medium">{t('profile.email')} :</Text>
                <Text size="3" color="gray">{user.email}</Text>
              </Flex>

              <Flex align="center" gap="3">
                <BadgeIcon width="18" height="18" />
                <Text size="3" weight="medium">{t('profile.role')} :</Text>
                <Text size="3" color="gray">{user.role}</Text>
              </Flex>
            </Flex>

            <Box mt="3">
              <Button variant="soft" size="2">
                {t('profile.editButton')}
              </Button>
            </Box>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default Profile;