# no-package-lock

> Makes sure you will not have package.lock in your project

# Usage

```bash
npm install -g no-package-lock
no-package-lock
```

This will append `package-lock=false` to `.npmrc`, and `package-lock.json` to `.gitignore`.
This will also remove any existing `package-lock.json`
