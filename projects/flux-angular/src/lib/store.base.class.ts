import { IPayloadAction } from "./action.interface";
import { DispatchToken } from "./constants/constantes.model";
import { Dispatcher } from "./dispatcher.base.class";

export abstract class Store {

  //#region
  //===========================================================================
  //                                ATTRIBUTS
  //===========================================================================

  private _dispatchToken: DispatchToken = undefined;

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

  public get dispatchToken(): DispatchToken {
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
