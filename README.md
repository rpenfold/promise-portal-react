# react-promise-portal

![Tests](https://github.com/rpenfold/react-promise-portal/workflows/Test/badge.svg)

Modals in React are difficult for a couple main reasons. (1) They require a lot of boilerplate to set up, and (2) they are typically "fire and forget", so the caller cannot know what was the result of the user's interaction with the modal. PromisePortal solves these problems, and more.

## Installation

For npm:

```bash
npm i react-promise-portal
```

For yarn:

```bash
yarn add react-promise-portal
```

## Usage

First off, you need to mount the portal somewhere in the application. Ideally, it should be close to the root, but below any configuration components like context providers, global error boundaries, etc.

```javascript
import PromisePortal from "react-promise-portal";
// ...
  return (
    <View>
      <PromisePortal />
    </View>
  );
// ...
```

Any components that you show through promise-portal will be mounted here in the view tree.

Now, to show a component:

```javascript
import PromisePortal from "react-promise-portal";
import SomeModal from "./SomeModal";
// ...
  onButtonPress = async () => {
    const result = await PromisePortal.show(SomeModal);

    if (result.cancelled) {
        // ...
    }
  }
// ...
```

And you now have a promise component that can be rendered near the root of the application from anywhere, and the caller knows what the result of the user interaction was!

So how does the caller get the result back? When a component is shown via the promise-portal it injects two props: (1) complete and (2) cancel. These can be though of as resolve and reject. `complete(data)` will resolve the promise-component returning the data payload in the result that will be received by the caller. `cancel()` will reject the promise-component and `cancelled` will be true in the result.

## Best Practices

Because promise-components can be shown imperatively it is possible to invoke them from anywhere in the project. This can be done from reducers, sagas, services, or anywhere else. It is recommended to only invoke promise-components from within React components, and ideally only after interaction from the user.

## Caveats

Since promise-components are being rendered via a promise, the in-going props cannot be updated. In many cases this is acceptable, or even desired behavior, but it is important to be aware of. Components being shown can still manage their own data dependencies internally, but the caller cannot pass down new props. At some point this feature may be added, but I haven't found any use for it yet.
