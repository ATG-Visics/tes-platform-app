#!/usr/bin/env node

const nodeVersion = parseFloat(process.versions.node);

if (!(nodeVersion >= 16 && nodeVersion < 17)) {
  throw Error(
    `Unsupported node version. Please use 16.x.x instead of "${process.versions.node}".`,
  );
}
