import type { Variants } from "motion/react";

export const softLayoutTransition = {
  layout: { duration: 0.18, ease: "easeOut" },
} as const;

export const fadePresenceMotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.16, ease: "easeOut" },
} as const;

export const listItemPresenceMotionProps = {
  initial: { opacity: 0, scale: 0.98, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -4 },
  transition: { duration: 0.16, ease: "easeOut" },
} as const;

export const heightRevealMotionProps = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.18, ease: "easeOut" },
  style: { overflow: "hidden" },
} as const;

export const technicianListVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.02 },
  },
};

export const technicianCardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};
