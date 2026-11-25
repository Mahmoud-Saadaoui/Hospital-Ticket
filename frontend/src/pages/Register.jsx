import { useState } from 'react';
import { Container, Flex, Box, Text, TextField, Button, Card, Link as RadixLink } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PersonIcon, EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, password });
    // Logique d'inscription ici, puis redirection
    navigate('/login');
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
                <Box>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '6px' }}>
                    {t('auth.nameLabel')}
                  </Text>
                  <TextField.Root 
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  >
                    <TextField.Slot>
                      <PersonIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Box>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '6px' }}>
                    {t('auth.emailLabel')}
                  </Text>
                  <TextField.Root 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  >
                    <TextField.Slot>
                      <EnvelopeClosedIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Box>
                  <Text size="2" weight="medium" style={{ display: 'block', marginBottom: '6px' }}>
                    {t('auth.passwordLabel')}
                  </Text>
                  <TextField.Root 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  >
                    <TextField.Slot>
                      <LockClosedIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>

                <Button type="submit" size="3" style={{ width: '100%', marginTop: '12px' }}>
                  {t('auth.registerButton')}
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
