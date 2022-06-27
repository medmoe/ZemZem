module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
  globals : {
    'ts-jest' : {
      isolatedModules: true
    }
  },
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest-config/file-mock.js',
    '\\.(css)$': '<rootDir>/jest-config/style-mock.js',
  },
};