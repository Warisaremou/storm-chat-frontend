export const animations = {
  pageEnter: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },

  modalOverlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 },
  },

  modalContent: {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },

  messageIn: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.15 },
  },

  sidebarSlide: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },

  toastSlide: {
    initial: { opacity: 0, y: 16, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.96 },
    transition: { duration: 0.2 },
  },

  statusPulse: {
    animate: { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] },
    transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  },

  listItem: (index: number) => ({
    initial: { opacity: 0, x: -8 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: index * 0.04, duration: 0.2 },
  }),
} as const;
