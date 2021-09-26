![Tests](https://github.com/rpenfold/react-promise-portal/workflows/Test/badge.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/764ac4b03e3340e39a9041ba50fb7727)](https://app.codacy.com/manual/rpenfold/react-promise-portal?utm_source=github.com&utm_medium=referral&utm_content=rpenfold/react-promise-portal&utm_campaign=Badge_Grade_Dashboard)
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

## Why use promise portal?

Frequently we just want to pop up a dialog or modal to get feedback from the user. Traditional modals in React require quite a bit of boilerplate, and in many scenarios it is difficult to get the result of the user interaction back to the caller. You can think of promise portals as an asynchronous method for getting user input. Of course you can use it as a simplified API for presenting modals as well.

## Caveats

Since promise-components are being rendered via a promise, the in-going props cannot be updated. In many cases this is acceptable, or even desired behavior, but it is important to be aware of. Components being shown can still manage their own data dependencies internally, but the caller cannot pass down new props. At some point this feature may be added, but I haven't found any use for it yet.
