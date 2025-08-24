

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email: string, password: string }>(event)

  if (email === 'goldmen.solutions@gmail.com' && password === 'iamtheadmin') {
    // set the user session in the cookie
    // this server util is auto-imported by the auth-utils module
    await setUserSession(event, {
      user: {
        name: 'bonface Muthoni'
      }
    })
    return {}
  }
  throw createError({
    statusCode: 401,
    message: 'Bad credentials'+ email +password
  })
})

