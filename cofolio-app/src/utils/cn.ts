export const cn = (...xs: (string | undefined | false | null | 0)[]) =>
  xs.filter(Boolean).join(' ')
