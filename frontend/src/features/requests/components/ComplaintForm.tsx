import { RequestForm } from "./RequestForm";
import { formText } from "../model/request.types";

export function ComplaintForm() {
    return <RequestForm kind="complaint" readDetails={data => ({ items: [], complaint: {
        type: formText(data, 'type'), document: formText(data, 'document'), address: formText(data, 'address'),
        product: formText(data, 'product'), amount: formText(data, 'amount'), request: formText(data, 'request'), guardian: formText(data, 'guardian'),
    } })}>
        <div className="co-form-grid">
            <label>Tipo *<select name="type"><option>Reclamo</option><option>Queja</option></select></label>
            <label>DNI / CE / Pasaporte *<input name="document" required minLength={6} maxLength={20} pattern="[a-zA-Z0-9-]{6,20}" /></label>
            <label>Domicilio *<input name="address" required maxLength={300} autoComplete="street-address" /></label>
            <label>Bien o servicio contratado *<input name="product" required maxLength={500} /></label>
            <label>Monto reclamado (S/) *<input name="amount" type="number" min="0" max="999999999" step="0.01" required defaultValue="0" /></label>
            <label>Representante (si eres menor de edad)<input name="guardian" maxLength={300} placeholder="Nombre, documento y contacto" /></label>
        </div>
        <label>Pedido concreto del consumidor *<textarea name="request" required maxLength={1500} rows={3} /></label>
    </RequestForm>;
}
