import { Button, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

const Pagination = ({ pagination, onPageChange }) => {
  const { t } = useTranslation();

  if (!pagination || pagination.pages <= 1) {
    return null;
  }

  return (
    <Flex align="center" justify="between" wrap="wrap" gap="3" mt="4">
      <Text size="2" color="gray">
        {pagination.page} / {pagination.pages}
      </Text>
      <Flex gap="2">
        <Button
          type="button"
          size="2"
          variant="soft"
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          {t("common.previous")}
        </Button>
        <Button
          type="button"
          size="2"
          variant="soft"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          {t("common.next")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Pagination;
