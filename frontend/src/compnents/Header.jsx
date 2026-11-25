import { 
  Container, 
  Flex, 
  Box, 
  Text, 
  Button, 
  IconButton, 
  DropdownMenu, 
  Avatar,
  Separator
} from '@radix-ui/themes';
import { 
  HamburgerMenuIcon, 
  Cross2Icon, 
  GearIcon, 
  GlobeIcon, 
  SunIcon, 
  MoonIcon, 
  DesktopIcon,
  PersonIcon,
  ExitIcon
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useTheme from '../hooks/useTheme';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const isAuthenticated = true

  //  Switch Theme
  const { setTheme } = useTheme();
  const onThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  const onLanguageChange = (lng) => {
    i18n.changeLanguage(lng)
  }

  const onLogout = () => {
    console.log("logout")
  }
  return (
    <Box 
      asChild 
      style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <header>
        <Container size="4" px="4">
          <Flex align="center" justify="between" py="3">
            
            {/* 1. Logo / Nom de l'app */}
            <Flex align="center" gap="2">
              <Text weight="bold" size="5">
                {t('header.appName')}
              </Text>
            </Flex>

            {/* 3. Actions Desktop (À droite) */}
            <Flex gap="3" align="center" display={{ initial: 'none', md: 'flex' }}>
              
              {/* Icône Paramètres (Roue dentée) */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <IconButton
                    variant="ghost"
                    color="gray"
                    size="2"
                    aria-label={t('header.settings')}
                  >
                    <GearIcon width="18" height="18" />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content size="2" style={{ minWidth: 180 }}>
                  
                  {/* Sous-menu Thème */}
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>
                      <SunIcon width="16" height="16" style={{ marginInlineEnd: 8 }} />
                      {t('header.theme')}
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent >
                      <DropdownMenu.Item onClick={() => onThemeChange?.('light')}>
                        <SunIcon width="14" height="14"  /> {t('header.light')} 
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => onThemeChange?.('dark')}>
                        <MoonIcon width="14" height="14"  /> {t('header.dark')} 
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => onThemeChange?.('system')}>
                        <DesktopIcon width="14" height="14"  /> {t('header.system')} 
                      </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>

                  {/* Sous-menu Langue */}
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>
                      <GlobeIcon width="16" height="16" style={{ marginInlineEnd: 8 }} />
                      {t('header.language')}
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                      <DropdownMenu.Item onClick={() => onLanguageChange?.('fr')}>
                        Français {i18n.language === 'fr' && '✓'}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => onLanguageChange?.('en')}>
                        English {i18n.language === 'en' && '✓'}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => onLanguageChange?.('ar')}>
                        العربية {i18n.language === 'ar' && '✓'}
                      </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>

                </DropdownMenu.Content>
              </DropdownMenu.Root>

              <Separator orientation="vertical" size="2" style={{ height: 20 }} />

              {/* Affichage conditionnel : Connecté vs Non connecté (Desktop) */}
              {isAuthenticated ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <Avatar 
                        size="2" 
                        src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb433?&w=64&h=64&dpr=2&q=70&crop=faces&fit=crop&w=32&h=32" 
                        fallback="MS" 
                        radius="full"
                      />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content size="2" style={{ minWidth: 190 }}>
                    
                    <DropdownMenu.Item>
                      <Link to="/profile"><PersonIcon width="14" height="14" style={{ marginInlineEnd: 8 }} /> {t('header.profile')}</Link>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator />

                    <DropdownMenu.Item color="red" onClick={onLogout}>
                       <ExitIcon width="14" height="14" style={{ marginInlineEnd: 8 }} /> {t('header.logout')}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              ) : (
                <Flex gap="2" align="center">
                  <Button variant="ghost" color="gray">
                    <Link to="/login">{t('header.login')}</Link>
                  </Button>
                  <Button variant="solid">
                    <Link to="/register">{t('header.register')}</Link>
                  </Button>
                </Flex>
              )}
            </Flex>

            {/* Menu Mobile */}
            <Box display={{ md: 'none' }}>
              <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenu.Trigger>
                  <IconButton variant="ghost" color="gray" size="3">
                    {isOpen ? <Cross2Icon width="20" height="20" /> : <HamburgerMenuIcon width="20" height="20" />}
                  </IconButton>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content variant="soft" size="2" style={{ minWidth: 220 }}>
                  
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>
                       <GearIcon width="14" height="14" style={{ marginInlineEnd: 6 }} /> {t('header.settings')}
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                       <DropdownMenu.Item onClick={() => onThemeChange?.('light')}>{t('header.light')}</DropdownMenu.Item>
                       <DropdownMenu.Item onClick={() => onThemeChange?.('dark')}>{t('header.dark')}</DropdownMenu.Item>
                       <DropdownMenu.Item onClick={() => onThemeChange?.('system')}>{t('header.system')}</DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>

                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>
                       <GlobeIcon width="14" height="14" style={{ marginInlineEnd: 6 }} /> {t('header.language')}
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                      <DropdownMenu.Item onClick={() => onLanguageChange?.('fr')}>Français</DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => onLanguageChange?.('en')}>English</DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => onLanguageChange?.('ar')}>العربية</DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>

                  <DropdownMenu.Separator />

                  {isAuthenticated ? (
                    <>
                      <DropdownMenu.Item ><Link to="/profile">{t('header.profile')}</Link></DropdownMenu.Item>
                      <DropdownMenu.Item color="red" onClick={onLogout}>{t('header.logout')}</DropdownMenu.Item>
                    </>
                  ) : (
                    <>
                      <DropdownMenu.Item color="gray"><Link to="/login">{t('header.login')}</Link></DropdownMenu.Item>
                      <DropdownMenu.Item color="indigo"><Link to="/register">{t('header.register')}</Link></DropdownMenu.Item>
                    </>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Box>

          </Flex>
        </Container>
      </header>
    </Box>
  );
};
