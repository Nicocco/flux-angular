import { IPayloadAction } from "./action.interface";
import { Dispatcher } from "./dispatcher.base.class";

export type dispatchToken = string | undefined;
export abstract class Store {

  //#region
  //===========================================================================
  //                                ATTRIBUTS
  //===========================================================================

  private _dispatchToken: dispatchToken = undefined;

  //#region
  //===========================================================================
  //                                METHODES
  //===========================================================================

  constructor(protected readonly appDispatcher: Dispatcher) {
    this._dispatchToken = this.appDispatcher.register((payload: IPayloadAction) => {
      this._invokeOnDispatch(payload);
    } );
  }

  //#region ----------------------------- GETTERS -----------------------------

  public get dispatchToken(): dispatchToken {
    return this._dispatchToken;
  }

  //#endregion

  //#region ------------------------- OTHER METHODES --------------------------

  private _invokeOnDispatch(payload: IPayloadAction): void {
    this.reduce(payload);
  }

  protected abstract reduce(payload: IPayloadAction): void;

  //#endregion

  //#endregion

}
