import { Container, Flex, Box, Text, Card } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Container size="3" py="9">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: '60vh' }}>
        <Card size="4" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <Box py="6">
            <Text size="8" weight="bold" as="h1" style={{ marginBottom: '16px' }}>
              {t('home.welcome')}
            </Text>
            <br/>
            <Text size="3" color="gray">
              {t('header.appName')} — {t('header.language') === 'اللغة' ? 'مرحباً بك في منصتك' : 'Welcome to your platform'}
            </Text>
          </Box>
        </Card>
      </Flex>
    </Container>
  );
};

export default Home;
