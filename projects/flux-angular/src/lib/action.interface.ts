type Action = string;
export interface IPayloadAction {
  /**
   * Le type d'action à réaliser.
   */
  type: Action;

  /**
   * Donnée optionnelle de l'action à réaliser.
   */
  data?: any;

  /**
   * Paramètre obtionnelle de l'action à réaliser.
   */
  params?: any;
}
