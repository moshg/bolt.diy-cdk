# bold.diy CDK

## Deploying

Create a `.env` file based on `.env.sample`.

```sh
cp .env.sample .env
```

bootstrap the stack

```sh
pnpm cdk bootstrap --profile <profile>
```

synthesize the stack

```sh
pnpm cdk synth --profile <profile>
```

deploy the stack

```sh
pnpm cdk deploy --profile <profile>
```


## Useful commands

* `pnpm run build`   compile typescript to js
* `pnpm run watch`   watch for changes and compile
* `pnpm run test`    perform the jest unit tests
* `pnpm cdk deploy`  deploy this stack to your default AWS account/region
* `pnpm cdk diff`    compare deployed stack with current state
* `pnpm cdk synth`   emits the synthesized CloudFormation template
