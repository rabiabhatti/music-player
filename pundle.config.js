const path = require('path')
const presetDefault = require('pundle-preset-default')

const pundleConfig = {
  entry: ['./src', './index.html'],
  components: presetDefault({
    transform: {
      babel: 7,
      postcss: {
        plugins: [require('autoprefixer')],
        extensions: ['.css', '.less'],
      },
    },
  }),
  rootDirectory: __dirname,
  output: {
    rootDirectory: path.join(__dirname, 'dist'),
  },
}

module.exports = pundleConfig
