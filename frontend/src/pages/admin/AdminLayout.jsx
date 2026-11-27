import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AdminLayout = () => {
  const { t } = useTranslation();

  const links = [
    { to: "/admin", label: t("admin.dashboard") },
    { to: "/admin/doctors", label: t("admin.doctors") },
    { to: "/admin/users", label: t("admin.users") },
    { to: "/admin/appointments", label: t("admin.appointments") },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar" aria-label={t("admin.navigation")}>
        <Flex direction="column" gap="4">
          <Box className="admin-sidebar__heading">
            <Heading size="5" as="h1">
              {t("header.admin")}
            </Heading>
            <Text size="2" color="gray">
              {t("admin.subtitle")}
            </Text>
          </Box>
          <nav className="admin-sidebar__nav">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin"}
                className={({ isActive }) =>
                  isActive
                    ? "admin-sidebar__link is-active"
                    : "admin-sidebar__link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </Flex>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
