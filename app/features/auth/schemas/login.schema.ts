export function createLoginSchema(messages: {
  usernameRequired: string
  passwordRequired: string
}) {
  return z.object({
    username: z.string({ error: messages.usernameRequired }).min(1, messages.usernameRequired),
    password: z.string({ error: messages.passwordRequired }).min(1, messages.passwordRequired),
  })
}

export type LoginSchema = z.output<ReturnType<typeof createLoginSchema>>
