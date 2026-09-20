export type DoseOption = { dose: string; amount: string };
const doses = (values: string[]): DoseOption[] => values.map(dose => ({ dose: `${dose} mg`, amount: "" }));
// Catalog is for recording the user's existing product, never for selecting a treatment.
// Sources and scope: MEDICATION-CATALOG.md. Volume is per administration, not per pen.
export const doseOptions: Record<string, DoseOption[]> = {
  Ozempic: doses(["0,25", "0,5", "1", "2"]),
  Mounjaro: ["2,5", "5", "7,5", "10", "12,5", "15"].flatMap(dose =>
    ["0,5 ml", "0,6 ml"].map(amount => ({ dose: `${dose} mg`, amount }))),
  Wegovy: doses(["0,25", "0,5", "1", "1,7", "2,4", "7,2"]),
  Rybelsus: doses(["1,5", "3", "4", "7", "9", "14"]),
  Saxenda: doses(["0,6", "1,2", "1,8", "2,4", "3"]),
};
export const doseOptionKey = (option: DoseOption) => `${option.dose}|${option.amount}`;
export const doseOptionLabel = (option: DoseOption) => option.dose + (option.amount ? ` / ${option.amount}` : "");
