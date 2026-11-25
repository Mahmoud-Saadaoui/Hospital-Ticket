import { Container, Flex, Box, Text, Link, Separator } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      asChild
      style={{
        borderTop: '1px solid var(--gray-a5)',
        backgroundColor: 'var(--color-background)',
        marginTop: 'auto',
      }}
    >
      <footer>
        <Container size="4" px="4" py="5">
          <Flex
            direction={{ initial: 'column', sm: 'row' }}
            align="center"
            justify="between"
            gap="4"
          >
            {/* Nom de l'app et Copyright */}
            <Flex align="center" gap="2">
              <Text size="2" weight="bold">
                {t('header.appName')}
              </Text>
              <Text size="2" color="gray">
                © {currentYear} — {t('footer.rights')}
              </Text>
            </Flex>

            {/* Liens utiles */}
            <Flex align="center" gap="4">
              <Link href="#" size="2" color="gray" underline="hover">
                {t('footer.privacy')}
              </Link>
              <Separator orientation="vertical" size="1" />
              <Link href="#" size="2" color="gray" underline="hover">
                {t('footer.terms')}
              </Link>
              <Separator orientation="vertical" size="1" />
              <Link href="#" size="2" color="gray" underline="hover">
                {t('footer.contact')}
              </Link>
            </Flex>
          </Flex>
        </Container>
      </footer>
    </Box>
  );
};

export default Footer;
