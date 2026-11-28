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
      style={{
        minHeight: "50vh",
        width: "100%",
        color: "var(--color-text-muted)",
      }}
    >
      <Spinner size="3" />
      <Text>{message || t("common.loading")}</Text>
    </Flex>
  );
};

export default LoadingState;
