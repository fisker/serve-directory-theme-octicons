module.exports = {
  plugins: ['add-module-exports'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '0.8',
        },
      },
    ],
  ],
}
