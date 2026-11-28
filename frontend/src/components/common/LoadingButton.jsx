import { Button } from "@radix-ui/themes";

const LoadingButton = ({
  children,
  loading = false,
  disabled = false,
  style,
  ...buttonProps
}) => (
  <Button
    {...buttonProps}
    disabled={disabled || loading}
    aria-busy={loading}
    style={{ position: "relative", ...style }}
  >
    <span style={{ visibility: loading ? "hidden" : "visible" }}>
      {children}
    </span>
    {loading && (
      <span className="loading-button__spinner" aria-hidden="true" />
    )}
  </Button>
);

export default LoadingButton;
