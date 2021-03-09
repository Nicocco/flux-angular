# @lgm-clic/ts-flux

Using npm :

```shell
$ npm i @lgm-clic/ts-flux
```

## Usage
Implementation of  flux partern design in angular. For a full comprehension of flux see [flux page](https://facebook.github.io/flux/)

For using in typescript, create a dispatcher as a singleton for your app by extending Dispatcher class from @lgm-clic/ts-flux.

```ts
import { Injectable } from "@angular/core";
import { Dispatcher } from "ts-flux";

@Injectable({providedIn: 'root'})
export class AppDispatcher extends Dispatcher {
}
```

Then you need to create stores that extends Store class from ***@lgm-cli/ts-flux*** and provide an implementation for reduce function.
The reduce function is the entry point of the store that digest event from dispatcher (automaticaly send inside base class @lgm-clic.ts-flux).

```ts
import { Injectable } from "@angular/core";
import { IPayloadAction, Store } from "ts-flux";
import { AppDispatcher } from "./dispatcher";

@Injectable({ providedIn: 'root' })
export class MenuStore extends Store {

  private _isMenuOpen: boolean = false;

  private _isMenuOpenSubject: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(this._isMenuOpen);
  public $isMenuOpen: Observable<boolean> = this._isMenuOpenSubject.asObservable();

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
* don't forget to send event after updating store values with _attributSubject.next(newValue)
