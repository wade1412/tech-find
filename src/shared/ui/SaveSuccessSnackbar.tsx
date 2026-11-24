import { Alert, Slide, Snackbar, type SlideProps } from "@mui/material";

interface SaveSuccessSnackbarProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

function SlideUpTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function SaveSuccessSnackbar({
  isOpen,
  message,
  onClose,
}: SaveSuccessSnackbarProps) {
  return (
    <Snackbar
      open={isOpen}
      onClose={(_, reason) => {
        if (reason === "clickaway") return;
        onClose();
      }}
      autoHideDuration={3500}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      slots={{ transition: SlideUpTransition }}
      slotProps={{ transition: { timeout: 180 } }}
      sx={{ maxWidth: { sm: 400 }, bottom: { xs: 50, sm: 50 } }}
    >
      <Alert
        severity="success"
        role="status"
        sx={(theme) => ({
          width: "100%",
          minWidth: { sm: 280 },
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 16px",
          borderRadius: "12px",
          border: "1px solid #e4e4e7",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          color: "#18181b",
          fontFamily: "var(--font-heading)",
          fontSize: "1rem",
          fontWeight: 600,
          borderColor: theme.palette.mode === "dark" ? "#18181b" : "#f4f4f5",
          backdropFilter: "blur(12px)",
          boxShadow: "0 16px 40px rgba(24, 24, 27, 0.12)",
          "& .MuiAlert-icon": { color: "#059669" },
          ...theme.applyStyles("dark", {
            borderColor: "#27272a", // zinc-800
            backgroundColor: "rgba(24, 24, 27, 0.85)", // zinc-900
            color: "#f4f4f5",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
            "& .MuiAlert-icon": { color: "#34d399" },
          }),
        })}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SaveSuccessSnackbar;
