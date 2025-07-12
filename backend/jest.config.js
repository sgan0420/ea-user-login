module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/controllers/**/*.ts',
    'src/services/**/*.ts', 
    'src/dao/**/*.ts',
    'src/middleware/**/*.ts',
    'src/utils/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 40,
      functions: 60,
      lines: 55
    }
  }
};
