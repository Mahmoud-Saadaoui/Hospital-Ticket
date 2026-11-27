import { Flex, Spinner, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

const LoadingState = ({ message }) => {
  const { t } = useTranslation();

  return (
    <Flex
      align="center"
      justify="center"
      gap="3"
      role="status"
      aria-live="polite"
      style={{ minHeight: "8rem", color: "var(--color-text-muted)" }}
    >
      <Spinner />
      <Text>{message || t("common.loading")}</Text>
    </Flex>
  );
};

export default LoadingState;
