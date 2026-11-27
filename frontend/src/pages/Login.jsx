import { useState } from 'react';
import { Container, Flex, Box, Text, TextField, Button, Card, Link as RadixLink } from '@radix-ui/themes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';
import useAuth from '../hooks/useAuth';
import { getApiErrorMessage } from "../utils/apiError";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login({ email, password });
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t("errors.invalidCredentials"), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="1" py="9">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: '70vh' }}>
        <Card size="4" style={{ width: '100%', maxWidth: '420px' }}>
          <Box p="4">
            <Text size="6" weight="bold" as="h1" style={{ marginBlockEnd: '24px', textAlign: 'center' }}>
              {t('auth.loginTitle')}
            </Text>

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                {errorMessage && (
                  <Text color="red" role="alert" aria-live="assertive" id="login-error">
                    {errorMessage}
                  </Text>
                )}
                <Box>
                  <Text
                    as="label"
                    htmlFor="login-email"
                    size="2"
                    weight="medium"
                     style={{ display: 'block', marginBlockEnd: '6px' }}
                  >
                    {t('auth.emailLabel')}
                  </Text>
                  <TextField.Root 
                    id="login-email"
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    aria-describedby={errorMessage ? "login-error" : undefined}
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
                    htmlFor="login-password"
                    size="2"
                    weight="medium"
                     style={{ display: 'block', marginBlockEnd: '6px' }}
                  >
                    {t('auth.passwordLabel')}
                  </Text>
                  <TextField.Root 
                    id="login-password"
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    aria-describedby={errorMessage ? "login-error" : undefined}
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
                   style={{ width: '100%', marginBlockStart: '12px' }}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting
                    ? t('common.loading')
                    : t('auth.loginButton')}
                </Button>
              </Flex>
            </form>

            <Flex justify="center" mt="5" gap="2">
              <Text size="2" color="gray">{t('auth.noAccount')}</Text>
              <RadixLink asChild size="2">
                <Link to="/register">{t('auth.signupLink')}</Link>
              </RadixLink>
            </Flex>
          </Box>
        </Card>
      </Flex>
    </Container>
  );
};

export default Login;
