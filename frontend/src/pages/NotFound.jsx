import { Container, Flex, Box, Text, Button } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Container size="2" py="9">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: '60vh', textAlign: 'center' }} gap="4">
        <Box style={{ color: 'var(--red-9)' }}>
          <ExclamationTriangleIcon width="64" height="64" />
        </Box>
        <Text size="9" weight="bold">
          {t('notFound.title')}
        </Text>
        <Text size="5" weight="medium">
          {t('notFound.heading')}
        </Text>
        <Text size="3" color="gray" style={{ maxWidth: '400px' }}>
          {t('notFound.description')}
        </Text>
        <Box mt="4">
          <Button asChild size="3">
            <Link to="/">{t('notFound.backHome')}</Link>
          </Button>
        </Box>
      </Flex>
    </Container>
  );
};

export default NotFound;
