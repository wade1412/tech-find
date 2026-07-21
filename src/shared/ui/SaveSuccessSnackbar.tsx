import { Alert, Snackbar } from "@mui/material";

interface SaveSuccessSnackbarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SaveSuccessSnackbar({ isOpen, onClose }: SaveSuccessSnackbarProps) {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      slotProps={{ transition: { timeout: 180 } }}
    >
      <Alert
        severity="success"
        onClose={onClose}
        sx={(theme) => ({
          alignItems: "center",
          borderRadius: "14px",
          backdropFilter: "blur(12px)",
          color: theme.palette.mode === "dark" ? "#f4f4f5" : "#18181b",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 16px 40px rgba(0, 0, 0, 0.35)"
              : "0 16px 40px rgba(24, 24, 27, 0.12)",
        })}
      >
        Changes saved
      </Alert>
    </Snackbar>
  );
}

export default SaveSuccessSnackbar;
