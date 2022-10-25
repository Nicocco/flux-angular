# @la-clic/ts-flux

Using npm :

```shell
$ npm i @la-clic/ts-flux
```

## Wich version to use

| Angular version    | @la-cli/ts-flux version |
| :-----------------:|:-----------------------:|
| 11                 | 1.0.X                   |
| 12                 | not supported           |
| 13                 | not supported           | 

## Usage
Implementation of  flux partern design in angular. For a full comprehension of flux see [flux page](https://facebook.github.io/flux/)

For using in typescript, create a dispatcher as a singleton for your app by extending Dispatcher class from @la-clic/ts-flux.

```ts
import { Injectable } from "@angular/core";
import { Dispatcher } from "@la-clic/ts-flux";

@Injectable({providedIn: 'root'})
export class AppDispatcher extends Dispatcher {
}
```

Then you need to create stores that extends Store class from ***@a-cli/ts-flux*** and provide an implementation for reduce function.
The reduce function is the entry point of the store that digest event from dispatcher (automaticaly send inside base class @la-clic.ts-flux).

```ts
import { Injectable } from "@angular/core";
import { IPayloadAction, Store } from "@la-clic/ts-flux";
import { AppDispatcher } from "./dispatcher";

@Injectable({ providedIn: 'root' })
export class MenuStore extends Store {

  private _isMenuOpen: IMenuStoreObject;

  private _menuObjectSubject: BehaviorSubject<IMenuStoreObject>
    = new BehaviorSubject<IMenuStoreObject>(this._isMenuOpen);
  public $isMenuOpen: Observable<IMenuStoreObject> = this._menuObjectSubject.asObservable();

  constructor(protected readonly dispatcher: AppDispatcher) {
    super(dispatcher);
  }

  protected reduce(payload: IPayloadAction): void {
    switch (payload.type) {
      default: {
        console.log("default menu store");
        break;
      }
    }
  }
}

```

The IPayloadAction is an interface describing an action send from a view, through the dispatcher, to stores.
Populate the reduce and expose store value with only observable.

## Caution

* do not write public setter in stores
* don't forget to send event after updating store value
