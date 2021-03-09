import { IPayloadAction } from "./action.interface";
import { DispatchToken } from "./constants/constantes.model";

export class Dispatcher {

  //#region
  //===========================================================================
  //                                ATTRIBUTS
  //===========================================================================

  private _isDispatching: boolean = false;
  private _isPending: Map<DispatchToken, boolean> = new Map<DispatchToken, boolean>();
  private _isHandled: Map<DispatchToken, boolean> = new Map<DispatchToken, boolean>();
  private _callBacks: Map<DispatchToken, Function> = new Map<DispatchToken, Function>();
  private _lastID: number = 1;
  private _pendingPayload: IPayloadAction = { type: "UNDEFINED" };
  private readonly _prefix: string = "ID_";

  //#region
  //===========================================================================
  //                                METHODES
  //===========================================================================

  constructor() { }

  //#region ----------------------------- GETTERS -----------------------------

  public get isDispatching(): boolean {
    return this._isDispatching;
  }

  //#region ---------------------------- FLUX LOGIC ---------------------------

  /**
   * Register a store to the flux dispatcher.
   * @returns DispatchToken of the new store registered
   */
  public register(callBack: Function): DispatchToken {
    let id: DispatchToken = this._prefix + this._lastID++;
    this._callBacks.set(id, callBack);
    return id;
  }

  /**
   * Unregister a store from the flux dispatcher.
   * @param id DispatchToken of the store
   */
  public unregister(id: DispatchToken): void {
    try {
      this._callBacks.delete(id);
    } catch {
      throw new Error("Disptcher.unrgister(...): " + id + " does not map to a registered callBack");
    }
  }

  /**
   * Wait for the following Dispached action, referenced by their dispatchToken, to be complete
   * before continue.
   * @param ids Sorted List of DispatchToken to wait for
   */
  public waitFor(...ids: Array<DispatchToken>): void {
    if (!this._isDispatching) {
      throw new Error("Dispatcher.waitFor(...): Must be invked while dispatching");
    }

    for (let i = 0; i < ids.length; i++) {
      if (this._isPending.get(ids[i])) {
        if (!this._isHandled.get(ids[i])) {
          throw new Error("Dispatcher.waitFor(...): Circular action dependancy detected while waiting for " + ids[i]);
        }
        continue;
      }

      if (this._callBacks.get(ids[i]) === undefined) {
        throw new Error("Disptcher.waitFor(...): " + ids[i] + " does not map to a registered callBack");
      }

      this._invokeCallBack(ids[i]);
    }
  }

  /**
   * Dispatch an action in order to be handle by evry registered store.
   * @param payload action payload to dispatch
   */
  public dispatch(payload: IPayloadAction): void {
    if (this._isDispatching) {
      throw new Error("Dispatcher.dispatch(...): cannot dispatch in the middle of a dispatch");
    }

    this._startDispatching(payload);
    try {
      let callBackKeys: Array<DispatchToken> = Array.from(this._callBacks.keys()) as Array<DispatchToken>;
      for (var i = 0; i < callBackKeys.length; i++) {
        let id: DispatchToken = callBackKeys[i];
        if (this._isPending.get(id) === true) {
          continue;
        }

        this._invokeCallBack(id);
      }
    } catch(e) {
      throw new Error(e);
    }finally {
      this._stopDispatching();
    }

  }

  private _invokeCallBack(id: DispatchToken): void {
    var callBackToInvoke: Function | undefined = this._callBacks.get(id);

    if (callBackToInvoke === undefined) {

    } else {
      this._isPending.set(id, true);
      callBackToInvoke(this._pendingPayload);
      this._isHandled.set(id, true);

    }
  }

  private _startDispatching(payload: IPayloadAction): void {
    let callBackKeys: Array<DispatchToken> = Array.from(this._callBacks.keys());
    for (var i = 0; i < callBackKeys.length; i++) {
      const id: DispatchToken = callBackKeys[i];
      this._isPending.set(id, false);
      this._isHandled.set(id, false);
    }

    this._pendingPayload = payload;
    this._isDispatching = true;
  }

  private _stopDispatching(): void {
    this._pendingPayload = { type: "UNDEFINED" };
    this._isDispatching = false;
  }

  //#endregion

  //#endregion

  //#endregion
}
