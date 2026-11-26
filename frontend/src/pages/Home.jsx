import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
} from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSpecialties } from '../hooks/useDoctors';
import getApiError from '../utils/apiError';

const Home = () => {
  const { t } = useTranslation();
  const specialtiesQuery = useSpecialties();
  const specialties = specialtiesQuery.data?.data?.specialties ?? [];
  const errorMessage = specialtiesQuery.error
    ? getApiError(specialtiesQuery.error, t('errors.generic')).message
    : '';

  return (
    <Container size="4" py={{ initial: '6', sm: '9' }}>
      <Flex direction="column" gap={{ initial: '6', sm: '8' }}>
        <Card
          size="4"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Flex
            direction={{ initial: 'column', md: 'row' }}
            align={{ initial: 'start', md: 'center' }}
            justify="between"
            gap="6"
            p={{ initial: '4', sm: '6' }}
          >
            <Flex direction="column" gap="3" style={{ maxWidth: 620 }}>
              <Badge color="gray" size="2" style={{ width: 'fit-content' }}>
                {t('header.appName')}
              </Badge>
              <Heading size={{ initial: '7', sm: '8' }} as="h1">
                {t('patient.homeTitle')}
              </Heading>
              <Text size="3" color="gray">
                {t('home.welcome')}
              </Text>
              <Button asChild size="3" style={{ width: 'fit-content' }}>
                <Link to="/doctors">{t('patient.bookAppointment')}</Link>
              </Button>
            </Flex>
            <Text
              size={{ initial: '6', sm: '8' }}
              weight="bold"
              style={{
                color: 'var(--color-primary)',
                textAlign: 'center',
              }}
            >
              {t('patient.doctors')}
            </Text>
          </Flex>
        </Card>

        <Flex direction="column" gap="4">
          <Heading size="6" as="h2">
            {t('patient.specialties')}
          </Heading>

          {specialtiesQuery.isLoading && (
            <Text role="status" aria-live="polite">
              {t('common.loading')}
            </Text>
          )}

          {specialtiesQuery.isError && (
            <Card
              role="alert"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Text color="red">{errorMessage}</Text>
            </Card>
          )}

          {!specialtiesQuery.isLoading &&
            !specialtiesQuery.isError &&
            specialties.length === 0 && (
              <Text color="gray">{t('common.empty')}</Text>
            )}

          {specialties.length > 0 && (
            <Grid
              columns={{ initial: '1', sm: '2', lg: '4' }}
              gap={{ initial: '3', sm: '4' }}
            >
              {specialties.map((specialty) => (
                <Card
                  key={specialty}
                  asChild
                  style={{
                    backgroundColor: 'var(--color-surface-muted)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Link
                    to={`/doctors?specialty=${encodeURIComponent(specialty)}`}
                    style={{
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                    }}
                  >
                    <Flex direction="column" gap="2" p="4">
                      <Text size="4" weight="bold">
                        {specialty}
                      </Text>
                      <Text size="2" color="gray">
                        {t('patient.doctors')}
                      </Text>
                    </Flex>
                  </Link>
                </Card>
              ))}
            </Grid>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};

export default Home;
