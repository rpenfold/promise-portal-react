# react-promise-portal

![Tests](https://github.com/rpenfold/react-promise-portal/workflows/Test/badge.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/764ac4b03e3340e39a9041ba50fb7727)](https://app.codacy.com/manual/rpenfold/react-promise-portal?utm_source=github.com&utm_medium=referral&utm_content=rpenfold/react-promise-portal&utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/rpenfold/react-promise-portal/branch/master/graph/badge.svg)](https://codecov.io/gh/rpenfold/react-promise-portal)
[![npm version](https://badge.fury.io/js/%40lyv%2Freact-promise-portal.svg)](https://badge.fury.io/js/%40lyv%2Freact-promise-portal)

Modals in React are difficult for a couple main reasons. (1) They require a lot of boilerplate to set up, and (2) they are typically "fire and forget", so the caller cannot know what was the result of the user's interaction with the modal. PromisePortal solves these problems, and more.

## Installation

For npm:

```bash
npm i @lyv/react-promise-portal
```

For yarn:

```bash
yarn add @lyv/react-promise-portal
```

## Usage

First off, you need to mount the portal somewhere in the application. Ideally, it should be close to the root, but below any configuration components like context providers, global error boundaries, etc.

```javascript
import PromisePortal from "@lyv/react-promise-portal";
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

## Advanced Usage

### Component Registry

Registering a component with promise-portal allows you to later show that component by calling show with the specified key instead of the React component:

```javascript
import { ComponentRegistry }  from "@lyv/react-promise-portal";
import MyComponent from "./MyComponent";
//...
ComponentRegistry.register("myComponent", MyComponent);
//...
  onButtonPress = async () => {
    const result = await PromisePortal.show("myComponent");
    // ...
  }
// ...
```

You can also register a collection of components using `ComponentRegistry.registerCollection(collection)` where collection is an object whose keys are the the component key, and whose values are the React component to register.

### Queuing

Promise-portal utilizes a stack to support queuing of promise-components. This helps prevent things like modals from appearing on top of each other, and can be used for orchestration of flows. Once the promise-component on the bottom of the stack is completed, then next one will display.

By default, only the component at the bottom of the stack will be displayed, though you can force a component to display using the `forceShow` option of the component configuration;
