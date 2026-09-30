import { useFormContext } from "react-hook-form";

export default function SelectorFormacion() {
  const { register } = useFormContext();

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Formación Inicial</h3>
      <select {...register("formacion", { required: true })}>
        <option value="defensiva">Defensiva</option>
        <option value="ofensiva">Ofensiva</option>
        <option value="C-formacion">C-formación</option>
        <option value="D-formacion">D-formación</option>
      </select>
    </div>
  );
}