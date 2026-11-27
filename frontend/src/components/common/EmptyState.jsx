import { Card, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

const EmptyState = ({ message }) => {
  const { t } = useTranslation();

  return (
    <Card
      role="status"
      style={{
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface-muted)",
      }}
    >
      <Flex align="center" justify="center" p="5">
        <Text color="gray">{message || t("common.empty")}</Text>
      </Flex>
    </Card>
  );
};

export default EmptyState;
