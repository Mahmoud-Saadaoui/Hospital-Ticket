import { Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { getSpecialtyLabel } from "../../utils/specialties";

const SpecialtyFilter = ({ specialties, value, onChange }) => {
  const { t } = useTranslation();

  return (
    <label style={{ display: "grid", gap: "0.5rem", maxWidth: "24rem" }}>
      <Text size="2" weight="medium">
        {t("patient.specialties")}
      </Text>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          minHeight: "2.5rem",
          paddingInline: "0.75rem",
          border: "1px solid var(--color-border)",
          borderRadius: "0.5rem",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
        }}
      >
        <option value="">{t("common.search")}</option>
        {specialties.map((specialty) => (
          <option key={specialty} value={specialty}>
            {getSpecialtyLabel(specialty, t)}
          </option>
        ))}
      </select>
    </label>
  );
};

export default SpecialtyFilter;
