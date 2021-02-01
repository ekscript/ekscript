# Modules in Ekscript

Refer [ts-modules](https://typescriptlang.org/docs/handbook/modules)

# Differences from typescript:

1. No side-effect imports
2. No support for AMD/CommonJS exports/imports

# Specification

## Exporting a declaration

Any declaration, variable, function, class, type alias or interface

```ts
export interface StringValidator {
    isAcceptable(s: string): boolean;
}
```

## Export statements

```typescript
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```

## Re-Exports

```typescript
export { ZipCodeValidator as RegExpBasedZipCodeValidator } from "./ZipCodeValidator";
```

## Imports

```typescript
import { ZipCodeValidator } from "./ZipCodeValidator";
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
import * as validator from "./ZipCodeValidator";

```

## Side-effect free import


This will declare all variables, function declarations, etc etc.
Default import will not be import as a variable `default` 

```typescript
import * from 'my-module.js'
```

## Import Types

Explicit type imports for better readability and compiler check
```typescript
import type { APIResponseType } from "./api";
```

## Default exports

```typescript
export default module;
export default function (s: string) {
  return s.length === 5 && numberRegexp.test(s);
}
export default '123';

```

## Re exports

```typescript
export * as utils from './utils';
export { utilExp as default } from './utils2';
```

