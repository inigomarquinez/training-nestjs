## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

```bash
nest new di
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Commands used

- First, generate the **modules**:

  ```bash
  nest generate module computer
  nest generate module cpu
  nest generate module disk
  nest generate module power
  ```

- Then, generate the **services**:

  ```bash
  nest generate service cpu
  nest generate service power
  nest generate service disk
  ```

- Finally, generate the **controller**:

  ```bash
  nest generate controller computer
  ```

## App diagram

```mermaid
  flowchart TB
    subgraph A[Computer Module]
      subgraph A1[Computer Controller]
        a["run()"]
      end
    end

    subgraph B[CPU Module]
      subgraph B1[CPU Service]
        b["compute()"]
      end
    end

    subgraph C[Disk Module]
      subgraph C1[Disk Service]
        c["getData()"]
      end
    end

    subgraph D[Power Module]
      subgraph D1[Power Service]
        d["supplyPower()"]
      end
    end

    A --> B
    A --> C
    B --> D
    C --> D
```
