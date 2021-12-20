# bhnb-react

[BHNB](https://github.com/pngwna/bhnb) rewrite using React and Canvas(Konva)

## Usage

See `demo/`

```jsx
import React from "react"
import { Projection } from "bhnb-react"

export const App: React.FC = (props) => <Projection anim={true} />
```

## To build (esm / commonjs)

```shell
export YOUR_WANTED_MINIMUM_MAGNITUDE=5.0
python scripts/preprocess-hyg-database.py $YOUR_WANTED_MINIMUM_MAGNITUDE
npm run build
```
