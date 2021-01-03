import { IPayloadAction } from "./action.interface";

export class Dispatcher {

  //#region
  //===========================================================================
  //                                ATTRIBUTS
  //===========================================================================

  private _isDispatching: boolean = false;
  private _isPending: Map<string, boolean> = new Map<string, boolean>();
  private _isHandled: Map<string, boolean> = new Map<string, boolean>();
  private _callBacks: Map<string, Function> = new Map<string, Function>();
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

  public register(callBack: Function): string {
    let id = this._prefix + this._lastID++;
    this._callBacks.set(id, callBack);
    return id;
  }

  public unregister(id: string): void {
    try {
      this._callBacks.delete(id);
    } catch {
      throw new Error("Disptcher.unrgister(...): " + id + " does not map to a registered callBack");
    }
  }

  public waitFor(...ids: Array<string>): void {
    if (!this._isDispatching) {
      throw new Error("Dispatcher.waitFor(...): Must be invked while dispatching");
    }

    for (var id in ids) {
      if (this._isPending.get(id)) {
        if (this._isHandled.get(id)) {
          throw new Error("Dispatcher.waitFor(...): Circular action dependancy detected while waiting for " + id);
        }
        continue;
      }

      if (this._callBacks.get(id) === undefined) {
        throw new Error("Disptcher.unrgister(...): " + id + " does not map to a registered callBack");
      }

      this._invokeCallBack(id);
    }
  }

  public dispatch(payload: IPayloadAction): void {
    if (this._isDispatching) {
      throw new Error("Dispatcher.dispatch(...): cannot dispatch in the middle of a dispatch");
    }

    this._startDispatching(payload);
    try {
      let callBackKeys: Array<string> = Array.from(this._callBacks.keys()) as Array<string>;
      for (var i = 0; i < callBackKeys.length; i++) {
        let id: string = callBackKeys[i];
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

  private _invokeCallBack(id: string): void {
    var callBackToInvoke: Function | undefined = this._callBacks.get(id);

    if (callBackToInvoke === undefined) {

    } else {
      this._isPending.set(id, true);
      callBackToInvoke(this._pendingPayload);
      this._isHandled.set(id, true);

    }
  }

  private _startDispatching(payload: IPayloadAction): void {
    for (var id in this._callBacks) {
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
