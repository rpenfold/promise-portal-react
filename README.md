![Tests](https://github.com/rpenfold/promise-portal-react/workflows/Test/badge.svg)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/1e7ba17c5d534a81aa6abdb168dc5b08)](https://www.codacy.com/gh/rpenfold/promise-portal-react/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=rpenfold/promise-portal-react&amp;utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/rpenfold/promise-portal-react/branch/master/graph/badge.svg?token=t9DZ2i0Ccr)](https://codecov.io/gh/rpenfold/promise-portal-react)
[![npm version](https://badge.fury.io/js/promise-portal-react.svg)](https://badge.fury.io/js/promise-portal-react)

Modals in React are difficult for a couple main reasons. (1) They require a lot of boilerplate to set up, and (2) they are typically "fire and forget", so the caller cannot know what was the result of the user's interaction with the modal. PromisePortal solves these problems, and more.

## Installation

For npm:

```bash
npm i promise-portal-react
```

For yarn:

```bash
yarn add promise-portal-react
```

## Getting Started

First off, you need to mount the portal provider somewhere in the application. Ideally, it should be close to the root, but below any configuration components like context providers, global error boundaries, etc.

```javascript
import PromisePortal from "promise-portal-react";
// ...
  return (
    <View>
      <PromisePortal.Provider>
        // ...
      </PromisePortal.Provider>
    </View>
  );
// ...
```

Any components that you show through promise-portal will be mounted here in the view tree.

## Usage

Now, to show a component using the `usePromisePortal` hook:

```javascript
import { usePromisePortal } from "react-promise-portal";
import SomeModal from "./SomeModal";

function MyComponent(props) {
  const { showPortalAsync } = usePromisePortal();
  const onButtonPress = async () => {
    const result = await showPortalAsync(SomeModal);
  }

  return (
    <Button onPress={onButtonPress}>
      Press me!
    </Button>
  );
}

export default MyComponent;
```

or using class-based components via the `withPromisePortal` HOC:

```javascript
import { withPromisePortal } from "promise-portal-react";

class MyComponent extends React.Component {
  onButtonPress = async () => {
    const result = await this.props.showPortalAsync(SomeModal);
  }

  render() {
    <Button onPress={this.onButtonPress}>
      Press me!
    </Button>
  }
}

export default withPromisePortal(MyComponent);
```

And you now you can render a component near the root of the application from anywhere, and the caller knows what the result of the user interaction was!

So how does the caller get the result back? When a component is shown via the promise-portal it injects two props: (1) complete and (2) cancel. These can be though of as resolve and reject. `complete(data)` will resolve the promise-component returning the data payload in the result that will be received by the caller. `cancel()` will reject the promise-component and `cancelled` will be true in the result.

## Portal component

Sometimes you don't want to call to show the component imperatively. Sometimes you just want to want to render the component just like any other component, but have it mount at a different part of the component tree. You can do that as well:

```javascript
import { Portal } from "promise-portal-react";

function MyComponent() {
  return (
    <Portal>
      <SomeModal />
    </Portal>
  );
}
```

| Prop | Type | Description | Default |
|---|---|---|---|
| closeStrategy | 'cancel', 'requestClose' | The method to use when closing the portal. `cancel` will clear the portal immediately, `requestClose` toggles the component's `open` prop for orchestrating close transistions. | 'cancel' |

## Why use promise portal?

Frequently we just want to pop up a dialog or modal to get feedback from the user. Traditional modals in React require quite a bit of boilerplate, and in many scenarios it is difficult to get the result of the user interaction back to the caller. You can think of promise portals as an asynchronous method for getting user input. Of course you can use it as a simplified API for presenting modals as well.

## Caveats

Since promise-components are being rendered via a promise, the in-going props cannot be updated. In many cases this is acceptable, or even desired behavior, but it is important to be aware of. Components being shown can still manage their own data dependencies internally, but the caller cannot pass down new props. At some point this feature may be added, but I haven't found any use for it yet.

## When my button is tapped twice rapidly it shows multiple portals

This is because each button press dispatches a separate portal. There are a few ways to address this. Of course you could track some state to know if the modal is open, but that was one of the things we were trying to avoid. You could also add a debounce to the button press handler to prevent users from mashing the button. Lastly, simply provide a `key` prop to when showing the portal. Portals attempting to be shown while another portal with a duplicate key are ignored.
