import replace from '@rollup/plugin-replace'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [
    replace({
      './assets': '../.cache/assets',
      delimiters: ['', ''],
    }),
  ],
}
