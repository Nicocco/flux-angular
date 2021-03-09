type Action = string;
export interface IPayloadAction {
  /**
   * Action type
   */
  type: Action;

  /**
   * Optional data pass with the action
   */
  data?: any;

  /**
   * Optional params to pass with the action
   */
  params?: any;
}
