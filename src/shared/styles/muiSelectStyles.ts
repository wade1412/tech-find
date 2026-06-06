import { type Theme } from "@mui/material/styles";

export const selectStyle = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    width: "100%",

    // Input Container
    "& .MuiOutlinedInput-root": {
      fontFamily: '"Inter", system-ui, sans-serif',
      borderRadius: "0.75rem", //rounded-xl from tailwind
      backgroundColor: isDark ? "rgba(24, 24, 27, 0.5)" : "#ffffff", // bg-zinc-800/50 or bg-white
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

      // border-default
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: isDark ? "rgba(39, 39, 42, 0.6)" : "#e4e4e7", // border-zinc-700/60 or border-zinc-200
        transition: "border-color 0.15s ease",
      },

      // Hover State (hover:border-zinc-300 / 600 )
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: isDark ? "#52525b" : "#d4d4d8",
      },
      // Focus State
      "&.Mui-focused": {
        boxShadow: isDark
          ? "0 0 0 1px rgba(250, 204, 21, 0.15)"
          : "0 0 0 1px rgba(234, 179, 8, 0.12)",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isDark ? "#facc15" : "#eab308",
          borderWidth: "1px",
        },
      },
    },

    // Label
    "& .MuiInputLabel-root": {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSize: "0.875rem",
      color: isDark ? "#a1a1aa" : "#52525b", // text-secondary
      "&.Mui-focused": {
        color: isDark ? "#facc15" : "#eab308",
      },
    },

    // Chips
    "& .MuiChip-root": {
      borderRadius: "0.5rem", // rounded-lg
      fontWeight: 500,
      fontFamily: '"Inter", system-ui, sans-serif',
    },

    // Disabled State
    "& .MuiOutlinedInput-root.Mui-disabled": {
      backgroundColor: isDark ? "rgba(39, 39, 42, 0.2)" : "#fafafa",
      "& .MuiOutlinedInput-notchedOutline": {
        borderStyle: "dashed !important",
        borderColor: isDark ? "#27272a !important" : "#e4e4e7 !important",
      },
      "& .MuiAutocomplete-endAdornment": {
        display: "none", // hide arrow on disabled
      },
    },
  };
};

export const selectSlotPropsStyle = (theme: Theme) => {
  const isDark = theme.palette.mode === "dark";

  return {
    borderRadius: "0.5rem", // rounded-lg
    fontWeight: 500,
    fontFamily: '"Inter", system-ui, sans-serif',
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

    // BG
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    color: isDark ? "#facc15" : "#eab308",

    // border-main-500
    borderColor: isDark ? "rgba(250, 204, 21, 0.5)" : "rgba(234, 179, 8, 0.6)",
    borderWidth: "1px",
    borderStyle: "solid",

    // Delete
    "& .MuiChip-deleteIcon": {
      color: isDark ? "rgba(250, 204, 21, 0.5)" : "rgba(234, 179, 8, 0.6)",
      fontSize: "14px",
      transition: "color 0.15s ease",
      "&:hover": {
        color: isDark ? "#facc15" : "#eab308",
        backgroundColor: isDark
          ? "rgba(250, 204, 21, 0.15)"
          : "rgba(234, 179, 8, 0.15)",
        borderRadius: "50%",
      },
    },
  };
};
