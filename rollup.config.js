import replace from '@rollup/plugin-replace'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: 'dist/index.mjs',
      format: 'esm',
    },
  ],
  plugins: [
    replace({
      './assets': '../.cache/assets',
      delimiters: ['', ''],
      preventAssignment: true,
    }),
  ],
}
