# `String#replaceAll` polyfill for TypeScript

This package includes the [core-js](https://github.com/zloirock/core-js) polyfill for `String#replaceAll`, along with TypeScript typings.

The `replaceAll` function is defined in [this TC39 proposal](https://github.com/tc39/proposal-string-replaceall).

## Installation

```sh
npm install --save ts-replace-all
```

## Usage

```typescript
import 'ts-replace-all'

'test'.replaceAll('t', '1')
'test'.replaceAll('t', () => '2')
'test'.replaceAll(/t/g, '3')
'test'.replaceAll(/t/g, () => '4')
```

## API

The API specification is available in [the TC39 proposal](https://github.com/tc39/proposal-string-replaceall).
