# Mortgage Rate React Typescript app

Single page app that allows a user to select a mortgage product, create an application for that product, and update the application with their contact information.

### Install and running the project

Installing and running the project is as simple as running

```sh
npm i && npm run dev
```

### Testing the project

Testing is also just a command away:

```sh
yarn test
 PASS  src/components/ui/__tests__/Button.test.tsx
 PASS  src/components/page/__tests__/Intro.test.tsx

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   2 passed, 2 total
Time:        2.145s, estimated 3s
```

### Writing tests with [vitest](https://vitest.dev) and [testing-library](https://testing-library.com/docs/react-testing-library)

We've created test examples with vitest in `src/components/pages/__tests__` and `src/components/uis/__tests__`. Since react is component oriented, we've designed to focus on writing test in same level of directory with component. You can simply run `yarn test` to test if it succeeds and look more closer opening the source.
