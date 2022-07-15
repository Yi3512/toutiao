export const mobileRules = [
  {
    required: true,
    message: '手机号不能为空'
  },
  {
    pattern: /^1[3|5|7|8]\d{9}$/,
    message: '手机号格式错误'
  }
]

export const codeRules = [
  {
    required: true,
    message: '验证码不能为空'
  },
  {
    pattern: /^\d{6}$/,
    message: '验证码格式错误'
  }
]
