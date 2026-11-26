import { useState } from 'react';
import { Container, Flex, Box, Text, TextField, Button, Card, Link as RadixLink } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PersonIcon, EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';
import useAuth from '../hooks/useAuth';
import getApiError from '../utils/apiError';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await register({ name, email, phone, password });
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(
        getApiError(error, t('errors.generic')).message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="1" py="9">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: '70vh' }}>
        <Card size="4" style={{ width: '100%', maxWidth: '420px' }}>
          <Box p="4">
            <Text size="6" weight="bold" as="h1" style={{ marginBottom: '24px', textAlign: 'center' }}>
              {t('auth.registerTitle')}
            </Text>

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                {errorMessage && (
                  <Text color="red" role="alert">
                    {errorMessage}
                  </Text>
                )}
                <Box>
                  <Text
                    as="label"
                    htmlFor="register-name"
                    size="2"
                    weight="medium"
                    style={{ display: 'block', marginBottom: '6px' }}
                  >
                    {t('auth.nameLabel')}
                  </Text>
                  <TextField.Root 
                    id="register-name"
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  >
                    <TextField.Slot>
                      <PersonIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Box>
                  <Text
                    as="label"
                    htmlFor="register-phone"
                    size="2"
                    weight="medium"
                    style={{ display: 'block', marginBottom: '6px' }}
                  >
                    {t('auth.phoneLabel')}
                  </Text>
                  <TextField.Root
                    id="register-phone"
                    type="tel"
                    placeholder="+216 00 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </Box>

                <Box>
                  <Text
                    as="label"
                    htmlFor="register-email"
                    size="2"
                    weight="medium"
                    style={{ display: 'block', marginBottom: '6px' }}
                  >
                    {t('auth.emailLabel')}
                  </Text>
                  <TextField.Root 
                    id="register-email"
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  >
                    <TextField.Slot>
                      <EnvelopeClosedIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Box>
                  <Text
                    as="label"
                    htmlFor="register-password"
                    size="2"
                    weight="medium"
                    style={{ display: 'block', marginBottom: '6px' }}
                  >
                    {t('auth.passwordLabel')}
                  </Text>
                  <TextField.Root 
                    id="register-password"
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  >
                    <TextField.Slot>
                      <LockClosedIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Button
                  type="submit"
                  size="3"
                  style={{ width: '100%', marginTop: '12px' }}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting
                    ? t('common.loading')
                    : t('auth.registerButton')}
                </Button>
              </Flex>
            </form>

            <Flex justify="center" mt="5" gap="2">
              <Text size="2" color="gray">{t('auth.hasAccount')}</Text>
              <RadixLink asChild size="2">
                <Link to="/login">{t('auth.signinLink')}</Link>
              </RadixLink>
            </Flex>
          </Box>
        </Card>
      </Flex>
    </Container>
  );
};

export default Register;
