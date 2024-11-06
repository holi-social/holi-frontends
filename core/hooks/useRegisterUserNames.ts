import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client/core'
import { z } from 'zod'

import { useErrorHandling } from '@holi/core/errors/hooks'

const registerUserNamesMutation = gql`
  mutation RegisterUserNamesMutation($input: UpdateAuthenticatedUserInput!) {
    updateAuthenticatedUserV2(input: $input) {
      id
      fullName
      firstName
      lastName
      identity
    }
  }
`

export const RegisterUserNamesInputSchema = z.object({
  firstName: z.string().min(2, { message: 'minCharacters---2' }).max(192, { message: 'maxCharacters---192' }),
  lastName: z.string().max(192, { message: 'maxCharacters---192' }).optional(),
})

interface RegisterUserNamesInput {
  input: z.infer<typeof RegisterUserNamesInputSchema>
}

interface RegisterUserNamesResponse {
  updateAuthenticatedUserV2: {
    id: string
    firstName: string
    fullName: string
    lastName?: string
  }
}

export const useRegisterUserNames = () => {
  const { displayError } = useErrorHandling()
  const [registerUserNames] = useMutation<RegisterUserNamesResponse, RegisterUserNamesInput>(
    registerUserNamesMutation,
    {
      onError: (error) =>
        displayError(error, 'Failed to register user names', {
          location: 'useRegisterUserNames',
        }),
    }
  )

  return {
    parseRegisterUserNamesInput: <UserInput>(input: UserInput) => RegisterUserNamesInputSchema.parse(input),
    registerUserNames,
  }
}
