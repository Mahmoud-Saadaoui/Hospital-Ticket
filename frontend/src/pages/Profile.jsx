import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Container,
  Flex,
  Separator,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { EnvelopeClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import useAuth from "../hooks/useAuth";
import { useUpdateUser, useUploadUserImage } from "../hooks/useUsers";
import getApiError from "../utils/apiError";

const MAX_IMAGE_SIZE = 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const updateUser = useUpdateUser();
  const uploadUserImage = useUploadUserImage();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(
    user?.profilePhoto?.url || ""
  );
  const [localError, setLocalError] = useState("");

  const initials =
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  if (!user) {
    return (
      <Container size="2" py="9">
        <Text role="status">{t("common.empty")}</Text>
      </Container>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    try {
      await updateUser.mutateAsync({
        userId: user.id,
        payload: { name, email, phone, password },
      });
      setPassword("");
    } catch (error) {
      setLocalError(getApiError(error, t("errors.generic")).message);
    }
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      file.size > MAX_IMAGE_SIZE ||
      !ACCEPTED_IMAGE_TYPES.includes(file.type)
    ) {
      setLocalError(
        `${t("upload.maxSize")} ${t("upload.invalidFormat")}`
      );
      return;
    }

    setLocalError("");

    try {
      const response = await uploadUserImage.mutateAsync(file);
      setProfilePhoto(response?.data?.profilePhoto?.url || profilePhoto);
    } catch (error) {
      setLocalError(getApiError(error, t("errors.generic")).message);
    }
  };

  return (
    <Container size="2" py={{ initial: "6", sm: "9" }}>
      <Flex direction="column" gap="5">
        <Text size={{ initial: "7", sm: "8" }} weight="bold" as="h1">
          {t("profile.title")}
        </Text>

        <Card
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Flex direction="column" gap="5" p="4">
            <Flex align="center" gap="4">
              <Avatar size="6" src={profilePhoto} fallback={initials} radius="full" />
              <Flex direction="column" gap="1">
                <Text size="5" weight="bold">
                  {name}
                </Text>
                <Text color="gray">
                  {user?.isAdmin ? t("header.admin") : t("profile.patient")}
                </Text>
              </Flex>
            </Flex>

            <Separator size="4" />

            {localError && (
              <Text color="red" role="alert">
                {localError}
              </Text>
            )}

            <label>
              <Text size="2" weight="medium">
                {t("upload.chooseImage")}
              </Text>
              <input
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={handlePhotoChange}
                disabled={uploadUserImage.isPending}
                style={{ display: "block", marginBlockStart: "0.5rem" }}
              />
            </label>

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <label>
                  <Text size="2" weight="medium">{t("profile.name")}</Text>
                  <TextField.Root
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  >
                    <TextField.Slot><PersonIcon /></TextField.Slot>
                  </TextField.Root>
                </label>

                <label>
                  <Text size="2" weight="medium">{t("profile.email")}</Text>
                  <TextField.Root
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  >
                    <TextField.Slot><EnvelopeClosedIcon /></TextField.Slot>
                  </TextField.Root>
                </label>

                <label>
                  <Text size="2" weight="medium">{t("profile.phone")}</Text>
                  <TextField.Root
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="tel"
                    required
                  />
                </label>

                <label>
                  <Text size="2" weight="medium">{t("profile.password")}</Text>
                  <TextField.Root
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </label>

                <Button
                  type="submit"
                  disabled={updateUser.isPending}
                  aria-busy={updateUser.isPending}
                >
                  {updateUser.isPending
                    ? t("common.loading")
                    : t("common.save")}
                </Button>
              </Flex>
            </form>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default Profile;
