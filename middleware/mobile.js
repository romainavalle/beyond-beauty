export default function (ctx) {
  let userAgent
  if(ctx.req) {
    userAgent = ctx.req.headers['user-agent']
  }else if(typeof navigator !== 'undefined') {
    userAgent = navigator.userAgent
  }
  ctx.isMobile = userAgent ? /mobile/i.test(userAgent) : false
}
