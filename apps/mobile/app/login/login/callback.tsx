// Deep link holi://login/callback is parsed as path /callback (host=login), so this route
// must exist to handle the OAuth redirect. Same screen as /login/callback.
import { LoginCallback } from '@holi/core/auth/screens/LoginCallback'

export default LoginCallback
