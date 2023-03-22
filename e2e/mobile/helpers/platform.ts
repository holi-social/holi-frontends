export const itif = (condition: boolean, ...args: Parameters<typeof test>) =>
  condition ? it(...args) : it.skip(...args)
