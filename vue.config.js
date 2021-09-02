module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/pdf-resume-builder/'
    : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
