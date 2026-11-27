import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

const ErrorState = ({ message, onRetry }) => {
  const { t } = useTranslation();

  return (
    <Card
      role="alert"
      style={{
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <Flex direction="column" align="start" gap="3" p="4">
        <Text color="red">{message || t("errors.generic")}</Text>
        {onRetry && (
          <Button type="button" variant="soft" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        )}
      </Flex>
    </Card>
  );
};

export default ErrorState;
